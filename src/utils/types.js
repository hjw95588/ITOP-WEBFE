import Vue from 'vue';

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isHtmlElement(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

/**
 *  - Inspired:
 *    https://github.com/jashkenas/underscore/blob/master/modules/isFunction.js
 */
export function isFunction(functionToCheck) {
  console.log(44444)
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

if (typeof /./ !== 'function' && typeof Int8Array !== 'object' && (Vue.prototype.$isServer || typeof document.childNodes !== 'function')) {
  isFunction = function(obj) {
    return typeof obj === 'function' || false;
  };
}

export function isUndefined (val) {
  return val === void 0;
};

export function isDefined (val) {
  return val !== undefined && val !== null;
};
