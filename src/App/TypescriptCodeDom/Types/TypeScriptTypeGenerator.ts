module CodeGenerator.CodeDom {

    export interface ITypescriptTypeGenerator {
        generateType(type: CodeGenerator.CodeDom.TypeInfo): string;
    }

    export class TypescriptTypeGenerator {
        private typescriptTypeParameter: ITypescriptTypeParameter;
        private typescriptMemberGenerator: ITypescriptMemberGenerator;
        private typescriptTypeMapper: ITypescriptTypeMapper;
        private os: any;

        constructor(
            typescriptTypeMapper: ITypescriptTypeMapper,
            typescriptMemberGenerator: ITypescriptMemberGenerator,
            typescriptTypeParameter: ITypescriptTypeParameter) {

            this.typescriptTypeParameter = typescriptTypeParameter;
            this.typescriptMemberGenerator = typescriptMemberGenerator;
            this.typescriptTypeMapper = typescriptTypeMapper;
            this.os = require("os");

        }

        public generateType(typeInfo: CodeGenerator.CodeDom.TypeInfo): string {
            var typeString = this.getType(typeInfo);
            var hasNamespace = typeInfo.namespace !== undefined && typeInfo.namespace.length > 0;
            return hasNamespace ? this.wrapWithModule(typeInfo, typeString) : typeString;
        }

        private getType(typeInfo: CodeGenerator.CodeDom.TypeInfo): string {

            var hasNamespace = typeInfo.namespace !== undefined && typeInfo.namespace.length > 0;
            var indentLevel = hasNamespace ? 1 : 0;
            var accessModifier = hasNamespace ? "export " : "";
            var typeName = typeInfo.name;
            var typeOfType = this.getTypeOfType(typeInfo);                       
            
            var membersCollections= "";
            if (typeInfo.properties != null && typeInfo.properties.hasAny()) {
                var members = typeInfo.properties.map((property: CodeGenerator.CodeDom.PropertyInfo) => {
                    return this.typescriptMemberGenerator.generateMember(property);
                });
                membersCollections = this.os.EOL + this.getIndentTabs(indentLevel + 1) + members.join(this.os.EOL + this.getIndentTabs(indentLevel + 1)) + this.os.EOL;
            }
            
            var methodsCollections = "";
            if (typeInfo.methods != null && typeInfo.methods.hasAny()) {
                var methods = typeInfo.methods.map((method: CodeGenerator.CodeDom.MethodInfo) => {
                    return this.typescriptMemberGenerator.generateMethod(method, indentLevel + 1);
                });                
                methodsCollections = this.os.EOL + this.getIndentTabs(indentLevel + 1) + methods.join(this.os.EOL + this.getIndentTabs(indentLevel + 1)) + this.os.EOL;
            }                        
            
            var typeParametersExpression = "";
            if (typeInfo.typeArguments != null && typeInfo.typeArguments.hasAny()) {
                var typeParameters = typeInfo.typeArguments.map(parameter => this.typescriptTypeParameter.generateParameter(parameter));
                if (typeParameters.hasAny()) {
                    typeParametersExpression = "<" + typeParameters.join(", ") + ">";
                }
            }
            
            var baseTypeExpression = "";

            if (!typeInfo.isEnum && typeInfo.baseType !== undefined) {
                if (this.typescriptTypeMapper.isValidTypeForDerivation(typeInfo.baseType)) {
                    baseTypeExpression = " extends " + this.typescriptTypeMapper.getTypeOutput(typeInfo.baseType);
                } 
            }            

            return this.getIndentTabs(indentLevel)
                + accessModifier + typeOfType + typeName + typeParametersExpression + baseTypeExpression + " {"
                + membersCollections 
                + methodsCollections 
                + this.getIndentTabs(indentLevel) + "}";
        }

        private getIndentTabs(level: number): string {

            var indent = "";

            for (var i = 0; i < level; i++) {
                indent += "\t";
            }

            return indent;
        }

        private getTypeOfType(typeInfo: CodeGenerator.CodeDom.TypeInfo): string {
            return typeInfo.isEnum 
                ? "enum " 
                : typeInfo.isInterface 
                    ? "interface "  
                    : "class ";
        }

        private wrapWithModule(typeInfo: CodeGenerator.CodeDom.TypeInfo, typeString: string): string {
            return "module " + typeInfo.namespace + " {" + this.os.EOL
                + typeString + this.os.EOL
                + "}" + this.os.EOL;
        }
    }
}