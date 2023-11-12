import * as crypto from 'crypto';

export const HTML_ELEMENT_TYPE_UNKNOWN = 0;
export const HTML_ELEMENT_TYPE_PRODUCT = 1;
export const HTML_ELEMENT_TYPE_CATEGORY = 2;
export const HTML_ELEMENT_TYPE_PAGINATION = 3;

export function hashString(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}
