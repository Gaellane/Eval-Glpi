/**
 * Utility functions to compute "sizes" of values and attributes.
 * - For arrays: length
 * - For strings: length
 * - For objects: number of own keys
 * - For Map/Set: .size
 * - For primitives: 1
 */

function getType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof Map) return 'map';
  if (value instanceof Set) return 'set';
  const t = typeof value;
  if (t === 'object') return 'object';
  return t; // 'string', 'number', 'boolean', 'function', 'undefined', etc.
}

function getSize(value) {
  const type = getType(value);
  switch (type) {
    case 'null':
    case 'undefined':
      return 0;
    case 'array':
      return value.length;
    case 'string':
      return value.length;
    case 'object':
      return Object.keys(value).length;
    case 'map':
    case 'set':
      return value.size;
    case 'date':
      return 1;
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
    case 'function':
    default:
      return 1;
  }
}

/**
 * For a plain object, returns an object mapping each attribute name to
 * an object { type, size, nested? } where nested is present for objects/arrays
 * that contain object elements.
 */
export function getAttributeSizes(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('getAttributeSizes attend un objet littéral (non null, non array)');
  }
  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const type = getType(val);
    const entry = { type, size: getSize(val) };
    if (type === 'object') {
      try {
        entry.nested = getAttributeSizes(val);
      } catch (e) {
        // si l'objet n'est pas un plain-object, ignorer nested
      }
    } else if (type === 'array') {
      // si des éléments de l'array sont des objets, fournir détail par index
      const nested = {};
      val.forEach((el, idx) => {
        if (getType(el) === 'object') nested[idx] = getAttributeSizes(el);
      });
      if (Object.keys(nested).length) entry.nested = nested;
    }
    result[key] = entry;
  }
  return result;
}

export { getSize, getType };
