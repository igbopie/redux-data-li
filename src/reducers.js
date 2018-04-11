const merge = (state, additionalState) => Object.assign({}, state, additionalState);

/**
 * A function that creates reducers for 2 API tasks viz. start, fail and end.
 * It can be overriden by the passing these functions else a simple reducer will be used to merge state
 * @param { start: Function, end: Function, fail: Function}
 */
export const reducers = ({ start = merge, fail = merge, end = merge }) => ({

  /**
   * Will clear previous state and set loading flag
   */
  start: (state, _payload, globalState) => start(state, { isLoading: true, error: null, data: null, lastUpdated: Date.now() }, globalState),

  /**
   * Will append the error to the state
   */
  fail: (state, { payload: { error } }, globalState) => fail(state, { isLoading: false, error, data: null, lastUpdated: Date.now() }, globalState),

  /**
   * Will load data into state
   */
  end: (state, { payload: { response } }, globalState) => end(state, { isLoading: false, error: null, lastUpdated: Date.now(), data: response }, globalState)
});

/**
 *
 * @param {*} actionsMap
 */
export const reduxFnMap = (actionsMap, initialState = {}) => (state = initialState, { type, payload }, globalState) => {
  if (actionsMap[type]) {
    return actionsMap[type].call({}, state, { payload }, globalState);
  }
  return state;
};

/**
 * Will generate standard reducers to fetch data from api.
 * @param {{[k: string]: string}} ActionTypes Redux action types
 */
export function generateReducers({ ActionTypes }, overrides = {}) {
  const { start, fail, end } = reducers(overrides);

  const INITIAL_STATE = {};

  const ACTIONS_MAP = {
    [ActionTypes.START]: start,
    [ActionTypes.FAIL]: fail,
    [ActionTypes.END]: end
  };

  return reduxFnMap(ACTIONS_MAP, INITIAL_STATE);
}
