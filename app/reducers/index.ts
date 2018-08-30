import { combineReducers, Reducer } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import network, { NetworkState } from './network'

const rootReducer = combineReducers({
  network,
  routing: routing as Reducer<any>
});

export interface IState {
  network: NetworkState
}

export default rootReducer;
