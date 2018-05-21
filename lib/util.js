"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This util is used to define the action type.
 * It also helps to maintain the unique action type name.
 * @module actions/type
 * @exports type
 *
 * @type { [k: string]: boolean }
 */
var TypeCache = {};
/**
 * Store into the TypeCache and return the type name.
 * @throws Will throw an error if the name is already defined.
 *
 * @param {String} label Action type name
 * @return {String} label
 */
function type(label) {
    if (TypeCache[label]) {
        throw new Error("Action type \"" + label + "\" is not unique.");
    }
    TypeCache[label] = true;
    return label;
}
exports.type = type;
