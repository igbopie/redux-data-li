import { get } from 'lodash';

export interface IReduxAPIAction {
  name: string;
  paramsFn?: (params: any) => any;
  fn: (params: any) => any;
  start: (params: any) => any;
  end: (response: any, originalParams: any) => any;
  fail: (error: any, originalParams: any) => any;
  shouldFetchFn?: (state: any) => boolean;
  reducer?: string;
  paramName?: string;
  source?: string;
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

/**
 * Standardized way to invoke an API. We will store the query in the state and trigger 2 actions
 * start and end/fail depending on the outcome of the request.
 *
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {IReduxAPIAction} reduxAPIAction An object that contains the definition of the action
 *
 *
 * @returns {Promise<MerlinAction<R>>}
 */
const reduxApiActionInner = async (dispatch: any, {
  reducer, fn, start, fail, end, shouldFetchFn, paramName, params }: IReduxAPIAction): Promise<any> => {

  // should we fetch or not? we will send the state to the fn, if not specified, we should fetch.
  const shouldFetch = !shouldFetchFn || shouldFetchFn(await getState(dispatch));

  if (shouldFetch) {
    const requestAction = start(params);
    let { payload } = requestAction;

    await dispatch(requestAction);

    // If supplied with a reducer then get the state and extract the parameter and set the params
    if (paramName && reducer) {
      const scopedState = get(await getState(dispatch), reducer);
      payload = get(scopedState, paramName) || payload;
    }

    try {
      const response = await fn(payload);
      if (response.status && response.status >= 400) {
        throw response;
      }
      return await dispatch(end(response, params));
    } catch (e) {
      return await dispatch(fail(e, params));
    }
  }
  return { type: 'NO_OP' };
};

/**
 * Function that invokes the API function and sets state in the reducer
 * @param {ReduxApiActionParams<P, A, R>} params
 *
 * @returns {Promise<R>}
 */
const reduxApiAction = async (dispatch: any, params: IReduxAPIAction): Promise<any> => {
  return reduxApiActionInner(dispatch, params);
};

export { reduxApiAction, getState };
