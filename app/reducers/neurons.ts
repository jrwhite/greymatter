import _ = require('lodash')
import { IAction } from '../actions/helpers'
import {
  addSynapseToAxon,
  removeSynapsesFromNeurons,
  setDendSource,
  decayNeurons,
  potentiateNeuron,
  setUseDefaultConfig,
  changeNeuronCurrent,
  removeNeuron
} from '../actions/neurons'
import { Arc, Point } from '../utils/geometry'
import { stepIzhikPotential, stepIzhikU } from '../utils/runtime'
import {
  addDend,
  addNeuron,
  addSynapseToDend,
  changeDendWeighting,
  changeIzhikParams,
  exciteNeuron,
  hyperpolarizeNeuron,
  moveNeuron,
  rotateNeuron
} from './../actions/neurons'
import { setDefaultIzhikParams } from '../actions/config'
import { removeSynapses } from '../actions/synapses'
import {
  NeuronState,
  initialNeuronState,
  DendState,
  initialDendState,
  MaxFirePeriod
} from '../types/neurons'
import { NormalizedObjects } from '../types/normalized'
import { combineReducers } from 'redux'

export interface IState {
  [id: string]: NeuronState
}

function changeById (
  state: IState,
  id: string,
  change: Partial<NeuronState>
): IState {
  const neuron = state[id]
  return {
    ...state,
    [id]: {
      ...neuron,
      ...change
    }
  }
}

function changeDendById (
  state: NormalizedObjects<DendState>,
  id: string,
  change: Partial<DendState>
): NormalizedObjects<DendState> {
  const dend = state.byId[id]
  return {
    ...state,
    byId: {
      ...state.byId,
      [id]: {
        ...dend,
        ...change
      }
    }
  }
}

function byId (
  state: { [id: string]: NeuronState } = {},
  action: IAction
): { [id: string]: NeuronState } {
  if (moveNeuron.test(action)) {
    const neuron = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...neuron,
        pos: action.payload.pos
      }
    }
  } else if (addNeuron.test(action)) {
    return {
      ...state,
      [action.payload.id]: {
        ...initialNeuronState,
        id: action.payload.id,
        pos: action.payload.pos,
        izhik: action.payload.izhik,
        axon: {
          ...initialNeuronState.axon,
          id: action.payload.axonId
        }
      }
    }
  } else if (removeNeuron.test(action)) {
    return _.omit(state, action.payload.id)
  } else if (hyperpolarizeNeuron.test(action)) {
    const neuron = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...neuron,
        firePeriod: 0,
        potential: neuron.izhik.mvToPot(neuron.izhik.params.c),
        izhik: {
          ...neuron.izhik,
          u: neuron.izhik.u + neuron.izhik.params.d
        }
      }
    }
  } else if (changeDendWeighting.test(action)) {
    const neuron = state[action.payload.neuronId]
    return {
      ...state,
      [action.payload.neuronId]: {
        ...neuron,
        dends: changeDendById(neuron.dends, action.payload.dendId, {
          // weighting: action.payload.weighting
        })
      }
    }
  } else if (changeIzhikParams.test(action)) {
    const neuron = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...neuron,
        izhik: {
          ...neuron.izhik,
          params: {
            ...neuron.izhik.params,
            ...action.payload.params
          }
        }
      }
    }
  } else if (changeNeuronCurrent.test(action)) {
    const neuron = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...neuron,
        izhik: {
          ...neuron.izhik,
          current: action.payload.current
        }
      }
    }
  } else if (rotateNeuron.test(action)) {
    return changeById(state, action.payload.id, {
      theta: action.payload.theta
    })
  } else if (addDend.test(action)) {
    const neuron = state[action.payload.neuronId]
    return {
      ...state,
      [action.payload.neuronId]: {
        ...neuron,
        dends: {
          byId: {
            ...neuron.dends.byId,
            [action.payload.id]: {
              ...initialDendState,
              ...action.payload,
              arc: {
                start: action.payload.nu - 1 / 16,
                stop: action.payload.nu + 1 / 16
              }
            }
          },
          allIds: _.concat(neuron.dends.allIds, action.payload.id)
        }
      }
    }
  } else if (removeSynapses.test(action)) {
    // const neuron = state[action.payload.id]
    // return {
    //   ...neuron,
    //   [action.payload.id]: {
    //     ...neuron,
    //     axon: {
    //       ...neuron.axon,
    //       synapseIds: _.differenceBy(
    //         neuron.axon.synapseIds,
    //         action.payload.synapses
    //       )
    //     }
    //   }
    // }
  } else if (addSynapseToAxon.test(action)) {
    const neuron = state[action.payload.neuronId]
    return {
      ...state,
      [action.payload.neuronId]: {
        ...neuron,
        axon: {
          ...neuron.axon,
          synapseIds: _.concat(
            neuron.axon.synapseIds,
            action.payload.synapseId
          )
        }
      }
    }
  } else if (addSynapseToDend.test(action)) {
    const neuron = state[action.payload.neuronId]
    return {
      ...state,
      [action.payload.neuronId]: {
        ...neuron,
        dends: changeDendById(neuron.dends, action.payload.dendId, {
          synapseId: action.payload.synapseId
        })
      }
    }
  } else if (setDendSource.test(action)) {
    const neuron = state[action.payload.neuronId]
    return {
      ...state,
      [action.payload.neuronId]: {
        ...neuron,
        dends: changeDendById(neuron.dends, action.payload.dendId, {
          sourceId: action.payload.sourceId
        })
      }
    }
  } else if (potentiateNeuron.test(action)) {
    const neuron = state[action.payload.id]
    const mv = neuron.izhik.potToMv(neuron.potential)
    return {
      ...state,
      [action.payload.id]: {
        ...neuron,
        potential: neuron.izhik.mvToPot(mv + action.payload.change)
      }
    }
  } else if (setUseDefaultConfig.test(action)) {
    changeById(state, action.payload.id, {
      useDefaultConfig: action.payload.useDefaultConfig
    })
    // begin void actions
  } else if (decayNeurons.test(action)) {
    return _.mapValues(state, (n: NeuronState) => {
      const v = n.izhik.potToMv(n.potential)
      return {
        ...n,
        firePeriod:
          n.firePeriod + 1 > MaxFirePeriod ? MaxFirePeriod : n.firePeriod + 1,
        potential: n.izhik.mvToPot(stepIzhikPotential(v, n.izhik)),
        izhik: {
          ...n.izhik,
          u: stepIzhikU(v, n.izhik)
        }
      }
    })
  }
  return state
}

function allIds (state: string[] = [], action: IAction): string[] {
  if (addNeuron.test(action)) {
    return _.concat(state, action.payload.id)
  } else if (removeNeuron.test(action)) {
    return _.filter(state, (id) => id !== action.payload.id)
  }
  return state
}

const neurons = combineReducers({ byId, allIds })
export default neurons
