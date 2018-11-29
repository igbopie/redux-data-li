import { IActionTypes } from './actions';

export interface IStartPayload {
  payload: any;
  originalParams: any;
  isLoading: true;
  error: null;
  data: null;
  lastUpdated: number;
}

export interface IEndPayload {
  originalParams: any;
  isLoading: false;
  error: null;
  data: any;
  lastUpdated: number;
}

export interface IFailPayload {
  originalParams: any;
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
  originalParams: any;
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
  start: (state: any, { originalParams, payload }: any, globalState: any) =>
        start(state, {
          data: null,
          error: null,
          isLoading: true,
          lastUpdated: Date.now(),
          originalParams,
          payload,
        }, globalState),

  /**
   * Will append the error to the state
   */
  fail: (state: any, { payload: { error }, originalParams }: any, globalState: any) =>
        fail(state, {
          data: null,
          error,
          isLoading: false,
          lastUpdated: Date.now(),
          originalParams,
        }, globalState),

  /**
   * Will load data into state
   */
  end: (state: any, { payload: { response }, originalParams }: any, globalState: any) =>
        end(state, {
          data: response,
          error: null,
          isLoading: false,
          lastUpdated: Date.now(),
          originalParams,
        }, globalState),
});

/**
 *
 * @param {IActionsMap} actionsMap
 */
export const reduxFnMap = (actionsMap: IActionsMap, initialState: any = {}) =>
  (state: any = initialState, { type, payload, originalParams }: IReduxFnMapArg2, globalState: any) => {
    if (actionsMap[type]) {
      return actionsMap[type].call({}, state, { payload, originalParams }, globalState);
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
