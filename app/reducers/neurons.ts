import _ = require('lodash')
import { IAction } from '../actions/helpers'
import {
  addSynapseToAxon,
  removeSynapsesFromNeurons
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
  rotateNeuron,
  stepNetwork
} from './../actions/neurons'

export interface NeuronState {
  id: string
  pos: Point
  theta: number
  potential: number
  izhik: IzhikState
  axon: AxonState
  dends: DendState[]
}

export interface AxonState {
  id: string
  cpos: Point
  synapses: Array<{ id: string }>
}

export interface DendState {
  id: string
  weighting: number // derived from plast
  plast: PlastState
  baseCpos: Point
  synCpos: Point // point of synapse
  nu: number
  arc: Arc // arc width derived from long-term plast
  synapseId: string
  incomingAngle: number
  length: number // derived from short-term plast
}

export interface PlastState {
  short: number // short term plasticity
  long: number // long-term plasticity
}

export interface IzhikParams {
  a: number
  b: number
  c: number
  d: number
}

export interface IzhikState {
  params: IzhikParams
  u: number
  current: number
  potToMv: (pot: number) => number // multiply with potential to get mV
  mvToPot: (mv: number) => number
}

/**
 * Initial states
 */

const initialIzhikState: IzhikState = {
  params: {
    a: 0.02,
    b: 0.2,
    c: -65,
    d: 2
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
  izhik: initialIzhikState,
  axon: { id: 'a', cpos: { x: 50, y: 0 }, synapses: [] },
  dends: []
}

const initialDendState: DendState = {
  id: 'd',
  weighting: 30,
  plast: { short: 15, long: 15 },
  baseCpos: { x: 0, y: 0 },
  synCpos: { x: 0, y: 0 },
  nu: 1,
  arc: { start: 1, stop: 1 },
  synapseId: 's',
  incomingAngle: 1,
  length: 2
}

export default function neurons (
  state: NeuronState[] = [],
  action: IAction
): NeuronState[] {
  if (moveNeuron.test(action)) {
    return state.map((n: NeuronState) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          ...action.payload
        }
      }
      return n
    })
  } else if (addNeuron.test(action)) {
    return [
      ...state,
      {
        ...initialNeuronState,
        id: action.payload.id,
        pos: action.payload.pos,
        axon: {
          ...initialNeuronState.axon,
          id: action.payload.axonId
        }
      }
    ]
  } else if (removeNeurons.test(action)) {
    return _.differenceBy(state, action.payload.neurons, 'id')
  } else if (exciteNeuron.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          potential:
            n.potential +
            n.dends.find((d) => d.id === action.payload.dendId)!!.weighting
        }
      }
      return n
    })
  } else if (hyperpolarizeNeuron.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          potential: n.izhik.mvToPot(n.izhik.params.c),
          izhik: {
            ...n.izhik,
            u: n.izhik.u + n.izhik.params.d
          }
        }
      }
      return n
    })
  } else if (changeDendWeighting.test(action)) {
    return _.map(state, (n: NeuronState) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          dends: _.map(n.dends, (d: DendState) => {
            if (d.id === action.payload.dendId) {
              return {
                ...d,
                weighting: action.payload.weighting
              }
            }
            return d
          })
        }
      }
      return n
    })
  } else if (changeIzhikParams.test(action)) {
    return state.map((n: NeuronState) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          izhik: {
            ...n.izhik,
            params: {
              ...n.izhik.params,
              ...action.payload.params
            }
          }
        }
      }
      return n
    })
  } else if (rotateNeuron.test(action)) {
    return _.map(state, (n: NeuronState) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          theta: action.payload.theta
        }
      }
      return n
    })
  } else if (addDend.test(action)) {
    return state.map((n: NeuronState) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          dends: [
            ...n.dends,
            {
              ...initialDendState,
              ...action.payload,
              arc: {
                start: action.payload.nu - 1 / 16,
                stop: action.payload.nu + 1 / 16
              }
            }
          ]
        }
      }
      return n
    })
  } else if (removeSynapsesFromNeurons.test(action)) {
    return _.map(state, (n: NeuronState) => ({
      ...n,
      axon: {
        ...n.axon,
        synapses: _.differenceBy(
          n.axon.synapses,
          action.payload.synapses,
          'id'
        )
      },
      dends: _.differenceWith(
        n.dends,
        action.payload.synapses,
        (a, b) => a.synapseId === b.id
      )
    }))
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
  } else if (addSynapseToDend.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          dends: n.dends.map((d) => {
            if (d.id === action.payload.dendId) {
              return {
                ...d,
                synapseId: action.payload.synapseId
              }
            }
            return d
          })
        }
      } else {
        return n
      }
    })
    // begin void actions
  } else if (stepNetwork.test(action)) {
    return state.map((n: NeuronState) => {
      const v = n.izhik.potToMv(n.potential)
      return {
        ...n,
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
