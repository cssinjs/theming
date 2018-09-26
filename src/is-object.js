// @flow

export default function isObject(obj: mixed): %checks {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
