# ts-webapi-ref
A npm module for generating typescript code from Web Api Descriptions

This npm module allows to generate typescript code using the Api Descriptions provided by Web Api. It also generates Services call providing interfaces for each Web Api controller and implements the service call using angular.IHttpService. This module can be included as a gulp task in the build.

### Installation:

```
$ npm install ts-webapi-ref
```

### Usage:

This module has only one api "generateApi"

```javascript
var tsWebApiRef = require("ts-webapi-ref");

tsWebApiRef.generateApi(url, [options]);
```

```
url: <web api endpoint exposing all the Api descriptions (see below for more details)>
options: {
     filename: (Reference.ts) "name of the file that should contain the generated types and web api service"
     module: (Service.Reference) "name of the module for the service call interface"
     apiSuffix: (Service) "suffix name of the service interface generated."
}
```


This is used in conjunction with WebApiExplorerExtensions nuget package in Web Api code. 
Please see here for more details: https://github.com/Azhaguthasan/WebApiExtensions
