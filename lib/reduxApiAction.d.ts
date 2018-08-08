import { IActionInfo } from './actions';
export interface IReduxAPIAction extends IActionInfo {
    start: (params: any) => any;
    end: (response: any, originalParams: any) => any;
    fail: (error: any, originalParams: any) => any;
    params?: any;
}
/**
 *
 * @param {Dispatch} dispatch
 */
declare const getState: (dispatch: any) => Promise<any>;
/**
 * Function that invokes the API function and sets state in the reducer
 * @param {ReduxApiActionParams<P, A, R>} params
 *
 * @returns {Promise<R>}
 */
declare const reduxApiAction: (dispatch: any, params: IReduxAPIAction) => Promise<any>;
export { reduxApiAction, getState };
