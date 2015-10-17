module CodeGenerator {
    export class Args {
        apiSuffix: string = "Service";
        module: string = "Service.Reference";
        fileName: string = "Reference.ts";

        constructor(options: any) {

            if (options) {

                if (options.apiSuffix) {
                    this.apiSuffix = options.apiSuffix;
                }

                if (options.module) {
                    this.module = options.module;
                }

                if (options.fileName) {
                    this.fileName = options.fileName;
                }
            }
        }

    }
}