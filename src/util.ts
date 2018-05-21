/**
 * This util is used to define the action type.
 * It also helps to maintain the unique action type name.
 * @module actions/type
 * @exports type
 *
 * @type { [k: string]: boolean }
 */
const TypeCache: { [k: string]: boolean } = {};

/**
 * Store into the TypeCache and return the type name.
 * @throws Will throw an error if the name is already defined.
 *
 * @param {String} label Action type name
 * @return {String} label
 */
export function type(label: string): string {
  if (TypeCache[label]) {
    throw new Error(`Action type "${label}" is not unique.`);
  }
  TypeCache[label] = true;
  return label;
}
