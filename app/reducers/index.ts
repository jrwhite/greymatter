import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter, { TState as TCounterState } from './counter';
import network, { NetworkState } from './network'

const rootReducer = combineReducers({
  counter,
  network,
  routing: routing as Reducer<any>
});

export interface IState {
  counter: TCounterState,
  network: NetworkState
}

export default rootReducer;
