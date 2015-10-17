module CodeGenerator.CodeDom {
    
    export interface ITypescriptTypeParameter {
        generateParameter(typeParameter: CodeGenerator.CodeDom.TypeInfo): string;
    }

    export class TypescriptTypeParameter implements ITypescriptTypeParameter {

        private typescriptTypeMapper: ITypescriptTypeMapper;

        constructor (typescriptTypeMapper: ITypescriptTypeMapper) {
            this.typescriptTypeMapper = typescriptTypeMapper;
        }

        public generateParameter(typeParameter: CodeGenerator.CodeDom.TypeInfo): string {
            var typeParameterConstraint = "";

            if (typeParameter.typeArguments.length > 0) {
                var constraint = typeParameter.typeArguments.first();
                var type = this.typescriptTypeMapper.getTypeOutput(constraint);
                typeParameterConstraint = " extends " + type;
            }
            return typeParameter.name + typeParameterConstraint;
        }
    }

}