// @flow

const isFunction = (fn: mixed): %checks => typeof fn === 'function';

const isObject = (obj: mixed): %checks => obj !== null && typeof obj === 'object' && !Array.isArray(obj);

export {
  isFunction,
  isObject,
};
