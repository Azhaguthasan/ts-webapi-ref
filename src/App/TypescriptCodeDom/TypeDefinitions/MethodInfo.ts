module CodeGenerator.CodeDom {
    export class MethodInfo {
        name: string;
        parameters: Array<CodeGenerator.CodeDom.ParameterDescription>;
        returnType: CodeGenerator.CodeDom.TypeInfo;
        statements: Array<string>;
        isConstructor: boolean;
    }
}