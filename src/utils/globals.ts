import * as crypto from 'crypto';

export const HTML_ELEMENT_TYPE_UNKNOWN = 0;
export const HTML_ELEMENT_TYPE_PRODUCT = 1;
export const HTML_ELEMENT_TYPE_CATEGORY = 2;
export const HTML_ELEMENT_TYPE_PAGINATION = 3;

export function hashString(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function entitiesMatch(entity1, entity2, options = { exclude: [] }) {
  const { exclude } = options;

  for (let key in entity1) {
    // Skip any excluded fields and undefined properties
    if (
      exclude.includes(key) ||
      entity1[key] === undefined ||
      entity2[key] === undefined
    ) {
      continue;
    }

    // Check if the values are different
    if (entity1[key] !== entity2[key]) {
      return false;
    }
  }
  return true;
}
