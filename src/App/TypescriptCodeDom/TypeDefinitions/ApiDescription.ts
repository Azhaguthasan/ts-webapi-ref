namespace CodeGenerator.CodeDom {
    export class ApiDescription {
        httpMethod: string;
        relativePath: string;
        actionName: string;
        controllerName: string;
        parameterDescriptions: Array<CodeGenerator.CodeDom.ParameterDescription>;
        responseType: CodeGenerator.CodeDom.TypeInfo;
    }
}