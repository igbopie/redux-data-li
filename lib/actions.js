"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
/**
 * Will generate generic actions to fetch data.
 * @param {string} name unique redux action name
 * @param {(params: any) => any} paramsFn fn to transform params if needed for api call
 * @param {(params: any) => Promise} apiFn fn to call the API
 * @param {(state: any) => Boolean} shouldFetchFn Optional fn to check whether we need to make an API call or not
 * @param {String} reducer The reducer variable in which the state will be found
 */
function generateActions(_a) {
    var name = _a.name, paramsFn = _a.paramsFn, apiFn = _a.apiFn, shouldFetchFn = _a.shouldFetchFn, reducer = _a.reducer, paramName = _a.paramName, source = _a.source;
    var ActionTypes = {
        END: util_1.type("[" + name + "]_REQUEST_END"),
        FAIL: util_1.type("[" + name + "]_REQUEST_FAIL"),
        START: util_1.type("[" + name + "]_REQUEST_START"),
    };
    /**
     * Fetch start action
     * @param {Object} params Parameters to be passed to the API function
     */
    var fetchStart = function (params) {
        var payload = paramsFn ? paramsFn(params) : params;
        return {
            name: name,
            originalParams: payload,
            payload: payload,
            transactionId: Date.now(),
            type: ActionTypes.START,
        };
    };
    /**
     * Fetch end action
     * @param {Object} response The response from the backend
     * @param {Object} originalParams The original parameters passed to the API function
     */
    var fetchEnd = function (response, originalParams) { return ({
        originalParams: originalParams,
        payload: { response: response },
        type: ActionTypes.END,
    }); };
    /**
     * Fetch error action
     * @param {Object} error The error response from the backend
     * @param {Object} originalParams The original parameters passed to the API function
     */
    var fetchFail = function (error, originalParams) { return ({
        originalParams: originalParams,
        payload: { error: error },
        type: ActionTypes.FAIL,
    }); };
    return {
        ActionTypes: ActionTypes,
        Actions: {
            fetch: function (args) { return ({
                apiFn: apiFn,
                end: fetchEnd,
                fail: fetchFail,
                name: name,
                paramName: paramName,
                params: args,
                reducer: reducer,
                shouldFetchFn: shouldFetchFn,
                source: source,
                start: fetchStart,
            }); },
        },
    };
}
exports.generateActions = generateActions;
