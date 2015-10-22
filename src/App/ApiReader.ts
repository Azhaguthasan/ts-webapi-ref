module CodeGenerator {
    export class ApiReader {

        private http: any;
        private https: any;
        private q: any;
        private endPointRegex: RegExp;

        constructor() {
            this.http = require("http");
            this.https = require("https");
            this.q = require("q");
            this.endPointRegex = /^(http(?:s)*)\:\/\/([a-zA-Z.0-9]*)(?:\:){0,1}([0-9]*)((?=\/).*)$/;
        }

        public getApi(uri: string): Q.IPromise<Array<CodeDom.ApiDescription>> {

            var deferred: Q.Deferred<Array<CodeDom.ApiDescription>> = this.q.defer();

            if (!this.endPointRegex.test(uri))
                throw new Error("Check url!!");

            var result = this.endPointRegex.exec(uri);
            
            var isHttps = result[1] === "https";

            var options = {
                host: result[2],
                port: result[3],
                path: result[4],
                method: "GET"
            };

            var httpCall = isHttps ? this.https.get : this.http.get;
            
            httpCall(options, (response: any) => {

                var result: string;

                response.on("data", (partialData: any) => {
                    result += partialData;
                });

                response.on("end", () => {

                    var regexp = /^undefined(.*)/;
                    var matchResult = regexp.exec(result);

                    if (matchResult !== undefined && matchResult.length !== 0) {
                        var apiDescriptions: Array<CodeDom.ApiDescription> = JSON.parse(matchResult[1]);
                        deferred.resolve(apiDescriptions);
                        return;
                    }

                    deferred.reject("failed");
                });

            });

            return deferred.promise;
        }
    }
}