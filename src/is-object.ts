export default function isObject(obj: unknown): obj is object {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
