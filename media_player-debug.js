// Copyright Google Inc. All Rights Reserved.
(function() { 'use strict';var goog = goog || {};
goog.global = this;
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split("."), cur = opt_objectToExportTo || goog.global;
  parts[0] in cur || !cur.execScript || cur.execScript("var " + parts[0]);
  for (var part;parts.length && (part = parts.shift());) {
    parts.length || void 0 === opt_object ? cur = cur[part] ? cur[part] : cur[part] = {} : cur[part] = opt_object;
  }
};
goog.define = function(name, defaultValue) {
  var value = defaultValue;
  goog.exportPath_(name, value);
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.provide = function(name) {
  goog.exportPath_(name);
};
goog.setTestOnly = function(opt_message) {
  if (!goog.DEBUG) {
    throw opt_message = opt_message || "", Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
goog.forwardDeclare = function() {
};
goog.getObjectByName = function(name, opt_obj) {
  for (var parts = name.split("."), cur = opt_obj || goog.global, part;part = parts.shift();) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global, x;
  for (x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if (goog.DEPENDENCIES_ENABLED) {
    for (var provide, require, path = relPath.replace(/\\/g, "/"), deps = goog.dependencies_, i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path, path in deps.pathToNames || (deps.pathToNames[path] = {}), deps.pathToNames[path][provide] = !0;
    }
    for (var j = 0;require = requires[j];j++) {
      path in deps.requires || (deps.requires[path] = {}), deps.requires[path][require] = !0;
    }
  }
};
goog.useStrictRequires = !1;
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function() {
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor);
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !1;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var doc = goog.global.document;
  return "undefined" != typeof doc && "write" in doc;
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var doc = goog.global.document, scripts = doc.getElementsByTagName("script"), i = scripts.length - 1;0 <= i;--i) {
        var src = scripts[i].src, qmark = src.lastIndexOf("?"), l = -1 == qmark ? src.length : qmark;
        if ("base.js" == src.substr(l - 7, 7)) {
          goog.basePath = src.substr(0, l - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(src) {
  var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[src] && importScript(src) && (goog.dependencies_.written[src] = !0);
}, goog.writeScriptTag_ = function(src) {
  if (goog.inHtmlDocument_()) {
    var doc = goog.global.document;
    if ("complete" == doc.readyState) {
      var isDeps = /\bdeps.js$/.test(src);
      if (isDeps) {
        return!1;
      }
      throw Error('Cannot write "' + src + '" after document load');
    }
    doc.write('<script type="text/javascript" src="' + src + '">\x3c/script>');
    return!0;
  }
  return!1;
}, goog.writeScripts_ = function() {
  function visitNode(path) {
    if (!(path in deps.written)) {
      if (!(path in deps.visited) && (deps.visited[path] = !0, path in deps.requires)) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      path in seenScript || (seenScript[path] = !0, scripts.push(path));
    }
  }
  var scripts = [], seenScript = {}, deps = goog.dependencies_, path$$0;
  for (path$$0 in goog.included_) {
    deps.written[path$$0] || visitNode(path$$0);
  }
  for (var i = 0;i < scripts.length;i++) {
    if (scripts[i]) {
      goog.importScript_(goog.basePath + scripts[i]);
    } else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(rule) {
  return rule in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[rule] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(value) {
  var s = typeof value;
  if ("object" == s) {
    if (value) {
      if (value instanceof Array) {
        return "array";
      }
      if (value instanceof Object) {
        return s;
      }
      var className = Object.prototype.toString.call(value);
      if ("[object Window]" == className) {
        return "object";
      }
      if ("[object Array]" == className || "number" == typeof value.length && "undefined" != typeof value.splice && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == className || "undefined" != typeof value.call && "undefined" != typeof value.propertyIsEnumerable && !value.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == s && "undefined" == typeof value.call) {
      return "object";
    }
  }
  return s;
};
goog.isDef = function(val) {
  return void 0 !== val;
};
goog.isNull = function(val) {
  return null === val;
};
goog.isDefAndNotNull = function(val) {
  return null != val;
};
goog.isArray = function(val) {
  return "array" == goog.typeOf(val);
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return "array" == type || "object" == type && "number" == typeof val.length;
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && "function" == typeof val.getFullYear;
};
goog.isString = function(val) {
  return "string" == typeof val;
};
goog.isBoolean = function(val) {
  return "boolean" == typeof val;
};
goog.isNumber = function(val) {
  return "number" == typeof val;
};
goog.isFunction = function(val) {
  return "function" == goog.typeOf(val);
};
goog.isObject = function(val) {
  var type = typeof val;
  return "object" == type && null != val || "function" == type;
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(obj) {
  return!!obj[goog.UID_PROPERTY_];
};
goog.removeUid = function(obj) {
  "removeAttribute" in obj && obj.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw Error();
  }
  if (2 < arguments.length) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  }
  return function() {
    return fn.apply(selfObj, arguments);
  };
};
goog.bind = function(fn, selfObj, var_args) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(script);
      } else {
        var doc = goog.global.document, scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = !1;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  }, renameByParts = function(cssName) {
    for (var parts = cssName.split("-"), mapped = [], i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join("-");
  }, rename;
  rename = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? getMapping : renameByParts : function(a) {
    return a;
  };
  return opt_modifier ? className + "-" + rename(opt_modifier) : rename(className);
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {}, key;
  for (key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(RegExp("\\{\\$" + key + "\\}", "gi"), value);
  }
  return str;
};
goog.getMsgWithFallback = function(a) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !caller) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1));
  }
  for (var args = Array.prototype.slice.call(arguments, 2), foundCaller = !1, ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = !0;
    } else {
      if (foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args);
      }
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
goog.MODIFY_FUNCTION_PROTOTYPES = !0;
goog.MODIFY_FUNCTION_PROTOTYPES && (Function.prototype.bind = Function.prototype.bind || function(selfObj, var_args) {
  if (1 < arguments.length) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(this, selfObj);
    return goog.bind.apply(null, args);
  }
  return goog.bind(this, selfObj);
}, Function.prototype.partial = function(var_args) {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this, null);
  return goog.bind.apply(null, args);
}, Function.prototype.inherits = function(parentCtor) {
  goog.inherits(this, parentCtor);
}, Function.prototype.mixin = function(source) {
  goog.mixin(this.prototype, source);
});
goog.debug = {};
goog.debug.Error = function(opt_msg) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var stack = Error().stack;
    stack && (this.stack = stack);
  }
  opt_msg && (this.message = String(opt_msg));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return 0 == str.lastIndexOf(prefix, 0);
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return 0 <= l && str.indexOf(suffix, l) == l;
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return 0 == goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length));
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return 0 == goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length));
};
goog.string.caseInsensitiveEquals = function(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};
goog.string.subs = function(str, var_args) {
  for (var splitParts = str.split("%s"), returnString = "", subsArguments = Array.prototype.slice.call(arguments, 1);subsArguments.length && 1 < splitParts.length;) {
    returnString += splitParts.shift() + subsArguments.shift();
  }
  return returnString + splitParts.join("%s");
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str);
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str));
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str);
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str);
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str);
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str);
};
goog.string.isSpace = function(ch) {
  return " " == ch;
};
goog.string.isUnicodeChar = function(ch) {
  return 1 == ch.length && " " <= ch && "~" >= ch || "\u0080" <= ch && "\ufffd" >= ch;
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase(), test2 = String(str2).toLowerCase();
  return test1 < test2 ? -1 : test1 == test2 ? 0 : 1;
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return-1;
  }
  if (!str2) {
    return 1;
  }
  for (var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_), tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_), count = Math.min(tokens1.length, tokens2.length), i = 0;i < count;i++) {
    var a = tokens1[i], b = tokens2[i];
    if (a != b) {
      var num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }
  return tokens1.length != tokens2.length ? tokens1.length - tokens2.length : str1 < str2 ? -1 : 1;
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str));
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;").replace(goog.string.singleQuoteRe_, "&#39;");
  }
  if (!goog.string.allRe_.test(str)) {
    return str;
  }
  -1 != str.indexOf("&") && (str = str.replace(goog.string.amperRe_, "&amp;"));
  -1 != str.indexOf("<") && (str = str.replace(goog.string.ltRe_, "&lt;"));
  -1 != str.indexOf(">") && (str = str.replace(goog.string.gtRe_, "&gt;"));
  -1 != str.indexOf('"') && (str = str.replace(goog.string.quotRe_, "&quot;"));
  -1 != str.indexOf("'") && (str = str.replace(goog.string.singleQuoteRe_, "&#39;"));
  return str;
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /"/g;
goog.string.singleQuoteRe_ = /'/g;
goog.string.allRe_ = /[&<>"']/;
goog.string.unescapeEntities = function(str) {
  return goog.string.contains(str, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(str) : goog.string.unescapePureXmlEntities_(str) : str;
};
goog.string.unescapeEntitiesWithDocument = function(str, document) {
  return goog.string.contains(str, "&") ? goog.string.unescapeEntitiesUsingDom_(str, document) : str;
};
goog.string.unescapeEntitiesUsingDom_ = function(str, opt_document) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, div;
  div = opt_document ? opt_document.createElement("div") : document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if (value) {
      return value;
    }
    if ("#" == entity.charAt(0)) {
      var n = Number("0" + entity.substr(1));
      isNaN(n) || (value = String.fromCharCode(n));
    }
    value || (div.innerHTML = s + " ", value = div.firstChild.nodeValue.slice(0, -1));
    return seen[s] = value;
  });
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return'"';
      default:
        if ("#" == entity.charAt(0)) {
          var n = Number("0" + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        return s;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml);
};
goog.string.stripQuotes = function(str, quoteChars) {
  for (var length = quoteChars.length, i = 0;i < length;i++) {
    var quoteChar = 1 == length ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  str.length > chars && (str = str.substring(0, chars - 3) + "...");
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  opt_protectEscapedCharacters && (str = goog.string.unescapeEntities(str));
  if (opt_trailingChars && str.length > chars) {
    opt_trailingChars > chars && (opt_trailingChars = chars);
    var endPoint = str.length - opt_trailingChars, startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint);
  } else {
    if (str.length > chars) {
      var half = Math.floor(chars / 2), endPos = str.length - half, half = half + chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos);
    }
  }
  opt_protectEscapedCharacters && (str = goog.string.htmlEscape(str));
  return str;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if (s.quote) {
    return s.quote();
  }
  for (var sb = ['"'], i = 0;i < s.length;i++) {
    var ch = s.charAt(i), cc = ch.charCodeAt(0);
    sb[i + 1] = goog.string.specialEscapeChars_[ch] || (31 < cc && 127 > cc ? ch : goog.string.escapeChar(ch));
  }
  sb.push('"');
  return sb.join("");
};
goog.string.escapeString = function(str) {
  for (var sb = [], i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i));
  }
  return sb.join("");
};
goog.string.escapeChar = function(c) {
  if (c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c];
  }
  if (c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c];
  }
  var rv = c, cc = c.charCodeAt(0);
  if (31 < cc && 127 > cc) {
    rv = c;
  } else {
    if (256 > cc) {
      if (rv = "\\x", 16 > cc || 256 < cc) {
        rv += "0";
      }
    } else {
      rv = "\\u", 4096 > cc && (rv += "0");
    }
    rv += cc.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[c] = rv;
};
goog.string.toMap = function(s) {
  for (var rv = {}, i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = !0;
  }
  return rv;
};
goog.string.contains = function(str, subString) {
  return-1 != str.indexOf(subString);
};
goog.string.caseInsensitiveContains = function(str, subString) {
  return goog.string.contains(str.toLowerCase(), subString.toLowerCase());
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  0 <= index && index < s.length && 0 < stringLength && (resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength));
  return resultStr;
};
goog.string.remove = function(s, ss) {
  var re = RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "");
};
goog.string.removeAll = function(s, ss) {
  var re = RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "");
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(string, length) {
  return Array(length + 1).join(string);
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num), index = s.indexOf(".");
  -1 == index && (index = s.length);
  return goog.string.repeat("0", Math.max(0, length - index)) + s;
};
goog.string.makeSafe = function(obj) {
  return null == obj ? "" : String(obj);
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(version1, version2) {
  for (var order = 0, v1Subs = goog.string.trim(String(version1)).split("."), v2Subs = goog.string.trim(String(version2)).split("."), subCount = Math.max(v1Subs.length, v2Subs.length), subIdx = 0;0 == order && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "", v2Sub = v2Subs[subIdx] || "", v1CompParser = /(\d*)(\D*)/g, v2CompParser = /(\d*)(\D*)/g;
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""], v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if (0 == v1Comp[0].length && 0 == v2Comp[0].length) {
        break;
      }
      var v1CompNum = 0 == v1Comp[1].length ? 0 : parseInt(v1Comp[1], 10), v2CompNum = 0 == v2Comp[1].length ? 0 : parseInt(v2Comp[1], 10), order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(0 == v1Comp[2].length, 0 == v2Comp[2].length) || goog.string.compareElements_(v1Comp[2], v2Comp[2]);
    } while (0 == order);
  }
  return order;
};
goog.string.compareElements_ = function(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  for (var result = 0, i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i), result %= goog.string.HASHCODE_MAX_;
  }
  return result;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  return 0 == num && goog.string.isEmpty(str) ? NaN : num;
};
goog.string.isLowerCamelCase = function(str) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(str);
};
goog.string.isUpperCamelCase = function(str) {
  return/^([A-Z][a-z]*)+$/.test(str);
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s", delimiters = delimiters ? "|[" + delimiters + "]+" : "", regexp = RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};
goog.string.parseInt = function(value) {
  isFinite(value) && (value = String(value));
  return goog.isString(value) ? /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10) : NaN;
};
goog.string.splitLimit = function(str, separator, limit) {
  for (var parts = str.split(separator), returnVal = [];0 < limit && parts.length;) {
    returnVal.push(parts.shift()), limit--;
  }
  parts.length && returnVal.push(parts.join(separator));
  return returnVal;
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if (givenMessage) {
    var message = message + (": " + givenMessage), args = givenArgs
  } else {
    defaultMessage && (message += ": " + defaultMessage, args = defaultArgs);
  }
  throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !condition && goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2));
  return condition;
};
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(value) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(value) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(value) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertElement = function(value, opt_message, var_args) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(value) && value.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2));
  return value;
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  !goog.asserts.ENABLE_ASSERTS || value instanceof type || goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3));
  return value;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + " should not be enumerable in Object.prototype.");
  }
};
goog.debug.RelativeTimeProvider = function() {
  this.relativeTimeStart_ = goog.now();
};
goog.debug.RelativeTimeProvider.defaultInstance_ = new goog.debug.RelativeTimeProvider;
goog.debug.RelativeTimeProvider.prototype.set = function(timeStamp) {
  this.relativeTimeStart_ = timeStamp;
};
goog.debug.RelativeTimeProvider.prototype.reset = function() {
  this.set(goog.now());
};
goog.debug.RelativeTimeProvider.prototype.get = function() {
  return this.relativeTimeStart_;
};
goog.debug.RelativeTimeProvider.getDefaultInstance = function() {
  return goog.debug.RelativeTimeProvider.defaultInstance_;
};
goog.debug.Formatter = function(opt_prefix) {
  this.prefix_ = opt_prefix || "";
  this.startTimeProvider_ = goog.debug.RelativeTimeProvider.getDefaultInstance();
};
goog.debug.Formatter.prototype.appendNewline = !0;
goog.debug.Formatter.prototype.showAbsoluteTime = !0;
goog.debug.Formatter.prototype.showRelativeTime = !0;
goog.debug.Formatter.prototype.showLoggerName = !0;
goog.debug.Formatter.prototype.showExceptionText = !1;
goog.debug.Formatter.prototype.showSeverityLevel = !1;
goog.debug.Formatter.getDateTimeStamp_ = function(logRecord) {
  var time = new Date(logRecord.getMillis());
  return goog.debug.Formatter.getTwoDigitString_(time.getFullYear() - 2E3) + goog.debug.Formatter.getTwoDigitString_(time.getMonth() + 1) + goog.debug.Formatter.getTwoDigitString_(time.getDate()) + " " + goog.debug.Formatter.getTwoDigitString_(time.getHours()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getMinutes()) + ":" + goog.debug.Formatter.getTwoDigitString_(time.getSeconds()) + "." + goog.debug.Formatter.getTwoDigitString_(Math.floor(time.getMilliseconds() / 10));
};
goog.debug.Formatter.getTwoDigitString_ = function(n) {
  return 10 > n ? "0" + n : String(n);
};
goog.debug.Formatter.getRelativeTime_ = function(logRecord, relativeTimeStart) {
  var ms = logRecord.getMillis() - relativeTimeStart, sec = ms / 1E3, str = sec.toFixed(3), spacesToPrepend = 0;
  if (1 > sec) {
    spacesToPrepend = 2;
  } else {
    for (;100 > sec;) {
      spacesToPrepend++, sec *= 10;
    }
  }
  for (;0 < spacesToPrepend--;) {
    str = " " + str;
  }
  return str;
};
goog.debug.HtmlFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.HtmlFormatter, goog.debug.Formatter);
goog.debug.HtmlFormatter.prototype.showExceptionText = !0;
goog.debug.HtmlFormatter.prototype.formatRecord = function(logRecord) {
  var className;
  switch(logRecord.getLevel().value) {
    case goog.debug.Logger.Level.SHOUT.value:
      className = "dbg-sh";
      break;
    case goog.debug.Logger.Level.SEVERE.value:
      className = "dbg-sev";
      break;
    case goog.debug.Logger.Level.WARNING.value:
      className = "dbg-w";
      break;
    case goog.debug.Logger.Level.INFO.value:
      className = "dbg-i";
      break;
    default:
      className = "dbg-f";
  }
  var sb = [];
  sb.push(this.prefix_, " ");
  this.showAbsoluteTime && sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  this.showRelativeTime && sb.push("[", goog.string.whitespaceEscape(goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get())), "s] ");
  this.showLoggerName && sb.push("[", goog.string.htmlEscape(logRecord.getLoggerName()), "] ");
  this.showSeverityLevel && sb.push("[", goog.string.htmlEscape(logRecord.getLevel().name), "] ");
  sb.push('<span class="', className, '">', goog.string.newLineToBr(goog.string.whitespaceEscape(goog.string.htmlEscape(logRecord.getMessage()))));
  this.showExceptionText && logRecord.getException() && sb.push("<br>", goog.string.newLineToBr(goog.string.whitespaceEscape(logRecord.getExceptionText() || "")));
  sb.push("</span>");
  this.appendNewline && sb.push("<br>");
  return sb.join("");
};
goog.debug.TextFormatter = function(opt_prefix) {
  goog.debug.Formatter.call(this, opt_prefix);
};
goog.inherits(goog.debug.TextFormatter, goog.debug.Formatter);
goog.debug.TextFormatter.prototype.formatRecord = function(logRecord) {
  var sb = [];
  sb.push(this.prefix_, " ");
  this.showAbsoluteTime && sb.push("[", goog.debug.Formatter.getDateTimeStamp_(logRecord), "] ");
  this.showRelativeTime && sb.push("[", goog.debug.Formatter.getRelativeTime_(logRecord, this.startTimeProvider_.get()), "s] ");
  this.showLoggerName && sb.push("[", logRecord.getLoggerName(), "] ");
  this.showSeverityLevel && sb.push("[", logRecord.getLevel().name, "] ");
  sb.push(logRecord.getMessage());
  this.showExceptionText && logRecord.getException() && sb.push("\n", logRecord.getExceptionText());
  this.appendNewline && sb.push("\n");
  return sb.join("");
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(array) {
  return array[array.length - 1];
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.indexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = null == opt_fromIndex ? 0 : 0 > opt_fromIndex ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if (goog.isString(arr)) {
    return goog.isString(obj) && 1 == obj.length ? arr.indexOf(obj, fromIndex) : -1;
  }
  for (var i = fromIndex;i < arr.length;i++) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(null != arr.length);
  var fromIndex = null == opt_fromIndex ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = null == opt_fromIndex ? arr.length - 1 : opt_fromIndex;
  0 > fromIndex && (fromIndex = Math.max(0, arr.length + fromIndex));
  if (goog.isString(arr)) {
    return goog.isString(obj) && 1 == obj.length ? arr.lastIndexOf(obj, fromIndex) : -1;
  }
  for (var i = fromIndex;0 <= i;i--) {
    if (i in arr && arr[i] === obj) {
      return i;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.forEach) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;0 <= i;--i) {
    i in arr2 && f.call(opt_obj, arr2[i], i, arr);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.filter) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = [], resLength = 0, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2) {
      var val = arr2[i];
      f.call(opt_obj, val, i, arr) && (res[resLength++] = val);
    }
  }
  return res;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.map) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, res = Array(l), arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    i in arr2 && (res[i] = f.call(opt_obj, arr2[i], i, arr));
  }
  return res;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduce) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(null != arr.length);
  opt_obj && (f = goog.bind(f, opt_obj));
  return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val);
} : function(arr, f, val$$0, opt_obj) {
  var rval = val$$0;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.reduceRight) ? function(arr, f, val, opt_obj) {
  goog.asserts.assert(null != arr.length);
  opt_obj && (f = goog.bind(f, opt_obj));
  return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
} : function(arr, f, val$$0, opt_obj) {
  var rval = val$$0;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr);
  });
  return rval;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.some) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return!0;
    }
  }
  return!1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || goog.array.ARRAY_PROTOTYPE_.every) ? function(arr, f, opt_obj) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
} : function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return!1;
    }
  }
  return!0;
};
goog.array.count = function(arr$$0, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr$$0, function(element, index, arr) {
    f.call(opt_obj, element, index, arr) && ++count;
  }, opt_obj);
  return count;
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndex = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = 0;i < l;i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return 0 > i ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  for (var l = arr.length, arr2 = goog.isString(arr) ? arr.split("") : arr, i = l - 1;0 <= i;i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return-1;
};
goog.array.contains = function(arr, obj) {
  return 0 <= goog.array.indexOf(arr, obj);
};
goog.array.isEmpty = function(arr) {
  return 0 == arr.length;
};
goog.array.clear = function(arr) {
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1;0 <= i;i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
};
goog.array.insert = function(arr, obj) {
  goog.array.contains(arr, obj) || arr.push(obj);
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  2 == arguments.length || 0 > (i = goog.array.indexOf(arr, opt_obj2)) ? arr.push(obj) : goog.array.insertAt(arr, obj, i);
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj), rv;
  (rv = 0 <= i) && goog.array.removeAt(arr, i);
  return rv;
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(null != arr.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length;
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return 0 <= i ? (goog.array.removeAt(arr, i), !0) : !1;
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(object) {
  var length = object.length;
  if (0 < length) {
    for (var rv = Array(length), i = 0;i < length;i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for (var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i], isArrayLike;
    if (goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && Object.prototype.hasOwnProperty.call(arr2, "callee")) {
      arr1.push.apply(arr1, arr2);
    } else {
      if (isArrayLike) {
        for (var len1 = arr1.length, len2 = arr2.length, j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j];
        }
      } else {
        arr1.push(arr2);
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(null != arr.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1));
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(null != arr.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start) : goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
};
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  for (var returnArray = opt_rv || arr, defaultHashFn = function() {
    return goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
  }, hashFn = opt_hashFn || defaultHashFn, seen = {}, cursorInsert = 0, cursorRead = 0;cursorRead < arr.length;) {
    var current = arr[cursorRead++], key = hashFn(current);
    Object.prototype.hasOwnProperty.call(seen, key) || (seen[key] = !0, returnArray[cursorInsert++] = current);
  }
  returnArray.length = cursorInsert;
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, !1, target);
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, !0, void 0, opt_obj);
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  for (var left = 0, right = arr.length, found;left < right;) {
    var middle = left + right >> 1, compareResult;
    compareResult = isEvaluator ? compareFn.call(opt_selfObj, arr[middle], middle, arr) : compareFn(opt_target, arr[middle]);
    0 < compareResult ? left = middle + 1 : (right = middle, found = !compareResult);
  }
  return found ? left : ~left;
};
goog.array.sort = function(arr, opt_compareFn) {
  arr.sort(opt_compareFn || goog.array.defaultCompare);
};
goog.array.stableSort = function(arr, opt_compareFn) {
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  for (var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]};
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, stableCompareFn);
  for (i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value;
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key]);
  });
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (0 < compareResult || 0 == compareResult && opt_strict) {
      return!1;
    }
  }
  return!0;
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return!1;
  }
  for (var l = arr1.length, equalsFn = opt_equalsFn || goog.array.defaultCompareEquality, i = 0;i < l;i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return!1;
    }
  }
  return!0;
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  for (var compare = opt_compareFn || goog.array.defaultCompare, l = Math.min(arr1.length, arr2.length), i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if (0 != result) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return 0 > index ? (goog.array.insertAt(array, value, -(index + 1)), !0) : !1;
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return 0 <= index ? goog.array.removeAt(array, index) : !1;
};
goog.array.bucket = function(array, sorter, opt_obj) {
  for (var buckets = {}, i = 0;i < array.length;i++) {
    var value = array[i], key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }
  return buckets;
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
};
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [], start = 0, end = startOrEnd, step = opt_step || 1;
  void 0 !== opt_end && (start = startOrEnd, end = opt_end);
  if (0 > step * (end - start)) {
    return[];
  }
  if (0 < step) {
    for (var i = start;i < end;i += step) {
      array.push(i);
    }
  } else {
    for (i = start;i > end;i += step) {
      array.push(i);
    }
  }
  return array;
};
goog.array.repeat = function(value, n) {
  for (var array = [], i = 0;i < n;i++) {
    array[i] = value;
  }
  return array;
};
goog.array.flatten = function(var_args) {
  for (var result = [], i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    goog.isArray(element) ? result.push.apply(result, goog.array.flatten.apply(null, element)) : result.push(element);
  }
  return result;
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(null != array.length);
  array.length && (n %= array.length, 0 < n ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n)) : 0 > n && goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n)));
  return array;
};
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(0 <= fromIndex && fromIndex < arr.length);
  goog.asserts.assert(0 <= toIndex && toIndex < arr.length);
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
};
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return[];
  }
  for (var result = [], i = 0;;i++) {
    for (var value = [], j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  for (var randFn = opt_randFn || Math.random, i = arr.length - 1;0 < i;i--) {
    var j = Math.floor(randFn() * (i + 1)), tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
};
goog.structs = {};
goog.structs.Collection = function() {
};
goog.functions = {};
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
  };
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue) {
  return opt_returnValue;
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  };
};
goog.functions.fail = function(err) {
  return function() {
    throw err;
  };
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
  };
};
goog.functions.nth = function(n) {
  return function() {
    return arguments[n];
  };
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
};
goog.functions.compose = function(fn, var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    var result;
    length && (result = functions[length - 1].apply(this, arguments));
    for (var i = length - 2;0 <= i;i--) {
      result = functions[i].call(this, result);
    }
    return result;
  };
};
goog.functions.sequence = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var result, i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
  };
};
goog.functions.and = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (!functions[i].apply(this, arguments)) {
        return!1;
      }
    }
    return!0;
  };
};
goog.functions.or = function(var_args) {
  var functions = arguments, length = functions.length;
  return function() {
    for (var i = 0;i < length;i++) {
      if (functions[i].apply(this, arguments)) {
        return!0;
      }
    }
    return!1;
  };
};
goog.functions.not = function(f) {
  return function() {
    return!f.apply(this, arguments);
  };
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(fn) {
  var called = !1, value;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return fn();
    }
    called || (value = fn(), called = !0);
    return value;
  };
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return 0 > r * b ? r + b : r;
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a);
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6);
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360);
};
goog.math.standardAngleInRadians = function(angle) {
  return goog.math.modulo(angle, 2 * Math.PI);
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};
goog.math.toDegrees = function(angleRadians) {
  return 180 * angleRadians / Math.PI;
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees));
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees));
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
  return d;
};
goog.math.sign = function(x) {
  return 0 == x ? 0 : 0 > x ? -1 : 1;
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  for (var compare = opt_compareFn || function(a, b) {
    return a == b;
  }, collect = opt_collectorFn || function(i1) {
    return array1[i1];
  }, length1 = array1.length, length2 = array2.length, arr = [], i = 0;i < length1 + 1;i++) {
    arr[i] = [], arr[i][0] = 0;
  }
  for (var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0;
  }
  for (i = 1;i <= length1;i++) {
    for (j = 1;j <= length2;j++) {
      compare(array1[i - 1], array2[j - 1]) ? arr[i][j] = arr[i - 1][j - 1] + 1 : arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
    }
  }
  for (var result = [], i = length1, j = length2;0 < i && 0 < j;) {
    compare(array1[i - 1], array2[j - 1]) ? (result.unshift(collect(i - 1, j - 1)), i--, j--) : arr[i - 1][j] > arr[i][j - 1] ? i-- : j--;
  }
  return result;
};
goog.math.sum = function(var_args) {
  return goog.array.reduce(arguments, function(sum, value) {
    return sum + value;
  }, 0);
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(var_args) {
  var sampleSize = arguments.length;
  if (2 > sampleSize) {
    return 0;
  }
  var mean = goog.math.average.apply(null, arguments), variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2);
  })) / (sampleSize - 1);
  return variance;
};
goog.math.standardDeviation = function(var_args) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(num) {
  return isFinite(num) && 0 == num % 1;
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num);
};
goog.math.log10Floor = function(num) {
  if (0 < num) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (Math.pow(10, x) > num);
  }
  return 0 == num ? -Infinity : NaN;
};
goog.math.safeFloor = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || 0 < opt_epsilon);
  return Math.floor(num + (opt_epsilon || 2E-15));
};
goog.math.safeCeil = function(num, opt_epsilon) {
  goog.asserts.assert(!goog.isDef(opt_epsilon) || 0 < opt_epsilon);
  return Math.ceil(num - (opt_epsilon || 2E-15));
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this;
};
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if ("function" == typeof iterable.__iterator__) {
    return iterable.__iterator__(!1);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0, newIter = new goog.iter.Iterator;
    newIter.next = function() {
      for (;;) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if (i in iterable) {
          return iterable[i++];
        }
        i++;
      }
    };
    return newIter;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
    try {
      for (;;) {
        f.call(opt_obj, iterable.next(), void 0, iterable);
      }
    } catch (ex$$0) {
      if (ex$$0 !== goog.iter.StopIteration) {
        throw ex$$0;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    for (;;) {
      var val = iterator.next();
      if (f.call(opt_obj, val, void 0, iterator)) {
        return val;
      }
    }
  };
  return newIter;
};
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0, stop = startOrStop, step = opt_step || 1;
  1 < arguments.length && (start = startOrStop, stop = opt_stop);
  if (0 == step) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (0 < step && start >= stop || 0 > step && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
  };
  return newIter;
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, void 0, iterator);
  };
  return newIter;
};
goog.iter.reduce = function(iterable, f, val$$0, opt_obj) {
  var rval = val$$0;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;;) {
      if (f.call(opt_obj, iterable.next(), void 0, iterable)) {
        return!0;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return!1;
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    for (;;) {
      if (!f.call(opt_obj, iterable.next(), void 0, iterable)) {
        return!1;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return!0;
};
goog.iter.chain = function(var_args) {
  var iterator = goog.iter.toIterator(arguments), iter = new goog.iter.Iterator, current = null;
  iter.next = function() {
    for (;;) {
      if (null == current) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
  };
  return iter;
};
goog.iter.chainFromIterable = function(iterable) {
  return goog.iter.chain.apply(void 0, iterable);
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, dropping = !0;
  newIter.next = function() {
    for (;;) {
      var val = iterator.next();
      if (!dropping || !f.call(opt_obj, val, void 0, iterator)) {
        return dropping = !1, val;
      }
    }
  };
  return newIter;
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), newIter = new goog.iter.Iterator, taking = !0;
  newIter.next = function() {
    for (;;) {
      if (taking) {
        var val = iterator.next();
        if (f.call(opt_obj, val, void 0, iterator)) {
          return val;
        }
        taking = !1;
      } else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return newIter;
};
goog.iter.toArray = function(iterable) {
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable);
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
};
goog.iter.equals = function(iterable1, iterable2) {
  var fillValue = {}, pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
  return goog.iter.every(pairs, function(pair) {
    return pair[0] == pair[1];
  });
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return!arr.length;
  });
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var iter = new goog.iter.Iterator, arrays = arguments, indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if (indicies) {
      for (var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      }), i = indicies.length - 1;0 <= i;i--) {
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }
        if (0 == i) {
          indicies = null;
          break;
        }
        indicies[i] = 0;
      }
      return retVal;
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable), cache = [], cacheIndex = 0, iter = new goog.iter.Iterator, useCache = !1;
  iter.next = function() {
    var returnElement = null;
    if (!useCache) {
      try {
        return returnElement = baseIterator.next(), cache.push(returnElement), returnElement;
      } catch (e) {
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = !0;
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement;
  };
  return iter;
};
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0, step = goog.isDef(opt_step) ? opt_step : 1, iter = new goog.iter.Iterator;
  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
  };
  return iter;
};
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator;
  iter.next = goog.functions.constant(value);
  return iter;
};
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable), total = 0, iter = new goog.iter.Iterator;
  iter.next = function() {
    return total += iterator.next();
  };
  return iter;
};
goog.iter.zip = function(var_args) {
  var args = arguments, iter = new goog.iter.Iterator;
  if (0 < args.length) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var arr = goog.array.map(iterators, function(it) {
        return it.next();
      });
      return arr;
    };
  }
  return iter;
};
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1), iter = new goog.iter.Iterator;
  if (0 < args.length) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var iteratorsHaveValues = !1, arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next(), iteratorsHaveValues = !0;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });
      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
    };
  }
  return iter;
};
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);
  return goog.iter.filter(iterable, function() {
    return!!selectorIterator.next();
  });
};
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {
  this.iterator = goog.iter.toIterator(iterable);
  this.keyFunc = opt_keyFunc || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  for (;this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return[this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  for (var arr = [];this.currentKey == targetKey;) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
};
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
};
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator;
  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, void 0, iterator));
  };
  return iter;
};
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable), num = goog.isNumber(opt_num) ? opt_num : 2, buffers = goog.array.map(goog.array.range(num), function() {
    return[];
  }), addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
  }, createIterator = function(buffer) {
    var iter = new goog.iter.Iterator;
    iter.next = function() {
      goog.array.isEmpty(buffer) && addNextIteratorValueToBuffers();
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
    };
    return iter;
  };
  return goog.array.map(buffers, createIterator);
};
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
};
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && 0 <= limitSize);
  var iterator = goog.iter.toIterator(iterable), iter = new goog.iter.Iterator, remaining = limitSize;
  iter.next = function() {
    if (0 < remaining--) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
  };
  return iter;
};
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && 0 <= count);
  for (var iterator = goog.iter.toIterator(iterable);0 < count--;) {
    goog.iter.nextOrValue(iterator, null);
  }
  return iterator;
};
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && 0 <= start);
  var iterator = goog.iter.consume(iterable, start);
  goog.isNumber(opt_end) && (goog.asserts.assert(goog.math.isInt(opt_end) && opt_end >= start), iterator = goog.iter.limit(iterator, opt_end - start));
  return iterator;
};
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
};
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable), length = goog.isNumber(opt_length) ? opt_length : elements.length, sets = goog.array.repeat(elements, length), product = goog.iter.product.apply(void 0, sets);
  return goog.iter.filter(product, function(arr) {
    return!goog.iter.hasDuplicates_(arr);
  });
};
goog.iter.combinations = function(iterable, length) {
  function getIndexFromElements(index) {
    return elements[index];
  }
  var elements = goog.iter.toArray(iterable), indexes = goog.iter.range(elements.length), indexIterator = goog.iter.permutations(indexes, length), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.iter.combinationsWithReplacement = function(iterable, length) {
  function getIndexFromElements(index) {
    return elements[index];
  }
  var elements = goog.iter.toArray(iterable), indexes = goog.array.range(elements.length), sets = goog.array.repeat(indexes, length), indexIterator = goog.iter.product.apply(void 0, sets), sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  }), iter = new goog.iter.Iterator;
  iter.next = function() {
    return goog.array.map(sortedIndexIterator.next(), getIndexFromElements);
  };
  return iter;
};
goog.object = {};
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    f.call(opt_obj, obj[key], key, obj) && (res[key] = obj[key]);
  }
  return res;
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
};
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return!0;
    }
  }
  return!1;
};
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return!1;
    }
  }
  return!0;
};
goog.object.getCount = function(obj) {
  var rv = 0, key;
  for (key in obj) {
    rv++;
  }
  return rv;
};
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
};
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
};
goog.object.getValues = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = obj[key];
  }
  return res;
};
goog.object.getKeys = function(obj) {
  var res = [], i = 0, key;
  for (key in obj) {
    res[i++] = key;
  }
  return res;
};
goog.object.getValueByKeys = function(obj, var_args) {
  for (var isArrayLike = goog.isArrayLike(var_args), keys = isArrayLike ? var_args : arguments, i = isArrayLike ? 0 : 1;i < keys.length && (obj = obj[keys[i]], goog.isDef(obj));i++) {
  }
  return obj;
};
goog.object.containsKey = function(obj, key) {
  return key in obj;
};
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return!0;
    }
  }
  return!1;
};
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
};
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return!1;
  }
  return!0;
};
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  (rv = key in obj) && delete obj[key];
  return rv;
};
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
};
goog.object.get = function(obj, key, opt_val) {
  return key in obj ? obj[key] : opt_val;
};
goog.object.set = function(obj, key, value) {
  obj[key] = value;
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value;
};
goog.object.clone = function(obj) {
  var res = {}, key;
  for (key in obj) {
    res[key] = obj[key];
  }
  return res;
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if ("object" == type || "array" == type) {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = "array" == type ? [] : {}, key;
    for (key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.object.transpose = function(obj) {
  var transposed = {}, key;
  for (key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(target, var_args) {
  for (var key, source, i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }
    for (var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j], Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var rv = {}, i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (1 == argLength && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var rv = {}, i = 0;i < argLength;i++) {
    rv[arguments[i]] = !0;
  }
  return rv;
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  Object.isFrozen && !Object.isFrozen(obj) && (result = Object.create(obj), Object.freeze(result));
  return result;
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj);
};
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var argLength = arguments.length;
  if (1 < argLength) {
    if (argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else {
    opt_map && this.addAll(opt_map);
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var rv = [], i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  return rv;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
};
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return!0;
    }
  }
  return!1;
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return!0;
  }
  if (this.count_ != otherMap.getCount()) {
    return!1;
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var key, i = 0;key = this.keys_[i];i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return!1;
    }
  }
  return!0;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key) ? (delete this.map_[key], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var srcIndex = 0, destIndex = 0;srcIndex < this.keys_.length;) {
      var key = this.keys_[srcIndex];
      goog.structs.Map.hasKey_(this.map_, key) && (this.keys_[destIndex++] = key);
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
  if (this.count_ != this.keys_.length) {
    for (var seen = {}, destIndex = srcIndex = 0;srcIndex < this.keys_.length;) {
      key = this.keys_[srcIndex], goog.structs.Map.hasKey_(seen, key) || (this.keys_[destIndex++] = key, seen[key] = 1), srcIndex++;
    }
    this.keys_.length = destIndex;
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  return goog.structs.Map.hasKey_(this.map_, key) ? this.map_[key] : opt_val;
};
goog.structs.Map.prototype.set = function(key, value) {
  goog.structs.Map.hasKey_(this.map_, key) || (this.count_++, this.keys_.push(key), this.version_++);
  this.map_[key] = value;
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  map instanceof goog.structs.Map ? (keys = map.getKeys(), values = map.getValues()) : (keys = goog.object.getKeys(map), values = goog.object.getValues(map));
  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};
goog.structs.Map.prototype.forEach = function(f, opt_obj) {
  for (var keys = this.getKeys(), i = 0;i < keys.length;i++) {
    var key = keys[i], value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  for (var transposed = new goog.structs.Map, i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i], value = this.map_[key];
    transposed.set(value, key);
  }
  return transposed;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var obj = {}, i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0, keys = this.keys_, map = this.map_, version = this.version_, selfObj = this, newIter = new goog.iter.Iterator;
  newIter.next = function() {
    for (;;) {
      if (version != selfObj.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if (i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key];
    }
  };
  return newIter;
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
goog.structs.getCount = function(col) {
  return "function" == typeof col.getCount ? col.getCount() : goog.isArrayLike(col) || goog.isString(col) ? col.length : goog.object.getCount(col);
};
goog.structs.getValues = function(col) {
  if ("function" == typeof col.getValues) {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split("");
  }
  if (goog.isArrayLike(col)) {
    for (var rv = [], l = col.length, i = 0;i < l;i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
};
goog.structs.getKeys = function(col) {
  if ("function" == typeof col.getKeys) {
    return col.getKeys();
  }
  if ("function" != typeof col.getValues) {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      for (var rv = [], l = col.length, i = 0;i < l;i++) {
        rv.push(i);
      }
      return rv;
    }
    return goog.object.getKeys(col);
  }
};
goog.structs.contains = function(col, val) {
  return "function" == typeof col.contains ? col.contains(val) : "function" == typeof col.containsValue ? col.containsValue(val) : goog.isArrayLike(col) || goog.isString(col) ? goog.array.contains(col, val) : goog.object.containsValue(col, val);
};
goog.structs.isEmpty = function(col) {
  return "function" == typeof col.isEmpty ? col.isEmpty() : goog.isArrayLike(col) || goog.isString(col) ? goog.array.isEmpty(col) : goog.object.isEmpty(col);
};
goog.structs.clear = function(col) {
  "function" == typeof col.clear ? col.clear() : goog.isArrayLike(col) ? goog.array.clear(col) : goog.object.clear(col);
};
goog.structs.forEach = function(col, f, opt_obj) {
  if ("function" == typeof col.forEach) {
    col.forEach(f, opt_obj);
  } else {
    if (goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj);
    } else {
      for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col);
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if ("function" == typeof col.filter) {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      f.call(opt_obj, values[i], keys[i], col) && (rv[keys[i]] = values[i]);
    }
  } else {
    for (rv = [], i = 0;i < l;i++) {
      f.call(opt_obj, values[i], void 0, col) && rv.push(values[i]);
    }
  }
  return rv;
};
goog.structs.map = function(col, f, opt_obj) {
  if ("function" == typeof col.map) {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj);
  }
  var rv, keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
    }
  } else {
    for (rv = [], i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], void 0, col);
    }
  }
  return rv;
};
goog.structs.some = function(col, f, opt_obj) {
  if ("function" == typeof col.some) {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return!0;
    }
  }
  return!1;
};
goog.structs.every = function(col, f, opt_obj) {
  if ("function" == typeof col.every) {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj);
  }
  for (var keys = goog.structs.getKeys(col), values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return!1;
    }
  }
  return!0;
};
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  opt_values && this.addAll(opt_values);
};
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  return "object" == type && val || "function" == type ? "o" + goog.getUid(val) : type.substr(0, 1) + val;
};
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
};
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element);
};
goog.structs.Set.prototype.addAll = function(col) {
  for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    this.add(values[i]);
  }
};
goog.structs.Set.prototype.removeAll = function(col) {
  for (var values = goog.structs.getValues(col), l = values.length, i = 0;i < l;i++) {
    this.remove(values[i]);
  }
};
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
};
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element));
};
goog.structs.Set.prototype.difference = function(col) {
  var result = this.clone();
  result.removeAll(col);
  return result;
};
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
};
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
};
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if (this.getCount() > colCount) {
    return!1;
  }
  !(col instanceof goog.structs.Set) && 5 < colCount && (col = new goog.structs.Set(col));
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
};
goog.structs.Set.prototype.__iterator__ = function() {
  return this.map_.__iterator__(!1);
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var navigator = goog.labs.userAgent.util.getNavigator_();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(opt_userAgent) {
  goog.labs.userAgent.util.userAgent_ = opt_userAgent || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(userAgent, str);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(str) {
  var userAgent = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(userAgent, str);
};
goog.labs.userAgent.util.extractVersionTuples = function(userAgent) {
  for (var versionRegExp = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, data = [], match;match = versionRegExp.exec(userAgent);) {
    data.push([match[1], match[2], match[3] || void 0]);
  }
  return data;
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera") || goog.labs.userAgent.util.matchUserAgent("OPR");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS") && !goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS");
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !goog.labs.userAgent.util.matchUserAgent("Chrome") && !goog.labs.userAgent.util.matchUserAgent("CriOS");
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(userAgentString);
  }
  if (goog.labs.userAgent.browser.isOpera()) {
    return goog.labs.userAgent.browser.getOperaVersion_(userAgentString);
  }
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString);
  return goog.labs.userAgent.browser.getVersionFromTuples_(versionTuples);
};
goog.labs.userAgent.browser.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), version);
};
goog.labs.userAgent.browser.getIEVersion_ = function(userAgent) {
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }
  var version = "", msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if ("7.0" == msie[1]) {
      if (tridentVersion && tridentVersion[1]) {
        switch(tridentVersion[1]) {
          case "4.0":
            version = "8.0";
            break;
          case "5.0":
            version = "9.0";
            break;
          case "6.0":
            version = "10.0";
            break;
          case "7.0":
            version = "11.0";
        }
      } else {
        version = "7.0";
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};
goog.labs.userAgent.browser.getOperaVersion_ = function(userAgent) {
  var versionTuples = goog.labs.userAgent.util.extractVersionTuples(userAgent), lastTuple = goog.array.peek(versionTuples);
  return "OPR" == lastTuple[0] && lastTuple[1] ? lastTuple[1] : goog.labs.userAgent.browser.getVersionFromTuples_(versionTuples);
};
goog.labs.userAgent.browser.getVersionFromTuples_ = function(versionTuples) {
  goog.asserts.assert(2 < versionTuples.length, "Couldn't extract version tuple from user agent string");
  return versionTuples[2] && versionTuples[2][1] ? versionTuples[2][1] : "";
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit");
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident();
};
goog.labs.userAgent.engine.getVersion = function() {
  var userAgentString = goog.labs.userAgent.util.getUserAgent();
  if (userAgentString) {
    var tuples = goog.labs.userAgent.util.extractVersionTuples(userAgentString), engineTuple = tuples[1];
    if (engineTuple) {
      return "Gecko" == engineTuple[0] ? goog.labs.userAgent.engine.getVersionForKey_(tuples, "Firefox") : engineTuple[1];
    }
    var browserTuple = tuples[0], info;
    if (browserTuple && (info = browserTuple[2])) {
      var match = /Trident\/([^\s;]+)/.exec(info);
      if (match) {
        return match[1];
      }
    }
  }
  return "";
};
goog.labs.userAgent.engine.isVersionOrHigher = function(version) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), version);
};
goog.labs.userAgent.engine.getVersionForKey_ = function(tuples, key) {
  var pair$$0 = goog.array.find(tuples, function(pair) {
    return key == pair[0];
  });
  return pair$$0 && pair$$0[1] || "";
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator || null;
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var ua = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!ua && goog.string.contains(ua, "Android");
  goog.userAgent.detectedIPhone_ = !!ua && goog.string.contains(ua, "iPhone");
  goog.userAgent.detectedIPad_ = !!ua && goog.string.contains(ua, "iPad");
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if (goog.userAgent.OPERA && goog.global.opera) {
    var operaVersion = goog.global.opera.version;
    return goog.isFunction(operaVersion) ? operaVersion() : operaVersion;
  }
  goog.userAgent.GECKO ? re = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (re = /WebKit\/(\S+)/);
  if (re) {
    var arr = re.exec(goog.userAgent.getUserAgentString()), version = arr ? arr[1] : ""
  }
  if (goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }
  return version;
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global.document;
  return doc ? doc.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[version] || (goog.userAgent.isVersionOrHigherCache_[version] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, version));
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(documentMode) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= documentMode;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
var JSCompiler_inline_result$$0;
var doc$$inline_1 = goog.global.document;
if (doc$$inline_1 && goog.userAgent.IE) {
  var mode$$inline_2 = goog.userAgent.getDocumentMode_();
  JSCompiler_inline_result$$0 = mode$$inline_2 || ("CSS1Compat" == doc$$inline_1.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5);
} else {
  JSCompiler_inline_result$$0 = void 0;
}
goog.userAgent.DOCUMENT_MODE = JSCompiler_inline_result$$0;
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.catchErrors = function(logFunc, opt_cancel, opt_target) {
  var target = opt_target || goog.global, oldErrorHandler = target.onerror, retVal = !!opt_cancel;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (retVal = !retVal);
  target.onerror = function(message, url, line, opt_col, opt_error) {
    oldErrorHandler && oldErrorHandler(message, url, line, opt_col, opt_error);
    logFunc({message:message, fileName:url, line:line, col:opt_col, error:opt_error});
    return retVal;
  };
};
goog.debug.expose = function(obj, opt_showFn) {
  if ("undefined" == typeof obj) {
    return "undefined";
  }
  if (null == obj) {
    return "NULL";
  }
  var str = [], x;
  for (x in obj) {
    if (opt_showFn || !goog.isFunction(obj[x])) {
      var s = x + " = ";
      try {
        s += obj[x];
      } catch (e) {
        s += "*** " + e + " ***";
      }
      str.push(s);
    }
  }
  return str.join("\n");
};
goog.debug.deepExpose = function(obj$$0, opt_showFn) {
  var str = [], helper = function(obj, space, parentSeen) {
    var nestspace = space + "  ", seen = new goog.structs.Set(parentSeen);
    try {
      if (goog.isDef(obj)) {
        if (goog.isNull(obj)) {
          str.push("NULL");
        } else {
          if (goog.isString(obj)) {
            str.push('"' + obj.replace(/\n/g, "\n" + space) + '"');
          } else {
            if (goog.isFunction(obj)) {
              str.push(String(obj).replace(/\n/g, "\n" + space));
            } else {
              if (goog.isObject(obj)) {
                if (seen.contains(obj)) {
                  str.push("*** reference loop detected ***");
                } else {
                  seen.add(obj);
                  str.push("{");
                  for (var x in obj) {
                    if (opt_showFn || !goog.isFunction(obj[x])) {
                      str.push("\n"), str.push(nestspace), str.push(x + " = "), helper(obj[x], nestspace, seen);
                    }
                  }
                  str.push("\n" + space + "}");
                }
              } else {
                str.push(obj);
              }
            }
          }
        }
      } else {
        str.push("undefined");
      }
    } catch (e) {
      str.push("*** " + e + " ***");
    }
  };
  helper(obj$$0, "", new goog.structs.Set);
  return str.join("");
};
goog.debug.exposeArray = function(arr) {
  for (var str = [], i = 0;i < arr.length;i++) {
    goog.isArray(arr[i]) ? str.push(goog.debug.exposeArray(arr[i])) : str.push(arr[i]);
  }
  return "[ " + str.join(", ") + " ]";
};
goog.debug.exposeException = function(err, opt_fn) {
  try {
    var e = goog.debug.normalizeErrorObject(err), error = "Message: " + goog.string.htmlEscape(e.message) + '\nUrl: <a href="view-source:' + e.fileName + '" target="_new">' + e.fileName + "</a>\nLine: " + e.lineNumber + "\n\nBrowser stack:\n" + goog.string.htmlEscape(e.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + goog.string.htmlEscape(goog.debug.getStacktrace(opt_fn) + "-> ");
    return error;
  } catch (e2) {
    return "Exception trying to expose exception! You win, we lose. " + e2;
  }
};
goog.debug.normalizeErrorObject = function(err) {
  var href = goog.getObjectByName("window.location.href");
  if (goog.isString(err)) {
    return{message:err, name:"Unknown error", lineNumber:"Not available", fileName:href, stack:"Not available"};
  }
  var lineNumber, fileName, threwError = !1;
  try {
    lineNumber = err.lineNumber || err.line || "Not available";
  } catch (e) {
    lineNumber = "Not available", threwError = !0;
  }
  try {
    fileName = err.fileName || err.filename || err.sourceURL || goog.global.$googDebugFname || href;
  } catch (e$$0) {
    fileName = "Not available", threwError = !0;
  }
  return!threwError && err.lineNumber && err.fileName && err.stack && err.message && err.name ? err : {message:err.message || "Not available", name:err.name || "UnknownError", lineNumber:lineNumber, fileName:fileName, stack:err.stack || "Not available"};
};
goog.debug.enhanceError = function(err, opt_message) {
  var error;
  "string" == typeof err ? (error = Error(err), Error.captureStackTrace && Error.captureStackTrace(error, goog.debug.enhanceError)) : error = err;
  error.stack || (error.stack = goog.debug.getStacktrace(goog.debug.enhanceError));
  if (opt_message) {
    for (var x = 0;error["message" + x];) {
      ++x;
    }
    error["message" + x] = String(opt_message);
  }
  return error;
};
goog.debug.getStacktraceSimple = function(opt_depth) {
  if (goog.STRICT_MODE_COMPATIBLE) {
    var stack = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (stack) {
      return stack;
    }
  }
  for (var sb = [], fn = arguments.callee.caller, depth = 0;fn && (!opt_depth || depth < opt_depth);) {
    sb.push(goog.debug.getFunctionName(fn));
    sb.push("()\n");
    try {
      fn = fn.caller;
    } catch (e) {
      sb.push("[exception trying to get caller]\n");
      break;
    }
    depth++;
    if (depth >= goog.debug.MAX_STACK_DEPTH) {
      sb.push("[...long stack...]");
      break;
    }
  }
  opt_depth && depth >= opt_depth ? sb.push("[...reached max depth limit...]") : sb.push("[end]");
  return sb.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(fn) {
  var tempErr = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(tempErr, fn), String(tempErr.stack);
  }
  try {
    throw tempErr;
  } catch (e) {
    tempErr = e;
  }
  var stack = tempErr.stack;
  return stack ? String(stack) : null;
};
goog.debug.getStacktrace = function(opt_fn) {
  var stack;
  if (goog.STRICT_MODE_COMPATIBLE) {
    var contextFn = opt_fn || goog.debug.getStacktrace;
    stack = goog.debug.getNativeStackTrace_(contextFn);
  }
  stack || (stack = goog.debug.getStacktraceHelper_(opt_fn || arguments.callee.caller, []));
  return stack;
};
goog.debug.getStacktraceHelper_ = function(fn, visited) {
  var sb = [];
  if (goog.array.contains(visited, fn)) {
    sb.push("[...circular reference...]");
  } else {
    if (fn && visited.length < goog.debug.MAX_STACK_DEPTH) {
      sb.push(goog.debug.getFunctionName(fn) + "(");
      for (var args = fn.arguments, i = 0;args && i < args.length;i++) {
        0 < i && sb.push(", ");
        var argDesc, arg = args[i];
        switch(typeof arg) {
          case "object":
            argDesc = arg ? "object" : "null";
            break;
          case "string":
            argDesc = arg;
            break;
          case "number":
            argDesc = String(arg);
            break;
          case "boolean":
            argDesc = arg ? "true" : "false";
            break;
          case "function":
            argDesc = (argDesc = goog.debug.getFunctionName(arg)) ? argDesc : "[fn]";
            break;
          default:
            argDesc = typeof arg;
        }
        40 < argDesc.length && (argDesc = argDesc.substr(0, 40) + "...");
        sb.push(argDesc);
      }
      visited.push(fn);
      sb.push(")\n");
      try {
        sb.push(goog.debug.getStacktraceHelper_(fn.caller, visited));
      } catch (e) {
        sb.push("[exception trying to get caller]\n");
      }
    } else {
      fn ? sb.push("[...long stack...]") : sb.push("[end]");
    }
  }
  return sb.join("");
};
goog.debug.setFunctionResolver = function(resolver) {
  goog.debug.fnNameResolver_ = resolver;
};
goog.debug.getFunctionName = function(fn) {
  if (goog.debug.fnNameCache_[fn]) {
    return goog.debug.fnNameCache_[fn];
  }
  if (goog.debug.fnNameResolver_) {
    var name = goog.debug.fnNameResolver_(fn);
    if (name) {
      return goog.debug.fnNameCache_[fn] = name;
    }
  }
  var functionSource = String(fn);
  if (!goog.debug.fnNameCache_[functionSource]) {
    var matches = /function ([^\(]+)/.exec(functionSource);
    if (matches) {
      var method = matches[1];
      goog.debug.fnNameCache_[functionSource] = method;
    } else {
      goog.debug.fnNameCache_[functionSource] = "[Anonymous]";
    }
  }
  return goog.debug.fnNameCache_[functionSource];
};
goog.debug.makeWhitespaceVisible = function(string) {
  return string.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.fnNameCache_ = {};
goog.debug.LogRecord = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  this.reset(level, msg, loggerName, opt_time, opt_sequenceNumber);
};
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.prototype.exceptionText_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(level, msg, loggerName, opt_time, opt_sequenceNumber) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && ("number" == typeof opt_sequenceNumber || goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = opt_time || goog.now();
  this.level_ = level;
  this.msg_ = msg;
  this.loggerName_ = loggerName;
  delete this.exception_;
  delete this.exceptionText_;
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(exception) {
  this.exception_ = exception;
};
goog.debug.LogRecord.prototype.getExceptionText = function() {
  return this.exceptionText_;
};
goog.debug.LogRecord.prototype.setExceptionText = function(text) {
  this.exceptionText_ = text;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(level) {
  this.level_ = level;
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_;
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(level, msg, loggerName) {
  var curIndex = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = curIndex;
  if (this.isFull_) {
    var ret = this.buffer_[curIndex];
    ret.reset(level, msg, loggerName);
    return ret;
  }
  this.isFull_ = curIndex == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[curIndex] = new goog.debug.LogRecord(level, msg, loggerName);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1;
};
goog.debug.Logger = function(name) {
  this.name_ = name;
  this.handlers_ = this.children_ = this.level_ = this.parent_ = null;
};
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(name, value) {
  this.name = name;
  this.value = value;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1E3);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var i = 0, level;level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];i++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[level.value] = level, goog.debug.Logger.Level.predefinedLevelsCache_[level.name] = level;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(name) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[name] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(value) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if (value in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[value];
  }
  for (var i = 0;i < goog.debug.Logger.Level.PREDEFINED_LEVELS.length;++i) {
    var level = goog.debug.Logger.Level.PREDEFINED_LEVELS[i];
    if (level.value <= value) {
      return level;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(name) {
  return goog.debug.LogManager.getLogger(name);
};
goog.debug.Logger.logToProfilers = function(msg) {
  goog.global.console && (goog.global.console.timeStamp ? goog.global.console.timeStamp(msg) : goog.global.console.markTimeline && goog.global.console.markTimeline(msg));
  goog.global.msWriteProfilerMark && goog.global.msWriteProfilerMark(msg);
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(handler) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(handler)) : (goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootHandlers_.push(handler)));
};
goog.debug.Logger.prototype.removeHandler = function(handler) {
  if (goog.debug.LOGGING_ENABLED) {
    var handlers = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return!!handlers && goog.array.remove(handlers, handler);
  }
  return!1;
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  this.children_ || (this.children_ = {});
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(level) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = level : (goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootLevel_ = level));
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(level) {
  return goog.debug.LOGGING_ENABLED && level.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(level, msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(level) && (goog.isFunction(msg) && (msg = msg()), this.doLogRecord_(this.getLogRecord(level, msg, opt_exception, goog.debug.Logger.prototype.log)));
};
goog.debug.Logger.prototype.getLogRecord = function(level, msg, opt_exception, opt_fnStackContext) {
  var logRecord = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(level, msg, this.name_) : new goog.debug.LogRecord(level, String(msg), this.name_);
  opt_exception && (logRecord.setException(opt_exception), logRecord.setExceptionText(goog.debug.exposeException(opt_exception, opt_fnStackContext || goog.debug.Logger.prototype.getLogRecord)));
  return logRecord;
};
goog.debug.Logger.prototype.severe = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, msg, opt_exception);
};
goog.debug.Logger.prototype.warning = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.WARNING, msg, opt_exception);
};
goog.debug.Logger.prototype.info = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, msg, opt_exception);
};
goog.debug.Logger.prototype.config = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.CONFIG, msg, opt_exception);
};
goog.debug.Logger.prototype.fine = function(msg, opt_exception) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINE, msg, opt_exception);
};
goog.debug.Logger.prototype.doLogRecord_ = function(logRecord) {
  goog.debug.Logger.logToProfilers("log:" + logRecord.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    for (var target = this;target;) {
      target.callPublish_(logRecord), target = target.getParent();
    }
  } else {
    for (var i = 0, handler;handler = goog.debug.Logger.rootHandlers_[i++];) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(logRecord) {
  if (this.handlers_) {
    for (var i = 0, handler;handler = this.handlers_[i];i++) {
      handler(logRecord);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(parent) {
  this.parent_ = parent;
};
goog.debug.Logger.prototype.addChild_ = function(name, logger) {
  this.getChildren()[name] = logger;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(""), goog.debug.LogManager.loggers_[""] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG));
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_;
};
goog.debug.LogManager.getLogger = function(name) {
  goog.debug.LogManager.initialize();
  var ret = goog.debug.LogManager.loggers_[name];
  return ret || goog.debug.LogManager.createLogger_(name);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(opt_logger) {
  return function(info) {
    var logger = opt_logger || goog.debug.LogManager.getRoot();
    logger.severe("Error: " + info.message + " (" + info.fileName + " @ Line: " + info.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(name) {
  var logger = new goog.debug.Logger(name);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var lastDotIndex = name.lastIndexOf("."), parentName = name.substr(0, lastDotIndex), leafName = name.substr(lastDotIndex + 1), parentLogger = goog.debug.LogManager.getLogger(parentName);
    parentLogger.addChild_(leafName, logger);
    logger.setParent_(parentLogger);
  }
  return goog.debug.LogManager.loggers_[name] = logger;
};
goog.debug.Console = function() {
  this.publishHandler_ = goog.bind(this.addLogRecord, this);
  this.formatter_ = new goog.debug.TextFormatter;
  this.formatter_.showAbsoluteTime = !1;
  this.isCapturing_ = this.formatter_.showExceptionText = !1;
  this.logBuffer_ = "";
  this.filteredLoggers_ = {};
};
goog.debug.Console.prototype.setCapturing = function(capturing) {
  if (capturing != this.isCapturing_) {
    var rootLogger = goog.debug.LogManager.getRoot();
    capturing ? rootLogger.addHandler(this.publishHandler_) : rootLogger.removeHandler(this.publishHandler_);
    this.isCapturing_ = capturing;
  }
};
goog.debug.Console.prototype.addLogRecord = function(logRecord) {
  if (!this.filteredLoggers_[logRecord.getLoggerName()]) {
    var record = this.formatter_.formatRecord(logRecord), console = goog.debug.Console.console_;
    if (console) {
      switch(logRecord.getLevel()) {
        case goog.debug.Logger.Level.SHOUT:
          goog.debug.Console.logToConsole_(console, "info", record);
          break;
        case goog.debug.Logger.Level.SEVERE:
          goog.debug.Console.logToConsole_(console, "error", record);
          break;
        case goog.debug.Logger.Level.WARNING:
          goog.debug.Console.logToConsole_(console, "warn", record);
          break;
        default:
          goog.debug.Console.logToConsole_(console, "debug", record);
      }
    } else {
      window.opera ? window.opera.postError(record) : this.logBuffer_ += record;
    }
  }
};
goog.debug.Console.instance = null;
goog.debug.Console.console_ = window.console;
goog.debug.Console.setConsole = function(console) {
  goog.debug.Console.console_ = console;
};
goog.debug.Console.autoInstall = function() {
  goog.debug.Console.instance || (goog.debug.Console.instance = new goog.debug.Console);
  -1 != window.location.href.indexOf("Debug=true") && goog.debug.Console.instance.setCapturing(!0);
};
goog.debug.Console.show = function() {
  alert(goog.debug.Console.instance.logBuffer_);
};
goog.debug.Console.logToConsole_ = function(console, fnName, record) {
  if (console[fnName]) {
    console[fnName](record);
  } else {
    console.log(record);
  }
};
goog.i18n = {};
goog.i18n.DateTimeSymbols_en_ISO = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, y MMMM dd", "y MMMM d", "y MMM d", "yyyy-MM-dd"], TIMEFORMATS:["HH:mm:ss v", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], AVAILABLEFORMATS:{Md:"M/d", MMMMd:"MMMM d", MMMd:"MMM d"}, FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_af = {ERAS:["v.C.", "n.C."], ERANAMES:["voor Christus", "na Christus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januarie Februarie Maart April Mei Junie Julie Augustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Aug Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "), STANDALONEWEEKDAYS:"Sondag Maandag Dinsdag Woensdag Donderdag Vrydag Saterdag".split(" "), SHORTWEEKDAYS:"So Ma Di Wo Do Vr Sa".split(" "), STANDALONESHORTWEEKDAYS:"So Ma Di Wo Do Vr Sa".split(" "), NARROWWEEKDAYS:"SMDWDVS".split(""), STANDALONENARROWWEEKDAYS:"SMDWDVS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1ste kwartaal", "2de kwartaal", "3de kwartaal", "4de kwartaal"], AMPMS:["vm.", "nm."], DATEFORMATS:["EEEE dd MMMM y", 
"dd MMMM y", "dd MMM y", "y-MM-dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_am = {ERAS:["\u12d3/\u12d3", "\u12d3/\u121d"], ERANAMES:["\u12d3\u1218\u1270 \u12d3\u1208\u121d", "\u12d3\u1218\u1270 \u121d\u1215\u1228\u1275"], NARROWMONTHS:"\u1303\u134c\u121b\u12a4\u121c\u1301\u1301\u12a6\u1234\u12a6\u1296\u12f2".split(""), STANDALONENARROWMONTHS:"\u1303\u134c\u121b\u12a4\u121c\u1301\u1301\u12a6\u1234\u12a6\u1296\u12f2".split(""), MONTHS:"\u1303\u1295\u12e9\u12c8\u122a \u134c\u1265\u1229\u12c8\u122a \u121b\u122d\u127d \u12a4\u1355\u122a\u120d \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235\u1275 \u1234\u1355\u1274\u121d\u1260\u122d \u12a6\u12ad\u1270\u12cd\u1260\u122d \u1296\u126c\u121d\u1260\u122d \u12f2\u1234\u121d\u1260\u122d".split(" "), 
STANDALONEMONTHS:"\u1303\u1295\u12e9\u12c8\u122a \u134c\u1265\u1229\u12c8\u122a \u121b\u122d\u127d \u12a4\u1355\u122a\u120d \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235\u1275 \u1234\u1355\u1274\u121d\u1260\u122d \u12a6\u12ad\u1276\u1260\u122d \u1296\u126c\u121d\u1260\u122d \u12f2\u1234\u121d\u1260\u122d".split(" "), SHORTMONTHS:"\u1303\u1295\u12e9 \u134c\u1265\u1229 \u121b\u122d\u127d \u12a4\u1355\u122a \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235 \u1234\u1355\u1274 \u12a6\u12ad\u1270 \u1296\u126c\u121d \u12f2\u1234\u121d".split(" "), 
STANDALONESHORTMONTHS:"\u1303\u1295\u12e9 \u134c\u1265\u1229 \u121b\u122d\u127d \u12a4\u1355\u122a \u121c\u12ed \u1301\u1295 \u1301\u120b\u12ed \u12a6\u1308\u1235 \u1234\u1355\u1274 \u12a6\u12ad\u1276 \u1296\u126c\u121d \u12f2\u1234\u121d".split(" "), WEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230\u129e \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), STANDALONEWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230\u129e \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), 
SHORTWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230 \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), STANDALONESHORTWEEKDAYS:"\u12a5\u1211\u12f5 \u1230\u129e \u121b\u12ad\u1230 \u1228\u1261\u12d5 \u1210\u1219\u1235 \u12d3\u122d\u1265 \u1245\u12f3\u121c".split(" "), NARROWWEEKDAYS:"\u12a5\u1230\u121b\u1228\u1210\u12d3\u1245".split(""), STANDALONENARROWWEEKDAYS:"\u12a5\u1230\u121b\u1228\u1210\u12d3\u1245".split(""), SHORTQUARTERS:["\u1229\u12651", 
"\u1229\u12652", "\u1229\u12653", "\u1229\u12654"], QUARTERS:["1\u129b\u12cd \u1229\u1265", "\u1201\u1208\u1270\u129b\u12cd \u1229\u1265", "3\u129b\u12cd \u1229\u1265", "4\u129b\u12cd \u1229\u1265"], AMPMS:["\u1325\u12cb\u1275", "\u12a8\u1230\u12d3\u1275"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ar = {ZERODIGIT:1632, ERAS:["\u0642.\u0645", "\u0645"], ERANAMES:["\u0642\u0628\u0644 \u0627\u0644\u0645\u064a\u0644\u0627\u062f", "\u0645\u064a\u0644\u0627\u062f\u064a"], NARROWMONTHS:"\u064a\u0641\u0645\u0623\u0648\u0646\u0644\u063a\u0633\u0643\u0628\u062f".split(""), STANDALONENARROWMONTHS:"\u064a\u0641\u0645\u0623\u0648\u0646\u0644\u063a\u0633\u0643\u0628\u062f".split(""), MONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u064a\u0646\u0627\u064a\u0631 \u0641\u0628\u0631\u0627\u064a\u0631 \u0645\u0627\u0631\u0633 \u0623\u0628\u0631\u064a\u0644 \u0645\u0627\u064a\u0648 \u064a\u0648\u0646\u064a\u0648 \u064a\u0648\u0644\u064a\u0648 \u0623\u063a\u0633\u0637\u0633 \u0633\u0628\u062a\u0645\u0628\u0631 \u0623\u0643\u062a\u0648\u0628\u0631 \u0646\u0648\u0641\u0645\u0628\u0631 \u062f\u064a\u0633\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), 
STANDALONEWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), SHORTWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0627\u0644\u0623\u062d\u062f \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621 \u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621 \u0627\u0644\u062e\u0645\u064a\u0633 \u0627\u0644\u062c\u0645\u0639\u0629 \u0627\u0644\u0633\u0628\u062a".split(" "), NARROWWEEKDAYS:"\u062d\u0646\u062b\u0631\u062e\u062c\u0633".split(""), STANDALONENARROWWEEKDAYS:"\u062d\u0646\u062b\u0631\u062e\u062c\u0633".split(""), SHORTQUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", 
"\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], QUARTERS:["\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0623\u0648\u0644", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0646\u064a", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u062b\u0627\u0644\u062b", "\u0627\u0644\u0631\u0628\u0639 \u0627\u0644\u0631\u0627\u0628\u0639"], 
AMPMS:["\u0635", "\u0645"], DATEFORMATS:["EEEE\u060c d MMMM\u060c y", "d MMMM\u060c y", "dd\u200f/MM\u200f/y", "d\u200f/M\u200f/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:5, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:4};
goog.i18n.DateTimeSymbols_bg = {ERAS:["\u043f\u0440.\u0425\u0440.", "\u0441\u043b.\u0425\u0440."], ERANAMES:["\u043f\u0440.\u0425\u0440.", "\u0441\u043b.\u0425\u0440."], NARROWMONTHS:"\u044f\u0444\u043c\u0430\u043c\u044e\u044e\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u044f\u0444\u043c\u0430\u043c\u044e\u044e\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u044f\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), 
STANDALONEMONTHS:"\u044f\u043d\u0443\u0430\u0440\u0438 \u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438 \u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438 \u043d\u043e\u0435\u043c\u0432\u0440\u0438 \u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438".split(" "), SHORTMONTHS:"\u044f\u043d. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442 \u0430\u043f\u0440. \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u044f\u043d. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442 \u0430\u043f\u0440. \u043c\u0430\u0439 \u044e\u043d\u0438 \u044e\u043b\u0438 \u0430\u0432\u0433. \u0441\u0435\u043f\u0442. \u043e\u043a\u0442. \u043d\u043e\u0435\u043c. \u0434\u0435\u043a.".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u044f\u0434\u0430 \u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a \u043f\u0435\u0442\u044a\u043a \u0441\u044a\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u044f\u0434\u0430 \u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a \u043f\u0435\u0442\u044a\u043a \u0441\u044a\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0434 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0434 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0432\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["1 \u0442\u0440\u0438\u043c.", "2 \u0442\u0440\u0438\u043c.", "3 \u0442\u0440\u0438\u043c.", "4 \u0442\u0440\u0438\u043c."], QUARTERS:["1-\u0432\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "2-\u0440\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", "3-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435", 
"4-\u0442\u043e \u0442\u0440\u0438\u043c\u0435\u0441\u0435\u0447\u0438\u0435"], AMPMS:["\u043f\u0440.\u043e\u0431.", "\u0441\u043b.\u043e\u0431."], DATEFORMATS:["EEEE, d MMMM y '\u0433'.", "d MMMM y '\u0433'.", "d.MM.y '\u0433'.", "d.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_bn = {ZERODIGIT:2534, ERAS:["\u0996\u09cd\u09b0\u09bf\u09b8\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], ERANAMES:["\u0996\u09cd\u09b0\u09bf\u09b8\u09cd\u099f\u09aa\u09c2\u09b0\u09cd\u09ac", "\u0996\u09c3\u09b7\u09cd\u099f\u09be\u09ac\u09cd\u09a6"], NARROWMONTHS:"\u099c\u09be \u09ab\u09c7 \u09ae\u09be \u098f \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1 \u0986 \u09b8\u09c7 \u0985 \u09a8 \u09a1\u09bf".split(" "), STANDALONENARROWMONTHS:"\u099c\u09be \u09ab\u09c7 \u09ae\u09be \u098f \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1 \u0986 \u09b8\u09c7 \u0985 \u09a8 \u09a1\u09bf".split(" "), 
MONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
STANDALONEMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
SHORTMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
STANDALONESHORTMONTHS:"\u099c\u09be\u09a8\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ab\u09c7\u09ac\u09cd\u09b0\u09c1\u09af\u09bc\u09be\u09b0\u09c0 \u09ae\u09be\u09b0\u09cd\u099a \u098f\u09aa\u09cd\u09b0\u09bf\u09b2 \u09ae\u09c7 \u099c\u09c1\u09a8 \u099c\u09c1\u09b2\u09be\u0987 \u0986\u0997\u09b8\u09cd\u099f \u09b8\u09c7\u09aa\u09cd\u099f\u09c7\u09ae\u09cd\u09ac\u09b0 \u0985\u0995\u09cd\u099f\u09cb\u09ac\u09b0 \u09a8\u09ad\u09c7\u09ae\u09cd\u09ac\u09b0 \u09a1\u09bf\u09b8\u09c7\u09ae\u09cd\u09ac\u09b0".split(" "), 
WEEKDAYS:"\u09b0\u09ac\u09bf\u09ac\u09be\u09b0 \u09b8\u09cb\u09ae\u09ac\u09be\u09b0 \u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0 \u09ac\u09c1\u09a7\u09ac\u09be\u09b0 \u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0 \u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b6\u09a8\u09bf\u09ac\u09be\u09b0".split(" "), STANDALONEWEEKDAYS:"\u09b0\u09ac\u09bf\u09ac\u09be\u09b0 \u09b8\u09cb\u09ae\u09ac\u09be\u09b0 \u09ae\u0999\u09cd\u0997\u09b2\u09ac\u09be\u09b0 \u09ac\u09c1\u09a7\u09ac\u09be\u09b0 \u09ac\u09c3\u09b9\u09b7\u09cd\u09aa\u09a4\u09bf\u09ac\u09be\u09b0 \u09b6\u09c1\u0995\u09cd\u09b0\u09ac\u09be\u09b0 \u09b6\u09a8\u09bf\u09ac\u09be\u09b0".split(" "), 
SHORTWEEKDAYS:"\u09b0\u09ac\u09bf \u09b8\u09cb\u09ae \u09ae\u0999\u09cd\u0997\u09b2 \u09ac\u09c1\u09a7 \u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf \u09b6\u09c1\u0995\u09cd\u09b0 \u09b6\u09a8\u09bf".split(" "), STANDALONESHORTWEEKDAYS:"\u09b0\u09ac\u09bf \u09b8\u09cb\u09ae \u09ae\u0999\u09cd\u0997\u09b2 \u09ac\u09c1\u09a7 \u09ac\u09c3\u09b9\u09b8\u09cd\u09aa\u09a4\u09bf \u09b6\u09c1\u0995\u09cd\u09b0 \u09b6\u09a8\u09bf".split(" "), NARROWWEEKDAYS:"\u09b0 \u09b8\u09cb \u09ae \u09ac\u09c1 \u09ac\u09c3 \u09b6\u09c1 \u09b6".split(" "), 
STANDALONENARROWWEEKDAYS:"\u09b0 \u09b8\u09cb \u09ae \u09ac\u09c1 \u09ac\u09c3 \u09b6\u09c1 \u09b6".split(" "), SHORTQUARTERS:["\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e7", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e8", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09e9", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6 \u09ea"], QUARTERS:["\u09aa\u09cd\u09b0\u09a5\u09ae \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", 
"\u09a4\u09c3\u09a4\u09c0\u09af\u09bc \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6", "\u099a\u09a4\u09c1\u09b0\u09cd\u09a5 \u099a\u09a4\u09c1\u09b0\u09cd\u09a5\u09be\u0982\u09b6"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:4, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_br = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"Genver C\u02bchwevrer Meurzh Ebrel Mae Mezheven Gouere Eost Gwengolo Here Du Kerzu".split(" "), STANDALONEMONTHS:"Genver C\u02bchwevrer Meurzh Ebrel Mae Mezheven Gouere Eost Gwengolo Here Du Kerzu".split(" "), SHORTMONTHS:"Gen C\u02bchwe Meur Ebr Mae Mezh Goue Eost Gwen Here Du Ker".split(" "), STANDALONESHORTMONTHS:"Gen C\u02bchwe Meur Ebr Mae Mezh Goue Eost Gwen Here Du Ker".split(" "), 
WEEKDAYS:"Sul Lun Meurzh Merc\u02bcher Yaou Gwener Sadorn".split(" "), STANDALONEWEEKDAYS:"Sul Lun Meurzh Merc\u02bcher Yaou Gwener Sadorn".split(" "), SHORTWEEKDAYS:"sul lun meu. mer. yaou gwe. sad.".split(" "), STANDALONESHORTWEEKDAYS:"sul lun meu. mer. yaou gwe. sad.".split(" "), NARROWWEEKDAYS:"su lu mz mc ya gw sa".split(" "), STANDALONENARROWWEEKDAYS:"su lu mz mc ya gw sa".split(" "), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["y MMMM d, EEEE", 
"y MMMM d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ca = {ERAS:["aC", "dC"], ERANAMES:["abans de Crist", "despr\u00e9s de Crist"], NARROWMONTHS:"GN FB M\u00c7 AB MG JN JL AG ST OC NV DS".split(" "), STANDALONENARROWMONTHS:"GN FB M\u00c7 AB MG JN JL AG ST OC NV DS".split(" "), MONTHS:"gener febrer mar\u00e7 abril maig juny juliol agost setembre octubre novembre desembre".split(" "), STANDALONEMONTHS:"gener febrer mar\u00e7 abril maig juny juliol agost setembre octubre novembre desembre".split(" "), SHORTMONTHS:"gen. feb. mar\u00e7 abr. maig juny jul. ag. set. oct. nov. des.".split(" "), 
STANDALONESHORTMONTHS:"gen. feb. mar\u00e7 abr. maig juny jul. ag. set. oct. nov. des.".split(" "), WEEKDAYS:"diumenge dilluns dimarts dimecres dijous divendres dissabte".split(" "), STANDALONEWEEKDAYS:"diumenge dilluns dimarts dimecres dijous divendres dissabte".split(" "), SHORTWEEKDAYS:"dg. dl. dt. dc. dj. dv. ds.".split(" "), STANDALONESHORTWEEKDAYS:"dg. dl. dt. dc. dj. dv. ds.".split(" "), NARROWWEEKDAYS:"dg dl dt dc dj dv ds".split(" "), STANDALONENARROWWEEKDAYS:"dg dl dt dc dj dv ds".split(" "), 
SHORTQUARTERS:["1T", "2T", "3T", "4T"], QUARTERS:["1r trimestre", "2n trimestre", "3r trimestre", "4t trimestre"], AMPMS:["a. m.", "p. m."], DATEFORMATS:["EEEE, d MMMM 'de' y", "d MMMM 'de' y", "dd/MM/y", "d/M/yy"], TIMEFORMATS:["H.mm.ss zzzz", "H.mm.ss z", "H.mm.ss", "H.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_chr = {ERAS:["\u13a4\u13d3\u13b7\u13b8", "\u13a4\u13b6\u13d0\u13c5"], ERANAMES:["\u13cf \u13e5\u13cc \u13be\u13d5\u13b2\u13cd\u13ac\u13be", "\u13a0\u13a9\u13c3\u13ae\u13b5\u13d3\u13cd\u13d7\u13f1 \u13a0\u13d5\u13d8\u13f1\u13cd\u13ac \u13f1\u13b0\u13e9 \u13e7\u13d3\u13c2\u13b8\u13a2\u13cd\u13d7"], NARROWMONTHS:"\u13a4\u13a7\u13a0\u13a7\u13a0\u13d5\u13ab\u13a6\u13da\u13da\u13c5\u13a4".split(""), STANDALONENARROWMONTHS:"\u13a4\u13a7\u13a0\u13a7\u13a0\u13d5\u13ab\u13a6\u13da\u13da\u13c5\u13a4".split(""), 
MONTHS:"\u13a4\u13c3\u13b8\u13d4\u13c5 \u13a7\u13a6\u13b5 \u13a0\u13c5\u13f1 \u13a7\u13ec\u13c2 \u13a0\u13c2\u13cd\u13ac\u13d8 \u13d5\u13ad\u13b7\u13f1 \u13ab\u13f0\u13c9\u13c2 \u13a6\u13b6\u13c2 \u13da\u13b5\u13cd\u13d7 \u13da\u13c2\u13c5\u13d7 \u13c5\u13d3\u13d5\u13c6 \u13a4\u13cd\u13a9\u13f1".split(" "), STANDALONEMONTHS:"\u13a4\u13c3\u13b8\u13d4\u13c5 \u13a7\u13a6\u13b5 \u13a0\u13c5\u13f1 \u13a7\u13ec\u13c2 \u13a0\u13c2\u13cd\u13ac\u13d8 \u13d5\u13ad\u13b7\u13f1 \u13ab\u13f0\u13c9\u13c2 \u13a6\u13b6\u13c2 \u13da\u13b5\u13cd\u13d7 \u13da\u13c2\u13c5\u13d7 \u13c5\u13d3\u13d5\u13c6 \u13a4\u13cd\u13a9\u13f1".split(" "), 
SHORTMONTHS:"\u13a4\u13c3 \u13a7\u13a6 \u13a0\u13c5 \u13a7\u13ec \u13a0\u13c2 \u13d5\u13ad \u13ab\u13f0 \u13a6\u13b6 \u13da\u13b5 \u13da\u13c2 \u13c5\u13d3 \u13a4\u13cd".split(" "), STANDALONESHORTMONTHS:"\u13a4\u13c3 \u13a7\u13a6 \u13a0\u13c5 \u13a7\u13ec \u13a0\u13c2 \u13d5\u13ad \u13ab\u13f0 \u13a6\u13b6 \u13da\u13b5 \u13da\u13c2 \u13c5\u13d3 \u13a4\u13cd".split(" "), WEEKDAYS:"\u13a4\u13be\u13d9\u13d3\u13c6\u13cd\u13ac \u13a4\u13be\u13d9\u13d3\u13c9\u13c5\u13af \u13d4\u13b5\u13c1\u13a2\u13a6 \u13e6\u13a2\u13c1\u13a2\u13a6 \u13c5\u13a9\u13c1\u13a2\u13a6 \u13e7\u13be\u13a9\u13b6\u13cd\u13d7 \u13a4\u13be\u13d9\u13d3\u13c8\u13d5\u13be".split(" "), 
STANDALONEWEEKDAYS:"\u13a4\u13be\u13d9\u13d3\u13c6\u13cd\u13ac \u13a4\u13be\u13d9\u13d3\u13c9\u13c5\u13af \u13d4\u13b5\u13c1\u13a2\u13a6 \u13e6\u13a2\u13c1\u13a2\u13a6 \u13c5\u13a9\u13c1\u13a2\u13a6 \u13e7\u13be\u13a9\u13b6\u13cd\u13d7 \u13a4\u13be\u13d9\u13d3\u13c8\u13d5\u13be".split(" "), SHORTWEEKDAYS:"\u13c6\u13cd\u13ac \u13c9\u13c5\u13af \u13d4\u13b5\u13c1 \u13e6\u13a2\u13c1 \u13c5\u13a9\u13c1 \u13e7\u13be\u13a9 \u13c8\u13d5\u13be".split(" "), STANDALONESHORTWEEKDAYS:"\u13c6\u13cd\u13ac \u13c9\u13c5\u13af \u13d4\u13b5\u13c1 \u13e6\u13a2\u13c1 \u13c5\u13a9\u13c1 \u13e7\u13be\u13a9 \u13c8\u13d5\u13be".split(" "), 
NARROWWEEKDAYS:"\u13c6\u13c9\u13d4\u13e6\u13c5\u13e7\u13a4".split(""), STANDALONENARROWWEEKDAYS:"\u13c6\u13c9\u13d4\u13e6\u13c5\u13e7\u13a4".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["\u13cc\u13be\u13b4", "\u13d2\u13af\u13f1\u13a2\u13d7\u13e2"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_cs = {ERAS:["p\u0159. n. l.", "n. l."], ERANAMES:["p\u0159. n. l.", "n. l."], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"l\u00fabdk\u010d\u010dsz\u0159lp".split(""), MONTHS:"ledna \u00fanora b\u0159ezna dubna kv\u011btna \u010dervna \u010dervence srpna z\u00e1\u0159\u00ed \u0159\u00edjna listopadu prosince".split(" "), STANDALONEMONTHS:"leden \u00fanor b\u0159ezen duben kv\u011bten \u010derven \u010dervenec srpen z\u00e1\u0159\u00ed \u0159\u00edjen listopad prosinec".split(" "), 
SHORTMONTHS:"led \u00fano b\u0159e dub kv\u011b \u010dvn \u010dvc srp z\u00e1\u0159 \u0159\u00edj lis pro".split(" "), STANDALONESHORTMONTHS:"led \u00fano b\u0159e dub kv\u011b \u010dvn \u010dvc srp z\u00e1\u0159 \u0159\u00edj lis pro".split(" "), WEEKDAYS:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "), STANDALONEWEEKDAYS:"ned\u011ble pond\u011bl\u00ed \u00fater\u00fd st\u0159eda \u010dtvrtek p\u00e1tek sobota".split(" "), SHORTWEEKDAYS:"ne po \u00fat st \u010dt p\u00e1 so".split(" "), 
STANDALONESHORTWEEKDAYS:"ne po \u00fat st \u010dt p\u00e1 so".split(" "), NARROWWEEKDAYS:"NP\u00daS\u010cPS".split(""), STANDALONENARROWWEEKDAYS:"NP\u00daS\u010cPS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. \u010dtvrtlet\u00ed", "2. \u010dtvrtlet\u00ed", "3. \u010dtvrtlet\u00ed", "4. \u010dtvrtlet\u00ed"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. M. y", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", 
"{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_cy = {ERAS:["CC", "OC"], ERANAMES:["Cyn Crist", "Oed Crist"], NARROWMONTHS:"I Ch M E M M G A M H T Rh".split(" "), STANDALONENARROWMONTHS:"I Ch M E M M G A M H T Rh".split(" "), MONTHS:"Ionawr Chwefror Mawrth Ebrill Mai Mehefin Gorffennaf Awst Medi Hydref Tachwedd Rhagfyr".split(" "), STANDALONEMONTHS:"Ionawr Chwefror Mawrth Ebrill Mai Mehefin Gorffennaf Awst Medi Hydref Tachwedd Rhagfyr".split(" "), SHORTMONTHS:"Ion Chwef Mawrth Ebrill Mai Meh Gorff Awst Medi Hyd Tach Rhag".split(" "), 
STANDALONESHORTMONTHS:"Ion Chw Maw Ebr Mai Meh Gor Awst Medi Hyd Tach Rhag".split(" "), WEEKDAYS:"Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn".split(";"), STANDALONEWEEKDAYS:"Dydd Sul;Dydd Llun;Dydd Mawrth;Dydd Mercher;Dydd Iau;Dydd Gwener;Dydd Sadwrn".split(";"), SHORTWEEKDAYS:"Sul Llun Maw Mer Iau Gwen Sad".split(" "), STANDALONESHORTWEEKDAYS:"Sul Llun Maw Mer Iau Gwe Sad".split(" "), NARROWWEEKDAYS:"S Ll M M I G S".split(" "), STANDALONENARROWWEEKDAYS:"S Ll M M I G S".split(" "), 
SHORTQUARTERS:["Ch1", "Ch2", "Ch3", "Ch4"], QUARTERS:["Chwarter 1af", "2il chwarter", "3ydd chwarter", "4ydd chwarter"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'am' {0}", "{1} 'am' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_da = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar marts april maj juni juli august september oktober november december".split(" "), STANDALONEMONTHS:"januar februar marts april maj juni juli august september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mar. apr. maj jun. jul. aug. sep. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8n man tir ons tor fre l\u00f8r".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE 'den' d. MMMM y", "d. MMM y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} 'kl.' {0}", "{1} 'kl.' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), STANDALONEMONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), SHORTMONTHS:"Jan. Feb. M\u00e4rz Apr. Mai Juni Juli Aug. Sep. Okt. Nov. Dez.".split(" "), STANDALONESHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
WEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), STANDALONEWEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), SHORTWEEKDAYS:"So. Mo. Di. Mi. Do. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"So Mo Di Mi Do Fr Sa".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], 
DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_AT = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"J\u00e4nner Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), STANDALONEMONTHS:"J\u00e4nner Februar M\u00e4rz April Mai Juni Juli August September Oktober November Dezember".split(" "), SHORTMONTHS:"J\u00e4n. Feb. M\u00e4rz Apr. Mai Juni Juli Aug. Sep. Okt. Nov. Dez.".split(" "), 
STANDALONESHORTMONTHS:"J\u00e4n Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), WEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), STANDALONEWEEKDAYS:"Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag".split(" "), SHORTWEEKDAYS:"So. Mo. Di. Mi. Do. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"So Mo Di Mi Do Fr Sa".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], 
QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nachm."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_de_CH = goog.i18n.DateTimeSymbols_de;
goog.i18n.DateTimeSymbols_el = {ERAS:["\u03c0.\u03a7.", "\u03bc.\u03a7."], ERANAMES:["\u03c0.\u03a7.", "\u03bc.\u03a7."], NARROWMONTHS:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""), STANDALONENARROWMONTHS:"\u0399\u03a6\u039c\u0391\u039c\u0399\u0399\u0391\u03a3\u039f\u039d\u0394".split(""), MONTHS:"\u0399\u03b1\u03bd\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03b1\u03c1\u03af\u03bf\u03c5 \u039c\u03b1\u03c1\u03c4\u03af\u03bf\u03c5 \u0391\u03c0\u03c1\u03b9\u03bb\u03af\u03bf\u03c5 \u039c\u03b1\u0390\u03bf\u03c5 \u0399\u03bf\u03c5\u03bd\u03af\u03bf\u03c5 \u0399\u03bf\u03c5\u03bb\u03af\u03bf\u03c5 \u0391\u03c5\u03b3\u03bf\u03cd\u03c3\u03c4\u03bf\u03c5 \u03a3\u03b5\u03c0\u03c4\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u039f\u03ba\u03c4\u03c9\u03b2\u03c1\u03af\u03bf\u03c5 \u039d\u03bf\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5 \u0394\u03b5\u03ba\u03b5\u03bc\u03b2\u03c1\u03af\u03bf\u03c5".split(" "), 
STANDALONEMONTHS:"\u0399\u03b1\u03bd\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u03a6\u03b5\u03b2\u03c1\u03bf\u03c5\u03ac\u03c1\u03b9\u03bf\u03c2 \u039c\u03ac\u03c1\u03c4\u03b9\u03bf\u03c2 \u0391\u03c0\u03c1\u03af\u03bb\u03b9\u03bf\u03c2 \u039c\u03ac\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bd\u03b9\u03bf\u03c2 \u0399\u03bf\u03cd\u03bb\u03b9\u03bf\u03c2 \u0391\u03cd\u03b3\u03bf\u03c5\u03c3\u03c4\u03bf\u03c2 \u03a3\u03b5\u03c0\u03c4\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u039f\u03ba\u03c4\u03ce\u03b2\u03c1\u03b9\u03bf\u03c2 \u039d\u03bf\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2 \u0394\u03b5\u03ba\u03ad\u03bc\u03b2\u03c1\u03b9\u03bf\u03c2".split(" "), 
SHORTMONTHS:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03b1\u03c1 \u0391\u03c0\u03c1 \u039c\u03b1\u0390 \u0399\u03bf\u03c5\u03bd \u0399\u03bf\u03c5\u03bb \u0391\u03c5\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03b5 \u0394\u03b5\u03ba".split(" "), STANDALONESHORTMONTHS:"\u0399\u03b1\u03bd \u03a6\u03b5\u03b2 \u039c\u03ac\u03c1 \u0391\u03c0\u03c1 \u039c\u03ac\u03b9 \u0399\u03bf\u03cd\u03bd \u0399\u03bf\u03cd\u03bb \u0391\u03cd\u03b3 \u03a3\u03b5\u03c0 \u039f\u03ba\u03c4 \u039d\u03bf\u03ad \u0394\u03b5\u03ba".split(" "), 
WEEKDAYS:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "), STANDALONEWEEKDAYS:"\u039a\u03c5\u03c1\u03b9\u03b1\u03ba\u03ae \u0394\u03b5\u03c5\u03c4\u03ad\u03c1\u03b1 \u03a4\u03c1\u03af\u03c4\u03b7 \u03a4\u03b5\u03c4\u03ac\u03c1\u03c4\u03b7 \u03a0\u03ad\u03bc\u03c0\u03c4\u03b7 \u03a0\u03b1\u03c1\u03b1\u03c3\u03ba\u03b5\u03c5\u03ae \u03a3\u03ac\u03b2\u03b2\u03b1\u03c4\u03bf".split(" "), 
SHORTWEEKDAYS:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "), STANDALONESHORTWEEKDAYS:"\u039a\u03c5\u03c1 \u0394\u03b5\u03c5 \u03a4\u03c1\u03af \u03a4\u03b5\u03c4 \u03a0\u03ad\u03bc \u03a0\u03b1\u03c1 \u03a3\u03ac\u03b2".split(" "), NARROWWEEKDAYS:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""), STANDALONENARROWWEEKDAYS:"\u039a\u0394\u03a4\u03a4\u03a0\u03a0\u03a3".split(""), SHORTQUARTERS:["\u03a41", 
"\u03a42", "\u03a43", "\u03a44"], QUARTERS:["1\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "2\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "3\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf", "4\u03bf \u03c4\u03c1\u03af\u03bc\u03b7\u03bd\u03bf"], AMPMS:["\u03c0.\u03bc.", "\u03bc.\u03bc."], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} - {0}", "{1} - {0}", "{1} - {0}", "{1} - {0}"], 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_AU = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/MM/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_GB = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["am", "pm"], 
DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_en_IE = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["a.m.", "p.m."], 
DATEFORMATS:["EEEE d MMMM y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:2};
goog.i18n.DateTimeSymbols_en_IN = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "dd-MMM-y", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_SG = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_en_US = goog.i18n.DateTimeSymbols_en;
goog.i18n.DateTimeSymbols_en_ZA = {ERAS:["BC", "AD"], ERANAMES:["Before Christ", "Anno Domini"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"January February March April May June July August September October November December".split(" "), STANDALONEMONTHS:"January February March April May June July August September October November December".split(" "), SHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "), 
WEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), STANDALONEWEEKDAYS:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), SHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), STANDALONESHORTWEEKDAYS:"Sun Mon Tue Wed Thu Fri Sat".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"], AMPMS:["AM", "PM"], 
DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "dd MMM y", "y/MM/dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'at' {0}", "{1} 'at' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_es = {ERAS:["a. C.", "d. C."], ERANAMES:["antes de Cristo", "anno D\u00f3mini"], NARROWMONTHS:"EFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"EFMAMJJASOND".split(""), MONTHS:"enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split(" "), STANDALONEMONTHS:"Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre".split(" "), SHORTMONTHS:"ene. feb. mar. abr. may. jun. jul. ago. sept. oct. nov. dic.".split(" "), 
STANDALONESHORTMONTHS:"Ene. Feb. Mar. Abr. May. Jun. Jul. Ago. Sept. Oct. Nov. Dic.".split(" "), WEEKDAYS:"domingo lunes martes mi\u00e9rcoles jueves viernes s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"Domingo Lunes Martes Mi\u00e9rcoles Jueves Viernes S\u00e1bado".split(" "), SHORTWEEKDAYS:"dom. lun. mar. mi\u00e9. jue. vie. s\u00e1b.".split(" "), STANDALONESHORTWEEKDAYS:"Dom. Lun. Mar. Mi\u00e9. Jue. Vie. S\u00e1b.".split(" "), NARROWWEEKDAYS:"DLMXJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMXJVS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1.er trimestre", "2.\u00ba trimestre", "3.er trimestre", "4.\u00ba trimestre"], AMPMS:["a. m.", "p. m."], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "d/M/y", "d/M/yy"], TIMEFORMATS:["H:mm:ss (zzzz)", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_es_419 = goog.i18n.DateTimeSymbols_es;
goog.i18n.DateTimeSymbols_es_ES = goog.i18n.DateTimeSymbols_es;
goog.i18n.DateTimeSymbols_et = {ERAS:["e.m.a.", "m.a.j."], ERANAMES:["enne meie aega", "meie aja j\u00e4rgi"], NARROWMONTHS:"JVMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JVMAMJJASOND".split(""), MONTHS:"jaanuar veebruar m\u00e4rts aprill mai juuni juuli august september oktoober november detsember".split(" "), STANDALONEMONTHS:"jaanuar veebruar m\u00e4rts aprill mai juuni juuli august september oktoober november detsember".split(" "), SHORTMONTHS:"jaan veebr m\u00e4rts apr mai juuni juuli aug sept okt nov dets".split(" "), 
STANDALONESHORTMONTHS:"jaan veebr m\u00e4rts apr mai juuni juuli aug sept okt nov dets".split(" "), WEEKDAYS:"p\u00fchap\u00e4ev esmasp\u00e4ev teisip\u00e4ev kolmap\u00e4ev neljap\u00e4ev reede laup\u00e4ev".split(" "), STANDALONEWEEKDAYS:"p\u00fchap\u00e4ev esmasp\u00e4ev teisip\u00e4ev kolmap\u00e4ev neljap\u00e4ev reede laup\u00e4ev".split(" "), SHORTWEEKDAYS:"PETKNRL".split(""), STANDALONESHORTWEEKDAYS:"PETKNRL".split(""), NARROWWEEKDAYS:"PETKNRL".split(""), STANDALONENARROWWEEKDAYS:"PETKNRL".split(""), 
SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["H:mm.ss zzzz", "H:mm.ss z", "H:mm.ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_eu = {ERAS:["K.a.", "K.o."], ERANAMES:["K.a.", "K.o."], NARROWMONTHS:"UOMAMEUAIUAA".split(""), STANDALONENARROWMONTHS:"UOMAMEUAIUAA".split(""), MONTHS:"urtarrilak otsailak martxoak apirilak maiatzak ekainak uztailak abuztuak irailak urriak azaroak abenduak".split(" "), STANDALONEMONTHS:"urtarrila otsaila martxoa apirila maiatza ekaina uztaila abuztua iraila urria azaroa abendua".split(" "), SHORTMONTHS:"urt. ots. mar. api. mai. eka. uzt. abu. ira. urr. aza. abe.".split(" "), 
STANDALONESHORTMONTHS:"urt. ots. mar. api. mai. eka. uzt. abu. ira. urr. aza. abe.".split(" "), WEEKDAYS:"igandea astelehena asteartea asteazkena osteguna ostirala larunbata".split(" "), STANDALONEWEEKDAYS:"igandea astelehena asteartea asteazkena osteguna ostirala larunbata".split(" "), SHORTWEEKDAYS:"ig. al. ar. az. og. or. lr.".split(" "), STANDALONESHORTWEEKDAYS:"ig. al. ar. az. og. or. lr.".split(" "), NARROWWEEKDAYS:"IAAAOOL".split(""), STANDALONENARROWWEEKDAYS:"IAAAOOL".split(""), SHORTQUARTERS:["1Hh", 
"2Hh", "3Hh", "4Hh"], QUARTERS:["1. hiruhilekoa", "2. hiruhilekoa", "3. hiruhilekoa", "4. hiruhilekoa"], AMPMS:["AM", "PM"], DATEFORMATS:["y('e')'ko' MMMM d, EEEE", "y('e')'ko' MMMM d", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fa = {ZERODIGIT:1776, ERAS:["\u0642.\u0645.", "\u0645."], ERANAMES:["\u0642\u0628\u0644 \u0627\u0632 \u0645\u06cc\u0644\u0627\u062f", "\u0645\u06cc\u0644\u0627\u062f\u06cc"], NARROWMONTHS:"\u0698\u0641\u0645\u0622\u0645\u0698\u0698\u0627\u0633\u0627\u0646\u062f".split(""), STANDALONENARROWMONTHS:"\u0698\u0641\u0645\u0622\u0645\u0698\u0698\u0627\u0633\u0627\u0646\u062f".split(""), MONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647\u0654 \u0641\u0648\u0631\u06cc\u0647\u0654 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647\u0654 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647\u0654 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647 \u0641\u0648\u0631\u06cc\u0647 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647\u0654 \u0641\u0648\u0631\u06cc\u0647\u0654 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647\u0654 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647\u0654 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u0698\u0627\u0646\u0648\u06cc\u0647 \u0641\u0648\u0631\u06cc\u0647 \u0645\u0627\u0631\u0633 \u0622\u0648\u0631\u06cc\u0644 \u0645\u0647 \u0698\u0648\u0626\u0646 \u0698\u0648\u0626\u06cc\u0647 \u0627\u0648\u062a \u0633\u067e\u062a\u0627\u0645\u0628\u0631 \u0627\u06a9\u062a\u0628\u0631 \u0646\u0648\u0627\u0645\u0628\u0631 \u062f\u0633\u0627\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), 
STANDALONEWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), SHORTWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), 
STANDALONESHORTWEEKDAYS:"\u06cc\u06a9\u0634\u0646\u0628\u0647 \u062f\u0648\u0634\u0646\u0628\u0647 \u0633\u0647\u200c\u0634\u0646\u0628\u0647 \u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647 \u067e\u0646\u062c\u0634\u0646\u0628\u0647 \u062c\u0645\u0639\u0647 \u0634\u0646\u0628\u0647".split(" "), NARROWWEEKDAYS:"\u06cc\u062f\u0633\u0686\u067e\u062c\u0634".split(""), STANDALONENARROWWEEKDAYS:"\u06cc\u062f\u0633\u0686\u067e\u062c\u0634".split(""), SHORTQUARTERS:["\u0633\u200c\u0645\u06f1", "\u0633\u200c\u0645\u06f2", 
"\u0633\u200c\u0645\u06f3", "\u0633\u200c\u0645\u06f4"], QUARTERS:["\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0627\u0648\u0644", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u062f\u0648\u0645", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0633\u0648\u0645", "\u0633\u0647\u200c\u0645\u0627\u0647\u0647\u0654 \u0686\u0647\u0627\u0631\u0645"], AMPMS:["\u0642\u0628\u0644\u200c\u0627\u0632\u0638\u0647\u0631", "\u0628\u0639\u062f\u0627\u0632\u0638\u0647\u0631"], DATEFORMATS:["EEEE d MMMM y", 
"d MMMM y", "d MMM y", "y/M/d"], TIMEFORMATS:["H:mm:ss (zzzz)", "H:mm:ss (z)", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}\u060c \u0633\u0627\u0639\u062a {0}", "{1}\u060c \u0633\u0627\u0639\u062a {0}", "{1}\u060c\u200f {0}", "{1}\u060c\u200f {0}"], FIRSTDAYOFWEEK:5, WEEKENDRANGE:[3, 4], FIRSTWEEKCUTOFFDAY:4};
goog.i18n.DateTimeSymbols_fi = {ERAS:["eKr.", "jKr."], ERANAMES:["ennen Kristuksen syntym\u00e4\u00e4", "j\u00e4lkeen Kristuksen syntym\u00e4n"], NARROWMONTHS:"THMHTKHESLMJ".split(""), STANDALONENARROWMONTHS:"THMHTKHESLMJ".split(""), MONTHS:"tammikuuta helmikuuta maaliskuuta huhtikuuta toukokuuta kes\u00e4kuuta hein\u00e4kuuta elokuuta syyskuuta lokakuuta marraskuuta joulukuuta".split(" "), STANDALONEMONTHS:"tammikuu helmikuu maaliskuu huhtikuu toukokuu kes\u00e4kuu hein\u00e4kuu elokuu syyskuu lokakuu marraskuu joulukuu".split(" "), 
SHORTMONTHS:"tammikuuta helmikuuta maaliskuuta huhtikuuta toukokuuta kes\u00e4kuuta hein\u00e4kuuta elokuuta syyskuuta lokakuuta marraskuuta joulukuuta".split(" "), STANDALONESHORTMONTHS:"tammi helmi maalis huhti touko kes\u00e4 hein\u00e4 elo syys loka marras joulu".split(" "), WEEKDAYS:"sunnuntaina maanantaina tiistaina keskiviikkona torstaina perjantaina lauantaina".split(" "), STANDALONEWEEKDAYS:"sunnuntai maanantai tiistai keskiviikko torstai perjantai lauantai".split(" "), SHORTWEEKDAYS:"su ma ti ke to pe la".split(" "), 
STANDALONESHORTWEEKDAYS:"su ma ti ke to pe la".split(" "), NARROWWEEKDAYS:"SMTKTPL".split(""), STANDALONENARROWWEEKDAYS:"SMTKTPL".split(""), SHORTQUARTERS:["1. nelj.", "2. nelj.", "3. nelj.", "4. nelj."], QUARTERS:["1. nelj\u00e4nnes", "2. nelj\u00e4nnes", "3. nelj\u00e4nnes", "4. nelj\u00e4nnes"], AMPMS:["ap.", "ip."], DATEFORMATS:["cccc d. MMMM y", "d. MMMM y", "d.M.y", "d.M.y"], TIMEFORMATS:["H.mm.ss zzzz", "H.mm.ss z", "H.mm.ss", "H.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], 
FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fil = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"EPMAMHHASOND".split(""), STANDALONENARROWMONTHS:"EPMAMHHASOND".split(""), MONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), STANDALONEMONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), SHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), STANDALONESHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), 
WEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), STANDALONEWEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), SHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), STANDALONESHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), NARROWWEEKDAYS:"LLMMHBS".split(""), STANDALONENARROWWEEKDAYS:"LLMMHBS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ika-1 quarter", "ika-2 quarter", "ika-3 quarter", "ika-4 na quarter"], AMPMS:["AM", 
"PM"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'ng' {0}", "{1} 'ng' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_fr = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), STANDALONEMONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), SHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), 
STANDALONESHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), WEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), STANDALONEWEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), SHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), STANDALONESHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_fr_CA = {ERAS:["av. J.-C.", "ap. J.-C."], ERANAMES:["avant J\u00e9sus-Christ", "apr\u00e8s J\u00e9sus-Christ"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), STANDALONEMONTHS:"janvier f\u00e9vrier mars avril mai juin juillet ao\u00fbt septembre octobre novembre d\u00e9cembre".split(" "), SHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), 
STANDALONESHORTMONTHS:"janv. f\u00e9vr. mars avr. mai juin juil. ao\u00fbt sept. oct. nov. d\u00e9c.".split(" "), WEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), STANDALONEWEEKDAYS:"dimanche lundi mardi mercredi jeudi vendredi samedi".split(" "), SHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), STANDALONESHORTWEEKDAYS:"dim. lun. mar. mer. jeu. ven. sam.".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1er trimestre", "2e trimestre", "3e trimestre", "4e trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "y-MM-dd", "yy-MM-dd"], TIMEFORMATS:["HH 'h' mm 'min' ss 's' zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_gl = {ERAS:["a.C.", "d.C."], ERANAMES:["antes de Cristo", "despois de Cristo"], NARROWMONTHS:"XFMAMXXASOND".split(""), STANDALONENARROWMONTHS:"XFMAMXXASOND".split(""), MONTHS:"xaneiro febreiro marzo abril maio xu\u00f1o xullo agosto setembro outubro novembro decembro".split(" "), STANDALONEMONTHS:"Xaneiro Febreiro Marzo Abril Maio Xu\u00f1o Xullo Agosto Setembro Outubro Novembro Decembro".split(" "), SHORTMONTHS:"xan feb mar abr mai xu\u00f1 xul ago set out nov dec".split(" "), 
STANDALONESHORTMONTHS:"Xan Feb Mar Abr Mai Xu\u00f1 Xul Ago Set Out Nov Dec".split(" "), WEEKDAYS:"domingo luns martes m\u00e9rcores xoves venres s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"Domingo Luns Martes M\u00e9rcores Xoves Venres S\u00e1bado".split(" "), SHORTWEEKDAYS:"dom lun mar m\u00e9r xov ven s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"Dom Lun Mar M\u00e9r Xov Ven S\u00e1b".split(" "), NARROWWEEKDAYS:"DLMMXVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMXVS".split(""), SHORTQUARTERS:["T1", 
"T2", "T3", "T4"], QUARTERS:["1o trimestre", "2o trimestre", "3o trimestre", "4o trimestre"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE dd MMMM y", "dd MMMM y", "d MMM, y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gsw = {ERAS:["v. Chr.", "n. Chr."], ERANAMES:["v. Chr.", "n. Chr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli Auguscht Sept\u00e4mber Oktoober Nov\u00e4mber Dez\u00e4mber".split(" "), STANDALONEMONTHS:"Januar Februar M\u00e4rz April Mai Juni Juli Auguscht Sept\u00e4mber Oktoober Nov\u00e4mber Dez\u00e4mber".split(" "), SHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"Jan Feb M\u00e4r Apr Mai Jun Jul Aug Sep Okt Nov Dez".split(" "), WEEKDAYS:"Sunntig M\u00e4\u00e4ntig Ziischtig Mittwuch Dunschtig Friitig Samschtig".split(" "), STANDALONEWEEKDAYS:"Sunntig M\u00e4\u00e4ntig Ziischtig Mittwuch Dunschtig Friitig Samschtig".split(" "), SHORTWEEKDAYS:"Su. M\u00e4. Zi. Mi. Du. Fr. Sa.".split(" "), STANDALONESHORTWEEKDAYS:"Su. M\u00e4. Zi. Mi. Du. Fr. Sa.".split(" "), NARROWWEEKDAYS:"SMDMDFS".split(""), STANDALONENARROWWEEKDAYS:"SMDMDFS".split(""), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["1. Quartal", "2. Quartal", "3. Quartal", "4. Quartal"], AMPMS:["vorm.", "nam."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "dd.MM.y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_gu = {ERAS:["\u0a88\u0ab8\u0ac1\u0aa8\u0abe \u0a9c\u0aa8\u0acd\u0aae \u0aaa\u0ab9\u0ac7\u0ab2\u0abe", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], ERANAMES:["\u0a88\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8 \u0aaa\u0ac2\u0ab0\u0acd\u0ab5\u0ac7", "\u0a87\u0ab8\u0ab5\u0ac0\u0ab8\u0aa8"], NARROWMONTHS:"\u0a9c\u0abe \u0aab\u0ac7 \u0aae\u0abe \u0a8f \u0aae\u0ac7 \u0a9c\u0ac2 \u0a9c\u0ac1 \u0a91 \u0ab8 \u0a91 \u0aa8 \u0aa1\u0abf".split(" "), STANDALONENARROWMONTHS:"\u0a9c\u0abe \u0aab\u0ac7 \u0aae\u0abe \u0a8f \u0aae\u0ac7 \u0a9c\u0ac2 \u0a9c\u0ac1 \u0a91 \u0ab8 \u0a91 \u0aa8 \u0aa1\u0abf".split(" "), 
MONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0".split(" "), STANDALONEMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1\u0a86\u0ab0\u0ac0 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1\u0a86\u0ab0\u0ac0 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0a91\u0a95\u0acd\u0a9f\u0acb\u0aac\u0ab0 \u0aa8\u0ab5\u0ac7\u0aae\u0acd\u0aac\u0ab0 \u0aa1\u0abf\u0ab8\u0ac7\u0aae\u0acd\u0aac\u0ab0".split(" "), 
SHORTMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97\u0ab8\u0acd\u0a9f \u0ab8\u0aaa\u0acd\u0a9f\u0ac7 \u0a91\u0a95\u0acd\u0a9f\u0acb \u0aa8\u0ab5\u0ac7 \u0aa1\u0abf\u0ab8\u0ac7".split(" "), STANDALONESHORTMONTHS:"\u0a9c\u0abe\u0aa8\u0acd\u0aaf\u0ac1 \u0aab\u0ac7\u0aac\u0acd\u0ab0\u0ac1 \u0aae\u0abe\u0ab0\u0acd\u0a9a \u0a8f\u0aaa\u0acd\u0ab0\u0abf\u0ab2 \u0aae\u0ac7 \u0a9c\u0ac2\u0aa8 \u0a9c\u0ac1\u0ab2\u0abe\u0a88 \u0a91\u0a97 \u0ab8\u0aaa\u0acd\u0a9f\u0ac7 \u0a91\u0a95\u0acd\u0a9f\u0acb \u0aa8\u0ab5\u0ac7 \u0aa1\u0abf\u0ab8\u0ac7".split(" "), 
WEEKDAYS:"\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0 \u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0 \u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0 \u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0 \u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0 \u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0 \u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0".split(" "), STANDALONEWEEKDAYS:"\u0ab0\u0ab5\u0abf\u0ab5\u0abe\u0ab0 \u0ab8\u0acb\u0aae\u0ab5\u0abe\u0ab0 \u0aae\u0a82\u0a97\u0ab3\u0ab5\u0abe\u0ab0 \u0aac\u0ac1\u0aa7\u0ab5\u0abe\u0ab0 \u0a97\u0ac1\u0ab0\u0ac1\u0ab5\u0abe\u0ab0 \u0ab6\u0ac1\u0a95\u0acd\u0ab0\u0ab5\u0abe\u0ab0 \u0ab6\u0aa8\u0abf\u0ab5\u0abe\u0ab0".split(" "), 
SHORTWEEKDAYS:"\u0ab0\u0ab5\u0abf \u0ab8\u0acb\u0aae \u0aae\u0a82\u0a97\u0ab3 \u0aac\u0ac1\u0aa7 \u0a97\u0ac1\u0ab0\u0ac1 \u0ab6\u0ac1\u0a95\u0acd\u0ab0 \u0ab6\u0aa8\u0abf".split(" "), STANDALONESHORTWEEKDAYS:"\u0ab0\u0ab5\u0abf \u0ab8\u0acb\u0aae \u0aae\u0a82\u0a97\u0ab3 \u0aac\u0ac1\u0aa7 \u0a97\u0ac1\u0ab0\u0ac1 \u0ab6\u0ac1\u0a95\u0acd\u0ab0 \u0ab6\u0aa8\u0abf".split(" "), NARROWWEEKDAYS:"\u0ab0 \u0ab8\u0acb \u0aae\u0a82 \u0aac\u0ac1 \u0a97\u0ac1 \u0ab6\u0ac1 \u0ab6".split(" "), STANDALONENARROWWEEKDAYS:"\u0ab0 \u0ab8\u0acb \u0aae\u0a82 \u0aac\u0ac1 \u0a97\u0ac1 \u0ab6\u0ac1 \u0ab6".split(" "), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u0aaa\u0ab9\u0ac7\u0ab2\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8", "\u0aac\u0ac0\u0a9c\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8", "\u0aa4\u0acd\u0ab0\u0ac0\u0a9c\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8", "\u0a9a\u0acb\u0aa5\u0acb \u0aa4\u0acd\u0ab0\u0abf\u0aae\u0abe\u0ab8"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-MM-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", 
"hh:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_haw = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"Ianuali Pepeluali Malaki \u02bbApelila Mei Iune Iulai \u02bbAukake Kepakemapa \u02bbOkakopa Nowemapa Kekemapa".split(" "), STANDALONEMONTHS:"Ianuali Pepeluali Malaki \u02bbApelila Mei Iune Iulai \u02bbAukake Kepakemapa \u02bbOkakopa Nowemapa Kekemapa".split(" "), SHORTMONTHS:"Ian. Pep. Mal. \u02bbAp. Mei Iun. Iul. \u02bbAu. Kep. \u02bbOk. Now. Kek.".split(" "), 
STANDALONESHORTMONTHS:"Ian. Pep. Mal. \u02bbAp. Mei Iun. Iul. \u02bbAu. Kep. \u02bbOk. Now. Kek.".split(" "), WEEKDAYS:"L\u0101pule Po\u02bbakahi Po\u02bbalua Po\u02bbakolu Po\u02bbah\u0101 Po\u02bbalima Po\u02bbaono".split(" "), STANDALONEWEEKDAYS:"L\u0101pule Po\u02bbakahi Po\u02bbalua Po\u02bbakolu Po\u02bbah\u0101 Po\u02bbalima Po\u02bbaono".split(" "), SHORTWEEKDAYS:"LP P1 P2 P3 P4 P5 P6".split(" "), STANDALONESHORTWEEKDAYS:"LP P1 P2 P3 P4 P5 P6".split(" "), NARROWWEEKDAYS:"SMTWTFS".split(""), 
STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_he = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), 
STANDALONEMONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), SHORTMONTHS:"\u05d9\u05e0\u05d5 \u05e4\u05d1\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0 \u05d9\u05d5\u05dc \u05d0\u05d5\u05d2 \u05e1\u05e4\u05d8 \u05d0\u05d5\u05e7 \u05e0\u05d5\u05d1 \u05d3\u05e6\u05de".split(" "), 
STANDALONESHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05f3 \u05d9\u05d5\u05dc\u05f3 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), WEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), 
STANDALONEWEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), SHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), 
STANDALONESHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), NARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), STANDALONENARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", 
"\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6", "\u05d0\u05d7\u05d4\u05f4\u05e6"], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "d \u05d1MMM y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} \u05d1\u05e9\u05e2\u05d4 {0}", 
"{1} \u05d1\u05e9\u05e2\u05d4 {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_hi = {ERAS:["\u0908\u0938\u093e-\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u094d\u0935\u0940"], ERANAMES:["\u0908\u0938\u093e-\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u094d\u0935\u0940"], NARROWMONTHS:"\u091c \u092b\u093c \u092e\u093e \u0905 \u092e \u091c\u0942 \u091c\u0941 \u0905 \u0938\u093f \u0905 \u0928 \u0926\u093f".split(" "), STANDALONENARROWMONTHS:"\u091c \u092b\u093c \u092e\u093e \u0905 \u092e \u091c\u0942 \u091c\u0941 \u0905 \u0938\u093f \u0905 \u0928 \u0926\u093f".split(" "), 
MONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u093c\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u0902\u092c\u0930 \u0905\u0915\u094d\u091f\u0942\u092c\u0930 \u0928\u0935\u0902\u092c\u0930 \u0926\u093f\u0938\u0902\u092c\u0930".split(" "), STANDALONEMONTHS:"\u091c\u0928\u0935\u0930\u0940 \u092b\u093c\u0930\u0935\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948\u0932 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e\u0908 \u0905\u0917\u0938\u094d\u0924 \u0938\u093f\u0924\u0902\u092c\u0930 \u0905\u0915\u094d\u091f\u0942\u092c\u0930 \u0928\u0935\u0902\u092c\u0930 \u0926\u093f\u0938\u0902\u092c\u0930".split(" "), 
SHORTMONTHS:"\u091c\u0928 \u092b\u093c\u0930 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e \u0905\u0917 \u0938\u093f\u0924\u0902 \u0905\u0915\u094d\u091f\u0942 \u0928\u0935\u0902 \u0926\u093f\u0938\u0902".split(" "), STANDALONESHORTMONTHS:"\u091c\u0928 \u092b\u093c\u0930 \u092e\u093e\u0930\u094d\u091a \u0905\u092a\u094d\u0930\u0948 \u092e\u0908 \u091c\u0942\u0928 \u091c\u0941\u0932\u093e \u0905\u0917 \u0938\u093f\u0924\u0902 \u0905\u0915\u094d\u091f\u0942 \u0928\u0935\u0902 \u0926\u093f\u0938\u0902".split(" "), 
WEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0932\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), STANDALONEWEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0932\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), 
SHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0932 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), STANDALONESHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0932 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), NARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), 
SHORTQUARTERS:["\u0924\u093f1", "\u0924\u093f2", "\u0924\u093f3", "\u0924\u093f4"], QUARTERS:["\u092a\u0939\u0932\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u0942\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u0940\u0938\u0930\u0940 \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u094c\u0925\u0940 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "dd-MM-y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", 
"h:mm a"], DATETIMEFORMATS:["{1} \u0915\u094b {0}", "{1} \u0915\u094b {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_hr = {ERAS:["pr. Kr.", "p. Kr."], ERANAMES:["Prije Krista", "Poslije Krista"], NARROWMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), STANDALONENARROWMONTHS:"1. 2. 3. 4. 5. 6. 7. 8. 9. 10. 11. 12.".split(" "), MONTHS:"sije\u010dnja velja\u010de o\u017eujka travnja svibnja lipnja srpnja kolovoza rujna listopada studenoga prosinca".split(" "), STANDALONEMONTHS:"sije\u010danj velja\u010da o\u017eujak travanj svibanj lipanj srpanj kolovoz rujan listopad studeni prosinac".split(" "), 
SHORTMONTHS:"sij velj o\u017eu tra svi lip srp kol ruj lis stu pro".split(" "), STANDALONESHORTMONTHS:"sij velj o\u017eu tra svi lip srp kol ruj lis stu pro".split(" "), WEEKDAYS:"nedjelja ponedjeljak utorak srijeda \u010detvrtak petak subota".split(" "), STANDALONEWEEKDAYS:"nedjelja ponedjeljak utorak srijeda \u010detvrtak petak subota".split(" "), SHORTWEEKDAYS:"ned pon uto sri \u010det pet sub".split(" "), STANDALONESHORTWEEKDAYS:"ned pon uto sri \u010det pet sub".split(" "), NARROWWEEKDAYS:"NPUS\u010cPS".split(""), 
STANDALONENARROWWEEKDAYS:"npus\u010dps".split(""), SHORTQUARTERS:["1kv", "2kv", "3kv", "4kv"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", "4. kvartal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y.", "d. MMMM y.", "d. MMM y.", "d.M.yy."], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'u' {0}", "{1} 'u' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_hu = {ERAS:["i. e.", "i. sz."], ERANAMES:["id\u0151sz\u00e1m\u00edt\u00e1sunk el\u0151tt", "id\u0151sz\u00e1m\u00edt\u00e1sunk szerint"], NARROWMONTHS:"J F M \u00c1 M J J A Sz O N D".split(" "), STANDALONENARROWMONTHS:"J F M \u00c1 M J J A Sz O N D".split(" "), MONTHS:"janu\u00e1r febru\u00e1r m\u00e1rcius \u00e1prilis m\u00e1jus j\u00fanius j\u00falius augusztus szeptember okt\u00f3ber november december".split(" "), STANDALONEMONTHS:"janu\u00e1r febru\u00e1r m\u00e1rcius \u00e1prilis m\u00e1jus j\u00fanius j\u00falius augusztus szeptember okt\u00f3ber november december".split(" "), 
SHORTMONTHS:"jan. febr. m\u00e1rc. \u00e1pr. m\u00e1j. j\u00fan. j\u00fal. aug. szept. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"jan. febr. m\u00e1rc. \u00e1pr. m\u00e1j. j\u00fan. j\u00fal. aug. szept. okt. nov. dec.".split(" "), WEEKDAYS:"vas\u00e1rnap h\u00e9tf\u0151 kedd szerda cs\u00fct\u00f6rt\u00f6k p\u00e9ntek szombat".split(" "), STANDALONEWEEKDAYS:"vas\u00e1rnap h\u00e9tf\u0151 kedd szerda cs\u00fct\u00f6rt\u00f6k p\u00e9ntek szombat".split(" "), SHORTWEEKDAYS:"V H K Sze Cs P Szo".split(" "), 
STANDALONESHORTWEEKDAYS:"V H K Sze Cs P Szo".split(" "), NARROWWEEKDAYS:"V H K Sz Cs P Sz".split(" "), STANDALONENARROWWEEKDAYS:"V H K Sz Cs P Sz".split(" "), SHORTQUARTERS:["N1", "N2", "N3", "N4"], QUARTERS:["I. negyed\u00e9v", "II. negyed\u00e9v", "III. negyed\u00e9v", "IV. negyed\u00e9v"], AMPMS:["de.", "du."], DATEFORMATS:["y. MMMM d., EEEE", "y. MMMM d.", "y MMM d", "y. MM. dd."], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", 
"{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_id = {ERAS:["SM", "M"], ERANAMES:["SM", "M"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), STANDALONEWEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), SHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), NARROWWEEKDAYS:"MSSRKJS".split(""), STANDALONENARROWWEEKDAYS:"MSSRKJS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM y", 
"d MMMM y", "d MMM y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_in = {ERAS:["SM", "M"], ERANAMES:["SM", "M"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), STANDALONEMONTHS:"Januari Februari Maret April Mei Juni Juli Agustus September Oktober November Desember".split(" "), SHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Mei Jun Jul Agt Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), STANDALONEWEEKDAYS:"Minggu Senin Selasa Rabu Kamis Jumat Sabtu".split(" "), SHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Min Sen Sel Rab Kam Jum Sab".split(" "), NARROWWEEKDAYS:"MSSRKJS".split(""), STANDALONENARROWWEEKDAYS:"MSSRKJS".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["Kuartal ke-1", "Kuartal ke-2", "Kuartal ke-3", "Kuartal ke-4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, dd MMMM y", 
"d MMMM y", "d MMM y", "dd/MM/yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_is = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["fyrir Krist", "eftir Krist"], NARROWMONTHS:"JFMAMJJ\u00c1SOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJ\u00c1SOND".split(""), MONTHS:"jan\u00faar febr\u00faar mars apr\u00edl ma\u00ed j\u00fan\u00ed j\u00fal\u00ed \u00e1g\u00fast september okt\u00f3ber n\u00f3vember desember".split(" "), STANDALONEMONTHS:"jan\u00faar febr\u00faar mars apr\u00edl ma\u00ed j\u00fan\u00ed j\u00fal\u00ed \u00e1g\u00fast september okt\u00f3ber n\u00f3vember desember".split(" "), 
SHORTMONTHS:"jan. feb. mar. apr. ma\u00ed j\u00fan. j\u00fal. \u00e1g\u00fa. sep. okt. n\u00f3v. des.".split(" "), STANDALONESHORTMONTHS:"jan. feb. mar. apr. ma\u00ed j\u00fan. j\u00fal. \u00e1g\u00fa. sep. okt. n\u00f3v. des.".split(" "), WEEKDAYS:"sunnudagur m\u00e1nudagur \u00feri\u00f0judagur mi\u00f0vikudagur fimmtudagur f\u00f6studagur laugardagur".split(" "), STANDALONEWEEKDAYS:"sunnudagur m\u00e1nudagur \u00feri\u00f0judagur mi\u00f0vikudagur fimmtudagur f\u00f6studagur laugardagur".split(" "), 
SHORTWEEKDAYS:"sun. m\u00e1n. \u00feri. mi\u00f0. fim. f\u00f6s. lau.".split(" "), STANDALONESHORTWEEKDAYS:"sun. m\u00e1n. \u00feri. mi\u00f0. fim. f\u00f6s. lau.".split(" "), NARROWWEEKDAYS:"SM\u00deMFFL".split(""), STANDALONENARROWWEEKDAYS:"SM\u00deMFFL".split(""), SHORTQUARTERS:["F1", "F2", "F3", "F4"], QUARTERS:["1. fj\u00f3r\u00f0ungur", "2. fj\u00f3r\u00f0ungur", "3. fj\u00f3r\u00f0ungur", "4. fj\u00f3r\u00f0ungur"], AMPMS:["f.h.", "e.h."], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d. MMM y", 
"d.M.y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'kl.' {0}", "{1} 'kl.' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_it = {ERAS:["aC", "dC"], ERANAMES:["a.C.", "d.C."], NARROWMONTHS:"GFMAMGLASOND".split(""), STANDALONENARROWMONTHS:"GFMAMGLASOND".split(""), MONTHS:"gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre".split(" "), STANDALONEMONTHS:"Gennaio Febbraio Marzo Aprile Maggio Giugno Luglio Agosto Settembre Ottobre Novembre Dicembre".split(" "), SHORTMONTHS:"gen feb mar apr mag giu lug ago set ott nov dic".split(" "), STANDALONESHORTMONTHS:"gen feb mar apr mag giu lug ago set ott nov dic".split(" "), 
WEEKDAYS:"domenica luned\u00ec marted\u00ec mercoled\u00ec gioved\u00ec venerd\u00ec sabato".split(" "), STANDALONEWEEKDAYS:"Domenica Luned\u00ec Marted\u00ec Mercoled\u00ec Gioved\u00ec Venerd\u00ec Sabato".split(" "), SHORTWEEKDAYS:"dom lun mar mer gio ven sab".split(" "), STANDALONESHORTWEEKDAYS:"dom lun mar mer gio ven sab".split(" "), NARROWWEEKDAYS:"DLMMGVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMGVS".split(""), SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1\u00ba trimestre", "2\u00ba trimestre", 
"3\u00ba trimestre", "4\u00ba trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "dd MMMM y", "dd/MMM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_iw = {ERAS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e1", "\u05dc\u05e1\u05d4\u05f4\u05e0"], ERANAMES:["\u05dc\u05e4\u05e0\u05d9 \u05d4\u05e1\u05e4\u05d9\u05e8\u05d4", "\u05dc\u05e1\u05e4\u05d9\u05e8\u05d4"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), 
STANDALONEMONTHS:"\u05d9\u05e0\u05d5\u05d0\u05e8 \u05e4\u05d1\u05e8\u05d5\u05d0\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05d9\u05dc \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05d9 \u05d9\u05d5\u05dc\u05d9 \u05d0\u05d5\u05d2\u05d5\u05e1\u05d8 \u05e1\u05e4\u05d8\u05de\u05d1\u05e8 \u05d0\u05d5\u05e7\u05d8\u05d5\u05d1\u05e8 \u05e0\u05d5\u05d1\u05de\u05d1\u05e8 \u05d3\u05e6\u05de\u05d1\u05e8".split(" "), SHORTMONTHS:"\u05d9\u05e0\u05d5 \u05e4\u05d1\u05e8 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0 \u05d9\u05d5\u05dc \u05d0\u05d5\u05d2 \u05e1\u05e4\u05d8 \u05d0\u05d5\u05e7 \u05e0\u05d5\u05d1 \u05d3\u05e6\u05de".split(" "), 
STANDALONESHORTMONTHS:"\u05d9\u05e0\u05d5\u05f3 \u05e4\u05d1\u05e8\u05f3 \u05de\u05e8\u05e5 \u05d0\u05e4\u05e8\u05f3 \u05de\u05d0\u05d9 \u05d9\u05d5\u05e0\u05f3 \u05d9\u05d5\u05dc\u05f3 \u05d0\u05d5\u05d2\u05f3 \u05e1\u05e4\u05d8\u05f3 \u05d0\u05d5\u05e7\u05f3 \u05e0\u05d5\u05d1\u05f3 \u05d3\u05e6\u05de\u05f3".split(" "), WEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), 
STANDALONEWEEKDAYS:"\u05d9\u05d5\u05dd \u05e8\u05d0\u05e9\u05d5\u05df;\u05d9\u05d5\u05dd \u05e9\u05e0\u05d9;\u05d9\u05d5\u05dd \u05e9\u05dc\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e8\u05d1\u05d9\u05e2\u05d9;\u05d9\u05d5\u05dd \u05d7\u05de\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d9\u05e9\u05d9;\u05d9\u05d5\u05dd \u05e9\u05d1\u05ea".split(";"), SHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), 
STANDALONESHORTWEEKDAYS:"\u05d9\u05d5\u05dd \u05d0\u05f3;\u05d9\u05d5\u05dd \u05d1\u05f3;\u05d9\u05d5\u05dd \u05d2\u05f3;\u05d9\u05d5\u05dd \u05d3\u05f3;\u05d9\u05d5\u05dd \u05d4\u05f3;\u05d9\u05d5\u05dd \u05d5\u05f3;\u05e9\u05d1\u05ea".split(";"), NARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), STANDALONENARROWWEEKDAYS:"\u05d0\u05f3 \u05d1\u05f3 \u05d2\u05f3 \u05d3\u05f3 \u05d4\u05f3 \u05d5\u05f3 \u05e9\u05f3".split(" "), SHORTQUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", 
"\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], QUARTERS:["\u05e8\u05d1\u05e2\u05d5\u05df 1", "\u05e8\u05d1\u05e2\u05d5\u05df 2", "\u05e8\u05d1\u05e2\u05d5\u05df 3", "\u05e8\u05d1\u05e2\u05d5\u05df 4"], AMPMS:["\u05dc\u05e4\u05e0\u05d4\u05f4\u05e6", "\u05d0\u05d7\u05d4\u05f4\u05e6"], DATEFORMATS:["EEEE, d \u05d1MMMM y", "d \u05d1MMMM y", "d \u05d1MMM y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} \u05d1\u05e9\u05e2\u05d4 {0}", 
"{1} \u05d1\u05e9\u05e2\u05d4 {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[4, 5], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ja = {ERAS:["\u7d00\u5143\u524d", "\u897f\u66a6"], ERANAMES:["\u7d00\u5143\u524d", "\u897f\u66a6"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u65e5\u66dc\u65e5 \u6708\u66dc\u65e5 \u706b\u66dc\u65e5 \u6c34\u66dc\u65e5 \u6728\u66dc\u65e5 \u91d1\u66dc\u65e5 \u571f\u66dc\u65e5".split(" "), STANDALONEWEEKDAYS:"\u65e5\u66dc\u65e5 \u6708\u66dc\u65e5 \u706b\u66dc\u65e5 \u6c34\u66dc\u65e5 \u6728\u66dc\u65e5 \u91d1\u66dc\u65e5 \u571f\u66dc\u65e5".split(" "), SHORTWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), 
STANDALONESHORTWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), NARROWWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["\u7b2c1\u56db\u534a\u671f", "\u7b2c2\u56db\u534a\u671f", "\u7b2c3\u56db\u534a\u671f", "\u7b2c4\u56db\u534a\u671f"], AMPMS:["\u5348\u524d", "\u5348\u5f8c"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", 
"y/MM/dd", "y/MM/dd"], TIMEFORMATS:["H\u6642mm\u5206ss\u79d2 zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_kn = {ERAS:["\u0c95\u0ccd\u0cb0\u0cbf.\u0caa\u0cc2", "\u0c9c\u0cbe\u0cb9\u0cc0"], ERANAMES:["\u0c88\u0cb8\u0caa\u0cc2\u0cb5\u0cef.", "\u0c95\u0ccd\u0cb0\u0cbf\u0cb8\u0ccd\u0ca4 \u0cb6\u0c95"], NARROWMONTHS:"\u0c9c \u0cab\u0cc6 \u0cae\u0cbe \u0c8f \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1 \u0c86 \u0cb8\u0cc6 \u0c85 \u0ca8 \u0ca1\u0cbf".split(" "), STANDALONENARROWMONTHS:"\u0c9c \u0cab\u0cc6 \u0cae\u0cbe \u0c8f \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1 \u0c86 \u0cb8\u0cc6 \u0c85 \u0ca8 \u0ca1\u0cbf".split(" "), 
MONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cbf \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cbf \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8f\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc7 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), STANDALONEMONTHS:"\u0c9c\u0ca8\u0cb5\u0cb0\u0cbf \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cb5\u0cb0\u0cbf \u0cae\u0cbe\u0cb0\u0ccd\u0c9a\u0ccd \u0c8f\u0caa\u0ccd\u0cb0\u0cbf\u0cb2\u0ccd \u0cae\u0cc7 \u0c9c\u0cc2\u0ca8\u0ccd \u0c9c\u0cc1\u0cb2\u0cc8 \u0c86\u0c97\u0cb8\u0ccd\u0c9f\u0ccd \u0cb8\u0caa\u0ccd\u0c9f\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0c85\u0c95\u0ccd\u0c9f\u0ccb\u0cac\u0cb0\u0ccd \u0ca8\u0cb5\u0cc6\u0c82\u0cac\u0cb0\u0ccd \u0ca1\u0cbf\u0cb8\u0cc6\u0c82\u0cac\u0cb0\u0ccd".split(" "), 
SHORTMONTHS:"\u0c9c\u0ca8. \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cc1. \u0cae\u0cbe \u0c8f\u0caa\u0ccd\u0cb0\u0cbf. \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1. \u0c86\u0c97. \u0cb8\u0cc6\u0caa\u0ccd\u0c9f\u0cc6\u0c82. \u0c85\u0c95\u0ccd\u0c9f\u0ccb. \u0ca8\u0cb5\u0cc6\u0c82. \u0ca1\u0cbf\u0cb8\u0cc6\u0c82.".split(" "), STANDALONESHORTMONTHS:"\u0c9c\u0ca8. \u0cab\u0cc6\u0cac\u0ccd\u0cb0\u0cc1. \u0cae\u0cbe \u0c8f\u0caa\u0ccd\u0cb0\u0cbf. \u0cae\u0cc7 \u0c9c\u0cc2 \u0c9c\u0cc1. \u0c86\u0c97. \u0cb8\u0cc6\u0caa\u0ccd\u0c9f\u0cc6\u0c82. \u0c85\u0c95\u0ccd\u0c9f\u0ccb. \u0ca8\u0cb5\u0cc6\u0c82. \u0ca1\u0cbf\u0cb8\u0cc6\u0c82.".split(" "), 
WEEKDAYS:"\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0 \u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0 \u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0 \u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0 \u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0 \u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0".split(" "), STANDALONEWEEKDAYS:"\u0cb0\u0cb5\u0cbf\u0cb5\u0cbe\u0cb0 \u0cb8\u0ccb\u0cae\u0cb5\u0cbe\u0cb0 \u0cae\u0c82\u0c97\u0cb3\u0cb5\u0cbe\u0cb0 \u0cac\u0cc1\u0ca7\u0cb5\u0cbe\u0cb0 \u0c97\u0cc1\u0cb0\u0cc1\u0cb5\u0cbe\u0cb0 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0\u0cb5\u0cbe\u0cb0 \u0cb6\u0ca8\u0cbf\u0cb5\u0cbe\u0cb0".split(" "), 
SHORTWEEKDAYS:"\u0cb0. \u0cb8\u0ccb. \u0cae\u0c82. \u0cac\u0cc1. \u0c97\u0cc1. \u0cb6\u0cc1. \u0cb6\u0ca8\u0cbf.".split(" "), STANDALONESHORTWEEKDAYS:"\u0cb0\u0cb5\u0cbf \u0cb8\u0ccb\u0cae \u0cae\u0c82\u0c97\u0cb3 \u0cac\u0cc1\u0ca7 \u0c97\u0cc1\u0cb0\u0cc1 \u0cb6\u0cc1\u0c95\u0ccd\u0cb0 \u0cb6\u0ca8\u0cbf".split(" "), NARROWWEEKDAYS:"\u0cb0 \u0cb8\u0ccb \u0cae\u0c82 \u0cac\u0cc1 \u0c97\u0cc1 \u0cb6\u0cc1 \u0cb6".split(" "), STANDALONENARROWWEEKDAYS:"\u0cb0 \u0cb8\u0ccb \u0cae\u0c82 \u0cac\u0cc1 \u0c97\u0cc1 \u0cb6\u0cc1 \u0cb6".split(" "), 
SHORTQUARTERS:["\u0ca4\u0ccd\u0cb0\u0cc8 1", "\u0ca4\u0ccd\u0cb0\u0cc8 2", "\u0ca4\u0ccd\u0cb0\u0cc8 3", "\u0ca4\u0ccd\u0cb0\u0cc8 4"], QUARTERS:["1 \u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95", "2\u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95", "3 \u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95", "4 \u0ca8\u0cc7 \u0ca4\u0ccd\u0cb0\u0cc8\u0cae\u0cbe\u0cb8\u0cbf\u0c95"], AMPMS:["AM", "PM"], DATEFORMATS:["d MMMM y, EEEE", "d MMMM y", 
"d MMM y", "d-M-yy"], TIMEFORMATS:["hh:mm:ss a zzzz", "hh:mm:ss a z", "hh:mm:ss a", "hh:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ko = {ERAS:["\uae30\uc6d0\uc804", "\uc11c\uae30"], ERANAMES:["\uc11c\ub825\uae30\uc6d0\uc804", "\uc11c\ub825\uae30\uc6d0"], NARROWMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), STANDALONENARROWMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), MONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), 
STANDALONEMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), SHORTMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), STANDALONESHORTMONTHS:"1\uc6d4 2\uc6d4 3\uc6d4 4\uc6d4 5\uc6d4 6\uc6d4 7\uc6d4 8\uc6d4 9\uc6d4 10\uc6d4 11\uc6d4 12\uc6d4".split(" "), WEEKDAYS:"\uc77c\uc694\uc77c \uc6d4\uc694\uc77c \ud654\uc694\uc77c \uc218\uc694\uc77c \ubaa9\uc694\uc77c \uae08\uc694\uc77c \ud1a0\uc694\uc77c".split(" "), 
STANDALONEWEEKDAYS:"\uc77c\uc694\uc77c \uc6d4\uc694\uc77c \ud654\uc694\uc77c \uc218\uc694\uc77c \ubaa9\uc694\uc77c \uae08\uc694\uc77c \ud1a0\uc694\uc77c".split(" "), SHORTWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), STANDALONESHORTWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), NARROWWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), STANDALONENARROWWEEKDAYS:"\uc77c\uc6d4\ud654\uc218\ubaa9\uae08\ud1a0".split(""), SHORTQUARTERS:["1\ubd84\uae30", "2\ubd84\uae30", 
"3\ubd84\uae30", "4\ubd84\uae30"], QUARTERS:["\uc81c 1/4\ubd84\uae30", "\uc81c 2/4\ubd84\uae30", "\uc81c 3/4\ubd84\uae30", "\uc81c 4/4\ubd84\uae30"], AMPMS:["\uc624\uc804", "\uc624\ud6c4"], DATEFORMATS:["y\ub144 M\uc6d4 d\uc77c EEEE", "y\ub144 M\uc6d4 d\uc77c", "y. M. d.", "yy. M. d."], TIMEFORMATS:["a h\uc2dc m\ubd84 s\ucd08 zzzz", "a h\uc2dc m\ubd84 s\ucd08 z", "a h:mm:ss", "a h:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ln = {ERAS:["lib\u00f3so ya", "nsima ya Y"], ERANAMES:["Yambo ya Y\u00e9zu Kr\u00eds", "Nsima ya Y\u00e9zu Kr\u00eds"], NARROWMONTHS:"yfmamyyas\u0254nd".split(""), STANDALONENARROWMONTHS:"yfmamyyas\u0254nd".split(""), MONTHS:"s\u00e1nz\u00e1 ya yambo;s\u00e1nz\u00e1 ya m\u00edbal\u00e9;s\u00e1nz\u00e1 ya m\u00eds\u00e1to;s\u00e1nz\u00e1 ya m\u00ednei;s\u00e1nz\u00e1 ya m\u00edt\u00e1no;s\u00e1nz\u00e1 ya mot\u00f3b\u00e1;s\u00e1nz\u00e1 ya nsambo;s\u00e1nz\u00e1 ya mwambe;s\u00e1nz\u00e1 ya libwa;s\u00e1nz\u00e1 ya z\u00f3mi;s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301;s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9".split(";"), 
STANDALONEMONTHS:"s\u00e1nz\u00e1 ya yambo;s\u00e1nz\u00e1 ya m\u00edbal\u00e9;s\u00e1nz\u00e1 ya m\u00eds\u00e1to;s\u00e1nz\u00e1 ya m\u00ednei;s\u00e1nz\u00e1 ya m\u00edt\u00e1no;s\u00e1nz\u00e1 ya mot\u00f3b\u00e1;s\u00e1nz\u00e1 ya nsambo;s\u00e1nz\u00e1 ya mwambe;s\u00e1nz\u00e1 ya libwa;s\u00e1nz\u00e1 ya z\u00f3mi;s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301;s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9".split(";"), SHORTMONTHS:"yan fbl msi apl mai yun yul agt stb \u0254tb nvb dsb".split(" "), 
STANDALONESHORTMONTHS:"yan fbl msi apl mai yun yul agt stb \u0254tb nvb dsb".split(" "), WEEKDAYS:"eyenga;mok\u0254l\u0254 mwa yambo;mok\u0254l\u0254 mwa m\u00edbal\u00e9;mok\u0254l\u0254 mwa m\u00eds\u00e1to;mok\u0254l\u0254 ya m\u00edn\u00e9i;mok\u0254l\u0254 ya m\u00edt\u00e1no;mp\u0254\u0301s\u0254".split(";"), STANDALONEWEEKDAYS:"eyenga;mok\u0254l\u0254 mwa yambo;mok\u0254l\u0254 mwa m\u00edbal\u00e9;mok\u0254l\u0254 mwa m\u00eds\u00e1to;mok\u0254l\u0254 ya m\u00edn\u00e9i;mok\u0254l\u0254 ya m\u00edt\u00e1no;mp\u0254\u0301s\u0254".split(";"), 
SHORTWEEKDAYS:"eye ybo mbl mst min mtn mps".split(" "), STANDALONESHORTWEEKDAYS:"eye ybo mbl mst min mtn mps".split(" "), NARROWWEEKDAYS:"eymmmmp".split(""), STANDALONENARROWWEEKDAYS:"eymmmmp".split(""), SHORTQUARTERS:["SM1", "SM2", "SM3", "SM4"], QUARTERS:["s\u00e1nz\u00e1 m\u00eds\u00e1to ya yambo", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00edbal\u00e9", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00eds\u00e1to", "s\u00e1nz\u00e1 m\u00eds\u00e1to ya m\u00ednei"], AMPMS:["nt\u0254\u0301ng\u0254\u0301", 
"mp\u00f3kwa"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "d/M/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_lt = {ERAS:["pr. Kr.", "po Kr."], ERANAMES:["prie\u0161 Krist\u0173", "po Kristaus"], NARROWMONTHS:"SVKBGBLRRSLG".split(""), STANDALONENARROWMONTHS:"SVKBGBLRRSLG".split(""), MONTHS:"sausis vasaris kovas balandis gegu\u017e\u0117 bir\u017eelis liepa rugpj\u016btis rugs\u0117jis spalis lapkritis gruodis".split(" "), STANDALONEMONTHS:"sausis vasaris kovas balandis gegu\u017e\u0117 bir\u017eelis liepa rugpj\u016btis rugs\u0117jis spalis lapkritis gruodis".split(" "), SHORTMONTHS:"saus. vas. kov. bal. geg. bir\u017e. liep. rugp. rugs. spal. lapkr. gruod.".split(" "), 
STANDALONESHORTMONTHS:"saus. vas. kov. bal. geg. bir\u017e. liep. rugp. rugs. spal. lapkr. gruod.".split(" "), WEEKDAYS:"sekmadienis pirmadienis antradienis tre\u010diadienis ketvirtadienis penktadienis \u0161e\u0161tadienis".split(" "), STANDALONEWEEKDAYS:"sekmadienis pirmadienis antradienis tre\u010diadienis ketvirtadienis penktadienis \u0161e\u0161tadienis".split(" "), SHORTWEEKDAYS:"sk pr an tr kt pn \u0161t".split(" "), STANDALONESHORTWEEKDAYS:"sk pr an tr kt pn \u0161t".split(" "), NARROWWEEKDAYS:"SPATKP\u0160".split(""), 
STANDALONENARROWWEEKDAYS:"SPATKP\u0160".split(""), SHORTQUARTERS:["I k.", "II k.", "III k.", "IV k."], QUARTERS:["I ketvirtis", "II ketvirtis", "III ketvirtis", "IV ketvirtis"], AMPMS:["prie\u0161piet", "popiet"], DATEFORMATS:["y 'm'. MMMM d 'd'., EEEE", "y 'm'. MMMM d 'd'.", "y MMM d", "y-MM-dd"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_lv = {ERAS:["p.m.\u0113.", "m.\u0113."], ERANAMES:["pirms m\u016bsu \u0113ras", "m\u016bsu \u0113r\u0101"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janv\u0101ris febru\u0101ris marts apr\u012blis maijs j\u016bnijs j\u016blijs augusts septembris oktobris novembris decembris".split(" "), STANDALONEMONTHS:"Janv\u0101ris Febru\u0101ris Marts Apr\u012blis Maijs J\u016bnijs J\u016blijs Augusts Septembris Oktobris Novembris Decembris".split(" "), 
SHORTMONTHS:"janv. febr. marts apr. maijs j\u016bn. j\u016bl. aug. sept. okt. nov. dec.".split(" "), STANDALONESHORTMONTHS:"Janv. Febr. Marts Apr. Maijs J\u016bn. J\u016bl. Aug. Sept. Okt. Nov. Dec.".split(" "), WEEKDAYS:"sv\u0113tdiena pirmdiena otrdiena tre\u0161diena ceturtdiena piektdiena sestdiena".split(" "), STANDALONEWEEKDAYS:"Sv\u0113tdiena Pirmdiena Otrdiena Tre\u0161diena Ceturtdiena Piektdiena Sestdiena".split(" "), SHORTWEEKDAYS:"Sv Pr Ot Tr Ce Pk Se".split(" "), STANDALONESHORTWEEKDAYS:"Sv Pr Ot Tr Ce Pk Se".split(" "), 
NARROWWEEKDAYS:"SPOTCPS".split(""), STANDALONENARROWWEEKDAYS:"SPOTCPS".split(""), SHORTQUARTERS:["C1", "C2", "C3", "C4"], QUARTERS:["1. ceturksnis", "2. ceturksnis", "3. ceturksnis", "4. ceturksnis"], AMPMS:["priek\u0161pusdien\u0101", "p\u0113cpusdien\u0101"], DATEFORMATS:["EEEE, y. 'gada' d. MMMM", "y. 'gada' d. MMMM", "y. 'gada' d. MMM", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, 
WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ml = {ERAS:["\u0d15\u0d4d\u0d30\u0d3f.\u0d2e\u0d42", "\u0d0e\u0d21\u0d3f"], ERANAMES:["\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d41\u0d4d \u0d2e\u0d41\u0d2e\u0d4d\u0d2a\u0d4d\u200c", "\u0d15\u0d4d\u0d30\u0d3f\u0d38\u0d4d\u0d24\u0d41\u0d35\u0d3f\u0d28\u0d4d \u0d2a\u0d3f\u0d7b\u0d2a\u0d4d"], NARROWMONTHS:"\u0d1c \u0d2b\u0d46 \u0d2e\u0d3e \u0d0f \u0d2e\u0d47 \u0d1c\u0d42 \u0d1c\u0d42 \u0d13 \u0d38\u0d46 \u0d12 \u0d28 \u0d21\u0d3f".split(" "), STANDALONENARROWMONTHS:"\u0d1c \u0d2b\u0d46 \u0d2e\u0d3e \u0d0f \u0d2e\u0d47 \u0d1c\u0d42 \u0d1c\u0d42 \u0d13 \u0d38\u0d46 \u0d12 \u0d28 \u0d21\u0d3f".split(" "), 
MONTHS:"\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f \u0d2e\u0d3e\u0d7c\u0d1a\u0d4d\u0d1a\u0d4d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d7d \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d7c \u0d12\u0d15\u0d4d\u200c\u0d1f\u0d4b\u0d2c\u0d7c \u0d28\u0d35\u0d02\u0d2c\u0d7c \u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d7c".split(" "), STANDALONEMONTHS:"\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f \u0d2e\u0d3e\u0d7c\u0d1a\u0d4d\u0d1a\u0d4d \u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d7d \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d7c \u0d12\u0d15\u0d4d\u200c\u0d1f\u0d4b\u0d2c\u0d7c \u0d28\u0d35\u0d02\u0d2c\u0d7c \u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d7c".split(" "), 
SHORTMONTHS:"\u0d1c\u0d28\u0d41 \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41 \u0d2e\u0d3e\u0d7c \u0d0f\u0d2a\u0d4d\u0d30\u0d3f \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d13\u0d17 \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02 \u0d12\u0d15\u0d4d\u0d1f\u0d4b \u0d28\u0d35\u0d02 \u0d21\u0d3f\u0d38\u0d02".split(" "), STANDALONESHORTMONTHS:"\u0d1c\u0d28\u0d41 \u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41 \u0d2e\u0d3e\u0d7c \u0d0f\u0d2a\u0d4d\u0d30\u0d3f \u0d2e\u0d47\u0d2f\u0d4d \u0d1c\u0d42\u0d7a \u0d1c\u0d42\u0d32\u0d48 \u0d13\u0d17 \u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02 \u0d12\u0d15\u0d4d\u0d1f\u0d4b \u0d28\u0d35\u0d02 \u0d21\u0d3f\u0d38\u0d02".split(" "), 
WEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a \u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a".split(" "), STANDALONEWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a \u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u200c\u0d1a".split(" "), 
SHORTWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d7c \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d7e \u0d1a\u0d4a\u0d35\u0d4d\u0d35 \u0d2c\u0d41\u0d27\u0d7b \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02 \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f \u0d36\u0d28\u0d3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0d1e\u0d3e\u0d2f\u0d7c \u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d7e \u0d1a\u0d4a\u0d35\u0d4d\u0d35 \u0d2c\u0d41\u0d27\u0d7b \u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02 \u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f \u0d36\u0d28\u0d3f".split(" "), NARROWWEEKDAYS:"\u0d1e\u0d3e \u0d24\u0d3f \u0d1a\u0d4a \u0d2c\u0d41 \u0d35\u0d4d\u0d2f\u0d3e \u0d35\u0d46 \u0d36".split(" "), 
STANDALONENARROWWEEKDAYS:"\u0d1e\u0d3e \u0d24\u0d3f \u0d1a\u0d4a \u0d2c\u0d41 \u0d35\u0d4d\u0d2f\u0d3e \u0d35\u0d46 \u0d36".split(" "), SHORTQUARTERS:["\u0d12\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d30\u0d23\u0d4d\u0d1f\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d2e\u0d42\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d28\u0d3e\u0d32\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02"], QUARTERS:["\u0d12\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d30\u0d23\u0d4d\u0d1f\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", 
"\u0d2e\u0d42\u0d28\u0d4d\u0d28\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02", "\u0d28\u0d3e\u0d32\u0d3e\u0d02 \u0d2a\u0d3e\u0d26\u0d02"], AMPMS:["AM", "PM"], DATEFORMATS:["y, MMMM d, EEEE", "y, MMMM d", "y, MMM d", "dd/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_mr = {ZERODIGIT:2406, ERAS:["\u0908\u0938\u093e\u092a\u0942\u0930\u094d\u0935", "\u0938\u0928"], ERANAMES:["\u0908\u0938\u0935\u0940\u0938\u0928\u092a\u0942\u0930\u094d\u0935", "\u0908\u0938\u0935\u0940\u0938\u0928"], NARROWMONTHS:"\u091c\u093e \u092b\u0947 \u092e\u093e \u090f \u092e\u0947 \u091c\u0942 \u091c\u0941 \u0911 \u0938 \u0911 \u0928\u094b \u0921\u093f".split(" "), STANDALONENARROWMONTHS:"\u091c\u093e \u092b\u0947 \u092e\u093e \u090f \u092e\u0947 \u091c\u0942 \u091c\u0941 \u0911 \u0938 \u0911 \u0928\u094b \u0921\u093f".split(" "), 
MONTHS:"\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917\u0938\u094d\u091f \u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930 \u0921\u093f\u0938\u0947\u0902\u092c\u0930".split(" "), STANDALONEMONTHS:"\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940 \u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f\u0932 \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917\u0938\u094d\u091f \u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930 \u0911\u0915\u094d\u091f\u094b\u092c\u0930 \u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930 \u0921\u093f\u0938\u0947\u0902\u092c\u0930".split(" "), 
SHORTMONTHS:"\u091c\u093e\u0928\u0947 \u092b\u0947\u092c\u094d\u0930\u0941 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917 \u0938\u092a\u094d\u091f\u0947\u0902 \u0911\u0915\u094d\u091f\u094b \u0928\u094b\u0935\u094d\u0939\u0947\u0902 \u0921\u093f\u0938\u0947\u0902".split(" "), STANDALONESHORTMONTHS:"\u091c\u093e\u0928\u0947 \u092b\u0947\u092c\u094d\u0930\u0941 \u092e\u093e\u0930\u094d\u091a \u090f\u092a\u094d\u0930\u093f \u092e\u0947 \u091c\u0942\u0928 \u091c\u0941\u0932\u0948 \u0911\u0917 \u0938\u092a\u094d\u091f\u0947\u0902 \u0911\u0915\u094d\u091f\u094b \u0928\u094b\u0935\u094d\u0939\u0947\u0902 \u0921\u093f\u0938\u0947\u0902".split(" "), 
WEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0933\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), STANDALONEWEEKDAYS:"\u0930\u0935\u093f\u0935\u093e\u0930 \u0938\u094b\u092e\u0935\u093e\u0930 \u092e\u0902\u0917\u0933\u0935\u093e\u0930 \u092c\u0941\u0927\u0935\u093e\u0930 \u0917\u0941\u0930\u0941\u0935\u093e\u0930 \u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 \u0936\u0928\u093f\u0935\u093e\u0930".split(" "), 
SHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0933 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), STANDALONESHORTWEEKDAYS:"\u0930\u0935\u093f \u0938\u094b\u092e \u092e\u0902\u0917\u0933 \u092c\u0941\u0927 \u0917\u0941\u0930\u0941 \u0936\u0941\u0915\u094d\u0930 \u0936\u0928\u093f".split(" "), NARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), STANDALONENARROWWEEKDAYS:"\u0930 \u0938\u094b \u092e\u0902 \u092c\u0941 \u0917\u0941 \u0936\u0941 \u0936".split(" "), 
SHORTQUARTERS:["\u0924\u093f1", "\u0924\u093f2", "\u0924\u093f3", "\u0924\u093f4"], QUARTERS:["\u092a\u094d\u0930\u0925\u092e \u0924\u093f\u092e\u093e\u0939\u0940", "\u0926\u094d\u0935\u093f\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u0924\u0943\u0924\u0940\u092f \u0924\u093f\u092e\u093e\u0939\u0940", "\u091a\u0924\u0941\u0930\u094d\u0925 \u0924\u093f\u092e\u093e\u0939\u0940"], AMPMS:["[AM]", "[PM]"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", 
"h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} '\u0930\u094b\u091c\u0940' {0}", "{1} '\u0930\u094b\u091c\u0940' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_ms = {ERAS:["S.M.", "TM"], ERANAMES:["S.M.", "TM"], NARROWMONTHS:"JFMAMJJOSOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJOSOND".split(""), MONTHS:"Januari Februari Mac April Mei Jun Julai Ogos September Oktober November Disember".split(" "), STANDALONEMONTHS:"Januari Februari Mac April Mei Jun Julai Ogos September Oktober November Disember".split(" "), SHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ogo Sep Okt Nov Dis".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ogo Sep Okt Nov Dis".split(" "), 
WEEKDAYS:"Ahad Isnin Selasa Rabu Khamis Jumaat Sabtu".split(" "), STANDALONEWEEKDAYS:"Ahad Isnin Selasa Rabu Khamis Jumaat Sabtu".split(" "), SHORTWEEKDAYS:"Ahd Isn Sel Rab Kha Jum Sab".split(" "), STANDALONESHORTWEEKDAYS:"Ahd Isn Sel Rab Kha Jum Sab".split(" "), NARROWWEEKDAYS:"AISRKJS".split(""), STANDALONENARROWWEEKDAYS:"AISRKJS".split(""), SHORTQUARTERS:["S1", "S2", "S3", "S4"], QUARTERS:["Suku pertama", "Suku Ke-2", "Suku Ke-3", "Suku Ke-4"], AMPMS:["PG", "PTG"], DATEFORMATS:["EEEE, d MMMM y", 
"d MMMM y", "d MMM y", "d/MM/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_mt = {ERAS:["QK", "WK"], ERANAMES:["Qabel Kristu", "Wara Kristu"], NARROWMONTHS:"JFMAM\u0120LASOND".split(""), STANDALONENARROWMONTHS:"JFMAM\u0120LASOND".split(""), MONTHS:"Jannar Frar Marzu April Mejju \u0120unju Lulju Awwissu Settembru Ottubru Novembru Di\u010bembru".split(" "), STANDALONEMONTHS:"Jannar Frar Marzu April Mejju \u0120unju Lulju Awwissu Settembru Ottubru Novembru Di\u010bembru".split(" "), SHORTMONTHS:"Jan Fra Mar Apr Mej \u0120un Lul Aww Set Ott Nov Di\u010b".split(" "), 
STANDALONESHORTMONTHS:"Jan Fra Mar Apr Mej \u0120un Lul Aww Set Ott Nov Di\u010b".split(" "), WEEKDAYS:"Il-\u0126add It-Tnejn It-Tlieta L-Erbg\u0127a Il-\u0126amis Il-\u0120img\u0127a Is-Sibt".split(" "), STANDALONEWEEKDAYS:"Il-\u0126add It-Tnejn It-Tlieta L-Erbg\u0127a Il-\u0126amis Il-\u0120img\u0127a Is-Sibt".split(" "), SHORTWEEKDAYS:"\u0126ad Tne Tli Erb \u0126am \u0120im Sib".split(" "), STANDALONESHORTWEEKDAYS:"\u0126ad Tne Tli Erb \u0126am \u0120im Sib".split(" "), NARROWWEEKDAYS:"\u0126TTE\u0126\u0120S".split(""), 
STANDALONENARROWWEEKDAYS:"\u0126TTE\u0126\u0120S".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["K1", "K2", "K3", "K4"], AMPMS:["QN", "WN"], DATEFORMATS:["EEEE, d 'ta'\u2019 MMMM y", "d 'ta'\u2019 MMMM y", "dd MMM y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_nb = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), STANDALONEMONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), SHORTMONTHS:"jan. feb. mar. apr. mai jun. jul. aug. sep. okt. nov. des.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr mai jun jul aug sep okt nov des".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8. ma. ti. on. to. fr. l\u00f8.".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. MMM y", "dd.MM.yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} 'kl.' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_nl = {ERAS:["v.Chr.", "n.Chr."], ERANAMES:["Voor Christus", "na Christus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januari februari maart april mei juni juli augustus september oktober november december".split(" "), STANDALONEMONTHS:"januari februari maart april mei juni juli augustus september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mrt. apr. mei jun. jul. aug. sep. okt. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"jan feb mrt apr mei jun jul aug sep okt nov dec".split(" "), WEEKDAYS:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "), STANDALONEWEEKDAYS:"zondag maandag dinsdag woensdag donderdag vrijdag zaterdag".split(" "), SHORTWEEKDAYS:"zo ma di wo do vr za".split(" "), STANDALONESHORTWEEKDAYS:"zo ma di wo do vr za".split(" "), NARROWWEEKDAYS:"ZMDWDVZ".split(""), STANDALONENARROWWEEKDAYS:"ZMDWDVZ".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1e kwartaal", 
"2e kwartaal", "3e kwartaal", "4e kwartaal"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE d MMMM y", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_no = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f.Kr.", "e.Kr."], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), STANDALONEMONTHS:"januar februar mars april mai juni juli august september oktober november desember".split(" "), SHORTMONTHS:"jan. feb. mar. apr. mai jun. jul. aug. sep. okt. nov. des.".split(" "), STANDALONESHORTMONTHS:"jan feb mar apr mai jun jul aug sep okt nov des".split(" "), 
WEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), STANDALONEWEEKDAYS:"s\u00f8ndag mandag tirsdag onsdag torsdag fredag l\u00f8rdag".split(" "), SHORTWEEKDAYS:"s\u00f8n. man. tir. ons. tor. fre. l\u00f8r.".split(" "), STANDALONESHORTWEEKDAYS:"s\u00f8. ma. ti. on. to. fr. l\u00f8.".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1. kvartal", "2. kvartal", "3. kvartal", 
"4. kvartal"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE d. MMMM y", "d. MMMM y", "d. MMM y", "dd.MM.yy"], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} 'kl.' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_or = {ERAS:["BCE", "CE"], ERANAMES:["BCE", "CE"], NARROWMONTHS:"\u0b1c\u0b3e \u0b2b\u0b47 \u0b2e\u0b3e \u0b05 \u0b2e\u0b47 \u0b1c\u0b41 \u0b1c\u0b41 \u0b05 \u0b38\u0b47 \u0b05 \u0b28 \u0b21\u0b3f".split(" "), STANDALONENARROWMONTHS:"\u0b1c\u0b3e \u0b2b\u0b47 \u0b2e\u0b3e \u0b05 \u0b2e\u0b47 \u0b1c\u0b41 \u0b1c\u0b41 \u0b05 \u0b38\u0b47 \u0b05 \u0b28 \u0b21\u0b3f".split(" "), MONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
STANDALONEMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
SHORTMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), STANDALONESHORTMONTHS:"\u0b1c\u0b3e\u0b28\u0b41\u0b06\u0b30\u0b40 \u0b2b\u0b47\u0b2c\u0b4d\u0b30\u0b41\u0b5f\u0b3e\u0b30\u0b40 \u0b2e\u0b3e\u0b30\u0b4d\u0b1a\u0b4d\u0b1a \u0b05\u0b2a\u0b4d\u0b30\u0b47\u0b32 \u0b2e\u0b47 \u0b1c\u0b41\u0b28 \u0b1c\u0b41\u0b32\u0b3e\u0b07 \u0b05\u0b17\u0b37\u0b4d\u0b1f \u0b38\u0b47\u0b2a\u0b4d\u0b1f\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b05\u0b15\u0b4d\u0b1f\u0b4b\u0b2c\u0b30 \u0b28\u0b2d\u0b47\u0b2e\u0b4d\u0b2c\u0b30 \u0b21\u0b3f\u0b38\u0b47\u0b2e\u0b4d\u0b2c\u0b30".split(" "), 
WEEKDAYS:"\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30 \u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30 \u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30 \u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30 \u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30 \u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30 \u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30".split(" "), STANDALONEWEEKDAYS:"\u0b30\u0b2c\u0b3f\u0b2c\u0b3e\u0b30 \u0b38\u0b4b\u0b2e\u0b2c\u0b3e\u0b30 \u0b2e\u0b19\u0b4d\u0b17\u0b33\u0b2c\u0b3e\u0b30 \u0b2c\u0b41\u0b27\u0b2c\u0b3e\u0b30 \u0b17\u0b41\u0b30\u0b41\u0b2c\u0b3e\u0b30 \u0b36\u0b41\u0b15\u0b4d\u0b30\u0b2c\u0b3e\u0b30 \u0b36\u0b28\u0b3f\u0b2c\u0b3e\u0b30".split(" "), 
SHORTWEEKDAYS:"\u0b30\u0b2c\u0b3f \u0b38\u0b4b\u0b2e \u0b2e\u0b19\u0b4d\u0b17\u0b33 \u0b2c\u0b41\u0b27 \u0b17\u0b41\u0b30\u0b41 \u0b36\u0b41\u0b15\u0b4d\u0b30 \u0b36\u0b28\u0b3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0b30\u0b2c\u0b3f \u0b38\u0b4b\u0b2e \u0b2e\u0b19\u0b4d\u0b17\u0b33 \u0b2c\u0b41\u0b27 \u0b17\u0b41\u0b30\u0b41 \u0b36\u0b41\u0b15\u0b4d\u0b30 \u0b36\u0b28\u0b3f".split(" "), NARROWWEEKDAYS:"\u0b30 \u0b38\u0b4b \u0b2e \u0b2c\u0b41 \u0b17\u0b41 \u0b36\u0b41 \u0b36".split(" "), STANDALONENARROWWEEKDAYS:"\u0b30 \u0b38\u0b4b \u0b2e \u0b2c\u0b41 \u0b17\u0b41 \u0b36\u0b41 \u0b36".split(" "), 
SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Q1", "Q2", "Q3", "Q4"], AMPMS:["am", "pm"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pl = {ERAS:["p.n.e.", "n.e."], ERANAMES:["p.n.e.", "n.e."], NARROWMONTHS:"slmkmclswplg".split(""), STANDALONENARROWMONTHS:"slmkmclswplg".split(""), MONTHS:"stycznia lutego marca kwietnia maja czerwca lipca sierpnia wrze\u015bnia pa\u017adziernika listopada grudnia".split(" "), STANDALONEMONTHS:"stycze\u0144 luty marzec kwiecie\u0144 maj czerwiec lipiec sierpie\u0144 wrzesie\u0144 pa\u017adziernik listopad grudzie\u0144".split(" "), SHORTMONTHS:"sty lut mar kwi maj cze lip sie wrz pa\u017a lis gru".split(" "), 
STANDALONESHORTMONTHS:"sty lut mar kwi maj cze lip sie wrz pa\u017a lis gru".split(" "), WEEKDAYS:"niedziela poniedzia\u0142ek wtorek \u015broda czwartek pi\u0105tek sobota".split(" "), STANDALONEWEEKDAYS:"niedziela poniedzia\u0142ek wtorek \u015broda czwartek pi\u0105tek sobota".split(" "), SHORTWEEKDAYS:"niedz. pon. wt. \u015br. czw. pt. sob.".split(" "), STANDALONESHORTWEEKDAYS:"niedz. pon. wt. \u015br. czw. pt. sob.".split(" "), NARROWWEEKDAYS:"NPW\u015aCPS".split(""), STANDALONENARROWWEEKDAYS:"NPW\u015aCPS".split(""), 
SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["I kwarta\u0142", "II kwarta\u0142", "III kwarta\u0142", "IV kwarta\u0142"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd.MM.y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_pt = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"janeiro fevereiro mar\u00e7o abril maio junho julho agosto setembro outubro novembro dezembro".split(" "), STANDALONEMONTHS:"janeiro fevereiro mar\u00e7o abril maio junho julho agosto setembro outubro novembro dezembro".split(" "), SHORTMONTHS:"jan fev mar abr mai jun jul ago set out nov dez".split(" "), 
STANDALONESHORTMONTHS:"jan fev mar abr mai jun jul ago set out nov dez".split(" "), WEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), NARROWWEEKDAYS:"DSTQQSS".split(""), STANDALONENARROWWEEKDAYS:"DSTQQSS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1\u00ba trimestre", "2\u00ba trimestre", "3\u00ba trimestre", "4\u00ba trimestre"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_pt_BR = goog.i18n.DateTimeSymbols_pt;
goog.i18n.DateTimeSymbols_pt_PT = {ERAS:["a.C.", "d.C."], ERANAMES:["Antes de Cristo", "Ano do Senhor"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Janeiro Fevereiro Mar\u00e7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "), STANDALONEMONTHS:"Janeiro Fevereiro Mar\u00e7o Abril Maio Junho Julho Agosto Setembro Outubro Novembro Dezembro".split(" "), SHORTMONTHS:"Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "), 
STANDALONESHORTMONTHS:"Jan Fev Mar Abr Mai Jun Jul Ago Set Out Nov Dez".split(" "), WEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), STANDALONEWEEKDAYS:"domingo segunda-feira ter\u00e7a-feira quarta-feira quinta-feira sexta-feira s\u00e1bado".split(" "), SHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), STANDALONESHORTWEEKDAYS:"dom seg ter qua qui sex s\u00e1b".split(" "), NARROWWEEKDAYS:"DSTQQSS".split(""), STANDALONENARROWWEEKDAYS:"DSTQQSS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["1.\u00ba trimestre", "2.\u00ba trimestre", "3.\u00ba trimestre", "4.\u00ba trimestre"], AMPMS:["da manh\u00e3", "da tarde"], DATEFORMATS:["EEEE, d 'de' MMMM 'de' y", "d 'de' MMMM 'de' y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} '\u00e0s' {0}", "{1} '\u00e0s' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_ro = {ERAS:["\u00ee.Hr.", "d.Hr."], ERANAMES:["\u00eenainte de Hristos", "dup\u0103 Hristos"], NARROWMONTHS:"IFMAMIIASOND".split(""), STANDALONENARROWMONTHS:"IFMAMIIASOND".split(""), MONTHS:"ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie".split(" "), STANDALONEMONTHS:"ianuarie februarie martie aprilie mai iunie iulie august septembrie octombrie noiembrie decembrie".split(" "), SHORTMONTHS:"ian. feb. mar. apr. mai iun. iul. aug. sept. oct. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"ian. feb. mar. apr. mai iun. iul. aug. sept. oct. nov. dec.".split(" "), WEEKDAYS:"duminic\u0103 luni mar\u021bi miercuri joi vineri s\u00e2mb\u0103t\u0103".split(" "), STANDALONEWEEKDAYS:"duminic\u0103 luni mar\u021bi miercuri joi vineri s\u00e2mb\u0103t\u0103".split(" "), SHORTWEEKDAYS:"Dum Lun Mar Mie Joi Vin S\u00e2m".split(" "), STANDALONESHORTWEEKDAYS:"Dum Lun Mar Mie Joi Vin S\u00e2m".split(" "), NARROWWEEKDAYS:"DLMMJVS".split(""), STANDALONENARROWWEEKDAYS:"DLMMJVS".split(""), 
SHORTQUARTERS:["trim. I", "trim. II", "trim. III", "trim. IV"], QUARTERS:["trimestrul I", "trimestrul al II-lea", "trimestrul al III-lea", "trimestrul al IV-lea"], AMPMS:["a.m.", "p.m."], DATEFORMATS:["EEEE, d MMMM y", "d MMMM y", "d MMM y", "dd.MM.y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ru = {ERAS:["\u0434\u043e \u043d. \u044d.", "\u043d. \u044d."], ERANAMES:["\u0434\u043e \u043d.\u044d.", "\u043d.\u044d."], NARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), STANDALONENARROWMONTHS:"\u042f\u0424\u041c\u0410\u041c\u0418\u0418\u0410\u0421\u041e\u041d\u0414".split(""), MONTHS:"\u044f\u043d\u0432\u0430\u0440\u044f \u0444\u0435\u0432\u0440\u0430\u043b\u044f \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440\u0435\u043b\u044f \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433\u0443\u0441\u0442\u0430 \u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f \u043e\u043a\u0442\u044f\u0431\u0440\u044f \u043d\u043e\u044f\u0431\u0440\u044f \u0434\u0435\u043a\u0430\u0431\u0440\u044f".split(" "), 
STANDALONEMONTHS:"\u042f\u043d\u0432\u0430\u0440\u044c \u0424\u0435\u0432\u0440\u0430\u043b\u044c \u041c\u0430\u0440\u0442 \u0410\u043f\u0440\u0435\u043b\u044c \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433\u0443\u0441\u0442 \u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c \u041e\u043a\u0442\u044f\u0431\u0440\u044c \u041d\u043e\u044f\u0431\u0440\u044c \u0414\u0435\u043a\u0430\u0431\u0440\u044c".split(" "), SHORTMONTHS:"\u044f\u043d\u0432. \u0444\u0435\u0432\u0440. \u043c\u0430\u0440\u0442\u0430 \u0430\u043f\u0440. \u043c\u0430\u044f \u0438\u044e\u043d\u044f \u0438\u044e\u043b\u044f \u0430\u0432\u0433. \u0441\u0435\u043d\u0442. \u043e\u043a\u0442. \u043d\u043e\u044f\u0431. \u0434\u0435\u043a.".split(" "), 
STANDALONESHORTMONTHS:"\u042f\u043d\u0432. \u0424\u0435\u0432\u0440. \u041c\u0430\u0440\u0442 \u0410\u043f\u0440. \u041c\u0430\u0439 \u0418\u044e\u043d\u044c \u0418\u044e\u043b\u044c \u0410\u0432\u0433. \u0421\u0435\u043d\u0442. \u041e\u043a\u0442. \u041d\u043e\u044f\u0431. \u0414\u0435\u043a.".split(" "), WEEKDAYS:"\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0432\u0442\u043e\u0440\u043d\u0438\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440\u0433 \u043f\u044f\u0442\u043d\u0438\u0446\u0430 \u0441\u0443\u0431\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435 \u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a \u0412\u0442\u043e\u0440\u043d\u0438\u043a \u0421\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440\u0433 \u041f\u044f\u0442\u043d\u0438\u0446\u0430 \u0421\u0443\u0431\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u0432\u0441 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u0412\u0441 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), 
NARROWWEEKDAYS:"\u0432\u0441 \u043f\u043d \u0432\u0442 \u0441\u0440 \u0447\u0442 \u043f\u0442 \u0441\u0431".split(" "), STANDALONENARROWWEEKDAYS:"\u0412\u041f\u0412\u0421\u0427\u041f\u0421".split(""), SHORTQUARTERS:["1-\u0439 \u043a\u0432.", "2-\u0439 \u043a\u0432.", "3-\u0439 \u043a\u0432.", "4-\u0439 \u043a\u0432."], QUARTERS:["1-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "2-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "3-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "4-\u0439 \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], 
AMPMS:["\u0434\u043e \u043f\u043e\u043b\u0443\u0434\u043d\u044f", "\u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u0443\u0434\u043d\u044f"], DATEFORMATS:["EEEE, d MMMM y '\u0433'.", "d MMMM y '\u0433'.", "dd MMM y '\u0433'.", "dd.MM.yy"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1}, {0}", "{1}, {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sk = {ERAS:["pred n.l.", "n.l."], ERANAMES:["pred n.l.", "n.l."], NARROWMONTHS:"jfmamjjasond".split(""), STANDALONENARROWMONTHS:"jfmamjjasond".split(""), MONTHS:"janu\u00e1ra febru\u00e1ra marca apr\u00edla m\u00e1ja j\u00fana j\u00fala augusta septembra okt\u00f3bra novembra decembra".split(" "), STANDALONEMONTHS:"janu\u00e1r febru\u00e1r marec apr\u00edl m\u00e1j j\u00fan j\u00fal august september okt\u00f3ber november december".split(" "), SHORTMONTHS:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "), 
STANDALONESHORTMONTHS:"jan feb mar apr m\u00e1j j\u00fan j\u00fal aug sep okt nov dec".split(" "), WEEKDAYS:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "), STANDALONEWEEKDAYS:"nede\u013ea pondelok utorok streda \u0161tvrtok piatok sobota".split(" "), SHORTWEEKDAYS:"ne po ut st \u0161t pi so".split(" "), STANDALONESHORTWEEKDAYS:"ne po ut st \u0161t pi so".split(" "), NARROWWEEKDAYS:"NPUS\u0160PS".split(""), STANDALONENARROWWEEKDAYS:"NPUS\u0160PS".split(""), SHORTQUARTERS:["Q1", 
"Q2", "Q3", "Q4"], QUARTERS:["1. \u0161tvr\u0165rok", "2. \u0161tvr\u0165rok", "3. \u0161tvr\u0165rok", "4. \u0161tvr\u0165rok"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d. MMMM y", "d. MMMM y", "d.M.y", "d.M.y"], TIMEFORMATS:["H:mm:ss zzzz", "H:mm:ss z", "H:mm:ss", "H:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sl = {ERAS:["pr. n. \u0161t.", "po Kr."], ERANAMES:["pred na\u0161im \u0161tetjem", "na\u0161e \u0161tetje"], NARROWMONTHS:"jfmamjjasond".split(""), STANDALONENARROWMONTHS:"jfmamjjasond".split(""), MONTHS:"januar februar marec april maj junij julij avgust september oktober november december".split(" "), STANDALONEMONTHS:"januar februar marec april maj junij julij avgust september oktober november december".split(" "), SHORTMONTHS:"jan. feb. mar. apr. maj jun. jul. avg. sep. okt. nov. dec.".split(" "), 
STANDALONESHORTMONTHS:"jan feb mar apr maj jun jul avg sep okt nov dec".split(" "), WEEKDAYS:"nedelja ponedeljek torek sreda \u010detrtek petek sobota".split(" "), STANDALONEWEEKDAYS:"nedelja ponedeljek torek sreda \u010detrtek petek sobota".split(" "), SHORTWEEKDAYS:"ned. pon. tor. sre. \u010det. pet. sob.".split(" "), STANDALONESHORTWEEKDAYS:"ned pon tor sre \u010det pet sob".split(" "), NARROWWEEKDAYS:"npts\u010dps".split(""), STANDALONENARROWWEEKDAYS:"npts\u010dps".split(""), SHORTQUARTERS:["Q1", 
"Q2", "Q3", "Q4"], QUARTERS:["1. \u010detrtletje", "2. \u010detrtletje", "3. \u010detrtletje", "4. \u010detrtletje"], AMPMS:["dop.", "pop."], DATEFORMATS:["EEEE, dd. MMMM y", "dd. MMMM y", "d. MMM y", "d. MM. yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sq = {ERAS:["p.e.r.", "e.r."], ERANAMES:["para er\u00ebs s\u00eb re", "er\u00ebs s\u00eb re"], NARROWMONTHS:"JSMPMQKGSTND".split(""), STANDALONENARROWMONTHS:"JSMPMQKGSTND".split(""), MONTHS:"janar shkurt mars prill maj qershor korrik gusht shtator tetor n\u00ebntor dhjetor".split(" "), STANDALONEMONTHS:"janar shkurt mars prill maj qershor korrik gusht shtator tetor n\u00ebntor dhjetor".split(" "), SHORTMONTHS:"Jan Shk Mar Pri Maj Qer Kor Gsh Sht Tet N\u00ebn Dhj".split(" "), 
STANDALONESHORTMONTHS:"Jan Shk Mar Pri Maj Qer Kor Gsh Sht Tet N\u00ebn Dhj".split(" "), WEEKDAYS:"e diel;e h\u00ebn\u00eb;e mart\u00eb;e m\u00ebrkur\u00eb;e enjte;e premte;e shtun\u00eb".split(";"), STANDALONEWEEKDAYS:"e diel;e h\u00ebn\u00eb;e mart\u00eb;e m\u00ebrkur\u00eb;e enjte;e premte;e shtun\u00eb".split(";"), SHORTWEEKDAYS:"Die H\u00ebn Mar M\u00ebr Enj Pre Sht".split(" "), STANDALONESHORTWEEKDAYS:"Die H\u00ebn Mar M\u00ebr Enj Pre Sht".split(" "), NARROWWEEKDAYS:"DHMMEPS".split(""), STANDALONENARROWWEEKDAYS:"DHMMEPS".split(""), 
SHORTQUARTERS:["T1", "T2", "T3", "T4"], QUARTERS:["tremujori i par\u00eb", "tremujori i dyt\u00eb", "tremujori i tret\u00eb", "tremujori i kat\u00ebrt"], AMPMS:["paradite", "pasdite"], DATEFORMATS:["EEEE, dd MMMM y", "dd MMMM y", "dd/MM/y", "dd/MM/yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} 'n\u00eb' {0}", "{1} 'n\u00eb' {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sr = {ERAS:["\u043f. \u043d. \u0435.", "\u043d. \u0435."], ERANAMES:["\u041f\u0440\u0435 \u043d\u043e\u0432\u0435 \u0435\u0440\u0435", "\u041d\u043e\u0432\u0435 \u0435\u0440\u0435"], NARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), STANDALONENARROWMONTHS:"\u0458\u0444\u043c\u0430\u043c\u0458\u0458\u0430\u0441\u043e\u043d\u0434".split(""), MONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440 \u0444\u0435\u0431\u0440\u0443\u0430\u0440 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440 \u043e\u043a\u0442\u043e\u0431\u0430\u0440 \u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440 \u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440".split(" "), 
STANDALONEMONTHS:"\u0458\u0430\u043d\u0443\u0430\u0440 \u0444\u0435\u0431\u0440\u0443\u0430\u0440 \u043c\u0430\u0440\u0442 \u0430\u043f\u0440\u0438\u043b \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433\u0443\u0441\u0442 \u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440 \u043e\u043a\u0442\u043e\u0431\u0430\u0440 \u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440 \u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440".split(" "), SHORTMONTHS:"\u0458\u0430\u043d \u0444\u0435\u0431 \u043c\u0430\u0440 \u0430\u043f\u0440 \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433 \u0441\u0435\u043f \u043e\u043a\u0442 \u043d\u043e\u0432 \u0434\u0435\u0446".split(" "), 
STANDALONESHORTMONTHS:"\u0458\u0430\u043d \u0444\u0435\u0431 \u043c\u0430\u0440 \u0430\u043f\u0440 \u043c\u0430\u0458 \u0458\u0443\u043d \u0458\u0443\u043b \u0430\u0432\u0433 \u0441\u0435\u043f \u043e\u043a\u0442 \u043d\u043e\u0432 \u0434\u0435\u0446".split(" "), WEEKDAYS:"\u043d\u0435\u0434\u0435\u0459\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a \u0443\u0442\u043e\u0440\u0430\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a \u043f\u0435\u0442\u0430\u043a \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), 
STANDALONEWEEKDAYS:"\u043d\u0435\u0434\u0435\u0459\u0430 \u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a \u0443\u0442\u043e\u0440\u0430\u043a \u0441\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a \u043f\u0435\u0442\u0430\u043a \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), SHORTWEEKDAYS:"\u043d\u0435\u0434 \u043f\u043e\u043d \u0443\u0442\u043e \u0441\u0440\u0435 \u0447\u0435\u0442 \u043f\u0435\u0442 \u0441\u0443\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u043d\u0435\u0434 \u043f\u043e\u043d \u0443\u0442\u043e \u0441\u0440\u0435 \u0447\u0435\u0442 \u043f\u0435\u0442 \u0441\u0443\u0431".split(" "), 
NARROWWEEKDAYS:"\u043d\u043f\u0443\u0441\u0447\u043f\u0441".split(""), STANDALONENARROWWEEKDAYS:"\u043d\u043f\u0443\u0441\u0447\u043f\u0441".split(""), SHORTQUARTERS:["\u041a1", "\u041a2", "\u041a3", "\u041a4"], QUARTERS:["\u041f\u0440\u0432\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0414\u0440\u0443\u0433\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", "\u0422\u0440\u0435\u045b\u0435 \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435", 
"\u0427\u0435\u0442\u0432\u0440\u0442\u043e \u0442\u0440\u043e\u043c\u0435\u0441\u0435\u0447\u0458\u0435"], AMPMS:["\u043f\u0440\u0435 \u043f\u043e\u0434\u043d\u0435", "\u043f\u043e\u043f\u043e\u0434\u043d\u0435"], DATEFORMATS:["EEEE, dd. MMMM y.", "dd. MMMM y.", "dd.MM.y.", "d.M.yy."], TIMEFORMATS:["HH.mm.ss zzzz", "HH.mm.ss z", "HH.mm.ss", "HH.mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_sv = {ERAS:["f.Kr.", "e.Kr."], ERANAMES:["f\u00f6re Kristus", "efter Kristus"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"januari februari mars april maj juni juli augusti september oktober november december".split(" "), STANDALONEMONTHS:"Januari Februari Mars April Maj Juni Juli Augusti September Oktober November December".split(" "), SHORTMONTHS:"jan feb mar apr maj jun jul aug sep okt nov dec".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mar Apr Maj Jun Jul Aug Sep Okt Nov Dec".split(" "), 
WEEKDAYS:"s\u00f6ndag m\u00e5ndag tisdag onsdag torsdag fredag l\u00f6rdag".split(" "), STANDALONEWEEKDAYS:"S\u00f6ndag M\u00e5ndag Tisdag Onsdag Torsdag Fredag L\u00f6rdag".split(" "), SHORTWEEKDAYS:"s\u00f6n m\u00e5n tis ons tors fre l\u00f6r".split(" "), STANDALONESHORTWEEKDAYS:"S\u00f6n M\u00e5n Tis Ons Tor Fre L\u00f6r".split(" "), NARROWWEEKDAYS:"SMTOTFL".split(""), STANDALONENARROWWEEKDAYS:"SMTOTFL".split(""), SHORTQUARTERS:["K1", "K2", "K3", "K4"], QUARTERS:["1:a kvartalet", "2:a kvartalet", 
"3:e kvartalet", "4:e kvartalet"], AMPMS:["fm", "em"], DATEFORMATS:["EEEE'en' 'den' d:'e' MMMM y", "d MMMM y", "d MMM y", "y-MM-dd"], TIMEFORMATS:["'kl'. HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:3};
goog.i18n.DateTimeSymbols_sw = {ERAS:["KK", "BK"], ERANAMES:["Kabla ya Kristo", "Baada ya Kristo"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januari Februari Machi Aprili Mei Juni Julai Agosti Septemba Oktoba Novemba Desemba".split(" "), STANDALONEMONTHS:"Januari Februari Machi Aprili Mei Juni Julai Agosti Septemba Oktoba Novemba Desemba".split(" "), SHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des".split(" "), 
WEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), STANDALONEWEEKDAYS:"Jumapili Jumatatu Jumanne Jumatano Alhamisi Ijumaa Jumamosi".split(" "), SHORTWEEKDAYS:"J2 J3 J4 J5 Alh Ij J1".split(" "), STANDALONESHORTWEEKDAYS:"J2 J3 J4 J5 Alh Ij J1".split(" "), NARROWWEEKDAYS:"2345AI1".split(""), STANDALONENARROWWEEKDAYS:"2345AI1".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Robo 1", "Robo 2", "Robo 3", "Robo 4"], AMPMS:["AM", "PM"], DATEFORMATS:["EEEE, d MMMM y", 
"d MMMM y", "d MMM y", "dd/MM/y"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ta = {ERAS:["\u0b95\u0bbf.\u0bae\u0bc1.", "\u0b95\u0bbf.\u0baa\u0bbf."], ERANAMES:["\u0b95\u0bbf\u0bb1\u0bbf\u0bb8\u0bcd\u0ba4\u0bc1\u0bb5\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0bae\u0bc1\u0ba9\u0bcd", "\u0b85\u0ba9\u0bcb \u0b9f\u0bcb\u0bae\u0bbf\u0ba9\u0bbf"], NARROWMONTHS:"\u0b9c \u0baa\u0bbf \u0bae\u0bbe \u0b8f \u0bae\u0bc7 \u0b9c\u0bc2 \u0b9c\u0bc2 \u0b86 \u0b9a\u0bc6 \u0b85 \u0ba8 \u0b9f\u0bbf".split(" "), STANDALONENARROWMONTHS:"\u0b9c \u0baa\u0bbf \u0bae\u0bbe \u0b8f \u0bae\u0bc7 \u0b9c\u0bc2 \u0b9c\u0bc2 \u0b86 \u0b9a\u0bc6 \u0b85 \u0ba8 \u0b9f\u0bbf".split(" "), 
MONTHS:"\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf \u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf \u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd \u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bcd \u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd \u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd".split(" "), STANDALONEMONTHS:"\u0b9c\u0ba9\u0bb5\u0bb0\u0bbf \u0baa\u0bbf\u0baa\u0bcd\u0bb0\u0bb5\u0bb0\u0bbf \u0bae\u0bbe\u0bb0\u0bcd\u0b9a\u0bcd \u0b8f\u0baa\u0bcd\u0bb0\u0bb2\u0bcd \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95\u0bb8\u0bcd\u0b9f\u0bc1 \u0b9a\u0bc6\u0baa\u0bcd\u0b9f\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b85\u0b95\u0bcd\u0b9f\u0bcb\u0baa\u0bb0\u0bcd \u0ba8\u0bb5\u0bae\u0bcd\u0baa\u0bb0\u0bcd \u0b9f\u0bbf\u0b9a\u0bae\u0bcd\u0baa\u0bb0\u0bcd".split(" "), 
SHORTMONTHS:"\u0b9c\u0ba9. \u0baa\u0bbf\u0baa\u0bcd. \u0bae\u0bbe\u0bb0\u0bcd. \u0b8f\u0baa\u0bcd. \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95. \u0b9a\u0bc6\u0baa\u0bcd. \u0b85\u0b95\u0bcd. \u0ba8\u0bb5. \u0b9f\u0bbf\u0b9a.".split(" "), STANDALONESHORTMONTHS:"\u0b9c\u0ba9. \u0baa\u0bbf\u0baa\u0bcd. \u0bae\u0bbe\u0bb0\u0bcd. \u0b8f\u0baa\u0bcd. \u0bae\u0bc7 \u0b9c\u0bc2\u0ba9\u0bcd \u0b9c\u0bc2\u0bb2\u0bc8 \u0b86\u0b95. \u0b9a\u0bc6\u0baa\u0bcd. \u0b85\u0b95\u0bcd. \u0ba8\u0bb5. \u0b9f\u0bbf\u0b9a.".split(" "), 
WEEKDAYS:"\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1 \u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd \u0baa\u0bc1\u0ba4\u0ba9\u0bcd \u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd \u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf \u0b9a\u0ba9\u0bbf".split(" "), STANDALONEWEEKDAYS:"\u0b9e\u0bbe\u0baf\u0bbf\u0bb1\u0bc1 \u0ba4\u0bbf\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b9a\u0bc6\u0bb5\u0bcd\u0bb5\u0bbe\u0baf\u0bcd \u0baa\u0bc1\u0ba4\u0ba9\u0bcd \u0bb5\u0bbf\u0baf\u0bbe\u0bb4\u0ba9\u0bcd \u0bb5\u0bc6\u0bb3\u0bcd\u0bb3\u0bbf \u0b9a\u0ba9\u0bbf".split(" "), 
SHORTWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), STANDALONESHORTWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), NARROWWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), STANDALONENARROWWEEKDAYS:"\u0b9e\u0bbe \u0ba4\u0bbf \u0b9a\u0bc6 \u0baa\u0bc1 \u0bb5\u0bbf \u0bb5\u0bc6 \u0b9a".split(" "), SHORTQUARTERS:["\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc11", 
"\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc12", "\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc13", "\u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc14"], QUARTERS:["\u0bae\u0bc1\u0ba4\u0bb2\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0b87\u0bb0\u0ba3\u0bcd\u0b9f\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0bae\u0bc2\u0ba9\u0bcd\u0bb1\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1", "\u0ba8\u0bbe\u0ba9\u0bcd\u0b95\u0bbe\u0bae\u0bcd \u0b95\u0bbe\u0bb2\u0bbe\u0ba3\u0bcd\u0b9f\u0bc1"], 
AMPMS:["\u0bae\u0bc1\u0bb1\u0bcd\u0baa\u0b95\u0bb2\u0bcd", "\u0baa\u0bbf\u0bb1\u0bcd\u0baa\u0b95\u0bb2\u0bcd"], DATEFORMATS:["EEEE, d MMMM, y", "d MMMM, y", "d MMM, y", "d-M-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_te = {ERAS:["\u0c15\u0c4d\u0c30\u0c40\u0c2a\u0c42", "\u0c15\u0c4d\u0c30\u0c40\u0c36"], ERANAMES:["\u0c08\u0c38\u0c3e\u0c2a\u0c42\u0c30\u0c4d\u0c35.", "\u0c38\u0c28\u0c4d."], NARROWMONTHS:"\u0c1c \u0c2b\u0c3f \u0c2e\u0c3e \u0c0f \u0c2e\u0c47 \u0c1c\u0c42 \u0c1c\u0c41 \u0c06 \u0c38\u0c46 \u0c05 \u0c28 \u0c21\u0c3f".split(" "), STANDALONENARROWMONTHS:"\u0c1c \u0c2b\u0c3f \u0c2e\u0c3e \u0c0f \u0c2e\u0c47 \u0c1c\u0c42 \u0c1c\u0c41 \u0c06 \u0c38\u0c46 \u0c05 \u0c28 \u0c21\u0c3f".split(" "), 
MONTHS:"\u0c1c\u0c28\u0c35\u0c30\u0c3f \u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c41\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), STANDALONEMONTHS:"\u0c1c\u0c28\u0c35\u0c30\u0c3f \u0c2b\u0c3f\u0c2c\u0c4d\u0c30\u0c35\u0c30\u0c3f \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0e\u0c2a\u0c4d\u0c30\u0c3f\u0c32\u0c4d \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c42\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02\u0c2c\u0c30\u0c4d \u0c05\u0c15\u0c4d\u0c1f\u0c4b\u0c2c\u0c30\u0c4d \u0c28\u0c35\u0c02\u0c2c\u0c30\u0c4d \u0c21\u0c3f\u0c38\u0c46\u0c02\u0c2c\u0c30\u0c4d".split(" "), 
SHORTMONTHS:"\u0c1c\u0c28 \u0c2b\u0c3f\u0c2c\u0c4d\u0c30 \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0f\u0c2a\u0c4d\u0c30\u0c3f \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c41\u0c32\u0c48 \u0c06\u0c17 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02 \u0c05\u0c15\u0c4d\u0c1f\u0c4b \u0c28\u0c35\u0c02 \u0c21\u0c3f\u0c38\u0c46\u0c02".split(" "), STANDALONESHORTMONTHS:"\u0c1c\u0c28 \u0c2b\u0c3f\u0c2c\u0c4d\u0c30 \u0c2e\u0c3e\u0c30\u0c4d\u0c1a\u0c3f \u0c0f\u0c2a\u0c4d\u0c30\u0c3f \u0c2e\u0c47 \u0c1c\u0c42\u0c28\u0c4d \u0c1c\u0c41\u0c32\u0c48 \u0c06\u0c17\u0c38\u0c4d\u0c1f\u0c41 \u0c38\u0c46\u0c2a\u0c4d\u0c1f\u0c46\u0c02 \u0c05\u0c15\u0c4d\u0c1f\u0c4b \u0c28\u0c35\u0c02 \u0c21\u0c3f\u0c38\u0c46\u0c02".split(" "), 
WEEKDAYS:"\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02 \u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02 \u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02 \u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02 \u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02".split(" "), STANDALONEWEEKDAYS:"\u0c06\u0c26\u0c3f\u0c35\u0c3e\u0c30\u0c02 \u0c38\u0c4b\u0c2e\u0c35\u0c3e\u0c30\u0c02 \u0c2e\u0c02\u0c17\u0c33\u0c35\u0c3e\u0c30\u0c02 \u0c2c\u0c41\u0c27\u0c35\u0c3e\u0c30\u0c02 \u0c17\u0c41\u0c30\u0c41\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c41\u0c15\u0c4d\u0c30\u0c35\u0c3e\u0c30\u0c02 \u0c36\u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c02".split(" "), 
SHORTWEEKDAYS:"\u0c06\u0c26\u0c3f \u0c38\u0c4b\u0c2e \u0c2e\u0c02\u0c17\u0c33 \u0c2c\u0c41\u0c27 \u0c17\u0c41\u0c30\u0c41 \u0c36\u0c41\u0c15\u0c4d\u0c30 \u0c36\u0c28\u0c3f".split(" "), STANDALONESHORTWEEKDAYS:"\u0c06\u0c26\u0c3f \u0c38\u0c4b\u0c2e \u0c2e\u0c02\u0c17\u0c33 \u0c2c\u0c41\u0c27 \u0c17\u0c41\u0c30\u0c41 \u0c36\u0c41\u0c15\u0c4d\u0c30 \u0c36\u0c28\u0c3f".split(" "), NARROWWEEKDAYS:"\u0c06 \u0c38\u0c4b \u0c2e \u0c2c\u0c41 \u0c17\u0c41 \u0c36\u0c41 \u0c36".split(" "), STANDALONENARROWWEEKDAYS:"\u0c06 \u0c38\u0c4b \u0c2e \u0c2c\u0c41 \u0c17\u0c41 \u0c36\u0c41 \u0c36".split(" "), 
SHORTQUARTERS:["\u0c24\u0c4d\u0c30\u0c481", "\u0c24\u0c4d\u0c30\u0c482", "\u0c24\u0c4d\u0c30\u0c483", "\u0c24\u0c4d\u0c30\u0c484"], QUARTERS:["1\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02", "2\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02", "3\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02", "4\u0c35 \u0c24\u0c4d\u0c30\u0c48\u0c2e\u0c3e\u0c38\u0c02"], AMPMS:["AM", "PM"], DATEFORMATS:["d MMMM y EEEE", "d MMMM y", "d MMM y", "dd-MM-yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", 
"h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[6, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_th = {ERAS:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19 \u0e04.\u0e28.", "\u0e04.\u0e28."], ERANAMES:["\u0e1b\u0e35\u0e01\u0e48\u0e2d\u0e19\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a", "\u0e04\u0e23\u0e34\u0e2a\u0e15\u0e4c\u0e28\u0e31\u0e01\u0e23\u0e32\u0e0a"], NARROWMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), 
STANDALONENARROWMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), MONTHS:"\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21 \u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e21\u0e35\u0e19\u0e32\u0e04\u0e21 \u0e40\u0e21\u0e29\u0e32\u0e22\u0e19 \u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21 \u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19 \u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21 \u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21 \u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19 \u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21".split(" "), 
STANDALONEMONTHS:"\u0e21\u0e01\u0e23\u0e32\u0e04\u0e21 \u0e01\u0e38\u0e21\u0e20\u0e32\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e21\u0e35\u0e19\u0e32\u0e04\u0e21 \u0e40\u0e21\u0e29\u0e32\u0e22\u0e19 \u0e1e\u0e24\u0e29\u0e20\u0e32\u0e04\u0e21 \u0e21\u0e34\u0e16\u0e38\u0e19\u0e32\u0e22\u0e19 \u0e01\u0e23\u0e01\u0e0e\u0e32\u0e04\u0e21 \u0e2a\u0e34\u0e07\u0e2b\u0e32\u0e04\u0e21 \u0e01\u0e31\u0e19\u0e22\u0e32\u0e22\u0e19 \u0e15\u0e38\u0e25\u0e32\u0e04\u0e21 \u0e1e\u0e24\u0e28\u0e08\u0e34\u0e01\u0e32\u0e22\u0e19 \u0e18\u0e31\u0e19\u0e27\u0e32\u0e04\u0e21".split(" "), 
SHORTMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), STANDALONESHORTMONTHS:"\u0e21.\u0e04. \u0e01.\u0e1e. \u0e21\u0e35.\u0e04. \u0e40\u0e21.\u0e22. \u0e1e.\u0e04. \u0e21\u0e34.\u0e22. \u0e01.\u0e04. \u0e2a.\u0e04. \u0e01.\u0e22. \u0e15.\u0e04. \u0e1e.\u0e22. \u0e18.\u0e04.".split(" "), WEEKDAYS:"\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18 \u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35 \u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c".split(" "), 
STANDALONEWEEKDAYS:"\u0e27\u0e31\u0e19\u0e2d\u0e32\u0e17\u0e34\u0e15\u0e22\u0e4c \u0e27\u0e31\u0e19\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e2d\u0e31\u0e07\u0e04\u0e32\u0e23 \u0e27\u0e31\u0e19\u0e1e\u0e38\u0e18 \u0e27\u0e31\u0e19\u0e1e\u0e24\u0e2b\u0e31\u0e2a\u0e1a\u0e14\u0e35 \u0e27\u0e31\u0e19\u0e28\u0e38\u0e01\u0e23\u0e4c \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c".split(" "), SHORTWEEKDAYS:"\u0e2d\u0e32. \u0e08. \u0e2d. \u0e1e. \u0e1e\u0e24. \u0e28. \u0e2a.".split(" "), 
STANDALONESHORTWEEKDAYS:"\u0e2d\u0e32. \u0e08. \u0e2d. \u0e1e. \u0e1e\u0e24. \u0e28. \u0e2a.".split(" "), NARROWWEEKDAYS:"\u0e2d\u0e32 \u0e08 \u0e2d \u0e1e \u0e1e\u0e24 \u0e28 \u0e2a".split(" "), STANDALONENARROWWEEKDAYS:"\u0e2d\u0e32 \u0e08 \u0e2d \u0e1e \u0e1e\u0e24 \u0e28 \u0e2a".split(" "), SHORTQUARTERS:["\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 1", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 2", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 3", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 4"], QUARTERS:["\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 1", 
"\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 2", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 3", "\u0e44\u0e15\u0e23\u0e21\u0e32\u0e2a 4"], AMPMS:["\u0e01\u0e48\u0e2d\u0e19\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07", "\u0e2b\u0e25\u0e31\u0e07\u0e40\u0e17\u0e35\u0e48\u0e22\u0e07"], DATEFORMATS:["EEEE\u0e17\u0e35\u0e48 d MMMM G y", "d MMMM y", "d MMM y", "d/M/yy"], TIMEFORMATS:["H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 mm \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 zzzz", "H \u0e19\u0e32\u0e2c\u0e34\u0e01\u0e32 mm \u0e19\u0e32\u0e17\u0e35 ss \u0e27\u0e34\u0e19\u0e32\u0e17\u0e35 z", 
"HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_tl = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"EPMAMHHASOND".split(""), STANDALONENARROWMONTHS:"EPMAMHHASOND".split(""), MONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), STANDALONEMONTHS:"Enero Pebrero Marso Abril Mayo Hunyo Hulyo Agosto Setyembre Oktubre Nobyembre Disyembre".split(" "), SHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), STANDALONESHORTMONTHS:"Ene Peb Mar Abr May Hun Hul Ago Set Okt Nob Dis".split(" "), 
WEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), STANDALONEWEEKDAYS:"Linggo Lunes Martes Miyerkules Huwebes Biyernes Sabado".split(" "), SHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), STANDALONESHORTWEEKDAYS:"Lin Lun Mar Miy Huw Biy Sab".split(" "), NARROWWEEKDAYS:"LLMMHBS".split(""), STANDALONENARROWWEEKDAYS:"LLMMHBS".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ika-1 quarter", "ika-2 quarter", "ika-3 quarter", "ika-4 na quarter"], AMPMS:["AM", 
"PM"], DATEFORMATS:["EEEE, MMMM d, y", "MMMM d, y", "MMM d, y", "M/d/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} 'ng' {0}", "{1} 'ng' {0}", "{1}, {0}", "{1}, {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_tr = {ERAS:["M\u00d6", "MS"], ERANAMES:["Milattan \u00d6nce", "Milattan Sonra"], NARROWMONTHS:"O\u015eMNMHTAEEKA".split(""), STANDALONENARROWMONTHS:"O\u015eMNMHTAEEKA".split(""), MONTHS:"Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\u00fcl Ekim Kas\u0131m Aral\u0131k".split(" "), STANDALONEMONTHS:"Ocak \u015eubat Mart Nisan May\u0131s Haziran Temmuz A\u011fustos Eyl\u00fcl Ekim Kas\u0131m Aral\u0131k".split(" "), SHORTMONTHS:"Oca \u015eub Mar Nis May Haz Tem A\u011fu Eyl Eki Kas Ara".split(" "), 
STANDALONESHORTMONTHS:"Oca \u015eub Mar Nis May Haz Tem A\u011fu Eyl Eki Kas Ara".split(" "), WEEKDAYS:"Pazar Pazartesi Sal\u0131 \u00c7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "), STANDALONEWEEKDAYS:"Pazar Pazartesi Sal\u0131 \u00c7ar\u015famba Per\u015fembe Cuma Cumartesi".split(" "), SHORTWEEKDAYS:"Paz Pzt Sal \u00c7ar Per Cum Cmt".split(" "), STANDALONESHORTWEEKDAYS:"Paz Pzt Sal \u00c7ar Per Cum Cmt".split(" "), NARROWWEEKDAYS:"PPS\u00c7PCC".split(""), STANDALONENARROWWEEKDAYS:"PPS\u00c7PCC".split(""), 
SHORTQUARTERS:["\u00c71", "\u00c72", "\u00c73", "\u00c74"], QUARTERS:["1. \u00e7eyrek", "2. \u00e7eyrek", "3. \u00e7eyrek", "4. \u00e7eyrek"], AMPMS:["\u00d6\u00d6", "\u00d6S"], DATEFORMATS:["d MMMM y EEEE", "d MMMM y", "d MMM y", "d MM y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_uk = {ERAS:["\u0434\u043e \u043d.\u0435.", "\u043d.\u0435."], ERANAMES:["\u0434\u043e \u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438", "\u043d\u0430\u0448\u043e\u0457 \u0435\u0440\u0438"], NARROWMONTHS:"\u0421\u041b\u0411\u041a\u0422\u0427\u041b\u0421\u0412\u0416\u041b\u0413".split(""), STANDALONENARROWMONTHS:"\u0421\u041b\u0411\u041a\u0422\u0427\u041b\u0421\u0412\u0416\u041b\u0413".split(""), MONTHS:"\u0441\u0456\u0447\u043d\u044f \u043b\u044e\u0442\u043e\u0433\u043e \u0431\u0435\u0440\u0435\u0437\u043d\u044f \u043a\u0432\u0456\u0442\u043d\u044f \u0442\u0440\u0430\u0432\u043d\u044f \u0447\u0435\u0440\u0432\u043d\u044f \u043b\u0438\u043f\u043d\u044f \u0441\u0435\u0440\u043f\u043d\u044f \u0432\u0435\u0440\u0435\u0441\u043d\u044f \u0436\u043e\u0432\u0442\u043d\u044f \u043b\u0438\u0441\u0442\u043e\u043f\u0430\u0434\u0430 \u0433\u0440\u0443\u0434\u043d\u044f".split(" "), 
STANDALONEMONTHS:"\u0421\u0456\u0447\u0435\u043d\u044c \u041b\u044e\u0442\u0438\u0439 \u0411\u0435\u0440\u0435\u0437\u0435\u043d\u044c \u041a\u0432\u0456\u0442\u0435\u043d\u044c \u0422\u0440\u0430\u0432\u0435\u043d\u044c \u0427\u0435\u0440\u0432\u0435\u043d\u044c \u041b\u0438\u043f\u0435\u043d\u044c \u0421\u0435\u0440\u043f\u0435\u043d\u044c \u0412\u0435\u0440\u0435\u0441\u0435\u043d\u044c \u0416\u043e\u0432\u0442\u0435\u043d\u044c \u041b\u0438\u0441\u0442\u043e\u043f\u0430\u0434 \u0413\u0440\u0443\u0434\u0435\u043d\u044c".split(" "), 
SHORTMONTHS:"\u0441\u0456\u0447. \u043b\u044e\u0442. \u0431\u0435\u0440. \u043a\u0432\u0456\u0442. \u0442\u0440\u0430\u0432. \u0447\u0435\u0440\u0432. \u043b\u0438\u043f. \u0441\u0435\u0440\u043f. \u0432\u0435\u0440. \u0436\u043e\u0432\u0442. \u043b\u0438\u0441\u0442. \u0433\u0440\u0443\u0434.".split(" "), STANDALONESHORTMONTHS:"\u0421\u0456\u0447 \u041b\u044e\u0442 \u0411\u0435\u0440 \u041a\u0432\u0456 \u0422\u0440\u0430 \u0427\u0435\u0440 \u041b\u0438\u043f \u0421\u0435\u0440 \u0412\u0435\u0440 \u0416\u043e\u0432 \u041b\u0438\u0441 \u0413\u0440\u0443".split(" "), 
WEEKDAYS:"\u043d\u0435\u0434\u0456\u043b\u044f \u043f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0432\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0441\u0435\u0440\u0435\u0434\u0430 \u0447\u0435\u0442\u0432\u0435\u0440 \u043f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f \u0441\u0443\u0431\u043e\u0442\u0430".split(" "), STANDALONEWEEKDAYS:"\u041d\u0435\u0434\u0456\u043b\u044f \u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a \u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a \u0421\u0435\u0440\u0435\u0434\u0430 \u0427\u0435\u0442\u0432\u0435\u0440 \u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f \u0421\u0443\u0431\u043e\u0442\u0430".split(" "), 
SHORTWEEKDAYS:"\u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), STANDALONESHORTWEEKDAYS:"\u041d\u0434 \u041f\u043d \u0412\u0442 \u0421\u0440 \u0427\u0442 \u041f\u0442 \u0421\u0431".split(" "), NARROWWEEKDAYS:"\u041d\u041f\u0412\u0421\u0427\u041f\u0421".split(""), STANDALONENARROWWEEKDAYS:"\u041d\u041f\u0412\u0421\u0427\u041f\u0421".split(""), SHORTQUARTERS:["I \u043a\u0432.", "II \u043a\u0432.", "III \u043a\u0432.", "IV \u043a\u0432."], QUARTERS:["I \u043a\u0432\u0430\u0440\u0442\u0430\u043b", 
"II \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "III \u043a\u0432\u0430\u0440\u0442\u0430\u043b", "IV \u043a\u0432\u0430\u0440\u0442\u0430\u043b"], AMPMS:["\u0434\u043f", "\u043f\u043f"], DATEFORMATS:["EEEE, d MMMM y '\u0440'.", "d MMMM y '\u0440'.", "d MMM y", "dd.MM.yy"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_ur = {ERAS:["\u0642 \u0645", "\u0639\u06cc\u0633\u0648\u06cc \u0633\u0646"], ERANAMES:["\u0642\u0628\u0644 \u0645\u0633\u06cc\u062d", "\u0639\u06cc\u0633\u0648\u06cc \u0633\u0646"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), 
STANDALONEMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), SHORTMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), 
STANDALONESHORTMONTHS:"\u062c\u0646\u0648\u0631\u06cc \u0641\u0631\u0648\u0631\u06cc \u0645\u0627\u0631\u0686 \u0627\u067e\u0631\u06cc\u0644 \u0645\u0626\u06cc \u062c\u0648\u0646 \u062c\u0648\u0644\u0627\u0626\u06cc \u0627\u06af\u0633\u062a \u0633\u062a\u0645\u0628\u0631 \u0627\u06a9\u062a\u0648\u0628\u0631 \u0646\u0648\u0645\u0628\u0631 \u062f\u0633\u0645\u0628\u0631".split(" "), WEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), 
STANDALONEWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), SHORTWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), STANDALONESHORTWEEKDAYS:"\u0627\u062a\u0648\u0627\u0631 \u0633\u0648\u0645\u0648\u0627\u0631 \u0645\u0646\u06af\u0644 \u0628\u062f\u06be \u062c\u0645\u0639\u0631\u0627\u062a \u062c\u0645\u0639\u06c1 \u06c1\u0641\u062a\u06c1".split(" "), 
NARROWWEEKDAYS:"SMTWTFS".split(""), STANDALONENARROWWEEKDAYS:"SMTWTFS".split(""), SHORTQUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062a\u06cc\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], QUARTERS:["\u067e\u06c1\u0644\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u062f\u0648\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", 
"\u062a\u06cc\u0633\u0631\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc", "\u0686\u0648\u062a\u0647\u06cc \u0633\u06c1 \u0645\u0627\u06c1\u06cc"], AMPMS:["\u0642\u0628\u0644 \u062f\u0648\u067e\u06c1\u0631", "\u0628\u0639\u062f \u062f\u0648\u067e\u06c1\u0631"], DATEFORMATS:["EEEE\u060c d MMMM\u060c y", "d MMMM\u060c y", "d MMM\u060c y", "d/M/yy"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 
6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_vi = {ERAS:["tr. CN", "sau CN"], ERANAMES:["tr. CN", "sau CN"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"th\u00e1ng 1;th\u00e1ng 2;th\u00e1ng 3;th\u00e1ng 4;th\u00e1ng 5;th\u00e1ng 6;th\u00e1ng 7;th\u00e1ng 8;th\u00e1ng 9;th\u00e1ng 10;th\u00e1ng 11;th\u00e1ng 12".split(";"), STANDALONEMONTHS:"Th\u00e1ng 1;Th\u00e1ng 2;Th\u00e1ng 3;Th\u00e1ng 4;Th\u00e1ng 5;Th\u00e1ng 6;Th\u00e1ng 7;Th\u00e1ng 8;Th\u00e1ng 9;Th\u00e1ng 10;Th\u00e1ng 11;Th\u00e1ng 12".split(";"), 
SHORTMONTHS:"thg 1;thg 2;thg 3;thg 4;thg 5;thg 6;thg 7;thg 8;thg 9;thg 10;thg 11;thg 12".split(";"), STANDALONESHORTMONTHS:"Thg 1;Thg 2;Thg 3;Thg 4;Thg 5;Thg 6;Thg 7;Thg 8;Thg 9;Thg 10;Thg 11;Thg 12".split(";"), WEEKDAYS:"Ch\u1ee7 Nh\u1eadt;Th\u1ee9 Hai;Th\u1ee9 Ba;Th\u1ee9 T\u01b0;Th\u1ee9 N\u0103m;Th\u1ee9 S\u00e1u;Th\u1ee9 B\u1ea3y".split(";"), STANDALONEWEEKDAYS:"Ch\u1ee7 Nh\u1eadt;Th\u1ee9 Hai;Th\u1ee9 Ba;Th\u1ee9 T\u01b0;Th\u1ee9 N\u0103m;Th\u1ee9 S\u00e1u;Th\u1ee9 B\u1ea3y".split(";"), SHORTWEEKDAYS:"CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7".split(";"), 
STANDALONESHORTWEEKDAYS:"CN;Th 2;Th 3;Th 4;Th 5;Th 6;Th 7".split(";"), NARROWWEEKDAYS:"CN T2 T3 T4 T5 T6 T7".split(" "), STANDALONENARROWWEEKDAYS:"CN T2 T3 T4 T5 T6 T7".split(" "), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["Qu\u00fd 1", "Qu\u00fd 2", "Qu\u00fd 3", "Qu\u00fd 4"], AMPMS:["SA", "CH"], DATEFORMATS:["EEEE, 'ng\u00e0y' dd MMMM 'n\u0103m' y", "'Ng\u00e0y' dd 'th\u00e1ng' MM 'n\u0103m' y", "dd-MM-y", "dd/MM/y"], TIMEFORMATS:["HH:mm:ss zzzz", "HH:mm:ss z", "HH:mm:ss", "HH:mm"], DATETIMEFORMATS:["{0} {1}", 
"{0} {1}", "{0} {1}", "{0} {1}"], FIRSTDAYOFWEEK:0, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:6};
goog.i18n.DateTimeSymbols_zh = {ERAS:["\u516c\u5143\u524d", "\u516c\u5143"], ERANAMES:["\u516c\u5143\u524d", "\u516c\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), STANDALONEMONTHS:"\u4e00\u6708 \u4e8c\u6708 \u4e09\u6708 \u56db\u6708 \u4e94\u6708 \u516d\u6708 \u4e03\u6708 \u516b\u6708 \u4e5d\u6708 \u5341\u6708 \u5341\u4e00\u6708 \u5341\u4e8c\u6708".split(" "), 
SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), 
SHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), STANDALONESHORTWEEKDAYS:"\u5468\u65e5 \u5468\u4e00 \u5468\u4e8c \u5468\u4e09 \u5468\u56db \u5468\u4e94 \u5468\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63\u5ea6", "2\u5b63\u5ea6", "3\u5b63\u5ea6", "4\u5b63\u5ea6"], QUARTERS:["\u7b2c\u4e00\u5b63\u5ea6", 
"\u7b2c\u4e8c\u5b63\u5ea6", "\u7b2c\u4e09\u5b63\u5ea6", "\u7b2c\u56db\u5b63\u5ea6"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", "y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "yy/M/d"], TIMEFORMATS:["zzzzah:mm:ss", "zah:mm:ss", "ah:mm:ss", "ah:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zh_CN = goog.i18n.DateTimeSymbols_zh;
goog.i18n.DateTimeSymbols_zh_HK = {ERAS:["\u897f\u5143\u524d", "\u897f\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), SHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), 
STANDALONESHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", "\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", 
"y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "d/M/yy"], TIMEFORMATS:["ah:mm:ss [zzzz]", "ah:mm:ss [z]", "ah:mm:ss", "ah:mm"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1}{0}", "{1}{0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zh_TW = {ERAS:["\u897f\u5143\u524d", "\u897f\u5143"], ERANAMES:["\u897f\u5143\u524d", "\u897f\u5143"], NARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), STANDALONENARROWMONTHS:"1 2 3 4 5 6 7 8 9 10 11 12".split(" "), MONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), STANDALONEMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), SHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), 
STANDALONESHORTMONTHS:"1\u6708 2\u6708 3\u6708 4\u6708 5\u6708 6\u6708 7\u6708 8\u6708 9\u6708 10\u6708 11\u6708 12\u6708".split(" "), WEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), STANDALONEWEEKDAYS:"\u661f\u671f\u65e5 \u661f\u671f\u4e00 \u661f\u671f\u4e8c \u661f\u671f\u4e09 \u661f\u671f\u56db \u661f\u671f\u4e94 \u661f\u671f\u516d".split(" "), SHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), 
STANDALONESHORTWEEKDAYS:"\u9031\u65e5 \u9031\u4e00 \u9031\u4e8c \u9031\u4e09 \u9031\u56db \u9031\u4e94 \u9031\u516d".split(" "), NARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), STANDALONENARROWWEEKDAYS:"\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".split(""), SHORTQUARTERS:["1\u5b63", "2\u5b63", "3\u5b63", "4\u5b63"], QUARTERS:["\u7b2c1\u5b63", "\u7b2c2\u5b63", "\u7b2c3\u5b63", "\u7b2c4\u5b63"], AMPMS:["\u4e0a\u5348", "\u4e0b\u5348"], DATEFORMATS:["y\u5e74M\u6708d\u65e5EEEE", 
"y\u5e74M\u6708d\u65e5", "y\u5e74M\u6708d\u65e5", "y/M/d"], TIMEFORMATS:["zzzzah\u6642mm\u5206ss\u79d2", "zah\u6642mm\u5206ss\u79d2", "ah:mm:ss", "ah:mm"], DATETIMEFORMATS:["{1}{0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols_zu = {ERAS:["BC", "AD"], ERANAMES:["BC", "AD"], NARROWMONTHS:"JFMAMJJASOND".split(""), STANDALONENARROWMONTHS:"JFMAMJJASOND".split(""), MONTHS:"Januwari Februwari Mashi Apreli Meyi Juni Julayi Agasti Septhemba Okthoba Novemba Disemba".split(" "), STANDALONEMONTHS:"uJanuwari uFebruwari uMashi u-Apreli uMeyi uJuni uJulayi uAgasti uSepthemba u-Okthoba uNovemba uDisemba".split(" "), SHORTMONTHS:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "), STANDALONESHORTMONTHS:"Jan Feb Mas Apr Mey Jun Jul Aga Sep Okt Nov Dis".split(" "), 
WEEKDAYS:"Sonto Msombuluko Lwesibili Lwesithathu Lwesine Lwesihlanu Mgqibelo".split(" "), STANDALONEWEEKDAYS:"Sonto Msombuluko Lwesibili Lwesithathu Lwesine Lwesihlanu Mgqibelo".split(" "), SHORTWEEKDAYS:"Son Mso Bil Tha Sin Hla Mgq".split(" "), STANDALONESHORTWEEKDAYS:"Son Mso Bil Tha Sin Hla Mgq".split(" "), NARROWWEEKDAYS:"SMTTSHM".split(""), STANDALONENARROWWEEKDAYS:"SMBTSHM".split(""), SHORTQUARTERS:["Q1", "Q2", "Q3", "Q4"], QUARTERS:["ikota engu-1", "ikota engu-2", "ikota engu-3", "ikota engu-4"], 
AMPMS:["Ekuseni", "Ntambama"], DATEFORMATS:["EEEE dd MMMM y", "d MMMM y", "d MMM y", "y-MM-dd"], TIMEFORMATS:["h:mm:ss a zzzz", "h:mm:ss a z", "h:mm:ss a", "h:mm a"], DATETIMEFORMATS:["{1} {0}", "{1} {0}", "{1} {0}", "{1} {0}"], FIRSTDAYOFWEEK:6, WEEKENDRANGE:[5, 6], FIRSTWEEKCUTOFFDAY:5};
goog.i18n.DateTimeSymbols = "af" == goog.LOCALE ? goog.i18n.DateTimeSymbols_af : "am" == goog.LOCALE ? goog.i18n.DateTimeSymbols_am : "ar" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ar : "bg" == goog.LOCALE ? goog.i18n.DateTimeSymbols_bg : "bn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_bn : "br" == goog.LOCALE ? goog.i18n.DateTimeSymbols_br : "ca" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ca : "chr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_chr : "cs" == goog.LOCALE ? goog.i18n.DateTimeSymbols_cs : 
"cy" == goog.LOCALE ? goog.i18n.DateTimeSymbols_cy : "da" == goog.LOCALE ? goog.i18n.DateTimeSymbols_da : "de" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de : "de_AT" == goog.LOCALE || "de-AT" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de_AT : "de_CH" == goog.LOCALE || "de-CH" == goog.LOCALE ? goog.i18n.DateTimeSymbols_de : "el" == goog.LOCALE ? goog.i18n.DateTimeSymbols_el : "en" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en : "en_AU" == goog.LOCALE || "en-AU" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_AU : 
"en_GB" == goog.LOCALE || "en-GB" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_GB : "en_IE" == goog.LOCALE || "en-IE" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_IE : "en_IN" == goog.LOCALE || "en-IN" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_IN : "en_SG" == goog.LOCALE || "en-SG" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_SG : "en_US" == goog.LOCALE || "en-US" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en : "en_ZA" == goog.LOCALE || "en-ZA" == goog.LOCALE ? goog.i18n.DateTimeSymbols_en_ZA : 
"es" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : "es_419" == goog.LOCALE || "es-419" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : "es_ES" == goog.LOCALE || "es-ES" == goog.LOCALE ? goog.i18n.DateTimeSymbols_es : "et" == goog.LOCALE ? goog.i18n.DateTimeSymbols_et : "eu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_eu : "fa" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fa : "fi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fi : "fil" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fil : "fr" == goog.LOCALE ? 
goog.i18n.DateTimeSymbols_fr : "fr_CA" == goog.LOCALE || "fr-CA" == goog.LOCALE ? goog.i18n.DateTimeSymbols_fr_CA : "gl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gl : "gsw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gsw : "gu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_gu : "haw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_haw : "he" == goog.LOCALE ? goog.i18n.DateTimeSymbols_he : "hi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hi : "hr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_hr : "hu" == goog.LOCALE ? 
goog.i18n.DateTimeSymbols_hu : "id" == goog.LOCALE ? goog.i18n.DateTimeSymbols_id : "in" == goog.LOCALE ? goog.i18n.DateTimeSymbols_in : "is" == goog.LOCALE ? goog.i18n.DateTimeSymbols_is : "it" == goog.LOCALE ? goog.i18n.DateTimeSymbols_it : "iw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_iw : "ja" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ja : "kn" == goog.LOCALE ? goog.i18n.DateTimeSymbols_kn : "ko" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ko : "ln" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ln : 
"lt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lt : "lv" == goog.LOCALE ? goog.i18n.DateTimeSymbols_lv : "ml" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ml : "mr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mr : "ms" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ms : "mt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_mt : "nb" == goog.LOCALE ? goog.i18n.DateTimeSymbols_nb : "nl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_nl : "no" == goog.LOCALE ? goog.i18n.DateTimeSymbols_no : "or" == goog.LOCALE ? goog.i18n.DateTimeSymbols_or : 
"pl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pl : "pt" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt : "pt_BR" == goog.LOCALE || "pt-BR" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt : "pt_PT" == goog.LOCALE || "pt-PT" == goog.LOCALE ? goog.i18n.DateTimeSymbols_pt_PT : "ro" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ro : "ru" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ru : "sk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sk : "sl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sl : "sq" == goog.LOCALE ? 
goog.i18n.DateTimeSymbols_sq : "sr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sr : "sv" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sv : "sw" == goog.LOCALE ? goog.i18n.DateTimeSymbols_sw : "ta" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ta : "te" == goog.LOCALE ? goog.i18n.DateTimeSymbols_te : "th" == goog.LOCALE ? goog.i18n.DateTimeSymbols_th : "tl" == goog.LOCALE ? goog.i18n.DateTimeSymbols_tl : "tr" == goog.LOCALE ? goog.i18n.DateTimeSymbols_tr : "uk" == goog.LOCALE ? goog.i18n.DateTimeSymbols_uk : 
"ur" == goog.LOCALE ? goog.i18n.DateTimeSymbols_ur : "vi" == goog.LOCALE ? goog.i18n.DateTimeSymbols_vi : "zh" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh : "zh_CN" == goog.LOCALE || "zh-CN" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh : "zh_HK" == goog.LOCALE || "zh-HK" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh_HK : "zh_TW" == goog.LOCALE || "zh-TW" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zh_TW : "zu" == goog.LOCALE ? goog.i18n.DateTimeSymbols_zu : goog.i18n.DateTimeSymbols_en;
goog.date = {};
goog.date.weekDay = {MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6};
goog.date.month = {JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11};
goog.date.formatMonthAndYear = function(monthName, yearNum) {
  var MSG_MONTH_AND_YEAR = monthName + (" " + yearNum);
  return MSG_MONTH_AND_YEAR;
};
goog.date.splitDateStringRegex_ = /^(\d{4})(?:(?:-?(\d{2})(?:-?(\d{2}))?)|(?:-?(\d{3}))|(?:-?W(\d{2})(?:-?([1-7]))?))?$/;
goog.date.splitTimeStringRegex_ = /^(\d{2})(?::?(\d{2})(?::?(\d{2})(\.\d+)?)?)?$/;
goog.date.splitTimezoneStringRegex_ = /Z|(?:([-+])(\d{2})(?::?(\d{2}))?)$/;
goog.date.splitDurationRegex_ = /^(-)?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
goog.date.isLeapYear = function(year) {
  return 0 == year % 4 && (0 != year % 100 || 0 == year % 400);
};
goog.date.isLongIsoYear = function(year) {
  var n = 5 * year + 12 - 4 * (Math.floor(year / 100) - Math.floor(year / 400)), n = n + (Math.floor((year - 100) / 400) - Math.floor((year - 102) / 400)), n = n + (Math.floor((year - 200) / 400) - Math.floor((year - 199) / 400));
  return 5 > n % 28;
};
goog.date.getNumberOfDaysInMonth = function(year, month) {
  switch(month) {
    case goog.date.month.FEB:
      return goog.date.isLeapYear(year) ? 29 : 28;
    case goog.date.month.JUN:
    ;
    case goog.date.month.SEP:
    ;
    case goog.date.month.NOV:
    ;
    case goog.date.month.APR:
      return 30;
  }
  return 31;
};
goog.date.isSameDay = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getDate() == now.getDate() && goog.date.isSameMonth(date, now);
};
goog.date.isSameMonth = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getMonth() == now.getMonth() && goog.date.isSameYear(date, now);
};
goog.date.isSameYear = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getFullYear() == now.getFullYear();
};
goog.date.getWeekNumber = function(year, month, date, opt_weekDay, opt_firstDayOfWeek) {
  var d = new Date(year, month, date), cutoff = opt_weekDay || goog.date.weekDay.THU, firstday = opt_firstDayOfWeek || goog.date.weekDay.MON, isoday = (d.getDay() + 6) % 7, daypos = (isoday - firstday + 7) % 7, cutoffpos = (cutoff - firstday + 7) % 7, cutoffSameWeek = d.valueOf() + 864E5 * (cutoffpos - daypos), jan1 = (new Date((new Date(cutoffSameWeek)).getFullYear(), 0, 1)).valueOf();
  return Math.floor(Math.round((cutoffSameWeek - jan1) / 864E5) / 7) + 1;
};
goog.date.min = function(date1, date2) {
  return date1 < date2 ? date1 : date2;
};
goog.date.max = function(date1, date2) {
  return date1 > date2 ? date1 : date2;
};
goog.date.fromIsoString = function(formatted) {
  var ret = new goog.date.DateTime(2E3);
  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;
};
goog.date.setIso8601DateTime = function(dateTime, formatted) {
  formatted = goog.string.trim(formatted);
  var delim = -1 == formatted.indexOf("T") ? " " : "T", parts = formatted.split(delim);
  return goog.date.setIso8601DateOnly_(dateTime, parts[0]) && (2 > parts.length || goog.date.setIso8601TimeOnly_(dateTime, parts[1]));
};
goog.date.setIso8601DateOnly_ = function(d, formatted) {
  var parts = formatted.match(goog.date.splitDateStringRegex_);
  if (!parts) {
    return!1;
  }
  var year = Number(parts[1]), month = Number(parts[2]), date = Number(parts[3]), dayOfYear = Number(parts[4]), week = Number(parts[5]), dayOfWeek = Number(parts[6]) || 1;
  d.setFullYear(year);
  if (dayOfYear) {
    d.setDate(1);
    d.setMonth(0);
    var offset = dayOfYear - 1;
    d.add(new goog.date.Interval(goog.date.Interval.DAYS, offset));
  } else {
    week ? goog.date.setDateFromIso8601Week_(d, week, dayOfWeek) : (month && (d.setDate(1), d.setMonth(month - 1)), date && d.setDate(date));
  }
  return!0;
};
goog.date.setDateFromIso8601Week_ = function(d, week, dayOfWeek) {
  d.setMonth(0);
  d.setDate(1);
  var jsDay = d.getDay(), jan1WeekDay = jsDay || 7, startDelta = 4 >= jan1WeekDay ? 1 - jan1WeekDay : 8 - jan1WeekDay, absoluteDays = Number(dayOfWeek) + 7 * (Number(week) - 1), delta = startDelta + absoluteDays - 1, interval = new goog.date.Interval(goog.date.Interval.DAYS, delta);
  d.add(interval);
};
goog.date.setIso8601TimeOnly_ = function(d, formatted) {
  var parts = formatted.match(goog.date.splitTimezoneStringRegex_), offset = 0;
  parts && ("Z" != parts[0] && (offset = 60 * parts[2] + Number(parts[3]), offset *= "-" == parts[1] ? 1 : -1), offset -= d.getTimezoneOffset(), formatted = formatted.substr(0, formatted.length - parts[0].length));
  parts = formatted.match(goog.date.splitTimeStringRegex_);
  if (!parts) {
    return!1;
  }
  d.setHours(Number(parts[1]));
  d.setMinutes(Number(parts[2]) || 0);
  d.setSeconds(Number(parts[3]) || 0);
  d.setMilliseconds(parts[4] ? 1E3 * parts[4] : 0);
  0 != offset && d.setTime(d.getTime() + 6E4 * offset);
  return!0;
};
goog.date.Interval = function(opt_years, opt_months, opt_days, opt_hours, opt_minutes, opt_seconds) {
  if (goog.isString(opt_years)) {
    var type = opt_years, interval = opt_months;
    this.years = type == goog.date.Interval.YEARS ? interval : 0;
    this.months = type == goog.date.Interval.MONTHS ? interval : 0;
    this.days = type == goog.date.Interval.DAYS ? interval : 0;
    this.hours = type == goog.date.Interval.HOURS ? interval : 0;
    this.minutes = type == goog.date.Interval.MINUTES ? interval : 0;
    this.seconds = type == goog.date.Interval.SECONDS ? interval : 0;
  } else {
    this.years = opt_years || 0, this.months = opt_months || 0, this.days = opt_days || 0, this.hours = opt_hours || 0, this.minutes = opt_minutes || 0, this.seconds = opt_seconds || 0;
  }
};
goog.date.Interval.fromIsoString = function(duration) {
  var parts = duration.match(goog.date.splitDurationRegex_);
  if (!parts) {
    return null;
  }
  var timeEmpty = !(parts[6] || parts[7] || parts[8]), dateTimeEmpty = timeEmpty && !(parts[2] || parts[3] || parts[4]);
  if (dateTimeEmpty || timeEmpty && parts[5]) {
    return null;
  }
  var negative = parts[1], years = parseInt(parts[2], 10) || 0, months = parseInt(parts[3], 10) || 0, days = parseInt(parts[4], 10) || 0, hours = parseInt(parts[6], 10) || 0, minutes = parseInt(parts[7], 10) || 0, seconds = parseFloat(parts[8]) || 0;
  return negative ? new goog.date.Interval(-years, -months, -days, -hours, -minutes, -seconds) : new goog.date.Interval(years, months, days, hours, minutes, seconds);
};
goog.date.Interval.prototype.toIsoString = function(opt_verbose) {
  var minField = Math.min(this.years, this.months, this.days, this.hours, this.minutes, this.seconds), maxField = Math.max(this.years, this.months, this.days, this.hours, this.minutes, this.seconds);
  if (0 > minField && 0 < maxField) {
    return null;
  }
  if (!opt_verbose && 0 == minField && 0 == maxField) {
    return "PT0S";
  }
  var res = [];
  0 > minField && res.push("-");
  res.push("P");
  (this.years || opt_verbose) && res.push(Math.abs(this.years) + "Y");
  (this.months || opt_verbose) && res.push(Math.abs(this.months) + "M");
  (this.days || opt_verbose) && res.push(Math.abs(this.days) + "D");
  if (this.hours || this.minutes || this.seconds || opt_verbose) {
    res.push("T"), (this.hours || opt_verbose) && res.push(Math.abs(this.hours) + "H"), (this.minutes || opt_verbose) && res.push(Math.abs(this.minutes) + "M"), (this.seconds || opt_verbose) && res.push(Math.abs(this.seconds) + "S");
  }
  return res.join("");
};
goog.date.Interval.prototype.equals = function(other) {
  return other.years == this.years && other.months == this.months && other.days == this.days && other.hours == this.hours && other.minutes == this.minutes && other.seconds == this.seconds;
};
goog.date.Interval.prototype.clone = function() {
  return new goog.date.Interval(this.years, this.months, this.days, this.hours, this.minutes, this.seconds);
};
goog.date.Interval.YEARS = "y";
goog.date.Interval.MONTHS = "m";
goog.date.Interval.DAYS = "d";
goog.date.Interval.HOURS = "h";
goog.date.Interval.MINUTES = "n";
goog.date.Interval.SECONDS = "s";
goog.date.Interval.prototype.getTotalSeconds = function() {
  goog.asserts.assert(0 == this.years && 0 == this.months);
  return 60 * (60 * (24 * this.days + this.hours) + this.minutes) + this.seconds;
};
goog.date.Interval.prototype.add = function(interval) {
  this.years += interval.years;
  this.months += interval.months;
  this.days += interval.days;
  this.hours += interval.hours;
  this.minutes += interval.minutes;
  this.seconds += interval.seconds;
};
goog.date.Date = function(opt_year, opt_month, opt_date) {
  goog.isNumber(opt_year) ? (this.date = this.buildDate_(opt_year, opt_month || 0, opt_date || 1), this.maybeFixDst_(opt_date || 1)) : goog.isObject(opt_year) ? (this.date = this.buildDate_(opt_year.getFullYear(), opt_year.getMonth(), opt_year.getDate()), this.maybeFixDst_(opt_year.getDate())) : (this.date = new Date(goog.now()), this.date.setHours(0), this.date.setMinutes(0), this.date.setSeconds(0), this.date.setMilliseconds(0));
};
goog.date.Date.prototype.buildDate_ = function(fullYear, month, date) {
  var d = new Date(fullYear, month, date);
  0 <= fullYear && 100 > fullYear && d.setFullYear(d.getFullYear() - 1900);
  return d;
};
goog.date.Date.prototype.firstDayOfWeek_ = goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK;
goog.date.Date.prototype.firstWeekCutOffDay_ = goog.i18n.DateTimeSymbols.FIRSTWEEKCUTOFFDAY;
goog.date.Date.prototype.clone = function() {
  var date = new goog.date.Date(this.date);
  date.firstDayOfWeek_ = this.firstDayOfWeek_;
  date.firstWeekCutOffDay_ = this.firstWeekCutOffDay_;
  return date;
};
goog.date.Date.prototype.getFullYear = function() {
  return this.date.getFullYear();
};
goog.date.Date.prototype.getYear = function() {
  return this.getFullYear();
};
goog.date.Date.prototype.getMonth = function() {
  return this.date.getMonth();
};
goog.date.Date.prototype.getDate = function() {
  return this.date.getDate();
};
goog.date.Date.prototype.getTime = function() {
  return this.date.getTime();
};
goog.date.Date.prototype.getDay = function() {
  return this.date.getDay();
};
goog.date.Date.prototype.getUTCFullYear = function() {
  return this.date.getUTCFullYear();
};
goog.date.Date.prototype.getUTCMonth = function() {
  return this.date.getUTCMonth();
};
goog.date.Date.prototype.getUTCDate = function() {
  return this.date.getUTCDate();
};
goog.date.Date.prototype.getUTCDay = function() {
  return this.date.getDay();
};
goog.date.Date.prototype.getUTCHours = function() {
  return this.date.getUTCHours();
};
goog.date.Date.prototype.getUTCMinutes = function() {
  return this.date.getUTCMinutes();
};
goog.date.Date.prototype.getFirstDayOfWeek = function() {
  return this.firstDayOfWeek_;
};
goog.date.Date.prototype.getFirstWeekCutOffDay = function() {
  return this.firstWeekCutOffDay_;
};
goog.date.Date.prototype.getNumberOfDaysInMonth = function() {
  return goog.date.getNumberOfDaysInMonth(this.getFullYear(), this.getMonth());
};
goog.date.Date.prototype.getWeekNumber = function() {
  return goog.date.getWeekNumber(this.getFullYear(), this.getMonth(), this.getDate(), this.firstWeekCutOffDay_, this.firstDayOfWeek_);
};
goog.date.Date.prototype.getTimezoneOffset = function() {
  return this.date.getTimezoneOffset();
};
goog.date.Date.prototype.getTimezoneOffsetString = function() {
  var tz, offset = this.getTimezoneOffset();
  if (0 == offset) {
    tz = "Z";
  } else {
    var n = Math.abs(offset) / 60, h = Math.floor(n), m = 60 * (n - h);
    tz = (0 < offset ? "-" : "+") + goog.string.padNumber(h, 2) + ":" + goog.string.padNumber(m, 2);
  }
  return tz;
};
goog.date.Date.prototype.set = function(date) {
  this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
goog.date.Date.prototype.setFullYear = function(year) {
  this.date.setFullYear(year);
};
goog.date.Date.prototype.setYear = function(year) {
  this.setFullYear(year);
};
goog.date.Date.prototype.setMonth = function(month) {
  this.date.setMonth(month);
};
goog.date.Date.prototype.setDate = function(date) {
  this.date.setDate(date);
};
goog.date.Date.prototype.setTime = function(ms) {
  this.date.setTime(ms);
};
goog.date.Date.prototype.setUTCFullYear = function(year) {
  this.date.setUTCFullYear(year);
};
goog.date.Date.prototype.setUTCMonth = function(month) {
  this.date.setUTCMonth(month);
};
goog.date.Date.prototype.setUTCDate = function(date) {
  this.date.setUTCDate(date);
};
goog.date.Date.prototype.setFirstDayOfWeek = function(day) {
  this.firstDayOfWeek_ = day;
};
goog.date.Date.prototype.setFirstWeekCutOffDay = function(day) {
  this.firstWeekCutOffDay_ = day;
};
goog.date.Date.prototype.add = function(interval) {
  if (interval.years || interval.months) {
    var month = this.getMonth() + interval.months + 12 * interval.years, year = this.getYear() + Math.floor(month / 12), month = month % 12;
    0 > month && (month += 12);
    var daysInTargetMonth = goog.date.getNumberOfDaysInMonth(year, month), date = Math.min(daysInTargetMonth, this.getDate());
    this.setDate(1);
    this.setFullYear(year);
    this.setMonth(month);
    this.setDate(date);
  }
  if (interval.days) {
    var noon = new Date(this.getYear(), this.getMonth(), this.getDate(), 12), result = new Date(noon.getTime() + 864E5 * interval.days);
    this.setDate(1);
    this.setFullYear(result.getFullYear());
    this.setMonth(result.getMonth());
    this.setDate(result.getDate());
    this.maybeFixDst_(result.getDate());
  }
};
goog.date.Date.prototype.toIsoString = function(opt_verbose, opt_tz) {
  var str = [this.getFullYear(), goog.string.padNumber(this.getMonth() + 1, 2), goog.string.padNumber(this.getDate(), 2)];
  return str.join(opt_verbose ? "-" : "") + (opt_tz ? this.getTimezoneOffsetString() : "");
};
goog.date.Date.prototype.equals = function(other) {
  return!(!other || this.getYear() != other.getYear() || this.getMonth() != other.getMonth() || this.getDate() != other.getDate());
};
goog.date.Date.prototype.toString = function() {
  return this.toIsoString();
};
goog.date.Date.prototype.maybeFixDst_ = function(expected) {
  if (this.getDate() != expected) {
    var dir = this.getDate() < expected ? 1 : -1;
    this.date.setUTCHours(this.date.getUTCHours() + dir);
  }
};
goog.date.Date.prototype.valueOf = function() {
  return this.date.valueOf();
};
goog.date.Date.compare = function(date1, date2) {
  return date1.getTime() - date2.getTime();
};
goog.date.DateTime = function(opt_year, opt_month, opt_date, opt_hours, opt_minutes, opt_seconds, opt_milliseconds) {
  this.date = goog.isNumber(opt_year) ? new Date(opt_year, opt_month || 0, opt_date || 1, opt_hours || 0, opt_minutes || 0, opt_seconds || 0, opt_milliseconds || 0) : new Date(opt_year ? opt_year.getTime() : goog.now());
};
goog.inherits(goog.date.DateTime, goog.date.Date);
goog.date.DateTime.fromRfc822String = function(formatted) {
  var date = new Date(formatted);
  return isNaN(date.getTime()) ? null : new goog.date.DateTime(date);
};
goog.date.DateTime.prototype.getHours = function() {
  return this.date.getHours();
};
goog.date.DateTime.prototype.getMinutes = function() {
  return this.date.getMinutes();
};
goog.date.DateTime.prototype.getSeconds = function() {
  return this.date.getSeconds();
};
goog.date.DateTime.prototype.getMilliseconds = function() {
  return this.date.getMilliseconds();
};
goog.date.DateTime.prototype.getUTCDay = function() {
  return this.date.getUTCDay();
};
goog.date.DateTime.prototype.getUTCHours = function() {
  return this.date.getUTCHours();
};
goog.date.DateTime.prototype.getUTCMinutes = function() {
  return this.date.getUTCMinutes();
};
goog.date.DateTime.prototype.getUTCSeconds = function() {
  return this.date.getUTCSeconds();
};
goog.date.DateTime.prototype.getUTCMilliseconds = function() {
  return this.date.getUTCMilliseconds();
};
goog.date.DateTime.prototype.setHours = function(hours) {
  this.date.setHours(hours);
};
goog.date.DateTime.prototype.setMinutes = function(minutes) {
  this.date.setMinutes(minutes);
};
goog.date.DateTime.prototype.setSeconds = function(seconds) {
  this.date.setSeconds(seconds);
};
goog.date.DateTime.prototype.setMilliseconds = function(ms) {
  this.date.setMilliseconds(ms);
};
goog.date.DateTime.prototype.setUTCHours = function(hours) {
  this.date.setUTCHours(hours);
};
goog.date.DateTime.prototype.setUTCMinutes = function(minutes) {
  this.date.setUTCMinutes(minutes);
};
goog.date.DateTime.prototype.setUTCSeconds = function(seconds) {
  this.date.setUTCSeconds(seconds);
};
goog.date.DateTime.prototype.setUTCMilliseconds = function(ms) {
  this.date.setUTCMilliseconds(ms);
};
goog.date.DateTime.prototype.add = function(interval) {
  goog.date.Date.prototype.add.call(this, interval);
  interval.hours && this.setHours(this.date.getHours() + interval.hours);
  interval.minutes && this.setMinutes(this.date.getMinutes() + interval.minutes);
  interval.seconds && this.setSeconds(this.date.getSeconds() + interval.seconds);
};
goog.date.DateTime.prototype.toIsoString = function(opt_verbose, opt_tz) {
  var dateString = goog.date.Date.prototype.toIsoString.call(this, opt_verbose);
  return opt_verbose ? dateString + " " + goog.string.padNumber(this.getHours(), 2) + ":" + goog.string.padNumber(this.getMinutes(), 2) + ":" + goog.string.padNumber(this.getSeconds(), 2) + (opt_tz ? this.getTimezoneOffsetString() : "") : dateString + "T" + goog.string.padNumber(this.getHours(), 2) + goog.string.padNumber(this.getMinutes(), 2) + goog.string.padNumber(this.getSeconds(), 2) + (opt_tz ? this.getTimezoneOffsetString() : "");
};
goog.date.DateTime.prototype.equals = function(other) {
  return this.getTime() == other.getTime();
};
goog.date.DateTime.prototype.toString = function() {
  return this.toIsoString();
};
goog.date.DateTime.prototype.clone = function() {
  var date = new goog.date.DateTime(this.date);
  date.setFirstDayOfWeek(this.getFirstDayOfWeek());
  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
  return date;
};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.instances_[goog.getUid(this)] = this);
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [], id;
  for (id in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(id) && ret.push(goog.Disposable.instances_[Number(id)]);
  }
  return ret;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var uid = goog.getUid(this);
    if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[uid];
  }
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(obj) {
  return obj && "function" == typeof obj.isDisposed ? obj.isDisposed() : !1;
};
goog.dispose = function(obj) {
  obj && "function" == typeof obj.dispose && obj.dispose();
};
goog.disposeAll = function(var_args) {
  for (var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    goog.isArrayLike(disposable) ? goog.disposeAll.apply(null, disposable) : goog.dispose(disposable);
  }
};
goog.log = {};
goog.log.ENABLED = goog.debug.LOGGING_ENABLED;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(name, opt_level) {
  if (goog.log.ENABLED) {
    var logger = goog.debug.LogManager.getLogger(name);
    opt_level && logger && logger.setLevel(opt_level);
    return logger;
  }
  return null;
};
goog.log.addHandler = function(logger, handler) {
  goog.log.ENABLED && logger && logger.addHandler(handler);
};
goog.log.removeHandler = function(logger, handler) {
  return goog.log.ENABLED && logger ? logger.removeHandler(handler) : !1;
};
goog.log.log = function(logger, level, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.log(level, msg, opt_exception);
};
goog.log.error = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.severe(msg, opt_exception);
};
goog.log.warning = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.warning(msg, opt_exception);
};
goog.log.info = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.info(msg, opt_exception);
};
goog.log.fine = function(logger, msg, opt_exception) {
  goog.log.ENABLED && logger && logger.fine(msg, opt_exception);
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    for (var monitors = goog.debug.entryPointRegistry.monitors_, i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for (var transformer = goog.bind(monitor.wrap, monitor), i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  for (var transformer = goog.bind(monitor.unwrap, monitor), i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer);
  }
  monitors.length--;
};
goog.events = {};
goog.events.EventId = function(eventId) {
  this.id = eventId;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.events.Event = function(type, opt_target) {
  this.type = type instanceof goog.events.EventId ? String(type) : type;
  this.currentTarget = this.target = opt_target;
  this.defaultPrevented = this.propagationStopped_ = !1;
  this.returnValue_ = !0;
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1;
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation();
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault();
};
goog.reflect = {};
goog.reflect.object = function(type, object) {
  return object;
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    return goog.reflect.sinkValue(obj[prop]), !0;
  } catch (e) {
  }
  return!1;
};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || 
!goog.global.navigator.msMaxTouchPoints)};
goog.events.getVendorPrefixedName_ = function(eventName) {
  return goog.userAgent.WEBKIT ? "webkit" + eventName : goog.userAgent.OPERA ? "o" + eventName.toLowerCase() : eventName.toLowerCase();
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", 
INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", 
READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), 
TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", 
MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXTINPUT:"textinput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", 
COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage"};
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  goog.events.Event.call(this, opt_e ? opt_e.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.charCode = this.keyCode = this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.event_ = this.state = null;
  opt_e && this.init(opt_e, opt_currentTarget);
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  relatedTarget ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(relatedTarget, "nodeName") || (relatedTarget = null)) : type == goog.events.EventType.MOUSEOVER ? relatedTarget = e.fromElement : type == goog.events.EventType.MOUSEOUT && (relatedTarget = e.toElement);
  this.relatedTarget = relatedTarget;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== e.offsetX ? e.offsetX : e.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== e.offsetY ? e.offsetY : e.layerY;
  this.clientX = void 0 !== e.clientX ? e.clientX : e.pageX;
  this.clientY = void 0 !== e.clientY ? e.clientY : e.pageY;
  this.screenX = e.screenX || 0;
  this.screenY = e.screenY || 0;
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || ("keypress" == type ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.state = e.state;
  this.event_ = e;
  e.defaultPrevented && this.preventDefault();
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if (be.preventDefault) {
    be.preventDefault();
  } else {
    if (be.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if (be.ctrlKey || 112 <= be.keyCode && 123 >= be.keyCode) {
          be.keyCode = -1;
        }
      } catch (ex) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(cls) {
  cls.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.events.Listenable.isImplementedBy = function(obj) {
  try {
    return!(!obj || !obj[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
  } catch (e) {
    return!1;
  }
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return++goog.events.ListenableKey.counter_;
};
goog.events.Listener = function(listener, proxy, src, type, capture, opt_handler) {
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1;
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null;
};
goog.events.ListenerMap = function(src) {
  this.src = src;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
};
goog.events.ListenerMap.prototype.add = function(type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString(), listenerArray = this.listeners[typeStr];
  listenerArray || (listenerArray = this.listeners[typeStr] = [], this.typeCount_++);
  var listenerObj, index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  -1 < index ? (listenerObj = listenerArray[index], callOnce || (listenerObj.callOnce = !1)) : (listenerObj = new goog.events.Listener(listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope), listenerObj.callOnce = callOnce, listenerArray.push(listenerObj));
  return listenerObj;
};
goog.events.ListenerMap.prototype.remove = function(type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return!1;
  }
  var listenerArray = this.listeners[typeStr], index = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (-1 < index) {
    var listenerObj = listenerArray[index];
    listenerObj.markAsRemoved();
    goog.array.removeAt(listenerArray, index);
    0 == listenerArray.length && (delete this.listeners[typeStr], this.typeCount_--);
    return!0;
  }
  return!1;
};
goog.events.ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return!1;
  }
  var removed = goog.array.remove(this.listeners[type], listener);
  removed && (listener.markAsRemoved(), 0 == this.listeners[type].length && (delete this.listeners[type], this.typeCount_--));
  return removed;
};
goog.events.ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString(), count = 0, type;
  for (type in this.listeners) {
    if (!typeStr || type == typeStr) {
      for (var listenerArray = this.listeners[type], i = 0;i < listenerArray.length;i++) {
        ++count, listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
};
goog.events.ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()], rv = [];
  if (listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      var listenerObj = listenerArray[i];
      listenerObj.capture == capture && rv.push(listenerObj);
    }
  }
  return rv;
};
goog.events.ListenerMap.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()], i = -1;
  listenerArray && (i = goog.events.ListenerMap.findListenerIndex_(listenerArray, listener, capture, opt_listenerScope));
  return-1 < i ? listenerArray[i] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type), typeStr = hasType ? opt_type.toString() : "", hasCapture = goog.isDef(opt_capture);
  return goog.object.some(this.listeners, function(listenerArray) {
    for (var i = 0;i < listenerArray.length;++i) {
      if (!(hasType && listenerArray[i].type != typeStr || hasCapture && listenerArray[i].capture != opt_capture)) {
        return!0;
      }
    }
    return!1;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0;i < listenerArray.length;++i) {
    var listenerObj = listenerArray[i];
    if (!listenerObj.removed && listenerObj.listener == listener && listenerObj.capture == !!opt_useCapture && listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return-1;
};
goog.events.listeners_ = {};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listen(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  return goog.events.Listenable.isImplementedBy(src) ? src.listen(type, listener, opt_capt, opt_handler) : goog.events.listen_(src, type, listener, !1, opt_capt, opt_handler);
};
goog.events.listen_ = function(src, type, listener, callOnce, opt_capt, opt_handler) {
  if (!type) {
    throw Error("Invalid event type");
  }
  var capture = !!opt_capt;
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      return goog.asserts.fail("Can not register capture listener in IE8-."), null;
    }
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
      return null;
    }
  }
  var listenerMap = goog.events.getListenerMap_(src);
  listenerMap || (src[goog.events.LISTENER_MAP_PROP_] = listenerMap = new goog.events.ListenerMap(src));
  var listenerObj = listenerMap.add(type, listener, callOnce, opt_capt, opt_handler);
  if (listenerObj.proxy) {
    return listenerObj;
  }
  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;
  proxy.src = src;
  proxy.listener = listenerObj;
  src.addEventListener ? src.addEventListener(type.toString(), proxy, capture) : src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
  goog.events.listenerCountEstimate_++;
  return listenerObj;
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_, f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.listener, eventObject);
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
    if (!v) {
      return v;
    }
  };
  return f;
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  return goog.events.Listenable.isImplementedBy(src) ? src.listenOnce(type, listener, opt_capt, opt_handler) : goog.events.listen_(src, type, listener, !0, opt_capt, opt_handler);
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }
  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(type, listener, opt_capt, opt_handler);
  }
  if (!src) {
    return!1;
  }
  var capture = !!opt_capt, listenerMap = goog.events.getListenerMap_(src);
  if (listenerMap) {
    var listenerObj = listenerMap.getListener(type, listener, capture, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }
  return!1;
};
goog.events.unlistenByKey = function(key) {
  if (goog.isNumber(key)) {
    return!1;
  }
  var listener = key;
  if (!listener || listener.removed) {
    return!1;
  }
  var src = listener.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }
  var type = listener.type, proxy = listener.proxy;
  src.removeEventListener ? src.removeEventListener(type, proxy, listener.capture) : src.detachEvent && src.detachEvent(goog.events.getOnString_(type), proxy);
  goog.events.listenerCountEstimate_--;
  var listenerMap = goog.events.getListenerMap_(src);
  listenerMap ? (listenerMap.removeByKey(listener), 0 == listenerMap.getTypeCount() && (listenerMap.src = null, src[goog.events.LISTENER_MAP_PROP_] = null)) : listener.markAsRemoved();
  return!0;
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};
goog.events.removeAll = function(opt_obj, opt_type) {
  if (!opt_obj) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(opt_obj)) {
    return opt_obj.removeAllListeners(opt_type);
  }
  var listenerMap = goog.events.getListenerMap_(opt_obj);
  if (!listenerMap) {
    return 0;
  }
  var count = 0, typeStr = opt_type && opt_type.toString(), type;
  for (type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      for (var listeners = goog.array.clone(listenerMap.listeners[type]), i = 0;i < listeners.length;++i) {
        goog.events.unlistenByKey(listeners[i]) && ++count;
      }
    }
  }
  return count;
};
goog.events.removeAllNativeListeners = function() {
  return goog.events.listenerCountEstimate_ = 0;
};
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  }
  if (!obj) {
    return[];
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return listenerMap ? listenerMap.getListeners(type, capture) : [];
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }
  if (!src) {
    return null;
  }
  var listenerMap = goog.events.getListenerMap_(src);
  return listenerMap ? listenerMap.getListener(type, listener, capture, opt_handler) : null;
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }
  var listenerMap = goog.events.getListenerMap_(obj);
  return!!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};
goog.events.expose = function(e) {
  var str = [], key;
  for (key in e) {
    e[key] && e[key].id ? str.push(key + " = " + e[key] + " (" + e[key].id + ")") : str.push(key + " = " + e[key]);
  }
  return str.join("\n");
};
goog.events.getOnString_ = function(type) {
  return type in goog.events.onStringMap_ ? goog.events.onStringMap_[type] : goog.events.onStringMap_[type] = goog.events.onString_ + type;
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  return goog.events.Listenable.isImplementedBy(obj) ? obj.fireListeners(type, capture, eventObject) : goog.events.fireListeners_(obj, type, capture, eventObject);
};
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = 1, listenerMap = goog.events.getListenerMap_(obj);
  if (listenerMap) {
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      for (var listenerArray = goog.array.clone(listenerArray), i = 0;i < listenerArray.length;i++) {
        var listener = listenerArray[i];
        listener && listener.capture == capture && !listener.removed && (retval &= !1 !== goog.events.fireListener(listener, eventObject));
      }
    }
  }
  return Boolean(retval);
};
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
  listener.callOnce && goog.events.unlistenByKey(listener);
  return listenerFn.call(listenerHandler, eventObject);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(src), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return src.dispatchEvent(e);
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return!0;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || goog.getObjectByName("window.event"), evt = new goog.events.BrowserEvent(ieEvent, this), retval = !0;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent);
        for (var ancestors = [], parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent);
        }
        for (var type = listener.type, i = ancestors.length - 1;!evt.propagationStopped_ && 0 <= i;i--) {
          evt.currentTarget = ancestors[i], retval &= goog.events.fireListeners_(ancestors[i], type, !0, evt);
        }
        for (i = 0;!evt.propagationStopped_ && i < ancestors.length;i++) {
          evt.currentTarget = ancestors[i], retval &= goog.events.fireListeners_(ancestors[i], type, !1, evt);
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt);
    }
    return retval;
  }
  return goog.events.fireListener(listener, new goog.events.BrowserEvent(opt_evt, this));
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = !1;
  if (0 == e.keyCode) {
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = !0;
    }
  }
  if (useReturnValue || void 0 == e.returnValue) {
    e.returnValue = !0;
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return 0 > e.keyCode || void 0 != e.returnValue;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, "Listener can not be null.");
  if (goog.isFunction(listener)) {
    return listener;
  }
  goog.asserts.assert(listener.handleEvent, "An object listener must have handleEvent method.");
  return listener[goog.events.LISTENER_WRAPPER_PROP_] || (listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
    return listener.handleEvent(e);
  });
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_);
});
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();
  var ancestorsTree, ancestor = this.getParentEventTarget();
  if (ancestor) {
    ancestorsTree = [];
    for (var ancestorCount = 1;ancestor;ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor), goog.asserts.assert(++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, e, ancestorsTree);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(type), listener, !1, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(String(type), listener, !0, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(String(type), listener, opt_useCapture, opt_listenerScope);
};
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
};
goog.events.EventTarget.prototype.removeAllListeners = function(opt_type) {
  return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(opt_type) : 0;
};
goog.events.EventTarget.prototype.fireListeners = function(type, capture, eventObject) {
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return!0;
  }
  for (var listenerArray = goog.array.clone(listenerArray), rv = !0, i = 0;i < listenerArray.length;++i) {
    var listener = listenerArray[i];
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener, listenerHandler = listener.handler || listener.src;
      listener.callOnce && this.unlistenByKey(listener);
      rv = !1 !== listenerFn.call(listenerHandler, eventObject) && rv;
    }
  }
  return rv && !1 != eventObject.returnValue_;
};
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
};
goog.events.EventTarget.prototype.getListener = function(type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(String(type), listener, capture, opt_listenerScope);
};
goog.events.EventTarget.prototype.hasListener = function(opt_type, opt_capture) {
  var id = goog.isDef(opt_type) ? String(opt_type) : void 0;
  return this.eventTargetListeners_.hasListener(id, opt_capture);
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(target, e, opt_ancestorsTree) {
  var type = e.type || e;
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target);
  } else {
    if (e instanceof goog.events.Event) {
      e.target = e.target || target;
    } else {
      var oldEvent = e;
      e = new goog.events.Event(type, target);
      goog.object.extend(e, oldEvent);
    }
  }
  var rv = !0, currentTarget;
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1;!e.propagationStopped_ && 0 <= i;i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i], rv = currentTarget.fireListeners(type, !0, e) && rv;
    }
  }
  e.propagationStopped_ || (currentTarget = e.currentTarget = target, rv = currentTarget.fireListeners(type, !0, e) && rv, e.propagationStopped_ || (rv = currentTarget.fireListeners(type, !1, e) && rv));
  if (opt_ancestorsTree) {
    for (i = 0;!e.propagationStopped_ && i < opt_ancestorsTree.length;i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i], rv = currentTarget.fireListeners(type, !1, e) && rv;
    }
  }
  return rv;
};
goog.json = {};
goog.json.USE_NATIVE_JSON = !1;
goog.json.isValid_ = function(s) {
  if (/^\s*$/.test(s)) {
    return!1;
  }
  var backslashesRe = /\\["\\\/bfnrtu]/g, simpleValuesRe = /"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, openBracketsRe = /(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, remainderRe = /^[\],:{}\s\u2028\u2029]*$/;
  return remainderRe.test(s.replace(backslashesRe, "@").replace(simpleValuesRe, "]").replace(openBracketsRe, ""));
};
goog.json.parse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
  var o = String(s);
  if (goog.json.isValid_(o)) {
    try {
      return eval("(" + o + ")");
    } catch (ex) {
    }
  }
  throw Error("Invalid JSON string: " + o);
};
goog.json.unsafeParse = goog.json.USE_NATIVE_JSON ? goog.global.JSON.parse : function(s) {
  return eval("(" + s + ")");
};
goog.json.serialize = goog.json.USE_NATIVE_JSON ? goog.global.JSON.stringify : function(object, opt_replacer) {
  return(new goog.json.Serializer(opt_replacer)).serialize(object);
};
goog.json.Serializer = function(opt_replacer) {
  this.replacer_ = opt_replacer;
};
goog.json.Serializer.prototype.serialize = function(object) {
  var sb = [];
  this.serializeInternal(object, sb);
  return sb.join("");
};
goog.json.Serializer.prototype.serializeInternal = function(object, sb) {
  switch(typeof object) {
    case "string":
      this.serializeString_(object, sb);
      break;
    case "number":
      this.serializeNumber_(object, sb);
      break;
    case "boolean":
      sb.push(object);
      break;
    case "undefined":
      sb.push("null");
      break;
    case "object":
      if (null == object) {
        sb.push("null");
        break;
      }
      if (goog.isArray(object)) {
        this.serializeArray(object, sb);
        break;
      }
      this.serializeObject_(object, sb);
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof object);;
  }
};
goog.json.Serializer.charToJsonCharCache_ = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"};
goog.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_ = function(s, sb) {
  sb.push('"', s.replace(goog.json.Serializer.charsToReplace_, function(c) {
    if (c in goog.json.Serializer.charToJsonCharCache_) {
      return goog.json.Serializer.charToJsonCharCache_[c];
    }
    var cc = c.charCodeAt(0), rv = "\\u";
    16 > cc ? rv += "000" : 256 > cc ? rv += "00" : 4096 > cc && (rv += "0");
    return goog.json.Serializer.charToJsonCharCache_[c] = rv + cc.toString(16);
  }), '"');
};
goog.json.Serializer.prototype.serializeNumber_ = function(n, sb) {
  sb.push(isFinite(n) && !isNaN(n) ? n : "null");
};
goog.json.Serializer.prototype.serializeArray = function(arr, sb) {
  var l = arr.length;
  sb.push("[");
  for (var sep = "", i = 0;i < l;i++) {
    sb.push(sep);
    var value = arr[i];
    this.serializeInternal(this.replacer_ ? this.replacer_.call(arr, String(i), value) : value, sb);
    sep = ",";
  }
  sb.push("]");
};
goog.json.Serializer.prototype.serializeObject_ = function(obj, sb) {
  sb.push("{");
  var sep = "", key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var value = obj[key];
      "function" != typeof value && (sb.push(sep), this.serializeString_(key, sb), sb.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(obj, key, value) : value, sb), sep = ",");
    }
  }
  sb.push("}");
};
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now();
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global;
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop();
};
goog.Timer.prototype.tick_ = function() {
  if (this.enabled) {
    var elapsed = goog.now() - this.last_;
    0 < elapsed && elapsed < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()));
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK);
};
goog.Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now());
};
goog.Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null);
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_;
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if (goog.isFunction(listener)) {
    opt_handler && (listener = goog.bind(listener, opt_handler));
  } else {
    if (listener && "function" == typeof listener.handleEvent) {
      listener = goog.bind(listener.handleEvent, listener);
    } else {
      throw Error("Invalid listener argument");
    }
  }
  return opt_delay > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId);
};
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
  var out = "";
  opt_scheme && (out += opt_scheme + ":");
  opt_domain && (out += "//", opt_userInfo && (out += opt_userInfo + "@"), out += opt_domain, opt_port && (out += ":" + opt_port));
  opt_path && (out += opt_path);
  opt_queryData && (out += "?" + opt_queryData);
  opt_fragment && (out += "#" + opt_fragment);
  return out;
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(uri) {
  goog.uri.utils.phishingProtection_();
  return uri.match(goog.uri.utils.splitRe_);
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
  if (goog.uri.utils.needsPhishingProtection_) {
    goog.uri.utils.needsPhishingProtection_ = !1;
    var location = goog.global.location;
    if (location) {
      var href = location.href;
      if (href) {
        var domain = goog.uri.utils.getDomain(href);
        if (domain && domain != location.hostname) {
          throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
        }
      }
    }
  }
};
goog.uri.utils.decodeIfPossible_ = function(uri) {
  return uri && decodeURIComponent(uri);
};
goog.uri.utils.getComponentByIndex_ = function(componentIndex, uri) {
  return goog.uri.utils.split(uri)[componentIndex] || null;
};
goog.uri.utils.getScheme = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, uri);
};
goog.uri.utils.getEffectiveScheme = function(uri) {
  var scheme = goog.uri.utils.getScheme(uri);
  if (!scheme && self.location) {
    var protocol = self.location.protocol, scheme = protocol.substr(0, protocol.length - 1)
  }
  return scheme ? scheme.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, uri);
};
goog.uri.utils.getUserInfo = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(uri));
};
goog.uri.utils.getDomainEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, uri);
};
goog.uri.utils.getDomain = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(uri));
};
goog.uri.utils.getPort = function(uri) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, uri)) || null;
};
goog.uri.utils.getPathEncoded = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, uri);
};
goog.uri.utils.getPath = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(uri));
};
goog.uri.utils.getQueryData = function(uri) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, uri);
};
goog.uri.utils.getFragmentEncoded = function(uri) {
  var hashIndex = uri.indexOf("#");
  return 0 > hashIndex ? null : uri.substr(hashIndex + 1);
};
goog.uri.utils.setFragmentEncoded = function(uri, fragment) {
  return goog.uri.utils.removeFragment(uri) + (fragment ? "#" + fragment : "");
};
goog.uri.utils.getFragment = function(uri) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(uri));
};
goog.uri.utils.getHost = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(pieces[goog.uri.utils.ComponentIndex.SCHEME], pieces[goog.uri.utils.ComponentIndex.USER_INFO], pieces[goog.uri.utils.ComponentIndex.DOMAIN], pieces[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(uri) {
  var pieces = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, pieces[goog.uri.utils.ComponentIndex.PATH], pieces[goog.uri.utils.ComponentIndex.QUERY_DATA], pieces[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(uri) {
  var hashIndex = uri.indexOf("#");
  return 0 > hashIndex ? uri : uri.substr(0, hashIndex);
};
goog.uri.utils.haveSameDomain = function(uri1, uri2) {
  var pieces1 = goog.uri.utils.split(uri1), pieces2 = goog.uri.utils.split(uri2);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.SCHEME] == pieces2[goog.uri.utils.ComponentIndex.SCHEME] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(uri) {
  if (goog.DEBUG && (0 <= uri.indexOf("#") || 0 <= uri.indexOf("?"))) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + uri + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(buffer) {
  if (buffer[1]) {
    var baseUri = buffer[0], hashIndex = baseUri.indexOf("#");
    0 <= hashIndex && (buffer.push(baseUri.substr(hashIndex)), buffer[0] = baseUri = baseUri.substr(0, hashIndex));
    var questionIndex = baseUri.indexOf("?");
    0 > questionIndex ? buffer[1] = "?" : questionIndex == baseUri.length - 1 && (buffer[1] = void 0);
  }
  return buffer.join("");
};
goog.uri.utils.appendKeyValuePairs_ = function(key, value, pairs) {
  if (goog.isArray(value)) {
    goog.asserts.assertArray(value);
    for (var j = 0;j < value.length;j++) {
      goog.uri.utils.appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else {
    null != value && pairs.push("&", key, "" === value ? "" : "=", goog.string.urlEncode(value));
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(buffer, keysAndValues, opt_startIndex) {
  goog.asserts.assert(0 == Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
  for (var i = opt_startIndex || 0;i < keysAndValues.length;i += 2) {
    goog.uri.utils.appendKeyValuePairs_(keysAndValues[i], keysAndValues[i + 1], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryData = function(keysAndValues, opt_startIndex) {
  var buffer = goog.uri.utils.buildQueryDataBuffer_([], keysAndValues, opt_startIndex);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(buffer, map) {
  for (var key in map) {
    goog.uri.utils.appendKeyValuePairs_(key, map[key], buffer);
  }
  return buffer;
};
goog.uri.utils.buildQueryDataFromMap = function(map) {
  var buffer = goog.uri.utils.buildQueryDataBufferFromMap_([], map);
  buffer[0] = "";
  return buffer.join("");
};
goog.uri.utils.appendParams = function(uri, var_args) {
  return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([uri], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([uri], arguments, 1));
};
goog.uri.utils.appendParamsFromMap = function(uri, map) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([uri], map));
};
goog.uri.utils.appendParam = function(uri, key, opt_value) {
  var paramArr = [uri, "&", key];
  goog.isDefAndNotNull(opt_value) && paramArr.push("=", goog.string.urlEncode(opt_value));
  return goog.uri.utils.appendQueryData_(paramArr);
};
goog.uri.utils.findParam_ = function(uri, startIndex, keyEncoded, hashOrEndIndex) {
  for (var index = startIndex, keyLength = keyEncoded.length;0 <= (index = uri.indexOf(keyEncoded, index)) && index < hashOrEndIndex;) {
    var precedingChar = uri.charCodeAt(index - 1);
    if (precedingChar == goog.uri.utils.CharCode_.AMPERSAND || precedingChar == goog.uri.utils.CharCode_.QUESTION) {
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == goog.uri.utils.CharCode_.EQUAL || followingChar == goog.uri.utils.CharCode_.AMPERSAND || followingChar == goog.uri.utils.CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }
  return-1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(uri, keyEncoded) {
  return 0 <= goog.uri.utils.findParam_(uri, 0, keyEncoded, uri.search(goog.uri.utils.hashOrEndRe_));
};
goog.uri.utils.getParamValue = function(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), foundIndex = goog.uri.utils.findParam_(uri, 0, keyEncoded, hashOrEndIndex);
  if (0 > foundIndex) {
    return null;
  }
  var endPosition = uri.indexOf("&", foundIndex);
  if (0 > endPosition || endPosition > hashOrEndIndex) {
    endPosition = hashOrEndIndex;
  }
  foundIndex += keyEncoded.length + 1;
  return goog.string.urlDecode(uri.substr(foundIndex, endPosition - foundIndex));
};
goog.uri.utils.getParamValues = function(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), position = 0, foundIndex, result = [];0 <= (foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex));) {
    position = uri.indexOf("&", foundIndex);
    if (0 > position || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }
    foundIndex += keyEncoded.length + 1;
    result.push(goog.string.urlDecode(uri.substr(foundIndex, position - foundIndex)));
  }
  return result;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(uri, keyEncoded) {
  for (var hashOrEndIndex = uri.search(goog.uri.utils.hashOrEndRe_), position = 0, foundIndex, buffer = [];0 <= (foundIndex = goog.uri.utils.findParam_(uri, position, keyEncoded, hashOrEndIndex));) {
    buffer.push(uri.substring(position, foundIndex)), position = Math.min(uri.indexOf("&", foundIndex) + 1 || hashOrEndIndex, hashOrEndIndex);
  }
  buffer.push(uri.substr(position));
  return buffer.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(uri, keyEncoded, value) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(uri, keyEncoded), keyEncoded, value);
};
goog.uri.utils.appendPath = function(baseUri, path) {
  goog.uri.utils.assertNoFragmentsOrQueries_(baseUri);
  goog.string.endsWith(baseUri, "/") && (baseUri = baseUri.substr(0, baseUri.length - 1));
  goog.string.startsWith(path, "/") && (path = path.substr(1));
  return goog.string.buildString(baseUri, "/", path);
};
goog.uri.utils.setPath = function(uri, path) {
  goog.string.startsWith(path, "/") || (path = "/" + path);
  var parts = goog.uri.utils.split(uri);
  return goog.uri.utils.buildFromEncodedParts(parts[goog.uri.utils.ComponentIndex.SCHEME], parts[goog.uri.utils.ComponentIndex.USER_INFO], parts[goog.uri.utils.ComponentIndex.DOMAIN], parts[goog.uri.utils.ComponentIndex.PORT], path, parts[goog.uri.utils.ComponentIndex.QUERY_DATA], parts[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(uri) {
  return goog.uri.utils.setParam(uri, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
goog.net = {};
goog.net.ErrorCode = {NO_ERROR:0, ACCESS_DENIED:1, FILE_NOT_FOUND:2, FF_SILENT_ERROR:3, CUSTOM_ERROR:4, EXCEPTION:5, HTTP_ERROR:6, ABORT:7, TIMEOUT:8, OFFLINE:9};
goog.net.ErrorCode.getDebugMessage = function(errorCode) {
  switch(errorCode) {
    case goog.net.ErrorCode.NO_ERROR:
      return "No Error";
    case goog.net.ErrorCode.ACCESS_DENIED:
      return "Access denied to content document";
    case goog.net.ErrorCode.FILE_NOT_FOUND:
      return "File not found";
    case goog.net.ErrorCode.FF_SILENT_ERROR:
      return "Firefox silently errored";
    case goog.net.ErrorCode.CUSTOM_ERROR:
      return "Application custom error";
    case goog.net.ErrorCode.EXCEPTION:
      return "An exception occurred";
    case goog.net.ErrorCode.HTTP_ERROR:
      return "Http response at 400 or 500 level";
    case goog.net.ErrorCode.ABORT:
      return "Request was aborted";
    case goog.net.ErrorCode.TIMEOUT:
      return "Request timed out";
    case goog.net.ErrorCode.OFFLINE:
      return "The resource is not available offline";
    default:
      return "Unrecognized error code";
  }
};
goog.net.EventType = {COMPLETE:"complete", SUCCESS:"success", ERROR:"error", ABORT:"abort", READY:"ready", READY_STATE_CHANGE:"readystatechange", TIMEOUT:"timeout", INCREMENTAL_DATA:"incrementaldata", PROGRESS:"progress"};
goog.net.HttpStatus = {CONTINUE:100, SWITCHING_PROTOCOLS:101, OK:200, CREATED:201, ACCEPTED:202, NON_AUTHORITATIVE_INFORMATION:203, NO_CONTENT:204, RESET_CONTENT:205, PARTIAL_CONTENT:206, MULTIPLE_CHOICES:300, MOVED_PERMANENTLY:301, FOUND:302, SEE_OTHER:303, NOT_MODIFIED:304, USE_PROXY:305, TEMPORARY_REDIRECT:307, BAD_REQUEST:400, UNAUTHORIZED:401, PAYMENT_REQUIRED:402, FORBIDDEN:403, NOT_FOUND:404, METHOD_NOT_ALLOWED:405, NOT_ACCEPTABLE:406, PROXY_AUTHENTICATION_REQUIRED:407, REQUEST_TIMEOUT:408, 
CONFLICT:409, GONE:410, LENGTH_REQUIRED:411, PRECONDITION_FAILED:412, REQUEST_ENTITY_TOO_LARGE:413, REQUEST_URI_TOO_LONG:414, UNSUPPORTED_MEDIA_TYPE:415, REQUEST_RANGE_NOT_SATISFIABLE:416, EXPECTATION_FAILED:417, INTERNAL_SERVER_ERROR:500, NOT_IMPLEMENTED:501, BAD_GATEWAY:502, SERVICE_UNAVAILABLE:503, GATEWAY_TIMEOUT:504, HTTP_VERSION_NOT_SUPPORTED:505, QUIRK_IE_NO_CONTENT:1223};
goog.net.HttpStatus.isSuccess = function(status) {
  switch(status) {
    case goog.net.HttpStatus.OK:
    ;
    case goog.net.HttpStatus.CREATED:
    ;
    case goog.net.HttpStatus.ACCEPTED:
    ;
    case goog.net.HttpStatus.NO_CONTENT:
    ;
    case goog.net.HttpStatus.PARTIAL_CONTENT:
    ;
    case goog.net.HttpStatus.NOT_MODIFIED:
    ;
    case goog.net.HttpStatus.QUIRK_IE_NO_CONTENT:
      return!0;
    default:
      return!1;
  }
};
goog.net.XhrLike = function() {
};
goog.net.XhrLike.prototype.open = function() {
};
goog.net.XhrLike.prototype.send = function() {
};
goog.net.XhrLike.prototype.abort = function() {
};
goog.net.XhrLike.prototype.setRequestHeader = function() {
};
goog.net.XhrLike.prototype.getResponseHeader = function() {
};
goog.net.XhrLike.prototype.getAllResponseHeaders = function() {
};
goog.net.XmlHttpFactory = function() {
};
goog.net.XmlHttpFactory.prototype.cachedOptions_ = null;
goog.net.XmlHttpFactory.prototype.getOptions = function() {
  return this.cachedOptions_ || (this.cachedOptions_ = this.internalGetOptions());
};
goog.net.WrapperXmlHttpFactory = function(xhrFactory, optionsFactory) {
  this.xhrFactory_ = xhrFactory;
  this.optionsFactory_ = optionsFactory;
};
goog.inherits(goog.net.WrapperXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.WrapperXmlHttpFactory.prototype.createInstance = function() {
  return this.xhrFactory_();
};
goog.net.WrapperXmlHttpFactory.prototype.getOptions = function() {
  return this.optionsFactory_();
};
goog.net.XmlHttp = function() {
  return goog.net.XmlHttp.factory_.createInstance();
};
goog.net.XmlHttp.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttpDefines = {};
goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR = !1;
goog.net.XmlHttp.getOptions = function() {
  return goog.net.XmlHttp.factory_.getOptions();
};
goog.net.XmlHttp.OptionType = {USE_NULL_FUNCTION:0, LOCAL_REQUEST_ERROR:1};
goog.net.XmlHttp.ReadyState = {UNINITIALIZED:0, LOADING:1, LOADED:2, INTERACTIVE:3, COMPLETE:4};
goog.net.XmlHttp.setFactory = function(factory, optionsFactory) {
  goog.net.XmlHttp.setGlobalFactory(new goog.net.WrapperXmlHttpFactory(goog.asserts.assert(factory), goog.asserts.assert(optionsFactory)));
};
goog.net.XmlHttp.setGlobalFactory = function(factory) {
  goog.net.XmlHttp.factory_ = factory;
};
goog.net.DefaultXmlHttpFactory = function() {
};
goog.inherits(goog.net.DefaultXmlHttpFactory, goog.net.XmlHttpFactory);
goog.net.DefaultXmlHttpFactory.prototype.createInstance = function() {
  var progId = this.getProgId_();
  return progId ? new ActiveXObject(progId) : new XMLHttpRequest;
};
goog.net.DefaultXmlHttpFactory.prototype.internalGetOptions = function() {
  var progId = this.getProgId_(), options = {};
  progId && (options[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] = !0, options[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] = !0);
  return options;
};
goog.net.DefaultXmlHttpFactory.prototype.getProgId_ = function() {
  if (goog.net.XmlHttp.ASSUME_NATIVE_XHR || goog.net.XmlHttpDefines.ASSUME_NATIVE_XHR) {
    return "";
  }
  if (!this.ieProgId_ && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for (var ACTIVE_X_IDENTS = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], i = 0;i < ACTIVE_X_IDENTS.length;i++) {
      var candidate = ACTIVE_X_IDENTS[i];
      try {
        return new ActiveXObject(candidate), this.ieProgId_ = candidate;
      } catch (e) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return this.ieProgId_;
};
goog.net.XmlHttp.setGlobalFactory(new goog.net.DefaultXmlHttpFactory);
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.events.EventTarget.call(this);
  this.headers = new goog.structs.Map;
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
  this.active_ = !1;
  this.xhrOptions_ = this.xhr_ = null;
  this.lastMethod_ = this.lastUri_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastError_ = "";
  this.inAbort_ = this.inOpen_ = this.inSend_ = this.errorDispatched_ = !1;
  this.timeoutInterval_ = 0;
  this.timeoutId_ = null;
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;
  this.useXhr2Timeout_ = this.withCredentials_ = !1;
};
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);
goog.net.XhrIo.ResponseType = {DEFAULT:"", TEXT:"text", DOCUMENT:"document", BLOB:"blob", ARRAY_BUFFER:"arraybuffer"};
goog.net.XhrIo.prototype.logger_ = goog.log.getLogger("goog.net.XhrIo");
goog.net.XhrIo.CONTENT_TYPE_HEADER = "Content-Type";
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ["POST", "PUT"];
goog.net.XhrIo.FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
goog.net.XhrIo.XHR2_TIMEOUT_ = "timeout";
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = "ontimeout";
goog.net.XhrIo.sendInstances_ = [];
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content, opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new goog.net.XhrIo;
  goog.net.XhrIo.sendInstances_.push(x);
  opt_callback && x.listen(goog.net.EventType.COMPLETE, opt_callback);
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_);
  opt_timeoutInterval && x.setTimeoutInterval(opt_timeoutInterval);
  opt_withCredentials && x.setWithCredentials(opt_withCredentials);
  x.send(url, opt_method, opt_content, opt_headers);
};
goog.net.XhrIo.cleanup = function() {
  for (var instances = goog.net.XhrIo.sendInstances_;instances.length;) {
    instances.pop().dispose();
  }
};
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = errorHandler.protectEntryPoint(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, this);
};
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};
goog.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type;
};
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
};
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  if (this.xhr_) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.lastUri_ + "; newUri=" + url);
  }
  var method = opt_method ? opt_method.toUpperCase() : "GET";
  this.lastUri_ = url;
  this.lastError_ = "";
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = !1;
  this.active_ = !0;
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  try {
    goog.log.fine(this.logger_, this.formatMsg_("Opening Xhr")), this.inOpen_ = !0, this.xhr_.open(method, String(url), !0), this.inOpen_ = !1;
  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_("Error opening Xhr: " + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }
  var content = opt_content || "", headers = this.headers.clone();
  opt_headers && goog.structs.forEach(opt_headers, function(value, key) {
    headers.set(key, value);
  });
  var contentTypeKey = goog.array.find(headers.getKeys(), goog.net.XhrIo.isContentTypeHeader_), contentIsFormData = goog.global.FormData && content instanceof goog.global.FormData;
  !goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) || contentTypeKey || contentIsFormData || headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER, goog.net.XhrIo.FORM_CONTENT_TYPE);
  headers.forEach(function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);
  this.responseType_ && (this.xhr_.responseType = this.responseType_);
  goog.object.containsKey(this.xhr_, "withCredentials") && (this.xhr_.withCredentials = this.withCredentials_);
  try {
    this.cleanUpTimeoutTimer_(), 0 < this.timeoutInterval_ && (this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_), goog.log.fine(this.logger_, this.formatMsg_("Will abort after " + this.timeoutInterval_ + "ms if incomplete, xhr2 " + this.useXhr2Timeout_)), this.useXhr2Timeout_ ? (this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_, this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = goog.bind(this.timeout_, this)) : this.timeoutId_ = goog.Timer.callOnce(this.timeout_, this.timeoutInterval_, 
    this)), goog.log.fine(this.logger_, this.formatMsg_("Sending request")), this.inSend_ = !0, this.xhr_.send(content), this.inSend_ = !1;
  } catch (err$$0) {
    goog.log.fine(this.logger_, this.formatMsg_("Send error: " + err$$0.message)), this.error_(goog.net.ErrorCode.EXCEPTION, err$$0);
  }
};
goog.net.XhrIo.shouldUseXhr2Timeout_ = function(xhr) {
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher(9) && goog.isNumber(xhr[goog.net.XhrIo.XHR2_TIMEOUT_]) && goog.isDef(xhr[goog.net.XhrIo.XHR2_ON_TIMEOUT_]);
};
goog.net.XhrIo.isContentTypeHeader_ = function(header) {
  return goog.string.caseInsensitiveEquals(goog.net.XhrIo.CONTENT_TYPE_HEADER, header);
};
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};
goog.net.XhrIo.prototype.timeout_ = function() {
  "undefined" != typeof goog && this.xhr_ && (this.lastError_ = "Timed out after " + this.timeoutInterval_ + "ms, aborting", this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT, goog.log.fine(this.logger_, this.formatMsg_(this.lastError_)), this.dispatchEvent(goog.net.EventType.TIMEOUT), this.abort(goog.net.ErrorCode.TIMEOUT));
};
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = !1;
  this.xhr_ && (this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1);
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  this.errorDispatched_ || (this.errorDispatched_ = !0, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ERROR));
};
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  this.xhr_ && this.active_ && (goog.log.fine(this.logger_, this.formatMsg_("Aborting")), this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1, this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT, this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.ABORT), this.cleanUpXhr_());
};
goog.net.XhrIo.prototype.disposeInternal = function() {
  this.xhr_ && (this.active_ && (this.active_ = !1, this.inAbort_ = !0, this.xhr_.abort(), this.inAbort_ = !1), this.cleanUpXhr_(!0));
  goog.net.XhrIo.superClass_.disposeInternal.call(this);
};
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (!this.isDisposed()) {
    if (this.inOpen_ || this.inSend_ || this.inAbort_) {
      this.onReadyStateChangeHelper_();
    } else {
      this.onReadyStateChangeEntryPoint_();
    }
  }
};
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (this.active_ && "undefined" != typeof goog) {
    if (this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE && 2 == this.getStatus()) {
      goog.log.fine(this.logger_, this.formatMsg_("Local request error detected and ignored"));
    } else {
      if (this.inSend_ && this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
      } else {
        if (this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE), this.isComplete()) {
          goog.log.fine(this.logger_, this.formatMsg_("Request complete"));
          this.active_ = !1;
          try {
            this.isSuccess() ? (this.dispatchEvent(goog.net.EventType.COMPLETE), this.dispatchEvent(goog.net.EventType.SUCCESS)) : (this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR, this.lastError_ = this.getStatusText() + " [" + this.getStatus() + "]", this.dispatchErrors_());
          } finally {
            this.cleanUpXhr_();
          }
        }
      }
    }
  }
};
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    this.cleanUpTimeoutTimer_();
    var xhr = this.xhr_, clearedOnReadyStateChange = this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ? goog.nullFunction : null;
    this.xhrOptions_ = this.xhr_ = null;
    opt_fromDispose || this.dispatchEvent(goog.net.EventType.READY);
    try {
      xhr.onreadystatechange = clearedOnReadyStateChange;
    } catch (e) {
      goog.log.error(this.logger_, "Problem encountered resetting onreadystatechange: " + e.message);
    }
  }
};
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  this.xhr_ && this.useXhr2Timeout_ && (this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null);
  goog.isNumber(this.timeoutId_) && (goog.Timer.clear(this.timeoutId_), this.timeoutId_ = null);
};
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};
goog.net.XhrIo.prototype.isSuccess = function() {
  var status = this.getStatus();
  return goog.net.HttpStatus.isSuccess(status) || 0 === status && !this.isLastUriEffectiveSchemeHttp_();
};
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
};
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ? this.xhr_.readyState : goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};
goog.net.XhrIo.prototype.getStatus = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.status : -1;
  } catch (e) {
    return-1;
  }
};
goog.net.XhrIo.prototype.getStatusText = function() {
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ? this.xhr_.statusText : "";
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get status: " + e.message), "";
  }
};
goog.net.XhrIo.prototype.getResponse = function() {
  try {
    if (!this.xhr_) {
      return null;
    }
    if ("response" in this.xhr_) {
      return this.xhr_.response;
    }
    switch(this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      ;
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ("mozResponseArrayBuffer" in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer;
        }
      ;
    }
    goog.log.error(this.logger_, "Response type " + this.responseType_ + " is not supported on this browser");
    return null;
  } catch (e) {
    return goog.log.fine(this.logger_, "Can not get response: " + e.message), null;
  }
};
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ? this.xhr_.getResponseHeader(key) : void 0;
};
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ? this.xhr_.getAllResponseHeaders() : "";
};
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + " [" + this.lastMethod_ + " " + this.lastUri_ + " " + this.getStatus() + "]";
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
});
goog.structs.Queue = function() {
  this.tail_ = this.head_ = 0;
  this.elements_ = [];
};
goog.structs.Queue.prototype.enqueue = function(element) {
  this.elements_[this.tail_++] = element;
};
goog.structs.Queue.prototype.dequeue = function() {
  if (this.head_ != this.tail_) {
    var result = this.elements_[this.head_];
    delete this.elements_[this.head_];
    this.head_++;
    return result;
  }
};
goog.structs.Queue.prototype.peek = function() {
  return this.head_ == this.tail_ ? void 0 : this.elements_[this.head_];
};
goog.structs.Queue.prototype.getCount = function() {
  return this.tail_ - this.head_;
};
goog.structs.Queue.prototype.isEmpty = function() {
  return 0 == this.tail_ - this.head_;
};
goog.structs.Queue.prototype.clear = function() {
  this.tail_ = this.head_ = this.elements_.length = 0;
};
goog.structs.Queue.prototype.contains = function(obj) {
  return goog.array.contains(this.elements_, obj);
};
goog.structs.Queue.prototype.remove = function(obj) {
  var index = goog.array.indexOf(this.elements_, obj);
  if (0 > index) {
    return!1;
  }
  index == this.head_ ? this.dequeue() : (goog.array.removeAt(this.elements_, index), this.tail_--);
  return!0;
};
goog.structs.Queue.prototype.getValues = function() {
  return this.elements_.slice(this.head_, this.tail_);
};
goog.Uri = function(opt_uri, opt_ignoreCase) {
  var m;
  opt_uri instanceof goog.Uri ? (this.ignoreCase_ = goog.isDef(opt_ignoreCase) ? opt_ignoreCase : opt_uri.getIgnoreCase(), this.setScheme(opt_uri.getScheme()), this.setUserInfo(opt_uri.getUserInfo()), this.setDomain(opt_uri.getDomain()), this.setPort(opt_uri.getPort()), this.setPath(opt_uri.getPath()), this.setQueryData(opt_uri.getQueryData().clone()), this.setFragment(opt_uri.getFragment())) : opt_uri && (m = goog.uri.utils.split(String(opt_uri))) ? (this.ignoreCase_ = !!opt_ignoreCase, this.setScheme(m[goog.uri.utils.ComponentIndex.SCHEME] || 
  "", !0), this.setUserInfo(m[goog.uri.utils.ComponentIndex.USER_INFO] || "", !0), this.setDomain(m[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(m[goog.uri.utils.ComponentIndex.PORT]), this.setPath(m[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(m[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(m[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!opt_ignoreCase, this.queryData_ = new goog.Uri.QueryData(null, null, 
  this.ignoreCase_));
};
goog.Uri.preserveParameterTypesCompatibilityFlag = !1;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
  var out = [], scheme = this.getScheme();
  scheme && out.push(goog.Uri.encodeSpecialChars_(scheme, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
  var domain = this.getDomain();
  if (domain) {
    out.push("//");
    var userInfo = this.getUserInfo();
    userInfo && out.push(goog.Uri.encodeSpecialChars_(userInfo, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@");
    out.push(goog.string.urlEncode(domain));
    var port = this.getPort();
    null != port && out.push(":", String(port));
  }
  var path = this.getPath();
  path && (this.hasDomain() && "/" != path.charAt(0) && out.push("/"), out.push(goog.Uri.encodeSpecialChars_(path, "/" == path.charAt(0) ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_)));
  var query = this.getEncodedQuery();
  query && out.push("?", query);
  var fragment = this.getFragment();
  fragment && out.push("#", goog.Uri.encodeSpecialChars_(fragment, goog.Uri.reDisallowedInFragment_));
  return out.join("");
};
goog.Uri.prototype.resolve = function(relativeUri) {
  var absoluteUri = this.clone(), overridden = relativeUri.hasScheme();
  overridden ? absoluteUri.setScheme(relativeUri.getScheme()) : overridden = relativeUri.hasUserInfo();
  overridden ? absoluteUri.setUserInfo(relativeUri.getUserInfo()) : overridden = relativeUri.hasDomain();
  overridden ? absoluteUri.setDomain(relativeUri.getDomain()) : overridden = relativeUri.hasPort();
  var path = relativeUri.getPath();
  if (overridden) {
    absoluteUri.setPort(relativeUri.getPort());
  } else {
    if (overridden = relativeUri.hasPath()) {
      if ("/" != path.charAt(0)) {
        if (this.hasDomain() && !this.hasPath()) {
          path = "/" + path;
        } else {
          var lastSlashIndex = absoluteUri.getPath().lastIndexOf("/");
          -1 != lastSlashIndex && (path = absoluteUri.getPath().substr(0, lastSlashIndex + 1) + path);
        }
      }
      path = goog.Uri.removeDotSegments(path);
    }
  }
  overridden ? absoluteUri.setPath(path) : overridden = relativeUri.hasQuery();
  overridden ? absoluteUri.setQueryData(relativeUri.getDecodedQuery()) : overridden = relativeUri.hasFragment();
  overridden && absoluteUri.setFragment(relativeUri.getFragment());
  return absoluteUri;
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this);
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};
goog.Uri.prototype.setScheme = function(newScheme, opt_decode) {
  this.enforceReadOnly();
  if (this.scheme_ = opt_decode ? goog.Uri.decodeOrEmpty_(newScheme) : newScheme) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_;
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
goog.Uri.prototype.setUserInfo = function(newUserInfo, opt_decode) {
  this.enforceReadOnly();
  this.userInfo_ = opt_decode ? goog.Uri.decodeOrEmpty_(newUserInfo) : newUserInfo;
  return this;
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_;
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};
goog.Uri.prototype.setDomain = function(newDomain, opt_decode) {
  this.enforceReadOnly();
  this.domain_ = opt_decode ? goog.Uri.decodeOrEmpty_(newDomain) : newDomain;
  return this;
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_;
};
goog.Uri.prototype.getPort = function() {
  return this.port_;
};
goog.Uri.prototype.setPort = function(newPort) {
  this.enforceReadOnly();
  if (newPort) {
    newPort = Number(newPort);
    if (isNaN(newPort) || 0 > newPort) {
      throw Error("Bad port number " + newPort);
    }
    this.port_ = newPort;
  } else {
    this.port_ = null;
  }
  return this;
};
goog.Uri.prototype.hasPort = function() {
  return null != this.port_;
};
goog.Uri.prototype.getPath = function() {
  return this.path_;
};
goog.Uri.prototype.setPath = function(newPath, opt_decode) {
  this.enforceReadOnly();
  this.path_ = opt_decode ? goog.Uri.decodeOrEmpty_(newPath) : newPath;
  return this;
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_;
};
goog.Uri.prototype.hasQuery = function() {
  return "" !== this.queryData_.toString();
};
goog.Uri.prototype.setQueryData = function(queryData, opt_decode) {
  this.enforceReadOnly();
  queryData instanceof goog.Uri.QueryData ? (this.queryData_ = queryData, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (opt_decode || (queryData = goog.Uri.encodeSpecialChars_(queryData, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(queryData, null, this.ignoreCase_));
  return this;
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString();
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
goog.Uri.prototype.setParameterValue = function(key, value) {
  this.enforceReadOnly();
  this.queryData_.set(key, value);
  return this;
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};
goog.Uri.prototype.setFragment = function(newFragment, opt_decode) {
  this.enforceReadOnly();
  this.fragment_ = opt_decode ? goog.Uri.decodeOrEmpty_(newFragment) : newFragment;
  return this;
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_;
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
goog.Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(ignoreCase) {
  this.ignoreCase_ = ignoreCase;
  this.queryData_ && this.queryData_.setIgnoreCase(ignoreCase);
  return this;
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_;
};
goog.Uri.parse = function(uri, opt_ignoreCase) {
  return uri instanceof goog.Uri ? uri.clone() : new goog.Uri(uri, opt_ignoreCase);
};
goog.Uri.create = function(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_query, opt_fragment, opt_ignoreCase) {
  var uri = new goog.Uri(null, opt_ignoreCase);
  opt_scheme && uri.setScheme(opt_scheme);
  opt_userInfo && uri.setUserInfo(opt_userInfo);
  opt_domain && uri.setDomain(opt_domain);
  opt_port && uri.setPort(opt_port);
  opt_path && uri.setPath(opt_path);
  opt_query && uri.setQueryData(opt_query);
  opt_fragment && uri.setFragment(opt_fragment);
  return uri;
};
goog.Uri.resolve = function(base, rel) {
  base instanceof goog.Uri || (base = goog.Uri.parse(base));
  rel instanceof goog.Uri || (rel = goog.Uri.parse(rel));
  return base.resolve(rel);
};
goog.Uri.removeDotSegments = function(path) {
  if (".." == path || "." == path) {
    return "";
  }
  if (goog.string.contains(path, "./") || goog.string.contains(path, "/.")) {
    for (var leadingSlash = goog.string.startsWith(path, "/"), segments = path.split("/"), out = [], pos = 0;pos < segments.length;) {
      var segment = segments[pos++];
      "." == segment ? leadingSlash && pos == segments.length && out.push("") : ".." == segment ? ((1 < out.length || 1 == out.length && "" != out[0]) && out.pop(), leadingSlash && pos == segments.length && out.push("")) : (out.push(segment), leadingSlash = !0);
    }
    return out.join("/");
  }
  return path;
};
goog.Uri.decodeOrEmpty_ = function(val) {
  return val ? decodeURIComponent(val) : "";
};
goog.Uri.encodeSpecialChars_ = function(unescapedPart, extra) {
  return goog.isString(unescapedPart) ? encodeURI(unescapedPart).replace(extra, goog.Uri.encodeChar_) : null;
};
goog.Uri.encodeChar_ = function(ch) {
  var n = ch.charCodeAt(0);
  return "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16);
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(uri1String, uri2String) {
  var pieces1 = goog.uri.utils.split(uri1String), pieces2 = goog.uri.utils.split(uri2String);
  return pieces1[goog.uri.utils.ComponentIndex.DOMAIN] == pieces2[goog.uri.utils.ComponentIndex.DOMAIN] && pieces1[goog.uri.utils.ComponentIndex.PORT] == pieces2[goog.uri.utils.ComponentIndex.PORT];
};
goog.Uri.QueryData = function(opt_query, opt_uri, opt_ignoreCase) {
  this.encodedQuery_ = opt_query || null;
  this.ignoreCase_ = !!opt_ignoreCase;
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_)) {
    for (var pairs = this.encodedQuery_.split("&"), i = 0;i < pairs.length;i++) {
      var indexOfEquals = pairs[i].indexOf("="), name = null, value = null;
      0 <= indexOfEquals ? (name = pairs[i].substring(0, indexOfEquals), value = pairs[i].substring(indexOfEquals + 1)) : name = pairs[i];
      name = goog.string.urlDecode(name);
      name = this.getKeyName_(name);
      this.add(name, value ? goog.string.urlDecode(value) : "");
    }
  }
};
goog.Uri.QueryData.createFromMap = function(map, opt_uri, opt_ignoreCase) {
  var keys = goog.structs.getKeys(map);
  if ("undefined" == typeof keys) {
    throw Error("Keys are undefined");
  }
  for (var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase), values = goog.structs.getValues(map), i = 0;i < keys.length;i++) {
    var key = keys[i], value = values[i];
    goog.isArray(value) ? queryData.setValues(key, value) : queryData.add(key, value);
  }
  return queryData;
};
goog.Uri.QueryData.createFromKeysValues = function(keys, values, opt_uri, opt_ignoreCase) {
  if (keys.length != values.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  for (var queryData = new goog.Uri.QueryData(null, null, opt_ignoreCase), i = 0;i < keys.length;i++) {
    queryData.add(keys[i], values[i]);
  }
  return queryData;
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
goog.Uri.QueryData.prototype.add = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  var values = this.keyMap_.get(key);
  values || this.keyMap_.set(key, values = []);
  values.push(value);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.remove = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key) ? (this.invalidateCache_(), this.count_ -= this.keyMap_.get(key).length, this.keyMap_.remove(key)) : !1;
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return 0 == this.count_;
};
goog.Uri.QueryData.prototype.containsKey = function(key) {
  this.ensureKeyMapInitialized_();
  key = this.getKeyName_(key);
  return this.keyMap_.containsKey(key);
};
goog.Uri.QueryData.prototype.containsValue = function(value) {
  var vals = this.getValues();
  return goog.array.contains(vals, value);
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for (var vals = this.keyMap_.getValues(), keys = this.keyMap_.getKeys(), rv = [], i = 0;i < keys.length;i++) {
    for (var val = vals[i], j = 0;j < val.length;j++) {
      rv.push(keys[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.getValues = function(opt_key) {
  this.ensureKeyMapInitialized_();
  var rv = [];
  if (goog.isString(opt_key)) {
    this.containsKey(opt_key) && (rv = goog.array.concat(rv, this.keyMap_.get(this.getKeyName_(opt_key))));
  } else {
    for (var values = this.keyMap_.getValues(), i = 0;i < values.length;i++) {
      rv = goog.array.concat(rv, values[i]);
    }
  }
  return rv;
};
goog.Uri.QueryData.prototype.set = function(key, value) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  key = this.getKeyName_(key);
  this.containsKey(key) && (this.count_ -= this.keyMap_.get(key).length);
  this.keyMap_.set(key, [value]);
  this.count_++;
  return this;
};
goog.Uri.QueryData.prototype.get = function(key, opt_default) {
  var values = key ? this.getValues(key) : [];
  return goog.Uri.preserveParameterTypesCompatibilityFlag ? 0 < values.length ? values[0] : opt_default : 0 < values.length ? String(values[0]) : opt_default;
};
goog.Uri.QueryData.prototype.setValues = function(key, values) {
  this.remove(key);
  0 < values.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(key), goog.array.clone(values)), this.count_ += values.length);
};
goog.Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  for (var sb = [], keys = this.keyMap_.getKeys(), i = 0;i < keys.length;i++) {
    for (var key = keys[i], encodedKey = goog.string.urlEncode(key), val = this.getValues(key), j = 0;j < val.length;j++) {
      var param = encodedKey;
      "" !== val[j] && (param += "=" + goog.string.urlEncode(val[j]));
      sb.push(param);
    }
  }
  return this.encodedQuery_ = sb.join("&");
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString());
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
goog.Uri.QueryData.prototype.clone = function() {
  var rv = new goog.Uri.QueryData;
  rv.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ && (rv.keyMap_ = this.keyMap_.clone(), rv.count_ = this.count_);
  return rv;
};
goog.Uri.QueryData.prototype.getKeyName_ = function(arg) {
  var keyName = String(arg);
  this.ignoreCase_ && (keyName = keyName.toLowerCase());
  return keyName;
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(ignoreCase) {
  var resetKeys = ignoreCase && !this.ignoreCase_;
  resetKeys && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function(value, key) {
    var lowerCase = key.toLowerCase();
    key != lowerCase && (this.remove(key), this.setValues(lowerCase, value));
  }, this));
  this.ignoreCase_ = ignoreCase;
};
goog.Uri.QueryData.prototype.extend = function(var_args) {
  for (var i = 0;i < arguments.length;i++) {
    var data = arguments[i];
    goog.structs.forEach(data, function(value, key) {
      this.add(key, value);
    }, this);
  }
};
var cast = {player:{}};
cast.player.api = {};
cast.player.api.StreamingProtocol = {};
cast.player.api.HlsSegmentFormat = {MPEG2_TS:0, MPEG_AUDIO_ES:1};
goog.exportSymbol("cast.player.api.HlsSegmentFormat", cast.player.api.HlsSegmentFormat);
cast.player.api.VERSION = "0.4.0";
goog.exportSymbol("cast.player.api.VERSION", cast.player.api.VERSION);
cast.player.api.REVISION = 4;
cast.player.api.LoggerLevel = {DEBUG:0, INFO:800, ERROR:1E3, NONE:Infinity};
goog.exportSymbol("cast.player.api.LoggerLevel", cast.player.api.LoggerLevel);
cast.player.api.setLoggerLevel = function(level) {
  goog.debug.LogManager.getRoot().setLevel(goog.debug.Logger.Level.getPredefinedLevelByValue(level));
};
goog.exportSymbol("cast.player.api.setLoggerLevel", cast.player.api.setLoggerLevel);
goog.debug.Console.autoInstall();
goog.debug.Console.instance.setCapturing(!0);
cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.ERROR);
cast.player.api.RequestInfo = function() {
  this.timeoutInterval = cast.player.common.Network.TIMEOUT;
  this.headers = this.url = null;
  this.withCredentials = !1;
  this.protectionSystem = this.content = null;
};
goog.exportSymbol("cast.player.api.RequestInfo", cast.player.api.RequestInfo);
goog.exportProperty(cast.player.api.RequestInfo.prototype, "timeoutInterval", cast.player.api.RequestInfo.prototype.timeoutInterval);
goog.exportProperty(cast.player.api.RequestInfo.prototype, "url", cast.player.api.RequestInfo.prototype.url);
goog.exportProperty(cast.player.api.RequestInfo.prototype, "headers", cast.player.api.RequestInfo.prototype.headers);
goog.exportProperty(cast.player.api.RequestInfo.prototype, "withCredentials", cast.player.api.RequestInfo.prototype.withCredentials);
goog.exportProperty(cast.player.api.RequestInfo.prototype, "content", cast.player.api.RequestInfo.prototype.content);
goog.exportProperty(cast.player.api.RequestInfo.prototype, "protectionSystem", cast.player.api.RequestInfo.prototype.protectionSystem);
cast.player.api.RequestStatus = function(url, errorCode, status) {
  this.url = url;
  this.errorCode = errorCode;
  this.status = status;
};
goog.exportSymbol("cast.player.api.RequestStatus", cast.player.api.RequestStatus);
goog.exportProperty(cast.player.api.RequestStatus.prototype, "url", cast.player.api.RequestStatus.prototype.url);
goog.exportProperty(cast.player.api.RequestStatus.prototype, "errorCode", cast.player.api.RequestStatus.prototype.errorCode);
goog.exportProperty(cast.player.api.RequestStatus.prototype, "status", cast.player.api.RequestStatus.prototype.status);
cast.player.api.StreamInfo = function(codecs, mimeType, bitrates, opt_language) {
  this.codecs = codecs;
  this.mimeType = mimeType;
  this.bitrates = bitrates;
  this.language = opt_language || null;
};
goog.exportSymbol("cast.player.api.StreamInfo", cast.player.api.StreamInfo);
goog.exportProperty(cast.player.api.StreamInfo.prototype, "codecs", cast.player.api.RequestInfo.prototype.codecs);
goog.exportProperty(cast.player.api.StreamInfo.prototype, "mimeType", cast.player.api.RequestInfo.prototype.mimeType);
goog.exportProperty(cast.player.api.StreamInfo.prototype, "bitrates", cast.player.api.RequestInfo.prototype.bitrates);
goog.exportProperty(cast.player.api.StreamInfo.prototype, "language", cast.player.api.RequestInfo.prototype.language);
cast.player.api.ErrorCode = {MANIFEST:0, PLAYBACK:1, MEDIAKEYS:2, NETWORK:3};
goog.exportSymbol("cast.player.api.ErrorCode", cast.player.api.ErrorCode);
cast.player.api.HostOptions = {};
cast.player.api.Host = function(options) {
  this.initialBandwidth = 2097152;
  this.autoResumeDuration = 10;
  this.autoPauseDuration = 1;
  this.url = options.url;
  this.licenseUrl = options.licenseUrl;
  this.licenseCustomData = options.licenseCustomData || null;
  this.mediaElement_ = options.mediaElement || null;
  this.onError = this.onError_;
  this.updateManifestRequestInfo = this.updateManifestRequestInfo_;
  this.updateLicenseRequestInfo = this.updateLicenseRequestInfo_;
  this.updateSegmentRequestInfo = this.updateSegmentRequestInfo_;
  this.updateCaptionsRequestInfo = this.updateCaptionsRequestInfo_;
  this.getLicenseCustomData = this.getLicenseCustomData_;
  this.trackBandwidth = this.trackBandwidth_;
  this.getQualityLevel = this.getQualityLevel_;
  this.getMediaElement = this.getMediaElement_;
  this.prepareLicenseRequest = this.prepareLicenseRequest_;
  this.processMetadata = this.processMetadata_;
  this.processLicense = this.processLicense_;
};
goog.exportSymbol("cast.player.api.Host", cast.player.api.Host);
goog.exportProperty(cast.player.api.Host.prototype, "onError", cast.player.api.Host.prototype.onError);
goog.exportProperty(cast.player.api.Host.prototype, "updateManifestRequestInfo", cast.player.api.Host.prototype.updateManifestRequestInfo);
goog.exportProperty(cast.player.api.Host.prototype, "updateLicenseRequestInfo", cast.player.api.Host.prototype.updateLicenseRequestInfo);
goog.exportProperty(cast.player.api.Host.prototype, "updateSegmentRequestInfo", cast.player.api.Host.prototype.updateSegmentRequestInfo);
goog.exportProperty(cast.player.api.Host.prototype, "updateCaptionsRequestInfo", cast.player.api.Host.prototype.updateCaptionsRequestInfo);
goog.exportProperty(cast.player.api.Host.prototype, "getLicenseCustomData", cast.player.api.Host.prototype.getLicenseCustomData);
goog.exportProperty(cast.player.api.Host.prototype, "trackBandwidth", cast.player.api.Host.prototype.trackBandwidth);
goog.exportProperty(cast.player.api.Host.prototype, "getQualityLevel", cast.player.api.Host.prototype.getQualityLevel);
goog.exportProperty(cast.player.api.Host.prototype, "getMediaElement", cast.player.api.Host.prototype.getMediaElement);
goog.exportProperty(cast.player.api.Host.prototype, "prepareLicenseRequest", cast.player.api.Host.prototype.prepareLicenseRequest);
goog.exportProperty(cast.player.api.Host.prototype, "processMetadata", cast.player.api.Host.prototype.processMetadata);
goog.exportProperty(cast.player.api.Host.prototype, "processLicense", cast.player.api.Host.prototype.processLicense);
cast.player.api.Host.prototype.onError_ = function() {
};
cast.player.api.Host.prototype.updateManifestRequestInfo_ = function(requestInfo) {
  requestInfo.url || (requestInfo.url = this.url);
};
cast.player.api.Host.prototype.updateLicenseRequestInfo_ = function(requestInfo) {
  this.licenseUrl && (requestInfo.url = this.licenseUrl);
};
cast.player.api.Host.prototype.updateSegmentRequestInfo_ = function() {
};
cast.player.api.Host.prototype.updateCaptionsRequestInfo_ = function() {
};
cast.player.api.Host.prototype.getLicenseCustomData_ = function() {
  return this.licenseCustomData;
};
cast.player.api.Host.prototype.trackBandwidth_ = function() {
};
cast.player.api.Host.prototype.getQualityLevel_ = function(streamIndex, qualityLevel) {
  return qualityLevel;
};
cast.player.api.Host.prototype.getMediaElement_ = function() {
  return this.mediaElement_;
};
cast.player.api.Host.prototype.prepareLicenseRequest_ = function() {
  return!0;
};
cast.player.api.Host.prototype.processMetadata_ = function() {
};
cast.player.api.Host.prototype.processLicense_ = function(data) {
  return data;
};
cast.player.common = {};
cast.player.common.ManifestValue = function() {
};
cast.player.common.NumberValue = function(name, opt_parse) {
  this.name = name;
  this.value = null;
  this.parse_ = opt_parse || null;
  this.parse = function(s) {
    this.value = this.parse_ ? this.parse_(s) : parseInt(s, 10);
  };
};
cast.player.common.StringValue = function(name, opt_parse, opt_default) {
  this.name = name;
  this.value = opt_default || null;
  this.parse_ = opt_parse || null;
  this.parse = function(s) {
    this.value = this.parse_ ? this.parse_(s) : s;
  };
};
cast.player.common.BooleanValue = function(name) {
  this.name = name;
  this.value = null;
  this.parse = function(s) {
    this.value = "true" === s.toLowerCase();
  };
};
cast.player.common.parseAttributes = function(attributes, obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      var value = obj[prop], attribute = attributes.getNamedItem(value.name);
      null !== attribute && value.parse(attribute.value);
    }
  }
};
cast.player.common.ManifestLoadedCallback = function() {
};
cast.player.common.ManifestLoadedCallback.prototype.onManifestLoaded = function() {
};
cast.player.common.ManifestLoader = function() {
  this.url_ = this.manifestLoadedCallback_ = null;
  this.retryCount_ = 0;
  this.headers_ = null;
  this.xhrIo_ = new goog.net.XhrIo;
  goog.events.listen(this.xhrIo_, goog.net.EventType.SUCCESS, this.onXhrSuccess_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.ERROR, this.onXhrError_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onXhrTimeout_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.READY, this.onXhrReady_, !1, this);
};
goog.inherits(cast.player.common.ManifestLoader, goog.Disposable);
cast.player.common.ManifestLoader.prototype.disposeInternal = function() {
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.SUCCESS, this.onXhrSuccess_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.ERROR, this.onXhrError_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onXhrError_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.READY, this.onXhrReady_, !1, this);
  this.xhrIo_.dispose();
  cast.player.common.ManifestLoader.superClass_.disposeInternal.call(this);
};
cast.player.common.ManifestLoader.prototype.load = function(requestInfo, manifestLoadedCallback) {
  this.manifestLoadedCallback_ = manifestLoadedCallback;
  this.url_ = requestInfo.url;
  this.headers_ = requestInfo.headers;
  this.xhrIo_.setWithCredentials(requestInfo.withCredentials);
  this.xhrIo_.setTimeoutInterval(requestInfo.timeoutInterval);
  this.retryCount_ = 0;
  this.xhrIo_.send(this.url_, void 0, void 0, this.headers_);
};
cast.player.common.ManifestLoader.prototype.abort = function() {
  this.xhrIo_.abort();
};
cast.player.common.ManifestLoader.prototype.getRequestStatus = function() {
  return new cast.player.api.RequestStatus(this.url_, this.xhrIo_.getLastErrorCode(), this.xhrIo_.getStatus());
};
cast.player.common.ManifestLoader.prototype.onXhrSuccess_ = function(e) {
  this.manifestLoadedCallback_.onManifestLoaded(e.target.getResponse());
};
cast.player.common.ManifestLoader.prototype.onXhrError_ = function() {
  this.manifestLoadedCallback_.onManifestLoaded(null);
};
cast.player.common.ManifestLoader.prototype.onXhrTimeout_ = function() {
  this.retryCount_++;
  if (this.retryCount_ > cast.player.common.Network.RETRY_LIMIT) {
    this.manifestLoadedCallback_.onManifestLoaded(null);
  }
};
cast.player.common.ManifestLoader.prototype.onXhrReady_ = function() {
  0 < this.retryCount_ && this.xhrIo_.send(this.url_, void 0, void 0, this.headers_);
};
cast.player.common.SegmentProcessedCallback = function() {
};
cast.player.common.SegmentProcessedCallback.prototype.onSegmentProcessed = function() {
};
cast.player.common.QualitySetCallback = function() {
};
cast.player.common.QualitySetCallback.prototype.onQualitySet = function() {
};
cast.player.common.ManifestReadyCallback = function() {
};
goog.exportSymbol("cast.player.common.ManifestReadyCallback", cast.player.common.ManifestReadyCallback);
cast.player.common.ManifestReadyCallback.prototype.onManifestReady = function() {
};
cast.player.common.PlaylistReadyCallback = function() {
};
goog.exportSymbol("cast.player.common.PlaylistReadyCallback", cast.player.common.PlaylistReadyCallback);
cast.player.common.PlaylistReadyCallback.prototype.onPlaylistReady = function() {
};
cast.player.common.SourceBufferCallback = function() {
};
cast.player.common.SourceBufferCallback.prototype.getSourceBuffer = function() {
};
cast.player.common.StreamingProtocol = function(host) {
  this.host = host;
  this.uri = null;
  this.isLive = !1;
  this.duration = -1;
  this.adaptations = [];
  this.manifestLoader = new cast.player.common.ManifestLoader;
  this.sourceBufferCallback = this.playlistReadyCallback = this.manifestReadyCallback = null;
  this.requestInfo = new cast.player.api.RequestInfo;
};
cast.player.common.StreamingProtocol.prototype.resolveUrl = function(url) {
  return this.uri.resolve(new goog.Uri(url)).toString();
};
cast.player.common.StreamingProtocol.prototype.unload = function() {
  this.manifestLoader.dispose();
};
cast.player.common.StreamingProtocol.prototype.load = function(manifestReadyCallback, playlistReadyCallback, sourceBufferCallback) {
  this.host.updateManifestRequestInfo(this.requestInfo);
  this.uri = new goog.Uri(this.requestInfo.url);
  this.sourceBufferCallback = sourceBufferCallback;
  this.manifestReadyCallback = manifestReadyCallback;
  this.playlistReadyCallback = playlistReadyCallback;
};
cast.player.common.StreamingProtocol.prototype.getStreamCount = function() {
  return this.adaptations.length;
};
goog.exportSymbol("cast.player.common.StreamingProtocol.prototype.getStreamCount", cast.player.common.StreamingProtocol.prototype.getStreamCount);
cast.player.common.StreamingProtocol.prototype.enableStream = function(streamIndex, enabled) {
  this.adaptations[streamIndex].enabled = enabled;
};
goog.exportSymbol("cast.player.common.StreamingProtocol.prototype.enableStream", cast.player.common.StreamingProtocol.prototype.enableStream);
cast.player.common.StreamingProtocol.prototype.isStreamEnabled = function(streamIndex) {
  return this.adaptations[streamIndex].enabled;
};
goog.exportSymbol("cast.player.common.StreamingProtocol.prototype.isStreamEnabled", cast.player.common.StreamingProtocol.prototype.isStreamEnabled);
cast.player.common.StreamingProtocol.prototype.setQualityLevel = function(streamIndex, qualityLevel, qualitySetCallback) {
  var adaptation = this.adaptations[streamIndex];
  adaptation.qualityLevel = qualityLevel;
  adaptation.type !== cast.player.common.StreamType.TEXT && (adaptation.needInit = !0);
  qualitySetCallback.onQualitySet();
};
cast.player.common.StreamingProtocol.prototype.getQualityLevel = function(streamIndex, opt_bitrate) {
  var adaptation = this.adaptations[streamIndex];
  if (void 0 === opt_bitrate) {
    return adaptation.qualityLevel;
  }
  for (var bitrate = opt_bitrate, indexBest = 0, deltaBest = Number.MAX_VALUE, i = 0;i < adaptation.representations.length;i++) {
    var representation = adaptation.representations[i];
    if (bitrate >= representation.bitrate) {
      var delta = bitrate - representation.bitrate;
      delta < deltaBest && (indexBest = i, deltaBest = delta);
    }
  }
  return indexBest;
};
goog.exportSymbol("cast.player.common.StreamingProtocol.prototype.getQualityLevel", cast.player.common.StreamingProtocol.prototype.getQualityLevel);
cast.player.common.StreamingProtocol.prototype.getStreamInfo = function(streamIndex) {
  for (var adaptation = this.adaptations[streamIndex], bitrates = [], i = 0;i < adaptation.representations.length;i++) {
    bitrates.push(adaptation.representations[i].bitrate);
  }
  return new cast.player.api.StreamInfo(adaptation.codecs, adaptation.mimeType, bitrates, adaptation.lang);
};
goog.exportSymbol("cast.player.common.StreamingProtocol.prototype.getStreamInfo", cast.player.common.StreamingProtocol.prototype.getStreamInfo);
cast.player.common.StreamingProtocol.prototype.enableStreams = function() {
  for (var audio = !1, video = !1, i = 0;i < this.adaptations.length;i++) {
    var adaptation = this.adaptations[i];
    adaptation.type === cast.player.common.StreamType.AUDIO && (audio ? adaptation.enabled = !1 : audio = adaptation.enabled = !0);
    adaptation.type === cast.player.common.StreamType.VIDEO && (video ? adaptation.enabled = !1 : video = adaptation.enabled = !0);
  }
};
cast.player.common.StreamingProtocol.prototype.getContentProtectionSystems = function() {
  return null;
};
cast.player.common.StreamingProtocol.prototype.updateLicenseRequestInfo = function() {
};
cast.player.common.StreamingProtocol.prototype.getDuration = function() {
  return this.duration;
};
cast.player.common.StreamingProtocol.prototype.seek = function(streamIndex, time) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel], segments = representation.segments;
  time -= representation.timeOffset;
  for (var lastSegment = segments.length - 1, i = lastSegment;0 <= i;i--) {
    if (time >= segments[i].time) {
      if (this.isLive && i >= lastSegment - 1) {
        return adaptation.index = 2 <= lastSegment ? lastSegment - 2 : 0, !0;
      }
      adaptation.index = 0 < i ? i - 1 : 0;
      return!0;
    }
  }
  if (0 < segments.length) {
    return adaptation.index = 0, !0;
  }
  adaptation.index = -1;
  return!1;
};
cast.player.common.StreamingProtocol.prototype.findNextSegment = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel], segments = representation.segments, index = adaptation.index + 1;
  return index < segments.length ? (adaptation.index = index, !0) : !1;
};
cast.player.common.StreamingProtocol.prototype.isEndOfStream = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, index = adaptation.index, representation = adaptation.representations[qualityLevel], segments = representation.segments;
  return!this.isLive && index === segments.length - 1;
};
cast.player.common.StreamingProtocol.prototype.getSegmentTime = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel;
  if (0 <= qualityLevel) {
    var index = adaptation.index;
    if (0 <= index) {
      var representation = adaptation.representations[qualityLevel], segments = representation.segments;
      if (0 < segments.length) {
        return{time:segments[index].time + representation.timeOffset, duration:segments[index].duration};
      }
    }
  }
  return{time:0, duration:0};
};
cast.player.common.StreamingProtocol.prototype.clear = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex];
  adaptation.type !== cast.player.common.StreamType.TEXT && (adaptation.needInit = !0);
  adaptation.index = -1;
};
cast.player.common.StreamingProtocol.prototype.needInitSegment = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex];
  return adaptation.needInit;
};
cast.player.common.StreamingProtocol.prototype.getInitSegment = function() {
  return null;
};
cast.player.common.StreamingProtocol.prototype.updateSegmentRequestInfo = function() {
};
cast.player.common.StreamingProtocol.prototype.processSegment = function() {
};
cast.player.common.StreamingProtocol.prototype.isStreamReady = function() {
  return!0;
};
cast.player.common.LARGEST_INTEGER_NOT_TO_LOSE_PRECISION = 9007199254740992;
cast.player.common.Network = {TIMEOUT:3E4, RETRY_LIMIT:3};
cast.player.common.StreamType = {UNKNOWN:0, AUDIO:1, VIDEO:2, TEXT:3};
cast.player.common.Codec = {MPEG4_AAC_LC:"mp4a.40.2", MPEG4_HE_AAC:"mp4a.40.5", MPEG2_AAC_LC:"mp4a.67", H264_MAIN_PROFILE_40:"avc1.640028"};
cast.player.common.MimeType = {MPEG2_TS:"video/mp2t", MPEG4_AUDIO:"audio/mp4"};
cast.player.common.stringToArray = function(s) {
  for (var array = new Uint8Array(s.length), i = 0;i < s.length;i++) {
    array[i] = s.charCodeAt(i);
  }
  return array;
};
cast.player.common.isAudioOnlyCodec = function(codecs) {
  return 0 > codecs.indexOf(",") && 0 == codecs.indexOf("mp4a.") ? !0 : !1;
};
cast.player.common.logger_ = goog.log.getLogger("cast.player.common");
cast.player.common.warning = function(s) {
  goog.log.warning(cast.player.common.logger_, s);
};
cast.player.common.extractId3Size = function(mediaData) {
  var id3Size = 0;
  4801587 == (mediaData[0] << 16 | mediaData[1] << 8 | mediaData[2]) && (id3Size = 10 + (mediaData[6] << 21 | mediaData[7] << 14 | mediaData[8] << 7 | mediaData[9]));
  return id3Size;
};
cast.player.common.BigPositiveInt = function(value) {
  this.valueStr_ = this.sanitizeValueString_(value);
};
cast.player.common.BigPositiveInt.prototype.sanitizeValueString_ = function(value) {
  for (var firstNonZero = -1, i = 0;i < value.length;i++) {
    var digit = parseInt(value.charAt(i), 10);
    if (isNaN(digit)) {
      throw Error("Invalid positive base 10 integer string");
    }
    0 > firstNonZero && digit && (firstNonZero = i);
  }
  return value.substr(firstNonZero, value.length);
};
cast.player.common.BigPositiveInt.prototype.toString = function() {
  return this.valueStr_;
};
cast.player.common.BigPositiveInt.prototype.add_ = function(value) {
  for (var valueStr = value + "", limit = Math.max(valueStr.length, this.valueStr_.length), resultArr = [], carryOver = 0, i = 0;i < limit;i++) {
    var digit1 = i < valueStr.length ? valueStr.charAt(valueStr.length - 1 - i) : "0", digit2 = i < this.valueStr_.length ? this.valueStr_.charAt(this.valueStr_.length - 1 - i) : "0", digitAddition = carryOver + parseInt(digit1, 10) + parseInt(digit2, 10);
    10 <= digitAddition ? (carryOver = 1, digitAddition -= 10) : carryOver = 0;
    resultArr.push(digitAddition);
  }
  for (var result = 0 < carryOver ? "1" : "", i = resultArr.length - 1;0 <= i;i--) {
    result += resultArr[i];
  }
  return result;
};
cast.player.common.BigPositiveInt.prototype.add = function(value) {
  if (0 > value || Math.floor(value) != value) {
    throw Error("Value must be a positive integer");
  }
  this.valueStr_ = this.add_(value);
};
cast.player.common.BigPositiveInt.prototype.verifyIsSmaller_ = function(value) {
  if (value.valueStr_.length < this.valueStr_.length) {
    return!0;
  }
  if (value.valueStr_.length > this.valueStr_.length) {
    return!1;
  }
  for (var i = 0;i < value.valueStr_.length;i++) {
    var currentDigit = parseInt(this.valueStr_.charAt(i), 10), newDigit = parseInt(value.valueStr_.charAt(i), 10);
    if (currentDigit < newDigit) {
      return!1;
    }
    if (currentDigit > newDigit) {
      break;
    }
  }
  return!0;
};
cast.player.common.BigPositiveInt.prototype.difference = function(value) {
  if (this.valueStr_ == value.valueStr_) {
    return 0;
  }
  if (!this.verifyIsSmaller_(value)) {
    throw Error("Value must be smaller than the current value");
  }
  for (var result = 0, carryOver = 0, multiplier = 1, i = 0;i < this.valueStr_.length;i++) {
    var substractDigit = i < value.valueStr_.length ? parseInt(value.valueStr_.charAt(value.valueStr_.length - 1 - i), 10) : 0, substraction = parseInt(this.valueStr_.charAt(this.valueStr_.length - 1 - i), 10) - substractDigit - carryOver, carryOver = 0 > substraction ? 1 : 0, result = result + (carryOver ? 10 + substraction : substraction) * multiplier, multiplier = 10 * multiplier
  }
  if (carryOver) {
    throw Error("Value must be smaller than the current value");
  }
  return result;
};
cast.player.common.getBigPositiveIntFrom64bits = function(dv, pos) {
  if (dv.byteLength < pos + 8) {
    throw Error("Cannot read 64 bits");
  }
  var high32bits = dv.getUint32(pos), low32bits = dv.getUint32(pos + 4), bigInt = new cast.player.common.BigPositiveInt(parseInt(high32bits.toString(16) + "00000000", 16).toString());
  bigInt.add(low32bits);
  return bigInt;
};
cast.player.common.getUint64 = function(dv, pos) {
  var bigLength = cast.player.common.getBigPositiveIntFrom64bits(dv, pos), number = parseInt(bigLength.toString(), 10);
  if (number >= cast.player.common.LARGEST_INTEGER_NOT_TO_LOSE_PRECISION) {
    throw Error("Cannot handle length large than " + cast.player.common.LARGEST_INTEGER_NOT_TO_LOSE_PRECISION);
  }
  return number;
};
cast.player.common.Mp4Box = {};
cast.player.common.Mp4Box.TIME_SCALE = 1E7;
cast.player.common.Mp4Box.UUID_SIZE = 16;
cast.player.common.Mp4Box.AudioObjectType = {MPEG4_AAC:64, MPEG2_AAC_LC:103};
cast.player.common.Mp4Box.TFDT_BOX_ = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
cast.player.common.Mp4Box.getAudioObjectType = function(codecs) {
  return codecs.match(cast.player.common.Codec.MPEG2_AAC_LC) ? cast.player.common.Mp4Box.AudioObjectType.MPEG2_AAC_LC : cast.player.common.Mp4Box.AudioObjectType.MPEG4_AAC;
};
cast.player.common.Mp4Box.addSize_ = function(dv, pos, size) {
  dv.setUint32(pos, size);
};
cast.player.common.Mp4Box.addHeader_ = function(dv, pos, box) {
  for (var i = 0;4 > i;i++) {
    dv.setUint8(pos + 4 + i, box.charCodeAt(i));
  }
  return 8;
};
cast.player.common.Mp4Box.addArray_ = function(a8, pos, blob) {
  a8.set(blob, pos);
  return pos + blob.length;
};
cast.player.common.Mp4Box.addBox_ = function(dv, a8, pos, box, func, opt_rep) {
  var orig_pos = pos;
  pos += cast.player.common.Mp4Box.addHeader_(dv, pos, box);
  pos = func(dv, a8, pos, opt_rep);
  cast.player.common.Mp4Box.addSize_(dv, orig_pos, pos - orig_pos);
  return pos;
};
cast.player.common.Mp4Box.addBlob_ = function(dv$$0, a8$$0, pos$$0, box, blob) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, box, function(dv, a8, pos) {
    return cast.player.common.Mp4Box.addArray_(a8, pos, blob);
  });
};
cast.player.common.Mp4Box.addSmhd_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "smhd", [0, 0, 0, 0, 0, 0, 0, 0]);
};
cast.player.common.Mp4Box.addVmhd_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "vmhd", [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
};
cast.player.common.Mp4Box.addEsds_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "esds", function(dv, a8, pos, rep) {
    var objt = rep.objectType, apd0 = rep.codecPrivateData[0], apd1 = rep.codecPrivateData[1];
    return cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 3, 25, 0, 1, 0, 4, 17, objt, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 2, apd0, apd1, 6, 1, 2]);
  }, rep);
};
cast.player.common.Mp4Box.addAvcC_ = function(dv$$0, a8$$0, pos$$0, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "avcC", function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [1, 77, 64, 30, 255, 225]);
    dv.setUint16(pos, rep.sps.length);
    pos += 2;
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, rep.sps);
    dv.setUint8(pos, 1);
    pos += 1;
    dv.setUint16(pos, rep.pps.length);
    pos += 2;
    return pos = cast.player.common.Mp4Box.addArray_(a8, pos, rep.pps);
  }, rep$$0);
};
cast.player.common.Mp4Box.addMfhd = function(dv, a8, pos, sequenceNumber) {
  var offset = pos;
  pos = cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "mfhd", [0, 0, 0, 0, 0, 0, 0, 0]);
  dv.setUint32(offset + 12, sequenceNumber);
  return pos;
};
cast.player.common.Mp4Box.addTraf = function(dv$$0, a8$$0, pos$$0, sampleDuration, baseMediaDecodeTime, sampleLengths) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "traf", function(dv, a8, pos) {
    pos = cast.player.common.Mp4Box.addTfhd_(dv, a8, pos, sampleDuration);
    pos = cast.player.common.Mp4Box.addTfdt_(dv, a8, pos, baseMediaDecodeTime);
    return pos = cast.player.common.Mp4Box.addTrun_(dv, a8, pos, sampleLengths);
  });
};
cast.player.common.Mp4Box.addTfhd_ = function(dv, a8, pos, sampleDuration) {
  var offset = pos;
  pos = cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "tfhd", [0, 0, 0, 8, 0, 0, 0, 1, 0, 0, 0, 0]);
  var defaultSampleDurationOffset = 16;
  dv.setUint32(offset + defaultSampleDurationOffset, sampleDuration);
  return pos;
};
cast.player.common.Mp4Box.addTfdt_ = function(dv, a8, pos, baseMediaDecodeTime) {
  var offset = pos;
  pos = cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "tfdt", cast.player.common.Mp4Box.TFDT_BOX_);
  dv.setUint32(offset + 12, Math.floor(baseMediaDecodeTime / 4294967296));
  dv.setUint32(offset + 16, baseMediaDecodeTime % 4294967296);
  return pos;
};
cast.player.common.Mp4Box.addTrun_ = function(dv, a8, pos, sampleLengths) {
  var offset = pos;
  pos = cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "trun", [0, 0, 2, 1]);
  dv.setUint32(pos, sampleLengths.length);
  pos += 4;
  for (pos += 4;0 < sampleLengths.length;) {
    var sampleLength = sampleLengths.shift();
    dv.setUint32(pos, sampleLength);
    pos += 4;
  }
  cast.player.common.Mp4Box.addSize_(dv, offset, pos - offset);
  return pos;
};
cast.player.common.Mp4Box.rotate_ = function(a8, start, end) {
  for (var len = end - start + 1, tmp = 0, i = start;i < start + len / 2;i++) {
    tmp = a8[i], a8[i] = a8[end - i + start], a8[end - i + start] = tmp;
  }
};
cast.player.common.Mp4Box.getNewKID_ = function(a8) {
  var ab = new ArrayBuffer(a8.length), a82 = new Uint8Array(ab);
  a82.set(a8);
  cast.player.common.Mp4Box.rotate_(a82, 0, 3);
  cast.player.common.Mp4Box.rotate_(a82, 4, 5);
  cast.player.common.Mp4Box.rotate_(a82, 6, 7);
  return a82;
};
cast.player.common.Mp4Box.addTenc_ = function(dv$$0, a8$$0, pos$$0, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "tenc", function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0, 0, 1]);
    dv.setUint8(pos, rep.protection.ivSize);
    pos++;
    var newKid = cast.player.common.Mp4Box.getNewKID_(rep.protection.kid);
    return pos = cast.player.common.Mp4Box.addArray_(a8, pos, newKid);
  }, rep$$0);
};
cast.player.common.Mp4Box.addSchi_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "schi", function(dv, a8, pos, opt_rep) {
    opt_rep && (pos = cast.player.common.Mp4Box.addTenc_(dv, a8, pos, opt_rep));
    return pos;
  }, rep);
};
cast.player.common.Mp4Box.addSchm_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "schm", [0, 0, 0, 0, 99, 101, 110, 99, 0, 1, 0, 0]);
};
cast.player.common.Mp4Box.addFrma_ = function(dv, a8, pos, rep) {
  return rep.type === cast.player.common.StreamType.VIDEO ? cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "frma", [97, 118, 99, 49]) : cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "frma", [109, 112, 52, 97]);
};
cast.player.common.Mp4Box.addSinf_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "sinf", function(dv, a8, pos) {
    pos = cast.player.common.Mp4Box.addFrma_(dv, a8, pos, rep);
    pos = cast.player.common.Mp4Box.addSchm_(dv, a8, pos);
    return pos = cast.player.common.Mp4Box.addSchi_(dv, a8, pos, rep);
  }, rep);
};
cast.player.common.Mp4Box.addA_ = function(dv$$0, a8$$0, pos$$0, box, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, box, function(dv, a8, pos, rep) {
    var asr0 = rep.sampleRate >> 8 & 255, asr1 = rep.sampleRate & 255;
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 16, 0, 0, 0, 0, asr0, asr1, 0, 0]);
    pos = cast.player.common.Mp4Box.addEsds_(dv, a8, pos, rep);
    "enca" === box && (pos = cast.player.common.Mp4Box.addSinf_(dv, a8, pos, rep));
    return pos;
  }, rep$$0);
};
cast.player.common.Mp4Box.addV_ = function(dv$$0, a8$$0, pos$$0, box, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, box, function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    dv.setUint16(pos, rep.width);
    pos += 2;
    dv.setUint16(pos, rep.height);
    pos += 2;
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 255, 255]);
    pos = cast.player.common.Mp4Box.addAvcC_(dv, a8, pos, rep);
    "encv" === box && (pos = cast.player.common.Mp4Box.addSinf_(dv, a8, pos, rep));
    return pos;
  }, rep$$0);
};
cast.player.common.Mp4Box.addStsd_ = function(dv$$0, a8$$0, pos$$0, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "stsd", function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0, 0, 0, 1]);
    rep.type === cast.player.common.StreamType.VIDEO ? (rep.protection && (pos = cast.player.common.Mp4Box.addV_(dv, a8, pos, "encv", rep)), pos = cast.player.common.Mp4Box.addV_(dv, a8, pos, "avc1", rep)) : (rep.protection && (pos = cast.player.common.Mp4Box.addA_(dv, a8, pos, "enca", rep)), pos = cast.player.common.Mp4Box.addA_(dv, a8, pos, "mp4a", rep));
    return pos;
  }, rep$$0);
};
cast.player.common.Mp4Box.addStbl_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "stbl", function(dv, a8, pos, opt_rep) {
    opt_rep && (pos = cast.player.common.Mp4Box.addStsd_(dv, a8, pos, rep), pos = opt_rep.type === cast.player.common.StreamType.VIDEO ? cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 16, 115, 116, 116, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 115, 116, 115, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 115, 116, 99, 111, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 115, 116, 115, 122, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 115, 116, 115, 115, 0, 0, 0, 0, 0, 0, 0, 0]) : cast.player.common.Mp4Box.addArray_(a8, 
    pos, [0, 0, 0, 16, 115, 116, 116, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 115, 116, 115, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 115, 116, 99, 111, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 115, 116, 115, 122, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    return pos;
  }, rep);
};
cast.player.common.Mp4Box.addUrl_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "url ", [0, 0, 0, 1]);
};
cast.player.common.Mp4Box.addDref_ = function(dv$$0, a8$$0, pos$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "dref", function(dv, a8, pos) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0, 0, 0, 1]);
    return cast.player.common.Mp4Box.addUrl_(dv, a8, pos);
  });
};
cast.player.common.Mp4Box.addDinf_ = function(dv$$0, a8$$0, pos$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "dinf", function(dv, a8, pos) {
    return cast.player.common.Mp4Box.addDref_(dv, a8, pos);
  });
};
cast.player.common.Mp4Box.addMinf_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "minf", function(dv, a8, pos, opt_rep) {
    if (opt_rep) {
      return pos = cast.player.common.Mp4Box.addDinf_(dv, a8, pos), pos = cast.player.common.Mp4Box.addStbl_(dv, a8, pos, rep), pos = opt_rep.type === cast.player.common.StreamType.VIDEO ? cast.player.common.Mp4Box.addVmhd_(dv, a8, pos) : cast.player.common.Mp4Box.addSmhd_(dv, a8, pos);
    }
  }, rep);
};
cast.player.common.Mp4Box.addHdlr_ = function(dv, a8, pos, rep) {
  return rep.type === cast.player.common.StreamType.VIDEO ? cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "hdlr", [0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101, 114, 0]) : cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "hdlr", [0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0]);
};
cast.player.common.Mp4Box.addMdhd_ = function(dv, a8, pos) {
  var offset = pos;
  pos = cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "mdhd", [0, 0, 0, 0, 204, 96, 118, 241, 204, 96, 118, 241, 0, 0, 0, 0, 0, 0, 0, 0, 85, 196, 0, 0]);
  var timeScaleOffset = 20;
  dv.setUint32(offset + timeScaleOffset, cast.player.common.Mp4Box.TIME_SCALE);
  return pos;
};
cast.player.common.Mp4Box.addMdia_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "mdia", function(dv, a8, pos, opt_rep) {
    if (opt_rep) {
      return pos = cast.player.common.Mp4Box.addMdhd_(dv, a8, pos), pos = cast.player.common.Mp4Box.addHdlr_(dv, a8, pos, opt_rep), pos = cast.player.common.Mp4Box.addMinf_(dv, a8, pos, opt_rep);
    }
  }, rep);
};
cast.player.common.Mp4Box.addTkhd_ = function(dv$$0, a8$$0, pos$$0, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "tkhd", function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 3, 204, 96, 118, 241, 204, 96, 118, 241, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0]);
    dv.setUint32(pos, rep.width);
    pos += 4;
    dv.setUint32(pos, rep.height);
    pos += 4;
    dv.setUint16(pos, 0);
    return pos += 2;
  }, rep$$0);
};
cast.player.common.Mp4Box.addTrak_ = function(dv$$0, a8$$0, pos$$0, rep) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "trak", function(dv, a8, pos, opt_rep) {
    opt_rep && (pos = cast.player.common.Mp4Box.addTkhd_(dv, a8, pos, opt_rep), pos = cast.player.common.Mp4Box.addMdia_(dv, a8, pos, opt_rep));
    return pos;
  }, rep);
};
cast.player.common.Mp4Box.addTrex_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "trex", [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
};
cast.player.common.Mp4Box.addMvex_ = function(dv$$0, a8$$0, pos$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "mvex", function(dv, a8, pos) {
    return pos = cast.player.common.Mp4Box.addTrex_(dv, a8, pos);
  });
};
cast.player.common.Mp4Box.addPssh_ = function(dv$$0, a8$$0, pos$$0, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "pssh", function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0]);
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, rep.protection.systemId);
    dv.setUint32(pos, rep.protection.header.length);
    pos += 4;
    return pos = cast.player.common.Mp4Box.addArray_(a8, pos, rep.protection.header);
  }, rep$$0);
};
cast.player.common.Mp4Box.addMvhd_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "mvhd", [0, 0, 0, 0, 204, 96, 118, 241, 204, 96, 118, 241, 0, 152, 150, 128, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);
};
cast.player.common.Mp4Box.addMoov_ = function(dv$$0, a8$$0, pos$$0, rep$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "moov", function(dv, a8, pos, rep) {
    pos = cast.player.common.Mp4Box.addMvhd_(dv, a8, pos);
    rep.protection && (pos = cast.player.common.Mp4Box.addPssh_(dv, a8, pos, rep));
    pos = cast.player.common.Mp4Box.addMvex_(dv, a8, pos);
    return pos = cast.player.common.Mp4Box.addTrak_(dv, a8, pos, rep);
  }, rep$$0);
};
cast.player.common.Mp4Box.addFtyp_ = function(dv, a8, pos) {
  return cast.player.common.Mp4Box.addBlob_(dv, a8, pos, "ftyp", [100, 97, 115, 104, 0, 0, 0, 0, 105, 115, 111, 54, 97, 118, 99, 49, 109, 112, 52, 49]);
};
cast.player.common.Mp4Box.extractInit_ = function(dv) {
  for (var pos = 0, length = dv.byteLength ? dv.byteLength : dv.buffer.byteLength;pos < length;) {
    var type = dv.getUint32(pos + 4, !1);
    if (1936286840 == type || 1836019558 == type) {
      break;
    }
    pos += dv.getUint32(pos, !1);
  }
  return new Uint8Array(dv.buffer, 0, pos);
};
cast.player.common.Mp4Box.getPositionOfNextSiblingBox_ = function(dv, pos) {
  var size = dv.getUint32(pos), size = 1 == size ? cast.player.common.getUint64(dv, pos + 8) : size;
  return pos += size;
};
cast.player.common.Mp4Box.findBox_ = function(dv, start, box, opt_end) {
  for (var nameInt = 0, pos = start, end = opt_end ? Math.min(opt_end, dv.byteLength) : dv.byteLength, i = 0;4 > i;i++) {
    nameInt <<= 8, nameInt += box.charCodeAt(i);
  }
  for (;pos < end - 4;) {
    if (dv.getUint32(pos + 4, !1) == nameInt) {
      return pos;
    }
    pos = cast.player.common.Mp4Box.getPositionOfNextSiblingBox_(dv, pos);
  }
  return-1;
};
cast.player.common.Mp4Box.findBox = function(dv, start, box) {
  var pos = cast.player.common.Mp4Box.findBox_(dv, start, box);
  return 0 <= pos ? pos : dv.byteLength;
};
cast.player.common.Mp4Box.isUuidMatched_ = function(dv, start, uuid) {
  for (var size = dv.getUint32(start), pos = start + 8, pos = pos + (1 == size ? 8 : 0), uuidDv = new DataView(uuid.buffer, uuid.byteOffset), uuidOffset = 0;uuidOffset < cast.player.common.Mp4Box.UUID_SIZE;) {
    if (dv.getUint32(pos + uuidOffset) != uuidDv.getUint32(uuidOffset)) {
      return!1;
    }
    uuidOffset += 4;
  }
  return uuidOffset >= cast.player.common.Mp4Box.UUID_SIZE;
};
cast.player.common.Mp4Box.findUuidBox = function(dv, start, end, uuid) {
  for (var pos = start;pos < end;) {
    pos = cast.player.common.Mp4Box.findBox_(dv, pos, "uuid", end);
    if (0 > pos || cast.player.common.Mp4Box.isUuidMatched_(dv, pos, uuid)) {
      return pos;
    }
    pos = cast.player.common.Mp4Box.getPositionOfNextSiblingBox_(dv, pos);
  }
  return-1;
};
cast.player.common.Mp4Box.fixTrackId_ = function(dv, start) {
  var pos = cast.player.common.Mp4Box.findBox(dv, start, "traf"), pos = cast.player.common.Mp4Box.findBox(dv, pos + 8, "tfhd");
  dv.setUint32(pos + 12, 1);
};
cast.player.common.Mp4Box.increaseSize_ = function(dv, start, box, size) {
  var pos = cast.player.common.Mp4Box.findBox(dv, start, box), cs = dv.getUint32(pos);
  dv.setUint32(pos, cs + size);
  return pos;
};
cast.player.common.Mp4Box.setSizes = function(dv, size, trunSize) {
  var pos = 0, pos = cast.player.common.Mp4Box.increaseSize_(dv, pos, "moof", size), pos = cast.player.common.Mp4Box.increaseSize_(dv, pos + 8, "traf", size), pos = cast.player.common.Mp4Box.findBox(dv, pos + 8, "trun");
  if (dv.getUint32(pos + 8) & 1) {
    var trunDataOffsetPos = pos + 16;
    dv.setUint32(trunDataOffsetPos, trunSize);
  }
  return pos;
};
cast.player.common.Mp4Box.increaseSizes_ = function(dv, size, trunSize) {
  var pos = 0, pos = cast.player.common.Mp4Box.increaseSize_(dv, pos, "moof", size), pos = cast.player.common.Mp4Box.increaseSize_(dv, pos + 8, "traf", size), pos = cast.player.common.Mp4Box.findBox(dv, pos + 8, "trun");
  if (dv.getUint32(pos + 8) & 1) {
    var trunDataOffsetPos = pos + 16, cs = dv.getUint32(trunDataOffsetPos);
    dv.setUint32(trunDataOffsetPos, cs + trunSize);
  }
  return pos;
};
cast.player.common.Mp4Box.insertTfdt = function(moof, time) {
  var tfdtSize = cast.player.common.Mp4Box.TFDT_BOX_.length + 8, dv = new DataView(moof), isTrunDataOffset, trunExtend, posMdat = cast.player.common.Mp4Box.findBox(dv, 0, "mdat"), posTrun = 0, posTrun = cast.player.common.Mp4Box.findBox(dv, posTrun, "moof"), posTrun = cast.player.common.Mp4Box.findBox(dv, posTrun + 8, "traf"), posTrun = cast.player.common.Mp4Box.findBox(dv, posTrun + 8, "trun");
  0 === (dv.getUint32(posTrun + 8) & 1) ? (isTrunDataOffset = !1, trunExtend = 4) : (isTrunDataOffset = !0, trunExtend = 0);
  var ab = new ArrayBuffer(moof.byteLength + tfdtSize + trunExtend), a82 = new Uint8Array(ab), dv2 = new DataView(ab), pos = 0;
  cast.player.common.Mp4Box.fixTrackId_(dv, 8);
  pos = cast.player.common.Mp4Box.increaseSizes_(dv, tfdtSize + trunExtend, tfdtSize);
  a82.set(new Uint8Array(moof, 0, pos));
  cast.player.common.Mp4Box.addTfdt_(dv2, a82, pos, time);
  var posTrun2 = pos + tfdtSize;
  if (isTrunDataOffset) {
    a82.set(new Uint8Array(moof, pos, moof.byteLength - pos), pos + tfdtSize);
  } else {
    var oldSize = dv.getUint32(posTrun);
    dv2.setUint32(posTrun2, oldSize + 4);
    var oldType = dv.getUint32(posTrun + 4);
    dv2.setUint32(posTrun2 + 4, oldType);
    var flags = dv.getUint32(posTrun + 8);
    dv2.setUint32(posTrun2 + 8, flags | 1);
    var sampleCount = dv.getUint32(posTrun + 12);
    dv2.setUint32(posTrun2 + 12, sampleCount);
    a82.set(new Uint8Array(moof, pos + 16, moof.byteLength - pos - 16), posTrun2 + 20);
  }
  dv2.setUint32(posTrun2 + 16, tfdtSize + trunExtend + posMdat + 8);
  return ab;
};
cast.player.common.Mp4Box.getSampleSizes = function(dv, pos, nSamples, ivSize, subSampleEnc) {
  if (!subSampleEnc) {
    return new Uint8Array(0);
  }
  for (var sizes = new Uint8Array(nSamples), nEntries = 0, entrySize = 0, entryPos = pos, i = 0;i < nSamples;i++) {
    nEntries = dv.getUint16(entryPos + ivSize), entrySize = ivSize + 2 + 6 * nEntries, sizes[i] = entrySize, entryPos += entrySize;
  }
  return sizes;
};
cast.player.common.Mp4Box.addMdatEnc = function(dv$$0, a8$$0, pos$$0, a8samples, a8mdat) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "mdat", function(dv, a8, pos) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, a8samples);
    return pos = cast.player.common.Mp4Box.addArray_(a8, pos, a8mdat);
  });
};
cast.player.common.Mp4Box.addSaio = function(dv$$0, a8$$0, pos$$0) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "saio", function(dv, a8, pos) {
    pos = cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0, 0, 0, 1]);
    var offset = pos + 4 + 8;
    dv.setUint32(pos, offset);
    return pos += 4;
  });
};
cast.player.common.Mp4Box.addSaiz = function(dv$$0, a8$$0, pos$$0, samples, sampleSizes, subSampleEnc, ivSize) {
  return cast.player.common.Mp4Box.addBox_(dv$$0, a8$$0, pos$$0, "saiz", function(dv, a8, pos) {
    pos = subSampleEnc ? cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, 0]) : cast.player.common.Mp4Box.addArray_(a8, pos, [0, 0, 0, 0, ivSize]);
    dv.setUint32(pos, samples);
    pos += 4;
    a8.set(sampleSizes, pos);
    return pos += sampleSizes.length;
  });
};
cast.player.common.Mp4Box.createInit = function(rep) {
  var ab = new ArrayBuffer(2E4), dv = new DataView(ab), a8 = new Uint8Array(ab), pos = cast.player.common.Mp4Box.addMoov_(dv, a8, 0, rep);
  return cast.player.common.Mp4Box.extractInit_(new DataView(ab, 0, pos));
};
cast.player.core = {};
cast.player.core.MediaKeySession = function(host, protocol, initData, keySessionEndedCallback) {
  this.logger_ = goog.log.getLogger("cast.player.core.MediaKeySession");
  this.host_ = host;
  this.protocol_ = protocol;
  this.keySessionEndedCallback_ = keySessionEndedCallback;
  this.onKeyMessageHandler_ = this.onKeyMessage_.bind(this);
  this.initData_ = initData;
  this.sessionId_ = "";
  this.keySystem_ = this.keyType_ = this.mediaElement_ = this.message_ = null;
  this.xhrIo_ = new goog.net.XhrIo;
  this.xhrIo_.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
  goog.events.listen(this.xhrIo_, goog.net.EventType.SUCCESS, this.onXhrSuccess_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.ERROR, this.onXhrError_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onXhrError_, !1, this);
  this.onKeyErrorHandler_ = this.onKeyError_.bind(this);
  this.timeout_ = null;
};
goog.inherits(cast.player.core.MediaKeySession, goog.Disposable);
cast.player.core.MediaKeySession.GENERATEKEY_TIMEOUT_ = 6E4;
cast.player.core.MediaKeySession.XHR_TIMEOUT_ = 18E4;
cast.player.core.MediaKeySession.ProtectionSystems_ = {clearkey:"webkit-org.w3.clearkey", widevine:"com.widevine.alpha", playready:"com.microsoft.playready"};
cast.player.core.MediaKeySession.prototype.extractClearkeyId_ = function() {
  var ab = new ArrayBuffer(this.initData_.length), ui8 = new Uint8Array(ab);
  ui8.set(this.initData_);
  for (var dv = new DataView(ab), pos = 0;pos < ab.byteLength;) {
    var boxSize = dv.getUint32(pos, !1), type = dv.getUint32(pos + 4, !1);
    goog.asserts.assert(1886614376 === type);
    if (1477738184 === dv.getUint32(pos + 12, !1) && 69420633 === dv.getUint32(pos + 16, !1) && 2464609580 === dv.getUint32(pos + 20, !1) && 1558758348 === dv.getUint32(pos + 24, !1)) {
      var size = dv.getUint32(pos + 28, !1);
      goog.asserts.assert(16 === size);
      this.initData_ = new Uint8Array(ab.slice(pos + 32, pos + 32 + size));
      break;
    }
    pos += boxSize;
  }
};
cast.player.core.MediaKeySession.prototype.initKeySystem_ = function() {
  var mimeType = null, i, count = this.protocol_.getStreamCount();
  for (i = 0;i < count;i++) {
    var streamInfo = this.protocol_.getStreamInfo(i);
    0 === streamInfo.mimeType.indexOf("video") && (mimeType = streamInfo.mimeType);
  }
  if (mimeType) {
    var systems = this.protocol_.getContentProtectionSystems();
    for (i = 0;i < systems.length;i++) {
      var s = cast.player.core.MediaKeySession.ProtectionSystems_[systems[i]], canPlay = this.mediaElement_.canPlayType(mimeType, s);
      if (canPlay) {
        this.keyType_ = systems[i];
        this.keySystem_ = s;
        break;
      }
    }
    "clearkey" === this.keyType_ && this.extractClearkeyId_();
  }
};
cast.player.core.MediaKeySession.prototype.createSession = function() {
  goog.log.info(this.logger_, "createSession");
  this.mediaElement_ = this.host_.getMediaElement();
  this.mediaElement_.addEventListener("webkitkeymessage", this.onKeyMessageHandler_, !1);
  this.mediaElement_.addEventListener("webkitkeyerror", this.onKeyErrorHandler_, !1);
  this.initKeySystem_();
  if (this.keySystem_) {
    var initData, customData = this.host_.getLicenseCustomData();
    if (customData) {
      var i, j, array = new ArrayBuffer(this.initData_.length + 24 + customData.length);
      initData = new Uint8Array(array);
      var dv = new DataView(array);
      for (i = 0;i < this.initData_.length;i++) {
        initData[i] = this.initData_[i];
      }
      dv.setUint32(i, 24 + customData.length);
      i += 4;
      initData[i++] = 117;
      initData[i++] = 117;
      initData[i++] = 105;
      initData[i++] = 100;
      var systemId = [43, 248, 102, 128, 198, 229, 78, 36, 190, 35, 15, 129, 90, 96, 110, 178];
      for (j = 0;16 > j;++j) {
        initData[i++] = systemId[j];
      }
      for (j = 0;j < customData.length;++j) {
        initData[i++] = customData.charCodeAt(j);
      }
    } else {
      initData = this.initData_;
    }
    this.mediaElement_.webkitGenerateKeyRequest(this.keySystem_, initData);
    this.timeout_ = setTimeout(this.onTimeout_.bind(this), cast.player.core.MediaKeySession.GENERATEKEY_TIMEOUT_);
  } else {
    this.keySessionEndedCallback_.onKeySessionEnded(this, !1);
  }
};
cast.player.core.MediaKeySession.prototype.onTimeout_ = function() {
  goog.log.info(this.logger_, "onTimeout_");
  this.keySessionEndedCallback_.onKeySessionEnded(this, !0);
  this.timeout_ = null;
};
cast.player.core.MediaKeySession.prototype.disposeInternal = function() {
  this.mediaElement_ && (this.mediaElement_.removeEventListener("webkitkeymessage", this.onKeyMessageHandler_, !1), this.mediaElement_.removeEventListener("webkitkeyerror", this.onKeyErrorHandler_, !1));
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.SUCCESS, this.onXhrSuccess_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.ERROR, this.onXhrError_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onXhrError_, !1, this);
  this.xhrIo_.dispose();
  null !== this.timeout_ && (clearTimeout(this.timeout_), this.timeout_ = null);
  this.host_ = null;
  cast.player.core.MediaKeySession.superClass_.disposeInternal.call(this);
};
cast.player.core.MediaKeySession.prototype.onXhrSuccess_ = function(e) {
  goog.log.info(this.logger_, "onXhrSuccess_");
  var response = e.target.getResponse(), data = new Uint8Array(response), data = this.host_.processLicense(data);
  this.mediaElement_.webkitAddKey(this.keySystem_, data, this.initData_, this.sessionId_);
  this.keySessionEndedCallback_.onKeySessionEnded(this, !0);
};
cast.player.core.MediaKeySession.prototype.onXhrError_ = function() {
  goog.log.info(this.logger_, "onXhrError_");
  this.keySessionEndedCallback_.onKeySessionEnded(this, !1);
};
cast.player.core.MediaKeySession.prototype.onKeyMessage_ = function(e) {
  goog.log.info(this.logger_, "onKeyMessage_");
  this.host_ && (goog.asserts.assert(!this.sessionId_), goog.asserts.assert(!this.message_), null !== this.timeout_ && (clearTimeout(this.timeout_), this.timeout_ = null), this.sessionId_ = e.sessionId, this.message_ = e.message, this.host_.prepareLicenseRequest() && this.startLicenseRequest());
};
cast.player.core.MediaKeySession.prototype.onKeyError_ = function() {
  goog.log.info(this.logger_, "onKeyError_");
  if (this.host_) {
    this.keySessionEndedCallback_.onKeySessionEnded(this, !1);
  }
};
cast.player.core.MediaKeySession.prototype.startLicenseRequest = function() {
  var requestInfo = new cast.player.api.RequestInfo;
  requestInfo.timeoutInterval = cast.player.core.MediaKeySession.XHR_TIMEOUT_;
  requestInfo.protectionSystem = this.keyType_;
  requestInfo.content = this.message_;
  this.protocol_.updateLicenseRequestInfo(requestInfo);
  this.host_.updateLicenseRequestInfo(requestInfo);
  this.xhrIo_.setWithCredentials(requestInfo.withCredentials);
  this.xhrIo_.setTimeoutInterval(requestInfo.timeoutInterval);
  this.xhrIo_.send(requestInfo.url, "POST", requestInfo.content, requestInfo.headers);
};
cast.player.core.KeySessionEndedCallback = function() {
};
goog.exportSymbol("cast.player.core.KeySessionEndedCallback", cast.player.core.KeySessionEndedCallback);
cast.player.core.KeySessionEndedCallback.prototype.onKeySessionEnded = function() {
};
cast.player.core.MediaKeysManager = function(host, protocol) {
  this.logger_ = goog.log.getLogger("cast.player.core.MediaKeysManager");
  this.host_ = host;
  this.protocol_ = protocol;
  this.sessions_ = new goog.structs.Queue;
  this.onNeedKeyHandler_ = this.onNeedKey_.bind(this);
  this.mediaElement_ = this.host_.getMediaElement();
  this.mediaElement_.addEventListener("webkitneedkey", this.onNeedKeyHandler_, !1);
};
goog.inherits(cast.player.core.MediaKeysManager, goog.Disposable);
cast.player.core.MediaKeysManager.prototype.disposeInternal = function() {
  this.mediaElement_.removeEventListener("webkitneedkey", this.onNeedKeyHandler_, !1);
  this.reset();
  cast.player.core.MediaKeysManager.superClass_.disposeInternal.call(this);
};
cast.player.core.MediaKeysManager.prototype.reset = function() {
  for (var values = this.sessions_.getValues(), i = 0;i < values.length;i++) {
    values[i].dispose();
  }
  this.sessions_.clear();
};
cast.player.core.MediaKeysManager.prototype.onKeySessionEnded = function(session, status) {
  goog.asserts.assert(this.sessions_.peek() === session);
  this.sessions_.dequeue();
  session.dispose();
  goog.log.info(this.logger_, "onKeySessionEnded: " + this.sessions_.getCount());
  if (status) {
    this.sessions_.isEmpty() || (session = this.sessions_.peek(), session.createSession());
  } else {
    this.host_.onError(cast.player.api.ErrorCode.MEDIAKEYS);
  }
};
cast.player.core.MediaKeysManager.prototype.onNeedKey_ = function(e) {
  var session = new cast.player.core.MediaKeySession(this.host_, this.protocol_, e.initData, this);
  this.sessions_.enqueue(session);
  goog.log.info(this.logger_, "onNeedKey_: " + this.sessions_.getCount());
  1 == this.sessions_.getCount() && session.createSession();
};
cast.player.core.MediaKeysManager.prototype.startLicenseRequest = function() {
  var session = this.sessions_.peek();
  session.startLicenseRequest();
};
cast.player.core.QualityManager = function(host, protocol, streamIndex, qualitySetCallback) {
  this.logger_ = goog.log.getLogger("cast.player.core.QualityManager");
  this.host_ = host;
  this.protocol_ = protocol;
  this.streamIndex_ = streamIndex;
  this.qualitySetCallback_ = qualitySetCallback;
  this.qualityLevel_ = protocol.getQualityLevel(this.streamIndex_, host.initialBandwidth);
  this.recalcCounter_ = this.counter_ = this.bitrate_ = this.bitrateLow_ = this.bitrateHigh_ = 0;
  this.qualityChanging_ = !1;
};
cast.player.core.QualityManager.prototype.onQualitySet = function() {
  this.qualityChanging_ = !1;
  this.qualitySetCallback_.onQualitySet();
};
cast.player.core.QualityManager.prototype.qualityChanging = function() {
  return this.qualityChanging_;
};
cast.player.core.QualityManager.prototype.trackError = function() {
  this.bitrateLow_ = this.bitrateHigh_ = this.bitrate_;
  this.counter_ = this.bitrate_ = 0;
  this.recalcCounter_ = cast.player.core.QualityManager.RECALC_COUNT_;
};
cast.player.core.QualityManager.prototype.trackSuccess = function() {
  this.counter_ = this.bitrate_ = 0;
  this.recalcCounter_++;
};
cast.player.core.QualityManager.RECALC_COUNT_ = 3;
cast.player.core.QualityManager.Coefficient_ = {HIGH:0.9, LOW:0.6};
cast.player.core.QualityManager.prototype.trackProgress = function(time, size) {
  var bitrate = 8E3 * size / time;
  this.counter_++;
  this.bitrate_ = (bitrate + this.bitrate_) / this.counter_;
  this.bitrateHigh_ = cast.player.core.QualityManager.Coefficient_.HIGH * bitrate + (1 - cast.player.core.QualityManager.Coefficient_.HIGH) * this.bitrateHigh_;
  this.bitrateLow_ = cast.player.core.QualityManager.Coefficient_.LOW * bitrate + (1 - cast.player.core.QualityManager.Coefficient_.LOW) * this.bitrateLow_;
  this.host_.trackBandwidth(this.streamIndex_, time, size);
};
cast.player.core.QualityManager.prototype.updateQualityLevel = function() {
  var qualityUpdated = !1;
  if (this.recalcCounter_ >= cast.player.core.QualityManager.RECALC_COUNT_) {
    var bitrate = 0.7 * Math.min(this.bitrateHigh_, this.bitrateLow_);
    goog.log.info(this.logger_, this.streamIndex_ + ": bitrate " + bitrate);
    this.qualityLevel_ = this.protocol_.getQualityLevel(this.streamIndex_, bitrate);
    this.recalcCounter_ = 0;
  }
  var qualityLevel = this.protocol_.getQualityLevel(this.streamIndex_);
  this.qualityLevel_ = this.host_.getQualityLevel(this.streamIndex_, this.qualityLevel_);
  if (qualityLevel !== this.qualityLevel_) {
    var bitrates = this.protocol_.getStreamInfo(this.streamIndex_).bitrates;
    goog.log.info(this.logger_, this.streamIndex_ + ": from " + bitrates[qualityLevel] + " to " + bitrates[this.qualityLevel_]);
    this.qualityChanging_ = !0;
    this.protocol_.setQualityLevel(this.streamIndex_, this.qualityLevel_, this);
    qualityUpdated = !0;
  }
  return qualityUpdated;
};
cast.player.core.BufferReadyCallback = function() {
};
cast.player.core.BufferReadyCallback.prototype.onBufferReady = function() {
};
cast.player.core.SourceBufferManager = function(streamIndex, streamInfo, mediaSource, bufferReadyCallback) {
  goog.Disposable.call(this);
  this.logger_ = goog.log.getLogger("cast.player.core.SourceBufferManager");
  this.bufferReadyCallback_ = bufferReadyCallback;
  this.mediaSource_ = mediaSource;
  this.streamIndex_ = streamIndex;
  this.updating_ = !1;
  this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(streamInfo.mimeType + '; codecs="' + streamInfo.codecs + '"');
  this.onUpdateEndHandler_ = this.onUpdateEnd_.bind(this);
  this.sourceBuffer_.addEventListener("updateend", this.onUpdateEndHandler_, !1);
};
goog.inherits(cast.player.core.SourceBufferManager, goog.Disposable);
cast.player.core.SourceBufferManager.prototype.disposeInternal = function() {
  this.sourceBuffer_.removeEventListener("updateend", this.onUpdateEndHandler_, !1);
  "closed" !== this.mediaSource_.readyState && this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
  cast.player.core.SourceBufferManager.superClass_.disposeInternal.call(this);
};
cast.player.core.SourceBufferManager.prototype.clear = function() {
  this.abort();
};
cast.player.core.SourceBufferManager.prototype.updating = function() {
  return this.updating_;
};
cast.player.core.SourceBufferManager.prototype.getSourceBuffer = function() {
  return this.sourceBuffer_;
};
cast.player.core.SourceBufferManager.prototype.onUpdateEnd_ = function() {
  for (var buffered = this.sourceBuffer_.buffered, i = 0;i < buffered.length;i++) {
    goog.log.info(this.logger_, this.streamIndex_ + ": " + buffered.start(i) + " - " + buffered.end(i));
  }
  goog.log.info(this.logger_, this.streamIndex_ + ": updateend");
  this.updating_ = !1;
  this.bufferReadyCallback_.onBufferReady();
};
cast.player.core.SourceBufferManager.prototype.append = function(data, timeOffset) {
  goog.asserts.assert(!this.sourceBuffer_.updating);
  this.sourceBuffer_.timestampOffset != timeOffset && (this.abort(), this.sourceBuffer_.timestampOffset = timeOffset);
  goog.log.info(this.logger_, this.streamIndex_ + ": append");
  this.sourceBuffer_.appendBuffer(data);
  this.updating_ = !0;
};
cast.player.core.SourceBufferManager.prototype.abort = function() {
  goog.log.info(this.logger_, this.streamIndex_ + ": abort");
  this.sourceBuffer_.abort();
};
cast.player.core.TtmlParser = function() {
  this.frameRate_ = 24;
};
cast.player.core.TtmlParser.findNode_ = function(nodeList, name) {
  for (var i = 0;i < nodeList.length;i++) {
    if (nodeList[i].localName === name) {
      return nodeList[i];
    }
  }
  return null;
};
cast.player.core.TtmlParser.prototype.convertToSeconds_ = function(time) {
  var values = time.split(":"), seconds = 3600 * parseInt(values[0], 10) + 60 * parseInt(values[1], 10) + parseFloat(values[2]);
  4 === values.length && (seconds += parseInt(values[3], 10) / this.frameRate_);
  return seconds;
};
cast.player.core.TtmlParser.getNodeText_ = function(node) {
  for (var text = "", nodeList = node.childNodes, i = 0;i < nodeList.length;i++) {
    var childNode = nodeList[i];
    childNode.nodeType === Node.TEXT_NODE ? childNode.textContent.match(/^[\n|\r|\s]*$/) || (text += childNode.textContent) : "span" === childNode.localName ? text += cast.player.core.TtmlParser.getNodeText_(childNode) : "br" === childNode.localName && (text += "\n");
  }
  return text;
};
cast.player.core.TtmlParser.prototype.parse = function(text, timeOffset) {
  var cues = [], parser = new DOMParser, dom = parser.parseFromString(text, "text/xml"), tt = cast.player.core.TtmlParser.findNode_(dom.childNodes, "tt");
  if (tt) {
    var frameRateAttribute = tt.attributes.getNamedItem("ttp:frameRate");
    frameRateAttribute && (this.frameRate_ = parseInt(frameRateAttribute.value, 10));
    var body = cast.player.core.TtmlParser.findNode_(tt.childNodes, "body");
    if (body) {
      var div = cast.player.core.TtmlParser.findNode_(body.childNodes, "div");
      if (div) {
        for (var i = 0;i < div.childNodes.length;i++) {
          var p = div.childNodes[i];
          if ("p" === p.localName) {
            var begin = null, end = null;
            text = cast.player.core.TtmlParser.getNodeText_(p);
            for (var j = 0;j < p.attributes.length;j++) {
              var attribute = p.attributes[j];
              "begin" === attribute.localName ? begin = this.convertToSeconds_(attribute.value) + timeOffset : "end" === attribute.localName && (end = this.convertToSeconds_(attribute.value) + timeOffset);
            }
            text && null !== begin && null !== end && cues.push(new TextTrackCue(begin, end, text));
          }
        }
      }
    }
  }
  return cues;
};
cast.player.core.WebvttParser = function() {
};
cast.player.core.WebvttParser.DELIMITER = /[\r\n|\r|\n]{2,}/;
cast.player.core.WebvttParser.NEWLINE = /\r\n|\r|\n/;
cast.player.core.WebvttParser.TIME = "([\\d]{2}:?[\\d]{2}:[\\d]{2}.[\\d]{3})";
cast.player.core.WebvttParser.MPEGTS = /MPEGTS:([\d]*)/;
cast.player.core.WebvttParser.ALIGN = /align:(start|middle|end)/;
cast.player.core.WebvttParser.POSITION = /position:(\d*)%/;
cast.player.core.WebvttParser.LOCAL = RegExp("LOCAL:" + cast.player.core.WebvttParser.TIME);
cast.player.core.WebvttParser.TIMESTAMPS = RegExp(cast.player.core.WebvttParser.TIME + "[\\t ]+--\x3e[\\t ]+" + cast.player.core.WebvttParser.TIME);
cast.player.core.WebvttParser.prototype.parse = function(text, mediaTimeOffset) {
  for (var entries = text.split(cast.player.core.WebvttParser.DELIMITER), timeOffset = cast.player.core.WebvttParser.parseTimestampMap_(entries[0]) + mediaTimeOffset, textTrackCues = [], i = 1;i < entries.length;i++) {
    var cue = cast.player.core.WebvttParser.parseCue_(entries[i], timeOffset);
    cue && textTrackCues.push(cue);
  }
  return textTrackCues;
};
cast.player.core.WebvttParser.parseTimestampMap_ = function(text) {
  for (var local = 0, mpegts = 0, lines = text.split(cast.player.core.WebvttParser.NEWLINE), i = 0;i < lines.length;i++) {
    if (0 === lines[i].indexOf("X-TIMESTAMP-MAP")) {
      var matches = lines[i].match(cast.player.core.WebvttParser.LOCAL);
      matches && (local = cast.player.core.WebvttParser.parseTime_(matches[1]));
      (matches = lines[i].match(cast.player.core.WebvttParser.MPEGTS)) && (mpegts = parseInt(matches[1], 10) / 9E4);
      break;
    }
  }
  return mpegts - local;
};
cast.player.core.WebvttParser.parseCue_ = function(text, timeOffset) {
  var timestamps = null, align = null, position = null, lines = text.split(cast.player.core.WebvttParser.NEWLINE), i;
  for (i = 0;i < lines.length;i++) {
    if (timestamps = lines[i].match(cast.player.core.WebvttParser.TIMESTAMPS)) {
      align = lines[i].match(cast.player.core.WebvttParser.ALIGN);
      position = lines[i].match(cast.player.core.WebvttParser.POSITION);
      break;
    }
  }
  if (!timestamps) {
    return null;
  }
  var start = cast.player.core.WebvttParser.parseTime_(timestamps[1]), end = cast.player.core.WebvttParser.parseTime_(timestamps[2]);
  text = lines.slice(i + 1).join("\n");
  var cue = new TextTrackCue(start + timeOffset, end + timeOffset, text);
  align && (cue.align = align[1]);
  position && (cue.position = position[1]);
  return cue;
};
cast.player.core.WebvttParser.parseTime_ = function(text) {
  for (var time = 0, components = text.split(":"), i = 0;i < components.length;i++) {
    time = 60 * time + parseFloat(components[i]);
  }
  return time;
};
cast.player.core.CaptionsParser = function() {
};
cast.player.core.CaptionsParser.prototype.parse = function() {
};
cast.player.core.CaptionsManager = function(host) {
  var mediaElement = host.getMediaElement();
  this.mediaElement_ = mediaElement;
  for (var textTrack = null, textTracks = mediaElement.textTracks, i = 0;i < textTracks.length;i++) {
    if ("captions" === textTracks[i].kind) {
      textTrack = textTracks[i];
      break;
    }
  }
  textTrack || (textTrack = mediaElement.addTextTrack("captions"));
  this.textTrack_ = textTrack;
  this.manifestLoader_ = null;
  this.host_ = host;
  this.parser_ = null;
};
goog.inherits(cast.player.core.CaptionsManager, goog.Disposable);
cast.player.core.CaptionsManager.prototype.disposeInternal = function() {
  this.enableCaptions(!1);
  this.manifestLoader_ && (this.manifestLoader_.dispose(), this.manifestLoader_ = null);
};
cast.player.core.CaptionsManager.prototype.abort = function() {
};
cast.player.core.CaptionsManager.prototype.clear = function() {
  var cues = this.textTrack_.cues;
  if (cues) {
    for (;0 < cues.length;) {
      this.textTrack_.removeCue(cues[0]);
    }
  }
};
cast.player.core.CaptionsManager.prototype.getSourceBuffer = function() {
  return null;
};
cast.player.core.CaptionsManager.prototype.updating = function() {
  return!1;
};
cast.player.core.CaptionsManager.prototype.parse = function(s, timeOffset) {
  for (var cues = this.textTrack_.cues, time = this.mediaElement_.currentTime, removeList = [], i = 0;i < cues.length;i++) {
    var cue = cues[i];
    cue.endTime < time && removeList.push(cue);
  }
  for (i = 0;i < removeList.length;i++) {
    this.textTrack_.removeCue(removeList[i]);
  }
  for (cues = this.parser_.parse(s, timeOffset);0 < cues.length;) {
    this.textTrack_.addCue(cues.pop());
  }
};
cast.player.core.CaptionsManager.prototype.append = function(data, timeOffset) {
  var s = decodeURIComponent(escape(String.fromCharCode.apply(null, data)));
  this.parse(s, timeOffset);
};
cast.player.core.CaptionsManager.WEBVTT = "webvtt";
cast.player.core.CaptionsManager.TTML = "ttml";
cast.player.core.CaptionsManager.prototype.enableCaptions = function(enable, opt_type, opt_url) {
  if (enable) {
    if (this.textTrack_.mode = "showing", this.parser_ || (opt_type === cast.player.core.CaptionsManager.TTML ? this.parser_ = new cast.player.core.TtmlParser : opt_type === cast.player.core.CaptionsManager.WEBVTT && (this.parser_ = new cast.player.core.WebvttParser)), opt_url) {
      this.manifestLoader_ || (this.manifestLoader_ = new cast.player.common.ManifestLoader);
      var requestInfo = new cast.player.api.RequestInfo;
      requestInfo.url = opt_url;
      this.host_.updateCaptionsRequestInfo(requestInfo);
      this.manifestLoader_.load(requestInfo, this);
    }
  } else {
    this.clear(), this.textTrack_.mode = "disabled";
  }
};
cast.player.core.CaptionsManager.prototype.onManifestLoaded = function(response) {
  response && this.parse(response, 0);
};
cast.player.core.BufferManager = function() {
};
cast.player.core.BufferManager.prototype.clear = function() {
};
cast.player.core.BufferManager.prototype.abort = function() {
};
cast.player.core.BufferManager.prototype.updating = function() {
};
cast.player.core.BufferManager.prototype.append = function() {
};
cast.player.core.BufferManager.prototype.getSourceBuffer = function() {
};
cast.player.core.XhrIo = function(onXhrProgress) {
  goog.net.XhrIo.call(this);
  this.xmlHttpRequest_ = null;
  this.onXhrProgress_ = onXhrProgress;
};
goog.inherits(cast.player.core.XhrIo, goog.net.XhrIo);
cast.player.core.XhrIo.prototype.createXhr = function() {
  this.xmlHttpRequest_ && (this.xmlHttpRequest_.onprogress = null);
  this.xmlHttpRequest_ = cast.player.core.XhrIo.superClass_.createXhr.call(this);
  this.xmlHttpRequest_.onprogress = this.onXhrProgress_;
  return this.xmlHttpRequest_;
};
cast.player.core.XhrIo.prototype.disposeInternal = function() {
  this.xmlHttpRequest_ && (this.xmlHttpRequest_.onprogress = null);
  cast.player.core.XhrIo.superClass_.disposeInternal.call(this);
};
cast.player.core.SegmentManager = function(playerCallbacks, host, protocol, streamIndex, mediaSource) {
  goog.Disposable.call(this);
  this.logger_ = goog.log.getLogger("cast.player.core.SegmentManager");
  this.playerCallbacks_ = playerCallbacks;
  this.host_ = host;
  this.protocol_ = protocol;
  this.qualityManager_ = new cast.player.core.QualityManager(host, protocol, streamIndex, this);
  this.streamIndex_ = streamIndex;
  var streamInfo = protocol.getStreamInfo(streamIndex);
  0 === streamInfo.mimeType.indexOf("text") ? (this.bufferManager_ = new cast.player.core.CaptionsManager(host), this.bufferManager_.enableCaptions(!0, streamInfo.codecs)) : this.bufferManager_ = new cast.player.core.SourceBufferManager(streamIndex, streamInfo, mediaSource, this);
  this.state_ = cast.player.core.SegmentManager.State_.ACTIVE;
  this.processing_ = !1;
  this.requestTime_ = 0;
  this.retryQuality_ = !1;
  this.retryCount_ = 0;
  this.processedMediaTime_ = this.pendingSegment_ = null;
  this.requestInfo_ = new cast.player.api.RequestInfo;
  this.deferredData_ = new goog.structs.Queue;
  this.xhrIo_ = new cast.player.core.XhrIo(this.onXhrProgress_.bind(this));
  this.xhrIo_.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
  goog.events.listen(this.xhrIo_, goog.net.EventType.SUCCESS, this.onXhrSuccess_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.ERROR, this.onXhrError_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onXhrError_, !1, this);
};
goog.inherits(cast.player.core.SegmentManager, goog.Disposable);
cast.player.core.SegmentManager.prototype.reset = function() {
  goog.log.info(this.logger_, this.streamIndex_ + ": reset");
  this.state_ = cast.player.core.SegmentManager.State_.ACTIVE;
  this.processing_ = !1;
  this.requestTime_ = 0;
  this.retryQuality_ = !1;
  this.retryCount_ = 0;
  this.processedMediaTime_ = this.pendingSegment_ = null;
  this.xhrIo_.abort();
  this.deferredData_.clear();
  this.bufferManager_.clear();
};
cast.player.core.SegmentManager.State_ = {ERROR:-1, INACTIVE:0, ACTIVE:1, ITERATING:2};
cast.player.core.SegmentManager.prototype.disposeInternal = function() {
  this.bufferManager_.dispose();
  this.deferredData_.clear();
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.SUCCESS, this.onXhrSuccess_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.ERROR, this.onXhrError_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onXhrError_, !1, this);
  this.xhrIo_.dispose();
  cast.player.core.SegmentManager.superClass_.disposeInternal.call(this);
};
cast.player.core.SegmentManager.prototype.getSourceBuffer = function() {
  return this.bufferManager_.getSourceBuffer();
};
cast.player.core.SegmentManager.prototype.isBufferManagerBusy_ = function() {
  return this.bufferManager_.updating() || !this.deferredData_.isEmpty();
};
cast.player.core.SegmentManager.prototype.onXhrSuccess_ = function(e) {
  this.qualityManager_.trackSuccess();
  this.retryCount_ = 0;
  this.retryQuality_ = !1;
  this.isBufferManagerBusy_() ? (goog.log.info(this.logger_, "onXhrSuccess_ " + this.streamIndex_ + ": pending segment"), this.pendingSegment_ = e.target.getResponse()) : this.protocol_.processSegment(this.streamIndex_, e.target.getResponse(), this);
};
cast.player.core.SegmentManager.prototype.onXhrError_ = function() {
  this.processing_ = !1;
  this.qualityManager_.trackError();
  this.qualityManager_.updateQualityLevel() ? (this.retryQuality_ = !0, this.retryCount_ = 0) : (this.retryCount_++, this.retryCount_ > cast.player.common.Network.RETRY_LIMIT && (this.state_ = cast.player.core.SegmentManager.State_.ERROR, this.host_.onError(cast.player.api.ErrorCode.NETWORK, new cast.player.api.RequestStatus(this.requestInfo_.url, this.xhrIo_.getLastErrorCode(), this.xhrIo_.getStatus()))));
};
cast.player.core.SegmentManager.prototype.onXhrProgress_ = function(e) {
  var progressEvent = e;
  this.qualityManager_.trackProgress((new Date).getTime() - this.requestTime_, progressEvent.loaded);
};
cast.player.core.SegmentManager.prototype.getBufferDuration = function(time) {
  if (this.state_ === cast.player.core.SegmentManager.State_.ITERATING && this.processedMediaTime_) {
    var mediaTime = this.processedMediaTime_;
    return mediaTime.time + mediaTime.duration - time;
  }
  return 0;
};
cast.player.core.SegmentManager.prototype.onQualitySet = function() {
  this.abort_();
  this.playerCallbacks_.scheduleTick();
};
cast.player.core.SegmentManager.prototype.onSegmentProcessed = function(data, timeOffset) {
  this.append_(data, timeOffset);
  this.processing_ = !1;
  this.processedMediaTime_ = this.protocol_.getSegmentTime(this.streamIndex_);
  this.playerCallbacks_.scheduleTick();
};
cast.player.core.SegmentManager.prototype.sendRequest_ = function() {
  this.processing_ = !0;
  this.requestTime_ = (new Date).getTime();
  this.protocol_.updateSegmentRequestInfo(this.streamIndex_, this.requestInfo_);
  this.host_.updateSegmentRequestInfo(this.requestInfo_);
  this.requestInfo_.url && (this.xhrIo_.setWithCredentials(this.requestInfo_.withCredentials), this.xhrIo_.setTimeoutInterval(this.requestInfo_.timeoutInterval), this.xhrIo_.send(this.requestInfo_.url, void 0, void 0, this.requestInfo_.headers));
};
cast.player.core.SegmentManager.prototype.active = function() {
  return this.state_ > cast.player.core.SegmentManager.State_.INACTIVE || this.bufferManager_.updating();
};
cast.player.core.SegmentManager.prototype.tick = function(time) {
  goog.asserts.assert(this.active());
  if (!this.processing_ && !this.qualityManager_.qualityChanging()) {
    if (0 < this.retryCount_ || this.retryQuality_) {
      this.sendRequest_();
    } else {
      if (this.state_ === cast.player.core.SegmentManager.State_.ITERATING && this.protocol_.isEndOfStream(this.streamIndex_)) {
        this.state_ = cast.player.core.SegmentManager.State_.INACTIVE;
      } else {
        if (this.qualityManager_.updateQualityLevel(), !this.qualityManager_.qualityChanging()) {
          if (this.protocol_.needInitSegment(this.streamIndex_)) {
            var data = this.protocol_.getInitSegment(this.streamIndex_);
            if (data) {
              this.append_(data, 0);
            } else {
              this.sendRequest_();
              return;
            }
          }
          var iterating;
          this.state_ === cast.player.core.SegmentManager.State_.ITERATING ? iterating = this.protocol_.findNextSegment(this.streamIndex_) : this.protocol_.isStreamReady(this.streamIndex_) ? (goog.log.info(this.logger_, this.streamIndex_ + ": seek " + time), (iterating = this.protocol_.seek(this.streamIndex_, time)) ? (this.state_ = cast.player.core.SegmentManager.State_.ITERATING, this.playerCallbacks_.onStreamSeeked(this.streamIndex_)) : this.state_ = cast.player.core.SegmentManager.State_.INACTIVE) : 
          iterating = !1;
          iterating && this.sendRequest_();
        }
      }
    }
  }
};
cast.player.core.SegmentManager.prototype.appendBuffer_ = function(data, timeOffset) {
  this.bufferManager_.append(data, timeOffset);
  this.playerCallbacks_.processSourceData(data, timeOffset);
};
cast.player.core.SegmentManager.prototype.append_ = function(data, timeOffset) {
  if (this.isBufferManagerBusy_()) {
    var deferred = {data:data, timeOffset:timeOffset, abort:!1};
    this.deferredData_.enqueue(deferred);
    goog.log.info(this.logger_, "append_ " + this.streamIndex_ + ": deferred " + this.deferredData_.getCount());
  } else {
    this.appendBuffer_(data, timeOffset);
  }
};
cast.player.core.SegmentManager.prototype.abort_ = function() {
  if (this.isBufferManagerBusy_()) {
    var deferred = {abort:!0, data:null, timeOffset:0};
    this.deferredData_.enqueue(deferred);
    goog.log.info(this.logger_, "abort " + this.streamIndex_ + ": deferred " + this.deferredData_.getCount());
  } else {
    this.bufferManager_.abort();
  }
};
cast.player.core.SegmentManager.prototype.onBufferReady = function() {
  for (;!this.deferredData_.isEmpty();) {
    var deferred = this.deferredData_.dequeue();
    goog.log.info(this.logger_, "onBufferReady " + this.streamIndex_ + ": deferred " + this.deferredData_.getCount());
    if (deferred.abort) {
      this.bufferManager_.abort();
    } else {
      if (deferred.data) {
        this.appendBuffer_(deferred.data, deferred.timeOffset);
        break;
      }
    }
  }
  this.deferredData_.isEmpty() && this.pendingSegment_ && (goog.log.info(this.logger_, "onBufferReady " + this.streamIndex_ + ": process pending"), this.protocol_.processSegment(this.streamIndex_, this.pendingSegment_, this), this.pendingSegment_ = null);
};
cast.player.core.MediaSourceManager = function(host) {
  this.playerCallbacks_ = this.protocol_ = null;
  this.host_ = host;
  this.segmentManagers_ = [];
  this.mediaSource_ = new MediaSource;
  this.streamCount_ = 0;
};
cast.player.core.MediaSourceManager.prototype.tick = function(streamIndex, time) {
  this.segmentManagers_[streamIndex].tick(time);
};
cast.player.core.MediaSourceManager.prototype.getSourceBuffer = function(streamIndex) {
  return this.segmentManagers_[streamIndex].getSourceBuffer();
};
cast.player.core.MediaSourceManager.prototype.active = function(streamIndex) {
  return this.segmentManagers_[streamIndex] ? this.segmentManagers_[streamIndex].active() : !1;
};
cast.player.core.MediaSourceManager.prototype.getMediaSource = function() {
  return this.mediaSource_;
};
cast.player.core.MediaSourceManager.prototype.getBufferDuration = function(streamIndex, time) {
  return this.segmentManagers_[streamIndex].getBufferDuration(time);
};
cast.player.core.MediaSourceManager.prototype.open = function(playerCallbacks, protocol) {
  this.protocol_ || (this.protocol_ = protocol, this.playerCallbacks_ = playerCallbacks, this.streamCount_ = this.protocol_.getStreamCount(), this.update());
};
cast.player.core.MediaSourceManager.prototype.close = function() {
  for (var i = 0;i < this.streamCount_;i++) {
    this.segmentManagers_[i] && this.segmentManagers_[i].dispose(), this.protocol_.clear(i);
  }
  this.segmentManagers_ = [];
  this.streamCount_ = 0;
  this.protocol_ = null;
};
cast.player.core.MediaSourceManager.prototype.reset = function() {
  for (var i = 0;i < this.streamCount_;i++) {
    this.segmentManagers_[i] && this.segmentManagers_[i].reset();
  }
};
cast.player.core.MediaSourceManager.prototype.update = function() {
  if (this.playerCallbacks_ && this.protocol_) {
    for (var i = 0;i < this.streamCount_;i++) {
      var streamEnabled = this.protocol_.isStreamEnabled(i);
      !streamEnabled && this.segmentManagers_[i] ? (this.segmentManagers_[i].dispose(), this.segmentManagers_[i] = null) : streamEnabled && !this.segmentManagers_[i] && (this.segmentManagers_[i] = new cast.player.core.SegmentManager(this.playerCallbacks_, this.host_, this.protocol_, i, this.mediaSource_));
    }
  }
};
cast.player.dash = {};
cast.player.dash.Data = {};
cast.player.dash.Data.extractInit = function(ab) {
  for (var d = new DataView(ab), pos = 0;pos < ab.byteLength;) {
    var type = d.getUint32(pos + 4, !1);
    if (1936286840 == type || 1836019558 == type) {
      break;
    }
    pos += d.getUint32(pos, !1);
  }
  return new Uint8Array(ab.slice(0, pos));
};
cast.player.dash.Data.parseSIDX = function(ab, ab_first_byte_offset) {
  for (var d = new DataView(ab), pos = 0;1936286840 != d.getUint32(pos + 4, !1);) {
    if (pos += d.getUint32(pos, !1), pos >= ab.byteLength) {
      return null;
    }
  }
  var sidxEnd = d.getUint32(pos, !1) + pos;
  if (sidxEnd > ab.byteLength) {
    return null;
  }
  var version = d.getUint8(pos + 8), pos = pos + 12, timescale = d.getUint32(pos + 4, !1), pos = pos + 8, earliest_presentation_time, first_offset;
  0 == version ? (earliest_presentation_time = d.getUint32(pos, !1), first_offset = d.getUint32(pos + 4, !1), pos += 8) : (earliest_presentation_time = (d.getUint32(pos, !1) << 32) + d.getUint32(pos + 4, !1), first_offset = (d.getUint32(pos + 8, !1) << 32) + d.getUint32(pos + 12, !1), pos += 16);
  first_offset += sidxEnd + (ab_first_byte_offset || 0);
  for (var reference_count = d.getUint16(pos + 2, !1), pos = pos + 4, offset = first_offset, time = earliest_presentation_time, segments = [], i = 0;i < reference_count;i++) {
    var size = d.getUint32(pos, !1) & 2147483647, duration = d.getUint32(pos + 4, !1), segment = {time:time / timescale, duration:duration / timescale, offset:offset, size:size};
    segments.push(segment);
    pos += 12;
    offset += size;
    time += duration;
  }
  return segments;
};
cast.player.dash.Manifest = function(node) {
  this.periods = [];
  for (this.duration = new cast.player.common.NumberValue("mediaPresentationDuration", cast.player.dash.Manifest.parseIsoDate);node && node.nodeType === node.COMMENT_NODE;) {
    node = node.nextElementSibling;
  }
  if (node) {
    cast.player.common.parseAttributes(node.attributes, this);
    for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
      "Period" === child.nodeName && this.periods.push(new cast.player.dash.Manifest.Period(child));
    }
  }
};
cast.player.dash.Manifest.parseIsoDate = function(s) {
  return goog.date.Interval.fromIsoString(s).getTotalSeconds();
};
cast.player.dash.Manifest.RangeValue = function(name) {
  this.name = name;
  this.end = this.start = null;
  this.parse = this.parse_;
};
cast.player.dash.Manifest.RangeValue.prototype.parse_ = function(s) {
  var results = s.split("-");
  this.start = parseInt(results[0], 10);
  this.end = parseInt(results[1], 10);
};
cast.player.dash.Manifest.Segment = function(node) {
  this.media = new cast.player.common.StringValue("media");
  cast.player.common.parseAttributes(node.attributes, this);
};
cast.player.dash.Manifest.Initialization = function(node) {
  this.sourceUrl = new cast.player.common.StringValue("sourceURL");
  this.range = new cast.player.dash.Manifest.RangeValue("range");
  cast.player.common.parseAttributes(node.attributes, this);
};
cast.player.dash.Manifest.SegmentBase = function(node) {
  this.duration = new cast.player.common.NumberValue("duration");
  this.timescale = new cast.player.common.NumberValue("timescale");
  this.timeOffset = new cast.player.common.NumberValue("presentationTimeOffset");
  this.indexRange = new cast.player.dash.Manifest.RangeValue("indexRange");
  cast.player.common.parseAttributes(node.attributes, this);
  this.initialization = null;
  for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
    "Initialization" === child.nodeName && (this.initialization = new cast.player.dash.Manifest.Initialization(child));
  }
};
cast.player.dash.Manifest.SegmentList = function(node) {
  cast.player.dash.Manifest.SegmentBase.call(this, node);
  this.segments = [];
  for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
    "SegmentURL" === child.nodeName && this.segments.push(new cast.player.dash.Manifest.Segment(child));
  }
};
goog.inherits(cast.player.dash.Manifest.SegmentList, cast.player.dash.Manifest.SegmentBase);
cast.player.dash.Manifest.SegmentTemplate = function(node) {
  this.startNumber = new cast.player.common.NumberValue("startNumber");
  this.media = new cast.player.common.StringValue("media");
  this.init = new cast.player.common.StringValue("initialization");
  cast.player.dash.Manifest.SegmentBase.call(this, node);
};
goog.inherits(cast.player.dash.Manifest.SegmentTemplate, cast.player.dash.Manifest.SegmentBase);
cast.player.dash.Manifest.ContentProtection = function(node) {
  this.info = {};
  for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
    if (0 <= child.nodeName.indexOf("SystemURL")) {
      var attribute = child.attributes.getNamedItem("type");
      attribute && goog.object.add(this.info, attribute.value, child.textContent);
    }
  }
};
cast.player.dash.Manifest.Common = function(node) {
  this.mimeType = new cast.player.common.StringValue("mimeType");
  this.codecs = new cast.player.common.StringValue("codecs");
  cast.player.common.parseAttributes(node.attributes, this);
  this.segmentBase = this.segmentTemplate = this.segmentList = this.url = this.protection = null;
  for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
    "BaseURL" === child.nodeName ? this.url = child.textContent : "ContentProtection" === child.nodeName ? this.protection = new cast.player.dash.Manifest.ContentProtection(child) : "SegmentBase" === child.nodeName ? this.segmentBase = new cast.player.dash.Manifest.SegmentBase(child) : "SegmentTemplate" === child.nodeName ? this.segmentTemplate = new cast.player.dash.Manifest.SegmentTemplate(child) : "SegmentList" === child.nodeName && (this.segmentList = new cast.player.dash.Manifest.SegmentList(child))
    ;
  }
};
cast.player.dash.Manifest.Representation = function(node) {
  this.id = new cast.player.common.StringValue("id");
  this.bandwidth = new cast.player.common.NumberValue("bandwidth");
  cast.player.dash.Manifest.Common.call(this, node);
};
goog.inherits(cast.player.dash.Manifest.Representation, cast.player.dash.Manifest.Common);
cast.player.dash.Manifest.Adaptation = function(node) {
  cast.player.dash.Manifest.Common.call(this, node);
  this.representations = [];
  for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
    "Representation" === child.nodeName && this.representations.push(new cast.player.dash.Manifest.Representation(child));
  }
  for (var i = 0;i < this.representations.length;i++) {
    var representation = this.representations[i];
    representation.protection || (representation.protection = this.protection);
    representation.url || (representation.url = this.url);
    representation.segmentList || (representation.segmentList = this.segmentList);
    representation.segmentTemplate || (representation.segmentTemplate = this.segmentTemplate);
    representation.segmentBase || (representation.segmentBase = this.segmentBase);
    representation.mimeType.value || (representation.mimeType = this.mimeType);
    representation.codecs.value || (representation.codecs.value = this.codecs.value);
    "avc1" === representation.codecs.value && (representation.codecs.value = "avc1.4d40");
  }
};
goog.inherits(cast.player.dash.Manifest.Adaptation, cast.player.dash.Manifest.Common);
cast.player.dash.Manifest.Period = function(node) {
  this.start = new cast.player.common.NumberValue("start", cast.player.dash.Manifest.parseIsoDate);
  this.duration = new cast.player.common.NumberValue("duration", cast.player.dash.Manifest.parseIsoDate);
  cast.player.common.parseAttributes(node.attributes, this);
  this.adaptations = [];
  for (var child = node.firstElementChild;null !== child;child = child.nextElementSibling) {
    "AdaptationSet" === child.nodeName && this.adaptations.push(new cast.player.dash.Manifest.Adaptation(child));
  }
};
cast.player.dash.Dash = function(host) {
  cast.player.common.StreamingProtocol.call(this, host);
  this.protection_ = {};
};
goog.inherits(cast.player.dash.Dash, cast.player.common.StreamingProtocol);
cast.player.dash.Dash.prototype.getContentProtectionSystems = function() {
  var systems = [];
  goog.object.forEach(this.protection_, function(url, system) {
    systems.push(system);
  });
  return systems;
};
cast.player.dash.Dash.prototype.updateLicenseRequestInfo = function(requestInfo) {
  if (this.protection_ && requestInfo.protectionSystem) {
    requestInfo.headers = {};
    requestInfo.headers["content-type"] = "text/xml;charset=utf-8";
    var url = goog.object.get(this.protection_, requestInfo.protectionSystem);
    url && (requestInfo.url = url);
  }
};
cast.player.dash.Dash.prototype.normalizeSegmentBase_ = function(segmentBase, representation) {
  var range = segmentBase.indexRange;
  null !== range.start && null !== range.end && (representation.range = {start:range.start, end:range.end});
  var timescale = segmentBase.timescale.value || 1;
  representation.timeOffset = -(segmentBase.timeOffset.value || 0) / timescale;
  var init = segmentBase.initialization;
  if (init) {
    var range = init.range, range = null !== range.start && null !== range.end ? {start:range.start, end:range.end} : null, url = init.sourceUrl.value;
    url && (url = this.resolveUrl(url));
    representation.init = {url:url, range:range};
  }
};
cast.player.dash.Dash.prototype.normalize_ = function(manifest) {
  if (0 !== manifest.periods.length) {
    manifest.duration.value && (this.duration = manifest.duration.value);
    for (var adaptations = manifest.periods[0].adaptations, i = 0;i < adaptations.length;i++) {
      var adaptation = adaptations[i], representations = adaptation.representations, representation = representations[0], isAudio = 0 === representation.mimeType.value.indexOf("audio"), isVideo = 0 === representation.mimeType.value.indexOf("video");
      if (isAudio || isVideo) {
        for (var type = isAudio ? cast.player.common.StreamType.AUDIO : cast.player.common.StreamType.VIDEO, adaptationNew = {type:type, enabled:!1, needInit:!0, index:-1, qualityLevel:-1, representations:[], lang:null, mimeType:representation.mimeType.value || "", codecs:representation.codecs.value || ""}, j = 0;j < representations.length;j++) {
          representation = representations[j];
          representation.protection && goog.object.isEmpty(this.protection_) && (this.protection_ = representation.protection.info);
          var representationNew = {type:type, bitrate:representation.bandwidth.value || 0, id:representation.id.value, timeOffset:0, segments:[], url:this.resolveUrl(representation.url), range:null, init:null, protection:null};
          representation.segmentBase && this.normalizeSegmentBase_(representation.segmentBase, representationNew);
          if (representation.segmentList) {
            var segmentList = representation.segmentList;
            this.normalizeSegmentBase_(segmentList, representationNew);
            for (var time = 0, timescale = segmentList.timescale.value || 1, duration = (segmentList.duration.value || 0) / timescale, segments = segmentList.segments, k = 0;k < segments.length;k++) {
              var segment = {time:time, duration:duration, url:this.resolveUrl(segments[k].media.value)};
              representationNew.segments.push(segment);
              time += duration;
            }
          }
          var segmentTemplate = null;
          if (representation.segmentTemplate) {
            var template = representation.segmentTemplate, timescale = template.timescale.value || 1;
            this.normalizeSegmentBase_(template, representationNew);
            segmentTemplate = {duration:(template.duration.value || 0) / timescale, startNumber:template.startNumber.value || 0, url:this.resolveUrl(template.media.value), init:this.resolveUrl(template.init.value)};
          }
          representationNew.segmentTemplate = segmentTemplate;
          adaptationNew.representations.push(representationNew);
        }
        this.adaptations.push(adaptationNew);
      }
    }
  }
};
cast.player.dash.Dash.prototype.onManifestLoaded = function(response) {
  var manifest = null;
  if (response) {
    var parser = new DOMParser, dom = parser.parseFromString(response, "text/xml"), manifest = new cast.player.dash.Manifest(dom.firstChild)
  }
  if (manifest) {
    this.normalize_(manifest), this.enableStreams(), this.manifestReadyCallback.onManifestReady(), this.playlistReadyCallback.onPlaylistReady();
  } else {
    this.host.onError(cast.player.api.ErrorCode.NETWORK, this.manifestLoader.getRequestStatus());
  }
};
cast.player.dash.Dash.prototype.load = function(manifestReadyCallback, playlistReadyCallback, sourceBufferCallback) {
  cast.player.dash.Dash.superClass_.load.call(this, manifestReadyCallback, playlistReadyCallback, sourceBufferCallback);
  this.manifestLoader.load(this.requestInfo, this);
};
cast.player.dash.Dash.prototype.seek = function(streamIndex, time) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel];
  if (representation.segmentTemplate) {
    var duration = representation.segmentTemplate.duration, index = Math.floor(time / duration), count = Math.ceil(this.duration / duration);
    adaptation.index = index < count ? index : count - 1;
    return!0;
  }
  return cast.player.dash.Dash.superClass_.seek.call(this, streamIndex, time);
};
cast.player.dash.Dash.prototype.findNextSegment = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel];
  if (representation.segmentTemplate) {
    var duration = representation.segmentTemplate.duration, index = adaptation.index + 1, count = Math.ceil(this.duration / duration);
    return index < count ? (adaptation.index = index, !0) : !1;
  }
  return cast.player.dash.Dash.superClass_.findNextSegment.call(this, streamIndex);
};
cast.player.dash.Dash.prototype.isEndOfStream = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel];
  if (representation.segmentTemplate) {
    var duration = representation.segmentTemplate.duration, count = Math.ceil(this.duration / duration);
    return adaptation.index === count - 1;
  }
  return cast.player.dash.Dash.superClass_.isEndOfStream.call(this, streamIndex);
};
cast.player.dash.Dash.prototype.getSegmentTime = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel];
  if (representation.segmentTemplate) {
    var duration = representation.segmentTemplate.duration;
    return{time:adaptation.index * duration, duration:duration};
  }
  return cast.player.dash.Dash.superClass_.getSegmentTime.call(this, streamIndex);
};
cast.player.dash.Dash.prototype.updateSegmentRequestInfo = function(streamIndex, requestInfo) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel], index = adaptation.index;
  if (representation.segmentTemplate) {
    var template = representation.segmentTemplate, url = adaptation.needInit ? template.init : template.url, url = url.replace("$RepresentationID$", representation.id), url = url.replace("$Bandwidth$", representation.bitrate);
    if (!adaptation.needInit) {
      var n = index + template.startNumber, url = url.replace("$Number$", n.toString())
    }
    requestInfo.url = url;
  } else {
    var start = null, end = null, url = null;
    if (adaptation.needInit) {
      var init = representation.init;
      init && (init.range ? (start = init.range.start, end = representation.range.end, url = representation.url) : url = init.url);
    } else {
      if (index < representation.segments.length) {
        var segment = representation.segments[index];
        representation.range ? (start = segment.offset, end = segment.offset + segment.size - 1, url = representation.url) : url = segment.url;
      }
    }
    requestInfo.url = url || "";
    null !== start && null !== end && (requestInfo.headers = {}, requestInfo.headers.Range = "bytes=" + start + "-" + end);
  }
};
cast.player.dash.Dash.prototype.processSegment = function(streamIndex, data, segmentProcessedCallback) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel], processedData, timeOffset;
  adaptation.needInit ? (timeOffset = 0, adaptation.needInit = !1, processedData = cast.player.dash.Data.extractInit(data), !representation.segmentTemplate && representation.init.range && (representation.segments = cast.player.dash.Data.parseSIDX(data, 0) || [])) : (timeOffset = representation.timeOffset, processedData = new Uint8Array(data));
  segmentProcessedCallback.onSegmentProcessed(processedData, timeOffset);
};
cast.player.hls = {};
cast.player.hls.AacParser = function(aacData, codecs) {
  this.logger_ = goog.log.getLogger("cast.player.hls.AacParser");
  this.aacData_ = aacData;
  this.codecs_ = codecs;
  this.estimatedDuration_ = 10;
  this.adtsHeader_ = this.frameQueue_ = null;
};
cast.player.hls.AacParser.SAMPLES_PER_FRAME = 1024;
cast.player.hls.AacParser.MAX_MOOV_SIZE = 700;
cast.player.hls.AacParser.MAX_MOOF_SIZE = 500;
cast.player.hls.AacParser.getSampleRate_ = function(sfIndex) {
  var SAMPLE_RATES = [96E3, 88200, 64E3, 48E3, 44100, 32E3, 24E3, 22050, 16E3, 12E3, 11025, 8E3];
  return sfIndex < SAMPLE_RATES.length ? SAMPLE_RATES[sfIndex] : 0;
};
cast.player.hls.AacParser.prototype.getAdtsHeader_ = function(aacData) {
  var adtsHeader = aacData.subarray(0, 9);
  if (255 != adtsHeader[0] || 240 != (adtsHeader[1] & 240)) {
    return goog.log.error(this.logger_, "Not ADTS header"), null;
  }
  var isCRCPresent = !(adtsHeader[1] & 1), a1 = adtsHeader[3] & 3, a2 = adtsHeader[4], a3 = adtsHeader[5] & 224, adtsSize = (a1 << 11) + (a2 << 3) + (a3 >> 5), sampleRateIndex = adtsHeader[2] >> 2 & 15;
  return{profile:(adtsHeader[2] >> 6 & 3) + 1, sampleRateIndex:sampleRateIndex, sampleRate:cast.player.hls.AacParser.getSampleRate_(sampleRateIndex), channelConfig:(adtsHeader[2] << 2 & 4) + (adtsHeader[3] >> 6 & 3), headerLength:isCRCPresent ? 9 : 7, frameLength:adtsSize};
};
cast.player.hls.AacParser.prototype.createMoof_ = function(dv, a8, pos, sequenceNumber, sampleDuration, baseMediaDecodeTime, frameLengths) {
  var moofOffset = pos;
  pos += 4;
  dv.setUint32(pos, 1836019558);
  pos += 4;
  var trafOffset = pos = cast.player.common.Mp4Box.addMfhd(dv, a8, pos, sequenceNumber);
  pos = cast.player.common.Mp4Box.addTraf(dv, a8, pos, sampleDuration, baseMediaDecodeTime, frameLengths);
  var moofSize = pos - moofOffset;
  moofSize > cast.player.hls.AacParser.MAX_MOOF_SIZE && goog.log.warning(this.logger_, "moof size(" + moofSize + ") exceeded MAX_MOOF_SIZE (" + cast.player.hls.AacParser.MAX_MOOF_SIZE + ")");
  dv.setUint32(moofOffset, moofSize);
  var trunOffset = cast.player.common.Mp4Box.findBox(dv, trafOffset + 8, "trun");
  dv.setUint32(trunOffset + 16, moofSize + 8);
  return pos;
};
cast.player.hls.AacParser.getEsdsData_ = function(adtsHeader, audioObjectType) {
  var representation = {type:cast.player.common.StreamType.AUDIO, url:null, bitrate:0, timeOffset:0, segments:[], range:null, init:null, id:null, protection:null}, apd0 = adtsHeader.profile << 3 | adtsHeader.sampleRateIndex >> 1 & 7, apd1 = adtsHeader.sampleRateIndex << 7 & 128 | adtsHeader.channelConfig << 3 & 120;
  representation.objectType = audioObjectType;
  representation.codecPrivateData = [apd0, apd1];
  return representation;
};
cast.player.hls.AacParser.prototype.createMoov_ = function(dv, a8, pos, adtsHeader) {
  var representation = cast.player.hls.AacParser.getEsdsData_(adtsHeader, cast.player.common.Mp4Box.getAudioObjectType(this.codecs_)), initSegment = cast.player.common.Mp4Box.createInit(representation), moovSize = initSegment.length;
  moovSize > cast.player.hls.AacParser.MAX_MOOV_SIZE && goog.log.warning(this.logger_, "moov size(" + moovSize + ") exceeded MAX_MOOV_SIZE (" + cast.player.hls.AacParser.MAX_MOOV_SIZE + ")");
  a8.set(initSegment, pos);
  return pos + moovSize;
};
cast.player.hls.AacParser.prototype.createMdat_ = function(dv, a8, pos, frameQueue) {
  for (var offset = 0, offset = offset + 8;0 < frameQueue.length;) {
    var frame = frameQueue.shift();
    a8.set(frame, pos + offset);
    offset += frame.length;
  }
  dv.setUint32(pos, offset);
  dv.setUint32(pos + 4, 1835295092);
  return pos + offset;
};
cast.player.hls.AacParser.prototype.extractMetadata = function(metadataHandler) {
  for (var aacData = this.aacData_, frameQueue = [], adtsHeader = null;0 < aacData.length;) {
    var id3Size = cast.player.common.extractId3Size(aacData);
    if (0 < id3Size && (metadataHandler("ID3", aacData.subarray(0, id3Size)), aacData = aacData.subarray(id3Size), 0 == aacData.length)) {
      break;
    }
    adtsHeader = this.getAdtsHeader_(aacData);
    frameQueue.push(aacData.subarray(adtsHeader.headerLength, adtsHeader.frameLength));
    aacData = aacData.subarray(adtsHeader.frameLength);
  }
  this.estimatedDuration_ = adtsHeader ? frameQueue.length * cast.player.hls.AacParser.SAMPLES_PER_FRAME / adtsHeader.sampleRate : 0;
  this.frameQueue_ = frameQueue;
  this.adtsHeader_ = adtsHeader;
};
cast.player.hls.AacParser.getLengthsFromArray_ = function(array) {
  for (var lengthQueue = [], i = 0;i < array.length;i++) {
    lengthQueue.push(array[i].length);
  }
  return lengthQueue;
};
cast.player.hls.AacParser.prototype.buildMp4 = function(referenceTime) {
  if (!this.adtsHeader_) {
    return goog.log.error(this.logger_, "ADTS header is not set"), new Uint8Array(0);
  }
  for (var frameQueue = this.frameQueue_, numFramePerSec = Math.ceil(this.adtsHeader_.sampleRate / cast.player.hls.AacParser.SAMPLES_PER_FRAME), maxFramesPerMdat = 1 * numFramePerSec, estimatedLengthBoxAdded = cast.player.hls.AacParser.MAX_MOOV_SIZE + cast.player.hls.AacParser.MAX_MOOF_SIZE * Math.ceil(frameQueue.length / maxFramesPerMdat), mp4Buffer = new ArrayBuffer(this.aacData_.length + estimatedLengthBoxAdded), a8 = new Uint8Array(mp4Buffer), dv = new DataView(mp4Buffer), pos = 0, pos = this.createMoov_(dv, 
  a8, pos, this.adtsHeader_), numFramePerSec = Math.ceil(this.adtsHeader_.sampleRate / cast.player.hls.AacParser.SAMPLES_PER_FRAME), maxFramesPerMdat = 1 * numFramePerSec, sequenceNumber = 1, baseMediaDecodeTime = Math.floor(referenceTime * cast.player.common.Mp4Box.TIME_SCALE), sampleDuration = Math.ceil(cast.player.hls.AacParser.SAMPLES_PER_FRAME * cast.player.common.Mp4Box.TIME_SCALE / this.adtsHeader_.sampleRate);0 < frameQueue.length;) {
    var frames = frameQueue.splice(0, maxFramesPerMdat), numFrameInMdat = frames.length, frameLengthQueue = cast.player.hls.AacParser.getLengthsFromArray_(frames), pos = this.createMoof_(dv, a8, pos, sequenceNumber, sampleDuration, baseMediaDecodeTime, frameLengthQueue), pos = this.createMdat_(dv, a8, pos, frames);
    sequenceNumber++;
    baseMediaDecodeTime += numFrameInMdat * sampleDuration;
  }
  return a8.subarray(0, pos);
};
cast.player.hls.AacParser.prototype.getStartTiming = function(referenceTime) {
  return referenceTime;
};
cast.player.hls.AacParser.prototype.getEndTiming = function(referenceTime) {
  return referenceTime + this.estimatedDuration_;
};
cast.player.hls.KeySystem = {NONE:0, AES128:1, SAMPLEAES:2};
cast.player.hls.HlsParser = function(baseUri) {
  this.logger_ = goog.log.getLogger("cast.player.hls.HlsParser");
  this.baseUri_ = baseUri;
  this.state_ = cast.player.hls.HlsParser.State_.M3U;
  this.segment_ = cast.player.hls.HlsParser.createSegment_(0, cast.player.hls.KeySystem.NONE, null, null);
  this.isExplicitIv_ = !1;
  this.currentStreamInfTag_ = null;
};
cast.player.hls.HlsParser.createSegment_ = function(sequenceNumber, keySystem, keyUrl, iv) {
  return{sequenceNumber:sequenceNumber, url:"", byterange:null, estimatedMediaTime:0, duration:0, discontinuity:!1, expiration:null, keySystem:keySystem, keyUrl:keyUrl, iv:iv};
};
cast.player.hls.HlsParser.manifestFromString = function(manifestString, baseUri) {
  for (var manifest = {hlsProtocolVersion:-1, isMasterPlaylist:!1, codecs:null, streams:[], isLive:!0, targetDuration:-1, programDateTime:null, hasEosSegment:!1, segments:[], subtitles:[]}, hlsParser = new cast.player.hls.HlsParser(baseUri), lines = manifestString.split("\n"), k = 0;k < lines.length && (manifest = hlsParser.parseOneLine(manifest, lines[k]), null !== manifest);k++) {
  }
  return manifest;
};
cast.player.hls.HlsParser.State_ = {M3U:0, HEADER:1, CONTENT:2, EXTINF_URI:3, STREAMINF_URI:4};
cast.player.hls.HlsParser.Regex_ = {NOT_TAG:"^[^#](.*)", EMPTY_LINE:"^(\\s|\\r)*$", EXTM3U:"^#EXTM3U", STREAM_INF:"^#EXT-X-STREAM-INF:(.*)", VERSION:"^#EXT-X-VERSION:([0-9])", PROGRAM_DATE_TIME:"^#EXT-X-PROGRAM-DATE-TIME:(.*)", TARGET_DURATION:"^#EXT-X-TARGETDURATION:([0-9]+)", MEDIA_SEQUENCE:"^#EXT-X-MEDIA-SEQUENCE:([0-9]+)", KEY:"^#EXT-X-KEY:(.*)", MEDIA:"^#EXT-X-MEDIA:(.*)", EXTINF:"^#EXTINF:([0-9]+(.[0-9]+)?),(.*)", BYTERANGE:"^#EXT-X-BYTERANGE:(.*)", DISCONTINUITY:"^#EXT-X-DISCONTINUITY", ENDLIST:"^#EXT-X-ENDLIST"};
cast.player.hls.HlsParser.prototype.parseOneLine = function(manifest, s) {
  return null !== s.match(cast.player.hls.HlsParser.Regex_.NOT_TAG) ? this.parseUri_(manifest, s) : this.parseTag_(manifest, s);
};
cast.player.hls.HlsParser.prototype.reportUnexpected_ = function(tag) {
  goog.log.warning(this.logger_, "Unexpected " + tag + ": state " + this.state_);
};
cast.player.hls.HlsParser.prototype.parseUri_ = function(manifest, s) {
  if (null !== s.match(cast.player.hls.HlsParser.Regex_.EMPTY_LINE)) {
    return manifest;
  }
  if (this.state_ != cast.player.hls.HlsParser.State_.EXTINF_URI && this.state_ != cast.player.hls.HlsParser.State_.STREAMINF_URI) {
    return this.reportUnexpected_("URI"), null;
  }
  var uri = s.replace(/(\r)/gm, "");
  uri.match(/^(?:[a-z]+:)?\/\//) || (uri = goog.Uri.resolve(this.baseUri_, uri).toString());
  if (this.state_ == cast.player.hls.HlsParser.State_.EXTINF_URI) {
    this.isExplicitIv_ || (this.segment_.iv = this.convertSeqToIv_(this.segment_.sequenceNumber));
    this.segment_.url = uri;
    manifest.segments.push(this.segment_);
    var segment = cast.player.hls.HlsParser.createSegment_(this.segment_.sequenceNumber + 1, this.segment_.keySystem, this.segment_.keyUrl, this.segment_.iv);
    this.segment_ = segment;
  } else {
    if (this.state_ == cast.player.hls.HlsParser.State_.STREAMINF_URI) {
      var subList = {url:uri, bitrate:this.currentStreamInfTag_.bandwidth, codecs:this.currentStreamInfTag_.codecs};
      manifest.streams.push(subList);
    }
  }
  this.state_ = cast.player.hls.HlsParser.State_.CONTENT;
  return manifest;
};
cast.player.hls.HlsParser.prototype.parseTag_ = function(manifest, s) {
  var regexMatch = null;
  if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.EXTINF))) {
    if (this.state_ != cast.player.hls.HlsParser.State_.CONTENT && this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
      return this.reportUnexpected_("EXTINF"), null;
    }
    this.segment_.duration = parseFloat(regexMatch[1]);
    this.state_ = cast.player.hls.HlsParser.State_.EXTINF_URI;
  } else {
    if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.BYTERANGE))) {
      var results = regexMatch[1].split("@"), size = parseInt(results[0], 10), offset = parseInt(results[1], 10);
      this.segment_.byterange = {start:offset, end:offset + size - 1};
    } else {
      if (null !== s.match(cast.player.hls.HlsParser.Regex_.EXTM3U)) {
        if (this.state_ != cast.player.hls.HlsParser.State_.M3U) {
          return this.reportUnexpected_("EXTM3U"), null;
        }
        this.state_ = cast.player.hls.HlsParser.State_.HEADER;
      } else {
        if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.STREAM_INF))) {
          if (this.state_ != cast.player.hls.HlsParser.State_.HEADER && this.state_ != cast.player.hls.HlsParser.State_.CONTENT) {
            return this.reportUnexpected_("EXT-X-STREAM-INF"), null;
          }
          manifest.isMasterPlaylist = !0;
          var attributes = regexMatch[1];
          this.currentStreamInfTag_ = this.parseStreamInfTag_(attributes);
          this.state_ = cast.player.hls.HlsParser.State_.STREAMINF_URI;
        } else {
          if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.VERSION))) {
            if (this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
              return this.reportUnexpected_("EXT-X-VERSION"), null;
            }
            var version = parseInt(regexMatch[1], 10);
            manifest.hlsProtocolVersion = version;
            this.state_ = cast.player.hls.HlsParser.State_.HEADER;
          } else {
            if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.PROGRAM_DATE_TIME))) {
              this.state_ === cast.player.hls.HlsParser.State_.HEADER && (manifest.programDateTime = regexMatch[1]);
            } else {
              if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.TARGET_DURATION))) {
                if (this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
                  return this.reportUnexpected_("EXT-X-TARGETDURATION"), null;
                }
                manifest.targetDuration = parseInt(regexMatch[1], 10);
              } else {
                if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.MEDIA_SEQUENCE))) {
                  if (this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
                    return this.reportUnexpected_("EXT-X-MEDIA-SEQUENCE"), null;
                  }
                  this.segment_.sequenceNumber = parseInt(regexMatch[1], 10);
                  this.state_ = cast.player.hls.HlsParser.State_.HEADER;
                } else {
                  if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.KEY))) {
                    if (this.state_ != cast.player.hls.HlsParser.State_.CONTENT && this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
                      return this.reportUnexpected_("EXT-X-KEY"), null;
                    }
                    attributes = regexMatch[1];
                    this.parseKeyTag_(attributes);
                  } else {
                    if (null !== (regexMatch = s.match(cast.player.hls.HlsParser.Regex_.MEDIA))) {
                      if (this.state_ != cast.player.hls.HlsParser.State_.CONTENT && this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
                        return this.reportUnexpected_("EXT-X-MEDIA"), null;
                      }
                      var attributes = regexMatch[1], subtitle = this.parseMediaTag_(attributes);
                      subtitle && manifest.subtitles.push(subtitle);
                    } else {
                      if (null !== s.match(cast.player.hls.HlsParser.Regex_.DISCONTINUITY)) {
                        if (this.state_ != cast.player.hls.HlsParser.State_.CONTENT && this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
                          return this.reportUnexpected_("EXT-X-DISCONTINUITY"), null;
                        }
                        this.segment_.discontinuity = !0;
                        this.state_ = cast.player.hls.HlsParser.State_.CONTENT;
                      } else {
                        if (null !== s.match(cast.player.hls.HlsParser.Regex_.ENDLIST)) {
                          if (this.state_ != cast.player.hls.HlsParser.State_.CONTENT && this.state_ != cast.player.hls.HlsParser.State_.HEADER) {
                            return this.reportUnexpected_("EXT-X-ENDLIST"), null;
                          }
                          manifest.isLive = !1;
                          manifest.hasEosSegment = !0;
                          this.state_ = cast.player.hls.HlsParser.State_.CONTENT;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return manifest;
};
cast.player.hls.HlsParser.StreamInfRegex_ = {BANDWIDTH:"BANDWIDTH=([0-9]+),?(.*)", PROGRAM:"PROGRAM-ID=([0-9]+),?(.*)", CODECS:'CODECS="([^"]*)",?(.*)', RESOLUTION:"RESOLUTION=([0-9]+)x([0-9]+),?(.*)", AUDIO:'AUDIO="([^"]*)",?(.*)', VIDEO:'VIDEO="([^"]*)",?(.*)', SUBTITLES:'SUBTITLES="([^"]*)",?(.*)'};
cast.player.hls.HlsParser.prototype.parseStreamInfTag_ = function(attributes) {
  for (var streamInfTag = {bandwidth:0, program:null, codecs:null, audio:null, video:null, subtitles:null};;) {
    var match_bandwidth = attributes.match(cast.player.hls.HlsParser.StreamInfRegex_.BANDWIDTH), match_program = attributes.match(cast.player.hls.HlsParser.StreamInfRegex_.PROGRAM), match_codecs = attributes.match(cast.player.hls.HlsParser.StreamInfRegex_.CODECS), match_audio = attributes.match(cast.player.hls.HlsParser.StreamInfRegex_.AUDIO), match_video = attributes.match(cast.player.hls.HlsParser.StreamInfRegex_.VIDEO), match_subtitles = attributes.match(cast.player.hls.HlsParser.StreamInfRegex_.SUBTITLES);
    if (null !== match_bandwidth) {
      attributes = match_bandwidth[2], streamInfTag.bandwidth = parseInt(match_bandwidth[1], 10);
    } else {
      if (null !== match_program) {
        attributes = match_program[2], streamInfTag.program = match_program[1];
      } else {
        if (null !== match_codecs) {
          attributes = match_codecs[2], streamInfTag.codecs = match_codecs[1];
        } else {
          if (null !== match_audio) {
            attributes = match_audio[2], streamInfTag.audio = match_audio[1];
          } else {
            if (null !== match_video) {
              attributes = match_video[2], streamInfTag.video = match_video[1];
            } else {
              if (null !== match_subtitles) {
                attributes = match_subtitles[2], streamInfTag.subtitles = match_subtitles[1];
              } else {
                break;
              }
            }
          }
        }
      }
    }
  }
  return streamInfTag;
};
cast.player.hls.HlsParser.KeyRegex_ = {METHOD:"METHOD=(NONE|AES-128|SAMPLE-AES),?(.*)", URI:'URI="([^"]*)",?(.*)', IV:"IV=0(x|X)([0-9a-fA-F]+),?(.*)"};
cast.player.hls.HlsParser.prototype.parseKeyTag_ = function(attributes) {
  for (this.isExplicitIv_ = !1;;) {
    var match_method = attributes.match(cast.player.hls.HlsParser.KeyRegex_.METHOD), match_uri = attributes.match(cast.player.hls.HlsParser.KeyRegex_.URI), match_iv = attributes.match(cast.player.hls.HlsParser.KeyRegex_.IV);
    if (null !== match_method) {
      if ("NONE" == match_method[1]) {
        this.segment_.keySystem = cast.player.hls.KeySystem.NONE;
      } else {
        if ("AES-128" == match_method[1]) {
          this.segment_.keySystem = cast.player.hls.KeySystem.AES128;
        } else {
          if ("SAMPLE-AES" == match_method[1]) {
            this.segment_.keySystem = cast.player.hls.KeySystem.SAMPLEAES;
          } else {
            break;
          }
        }
      }
      attributes = match_method[2];
    } else {
      if (null !== match_uri) {
        this.segment_.keyUrl = goog.Uri.resolve(this.baseUri_, match_uri[1]).toString(), attributes = match_uri[2];
      } else {
        if (null !== match_iv) {
          this.isExplicitIv_ = !0;
          var ivString = match_iv[2];
          if (32 < ivString.length) {
            break;
          }
          this.segment_.iv = new Uint8Array(16);
          for (var idx = 15, k = ivString.length - 2;0 <= k;k -= 2) {
            this.segment_.iv[idx] = parseInt(ivString.substr(k, 2), 16), idx--;
          }
        }
        break;
      }
    }
  }
};
cast.player.hls.HlsParser.MediaRegex_ = {TYPE:"TYPE=([^,]*)", URI:'URI="([^"]*)",?(.*)', LANGUAGE:'LANGUAGE="([^"]*)",?(.*)'};
cast.player.hls.HlsParser.prototype.parseMediaTag_ = function(attributes) {
  var subtitles = !1, url = null, language = null, match = attributes.match(cast.player.hls.HlsParser.MediaRegex_.TYPE);
  null !== match && "SUBTITLES" === match[1] && (subtitles = !0);
  match = attributes.match(cast.player.hls.HlsParser.MediaRegex_.URI);
  null !== match && (url = goog.Uri.resolve(this.baseUri_, match[1]).toString());
  match = attributes.match(cast.player.hls.HlsParser.MediaRegex_.LANGUAGE);
  null !== match && (language = match[1]);
  return subtitles && url ? {url:url, language:language} : null;
};
cast.player.hls.HlsParser.prototype.convertSeqToIv_ = function(seqNum) {
  for (var iv = new Uint8Array(16), k = 15;0 <= k;k--) {
    iv[k] = seqNum & 255, seqNum >>= 8;
  }
  return iv;
};
cast.player.hls.PlaylistReadyCallback = function() {
};
goog.exportSymbol("cast.player.hls.PlaylistReadyCallback", cast.player.hls.PlaylistReadyCallback);
cast.player.hls.PlaylistReadyCallback.prototype.onPlaylistReady = function() {
};
cast.player.hls.Playlist = function(host, playlistReadyCallback, url, bitrate) {
  this.logger_ = goog.log.getLogger("cast.player.hls.Playlist");
  this.host_ = host;
  this.playlistReadyCallback_ = playlistReadyCallback;
  this.url_ = url;
  this.bitrate = bitrate;
  this.language = null;
  this.isLive = !1;
  this.duration_ = -1;
  this.segments = [];
  this.manifestLoader_ = new cast.player.common.ManifestLoader;
  this.requestInfo_ = new cast.player.api.RequestInfo;
  this.timeout_ = null;
  this.updateHandler_ = this.update_.bind(this);
};
goog.inherits(cast.player.hls.Playlist, goog.Disposable);
cast.player.hls.Playlist.prototype.disposeInternal = function() {
  this.manifestLoader_.dispose();
  null !== this.timeout_ && (clearTimeout(this.timeout_), this.timeout_ = null);
};
cast.player.hls.Playlist.prototype.getDuration = function() {
  return this.isLive ? -1 : this.duration_;
};
cast.player.hls.Playlist.prototype.setActive = function() {
  this.update_();
};
cast.player.hls.Playlist.prototype.unload = function() {
  this.segments = [];
  this.manifestLoader_.abort();
  null !== this.timeout_ && (clearTimeout(this.timeout_), this.timeout_ = null);
};
cast.player.hls.Playlist.prototype.update_ = function() {
  goog.log.info(this.logger_, "update: " + this.url_);
  this.requestInfo_.url = this.url_;
  this.host_.updateManifestRequestInfo(this.requestInfo_);
  this.manifestLoader_.load(this.requestInfo_, this);
};
cast.player.hls.Playlist.prototype.onManifestLoaded = function(response) {
  if (response) {
    var manifest = cast.player.hls.HlsParser.manifestFromString(response, this.url_);
    if (null !== manifest && !manifest.isMasterPlaylist) {
      manifest.programDateTime && goog.date.DateTime.fromRfc822String(manifest.programDateTime);
      this.isLive = manifest.isLive;
      for (var segments = manifest.segments, duration = 0, k = 0;k < segments.length;k++) {
        segments[k].estimatedMediaTime = duration, duration += segments[k].duration;
      }
      this.isLive || (this.duration_ = duration);
      var currentTimeInSeconds = (new Date).getTime() / 1E3;
      if (this.isLive) {
        for (k = 0;k < segments.length;k++) {
          segments[k].expiration = currentTimeInSeconds + duration;
        }
      }
      this.segments = segments;
      if (this.isLive && 0 < segments.length) {
        var timeout = 1E3 * segments[0].duration;
        goog.log.info(this.logger_, "update in: " + timeout);
        this.timeout_ = setTimeout(this.updateHandler_, timeout);
      }
      this.playlistReadyCallback_.onPlaylistReady(this);
    }
  } else {
    this.host_.onError(cast.player.api.ErrorCode.NETWORK, this.manifestLoader_.getRequestStatus());
  }
};
cast.player.hls.PlaylistIterator = function() {
  this.logger_ = goog.log.getLogger("cast.player.hls.PlaylistIterator");
  this.index_ = -1;
  this.segments_ = [];
  this.isLive_ = !1;
};
cast.player.hls.PlaylistIterator.prototype.isReady = function() {
  return 0 < this.segments_.length;
};
cast.player.hls.PlaylistIterator.findSegment_ = function(segments, sequenceNumber) {
  for (var i = 0;i < segments.length;i++) {
    if (segments[i].sequenceNumber === sequenceNumber) {
      return i;
    }
  }
  return-1;
};
cast.player.hls.PlaylistIterator.prototype.update = function(playlist) {
  var newSegments = playlist.segments;
  this.isLive_ = playlist.isLive;
  if (0 > this.index_) {
    this.segments_ = newSegments;
  } else {
    var currentSegment = this.segments_[this.index_];
    if (0 === newSegments.length) {
      this.segments_ = [currentSegment], this.index_ = 0;
    } else {
      var firstNewSegment = newSegments[0], firstNewIndex = cast.player.hls.PlaylistIterator.findSegment_(this.segments_, firstNewSegment.sequenceNumber), currentIndex = cast.player.hls.PlaylistIterator.findSegment_(newSegments, currentSegment.sequenceNumber), estimatedMediaTime, index;
      0 <= firstNewIndex && 0 <= currentIndex ? (estimatedMediaTime = this.segments_[firstNewIndex].estimatedMediaTime, index = 0, this.index_ = currentIndex) : (estimatedMediaTime = currentSegment.estimatedMediaTime + currentSegment.duration, index = 1, newSegments.splice(0, 0, currentSegment), this.index_ = 0, firstNewSegment.discontinuity = !0, 0 > firstNewIndex && goog.log.warning(this.logger_, "update: " + firstNewSegment.sequenceNumber + " not found in old playlist"), 0 > currentIndex && goog.log.warning(this.logger_, 
      "update: " + currentSegment.sequenceNumber + " not found in new playlist"));
      for (var i = index;i < newSegments.length;i++) {
        newSegments[i].estimatedMediaTime += estimatedMediaTime;
      }
      this.segments_ = newSegments;
    }
  }
};
cast.player.hls.PlaylistIterator.prototype.next = function() {
  var index = this.index_ + 1;
  return index < this.segments_.length ? (this.index_ = index, !0) : !1;
};
cast.player.hls.PlaylistIterator.prototype.isEndOfStream = function() {
  return!this.isLive_ && this.index_ === this.segments_.length - 1;
};
cast.player.hls.PlaylistIterator.prototype.seek = function(time) {
  for (var lastSegment = this.segments_.length - 1, i = lastSegment;0 <= i;i--) {
    if (time >= this.segments_[i].estimatedMediaTime) {
      if (this.isLive_ && i >= lastSegment - 1) {
        return this.index_ = 2 <= lastSegment ? lastSegment - 2 : 0, !0;
      }
      this.index_ = 0 < i ? i - 1 : 0;
      return!0;
    }
  }
  this.index_ = -1;
  return!1;
};
cast.player.hls.PlaylistIterator.prototype.getSegment = function() {
  return 0 > this.index_ ? null : this.segments_[this.index_];
};
cast.player.hls.MasterPlaylist = function(host, manifestReadyCallback, playlistReadyCallback) {
  this.playlists = [];
  this.subtitles = [];
  this.codecs = null;
  this.host_ = host;
  this.manifestLoader_ = new cast.player.common.ManifestLoader;
  this.requestInfo_ = new cast.player.api.RequestInfo;
  this.manifestReadyCallback_ = manifestReadyCallback;
  this.playlistReadyCallback_ = playlistReadyCallback;
};
goog.inherits(cast.player.hls.MasterPlaylist, goog.Disposable);
cast.player.hls.MasterPlaylist.prototype.load = function() {
  this.host_.updateManifestRequestInfo(this.requestInfo_);
  this.manifestLoader_.load(this.requestInfo_, this);
};
cast.player.hls.MasterPlaylist.prototype.disposeInternal = function() {
  this.manifestLoader_.dispose();
  var i, length = this.playlists.length;
  for (i = 0;i < length;i++) {
    this.playlists[i].dispose();
  }
  this.playlists = [];
};
cast.player.hls.HlsParser.filterIncompatibleStreams_ = function(manifest) {
  for (var hasAudioOnlyStream = !1, hasAudioVideoStream = !1, i = 0;i < manifest.streams.length;i++) {
    var codecs = manifest.streams[i].codecs;
    codecs && (cast.player.common.isAudioOnlyCodec(codecs) ? hasAudioOnlyStream = !0 : hasAudioVideoStream = !0);
  }
  if (hasAudioVideoStream && hasAudioOnlyStream) {
    for (i = 0;i < manifest.streams.length;i++) {
      (codecs = manifest.streams[i].codecs) && cast.player.common.isAudioOnlyCodec(codecs) && manifest.streams.splice(i, 1);
    }
  }
};
cast.player.hls.MasterPlaylist.prototype.onManifestLoaded = function(response) {
  if (response && this.requestInfo_.url) {
    var manifest = cast.player.hls.HlsParser.manifestFromString(response, this.requestInfo_.url);
    if (null === manifest) {
      this.host_.onError(cast.player.api.ErrorCode.MANIFEST);
    } else {
      cast.player.hls.HlsParser.filterIncompatibleStreams_(manifest);
      0 < manifest.streams.length && (this.codecs = manifest.streams[0].codecs);
      if (manifest.isMasterPlaylist) {
        for (var k = 0;k < manifest.streams.length;k++) {
          this.playlists.push(new cast.player.hls.Playlist(this.host_, this.playlistReadyCallback_, manifest.streams[k].url, manifest.streams[k].bitrate));
        }
      } else {
        this.playlists.push(new cast.player.hls.Playlist(this.host_, this.playlistReadyCallback_, this.requestInfo_.url, 0));
      }
      for (k = 0;k < manifest.subtitles.length;k++) {
        var subtitle = manifest.subtitles[k], playlist = new cast.player.hls.Playlist(this.host_, this.playlistReadyCallback_, subtitle.url, 0);
        playlist.language = subtitle.language;
        this.subtitles.push(playlist);
      }
      this.manifestReadyCallback_.onManifestReady();
    }
  } else {
    this.host_.onError(cast.player.api.ErrorCode.NETWORK, this.manifestLoader_.getRequestStatus());
  }
};
cast.player.hls.TsParser = function(byteArray) {
  this.byteArray_ = byteArray;
};
cast.player.hls.TsParser.TS_SYNCWORD = 71;
cast.player.hls.TsParser.STREAM_ID_ID3 = 189;
cast.player.hls.TsParser.TS_PACKET_SIZE = 188;
cast.player.hls.TsParser.unrollTime = function(referenceTimestamp, timestamp) {
  var cycle = 95443.7176888889, referenceTimestampHigh = Math.floor(referenceTimestamp / cycle), time0 = (referenceTimestampHigh - 1) * cycle + timestamp, time1 = (referenceTimestampHigh + 0) * cycle + timestamp, time2 = (referenceTimestampHigh + 1) * cycle + timestamp, diff0 = Math.abs(time0 - referenceTimestamp), diff1 = Math.abs(time1 - referenceTimestamp), diff2 = Math.abs(time2 - referenceTimestamp), unrolled_timestamp = time0, min_diff = diff0;
  diff1 < diff0 && (unrolled_timestamp = time1, min_diff = diff1);
  diff2 < min_diff && (unrolled_timestamp = time2);
  return unrolled_timestamp;
};
cast.player.hls.TsParser.prototype.getStartTiming = function(referenceTime) {
  for (var maxDtsListSize = 30, offset = 0, timingStart = {}, pat_found = !1;0 <= offset && offset < this.byteArray_.length;) {
    offset = this.synchronize_(offset);
    if (0 > offset) {
      break;
    }
    var tsPacket = this.parseTsPacket(offset);
    if (null === tsPacket) {
      offset++;
    } else {
      0 == tsPacket.pid && (pat_found = !0);
      if (pat_found && 0 != tsPacket.pid && 0 != tsPacket.payloadUnitStartIndicator) {
        var payloadOffset = cast.player.hls.TsParser.TS_PACKET_SIZE - tsPacket.payloadLength, pesHeader = this.getDtsPtsFromPes(offset + payloadOffset, tsPacket.payloadLength);
        if (null !== pesHeader) {
          var curDts = cast.player.hls.TsParser.unrollTime(referenceTime, pesHeader.dts);
          void 0 === timingStart[pesHeader.streamId] && (timingStart[pesHeader.streamId] = []);
          timingStart[pesHeader.streamId].push(curDts);
          if (timingStart[pesHeader.streamId].length > maxDtsListSize) {
            break;
          }
        }
      }
      offset = 0 > tsPacket.offset ? offset + 1 : offset + cast.player.hls.TsParser.TS_PACKET_SIZE;
    }
  }
  var minDts = null, streamId;
  for (streamId in timingStart) {
    if (null === minDts || timingStart[streamId][0] < minDts) {
      minDts = timingStart[streamId][0];
    }
  }
  return minDts;
};
cast.player.hls.TsParser.prototype.getEndTiming = function(referenceTime) {
  for (var maxDtsListSize = 10, offset = this.byteArray_.length - 1, timingEnd = {};0 <= offset && offset < this.byteArray_.length;) {
    offset = this.synchronizeBackward_(offset);
    if (0 > offset) {
      break;
    }
    var tsPacket = this.parseTsPacket(offset);
    if (null === tsPacket) {
      offset--;
    } else {
      if (0 != tsPacket.pid && 0 != tsPacket.payloadUnitStartIndicator) {
        var payloadOffset = cast.player.hls.TsParser.TS_PACKET_SIZE - tsPacket.payloadLength, pesHeader = this.getDtsPtsFromPes(offset + payloadOffset, tsPacket.payloadLength);
        if (null !== pesHeader) {
          var curDts = cast.player.hls.TsParser.unrollTime(referenceTime, pesHeader.dts);
          void 0 === timingEnd[pesHeader.streamId] && (timingEnd[pesHeader.streamId] = []);
          timingEnd[pesHeader.streamId].push(curDts);
          if (timingEnd[pesHeader.streamId].length > maxDtsListSize) {
            break;
          }
        }
      }
      offset -= cast.player.hls.TsParser.TS_PACKET_SIZE;
    }
  }
  var maxDts = null, streamId;
  for (streamId in timingEnd) {
    for (var k = 0;k < timingEnd[streamId].length;k++) {
      if (null === maxDts || timingEnd[streamId][k] > maxDts) {
        maxDts = timingEnd[streamId][k];
      }
    }
  }
  return maxDts += 0.033;
};
cast.player.hls.TsParser.prototype.getId3FromPes = function(offset, payloadLength) {
  if (19 > payloadLength || 0 != this.byteArray_[offset + 0] || 0 != this.byteArray_[offset + 1] || 1 != this.byteArray_[offset + 2]) {
    return null;
  }
  var streamId = this.byteArray_[offset + 3];
  if (streamId === cast.player.hls.TsParser.STREAM_ID_ID3) {
    var length = this.byteArray_[offset + 8], id3Data = this.byteArray_.subarray(offset + 9 + length), id3Size = cast.player.common.extractId3Size(id3Data);
    if (0 < id3Size) {
      return id3Data.subarray(0, id3Size);
    }
  }
  return null;
};
cast.player.hls.TsParser.prototype.extractMetadata = function(metadataHandler) {
  for (var offset = this.byteArray_.length - 1;0 <= offset && offset < this.byteArray_.length;) {
    offset = this.synchronizeBackward_(offset);
    if (0 > offset) {
      break;
    }
    var tsPacket = this.parseTsPacket(offset);
    if (null === tsPacket) {
      offset--;
    } else {
      if (0 != tsPacket.pid && 0 != tsPacket.payloadUnitStartIndicator) {
        var payloadOffset = cast.player.hls.TsParser.TS_PACKET_SIZE - tsPacket.payloadLength, u8 = this.getId3FromPes(offset + payloadOffset, tsPacket.payloadLength);
        null !== u8 && metadataHandler("ID3", u8);
      }
      offset -= cast.player.hls.TsParser.TS_PACKET_SIZE;
    }
  }
};
cast.player.hls.TsParser.prototype.synchronize_ = function(offset) {
  if (0 > offset) {
    return-1;
  }
  for (var k = offset;k < this.byteArray_.length;k++) {
    var k1 = k + 1 * cast.player.hls.TsParser.TS_PACKET_SIZE, k2 = k + 2 * cast.player.hls.TsParser.TS_PACKET_SIZE;
    if (this.byteArray_[k] == cast.player.hls.TsParser.TS_SYNCWORD && (k1 >= this.byteArray_.length || this.byteArray_[k1] == cast.player.hls.TsParser.TS_SYNCWORD) && (k2 >= this.byteArray_.length || this.byteArray_[k2] == cast.player.hls.TsParser.TS_SYNCWORD)) {
      return k;
    }
  }
  return-1;
};
cast.player.hls.TsParser.prototype.synchronizeBackward_ = function(offset) {
  if (offset >= this.byteArray_.length) {
    return-1;
  }
  for (var k = offset;0 <= k;k--) {
    var k1 = k - 1 * cast.player.hls.TsParser.TS_PACKET_SIZE, k2 = k - 2 * cast.player.hls.TsParser.TS_PACKET_SIZE;
    if (this.byteArray_[k] == cast.player.hls.TsParser.TS_SYNCWORD && (k1 >= this.byteArray_.length || this.byteArray_[k1] == cast.player.hls.TsParser.TS_SYNCWORD) && (k2 >= this.byteArray_.length || this.byteArray_[k2] == cast.player.hls.TsParser.TS_SYNCWORD)) {
      return k;
    }
  }
  return-1;
};
cast.player.hls.TsParser.prototype.parseTsPacket = function(offset) {
  if (0 > offset || offset > this.byteArray_.length - cast.player.hls.TsParser.TS_PACKET_SIZE || 71 != this.byteArray_[offset + 0]) {
    return null;
  }
  var payloadUnitStartIndicator = 0 != (this.byteArray_[offset + 1] & 64), pid = (this.byteArray_[offset + 1] & 7) << 8 | this.byteArray_[offset + 2], adaptationFieldControl = this.byteArray_[offset + 3] >> 4 & 3, payloadLength = cast.player.hls.TsParser.TS_PACKET_SIZE - 4;
  if (0 != (adaptationFieldControl & 2)) {
    var adaptationFieldLength = this.byteArray_[offset + 4], payloadLength = payloadLength - 1;
    if (183 < adaptationFieldLength) {
      return null;
    }
    payloadLength -= adaptationFieldLength;
  }
  return{offset:offset, payloadLength:payloadLength, payloadUnitStartIndicator:payloadUnitStartIndicator, pid:pid};
};
cast.player.hls.TsParser.prototype.getDtsPtsFromPes = function(offset, payloadLength) {
  if (19 > payloadLength || 0 != this.byteArray_[offset + 0] || 0 != this.byteArray_[offset + 1] || 1 != this.byteArray_[offset + 2]) {
    return null;
  }
  var streamId = this.byteArray_[offset + 3];
  if (192 != (streamId & 224) && 224 != (streamId & 240)) {
    return null;
  }
  var ptsDtsFlags = this.byteArray_[offset + 7] >> 6 & 3, pts = 0, dts = 0;
  2 == ptsDtsFlags ? (pts = ((this.byteArray_[offset + 9] & 14) << 13) / 1.373291015625, pts += (this.byteArray_[offset + 10] << 6) / 1.373291015625, pts += (this.byteArray_[offset + 11] & 254) / 5.4931640625, pts += this.byteArray_[offset + 12] / 703.125, dts = pts += (this.byteArray_[offset + 13] & 254) / 18E4) : 3 == ptsDtsFlags && (pts = ((this.byteArray_[offset + 9] & 14) << 13) / 1.373291015625, pts += (this.byteArray_[offset + 10] << 6) / 1.373291015625, pts += (this.byteArray_[offset + 11] & 
  254) / 5.4931640625, pts += this.byteArray_[offset + 12] / 703.125, pts += (this.byteArray_[offset + 13] & 254) / 18E4, dts = ((this.byteArray_[offset + 14] & 14) << 13) / 1.373291015625, dts += (this.byteArray_[offset + 15] << 6) / 1.373291015625, dts += (this.byteArray_[offset + 16] & 254) / 5.4931640625, dts += this.byteArray_[offset + 17] / 703.125, dts += (this.byteArray_[offset + 18] & 254) / 18E4);
  return{streamId:streamId, dts:dts, pts:pts};
};
cast.player.hls.MPEG2_TS_REFERENCE_TIME = 47721.8588444;
cast.player.hls.getMimeTypeForFormat_ = function(opt_format) {
  return opt_format == cast.player.api.HlsSegmentFormat.MPEG_AUDIO_ES ? cast.player.common.MimeType.MPEG4_AUDIO : cast.player.common.MimeType.MPEG2_TS;
};
cast.player.hls.Hls = function(host, opt_format) {
  cast.player.common.StreamingProtocol.call(this, host);
  this.mimeType_ = cast.player.hls.getMimeTypeForFormat_(opt_format);
  this.isTsStream_ = this.mimeType_ == cast.player.common.MimeType.MPEG2_TS;
  this.codecs_ = cast.player.common.Codec.H264_MAIN_PROFILE_40 + "," + cast.player.common.Codec.MPEG4_AAC_LC;
  this.qualityLevel_ = -1;
  this.subtitle_ = this.playlist_ = this.masterPlaylist_ = null;
  this.playlistIterators_ = [new cast.player.hls.PlaylistIterator, null];
  this.processedMediaTime_ = null;
  this.referenceTime_ = cast.player.hls.MPEG2_TS_REFERENCE_TIME;
  this.pendingData_ = this.timeOffset_ = this.keyValue_ = this.segmentProcessedCallback_ = this.qualitySetCallback_ = null;
  this.xhrIo_ = new goog.net.XhrIo;
  this.xhrIo_.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
  goog.events.listen(this.xhrIo_, goog.net.EventType.SUCCESS, this.onKeyLoadSuccess_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.ERROR, this.onKeyLoadError_, !1, this);
  goog.events.listen(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onKeyLoadError_, !1, this);
  this.onDecryptSuccessHandler_ = this.processSegment_.bind(this);
  this.onImportKeySuccessHandler_ = this.onImportKeySuccess_.bind(this);
  this.decrypt_ = this.importKey_ = null;
};
goog.inherits(cast.player.hls.Hls, cast.player.common.StreamingProtocol);
cast.player.hls.Hls.Decrypt = function(host, callback, keyValue, iv, data) {
  this.host_ = host;
  this.callback_ = callback;
  var algorithmAesCbc = {name:"AES-CBC", iv:iv};
  window.crypto.subtle.decrypt(algorithmAesCbc, keyValue, data).then(this.onDecryptSuccess_.bind(this), this.onDecryptError_.bind(this));
};
cast.player.hls.Hls.Decrypt.prototype.cancel = function() {
  this.host_ = null;
};
cast.player.hls.Hls.Decrypt.prototype.onDecryptError_ = function() {
  if (this.host_) {
    this.host_.onError(cast.player.api.ErrorCode.MEDIAKEYS);
  }
};
cast.player.hls.Hls.Decrypt.prototype.onDecryptSuccess_ = function(data) {
  this.host_ && this.callback_(data);
};
cast.player.hls.Hls.ImportKey = function(host, callback, keyData) {
  this.host_ = host;
  this.callback_ = callback;
  var keyFormat = "raw", extractable = !0, keyUsages = ["decrypt"];
  window.crypto.subtle.importKey(keyFormat, keyData, {name:"AES-CBC"}, extractable, keyUsages).then(this.onImportKeySuccess_.bind(this), this.onImportKeyError_.bind(this));
};
cast.player.hls.Hls.ImportKey.prototype.cancel = function() {
  this.host_ = null;
};
cast.player.hls.Hls.ImportKey.prototype.onImportKeyError_ = function() {
  if (this.host_) {
    this.host_.onError(cast.player.api.ErrorCode.MEDIAKEYS);
  }
};
cast.player.hls.Hls.ImportKey.prototype.onImportKeySuccess_ = function(key) {
  this.host_ && this.callback_(key);
};
cast.player.hls.Hls.prototype.load = function(manifestReadyCallback, playlistReadyCallback, sourceBufferCallback) {
  this.sourceBufferCallback = sourceBufferCallback;
  this.manifestReadyCallback = manifestReadyCallback;
  this.playlistReadyCallback = playlistReadyCallback;
  this.masterPlaylist_ = new cast.player.hls.MasterPlaylist(this.host, this, this);
  this.masterPlaylist_.load();
};
cast.player.hls.Hls.prototype.unload = function() {
  this.importKey_ && (this.importKey_.cancel(), this.importKey_ = null);
  this.decrypt_ && (this.decrypt_.cancel(), this.decrypt_ = null);
  this.masterPlaylist_ && (this.masterPlaylist_.dispose(), this.masterPlaylist_ = null);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.SUCCESS, this.onKeyLoadSuccess_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.ERROR, this.onKeyLoadError_, !1, this);
  goog.events.unlisten(this.xhrIo_, goog.net.EventType.TIMEOUT, this.onKeyLoadError_, !1, this);
};
cast.player.hls.Hls.prototype.getStreamCount = function() {
  return this.masterPlaylist_.subtitles.length + 1;
};
goog.exportSymbol("cast.player.hls.Hls.prototype.getStreamCount", cast.player.hls.Hls.prototype.getStreamCount);
cast.player.hls.Hls.prototype.enableStream = function(streamIndex, enabled) {
  if (0 < streamIndex) {
    this.subtitle_ && this.subtitle_.unload();
    var playlistIterator;
    enabled ? (this.subtitle_ = this.masterPlaylist_.subtitles[streamIndex - 1], this.subtitle_.setActive(), playlistIterator = new cast.player.hls.PlaylistIterator) : playlistIterator = this.subtitle_ = null;
    this.playlistIterators_[1] = playlistIterator;
  }
};
goog.exportSymbol("cast.player.hls.Hls.prototype.enableStream", cast.player.hls.Hls.prototype.enableStream);
cast.player.hls.Hls.prototype.getPlaylistIterator_ = function(streamIndex) {
  return 0 < streamIndex ? this.playlistIterators_[1] : this.playlistIterators_[0];
};
cast.player.hls.Hls.prototype.isStreamEnabled = function(streamIndex) {
  return 0 < streamIndex ? this.subtitle_ === this.masterPlaylist_.subtitles[streamIndex - 1] : !0;
};
goog.exportSymbol("cast.player.hls.Hls.prototype.isStreamEnabled", cast.player.hls.Hls.prototype.isStreamEnabled);
cast.player.hls.Hls.prototype.isStreamReady = function(streamIndex) {
  var protocolReady = 0 === streamIndex || null !== this.timeOffset_, playlistIterator = this.getPlaylistIterator_(streamIndex);
  return null !== playlistIterator && playlistIterator.isReady() && protocolReady;
};
cast.player.hls.Hls.prototype.setQualityLevel = function(streamIndex, qualityLevel, qualitySetCallback) {
  if (0 < streamIndex) {
    qualitySetCallback.onQualitySet();
  } else {
    this.timeOffset_ = null, this.qualityLevel_ = qualityLevel, this.qualitySetCallback_ = qualitySetCallback, this.playlist_ && this.playlist_.unload(), this.playlist_ = this.masterPlaylist_.playlists[this.qualityLevel_], this.playlist_.setActive();
  }
};
cast.player.hls.Hls.prototype.getQualityLevel = function(streamIndex, opt_bitrate) {
  if (0 < streamIndex) {
    return 0;
  }
  if (void 0 === opt_bitrate) {
    return this.qualityLevel_;
  }
  for (var bitrate = opt_bitrate, indexBest = 0, deltaBest = Number.MAX_VALUE, playlists = this.masterPlaylist_.playlists, i = 0;i < playlists.length;i++) {
    if (bitrate >= playlists[i].bitrate) {
      var delta = bitrate - playlists[i].bitrate;
      delta < deltaBest && (indexBest = i, deltaBest = delta);
    }
  }
  return indexBest;
};
goog.exportSymbol("cast.player.hls.Hls.prototype.getQualityLevel", cast.player.hls.Hls.prototype.getQualityLevel);
cast.player.hls.Hls.prototype.getStreamInfo = function(streamIndex) {
  if (0 < streamIndex) {
    var language = this.masterPlaylist_.subtitles[streamIndex - 1].language;
    return new cast.player.api.StreamInfo("webvtt", "text", [0], language);
  }
  for (var bitrates = [], playlists = this.masterPlaylist_.playlists, i = 0;i < playlists.length;i++) {
    bitrates.push(playlists[i].bitrate);
  }
  return new cast.player.api.StreamInfo(this.codecs_, this.mimeType_, bitrates);
};
goog.exportSymbol("cast.player.hls.Hls.prototype.getStreamInfo", cast.player.hls.Hls.prototype.getStreamInfo);
cast.player.hls.Hls.prototype.onImportKeySuccess_ = function(key) {
  this.importKey_ = null;
  this.keyValue_ = key;
  this.pendingData_ && (this.decryptSegment_(this.pendingData_), this.pendingData_ = null);
};
cast.player.hls.Hls.prototype.onKeyLoadSuccess_ = function(e) {
  this.importKey_ = new cast.player.hls.Hls.ImportKey(this.host, this.onImportKeySuccessHandler_, new Uint8Array(e.target.getResponse()));
};
cast.player.hls.Hls.prototype.onKeyLoadError_ = function() {
  this.host.onError(cast.player.api.ErrorCode.NETWORK, new cast.player.api.RequestStatus(this.requestInfo.url, this.xhrIo_.getLastErrorCode(), this.xhrIo_.getStatus()));
};
cast.player.hls.Hls.prototype.decryptSegment_ = function(data) {
  var segment = this.playlistIterators_[0].getSegment();
  segment.iv && this.keyValue_ && (this.decrypt_ = new cast.player.hls.Hls.Decrypt(this.host, this.onDecryptSuccessHandler_, this.keyValue_, segment.iv, new Uint8Array(data)));
};
cast.player.hls.Hls.MAX_DELTA_FOR_SINGLE_RANGE_ = 0.03;
cast.player.hls.Hls.prototype.adjustProcessedMediaTime_ = function() {
  for (var sourceBuffer = this.sourceBufferCallback.getSourceBuffer(0), timeRanges = sourceBuffer.buffered, processedMediaTime = this.processedMediaTime_, i = 0;i < timeRanges.length;i++) {
    if (this.processedMediaTime_ >= timeRanges.start(i) && this.processedMediaTime_ <= timeRanges.end(i) + cast.player.hls.Hls.MAX_DELTA_FOR_SINGLE_RANGE_) {
      return;
    }
    timeRanges.end(i) < this.processedMediaTime_ && (processedMediaTime = timeRanges.end(i) + cast.player.hls.Hls.MAX_DELTA_FOR_SINGLE_RANGE_);
  }
  this.processedMediaTime_ = processedMediaTime;
};
cast.player.hls.Hls.prototype.processSegment_ = function(data) {
  this.decrypt_ = null;
  var u8 = new Uint8Array(data), parser;
  this.isTsStream_ ? (parser = new cast.player.hls.TsParser(u8), parser.extractMetadata(this.host.processMetadata)) : (parser = new cast.player.hls.AacParser(u8, this.codecs_), parser.extractMetadata(this.host.processMetadata), u8 = parser.buildMp4(this.referenceTime_));
  var segment = this.playlistIterators_[0].getSegment();
  if (null === this.timeOffset_ || segment.discontinuity) {
    var time = parser.getStartTiming(this.referenceTime_);
    null === this.processedMediaTime_ ? this.processedMediaTime_ = segment.estimatedMediaTime : this.adjustProcessedMediaTime_();
    this.timeOffset_ = this.processedMediaTime_ - time;
  }
  this.referenceTime_ = parser.getEndTiming(this.referenceTime_);
  this.processedMediaTime_ = this.timeOffset_ + this.referenceTime_;
  this.segmentProcessedCallback_.onSegmentProcessed(u8, this.timeOffset_);
  this.segmentProcessedCallback_ = null;
};
cast.player.hls.Hls.prototype.clear = function() {
  this.timeOffset_ = this.playlist_ = null;
};
cast.player.hls.Hls.prototype.onManifestReady = function() {
  this.masterPlaylist_.codecs && (this.codecs_ = this.masterPlaylist_.codecs);
  this.isTsStream_ || (this.referenceTime_ = 0);
  if (this.manifestReadyCallback) {
    this.manifestReadyCallback.onManifestReady();
  }
};
cast.player.hls.Hls.prototype.onPlaylistReady = function(playlist) {
  playlist === this.playlist_ ? (this.playlistReadyCallback && (this.playlistReadyCallback.onPlaylistReady(), this.playlistReadyCallback = null), this.qualitySetCallback_ && (this.qualitySetCallback_.onQualitySet(), this.qualitySetCallback_ = null), this.playlistIterators_[0].update(playlist)) : playlist === this.subtitle_ && this.playlistIterators_[1].update(playlist);
};
cast.player.hls.Hls.prototype.updateLicenseRequestInfo = function() {
};
cast.player.hls.Hls.prototype.getDuration = function() {
  return this.playlist_ ? this.playlist_.getDuration() : -1;
};
cast.player.hls.Hls.prototype.seek = function(streamIndex, time) {
  0 === streamIndex && (this.referenceTime_ = this.isTsStream_ ? cast.player.hls.MPEG2_TS_REFERENCE_TIME : 0, this.processedMediaTime_ = this.timeOffset_ = null);
  var playlistIterator = this.getPlaylistIterator_(streamIndex);
  return playlistIterator.seek(time);
};
cast.player.hls.Hls.prototype.findNextSegment = function(streamIndex) {
  var playlistIterator = this.getPlaylistIterator_(streamIndex);
  return playlistIterator.next();
};
cast.player.hls.Hls.prototype.isEndOfStream = function(streamIndex) {
  var playlistIterator = this.getPlaylistIterator_(streamIndex);
  return playlistIterator.isEndOfStream();
};
cast.player.hls.Hls.prototype.getSegmentTime = function(streamIndex) {
  var playlistIterator = this.getPlaylistIterator_(streamIndex), segment = playlistIterator.getSegment();
  return segment ? {time:segment.estimatedMediaTime, duration:segment.duration} : {time:0, duration:0};
};
cast.player.hls.Hls.prototype.needInitSegment = function() {
  return!1;
};
cast.player.hls.Hls.prototype.getInitSegment = function() {
  return null;
};
cast.player.hls.Hls.prototype.updateSegmentRequestInfo = function(streamIndex, requestInfo) {
  var playlistIterator = this.getPlaylistIterator_(streamIndex), segment = playlistIterator.getSegment();
  segment.keySystem === cast.player.hls.KeySystem.AES128 && this.requestInfo.url !== segment.keyUrl && (this.keyValue_ = null, this.requestInfo.url = segment.keyUrl, this.host.updateLicenseRequestInfo(this.requestInfo), this.xhrIo_.setWithCredentials(this.requestInfo.withCredentials), this.xhrIo_.setTimeoutInterval(this.requestInfo.timeoutInterval), this.xhrIo_.send(this.requestInfo.url, void 0, void 0, this.requestInfo.headers));
  var range = segment.byterange;
  range && (requestInfo.headers = {}, requestInfo.headers.Range = "bytes=" + range.start + "-" + range.end);
  requestInfo.url = segment.url;
};
cast.player.hls.Hls.prototype.processSegment = function(streamIndex, data, segmentProcessedCallback) {
  if (0 < streamIndex) {
    if (null !== this.timeOffset_) {
      segmentProcessedCallback.onSegmentProcessed(new Uint8Array(data), this.timeOffset_);
    }
  } else {
    this.segmentProcessedCallback_ = segmentProcessedCallback;
    var segment = this.playlistIterators_[streamIndex].getSegment();
    segment.keySystem === cast.player.hls.KeySystem.AES128 ? null === this.keyValue_ ? this.pendingData_ = data : this.decryptSegment_(data) : this.processSegment_(data);
  }
};
cast.player.smooth = {};
cast.player.smooth.Data = {};
cast.player.smooth.Data.TFRF_UUID = new Uint8Array([212, 128, 126, 242, 202, 57, 70, 149, 142, 84, 38, 203, 158, 70, 167, 159]);
cast.player.smooth.Data.createMoof_ = function(ab) {
  for (var dv = new DataView(ab), pos = 0, nSamples = 0, samplesTotalSize = 0, moofOrigSize = dv.getUint32(pos), pos = cast.player.common.Mp4Box.findBox(dv, pos + 8, "traf"), pos = cast.player.common.Mp4Box.findBox(dv, pos + 8, "trun"), nSamples = dv.getUint32(pos + 12), sampleEncryptionBox = [2721664850, 1520127764, 2722393154, 2086964724];;) {
    pos = cast.player.common.Mp4Box.findBox(dv, pos, "uuid");
    if (pos === dv.byteLength) {
      return new Uint8Array(ab);
    }
    if (dv.getUint32(pos + 8) === sampleEncryptionBox[0] && dv.getUint32(pos + 12) === sampleEncryptionBox[1] && dv.getUint32(pos + 16) === sampleEncryptionBox[2] && dv.getUint32(pos + 20) === sampleEncryptionBox[3]) {
      break;
    } else {
      pos += dv.getUint32(pos);
    }
  }
  var flags = dv.getUint8(pos + 27), subSampleEnc = !1;
  if (2 !== flags && 0 !== flags) {
    throw "uuid flags expected is 0x02 or 0x00 but found: " + flags;
  }
  2 === flags && (subSampleEnc = !0);
  var uuidSamplesCount = dv.getUint32(pos + 28);
  if (nSamples !== uuidSamplesCount) {
    throw "Samples count does not match " + nSamples + " " + uuidSamplesCount;
  }
  var uuidSize = dv.getUint32(pos), samplesTotalSize = uuidSize - 32, extraSize = 200, ab2 = new ArrayBuffer(ab.byteLength + extraSize), a82 = new Uint8Array(ab2), dv2 = new DataView(ab2);
  a82.set(new Uint8Array(ab, 0, pos));
  var pos2 = pos, ivSize = 8, samplesFirstPos = pos + 32, mdatFirstPos = cast.player.common.Mp4Box.findBox(dv, 0, "mdat"), mdatSize = dv.getUint32(mdatFirstPos), sampleSizes = cast.player.common.Mp4Box.getSampleSizes(dv, samplesFirstPos, nSamples, ivSize, subSampleEnc), pos2 = cast.player.common.Mp4Box.addSaiz(dv2, a82, pos2, nSamples, sampleSizes, subSampleEnc, ivSize), pos2 = cast.player.common.Mp4Box.addSaio(dv2, a82, pos2);
  if (subSampleEnc) {
    for (var ts = 0, j = 0;j < sampleSizes.length;j++) {
      ts += sampleSizes[j];
    }
    if (ts !== samplesTotalSize) {
      throw "Samples size does not match " + ts + " " + samplesTotalSize;
    }
  } else {
    if (ivSize * nSamples !== samplesTotalSize) {
      throw "Samples size does not match " + ivSize * nSamples + " " + samplesTotalSize;
    }
  }
  var a8samples = new Uint8Array(ab, samplesFirstPos, samplesTotalSize), a8mdat = new Uint8Array(ab, mdatFirstPos + 8, mdatSize - 8), moofIncreasedSize = pos2 - moofOrigSize, mdatPos = pos2, pos2 = cast.player.common.Mp4Box.addMdatEnc(dv2, a82, pos2, a8samples, a8mdat);
  cast.player.common.Mp4Box.setSizes(dv2, moofIncreasedSize, mdatPos + 8 + samplesTotalSize);
  return new Uint8Array(ab2, 0, pos2);
};
cast.player.smooth.Data.processSegment = function(moof, time, protection) {
  var ab = cast.player.common.Mp4Box.insertTfdt(moof, time);
  return protection ? cast.player.smooth.Data.createMoof_(ab) : new Uint8Array(ab);
};
cast.player.smooth.Data.createInit = function(rep) {
  return cast.player.common.Mp4Box.createInit(rep);
};
cast.player.smooth.Data.extractData = function(moof) {
  var dv = new DataView(moof), pos = cast.player.common.Mp4Box.findBox(dv, 0, "mdat"), size = dv.getUint32(pos);
  return new Uint8Array(moof.slice(pos + 8, pos + size));
};
cast.player.smooth.Data.extractSegments = function(timeScale, data) {
  var dv = new DataView(data), posMoof = cast.player.common.Mp4Box.findBox(dv, 0, "moof"), posTraf = cast.player.common.Mp4Box.findBox(dv, posMoof + 8, "traf"), posUuid = cast.player.common.Mp4Box.findUuidBox(dv, posTraf + 8, posTraf + dv.getUint32(posTraf), cast.player.smooth.Data.TFRF_UUID);
  if (0 > posUuid) {
    return[];
  }
  for (var size = dv.getUint32(posUuid), longLengthFieldSize = 1 == size ? 8 : 0, version = dv.getUint8(posUuid + 24 + longLengthFieldSize), fragCount = dv.getUint8(posUuid + 28 + longLengthFieldSize), posFragment = posUuid + 29 + longLengthFieldSize, segments = [], i = 0;i < fragCount;i++) {
    var scaledTime, scaledDuration;
    if (1 == version) {
      var bigAbsoluteTime = cast.player.common.getBigPositiveIntFrom64bits(dv, posFragment);
      scaledTime = dv.getUint32(posFragment) * (4294967296 / timeScale) + dv.getUint32(posFragment + 4) / timeScale;
      scaledDuration = dv.getUint32(posFragment + 8) * (4294967296 / timeScale) + dv.getUint32(posFragment + 12) / timeScale;
      posFragment += 16;
    } else {
      bigAbsoluteTime = new cast.player.common.BigPositiveInt(dv.getUint32(posFragment).toString()), scaledTime = dv.getUint32(posFragment) / timeScale, scaledDuration = dv.getUint32(posFragment + 4) / timeScale, posFragment += 8;
    }
    var segment = {time:scaledTime, duration:scaledDuration, originalTime:bigAbsoluteTime};
    segments.push(segment);
  }
  return segments;
};
cast.player.smooth.Manifest = function(node) {
  this.isLive = new cast.player.common.BooleanValue("IsLive");
  this.timeScale = new cast.player.common.NumberValue("TimeScale");
  this.duration = new cast.player.common.NumberValue("Duration");
  cast.player.common.parseAttributes(node.attributes, this);
  this.timeScale.value || (this.timeScale.value = cast.player.common.Mp4Box.TIME_SCALE);
  this.streams = [];
  this.protection = null;
  this.parseManifest(node);
};
cast.player.smooth.Manifest.Fourcc_ = {AUDIO:"mp4a.40.2", AUDIO_HE:"mp4a.40.5", VIDEO:"avc1.4d40", TEXT:"ttml"};
cast.player.smooth.Manifest.parseFourcc_ = function(s) {
  return "AACL" === s ? cast.player.smooth.Manifest.Fourcc_.AUDIO : "AACH" === s ? cast.player.smooth.Manifest.Fourcc_.AUDIO_HE : "TTML" === s ? cast.player.smooth.Manifest.Fourcc_.TEXT : "H264" === s || "AVC1" === s ? cast.player.smooth.Manifest.Fourcc_.VIDEO : "";
};
cast.player.smooth.Manifest.parseHexString = function(s) {
  for (var array = [], i = 0;i < s.length;i += 2) {
    array.push(parseInt(s.substr(i, 2), 16));
  }
  return array;
};
cast.player.smooth.Manifest.prototype.parseManifest = function(node) {
  for (var child = node.firstElementChild;null != child;child = child.nextElementSibling) {
    if ("StreamIndex" === child.nodeName) {
      var stream = new cast.player.smooth.Manifest.Stream(this, child);
      0 < stream.qualities.length && this.streams.push(stream);
    } else {
      "Protection" === child.nodeName && (this.protection = new cast.player.smooth.Manifest.ProtectionHeader(child.firstElementChild));
    }
  }
};
cast.player.smooth.Manifest.GuidValue = function(name) {
  this.name = name;
  this.value = null;
  this.parse = this.parse_;
};
cast.player.smooth.Manifest.GuidValue.prototype.parse_ = function(s) {
  for (var guid = s.replace(/[{}-]/g, ""), ab = new ArrayBuffer(guid.length / 2), array = new Uint8Array(ab), i = 0;i < guid.length;i += 2) {
    array[i / 2] = parseInt(guid.substr(i, 2), 16);
  }
  this.value = array;
};
cast.player.smooth.Manifest.VideoCodecPrivateData = function() {
  this.name = "CodecPrivateData";
  this.pps = this.sps = null;
  this.parse = this.parse_;
};
cast.player.smooth.Manifest.VideoCodecPrivateData.prototype.parse_ = function(s) {
  var parsedString = s.split("00000001");
  3 === parsedString.length && (this.sps = cast.player.smooth.Manifest.parseHexString(parsedString[1]), this.pps = cast.player.smooth.Manifest.parseHexString(parsedString[2]));
};
cast.player.smooth.Manifest.AudioCodecPrivateData = function() {
  this.name = "CodecPrivateData";
  this.parse = this.parse_;
  this.value = null;
};
cast.player.smooth.Manifest.AudioCodecPrivateData.prototype.parse_ = function(s) {
  s && (this.value = cast.player.smooth.Manifest.parseHexString(s));
};
cast.player.smooth.Manifest.Quality = function(node, fourcc) {
  this.bitrate = new cast.player.common.NumberValue("Bitrate");
  this.fourcc = new cast.player.common.StringValue("FourCC", cast.player.smooth.Manifest.parseFourcc_, fourcc);
};
cast.player.smooth.Manifest.TextQuality = function(node) {
  cast.player.smooth.Manifest.Quality.call(this, node, cast.player.smooth.Manifest.Fourcc_.TEXT);
  cast.player.common.parseAttributes(node.attributes, this);
};
goog.inherits(cast.player.smooth.Manifest.TextQuality, cast.player.smooth.Manifest.Quality);
cast.player.smooth.Manifest.VideoQuality = function(node) {
  cast.player.smooth.Manifest.Quality.call(this, node, cast.player.smooth.Manifest.Fourcc_.VIDEO);
  this.width = new cast.player.common.NumberValue("MaxWidth");
  this.height = new cast.player.common.NumberValue("MaxHeight");
  this.codecPrivateData = new cast.player.smooth.Manifest.VideoCodecPrivateData;
  cast.player.common.parseAttributes(node.attributes, this);
};
goog.inherits(cast.player.smooth.Manifest.VideoQuality, cast.player.smooth.Manifest.Quality);
cast.player.smooth.Manifest.AudioQuality = function(node) {
  cast.player.smooth.Manifest.Quality.call(this, node, cast.player.smooth.Manifest.Fourcc_.AUDIO);
  this.sampleRate = new cast.player.common.NumberValue("SamplingRate");
  this.channels = new cast.player.common.NumberValue("Channels");
  this.codecPrivateData = new cast.player.smooth.Manifest.AudioCodecPrivateData;
  cast.player.common.parseAttributes(node.attributes, this);
  if (null === this.codecPrivateData.value && null !== this.sampleRate.value) {
    var chan = null === this.channels.value ? 2 : this.channels.value, prof = 2, frequencies = [96E3, 88200, 64E3, 48E3, 44100, 32E3, 24E3, 22050, 16E3, 12E3, 11025, 8E3, 7350], index = frequencies.indexOf(this.sampleRate.value);
    if (0 <= index) {
      var codecPrivateData = prof << 11 | index << 7 | chan << 3;
      cast.player.common.warning("Audio codecPrivateData guess: " + codecPrivateData.toString(16));
      this.codecPrivateData.value = [];
      this.codecPrivateData.value[0] = codecPrivateData >> 8 & 255;
      this.codecPrivateData.value[1] = codecPrivateData & 255;
    }
  }
};
goog.inherits(cast.player.smooth.Manifest.AudioQuality, cast.player.smooth.Manifest.Quality);
cast.player.smooth.Manifest.Stream = function(manifest, node) {
  this.type = new cast.player.common.StringValue("Type");
  this.url = new cast.player.common.StringValue("Url");
  this.name = new cast.player.common.StringValue("Name");
  this.lang = new cast.player.common.StringValue("Language");
  cast.player.common.parseAttributes(node.attributes, this);
  this.streamType = cast.player.common.StreamType.UNKNOWN;
  "video" === this.type.value ? this.streamType = cast.player.common.StreamType.VIDEO : "audio" === this.type.value ? this.streamType = cast.player.common.StreamType.AUDIO : "text" === this.type.value && (this.streamType = cast.player.common.StreamType.TEXT);
  this.segments = [];
  this.qualities = [];
  for (var time = new cast.player.common.BigPositiveInt("0"), child = node.firstElementChild;null != child;child = child.nextElementSibling) {
    if ("QualityLevel" === child.nodeName) {
      var quality = null;
      this.streamType === cast.player.common.StreamType.VIDEO ? quality = new cast.player.smooth.Manifest.VideoQuality(child) : this.streamType === cast.player.common.StreamType.AUDIO ? quality = new cast.player.smooth.Manifest.AudioQuality(child) : this.streamType === cast.player.common.StreamType.TEXT && (quality = new cast.player.smooth.Manifest.TextQuality(child));
      quality && quality.fourcc.value && this.qualities.push(quality);
    } else {
      if ("c" === child.nodeName) {
        var timeAttribute = child.attributes.getNamedItem("t");
        timeAttribute && (time = new cast.player.common.BigPositiveInt(timeAttribute.value));
        var timeScale = manifest.timeScale.value ? manifest.timeScale.value : 1, durationAttribute = child.attributes.getNamedItem("d"), duration = null, scaledDuration;
        durationAttribute ? (duration = parseInt(child.attributes.d.value, 10), scaledDuration = duration / timeScale) : scaledDuration = null;
        var repeat, repeatAttribute = child.attributes.getNamedItem("r");
        repeat = repeatAttribute ? parseInt(repeatAttribute.value, 10) : 1;
        for (var i = 0;i < repeat;i++) {
          var segment = {time:parseInt(time.toString(), 10) / timeScale, duration:scaledDuration, originalTime:new cast.player.common.BigPositiveInt(time.toString())};
          this.segments.push(segment);
          duration && time.add(duration);
        }
      }
    }
  }
  for (var count = this.segments.length - 1, i = 0;i < count;i++) {
    var segment = this.segments[i], segmentNext = this.segments[i + 1];
    null === segment.duration && (segment.duration = segmentNext.originalTime.difference(segment.originalTime) / timeScale);
  }
};
cast.player.smooth.Manifest.ProtectionHeader = function(node) {
  this.systemId = new cast.player.smooth.Manifest.GuidValue("SystemID");
  cast.player.common.parseAttributes(node.attributes, this);
  this.url = this.kid = null;
  this.ivSize = 8;
  this.header = cast.player.common.stringToArray(window.atob(node.textContent.trim()));
  for (var length = (this.header.length - 10) / 2, array = new Uint8Array(length), i = 0, j = 10;i < length && 31 < this.header[j];i++, j += 2) {
    array[i] = this.header[j];
  }
  var array = array.subarray(0, i), s = String.fromCharCode.apply(null, array), parser = new DOMParser, dom = parser.parseFromString(s, "text/xml");
  if (0 < dom.childNodes.length) {
    var data = dom.childNodes[0].firstElementChild;
    if (data) {
      for (var child = data.firstElementChild;null != child;child = child.nextElementSibling) {
        "LA_URL" === child.nodeName ? this.url = child.textContent : "KID" === child.nodeName && (this.kid = cast.player.common.stringToArray(window.atob(child.textContent)));
      }
    }
  }
};
cast.player.smooth.Smooth = function(host) {
  cast.player.common.StreamingProtocol.call(this, host);
  this.protection_ = null;
  this.timeScale_ = cast.player.common.Mp4Box.TIME_SCALE;
};
goog.inherits(cast.player.smooth.Smooth, cast.player.common.StreamingProtocol);
cast.player.smooth.Smooth.setVideoRepresentation_ = function(representation, quality) {
  representation.width = quality.width.value;
  representation.height = quality.height.value;
  representation.sps = quality.codecPrivateData.sps;
  representation.pps = quality.codecPrivateData.pps;
};
cast.player.smooth.Smooth.setAudioRepresentation_ = function(representation, quality) {
  representation.codecPrivateData = quality.codecPrivateData.value;
  representation.sampleRate = quality.sampleRate.value;
  representation.objectType = cast.player.common.Mp4Box.AudioObjectType.MPEG4_AAC;
};
cast.player.smooth.Smooth.prototype.reload_ = function(manifest) {
  var i, j, k;
  for (i = 0;i < manifest.streams.length;i++) {
    var stream = manifest.streams[i];
    for (j = 0;j < this.adaptations.length;j++) {
      var adaptation = this.adaptations[j];
      if (stream.lang.value === adaptation.lang && (stream.streamType === cast.player.common.StreamType.AUDIO && adaptation.type === cast.player.common.StreamType.AUDIO || stream.streamType === cast.player.common.StreamType.VIDEO && adaptation.type === cast.player.common.StreamType.VIDEO || stream.streamType === cast.player.common.StreamType.TEXT && adaptation.type === cast.player.common.StreamType.TEXT)) {
        var segmentsNew = stream.segments, representation = adaptation.representations[0], segmentsOld = representation.segments.slice(adaptation.index), time = segmentsOld[segmentsOld.length - 1].time;
        for (k = 0;k < segmentsNew.length && !(segmentsNew[k].time > time);k++) {
        }
        k === segmentsNew.length ? segmentsNew = segmentsOld : (segmentsNew = segmentsNew.slice(k), segmentsNew = segmentsOld.concat(segmentsNew));
        for (k = adaptation.index = 0;k < adaptation.representations.length;k++) {
          adaptation.representations[k].segments = segmentsNew;
        }
      }
    }
  }
};
cast.player.smooth.Smooth.prototype.normalize_ = function(manifest) {
  var adaptation, representation, protection = manifest.protection;
  protection && protection.systemId.value && protection.header && protection.kid && (this.protection_ = {systemId:protection.systemId.value, header:protection.header, kid:protection.kid, url:protection.url, ivSize:protection.ivSize});
  manifest.timeScale.value && (this.timeScale_ = manifest.timeScale.value);
  this.duration = manifest.duration.value ? manifest.duration.value / this.timeScale_ : 0;
  for (var timeOffset = Infinity, i = 0;i < manifest.streams.length;i++) {
    var stream = manifest.streams[i];
    (stream.streamType === cast.player.common.StreamType.VIDEO || stream.streamType === cast.player.common.StreamType.AUDIO) && stream.segments[0].time < timeOffset && (timeOffset = stream.segments[0].time);
  }
  for (i = 0;i < manifest.streams.length;i++) {
    if (stream = manifest.streams[i], stream.streamType === cast.player.common.StreamType.VIDEO) {
      var videoQuality = stream.qualities[0];
      adaptation = {type:cast.player.common.StreamType.VIDEO, enabled:!1, needInit:!0, representations:[], lang:stream.lang.value, mimeType:"video/mp4", codecs:videoQuality.fourcc.value + videoQuality.codecPrivateData.sps[3].toString(16).toLowerCase(), index:-1, qualityLevel:-1};
      for (var j = 0;j < stream.qualities.length;j++) {
        videoQuality = stream.qualities[j], representation = {type:cast.player.common.StreamType.VIDEO, url:stream.url.value, bitrate:videoQuality.bitrate.value || 0, timeOffset:-timeOffset, segments:stream.segments, id:stream.name.value, init:null, range:null, protection:null}, representation.protection = this.protection_, cast.player.smooth.Smooth.setVideoRepresentation_(representation, videoQuality), adaptation.representations.push(representation);
      }
      this.adaptations.push(adaptation);
    } else {
      if (stream.streamType === cast.player.common.StreamType.AUDIO) {
        adaptation = {type:cast.player.common.StreamType.AUDIO, enabled:!1, needInit:!0, representations:[], lang:stream.lang.value, mimeType:"audio/mp4", codecs:stream.qualities[0].fourcc.value || "", index:-1, qualityLevel:-1};
        for (j = 0;j < stream.qualities.length;j++) {
          var audioQuality = stream.qualities[j];
          if (null === audioQuality.codecPrivateData.value || null === audioQuality.sampleRate.value) {
            this.host.onError(cast.player.api.ErrorCode.MANIFEST);
            return;
          }
          representation = {type:cast.player.common.StreamType.AUDIO, url:stream.url.value, bitrate:audioQuality.bitrate.value || 0, timeOffset:-timeOffset, segments:stream.segments, id:stream.name.value, range:null, init:null, protection:null};
          representation.protection = this.protection_;
          cast.player.smooth.Smooth.setAudioRepresentation_(representation, audioQuality);
          adaptation.representations.push(representation);
        }
        this.adaptations.push(adaptation);
      } else {
        if (stream.streamType === cast.player.common.StreamType.TEXT) {
          adaptation = {type:cast.player.common.StreamType.TEXT, enabled:!1, needInit:!1, representations:[], lang:stream.lang.value, mimeType:"text/mp4", codecs:stream.qualities[0].fourcc.value, index:-1, qualityLevel:-1};
          for (j = 0;j < stream.qualities.length;j++) {
            var textQuality = stream.qualities[j];
            representation = {type:cast.player.common.StreamType.TEXT, bitrate:textQuality.bitrate.value || 0, timeOffset:0, segments:stream.segments, id:stream.name.value, url:stream.url.value, range:null, init:null, protection:null};
            adaptation.representations.push(representation);
          }
          this.adaptations.push(adaptation);
        }
      }
    }
  }
  this.isLive = manifest.isLive.value || !1;
};
cast.player.smooth.Smooth.prototype.load = function(manifestReadyCallback, playlistReadyCallback, sourceBufferCallback) {
  cast.player.smooth.Smooth.superClass_.load.call(this, manifestReadyCallback, playlistReadyCallback, sourceBufferCallback);
  this.manifestLoader.load(this.requestInfo, this);
};
cast.player.smooth.Smooth.prototype.update_ = function(streamIndex, segments) {
  if (0 != segments.length) {
    var adaptation = this.adaptations[streamIndex], index = adaptation.index;
    segments.splice(0, 0, adaptation.representations[0].segments[index]);
    for (var i = 0;i < adaptation.representations.length;i++) {
      adaptation.representations[i].segments = segments;
    }
    adaptation.index = 0;
  }
};
cast.player.smooth.Smooth.prototype.onManifestLoaded = function(response) {
  var manifest = null;
  if (response) {
    for (var parser = new DOMParser, dom = parser.parseFromString(response, "text/xml"), i = 0;i < dom.childNodes.length;i++) {
      if ("SmoothStreamingMedia" === dom.childNodes[i].nodeName) {
        manifest = new cast.player.smooth.Manifest(dom.childNodes[i]);
        break;
      }
    }
  }
  if (manifest) {
    this.manifestReadyCallback ? (this.normalize_(manifest), this.enableStreams(), this.manifestReadyCallback.onManifestReady(), this.manifestReadyCallback = null) : this.reload_(manifest), this.playlistReadyCallback && (this.playlistReadyCallback.onPlaylistReady(), this.playlistReadyCallback = null);
  } else {
    this.host.onError(cast.player.api.ErrorCode.NETWORK, this.manifestLoader.getRequestStatus());
  }
};
cast.player.smooth.Smooth.prototype.getContentProtectionSystems = function() {
  return["playready"];
};
cast.player.smooth.Smooth.prototype.updateLicenseRequestInfo = function(requestInfo) {
  requestInfo.headers = {};
  requestInfo.headers["content-type"] = "text/xml;charset=utf-8";
  requestInfo.url = this.protection_.url;
};
cast.player.smooth.Smooth.prototype.getInitSegment = function(streamIndex) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, representation = adaptation.representations[qualityLevel];
  adaptation.needInit = !1;
  return cast.player.smooth.Data.createInit(representation);
};
cast.player.smooth.Smooth.prototype.updateSegmentRequestInfo = function(streamIndex, requestInfo) {
  var adaptation = this.adaptations[streamIndex], qualityLevel = adaptation.qualityLevel, index = adaptation.index, representation = adaptation.representations[qualityLevel], url = representation.url, url = url.replace("{bitrate}", representation.bitrate.toString()), url = url.replace("{start time}", representation.segments[index].originalTime.toString());
  requestInfo.url = this.resolveUrl(url).toString();
};
cast.player.smooth.Smooth.prototype.processSegment = function(streamIndex, data, segmentProcessedCallback) {
  var adaptation = this.adaptations[streamIndex];
  if (this.isLive) {
    var segments = cast.player.smooth.Data.extractSegments(this.timeScale_, data);
    this.update_(streamIndex, segments);
  }
  var qualityLevel = adaptation.qualityLevel, index = adaptation.index, representation = adaptation.representations[qualityLevel], segments = representation.segments, processedData;
  adaptation.type === cast.player.common.StreamType.TEXT ? (processedData = cast.player.smooth.Data.extractData(data), segmentProcessedCallback.onSegmentProcessed(processedData, segments[index].time)) : (processedData = cast.player.smooth.Data.processSegment(data, parseInt(segments[index].originalTime.toString(), 10), this.protection_ ? !0 : !1), segmentProcessedCallback.onSegmentProcessed(processedData, representation.timeOffset));
};
cast.player.api.CreateDashStreamingProtocol = function(host) {
  return new cast.player.dash.Dash(host);
};
goog.exportSymbol("cast.player.api.CreateDashStreamingProtocol", cast.player.api.CreateDashStreamingProtocol);
cast.player.api.CreateHlsStreamingProtocol = function(host, opt_format) {
  return new cast.player.hls.Hls(host, opt_format);
};
goog.exportSymbol("cast.player.api.CreateHlsStreamingProtocol", cast.player.api.CreateHlsStreamingProtocol);
cast.player.api.CreateSmoothStreamingProtocol = function(host) {
  return new cast.player.smooth.Smooth(host);
};
goog.exportSymbol("cast.player.api.CreateSmoothStreamingProtocol", cast.player.api.CreateSmoothStreamingProtocol);
cast.player.ts608 = {};
cast.player.ts608.Decoder = function(decoderCallback) {
  this.decoderCallback = decoderCallback;
  this.badFrames_ = this.time_ = this.modeSelect = this.mode = 0;
  this.field1_ = new cast.player.ts608.Decoder.CcField(this);
  this.field2_ = new cast.player.ts608.Decoder.CcField(this);
  this.ccDataArray_ = [];
  this.reset();
  this.setMode(cast.player.ts608.Decoder.CcMode.CC1);
};
cast.player.ts608.Decoder.prototype.getTimestamp = function() {
  return this.time_;
};
cast.player.ts608.Decoder.CcMode = {CC1:0, TEXT1:1, CC2:2, TEXT2:3, CC3:4, TEXT3:5, CC4:6, TEXT4:7, XDS:8, COUNT:9};
cast.player.ts608.Decoder.CCMODE_MASK_ALL = (1 << cast.player.ts608.Decoder.CcMode.COUNT) - 1;
cast.player.ts608.Decoder.CCMODE_MASK_FIELD1 = (1 << cast.player.ts608.Decoder.CcMode.CC3) - 1;
cast.player.ts608.Decoder.CCMODE_MASK_FIELD2 = cast.player.ts608.Decoder.CCMODE_MASK_ALL & ~cast.player.ts608.Decoder.CCMODE_MASK_FIELD1;
cast.player.ts608.Decoder.CC_PE = 128;
cast.player.ts608.Decoder.Style = function() {
  this.type_ = cast.player.ts608.Decoder.Style.Type.NONE;
};
cast.player.ts608.Decoder.Style.Type = {NONE:0, POPON:1, PAINTON:2, ROLLUP:3, TEXT:4};
cast.player.ts608.Decoder.Style.prototype.set = function(type) {
  this.type_ = type;
};
cast.player.ts608.Decoder.Style.prototype.val = function() {
  return this.type_;
};
cast.player.ts608.Decoder.Style.prototype.clear = function() {
  this.type_ = cast.player.ts608.Decoder.Style.Type.NONE;
};
cast.player.ts608.Decoder.Style.prototype.isPainton = function() {
  return this.style_ === cast.player.ts608.Decoder.Style.Type.PAINTON;
};
cast.player.ts608.Decoder.Style.prototype.isText = function() {
  return this.style_ == cast.player.ts608.Decoder.Style.Type.TEXT;
};
cast.player.ts608.Decoder.Style.prototype.isPainty = function() {
  return this.style_ >= cast.player.ts608.Decoder.Style.Type.PAINTON;
};
cast.player.ts608.Decoder.LastControlPair = function() {
  this.state_ = cast.player.ts608.Decoder.LastControlPair.State_.NONE;
  this.b2_ = this.b1_ = 0;
};
cast.player.ts608.Decoder.LastControlPair.State_ = {NONE:0, OLD:1, NEW:2};
cast.player.ts608.Decoder.LastControlPair.prototype.setNewPair = function(b1, b2) {
  this.b1_ = b1;
  this.b2_ = b2;
  this.state_ = cast.player.ts608.Decoder.LastControlPair.State_.NEW;
};
cast.player.ts608.Decoder.LastControlPair.prototype.clear = function() {
  this.state_ = cast.player.ts608.Decoder.LastControlPair.State_.NONE;
};
cast.player.ts608.Decoder.LastControlPair.prototype.update = function() {
  this.state_ = this.state_ == cast.player.ts608.Decoder.LastControlPair.State_.NEW ? cast.player.ts608.Decoder.LastControlPair.State_.OLD : cast.player.ts608.Decoder.LastControlPair.State_.NONE;
};
cast.player.ts608.Decoder.LastControlPair.prototype.isValid = function() {
  return this.state_ != cast.player.ts608.Decoder.LastControlPair.State_.NONE;
};
cast.player.ts608.Decoder.LastControlPair.prototype.matches = function(b1, b2) {
  return this.isValid() && b1 == this.b1_ && b2 == this.b2_;
};
cast.player.ts608.Decoder.LastControlPair.prototype.matchesB2 = function(b2) {
  return this.isValid() && this.b2_ == b2;
};
cast.player.ts608.Decoder.CcChar = function() {
  this.timestamp = this.byteValue = this.utfValue = 0;
  this.isEmitted = this.isPainton = !1;
};
cast.player.ts608.Decoder.CcChar.prototype.set = function(ch) {
  this.utfValue = ch.utfValue;
  this.byteValue = ch.byteValue;
  this.timestamp = ch.timestamp;
  this.isPainton = ch.isPainton;
  this.isEmitted = ch.isEmitted;
};
cast.player.ts608.Decoder.CcChar.prototype.reset = function() {
  this.timestamp = this.byteValue = this.utfValue = 0;
  this.isEmitted = this.isPainton = !1;
};
cast.player.ts608.Decoder.Memory = function(decoder) {
  this.buf_ = [];
  for (var i = 0;i <= cast.player.ts608.Decoder.Memory.CC_ROWS;i++) {
    this.buf_[i] = [];
    for (var j = 0;j <= cast.player.ts608.Decoder.Memory.CC_COLS;j++) {
      this.buf_[i][j] = new cast.player.ts608.Decoder.CcChar;
    }
  }
  this.nrows = this.col = this.row = 0;
  this.style_ = new cast.player.ts608.Decoder.Style;
  this.decoder_ = decoder;
  this.modeidx = -1;
};
cast.player.ts608.Decoder.Memory.prototype.forceEmit = function() {
  for (var text = "", startTime = this.decoder_.getTimestamp(), endTime = startTime, r = 1;r <= cast.player.ts608.Decoder.Memory.CC_ROWS;++r) {
    for (var rowText = "", printableText = !1, c = 1;c <= cast.player.ts608.Decoder.Memory.CC_COLS;++c) {
      var cch = this.buf_[r][c];
      if (0 !== cch.utfValue) {
        var char = String.fromCharCode(cch.utfValue);
        " " !== char && (printableText = !0);
        var rowText = rowText + char, time = cch.timestamp;
        time < startTime && (startTime = time);
        time > endTime && (endTime = time);
        if (!cch.isEmitted && " " === char && printableText && c < cast.player.ts608.Decoder.Memory.CC_COLS) {
          this.decoder_.decoderCallback.onEmit(startTime, endTime, text + rowText);
        }
        cch.isEmitted = !0;
      }
    }
    rowText && (text += rowText + "\n");
  }
  this.decoder_.decoderCallback.onEmit(startTime, endTime, text);
};
cast.player.ts608.Decoder.Memory.CC_ROWS = 15;
cast.player.ts608.Decoder.Memory.CC_COLS = 32;
cast.player.ts608.Decoder.Memory.prototype.reset = function(idx) {
  for (var i = 0;i <= cast.player.ts608.Decoder.Memory.CC_ROWS;i++) {
    for (var j = 0;j <= cast.player.ts608.Decoder.Memory.CC_COLS;j++) {
      this.buf_[i][j].reset();
    }
  }
  this.modeidx = idx;
  this.nrows = 0;
  this.col = this.row = 1;
};
cast.player.ts608.Decoder.Memory.ccutftab0_ = [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 225, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 233, 93, 237, 243, 250, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 231, 247, 209, 241, 9632];
cast.player.ts608.Decoder.Memory.ccutftab1_ = [174, 176, 189, 191, 8482, 162, 163, 9834, 224, 32, 232, 226, 234, 238, 244, 251];
cast.player.ts608.Decoder.Memory.ccchar2UTF32_ = function(set, b) {
  switch(set) {
    case 0:
      return cast.player.ts608.Decoder.Memory.ccutftab0_[(b & 127) - 32];
    case 1:
      return cast.player.ts608.Decoder.Memory.ccutftab1_[b & 15];
  }
  return 0;
};
cast.player.ts608.Decoder.Memory.prototype.getCharForBuffer_ = function() {
  return this.buf_[this.row][this.col];
};
cast.player.ts608.Decoder.Memory.prototype.addChar = function(set, b) {
  2 <= set && 1 < this.col && (--this.col, this.eraseChar());
  var cch = this.getCharForBuffer_();
  cch.timestamp = this.decoder_.getTimestamp();
  cch.isPainton = this.style_.isPainty();
  cch.byteValue = b;
  cch.utfValue = cast.player.ts608.Decoder.Memory.ccchar2UTF32_(set, b);
  32 > this.col && this.col++;
};
cast.player.ts608.Decoder.Memory.prototype.addTranspSpace = function() {
  var cch = this.getCharForBuffer_();
  cch.byteValue = 0;
  cch.utfValue = 0;
  32 > this.col && this.col++;
};
cast.player.ts608.Decoder.Memory.prototype.eraseChar = function() {
  var cch = this.getCharForBuffer_();
  cch.byteValue = 0;
  cch.utfValue = 0;
};
cast.player.ts608.Decoder.Memory.prototype.moveRows = function(dst, src, count) {
  for (var i = 0;i < count;i++) {
    for (var j = 0;j <= cast.player.ts608.Decoder.Memory.CC_COLS;j++) {
      this.buf_[dst + i][j].set(this.buf_[src + i][j]);
    }
  }
};
cast.player.ts608.Decoder.Memory.prototype.resetRows = function(idx, count) {
  for (var i = 0;i < count;i++) {
    for (var j = 0;j <= cast.player.ts608.Decoder.Memory.CC_COLS;j++) {
      this.buf_[idx + i][j].reset();
    }
  }
};
cast.player.ts608.Decoder.Memory.prototype.resetAll = function() {
  this.resetRows(0, cast.player.ts608.Decoder.Memory.CC_ROWS);
};
cast.player.ts608.Decoder.Memory.prototype.eraseRow = function() {
  for (var cch = this.getCharForBuffer_(), i = 0;i <= cast.player.ts608.Decoder.Memory.CC_ROWS;i++) {
    for (var j = 0;j <= cast.player.ts608.Decoder.Memory.CC_COLS;j++) {
      if (this.buf_[i][j] === cch) {
        for (var k = j;k <= cast.player.ts608.Decoder.Memory.CC_COLS;j++) {
          this.buf_[i][k].reset();
        }
        break;
      }
    }
  }
};
cast.player.ts608.Decoder.Memory.prototype.eraseBuffer = function() {
  this.row = 0 < this.nrows ? this.nrows : 1;
  this.col = 1;
  this.resetAll();
};
cast.player.ts608.Decoder.Memory.prototype.updateBufferMove = function(row) {
  var oldtoprow = 1 + this.row - this.nrows, newtoprow = 1 + row - this.nrows;
  this.moveRows(newtoprow, oldtoprow, this.nrows);
  var oldrow = oldtoprow, clrrows = this.nrows;
  if (newtoprow < oldtoprow) {
    var overlap = newtoprow + clrrows - oldtoprow;
    0 < overlap && (oldrow += overlap, clrrows -= overlap);
  } else {
    overlap = oldtoprow + clrrows - newtoprow, 0 < overlap && (clrrows -= overlap);
  }
  this.resetRows(oldrow, clrrows);
};
cast.player.ts608.Decoder.CcChan = function(decoder) {
  this.decoder_ = decoder;
  this.chnum = 0;
  this.style = new cast.player.ts608.Decoder.Style;
  this.mem1_ = new cast.player.ts608.Decoder.Memory(decoder);
  this.mem2_ = new cast.player.ts608.Decoder.Memory(decoder);
  this.text_ = new cast.player.ts608.Decoder.Memory(decoder);
  this.curbuf = this.dpm_ = this.mem1_;
  this.ndm_ = this.mem2_;
};
cast.player.ts608.Decoder.CcChan.prototype.reset = function(fldnum, chnum) {
  this.chnum = chnum;
  this.style.set(cast.player.ts608.Decoder.Style.Type.PAINTON);
  this.dpm_ = this.mem1_;
  this.ndm_ = this.mem2_;
  this.curbuf = this.dpm_;
  var idx = cast.player.ts608.Decoder.getCcMode(fldnum, chnum, !1);
  this.mem1_.reset(idx);
  this.mem2_.reset(idx);
  this.text_.reset(cast.player.ts608.Decoder.getCcMode(fldnum, chnum, !0));
};
cast.player.ts608.Decoder.CcChan.ccpac2row_ = function(b1, b2) {
  var ccrowtab = [11, 11, 1, 2, 3, 4, 12, 13, 14, 15, 5, 6, 7, 8, 9, 10];
  return ccrowtab[(b1 & 7) << 1 | b2 >> 5 & 1];
};
cast.player.ts608.Decoder.CcChan.B2_ATTR_UNDERLINE = 1;
cast.player.ts608.Decoder.CcChan.B2_ATTR_INDENT = 16;
cast.player.ts608.Decoder.CcChan.B2_COL_MASK = 14;
cast.player.ts608.Decoder.CcChan.B2_CMD_RCL = 32;
cast.player.ts608.Decoder.CcChan.B2_CMD_BS = 33;
cast.player.ts608.Decoder.CcChan.B2_CMD_AOD = 34;
cast.player.ts608.Decoder.CcChan.B2_CMD_AON = 35;
cast.player.ts608.Decoder.CcChan.B2_CMD_DER = 36;
cast.player.ts608.Decoder.CcChan.B2_CMD_RU2 = 37;
cast.player.ts608.Decoder.CcChan.B2_CMD_RU3 = 38;
cast.player.ts608.Decoder.CcChan.B2_CMD_RU4 = 39;
cast.player.ts608.Decoder.CcChan.B2_CMD_FON = 40;
cast.player.ts608.Decoder.CcChan.B2_CMD_RDC = 41;
cast.player.ts608.Decoder.CcChan.B2_CMD_TR = 42;
cast.player.ts608.Decoder.CcChan.B2_CMD_RTD = 43;
cast.player.ts608.Decoder.CcChan.B2_CMD_EDM = 44;
cast.player.ts608.Decoder.CcChan.B2_CMD_CR = 45;
cast.player.ts608.Decoder.CcChan.B2_CMD_ENM = 46;
cast.player.ts608.Decoder.CcChan.B2_CMD_EOC = 47;
cast.player.ts608.Decoder.CcChan.prototype.controlTO = function(offset) {
  var buf = this.curbuf;
  32 < (buf.col_ += offset) && (buf.col_ = 32);
};
cast.player.ts608.Decoder.CcChan.prototype.controlPAC = function(b1, b2) {
  var row = cast.player.ts608.Decoder.CcChan.ccpac2row_(b1, b2), cols, attr = (b2 & cast.player.ts608.Decoder.CcChan.B2_COL_MASK) >> 1;
  cols = b2 & cast.player.ts608.Decoder.CcChan.B2_ATTR_INDENT ? 4 * attr : 0;
  var buf = this.curbuf;
  switch(this.style.val()) {
    case cast.player.ts608.Decoder.Style.Type.TEXT:
      row = buf.row;
      break;
    case cast.player.ts608.Decoder.Style.Type.ROLLUP:
      if (row != buf.row) {
        if (row < buf.nrows && (row = buf.nrows, row == buf.row)) {
          break;
        }
        buf.updateBufferMove(row);
      }
    ;
  }
  buf.row = row;
  buf.col = cols + 1;
};
cast.player.ts608.Decoder.CcChan.prototype.controlMidrow = function() {
  var buf = this.curbuf;
  buf.addChar(0, 32);
};
cast.player.ts608.Decoder.CcChan.prototype.controlDispatch = function(b2) {
  switch(b2) {
    case cast.player.ts608.Decoder.CcChan.B2_CMD_RCL:
      this.controlRCL();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_BS:
      this.controlBS();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_DER:
      this.controlDER();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_RU2:
      this.controlRU(2);
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_RU3:
      this.controlRU(3);
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_RU4:
      this.controlRU(4);
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_FON:
      this.controlFON();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_RDC:
      this.controlRDC();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_TR:
      this.controlTR();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_RTD:
      this.controlRTD();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_EDM:
      this.controlEDM();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_CR:
      this.controlCR();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_ENM:
      this.controlENM();
      break;
    case cast.player.ts608.Decoder.CcChan.B2_CMD_EOC:
      this.controlEOC();
  }
};
cast.player.ts608.Decoder.CcChan.prototype.controlDER = function() {
  this.curbuf.eraseRow();
};
cast.player.ts608.Decoder.CcChan.prototype.controlCR = function() {
  var buf = this.curbuf;
  switch(this.style.val()) {
    default:
    ;
    case cast.player.ts608.Decoder.Style.Type.PAINTON:
    ;
    case cast.player.ts608.Decoder.Style.Type.POPON:
      return;
    case cast.player.ts608.Decoder.Style.Type.TEXT:
      if (15 > buf.row) {
        ++buf.row;
        buf.col = 1;
        return;
      }
    ;
    case cast.player.ts608.Decoder.Style.Type.ROLLUP:
    ;
  }
  2 > buf.nrows && (buf.nrows_ = 2, buf.row < buf.nrows && (buf.row = buf.nrows));
  var toprow = buf.row - buf.nrows + 1;
  buf.forceEmit();
  buf.moveRows(toprow, toprow + 1, buf.nrows - 1);
  buf.resetRows(buf.row, 1);
};
cast.player.ts608.Decoder.CcChan.prototype.controlRU = function(nrows) {
  var buf = this.dpm_;
  switch(this.style.val()) {
    case cast.player.ts608.Decoder.Style.Type.TEXT:
      if (0 < buf.nrows) {
        break;
      }
    ;
    case cast.player.ts608.Decoder.Style.Type.POPON:
    ;
    case cast.player.ts608.Decoder.Style.Type.PAINTON:
      buf.forceEmit(), this.dpm_.eraseBuffer(), this.ndm_.eraseBuffer(), buf.row = 15, buf.nrows = nrows;
  }
  this.style.set(cast.player.ts608.Decoder.Style.Type.ROLLUP);
  this.curbuf = buf;
  this.curbuf.style = this.style;
  this.decoder_.mode = 1 << buf.modeidx;
  buf.col = 1;
  buf.nrows != nrows && (buf.nrows > nrows ? (buf.forceEmit(), buf.resetRows(buf.row - buf.nrows, nrows)) : buf.row < nrows && (nrows = buf.nrows), buf.nrows = nrows);
};
cast.player.ts608.Decoder.CcChan.prototype.controlFON = function() {
  this.curbuf.addChar(0, 32);
};
cast.player.ts608.Decoder.CcChan.prototype.controlEDM = function() {
  var buf = this.dpm_;
  switch(this.style.val()) {
    case cast.player.ts608.Decoder.Style.Type.POPON:
    ;
    case cast.player.ts608.Decoder.Style.Type.PAINTON:
    ;
    case cast.player.ts608.Decoder.Style.Type.ROLLUP:
      buf.forceEmit();
  }
  buf.resetAll();
};
cast.player.ts608.Decoder.CcChan.prototype.controlRDC = function() {
  this.style.set(cast.player.ts608.Decoder.Style.Type.PAINTON);
  this.curbuf = this.dpm_;
  this.curbuf.nrows_ = 0;
  this.curbuf.style = this.style;
  this.decoder_.mode = 1 << this.curbuf.modeidx;
};
cast.player.ts608.Decoder.CcChan.prototype.controlENM = function() {
  var buf = this.ndm_;
  buf.resetAll();
};
cast.player.ts608.Decoder.CcChan.prototype.controlEOC = function() {
  this.dpm_.forceEmit();
  var buf = this.ndm_;
  this.ndm_ = this.dpm_;
  this.dpm_ = buf;
  this.controlRCL();
};
cast.player.ts608.Decoder.CcChan.prototype.controlRCL = function() {
  this.style.set(cast.player.ts608.Decoder.Style.Type.POPON);
  this.curbuf = this.ndm_;
  this.curbuf.nrows_ = 0;
  this.curbuf.style = this.style;
  this.decoder_.mode = 1 << this.curbuf.modeidx;
};
cast.player.ts608.Decoder.CcChan.prototype.controlBS = function() {
  var buf = this.curbuf;
  1 < buf.col_ && (--buf.col_, buf.eraseChar());
};
cast.player.ts608.Decoder.CcChan.prototype.controlTR = function() {
  var buf = this.text_;
  buf.nrows = 15;
  buf.style_.set(cast.player.ts608.Decoder.Style.Type.TEXT);
  buf.eraseBuffer();
  this.controlRTD();
};
cast.player.ts608.Decoder.CcChan.prototype.controlRTD = function() {
  this.style.set(cast.player.ts608.Decoder.Style.Type.TEXT);
  this.curbuf = this.text_;
  this.curbuf.style = this.style;
  this.decoder_.mode = 1 << this.curbuf.modeidx;
};
cast.player.ts608.Decoder.CcField = function(decoder) {
  this.lastcp_ = new cast.player.ts608.Decoder.LastControlPair;
  this.decoder_ = decoder;
  this.fldnum_ = 0;
  this.c1_ = new cast.player.ts608.Decoder.CcChan(decoder);
  this.c2_ = new cast.player.ts608.Decoder.CcChan(decoder);
  this.curchan_ = this.c1_;
};
cast.player.ts608.Decoder.CcField.prototype.reset = function(fldnum) {
  this.fldnum_ = fldnum;
  this.lastcp_.clear();
  this.curchan_ = this.c1_;
  this.c1_.reset(fldnum, 0);
  this.c2_.reset(fldnum, 1);
};
cast.player.ts608.Decoder.CcField.prototype.convertField = function(b1, b2) {
  this.lastcp_.update();
  var parity = cast.player.ts608.Decoder.handleParity(b1, b2, this.lastcp_);
  switch(parity.result) {
    case cast.player.ts608.Decoder.ParityResult.BADFIELD:
      return!1;
    case cast.player.ts608.Decoder.ParityResult.NOOP1:
    ;
    case cast.player.ts608.Decoder.ParityResult.NOOP2:
      return!0;
  }
  this.decodePair_(parity.b1, parity.b2);
  return!0;
};
cast.player.ts608.Decoder.CcField.prototype.decodePair_ = function(b1, b2) {
  32 <= b1 || !b1 ? this.decoder_.mode & this.decoder_.modeSelect && this.decodePairText_(b1, b2) : b1 & 16 && this.decodePairControl_(b1, b2);
};
cast.player.ts608.Decoder.CcField.prototype.decodePairText_ = function(b1, b2) {
  b1 & cast.player.ts608.Decoder.CC_PE && (b1 = 127);
  b2 & cast.player.ts608.Decoder.CC_PE && (b2 = 127);
  var mem = this.getCurMemory_();
  b1 & 96 && mem.addChar(0, b1);
  b2 & 96 && mem.addChar(0, b2);
};
cast.player.ts608.Decoder.CcField.CC_CHAR1_TRANSP = 57;
cast.player.ts608.Decoder.CcField.prototype.decodePairControl_ = function(b1, b2) {
  var chan;
  if (!this.lastcp_.matches(b1, b2)) {
    this.lastcp_.setNewPair(b1, b2);
    this.curchan_ = chan = b1 & 8 ? this.c2_ : this.c1_;
    this.decoder_.mode = cast.player.ts608.Decoder.getCcModeBit(this.fldnum_, chan.chnum, chan.style.isText());
    var texttoo = cast.player.ts608.Decoder.getCcModeBit(this.fldnum_, chan.chnum, !chan.style.isText());
    if ((this.decoder_.mode | texttoo) & this.decoder_.modeSelect) {
      if (b2 & 64) {
        chan.controlPAC(b1, b2);
      } else {
        switch(b1 & 7) {
          case 1:
            switch(b2 & 112) {
              case 32:
                chan.controlMidrow(b2);
                return;
              case 48:
                b2 == cast.player.ts608.Decoder.CcField.CC_CHAR1_TRANSP ? chan.curbuf.addTranspSpace() : chan.curbuf.addChar(1, b2 & 15);
                return;
            }
            break;
          case 2:
            if (b2 & 32) {
              chan.curbuf.addChar(2, b2 & 31);
              break;
            }
            break;
          case 3:
            if (b2 & 32) {
              chan.curbuf.addChar(3, b2 & 31);
              break;
            }
            break;
          case 4:
          ;
          case 5:
            if (32 <= b2 && 47 >= b2) {
              chan.controlDispatch(b2);
              break;
            }
            break;
          case 7:
            switch(b2) {
              case 33:
              ;
              case 34:
              ;
              case 35:
                chan.controlTO(b2 & 3);
            }
          ;
        }
      }
    }
  }
};
cast.player.ts608.Decoder.CcField.prototype.getCurMemory_ = function() {
  return this.curchan_.curbuf;
};
cast.player.ts608.Decoder.prototype.reset = function() {
  this.mode = 0;
  this.field1_.reset(0);
  this.field2_.reset(1);
};
cast.player.ts608.Decoder.getCcMode = function(field, chan, textmode) {
  return(field << 2) + (chan << 1) + (textmode ? 1 : 0);
};
cast.player.ts608.Decoder.getCcModeBit = function(field, chan, textmode) {
  return 1 << cast.player.ts608.Decoder.getCcMode(field, chan, textmode);
};
cast.player.ts608.Decoder.parityBytes_ = [128, 1, 2, 131, 4, 133, 134, 7, 8, 137, 138, 11, 140, 13, 14, 143, 16, 145, 146, 19, 148, 21, 22, 151, 152, 25, 26, 155, 28, 157, 158, 31, 32, 161, 162, 35, 164, 37, 38, 167, 168, 41, 42, 171, 44, 173, 174, 47, 176, 49, 50, 179, 52, 181, 182, 55, 56, 185, 186, 59, 188, 61, 62, 191, 64, 193, 194, 67, 196, 69, 70, 199, 200, 73, 74, 203, 76, 205, 206, 79, 208, 81, 82, 211, 84, 213, 214, 87, 88, 217, 218, 91, 220, 93, 94, 223, 224, 97, 98, 227, 100, 229, 230, 
103, 104, 233, 234, 107, 236, 109, 110, 239, 112, 241, 242, 115, 244, 117, 118, 247, 248, 121, 122, 251, 124, 253, 254, 127, 0, 129, 130, 3, 132, 5, 6, 135, 136, 9, 10, 139, 12, 141, 142, 15, 144, 17, 18, 147, 20, 149, 150, 23, 24, 153, 154, 27, 156, 29, 30, 159, 160, 33, 34, 163, 36, 165, 166, 39, 40, 169, 170, 43, 172, 45, 46, 175, 48, 177, 178, 51, 180, 53, 54, 183, 184, 57, 58, 187, 60, 189, 190, 63, 192, 65, 66, 195, 68, 197, 198, 71, 72, 201, 202, 75, 204, 77, 78, 207, 80, 209, 210, 83, 212, 
85, 86, 215, 216, 89, 90, 219, 92, 221, 222, 95, 96, 225, 226, 99, 228, 101, 102, 231, 232, 105, 106, 235, 108, 237, 238, 111, 240, 113, 114, 243, 116, 245, 246, 119, 120, 249, 250, 123, 252, 125, 126, 255];
cast.player.ts608.Decoder.parityByte_ = function(byte) {
  return cast.player.ts608.Decoder.parityBytes_[byte];
};
cast.player.ts608.Decoder.ParityResult = {BADFIELD:0, NOOP1:1, NOOP2:2, OK:3};
cast.player.ts608.Decoder.handleParity = function(b1, b2, last) {
  if (255 == b1 && 255 == b2 || !b1 && !b2) {
    return{b1:b1, b2:b2, result:cast.player.ts608.Decoder.ParityResult.BADFIELD};
  }
  b1 = cast.player.ts608.Decoder.parityByte_(b1);
  b2 = cast.player.ts608.Decoder.parityByte_(b2);
  if (b1 & cast.player.ts608.Decoder.CC_PE) {
    if (!(b2 & cast.player.ts608.Decoder.CC_PE) && last.matchesB2(b2)) {
      return{b1:b1, b2:b2, result:cast.player.ts608.Decoder.ParityResult.NOOP1};
    }
  } else {
    if (b2 & cast.player.ts608.Decoder.CC_PE && 1 <= b1 && 31 >= b1) {
      return{b1:b1, b2:b2, result:cast.player.ts608.Decoder.ParityResult.NOOP2};
    }
  }
  return{b1:b1, b2:b2, result:cast.player.ts608.Decoder.ParityResult.OK};
};
cast.player.ts608.Decoder.prototype.convertField1_ = function(b1, b2) {
  if (255 == b1 && 255 == b2 || !b1 && !b2) {
    return 45 == ++this.badFrames_ && this.reset(), this.field1_.lastcp_.clear(), this.field2_.lastcp_.clear(), !1;
  }
  this.badFrames_ = 0;
  return this.field1_.convertField(b1, b2);
};
cast.player.ts608.Decoder.prototype.convertField2_ = function(b3, b4) {
  this.modeSelect & cast.player.ts608.Decoder.CCMODE_MASK_FIELD2 && this.field2_.convertField(b3, b4);
};
cast.player.ts608.Decoder.prototype.setMode = function(mode) {
  this.modeSelect = 1 << mode;
};
cast.player.ts608.Decoder.prototype.extract = function(data, time) {
  if (181 === data[0] && 0 === data[1] && 49 === data[2] && 71 === data[3] && 65 === data[4] && 57 === data[5] && 52 === data[6] && 3 === data[7]) {
    var vbiDataFlag = (data[8] & 128) >> 7;
    if (vbiDataFlag) {
      var i, count = data[8] & 31;
      for (i = 0;i < count;i++) {
        var ccValid = (data[10 + 3 * i] & 4) >> 2;
        if (ccValid) {
          var ccType = data[10 + 3 * i] & 3, cc1 = data[3 * i + 11], cc2 = data[3 * i + 12], ccData = {time:time, type:ccType, cc1:cc1, cc2:cc2};
          this.ccDataArray_.push(ccData);
        }
      }
    }
  }
};
cast.player.ts608.Decoder.prototype.decode = function() {
  this.ccDataArray_.sort(function(a, b) {
    return a.time - b.time;
  });
  for (var i = 0;i < this.ccDataArray_.length;i++) {
    var ccData = this.ccDataArray_[i];
    this.time_ = ccData.time;
    0 === ccData.type ? this.convertField1_(ccData.cc1, ccData.cc2) : 1 === ccData.type && this.convertField2_(ccData.cc1, ccData.cc2);
  }
  this.ccDataArray_ = [];
};
cast.player.ts608.TsParser = function(callback) {
  this.byteArray_ = null;
  this.h264id_ = this.pmtid_ = this.offset_ = this.h264PesLength_ = 0;
  this.h264Pes_ = new Uint8Array(131072);
  this.callback_ = callback;
};
cast.player.ts608.TsParser.TS_SYNCWORD_ = 71;
cast.player.ts608.TsParser.TS_PACKET_SIZE_ = 188;
cast.player.ts608.TsParser.prototype.isEmpty = function() {
  return null === this.byteArray_;
};
cast.player.ts608.TsParser.prototype.isFinished = function() {
  return this.offset_ >= this.byteArray_.length;
};
cast.player.ts608.TsParser.prototype.init = function(byteArray) {
  this.byteArray_ = byteArray;
  this.h264id_ = this.pmtid_ = this.offset_ = this.h264PesLength_ = 0;
};
cast.player.ts608.TsParser.CHUNK_SIZE_ = 262144;
cast.player.ts608.TsParser.prototype.parse = function() {
  for (var offset = this.offset_;this.offset_ < this.byteArray_.length && !(this.offset_ - offset > cast.player.ts608.TsParser.CHUNK_SIZE_);) {
    for (;0 <= this.offset_ && this.offset_ < this.byteArray_.length && this.byteArray_[this.offset_] !== cast.player.ts608.TsParser.TS_SYNCWORD_;) {
      this.offset_++;
    }
    if (this.offset_ + cast.player.ts608.TsParser.TS_PACKET_SIZE_ > this.byteArray_.length) {
      break;
    }
    var tsStartOffset = this.offset_;
    this.offset_++;
    var payload_unit_start_indicator = this.byteArray_[this.offset_] & 64, pid = this.byteArray_[this.offset_++] & 31, pid = pid << 8 | this.byteArray_[this.offset_++], adaptation_field_control = (this.byteArray_[this.offset_] & 48) >> 4;
    this.offset_++;
    if (adaptation_field_control & 2) {
      var adaptationFieldLength = this.byteArray_[this.offset_++];
      this.offset_ += adaptationFieldLength;
    }
    if (0 == pid) {
      payload_unit_start_indicator && this.offset_++;
      var table_id = this.byteArray_[this.offset_++];
      0 == table_id ? this.pmtid_ = this.parsePat_(this.offset_) : 2 == table_id && (this.h264id_ = this.parsePmt_(this.offset_));
    } else {
      if (pid == this.pmtid_) {
        payload_unit_start_indicator && this.offset_++, table_id = this.byteArray_[this.offset_++], 2 == table_id && (this.h264id_ = this.parsePmt_(this.offset_));
      } else {
        if (pid == this.h264id_) {
          var length = tsStartOffset + cast.player.ts608.TsParser.TS_PACKET_SIZE_ - this.offset_;
          if (this.h264PesLength_ + length > this.h264Pes_.length || payload_unit_start_indicator && this.h264PesLength_) {
            this.parsePes_(), this.h264PesLength_ = 0;
          }
          this.h264Pes_.set(this.byteArray_.subarray(this.offset_, tsStartOffset + cast.player.ts608.TsParser.TS_PACKET_SIZE_), this.h264PesLength_);
          this.h264PesLength_ += length;
        }
      }
    }
    this.offset_ = tsStartOffset + cast.player.ts608.TsParser.TS_PACKET_SIZE_;
  }
};
cast.player.ts608.TsParser.prototype.parsePat_ = function(offset) {
  var section_length = this.byteArray_[offset++] & 15, section_length = section_length << 8 | this.byteArray_[offset++], initialOffset = offset;
  offset += 5;
  for (var pmtid = 0;offset < initialOffset + section_length;) {
    var program_number = this.byteArray_[offset++], program_number = (program_number << 8) + this.byteArray_[offset++];
    if (0 == program_number) {
      offset += 2;
    } else {
      pmtid = this.byteArray_[offset++] & 31;
      pmtid = (pmtid << 8) + this.byteArray_[offset++];
      break;
    }
  }
  return pmtid;
};
cast.player.ts608.TsParser.prototype.parsePmt_ = function(offset) {
  var initialOffset = offset;
  offset++;
  offset++;
  offset += 5;
  offset += 2;
  var program_info_length = this.byteArray_[offset++] & 15, program_info_length = program_info_length << 8 | this.byteArray_[offset++];
  for (offset += program_info_length;offset - initialOffset < cast.player.ts608.TsParser.TS_PACKET_SIZE_ - 1;) {
    var stream_type = this.byteArray_[offset++], elementary_PID = this.byteArray_[offset++] & 31, elementary_PID = elementary_PID << 8 | this.byteArray_[offset++];
    if (27 == stream_type) {
      return elementary_PID;
    }
    var ES_info_length = this.byteArray_[offset++] & 15, ES_info_length = ES_info_length << 8 | this.byteArray_[offset++];
    offset += ES_info_length;
  }
  return 0;
};
cast.player.ts608.TsParser.prototype.parsePes_ = function() {
  for (var offset = 0;offset < this.h264PesLength_;) {
    for (;0 <= offset && offset < this.h264PesLength_ && (0 != this.h264Pes_[offset] || 0 != this.h264Pes_[offset + 1] || 1 != this.h264Pes_[offset + 2]);) {
      offset++;
    }
    var offset = offset + 7, PTS_DTS_flags = this.h264Pes_[offset++] & 192, PES_header_data_length = this.h264Pes_[offset++], dataOffset = offset + PES_header_data_length, pts = 0;
    PTS_DTS_flags && (pts = (this.h264Pes_[offset++] & 14) >> 1, pts = pts << 8 | this.h264Pes_[offset++], pts = pts << 7 | (this.h264Pes_[offset++] & 254) >> 1, pts = pts << 8 | this.h264Pes_[offset++], pts = 128 * pts + ((this.h264Pes_[offset++] & 254) >> 1), pts /= 90);
    this.parseH264Es_(this.h264Pes_.subarray(dataOffset, this.h264PesLength_), pts);
    break;
  }
};
cast.player.ts608.TsParser.removeEmu_ = function(array, offset, size) {
  for (var emuCount = 0, zeroCount = 0, src = 0, dst = 0;src < size;) {
    0 === array[offset + src] ? (array[offset + dst] = array[offset + src], dst++, zeroCount++) : (2 === zeroCount && 3 === array[offset + src] ? emuCount++ : (array[offset + dst] = array[offset + src], dst++), zeroCount = 0), src++;
  }
  return emuCount;
};
cast.player.ts608.TsParser.prototype.parseH264Es_ = function(array, pts) {
  var offset = this.findStartCode_(0, array);
  if (-1 != offset) {
    for (;offset < array.length;) {
      var next = this.findStartCode_(offset, array);
      -1 == next && (next = array.length);
      var nal_unit_type = array[offset++] & 31;
      if (6 == nal_unit_type) {
        for (var emu = cast.player.ts608.TsParser.removeEmu_(array, offset, next);offset + emu < next;) {
          for (var payloadType = 0;255 == array[offset];) {
            payloadType += 255, offset++;
          }
          payloadType += array[offset++];
          if (45 < payloadType) {
            break;
          }
          for (var payloadSize = 0;255 == array[offset];) {
            payloadSize += 255, offset++;
          }
          payloadSize += array[offset++];
          if (4 == payloadType) {
            this.callback_.on608Data(array.subarray(offset, offset + payloadSize), pts);
          }
          offset += payloadSize;
        }
      }
      offset = next;
    }
  }
};
cast.player.ts608.TsParser.prototype.findStartCode_ = function(offset, array) {
  for (;offset < array.length;) {
    if (0 == array[offset] && 0 == array[offset + 1]) {
      if (0 == array[offset + 2] && 1 == array[offset + 3]) {
        return offset + 4;
      }
      if (1 == array[offset + 2]) {
        return offset + 3;
      }
    }
    offset += 1;
  }
  return-1;
};
cast.player.ts608.TsParserCallback = function() {
};
cast.player.ts608.TsParserCallback.prototype.on608Data = function() {
};
cast.player.ts608.DecoderCallback = function() {
};
cast.player.ts608.DecoderCallback.prototype.onEmit = function() {
};
cast.player.ts608.CaptionsCallback = function() {
};
goog.exportSymbol("cast.player.ts608.CaptionsCallback", cast.player.ts608.CaptionsCallback);
cast.player.ts608.CaptionsCallback.prototype.onCaptionsReady = function() {
};
cast.player.ts608.Worker = function(captionsCallback) {
  this.decoder_ = new cast.player.ts608.Decoder(this);
  this.parser_ = new cast.player.ts608.TsParser(this);
  this.timeOffset_ = 0;
  this.endTime_ = null;
  this.webvtt_ = "";
  this.captionsCallback_ = captionsCallback;
  this.onTimerHandler_ = this.onTimer_.bind(this);
  this.timer_ = null;
  this.pendingData_ = new goog.structs.Queue;
};
cast.player.ts608.Worker.TimerInterval_ = {NORMAL:40, FAST:0};
cast.player.ts608.Worker.prototype.onTimer_ = function() {
  if (this.parser_.isEmpty()) {
    var tsData = this.pendingData_.dequeue();
    this.timeOffset_ = tsData.timeOffset;
    this.parser_.init(tsData.data);
  }
  this.parser_.parse();
  if (this.parser_.isFinished()) {
    this.decoder_.decode();
    if (this.webvtt_) {
      var s = "WEBVTT\n\n" + this.webvtt_;
      this.captionsCallback_.onCaptionsReady(s);
      this.webvtt_ = "";
    }
    this.timeOffset_ = 0;
    this.parser_.init(null);
  }
  this.pendingData_.isEmpty() ? this.timer_ = null : this.timer_ = setTimeout(this.onTimerHandler_, cast.player.ts608.Worker.TimerInterval_.NORMAL);
};
cast.player.ts608.Worker.msToTimeString_ = function(time) {
  var date = new Date(time), hh = date.getUTCHours(), mm = date.getUTCMinutes(), ss = date.getSeconds(), ms = date.getMilliseconds();
  10 > hh && (hh = "0" + hh);
  10 > mm && (mm = "0" + mm);
  10 > ss && (ss = "0" + ss);
  10 > ms ? ms = "00" + ms : 100 > ms && (ms = "0" + ms);
  return hh + ":" + mm + ":" + ss + "." + ms;
};
cast.player.ts608.Worker.MIN_CUE_TIME_ = 200;
cast.player.ts608.Worker.prototype.onEmit = function(startTime, endTime, text) {
  null !== this.endTime_ && startTime < this.endTime_ && (startTime = this.endTime_);
  text && endTime - startTime < cast.player.ts608.Worker.MIN_CUE_TIME_ && (endTime = startTime + cast.player.ts608.Worker.MIN_CUE_TIME_);
  this.endTime_ = endTime;
  if (text) {
    var timeOffsetMs = 1E3 * this.timeOffset_, cue = cast.player.ts608.Worker.msToTimeString_(startTime + timeOffsetMs) + " --\x3e " + cast.player.ts608.Worker.msToTimeString_(endTime + timeOffsetMs) + " position:20% align:start\n" + text + "\n\n";
    this.webvtt_ += cue;
  }
};
cast.player.ts608.Worker.prototype.processData = function(data, timeOffset) {
  this.pendingData_.enqueue({data:data, timeOffset:timeOffset});
  null === this.timer_ && (this.timer_ = setTimeout(this.onTimerHandler_, cast.player.ts608.Worker.TimerInterval_.FAST));
};
cast.player.ts608.Worker.prototype.on608Data = function(data, pts) {
  this.decoder_.extract(data, pts);
};
cast.player.api.PlayerCallbacks = function() {
};
goog.exportSymbol("cast.player.api.PlayerCallbacks", cast.player.api.PlayerCallbacks);
cast.player.api.PlayerCallbacks.prototype.scheduleTick = function() {
};
cast.player.api.PlayerCallbacks.prototype.processSourceData = function() {
};
cast.player.api.PlayerCallbacks.prototype.onStreamSeeked = function() {
};
cast.player.api.Player = function(host) {
  this.logger_ = goog.log.getLogger("cast.player.api.Player");
  goog.log.info(this.logger_, "version " + cast.player.api.VERSION);
  goog.log.info(this.logger_, "revision " + cast.player.api.REVISION);
  this.timer_ = null;
  this.initialTime_ = 0;
  this.isLoading_ = !1;
  this.mediaSourceManager_ = new cast.player.core.MediaSourceManager(host);
  this.mediaSource_ = this.mediaSourceManager_.getMediaSource();
  this.protocol_ = null;
  this.host_ = host;
  this.autoPaused_ = !1;
  this.onPlayHandler_ = this.onPlay_.bind(this);
  this.onPauseHandler_ = this.onPause_.bind(this);
  this.onSeekingHandler_ = this.onSeeking_.bind(this);
  this.onSeekedHandler_ = this.onSeeked_.bind(this);
  this.onErrorHandler_ = this.onError_.bind(this);
  this.onEndedHandler_ = this.onEnded_.bind(this);
  this.onLoadedMetadataHandler_ = this.onLoadedMetadata_.bind(this);
  this.onSourceOpenHandler_ = this.onSourceOpen_.bind(this);
  this.onSourceCloseHandler_ = this.onSourceClose_.bind(this);
  this.onSourceEndedHandler_ = this.onSourceEnded_.bind(this);
  this.onTimerHandler_ = this.onTimer_.bind(this);
  this.underflow_ = !0;
  this.worker608_ = this.captionsManager_ = this.mediaKeysManager_ = this.mediaElement_ = null;
  this.ignoreSeek_ = !1;
};
goog.exportSymbol("cast.player.api.Player", cast.player.api.Player);
cast.player.api.Player.TimerInterval_ = {NORMAL:200, FAST:0};
cast.player.api.Player.prototype.onCaptionsReady = function(text) {
  this.captionsManager_.parse(text, 0);
};
cast.player.api.Player.prototype.scheduleTick = function() {
  this.setTimeout_(cast.player.api.Player.TimerInterval_.FAST);
};
cast.player.api.Player.prototype.processSourceData = function(data, timeOffset) {
  this.worker608_ && this.worker608_.processData(data, timeOffset);
};
cast.player.api.Player.prototype.onStreamSeeked = function(streamIndex) {
  if (this.isLoading_) {
    var time = this.protocol_.getSegmentTime(streamIndex).time;
    if (Infinity === this.initialTime_ || this.initialTime_ < time) {
      this.initialTime_ = time;
    }
  }
};
cast.player.api.Player.prototype.clearTimeout_ = function() {
  null !== this.timer_ && (clearTimeout(this.timer_), this.timer_ = null);
};
cast.player.api.Player.prototype.setTimeout_ = function(interval) {
  null !== this.timer_ && clearTimeout(this.timer_);
  this.timer_ = setTimeout(this.onTimerHandler_, interval);
};
cast.player.api.Player.prototype.onPlay_ = function() {
  goog.log.info(this.logger_, "play");
  this.underflow_ || (this.autoPaused_ = !1);
};
cast.player.api.Player.prototype.onPause_ = function() {
  goog.log.info(this.logger_, "pause");
};
cast.player.api.Player.prototype.onSeeking_ = function() {
  goog.log.info(this.logger_, "seeking");
  this.ignoreSeek_ || (this.isMediaSourceOpen_() ? (this.mediaSourceManager_.reset(), this.setTimeout_(cast.player.api.Player.TimerInterval_.FAST)) : this.reload());
};
cast.player.api.Player.prototype.onSeeked_ = function() {
  goog.log.info(this.logger_, "seeked");
  this.ignoreSeek_ = !1;
};
cast.player.api.Player.prototype.onError_ = function() {
  goog.log.error(this.logger_, "error");
  this.host_.onError(cast.player.api.ErrorCode.PLAYBACK);
};
cast.player.api.Player.prototype.onEnded_ = function() {
  goog.log.info(this.logger_, "ended");
};
cast.player.api.Player.prototype.isMediaSourceOpen_ = function() {
  return "open" === this.mediaSource_.readyState;
};
cast.player.api.Player.prototype.onLoadedMetadata_ = function() {
  goog.log.info(this.logger_, "loadedmetadata");
  this.isLoading_ && this.isMediaSourceOpen_() && this.mediaElement_.currentTime !== this.initialTime_ && (this.mediaElement_.currentTime = this.initialTime_, this.ignoreSeek_ = !0);
  this.isLoading_ = !1;
};
cast.player.api.Player.prototype.updateDuration_ = function() {
  var duration = this.protocol_.getDuration();
  0 < duration && !this.mediaSource_.duration && this.isMediaSourceOpen_() && (duration -= 1E-4, this.mediaSource_.duration = parseFloat(duration.toFixed(4)));
};
cast.player.api.Player.prototype.onSourceOpen_ = function() {
  goog.log.info(this.logger_, "sourceopen");
  this.protocol_ && (this.mediaKeysManager_.reset(), this.mediaSourceManager_.open(this, this.protocol_), this.updateDuration_(), this.setTimeout_(cast.player.api.Player.TimerInterval_.FAST));
};
cast.player.api.Player.prototype.onSourceClose_ = function() {
  goog.log.info(this.logger_, "sourceclose");
};
cast.player.api.Player.prototype.onSourceEnded_ = function() {
  goog.log.info(this.logger_, "sourceended");
};
cast.player.api.Player.MAX_BUFFER_DURATION_ = 20;
cast.player.api.Player.prototype.onTimer_ = function() {
  var activeCount = 0, resumeCount = 0, enabledCount = 0, time = this.isLoading_ ? this.initialTime_ : this.mediaElement_.currentTime;
  this.underflow_ = !1;
  var i, count = this.protocol_.getStreamCount();
  for (i = 0;i < count;i++) {
    if (this.protocol_.isStreamEnabled(i)) {
      if (this.mediaSourceManager_.active(i)) {
        var duration = this.mediaSourceManager_.getBufferDuration(i, time);
        if (duration < cast.player.api.Player.MAX_BUFFER_DURATION_) {
          if (duration < this.host_.autoPauseDuration) {
            var streamInfo = this.protocol_.getStreamInfo(i);
            0 > streamInfo.mimeType.indexOf("text") && (this.underflow_ = !0);
          }
          this.mediaSourceManager_.tick(i, time);
          if (!this.mediaElement_) {
            return;
          }
        }
        duration >= this.host_.autoResumeDuration && resumeCount++;
        activeCount++;
      } else {
        resumeCount++;
      }
      enabledCount++;
    }
  }
  this.mediaElement_.paused ? this.autoPaused_ && resumeCount === enabledCount && (goog.log.info(this.logger_, "auto resume " + time), this.autoPaused_ = !1, this.mediaElement_.play()) : this.underflow_ && (goog.log.info(this.logger_, "auto pause " + time), this.autoPaused_ = !0, this.mediaElement_.pause());
  0 === activeCount && this.isMediaSourceOpen_() ? this.mediaSource_.endOfStream() : this.setTimeout_(cast.player.api.Player.TimerInterval_.NORMAL);
};
cast.player.api.Player.prototype.onPlaylistReady = function() {
  this.updateDuration_();
};
cast.player.api.Player.prototype.onManifestReady = function() {
  this.mediaSource_ && (this.mediaElement_.src = window.URL.createObjectURL(this.mediaSource_));
};
cast.player.api.Player.loadCounter_ = 0;
cast.player.api.Player.prototype.load = function(protocol, initialTime) {
  goog.log.info(this.logger_, "load " + cast.player.api.Player.loadCounter_);
  cast.player.api.Player.loadCounter_++;
  this.mediaElement_ = this.host_.getMediaElement();
  this.mediaElement_.addEventListener("play", this.onPlayHandler_, !1);
  this.mediaElement_.addEventListener("pause", this.onPauseHandler_, !1);
  this.mediaElement_.addEventListener("seeking", this.onSeekingHandler_, !1);
  this.mediaElement_.addEventListener("seeked", this.onSeekedHandler_, !1);
  this.mediaElement_.addEventListener("error", this.onErrorHandler_, !1);
  this.mediaElement_.addEventListener("ended", this.onEndedHandler_, !1);
  this.mediaElement_.addEventListener("loadedmetadata", this.onLoadedMetadataHandler_, !1);
  this.mediaSource_.addEventListener("sourceopen", this.onSourceOpenHandler_, !1);
  this.mediaSource_.addEventListener("sourceended", this.onSourceEndedHandler_, !1);
  this.mediaSource_.addEventListener("sourceclose", this.onSourceCloseHandler_, !1);
  this.autoPaused_ = this.mediaElement_.autoplay;
  this.protocol_ = protocol;
  this.initialTime_ = initialTime || 0;
  this.isLoading_ = !0;
  this.protocol_.load(this, this, this.mediaSourceManager_);
  this.mediaKeysManager_ = new cast.player.core.MediaKeysManager(this.host_, this.protocol_);
};
goog.exportProperty(cast.player.api.Player.prototype, "load", cast.player.api.Player.prototype.load);
cast.player.api.Player.prototype.unload = function() {
  cast.player.api.Player.loadCounter_--;
  goog.log.info(this.logger_, "unload " + cast.player.api.Player.loadCounter_);
  this.worker608_ && (this.worker608_ = null);
  this.captionsManager_ && (this.captionsManager_.dispose(), this.captionsManager_ = null);
  this.mediaElement_ && (this.mediaElement_.removeEventListener("play", this.onPlayHandler_, !1), this.mediaElement_.removeEventListener("pause", this.onPauseHandler_, !1), this.mediaElement_.removeEventListener("seeking", this.onSeekingHandler_, !1), this.mediaElement_.removeEventListener("seeked", this.onSeekedHandler_, !1), this.mediaElement_.removeEventListener("error", this.onErrorHandler_, !1), this.mediaElement_.removeEventListener("ended", this.onEndedHandler_, !1), this.mediaElement_.removeEventListener("loadedmetadata", 
  this.onLoadedMetadataHandler_, !1), this.mediaSource_.removeEventListener("sourceopen", this.onSourceOpenHandler_, !1), this.mediaSource_.removeEventListener("sourceended", this.onSourceEndedHandler_, !1), this.mediaSource_.removeEventListener("sourceclose", this.onSourceCloseHandler_, !1), this.protocol_.unload(), this.mediaSourceManager_.close(), this.mediaKeysManager_.dispose(), this.mediaElement_ = null);
  this.clearTimeout_();
  this.autoPaused_ = !1;
};
goog.exportProperty(cast.player.api.Player.prototype, "unload", cast.player.api.Player.prototype.unload);
cast.player.api.Player.prototype.reload = function() {
  this.isLoading_ || (this.initialTime_ = this.mediaElement_.currentTime);
  this.isLoading_ = !0;
  this.mediaElement_.paused || (this.autoPaused_ = !0);
  this.mediaSourceManager_.close();
  this.clearTimeout_();
  this.mediaSource_ && (this.mediaElement_.src = window.URL.createObjectURL(this.mediaSource_));
};
goog.exportProperty(cast.player.api.Player.prototype, "reload", cast.player.api.Player.prototype.reload);
cast.player.api.Player.prototype.getState = function() {
  return{underflow:this.underflow_};
};
goog.exportProperty(cast.player.api.Player.prototype, "getState", cast.player.api.Player.prototype.getState);
cast.player.api.Player.prototype.getBufferDuration = function(streamIndex) {
  return this.mediaSourceManager_.getBufferDuration(streamIndex, this.mediaElement_.currentTime);
};
goog.exportProperty(cast.player.api.Player.prototype, "getBufferDuration", cast.player.api.Player.prototype.getBufferDuration);
cast.player.api.Player.prototype.startLicenseRequest = function() {
  this.mediaKeysManager_.startLicenseRequest();
};
goog.exportProperty(cast.player.api.Player.prototype, "startLicenseRequest", cast.player.api.Player.prototype.startLicenseRequest);
cast.player.api.Player.TS608_WORKER_ = "media_player_ts608.js";
cast.player.api.Player.prototype.enableCaptions = function(enable, opt_type, opt_url) {
  opt_type ? ("608" === opt_type && (enable ? this.worker608_ || (this.worker608_ = new cast.player.ts608.Worker(this)) : this.worker608_ && (this.worker608_ = null), opt_type = cast.player.core.CaptionsManager.WEBVTT), this.captionsManager_ || (this.captionsManager_ = new cast.player.core.CaptionsManager(this.host_)), this.captionsManager_.enableCaptions(enable, opt_type, opt_url)) : this.mediaSourceManager_.update();
};
goog.exportProperty(cast.player.api.Player.prototype, "enableCaptions", cast.player.api.Player.prototype.enableCaptions);
 }).call(window);
