var CodeGenerator;!function(t){var e=function(){function t(){this.http=require("http"),this.https=require("https"),this.q=require("q"),this.endPointRegex=/^(http(?:s)*)\:\/\/([a-zA-Z.0-9]*)(?:\:){0,1}([0-9]*)((?=\/).*)$/}return t.prototype.getApi=function(t){var e=this.q.defer();if(!this.endPointRegex.test(t))throw new Error("Check url!!");var r=this.endPointRegex.exec(t),n="https"===r[1],i={host:r[2],port:r[3],path:r[4],method:"GET"},o=n?this.https.get:this.http.get;return o(i,function(t){var r;t.on("data",function(t){r+=t}),t.on("end",function(){var t=/^undefined(.*)/,n=t.exec(r);if(void 0!==n&&0!==n.length){var i=JSON.parse(n[1]);return void e.resolve(i)}e.reject("failed")})}),e.promise},t}();t.ApiReader=e}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(e){var t=function(){function t(){this.typescriptTypeMapper=new e.CodeDom.TypescriptTypeMapper,this.typescriptMemberGenerator=new e.CodeDom.TypescriptMemberGenerator(this.typescriptTypeMapper),this.typescriptTypeParameter=new e.CodeDom.TypescriptTypeParameter(this.typescriptTypeMapper),this.typescriptTypeGenerator=new e.CodeDom.TypescriptTypeGenerator(this.typescriptTypeMapper,this.typescriptMemberGenerator,this.typescriptTypeParameter),this.codeGenerator=new e.Generator.TypescriptCodeGenerator(this.typescriptTypeGenerator,this.typescriptTypeMapper)}return t.prototype.generateApi=function(t,r){var p=this,i=new e.Args(r),n=new e.ApiReader;n.getApi(t).then(function(e){p.codeGenerator.generateCode(i,e)})},t}();e.Startup=t}(CodeGenerator||(CodeGenerator={})),exports.generateApi=function(e,t){var r=new CodeGenerator.Startup;r.generateApi(e,t)};
var CodeGenerator;!function(e){var t=function(){function e(e){this.apiSuffix="Service",this.module="Service.Reference",this.fileName="Reference.ts",this.generateOnlyTypes=!1,this.generateTypesAsInterface=!1,e&&(e.apiSuffix&&(this.apiSuffix=e.apiSuffix),e.module&&(this.module=e.module),e.fileName&&(this.fileName=e.fileName),e.generateOnlyTypes&&(this.generateOnlyTypes=e.generateOnlyTypes),e.generateTypesAsInterface&&(this.generateTypesAsInterface=e.generateTypesAsInterface))}return e}();e.Args=t}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(e){var t;!function(t){var r=function(){function t(e,t){this.typescriptTypeMapper=t,this.typescriptTypeGenerator=e,this.filesystem=require("fs"),this.types=new Array}return t.prototype.generateCode=function(e,t){var r=this,n="",a=e.fileName,p=e.apiSuffix,o=e.module,s=e.generateOnlyTypes,i=e.generateTypesAsInterface;t.forEach(function(e,t,n){r.populateTypes(e)}),i&&this.convertToInterfaces(),n+=this.generateTypes(),s||(n+=this.generateServices(t,p,o)),this.filesystem.writeFileSync(a,n)},t.prototype.convertToInterfaces=function(){this.types.filter(function(e){return null!==e.fullName&&-1===e.fullName.indexOf("System")&&!e.isEnum}).forEach(function(e){e.isInterface=!0,e.name="I"+e.name,e.fullName=e.namespace+"."+e.name})},t.prototype.generateServices=function(e,t,r){var n=this,a="",p=e.groupBy(function(e){return e.controllerName});return p.forEach(function(e,p,o){a+=n.generateInterface(e,t,r),a+=n.generateImplementation(e,t,r)}),a},t.prototype.populateTypes=function(e){var t=this,r=this.getTypeInfos(e.responseType);this.types.pushRange(r),null!==e.parameterDescriptions&&e.parameterDescriptions.hasAny()&&e.parameterDescriptions.forEach(function(e){var r=t.getTypeInfos(e.type);t.types.pushRange(r)})},t.prototype.generateTypes=function(){var e=this,t="",r=this.types.groupBy(function(e){return e.name}),n=r.map(function(e){return e.first()}).filter(function(e){return null!==e.fullName&&-1===e.fullName.indexOf("System")});return null!==n&&n.hasAny()&&n.forEach(function(r){var n=e.typescriptTypeGenerator.generateType(r);t+=n}),t},t.prototype.getTypeInfos=function(e){var t=this,r=new Array;return null===e?r:(r.push(e),null!==e.typeArguments&&e.typeArguments.hasAny()&&e.typeArguments.forEach(function(e){var n=t.getTypeInfos(e);r.pushRange(n)}),null!==e.properties&&e.properties.hasAny()&&e.properties.forEach(function(e){var n=t.getTypeInfos(e.type);r.pushRange(n)}),r)},t.prototype.generateInterface=function(t,r,n){var a=new e.CodeDom.TypeInfo,p=t.first();return a.namespace=n,a.name="I"+p.controllerName+r,a.fullName=n+"."+a.name,a.methods=new Array,t.forEach(function(t){var r=new e.CodeDom.MethodInfo;r.name=t.actionName,r.parameters=t.parameterDescriptions;var n=new e.CodeDom.TypeInfo;n.typeArguments=new Array,n.typeArguments.push(t.responseType),n.name="IPromise",n.namespace="angular",n.fullName=n.namespace+"."+n.name,r.returnType=n,a.methods.push(r)}),this.typescriptTypeGenerator.generateType(a)},t.prototype.generateImplementation=function(t,r,n){var a=this,p=new e.CodeDom.TypeInfo,o=t.first();p.namespace=n,p.name=o.controllerName+r,p.fullName=n+"."+p.name,p.methods=new Array;var s=new e.CodeDom.MethodInfo;s.name="constructor",s.isConstructor=!0,s.parameters=new Array;var i=new e.CodeDom.ParameterDescription;return i.name="private $httpService",i.type=new e.CodeDom.TypeInfo,i.type.name="IHttpService",i.type.namespace="angular",i.type.fullName=i.type.namespace+"."+i.type.name,s.parameters.push(i),p.methods.push(s),t.forEach(function(t){var r=new e.CodeDom.MethodInfo;r.name=t.actionName,r.parameters=t.parameterDescriptions;var n=new e.CodeDom.TypeInfo;n.typeArguments=new Array,n.typeArguments.push(t.responseType),n.name="IPromise",n.namespace="angular",n.fullName=n.namespace+"."+n.name,r.returnType=n,r.statements=a.getStatements(t),p.methods.push(r)}),this.typescriptTypeGenerator.generateType(p)},t.prototype.getStatements=function(e){var t=new Array;return t.push("var httpServiceRequest = {"),t.push('	method: "'+e.httpMethod+'",'),t.push('	url: "'+e.relativePath+'",'),t.push("	data: {"),e.parameterDescriptions.forEach(function(e){t.push("		"+e.name+": "+e.name+",")}),t.push("	}"),t.push("};"),t.push("var promise = this.$httpService(httpServiceRequest)"),t.push("	.then((httpServiceResponse: angular.IHttpPromiseCallbackArg<"+this.typescriptTypeMapper.getTypeOutput(e.responseType)+">) => {"),t.push("		return httpServiceResponse.data;"),t.push("	});"),t.push("return promise;"),t},t}();t.TypescriptCodeGenerator=r}(t=e.Generator||(e.Generator={}))}(CodeGenerator||(CodeGenerator={}));

!function(){function r(){var r=this;return r.length>0}function t(){var r=this;return r.hasAny()?r[0]:void 0}function n(){var r=this;return r.hasAny()?r[r.length-1]:void 0}function o(r){var t=this;if(!t.hasAny())return void 0;for(var n=0;n<t.length;n++){var o=t[n];if(r(o))return o}return void 0}function i(r){var t=new Array,n=this;return n.forEach(function(n,o,i){var e=t.firstMatch(function(t){return r(t.first())===r(n)});if(null==e){var a=new Array;a.push(n),t.push(a)}else e.push(n)}),t}function e(r){var t,n=this;if(!n.hasAny())return n;var o=n.first(),i=r(o);return t="number"==typeof i?function(r,t){return r>t?-1:t>r?1:0}:"boolean"==typeof i?function(r,t){return r&&!t?-1:!r&&t?1:0}:function(r,t){return void 0!=r&&void 0==t?1:void 0==r&&void 0!=t?-1:0},n.sort(t)}function a(){var r=this;r=[],r.length=0}function u(r){var t=this;return t.slice(0,r)}function f(r){var t=this;r.forEach(function(r){t.push(r)})}Array.prototype.hasAny=r,Array.prototype.first=t,Array.prototype.last=n,Array.prototype.firstMatch=o,Array.prototype.groupBy=i,Array.prototype.orderBy=e,Array.prototype.clear=a,Array.prototype.take=u,Array.prototype.pushRange=f}();
var CodeGenerator;!function(o){var e;!function(o){var e=function(){function o(){}return o}();o.ApiDescription=e}(e=o.CodeDom||(o.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(o){var e;!function(o){var e=function(){function o(){}return o}();o.MethodInfo=e}(e=o.CodeDom||(o.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(e){var o;!function(e){var o=function(){function e(){}return e}();e.ParameterDescription=o}(o=e.CodeDom||(e.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(o){var e;!function(o){var e=function(){function o(){}return o}();o.PropertyInfo=e}(e=o.CodeDom||(o.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(o){var e;!function(o){var e=function(){function o(){}return o}();o.TypeInfo=e}(e=o.CodeDom||(o.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));

var CodeGenerator;!function(t){var e;!function(t){var e=function(){function t(){this.baseTypeRegex=/(([a-zA-Z]+[0-9.]*)+)/,this.arrayRegex=/^([a-zA-Z0-9\.]+)(?:[`0-9]*)\[((?:\]\[)*|(?:,)*)\]$/,this.typeMap={},this.addAllKnownTypes()}return t.prototype.addAllKnownTypes=function(){this.typeMap["System.Int32"]="number",this.typeMap["System.UInt32"]="number",this.typeMap["System.Int64"]="number",this.typeMap["System.UInt64"]="number",this.typeMap["System.Int16"]="number",this.typeMap["System.UInt16"]="number",this.typeMap["System.Single"]="number",this.typeMap["System.Double"]="number",this.typeMap["System.Decimal"]="number",this.typeMap["System.Byte"]="number",this.typeMap["System.String"]="string",this.typeMap["System.Guid"]="string",this.typeMap["System.Boolean"]="boolean",this.typeMap["System.Void"]="void",this.typeMap["System.Object"]="any",this.typeMap["System.DateTime"]="Date",this.typeMap["System.DateTimeOffset"]="Date",this.typeMap["System.Collections.Generic.List"]="Array",this.typeMap["System.Collections.Generic.IList"]="Array",this.typeMap["System.Collections.Generic.IEnumerable"]="Array",this.typeMap["System.Collections.IEnumerable"]="Array",this.typeMap["System.Array"]="Array"},t.prototype.isValidTypeForDerivation=function(t){return"System.Object"!==t.fullName},t.prototype.isCollectionType=function(t){var e=this.getActualTypeName(t);return"System.Collections.Generic.List"===e||"System.Collections.Generic.IList"===e||"System.Collections.Generic.IEnumerable"===e||"System.Collections.IEnumerable"===e||"System.Array"===e},t.prototype.getActualTypeName=function(t){var e=this.baseTypeRegex.exec(t.fullName);if(null===e||0===e.length)throw new Error("Type mismatch");return e[0]},t.prototype.getTypeOutput=function(t){var e,r=this.getActualTypeName(t),n=/nullable/i;return n.test(r)?e=this.getTypeArgument(t):(e=this.translateType(r),void 0!==t.typeArguments&&t.typeArguments.length>0&&(e=this.addTypeArguments(t,e))),this.arrayRegex.test(t.name)&&(e=this.getArrayType(t.name,e)),e},t.prototype.addTypeArguments=function(t,e){var r=this,n=t.typeArguments.map(function(t){return r.getTypeOutput(t)});return e+"<"+n.join(", ")+">"},t.prototype.getTypeArgument=function(t){var e=t.typeArguments.map(this.getTypeOutput);return e.join(", ")},t.prototype.translateType=function(t){return this.typeMap.hasOwnProperty(t)?this.typeMap[t]:t},t.prototype.getArrayType=function(t,e){var r=this.arrayRegex.exec(t),n="]"===r[2].charAt(0)?r[2].length/2:0,y=","===r[2].charAt(0)?r[2].length:0;return n>0?this.getArrayString(e,n+1):y>0?this.getArrayString(e,y+1):this.getArrayString(e,1)},t.prototype.getArrayString=function(t,e){return 0===e?t:"Array<"+this.getArrayString(t,e-1)+">"},t}();t.TypescriptTypeMapper=e}(e=t.CodeDom||(t.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(e){var t;!function(e){var t=function(){function e(e){this.typescriptTypeMapper=e,this.os=require("os")}return e.prototype.generateMember=function(e){var t=this.convertPascalCaseToCamelCase(e.name);return e.isEnumMember?t+" = "+e.enumValue+",":t+": "+this.typescriptTypeMapper.getTypeOutput(e.type)+";"},e.prototype.generateMethod=function(e,t){var r=this,n=this.convertPascalCaseToCamelCase(e.name),a="";if(void 0!==e.parameters&&e.parameters.hasAny()){var s=e.parameters.map(function(e){return r.generateParameter(e)});a=s.join(", ")}var o=void 0===e.returnType?"void":this.typescriptTypeMapper.getTypeOutput(e.returnType);if(void 0!==e.statements&&e.statements.hasAny()){var i=this.getIndentTabs(t+1),p=this.getIndentTabs(t),u=e.statements.join(this.os.EOL+i);return n+"("+a+"): "+o+"{"+this.os.EOL+i+u+this.os.EOL+p+"}"+this.os.EOL}if(e.isConstructor){var i=this.getIndentTabs(t);return"constructor("+a+") {"+this.os.EOL+i+"}"}return n+": ("+a+") => "+o+";"},e.prototype.getIndentTabs=function(e){for(var t="",r=0;e>r;r++)t+="	";return t},e.prototype.generateParameter=function(e){var t=this.convertPascalCaseToCamelCase(e.name),r=this.typescriptTypeMapper.getTypeOutput(e.type);return t+": "+r},e.prototype.convertPascalCaseToCamelCase=function(e){if(null===e||e.length<=0)return"";var t=e[0].toString().toLowerCase();return t+e.substr(1,e.length-1)},e}();e.TypescriptMemberGenerator=t}(t=e.CodeDom||(e.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(e){var t;!function(e){var t=function(){function e(e,t,r){this.typescriptTypeParameter=r,this.typescriptMemberGenerator=t,this.typescriptTypeMapper=e,this.os=require("os")}return e.prototype.generateType=function(e){var t=this.getType(e),r=void 0!==e.namespace&&e.namespace.length>0;return r?this.wrapWithModule(e,t):t},e.prototype.getType=function(e){var t=this,r=void 0!==e.namespace&&e.namespace.length>0,n=r?1:0,s=r?"export ":"",p=e.name,i=this.getTypeOfType(e),a="";if(null!=e.properties&&e.properties.hasAny()){var o=e.properties.map(function(e){return t.typescriptMemberGenerator.generateMember(e)});a=this.os.EOL+this.getIndentTabs(n+1)+o.join(this.os.EOL+this.getIndentTabs(n+1))+this.os.EOL}var y="";if(null!=e.methods&&e.methods.hasAny()){var h=e.methods.map(function(e){return t.typescriptMemberGenerator.generateMethod(e,n+1)});y=this.os.EOL+this.getIndentTabs(n+1)+h.join(this.os.EOL+this.getIndentTabs(n+1))+this.os.EOL}var u="";if(null!=e.typeArguments&&e.typeArguments.hasAny()){var c=e.typeArguments.map(function(e){return t.typescriptTypeParameter.generateParameter(e)});c.hasAny()&&(u="<"+c.join(", ")+">")}var m="";return e.isEnum||void 0===e.baseType||this.typescriptTypeMapper.isValidTypeForDerivation(e.baseType)&&(m=" extends "+this.typescriptTypeMapper.getTypeOutput(e.baseType)),this.getIndentTabs(n)+s+i+p+u+m+" {"+a+y+this.getIndentTabs(n)+"}"},e.prototype.getIndentTabs=function(e){for(var t="",r=0;e>r;r++)t+="	";return t},e.prototype.getTypeOfType=function(e){return e.isEnum?"enum ":e.isInterface?"interface ":"class "},e.prototype.wrapWithModule=function(e,t){return"module "+e.namespace+" {"+this.os.EOL+t+this.os.EOL+"}"+this.os.EOL},e}();e.TypescriptTypeGenerator=t}(t=e.CodeDom||(e.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));
var CodeGenerator;!function(e){var t;!function(e){var t=function(){function e(e){this.typescriptTypeMapper=e}return e.prototype.generateParameter=function(e){var t="";if(e.typeArguments.length>0){var r=e.typeArguments.first(),n=this.typescriptTypeMapper.getTypeOutput(r);t=" extends "+n}return e.name+t},e}();e.TypescriptTypeParameter=t}(t=e.CodeDom||(e.CodeDom={}))}(CodeGenerator||(CodeGenerator={}));