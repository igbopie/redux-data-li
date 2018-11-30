import { get } from 'lodash';
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
const getState = async (dispatch: any) => {
  /**
   * @param {*} dispatch
   * @param {Function} gerState
   */
  return await dispatch((_: any, getStateInner: () => any) => getStateInner());
};

const ongoingRequests: { [k: string]: number }  = {};

/**
 * Standardized way to invoke an API. We will store the query in the state and trigger 2 actions
 * start and end/fail depending on the outcome of the request.
 *
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {IReduxAPIAction} reduxAPIAction An object that contains the definition of the action
 * @param {boolean} cancelRequest Cancel any previous requests that're in progress
 *
 * @returns {Promise<any>}
 */
const reduxApiActionInner = async (
    dispatch: any,
    action: IReduxAPIAction,
    cancelRequest: boolean): Promise<any> => {

  const {
    reducer,
    apiFn,
    start,
    fail,
    end,
    shouldFetchFn,
    paramName,
    params,
  } = action;

  // should we fetch or not? we will send the state to the fn, if not specified, we should fetch.
  const shouldFetch = !shouldFetchFn || shouldFetchFn(await getState(dispatch));

  if (shouldFetch) {
    const requestAction = start(params);

    let { payload } = requestAction;
    const { name, transactionId } = requestAction;

    await dispatch(requestAction);

    // If supplied with a reducer then get the state and extract the parameter and set the params
    if (paramName && reducer) {
      const scopedState = get(await getState(dispatch), reducer);
      payload = get(scopedState, paramName) || payload;
    }

    return new Promise(async (resolve, reject) => {
      try {
        ongoingRequests[name] = transactionId;
        const response = await apiFn(payload);
        if (!cancelRequest || ongoingRequests[name] === transactionId) {
          delete ongoingRequests[name];
          if (response.status && response.status >= 400) {
            throw response;
          }
          resolve(await dispatch(end(response, payload)));
        }
      } catch (e) {
        delete ongoingRequests[name];
        reject(await dispatch(fail(e, payload)));
      }
    });
  }
  return { type: 'NO_OP' };
};

/**
 * Function that invokes the API function and sets state in the reducer
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {IReduxAPIAction} reduxAPIAction An object that contains the definition of the action
 * @param {boolean} cancelRequest Optional Cancel any previous requests that're in progress. Default true
 *
 * @returns {Promise<R>}
 */
const reduxApiAction = async (dispatch: any, params: IReduxAPIAction, cancelRequest: boolean = true): Promise<any> => {
  return reduxApiActionInner(dispatch, params, cancelRequest);
};

export { reduxApiAction, getState };
