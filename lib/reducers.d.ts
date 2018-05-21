import { IActionTypes } from './actions';
export interface IStartPayload {
    payload: any;
    isLoading: true;
    error: null;
    data: null;
    lastUpdated: number;
}
export interface IEndPayload {
    isLoading: false;
    error: null;
    data: any;
    lastUpdated: number;
}
export interface IFailPayload {
    isLoading: false;
    error: any;
    data: null;
    lastUpdated: number;
}
export interface IOverrrides {
    start?: (state: any, payload: IStartPayload, globalState: any) => any;
    end?: (state: any, payload: IEndPayload, globalState: any) => any;
    fail?: (state: any, payload: IFailPayload, globalState: any) => any;
}
export interface IActionsMap {
    [k: string]: (state: any, data: {
        payload: any;
    }, globalState: any) => any;
}
export interface IReduxFnMapArg2 {
    payload: any;
    type: string;
}
/**
 * A function that creates reducers for 2 API tasks viz. start, fail and end.
 * It can be overriden by the passing these functions else a simple reducer will be used to merge state
 * @param { start: Function, end: Function, fail: Function}
 */
export declare const reducers: ({ start, fail, end }: {
    start?: (state: any, additionalState: IStartPayload | IEndPayload | IFailPayload, globalState: any) => any;
    fail?: (state: any, additionalState: IStartPayload | IEndPayload | IFailPayload, globalState: any) => any;
    end?: (state: any, additionalState: IStartPayload | IEndPayload | IFailPayload, globalState: any) => any;
}) => {
    start: (state: any, payload: any, globalState: any) => any;
    fail: (state: any, { payload: { error } }: any, globalState: any) => any;
    end: (state: any, { payload: { response } }: any, globalState: any) => any;
};
/**
 *
 * @param {*} actionsMap
 */
export declare const reduxFnMap: (actionsMap: IActionsMap, initialState?: any) => (state: any, { type, payload }: IReduxFnMapArg2, globalState: any) => any;
/**
 * Will generate standard reducers to fetch data from api.
 * @param {ActionTypes: IActionTypes} ActionTypes Redux action types
 */
export declare function generateReducers({ActionTypes}: {
    ActionTypes: IActionTypes;
}, overrides?: IOverrrides): (state: any, reducerInfo: IReduxFnMapArg2, globalState: any) => any;
