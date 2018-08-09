import { type } from './util';
import { IReduxAPIAction } from './reduxApiAction';

export interface IActionInfo {
  name: string;
  paramsFn?: (params: any) => any;
  apiFn: (params: any) => any;
  shouldFetchFn?: (state: any) => boolean;
  reducer?: string;
  paramName?: string;
  source?: string;
}

export interface IActionTypes {
  START: string;
  END: string;
  FAIL: string;
}

export interface IActions {
  fetch: (args: any) => IReduxAPIAction;
}

export interface IGenerateActions {
  Actions: IActions;
  ActionTypes: IActionTypes;
}

export interface IFetchStartResponse {
  type: string;
  payload: (params: any) => void | any;
  originalParams: any;
}

export interface IFetchEndResponse {
  type: string;
  payload: {
    response: any;
  };
  originalParams: any;
}

export interface IFetchErrorResponse {
  type: string;
  payload: {
    error: any;
  };
  originalParams: any;
}

/**
 * Will generate generic actions to fetch data.
 * @param {string} name unique redux action name
 * @param {(params: any) => any} paramsFn fn to transform params if needed for api call
 * @param {(params: any) => Promise} apiFn fn to call the API
 * @param {(state: any) => Boolean} shouldFetchFn Optional fn to check whether we need to make an API call or not
 * @param {String} reducer The reducer variable in which the state will be found
 */
export function generateActions(
  { name, paramsFn, apiFn, shouldFetchFn, reducer, paramName, source }: IActionInfo): IGenerateActions {

  const ActionTypes: IActionTypes  = {
    END: type(`[${name}]_REQUEST_END`),
    FAIL: type(`[${name}]_REQUEST_FAIL`),
    START: type(`[${name}]_REQUEST_START`),
  };

  /**
   * Fetch start action
   * @param {string} testId - test id
   */
  const fetchStart = (params: any): IFetchStartResponse => ({
    originalParams: params,
    payload: paramsFn ? paramsFn(params) : params,
    type: ActionTypes.START,
  });

  /**
   * Fetch end action
   * @param {Object} response
   */
  const fetchEnd = (response: any, originalParams: any): IFetchEndResponse => ({
    originalParams,
    payload: { response },
    type: ActionTypes.END,
  });

  /**
   * Fetch error action
   * @param {error} error
   */
  const fetchFail = (error: any, originalParams: any): IFetchErrorResponse => ({
    originalParams,
    payload: { error },
    type: ActionTypes.FAIL,
  });

  return {
    ActionTypes,
    Actions: {
      fetch: (args?: any): IReduxAPIAction => ({
        apiFn,
        end: fetchEnd,
        fail: fetchFail,
        name,
        paramName,
        params: args,
        reducer,
        shouldFetchFn,
        source,
        start: fetchStart,
      }),
    },
  };
}
