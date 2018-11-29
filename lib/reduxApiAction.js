"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 *
 * @param {Dispatch} dispatch
 */
var getState = function (dispatch) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dispatch(function (_, getStateInner) { return getStateInner(); })];
            case 1: 
            /**
             * @param {*} dispatch
             * @param {Function} gerState
             */
            return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getState = getState;
var ongoingRequests = {};
/**
 * Standardized way to invoke an API. We will store the query in the state and trigger 2 actions
 * start and end/fail depending on the outcome of the request.
 *
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {IReduxAPIAction} reduxAPIAction An object that contains the definition of the action
 * @param {boolean} cancelRequest Cancel any previous requests that're in progress
 *
 * @returns {Promise<MerlinAction<R>>}
 */
var reduxApiActionInner = function (dispatch, action, cancelRequest) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var reducer, apiFn, start, fail, end, shouldFetchFn, paramName, params, shouldFetch, _a, _b, requestAction, payload_1, name_1, transactionId_1, scopedState, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                reducer = action.reducer, apiFn = action.apiFn, start = action.start, fail = action.fail, end = action.end, shouldFetchFn = action.shouldFetchFn, paramName = action.paramName, params = action.params;
                _a = !shouldFetchFn;
                if (_a) return [3 /*break*/, 2];
                _b = shouldFetchFn;
                return [4 /*yield*/, getState(dispatch)];
            case 1:
                _a = _b.apply(void 0, [_d.sent()]);
                _d.label = 2;
            case 2:
                shouldFetch = _a;
                if (!shouldFetch) return [3 /*break*/, 6];
                requestAction = start(params);
                payload_1 = requestAction.payload;
                name_1 = requestAction.name, transactionId_1 = requestAction.transactionId;
                return [4 /*yield*/, dispatch(requestAction)];
            case 3:
                _d.sent();
                if (!(paramName && reducer)) return [3 /*break*/, 5];
                _c = lodash_1.get;
                return [4 /*yield*/, getState(dispatch)];
            case 4:
                scopedState = _c.apply(void 0, [_d.sent(), reducer]);
                payload_1 = lodash_1.get(scopedState, paramName) || payload_1;
                _d.label = 5;
            case 5: return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var response, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 4, , 6]);
                                ongoingRequests[name_1] = transactionId_1;
                                return [4 /*yield*/, apiFn(payload_1)];
                            case 1:
                                response = _a.sent();
                                if (!(!cancelRequest || ongoingRequests[name_1] === transactionId_1)) return [3 /*break*/, 3];
                                delete ongoingRequests[name_1];
                                if (response.status && response.status >= 400) {
                                    throw response;
                                }
                                return [4 /*yield*/, dispatch(end(response, payload_1))];
                            case 2:
                                _a.sent();
                                resolve(response);
                                _a.label = 3;
                            case 3: return [3 /*break*/, 6];
                            case 4:
                                e_1 = _a.sent();
                                delete ongoingRequests[name_1];
                                return [4 /*yield*/, dispatch(fail(e_1, payload_1))];
                            case 5:
                                _a.sent();
                                reject(e_1);
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); })];
            case 6: return [2 /*return*/, { type: 'NO_OP' }];
        }
    });
}); };
/**
 * Function that invokes the API function and sets state in the reducer
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {IReduxAPIAction} reduxAPIAction An object that contains the definition of the action
 * @param {boolean} cancelRequest Optional Cancel any previous requests that're in progress. Default true
 *
 * @returns {Promise<R>}
 */
var reduxApiAction = function (dispatch, params, cancelRequest) {
    if (cancelRequest === void 0) { cancelRequest = true; }
    return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, reduxApiActionInner(dispatch, params, cancelRequest)];
        });
    });
};
exports.reduxApiAction = reduxApiAction;
