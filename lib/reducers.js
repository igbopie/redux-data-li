"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merge = function (state, additionalState, globalState) {
    return Object.assign({}, state, additionalState);
};
/**
 * A function that creates reducers for 2 API tasks viz. start, fail and end.
 * It can be overriden by the passing these functions else a simple reducer will be used to merge state
 * @param { start: Function, end: Function, fail: Function}
 */
exports.reducers = function (_a) {
    var _b = _a.start, start = _b === void 0 ? merge : _b, _c = _a.fail, fail = _c === void 0 ? merge : _c, _d = _a.end, end = _d === void 0 ? merge : _d;
    return ({
        /**
         * Will clear previous state and set loading flag
         */
        start: function (state, _a, globalState) {
            var originalParams = _a.originalParams, payload = _a.payload;
            return start(state, {
                data: null,
                error: null,
                isLoading: true,
                lastUpdated: Date.now(),
                originalParams: originalParams,
                payload: payload,
            }, globalState);
        },
        /**
         * Will append the error to the state
         */
        fail: function (state, _a, globalState) {
            var error = _a.payload.error, originalParams = _a.originalParams;
            return fail(state, {
                data: null,
                error: error,
                isLoading: false,
                lastUpdated: Date.now(),
                originalParams: originalParams,
            }, globalState);
        },
        /**
         * Will load data into state
         */
        end: function (state, _a, globalState) {
            var response = _a.payload.response, originalParams = _a.originalParams;
            return end(state, {
                data: response,
                error: null,
                isLoading: false,
                lastUpdated: Date.now(),
                originalParams: originalParams,
            }, globalState);
        },
    });
};
/**
 *
 * @param {IActionsMap} actionsMap
 */
exports.reduxFnMap = function (actionsMap, initialState) {
    if (initialState === void 0) { initialState = {}; }
    return function (state, _a, globalState) {
        if (state === void 0) { state = initialState; }
        var type = _a.type, payload = _a.payload, originalParams = _a.originalParams;
        if (actionsMap[type]) {
            return actionsMap[type].call({}, state, { payload: payload, originalParams: originalParams }, globalState);
        }
        return state;
    };
};
/**
 * Will generate standard reducers to fetch data from api.
 * @param {ActionTypes: IActionTypes} ActionTypes Redux action types
 */
function generateReducers(_a, overrides) {
    var ActionTypes = _a.ActionTypes;
    if (overrides === void 0) { overrides = {}; }
    var _b = exports.reducers(overrides), start = _b.start, fail = _b.fail, end = _b.end;
    var INITIAL_STATE = {};
    var ACTIONS_MAP = (_c = {},
        _c[ActionTypes.START] = start,
        _c[ActionTypes.FAIL] = fail,
        _c[ActionTypes.END] = end,
        _c);
    return exports.reduxFnMap(ACTIONS_MAP, INITIAL_STATE);
    var _c;
}
exports.generateReducers = generateReducers;
