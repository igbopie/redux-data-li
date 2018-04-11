import { get } from 'lodash';

/**
 *
 * @param {Dispatch} dispatch
 */
const getState = async (dispatch) => {
  /**
   * @param {*} dispatch
   * @param {Function} gerState
   */
  return await dispatch((_, getState) => getState());
};

/**
 * Standardized way to invoke an API. We will store the query in the state and trigger 2 actions (request and received).
 *
 * @param {Dispatch} dispatch Redux dispatch method
 * @param {{ fetch: (args: any) => {ReduxApiActionParams<P, A, R>} }}
 * {ReduxApiActionParams<P, A, R>}
 * P is the request action (see types/action)
 * A arguments for the api call
 * R is the response of the api call
 *
 * ReduxApiActionParams<P, A, R> {
 *   reducer: string,
 *   fn: (params: A) => Promise<R>,
 *   start: (state: any, payload: any) => any,
 *   end: (state: any, payload: any) => any,
 *   fail: (state: any, payload: any) => any,
 *   paramName?: string,
 *   shouldFetchFn?: (state: any) => boolean,
 *   params: {}
 * }
 *
 * @returns {Promise<MerlinAction<R>>}
 */
const _reduxApiAction = async (dispatch, { reducer, fn, start, fail, end, shouldFetchFn, paramName = 'query', params }) => {

  // should we fetch or not? we will send the state to the fn, if not specified, we should fetch.
  const shouldFetch = !shouldFetchFn || shouldFetchFn(await getState(dispatch));

  if (shouldFetch) {
    const requestAction = start(params);
    let { payload } = requestAction;

    await dispatch(requestAction);

    // If supplied with a reducer then get the state and extract the parameter and set the params
    if (reducer) {
      const scopedState = get(await getState(dispatch), reducer);
      payload = get(scopedState, paramName) || payload;
    }

    try {
      const response = await fn(payload);
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
const reduxApiAction = async (dispatch, params) => {
  const data = await _reduxApiAction(dispatch, params);
  return dispatch(data);
};

export { reduxApiAction, getState };
