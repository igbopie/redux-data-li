import { IActionInfo, IFetchStartResponse, IFetchEndResponse, IFetchErrorResponse } from './actions';
export interface IReduxAPIAction extends IActionInfo {
    start: (params: any) => IFetchStartResponse;
    end: (response: any, originalParams: any) => IFetchEndResponse;
    fail: (error: any, originalParams: any) => IFetchErrorResponse;
    params?: any;
}
/**
 *
 * @param {Dispatch} dispatch
 */
declare const getState: (dispatch: any) => Promise<any>;
/**
 * Function that invokes the API function and sets state in the reducer
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {IReduxAPIAction} reduxAPIAction An object that contains the definition of the action
 * @param {boolean} cancelRequest Optional Cancel any previous requests that're in progress. Default true
 *
 * @returns {Promise<R>}
 */
declare const reduxApiAction: (dispatch: any, params: IReduxAPIAction, cancelRequest?: boolean) => Promise<any>;
export { reduxApiAction, getState };
