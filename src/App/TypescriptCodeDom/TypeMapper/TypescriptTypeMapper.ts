module CodeGenerator.CodeDom {

    export class TypescriptTypeMapper implements ITypescriptTypeMapper {
        private typeMap: any;
        private baseTypeRegex: RegExp = /(([a-zA-Z]+[0-9.]*)+)/;
        private arrayRegex = /^([a-zA-Z0-9\.]+)(?:[`0-9]*)\[((?:\]\[)*|(?:,)*)\]$/;

        constructor() {
            this.typeMap = {};
            this.addAllKnownTypes();
        }

        private addAllKnownTypes() {
            this.typeMap["System.Int32"] = "number";
            this.typeMap["System.UInt32"] = "number";
            this.typeMap["System.Int64"] = "number";
            this.typeMap["System.UInt64"] = "number";
            this.typeMap["System.Int16"] = "number";
            this.typeMap["System.UInt16"] = "number";
            this.typeMap["System.Single"] = "number";
            this.typeMap["System.Double"] = "number";
            this.typeMap["System.Decimal"] = "number";
            this.typeMap["System.Byte"] = "number";
            this.typeMap["System.String"] = "string";
            this.typeMap["System.Guid"] = "string";
            this.typeMap["System.Boolean"] = "boolean";
            this.typeMap["System.Void"] = "void";
            this.typeMap["System.Object"] = "any";
            this.typeMap["System.DateTime"] = "Date";
            this.typeMap["System.DateTimeOffset"] = "Date";
            this.typeMap["System.Collections.Generic.List"] = "Array";
            this.typeMap["System.Collections.Generic.IList"] = "Array";
            this.typeMap["System.Collections.Generic.IEnumerable"] = "Array";
            this.typeMap["System.Collections.IEnumerable"] = "Array";
            this.typeMap["System.Linq.IQueryable"] = "Array";
            this.typeMap["System.Array"] = "Array";
        }

        public isValidTypeForDerivation(type: CodeGenerator.CodeDom.TypeInfo): boolean {
            return type.fullName !== "System.Object" && type.fullName !== "System.ValueType";
        }

        public isCollectionType(type: CodeGenerator.CodeDom.TypeInfo): boolean {

            var baseTypeName = this.getActualTypeName(type);
            return baseTypeName === "System.Collections.Generic.List"
                || baseTypeName === "System.Collections.Generic.IList"
                || baseTypeName === "System.Collections.Generic.IEnumerable"
                || baseTypeName === "System.Collections.IEnumerable"
                || baseTypeName === "System.Linq.IQueryable"
                || baseTypeName === "System.Array";
        }

        private getActualTypeName(type: CodeGenerator.CodeDom.TypeInfo): string {
            var matchResult = this.baseTypeRegex.exec(type.fullName);

            if (!matchResult || matchResult.length === 0) {
                throw new Error("Type mismatch");
            }

            return matchResult[0];
        }

        public getTypeOutput(type: CodeGenerator.CodeDom.TypeInfo): string {

            var baseTypeName = this.getActualTypeName(type);

            var typeOutputString: string;

            var nullable = /nullable/i;

            if (nullable.test(baseTypeName)) {
                typeOutputString = this.getTypeArgument(type);
            }
            else {

                typeOutputString = this.translateType(baseTypeName);
                
                if (type.typeArguments && type.typeArguments.hasAny()) {
                    typeOutputString = this.addTypeArguments(type, typeOutputString);
                }
            }


            if (this.arrayRegex.test(type.name))
                typeOutputString = this.getArrayType(type.name, typeOutputString);

            return typeOutputString;
        }

        private addTypeArguments(type: CodeGenerator.CodeDom.TypeInfo, typeOutputString: string): string {

            var typeArguments = type.typeArguments
                .map((value: CodeGenerator.CodeDom.TypeInfo): string => {
                    return this.getTypeOutput(value);
                });

            return typeOutputString + "<" + typeArguments.join(", ") + ">";
        }

        private getTypeArgument(type: CodeGenerator.CodeDom.TypeInfo): string {
            var typeArguments = type.typeArguments
                .map((typeArgument: CodeDom.TypeInfo) => {
                    return this.getTypeOutput(typeArgument);
                });

            return typeArguments.join(", ");
        }

        private translateType(baseTypeName: string): string {
            return this.typeMap.hasOwnProperty(baseTypeName) ? this.typeMap[baseTypeName] : baseTypeName;
        }

        private getArrayType(baseType: string, actualTypeName: string): string {

            var matches = this.arrayRegex.exec(baseType);

            var jaggedCount = matches[2].charAt(0) === "]" ? matches[2].length / 2 : 0;
            var dimensionalArrayCount = matches[2].charAt(0) === "," ? matches[2].length : 0;

            if (jaggedCount > 0) {
                return this.getArrayString(actualTypeName, jaggedCount + 1);
            }
            if (dimensionalArrayCount > 0) {
                return this.getArrayString(actualTypeName, dimensionalArrayCount + 1);
            }

            return this.getArrayString(actualTypeName, 1);
        }

        private getArrayString(baseType: string, count: number): string {
            return count === 0 ? baseType : "Array<" + this.getArrayString(baseType, count - 1) + ">";
        }
    }
}