import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createHashHistory } from 'history'
import { routerMiddleware, push } from 'react-router-redux'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

import * as neuronActions from '../actions/neurons'
import * as synapseActions from '../actions/synapses'
import * as gymActions from '../actions/gym'
import * as inputsActions from '../actions/inputs'
import * as ghostSynapseActions from '../actions/ghostSynapse'

declare const window: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__? (a: any): void;
}

declare const module: NodeModule & {
  hot?: {
    accept (...args: any[]): any;
  };
}

const actionCreators = Object.assign(
  {},
  neuronActions,
  synapseActions,
  gymActions,
  inputsActions,
  ghostSynapseActions,
  { push }
)

const blacklistedActions = ['DECAY_NETWORK', 'MOVE_NEURON', 'STEP_NETWORK']

const logger = (createLogger as any)({
  level: 'info',
  collapsed: true,
  predicate: (getState: any, action: any) =>
    action.type !== 'DECAY_NETWORK' && action.type !== 'MOVE_NEURON'
})

const history = createHashHistory()
const router = routerMiddleware(history)

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
    actionCreators
  }) as any)
  : compose
/* eslint-enable no-underscore-dangle */
const enhancer = composeEnhancers(applyMiddleware(thunk, router, logger))

export = {
  history,
  configureStore (initialState: Object) {
    const store = createStore(rootReducer, initialState, enhancer)

    if (module.hot) {
      module.hot.accept(
        '../reducers',
        () => store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
      )
    }

    return store
  }
}
