module CodeGenerator.CodeDom {
    export class PropertyInfo {
        name: string;
        type: CodeGenerator.CodeDom.TypeInfo;
        isEnumMember: boolean;
        enumValue: number;
    }
}