import { type } from './util';

/**
 * Will generate generic actions to fetch data.
 * @param {string} name unique redux action name
 * @param {(params: any) => any} paramsFn fn to transform params if needed for api call
 * @param {(params: any) => Promise} apiFn fn to call the API
 * @param {(state: any) => Boolean} shouldFetchFn Optional fn to check whether we need to make an API call or not
 * @param {String} reducer The reducer variable in which the state will be found
 */
export function generateActions({ name, paramsFn, apiFn, shouldFetchFn, reducer, paramName, source }) {

  const ActionTypes = {
    START: type(`[${name}]_REQUEST_START`),
    FAIL: type(`[${name}]_REQUEST_FAIL`),
    END: type(`[${name}]_REQUEST_END`)
  };

  /**
   * Fetch start action
   * @param {string} testId - test id
   */
  const fetchStart = (params) => ({
    type: ActionTypes.START,
    payload: paramsFn ? paramsFn(params) : params,
    originalParams: params
  });

  /**
   * Fetch end action
   * @param {Object} response
   */
  const fetchEnd = (response, originalParams) => ({
    type: ActionTypes.END,
    payload: { response },
    originalParams
  });

  /**
   * Fetch error action
   * @param {error} error
   */
  const fetchFail = (error, originalParams) => ({
    type: ActionTypes.FAIL,
    payload: { error },
    originalParams
  });

  return {
    ActionTypes,
    Actions: {
      fetch(args) {
        return {
          start: fetchStart,
          fail: fetchFail,
          end: fetchEnd,
          params: args,
          fn: apiFn,
          shouldFetchFn,
          reducer,
          paramName,
          source
        };
      }
    }
  };
}
