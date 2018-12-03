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
  removeNeurons,
  rotateNeuron
} from './../actions/neurons'
import { setDefaultIzhikParams } from '../actions/config'
import { removeSynapses } from '../actions/synapses'
import {
  IzhikState,
  NeuronState,
  DendState,
  PulseTime,
  PlastState
} from '../types/neurons'
import { BasePlast } from '../constants/neurons'
import {
  initialNormalizedObject,
  NormalizedObjects
} from '../types/normalized'
import { Neuron } from '../components/Neuron'

/**
 * Initial states
 */

export const initialIzhikState: IzhikState = {
  params: {
    a: 0.02,
    b: 0.25,
    c: -65,
    d: 0.05
  },
  u: 0,
  current: 0,
  potToMv: (pot: number) => pot * (30 / 100),
  mvToPot: (mv: number) => mv * (100 / 30)
}

const initialNeuronState: NeuronState = {
  id: 'n',
  pos: { x: 0, y: 0 },
  theta: 0,
  potential: 0,
  firePeriod: 0,
  pulseTimes: initialNormalizedObject,
  useDefaultConfig: true,
  izhik: initialIzhikState,
  axon: { id: 'a', cpos: { x: 50, y: 0 }, synapseIds: [] },
  dends: initialNormalizedObject
}

export const initialPlastState: PlastState = {
  base: BasePlast,
  short: 0,
  long: 0
}

const initialDendState: DendState = {
  id: 'd',
  plast: initialPlastState,
  baseCpos: { x: 0, y: 0 },
  synCpos: { x: 0, y: 0 },
  nu: 1,
  arc: { start: 1, stop: 1 },
  synapseId: 's',
  incomingAngle: 1,
  length: 2,
  sourceId: 'src'
}

export const initialPulseTime: PulseTime = {
  dendId: 'd',
  time: 0
}

export const MaxFirePeriod = 50

export interface IState {
  [id: string]: NeuronState
}

function changeById (
  state: IState,
  id: string,
  change: Partial<NeuronState>
): IState {
  const dend = state[id]
  return {
    ...state,
    [id]: {
      ...dend,
      ...change
    }
  }
}

export default function neurons (
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
    const neuron = state[action.payload.id]
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
    return {
      ...state,
      [action.payload.id]: undefined
    }
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
  } else if (removeSynapses.test(action)) {
    const neuron = state[action.payload.id]
    return {
      ...neuron,
      [action.payload.id]: {
        ...neuron,
        axon: {
          ...neuron.axon,
          synapseIds: _.differenceBy(
            neuron.axon.synapseIds,
            action.payload.synapses
          )
        }
      }
    }
  } else if (addSynapseToAxon.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          axon: {
            ...n.axon,
            synapses: _.concat(n.axon.synapses, {
              id: action.payload.synapseId
            })
          }
        }
      }
      return n
    })
  } else if (potentiateNeuron.test(action)) {
    return state.map((n) => {
      const mv = n.izhik.potToMv(n.potential)
      if (n.id === action.payload.id) {
        return {
          ...n,
          potential: n.izhik.mvToPot(mv + action.payload.change)
        }
      } else {
        return n
      }
    })
  } else if (setUseDefaultConfig.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          useDefaultConfig: action.payload.useDefaultConfig
        }
      } else {
        return n
      }
    })
  } else if (setDefaultIzhikParams.test(action)) {
    return state.map((n) => {
      if (n.useDefaultConfig) {
        return {
          ...n,
          izhik: {
            ...n.izhik,
            params: { ...action.payload }
          }
        }
      } else {
        return n
      }
    })
    // begin void actions
  } else if (decayNeurons.test(action)) {
    return state.map((n: NeuronState) => {
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
  } else {
    return state
  }
}
