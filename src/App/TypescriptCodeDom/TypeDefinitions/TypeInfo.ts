module CodeGenerator.CodeDom {
    export class TypeInfo {
        name: string;
        fullName: string;
        namespace: string;
        baseType: TypeInfo;
        isEnum: boolean;
        isInterface: boolean;
        isArray: boolean;
        arrayElementType: CodeDom.TypeInfo;
        typeArguments: Array<TypeInfo>;
        properties: Array<CodeGenerator.CodeDom.PropertyInfo>;
        methods: Array<CodeGenerator.CodeDom.MethodInfo>;
    }
}