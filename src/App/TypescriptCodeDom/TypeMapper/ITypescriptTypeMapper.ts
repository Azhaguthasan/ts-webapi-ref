module CodeGenerator.CodeDom {
    export interface ITypescriptTypeMapper {
        getTypeOutput(type: CodeGenerator.CodeDom.TypeInfo): string;
        isValidTypeForDerivation(type: CodeGenerator.CodeDom.TypeInfo): boolean;
        isCollectionType(type: CodeGenerator.CodeDom.TypeInfo): boolean;
    }
}