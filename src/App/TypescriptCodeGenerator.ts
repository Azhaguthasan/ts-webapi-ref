module CodeGenerator.Generator {

    export class TypescriptCodeGenerator {
        private typescriptTypeMapper: CodeDom.ITypescriptTypeMapper;
        private typescriptTypeGenerator: CodeDom.ITypescriptTypeGenerator;
        private filesystem: any;
        private types: Array<CodeDom.TypeInfo>;

        constructor(typescriptTypeGenerator: CodeDom.ITypescriptTypeGenerator, typescriptTypeMapper: CodeDom.ITypescriptTypeMapper) {
            this.typescriptTypeMapper = typescriptTypeMapper;
            this.typescriptTypeGenerator = typescriptTypeGenerator;
            this.filesystem = require("fs");
            this.types = new Array<CodeDom.TypeInfo>();
        }

        public generateCode(args: Args, apiDescriptions: Array<CodeDom.ApiDescription>) {

            var referenceContent = "";

            var fileName = args.fileName;
            var apiSuffix = args.apiSuffix;
            var module = args.module;
            var generateOnlyTypes = args.generateOnlyTypes;
            var generateTypesAsInterface = args.generateTypesAsInterface;

            apiDescriptions.forEach((api: CodeDom.ApiDescription, index: number, allApis: Array<CodeDom.ApiDescription>): void => {
                this.populateTypes(api);
            });

            if (generateTypesAsInterface) {
                this.convertToInterfaces();
            }

            referenceContent += this.generateTypes();

            if (!generateOnlyTypes) {
                referenceContent += this.generateServices(apiDescriptions, apiSuffix, module);
            }

            this.filesystem.writeFileSync(fileName, referenceContent);

        }

        private convertToInterfaces() {
            this.types
                .filter((type: CodeDom.TypeInfo) => {
                    return this.typescriptTypeMapper.isValidTypeForDerivation(type);
                })
                .forEach((type: CodeDom.TypeInfo) => {
                    type.name = "I" + type.name;
                    type.fullName = type.namespace + "." + type.name;
                });
        }

        private generateServices(apiDescriptions: Array<CodeDom.ApiDescription>, apiSuffix: string, module: string): string {

            var referenceContent = "";
            var apiGroups = apiDescriptions.groupBy((item: CodeDom.ApiDescription) => {
                return item.controllerName;
            });

            apiGroups.forEach((group: Array<CodeDom.ApiDescription>, index: number, array: Array<Array<CodeDom.ApiDescription>>) => {
                referenceContent += this.generateInterface(group, apiSuffix, module);
                referenceContent += this.generateImplementation(group, apiSuffix, module);
            });

            return referenceContent;
        }

        private populateTypes(apiDescription: CodeDom.ApiDescription): void {

            var responseTypes = this.getTypeInfos(apiDescription.responseType);
            this.types.pushRange(responseTypes);

            if (apiDescription.parameterDescriptions !== null && apiDescription.parameterDescriptions.hasAny()) {
                apiDescription.parameterDescriptions.forEach((parameter: CodeDom.ParameterDescription) => {
                    var paramterTypes = this.getTypeInfos(parameter.type);
                    this.types.pushRange(paramterTypes);
                });
            }
        }

        private generateTypes(): string {

            var typesOutput = "";

            var typeGroups = this.types.groupBy((type: CodeDom.TypeInfo): string => {
                return type.name;
            });

            var uniqueTypes = typeGroups
                .map((group: Array<CodeDom.TypeInfo>): CodeDom.TypeInfo => {
                    return group.first();
                })
                .filter((value: CodeDom.TypeInfo) => {
                    return value.fullName !== null && value.fullName.indexOf("System") === -1;
                });

            if (uniqueTypes !== null && uniqueTypes.hasAny()) {
                uniqueTypes.forEach((type: CodeDom.TypeInfo) => {
                    var typeString = this.typescriptTypeGenerator.generateType(type);
                    typesOutput += typeString;
                });
            }

            return typesOutput;
        }

        private getTypeInfos(typeInfo: CodeDom.TypeInfo): Array<CodeDom.TypeInfo> {

            var types = new Array<CodeDom.TypeInfo>();

            if (typeInfo === null)
                return types;

            types.push(typeInfo);

            if (typeInfo.typeArguments !== null && typeInfo.typeArguments.hasAny()) {
                typeInfo.typeArguments.forEach((typeArgument: CodeDom.TypeInfo) => {
                    var typeArgumentDependentTypes = this.getTypeInfos(typeArgument);
                    types.pushRange(typeArgumentDependentTypes);
                });
            }

            if (typeInfo.properties !== null && typeInfo.properties.hasAny()) {
                typeInfo.properties.forEach((property: CodeDom.PropertyInfo) => {
                    var propertyDependentTypes = this.getTypeInfos(property.type);
                    types.pushRange(propertyDependentTypes);
                });
            }

            return types;
        }

        private generateInterface(apiDescriptions: Array<CodeDom.ApiDescription>, apiSuffix: string, module: string): string {

            var interfaceTypeInfo = new CodeDom.TypeInfo();

            var firstApi = apiDescriptions.first();
            interfaceTypeInfo.namespace = module;
            interfaceTypeInfo.name = "I" + firstApi.controllerName + apiSuffix;
            interfaceTypeInfo.fullName = module + "." + interfaceTypeInfo.name;
            interfaceTypeInfo.methods = new Array<CodeDom.MethodInfo>();

            apiDescriptions.forEach((api: CodeDom.ApiDescription) => {
                var methodInfo = new CodeDom.MethodInfo();
                methodInfo.name = api.actionName;
                methodInfo.parameters = api.parameterDescriptions;

                var returnType = new CodeDom.TypeInfo();
                returnType.typeArguments = new Array<CodeDom.TypeInfo>();
                returnType.typeArguments.push(api.responseType);
                returnType.name = "IPromise";
                returnType.namespace = "angular";
                returnType.fullName = returnType.namespace + "." + returnType.name;

                methodInfo.returnType = returnType;
                interfaceTypeInfo.methods.push(methodInfo);
            });

            return this.typescriptTypeGenerator.generateType(interfaceTypeInfo);
        }

        private generateImplementation(apiDescriptions: Array<CodeDom.ApiDescription>, apiSuffix: string, module: string): string {

            var implementationTypeInfo = new CodeDom.TypeInfo();

            var firstApi = apiDescriptions.first();
            implementationTypeInfo.namespace = module;
            implementationTypeInfo.name = firstApi.controllerName + apiSuffix;
            implementationTypeInfo.fullName = module + "." + implementationTypeInfo.name;
            implementationTypeInfo.methods = new Array<CodeDom.MethodInfo>();

            var constructorInfo = new CodeDom.MethodInfo();
            constructorInfo.name = "constructor";
            constructorInfo.isConstructor = true;
            constructorInfo.parameters = new Array<CodeDom.ParameterDescription>();
            var httpServiceInfo = new CodeDom.ParameterDescription();
            httpServiceInfo.name = "private $httpService";
            httpServiceInfo.type = new CodeDom.TypeInfo();
            httpServiceInfo.type.name = "IHttpService";
            httpServiceInfo.type.namespace = "angular";
            httpServiceInfo.type.fullName = httpServiceInfo.type.namespace + "." + httpServiceInfo.type.name;
            constructorInfo.parameters.push(httpServiceInfo);

            implementationTypeInfo.methods.push(constructorInfo);

            apiDescriptions.forEach((api: CodeDom.ApiDescription) => {
                var methodInfo = new CodeDom.MethodInfo();
                methodInfo.name = api.actionName;
                methodInfo.parameters = api.parameterDescriptions;

                var returnType = new CodeDom.TypeInfo();
                returnType.typeArguments = new Array<CodeDom.TypeInfo>();
                returnType.typeArguments.push(api.responseType);
                returnType.name = "IPromise";
                returnType.namespace = "angular";
                returnType.fullName = returnType.namespace + "." + returnType.name;
                methodInfo.returnType = returnType;

                methodInfo.statements = this.getStatements(api);

                implementationTypeInfo.methods.push(methodInfo);
            });

            return this.typescriptTypeGenerator.generateType(implementationTypeInfo);
        }

        private getStatements(api: CodeDom.ApiDescription): Array<string> {
            var statements = new Array<string>();

            statements.push("var httpServiceRequest = {");
            statements.push("\tmethod: \"" + api.httpMethod + "\",");
            statements.push("\turl: \"" + api.relativePath + "\",");
            statements.push("\tdata: {");
            api.parameterDescriptions.forEach((parameter: CodeDom.ParameterDescription) => {
                statements.push("\t\t" + parameter.name + ": " + parameter.name + ",")
            })
            statements.push("\t}");
            statements.push("};")

            statements.push("var promise = this.$httpService(httpServiceRequest)");
            statements.push("\t.then((httpServiceResponse: angular.IHttpPromiseCallbackArg<" + this.typescriptTypeMapper.getTypeOutput(api.responseType) + ">) => {");
            statements.push("\t\treturn httpServiceResponse.data;");
            statements.push("\t});");
            statements.push("return promise;")

            return statements;
        }

    }


}