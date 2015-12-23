module CodeGenerator.CodeDom {

    export interface ITypescriptMemberGenerator {
        generateMember(property: CodeGenerator.CodeDom.PropertyInfo): string;
        generateMethod(method: CodeGenerator.CodeDom.MethodInfo, indentLevel: number): string;
    }

    export class TypescriptMemberGenerator {
        private typescriptTypeMapper: ITypescriptTypeMapper;
        private os: any;
        
        constructor(typescriptTypeMapper: ITypescriptTypeMapper) {
            this.typescriptTypeMapper = typescriptTypeMapper;
            this.os = require("os");
        }

        public generateMember(property: CodeGenerator.CodeDom.PropertyInfo): string {

            var camelCaseName = this.convertPascalCaseToCamelCase(property.name);

            if (property.isEnumMember) {
                return camelCaseName + " = " + property.enumValue + ",";
            }
                
            if (property.hasValue) {
                return camelCaseName 
                    + ": " 
                    + this.typescriptTypeMapper.getTypeOutput(property.type) 
                    + " = "
                    + property.value;                    
            }
            
            return camelCaseName + ": " + this.typescriptTypeMapper.getTypeOutput(property.type) + ";";
        }

        public generateMethod(method: CodeGenerator.CodeDom.MethodInfo, indentLevel: number): string {

            var camelCaseName = this.convertPascalCaseToCamelCase(method.name);
                        
            var parametersCollection = "";                       
            if (method.parameters && method.parameters.hasAny()) {
                var parameters = method.parameters.map((parameter: ParameterDescription) => {
                    return this.generateParameter(parameter);
                });
                parametersCollection = parameters.join(", ");
            }
                                                                    
            var returnType = !method.returnType ? "void" : this.typescriptTypeMapper.getTypeOutput(method.returnType);
            
            if (method.statements && method.statements.hasAny()) {
                var tabs = this.getIndentTabs(indentLevel+1);
                var tabsAfter = this.getIndentTabs(indentLevel);
                var statementsCollection = method.statements.join(this.os.EOL + tabs);
                return camelCaseName + "(" + parametersCollection + "): " + returnType + "{" + this.os.EOL + tabs + statementsCollection + this.os.EOL + tabsAfter + "}" + this.os.EOL; 
            }

            if (method.isConstructor){
                var tabs = this.getIndentTabs(indentLevel);
                return "constructor(" + parametersCollection + ") {" + this.os.EOL +  tabs + "}";
            }

            return camelCaseName + ": (" + parametersCollection + ") => " + returnType + ";";
        }
        
        private getIndentTabs(level: number): string {
            var indent = "";
            for (var i = 0; i < level; i++) {
                indent += "\t";
            }
            return indent;
        }

        private generateParameter(parameter: CodeDom.ParameterDescription): string {            
            var parameterName = this.convertPascalCaseToCamelCase(parameter.name);      
            var parameterType = this.typescriptTypeMapper.getTypeOutput(parameter.type);            
            return parameterName + ": " + parameterType;            
        }

        public convertPascalCaseToCamelCase(name: string): string {
            if (!name || name.length <= 0)
                return "";

            var firstChar = name[0].toString().toLowerCase();

            return firstChar + name.substr(1, name.length - 1);
        }
    }
}