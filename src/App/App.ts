module CodeGenerator {
    export class Startup {
        
        private typescriptTypeMapper: CodeGenerator.CodeDom.ITypescriptTypeMapper;
        private typescriptMemberGenerator: CodeGenerator.CodeDom.ITypescriptMemberGenerator;
        private typescriptTypeParameter: CodeGenerator.CodeDom.ITypescriptTypeParameter;
        private typescriptTypeGenerator: CodeGenerator.CodeDom.ITypescriptTypeGenerator;
        private codeGenerator: CodeGenerator.Generator.TypescriptCodeGenerator;

        constructor() {
            this.typescriptTypeMapper = new CodeGenerator.CodeDom.TypescriptTypeMapper();
            this.typescriptMemberGenerator = new CodeGenerator.CodeDom.TypescriptMemberGenerator(this.typescriptTypeMapper);
            this.typescriptTypeParameter = new CodeGenerator.CodeDom.TypescriptTypeParameter(this.typescriptTypeMapper);
            this.typescriptTypeGenerator = new CodeGenerator.CodeDom.TypescriptTypeGenerator(this.typescriptTypeMapper, this.typescriptMemberGenerator, this.typescriptTypeParameter);
            this.codeGenerator = new CodeGenerator.Generator.TypescriptCodeGenerator(this.typescriptTypeGenerator, this.typescriptTypeMapper);
        }

        public generateApi(url: string, options: any) {
            
            var args = new Args(options);           
            
            var apiReader = new CodeGenerator.ApiReader();
            apiReader.getApi(url)
                .then((apiDescrptions: Array<CodeGenerator.CodeDom.ApiDescription>) => {
                    this.codeGenerator.generateCode(args, apiDescrptions);
                });
        }
    }
}

exports.generateApi = function (url: string, options: any) {
    var startup = new CodeGenerator.Startup();
    startup.generateApi(url, options);
}