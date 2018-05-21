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
  [k: string]: (state: any, data: { payload: any }, globalState: any ) => any;
}

type reducerPayload = IStartPayload | IEndPayload | IFailPayload;

export interface IReduxFnMapArg2 {
  payload: any;
  type: string;
}

const merge = (state: any, additionalState: reducerPayload , globalState: any) => {
  return Object.assign({}, state, additionalState);
};

/**
 * A function that creates reducers for 2 API tasks viz. start, fail and end.
 * It can be overriden by the passing these functions else a simple reducer will be used to merge state
 * @param { start: Function, end: Function, fail: Function}
 */
export const reducers = ({ start = merge, fail = merge, end = merge }) => ({

  /**
   * Will clear previous state and set loading flag
   */
  start: (state: any, payload: any, globalState: any) =>
        start(state, { payload, isLoading: true, error: null, data: null, lastUpdated: Date.now() }, globalState),

  /**
   * Will append the error to the state
   */
  fail: (state: any, { payload: { error } }: any, globalState: any) =>
        fail(state, { isLoading: false, error, data: null, lastUpdated: Date.now() }, globalState),

  /**
   * Will load data into state
   */
  end: (state: any, { payload: { response } }: any, globalState: any) =>
        end(state, { isLoading: false, error: null, lastUpdated: Date.now(), data: response }, globalState),
});

/**
 *
 * @param {*} actionsMap
 */
export const reduxFnMap = (actionsMap: IActionsMap, initialState: any = {}) =>
  (state: any = initialState, { type, payload }: IReduxFnMapArg2, globalState: any) => {
    if (actionsMap[type]) {
      return actionsMap[type].call({}, state, { payload }, globalState);
    }
    return state;
  };

/**
 * Will generate standard reducers to fetch data from api.
 * @param {ActionTypes: IActionTypes} ActionTypes Redux action types
 */
export function generateReducers({ ActionTypes }: { ActionTypes: IActionTypes }, overrides: IOverrrides = {}):
  (state: any, reducerInfo: IReduxFnMapArg2, globalState: any) => any {
    const { start, fail, end } = reducers(overrides);

    const INITIAL_STATE = {};

    const ACTIONS_MAP = {
      [ActionTypes.START]: start,
      [ActionTypes.FAIL]: fail,
      [ActionTypes.END]: end,
    };

    return reduxFnMap(ACTIONS_MAP, INITIAL_STATE);
  }
