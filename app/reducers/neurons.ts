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
  potentiateDends,
  depressDends,
  setAxonType,
  polarizeNeuron,
  fireVolumeNeuron,
  redrawDends,
  setDendsPos
} from '../actions/neurons'
import { Arc, Point, dendArcLength } from '../utils/geometry'
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

export const MaxFirePeriod = 50
// export const stdpPotFactor = 0.1
export const stdpPotFactor = 1
// export const stdpPotFactor = 0
export const stdpDepFactor = 10
export const maxWeighting = 80
export const daWeighting = 10
export const recoveryDeltaRange = { start: -5, stop: 5 }
export const dendWeightingRange = { start: 0, stop: 80 }
export const firePeriodRange = {
  start: -1 * MaxFirePeriod,
  stop: MaxFirePeriod
}
export const stdpRange = { start: -5, stop: 5 }

export enum StdpType {
  Potentiation = 'Potentiation',
  Depression = 'Depression'
}

export interface NeuronState {
  id: string
  name?: string
  pos: Point
  theta: number
  potential: number
  firePeriod: number
  fireU: number
  useDefaultConfig: boolean
  izhik: IzhikState
  axon: AxonState
  dends: DendState[]
}

export enum AxonType {
  Inhibitory = 'Inhibitory',
  Excitatory = 'Excitatory',
  Volume = 'Volume'
}

export interface AxonState {
  id: string
  cpos: Point
  synapses: Array<{ id: string }>
  type: AxonType
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
  sourceId: string
  spikeTime?: number
  spikeU?: number
  spikeType?: AxonType
}

export interface PlastState {
  short: number // short term plasticity
  long: number // long-term plasticity
}

export interface IzhikParams {
  receptors: number // number of receptor sites. TODO: support general VA transmitters
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

export const initialIzhikState: IzhikState = {
  params: {
    receptors: 2,
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
  fireU: 0,
  useDefaultConfig: true,
  izhik: initialIzhikState,
  axon: {
    id: 'a',
    cpos: { x: 50, y: 0 },
    synapses: [],
    type: AxonType.Excitatory
  },
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
  length: 2,
  sourceId: 'src'
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
        izhik: action.payload.izhik,
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
            n.dends.find((d) => d.id === action.payload.dendId)!!.weighting,
          dends: n.dends.map((d) => {
            if (d.id === action.payload.dendId) {
              // const delta = n.izhik.u - n.fireU
              const delta = n.firePeriod
              console.log(delta)
              const change = delta > 0 ? action.payload.stdpFunc(delta) : 0
              console.log('EXCITE CHANGE')
              console.log(change)
              const newWeighting = d.weighting + change
              return {
                ...d,
                spikeTime: 1,
                spikeType: AxonType.Excitatory,
                spikeU: n.izhik.u,
                weighting: newWeighting > 1 ? newWeighting : 0
              }
            } else {
              return d
            }
          })
        }
      }
      return n
    })
  } else if (polarizeNeuron.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          potential:
            n.potential -
            n.dends.find((d) => d.id === action.payload.dendId)!!.weighting,
          dends: n.dends.map((d) => {
            if (d.id === action.payload.dendId) {
              // const delta = n.izhik.u - n.fireU
              const delta = n.firePeriod
              // console.log(delta)
              // if (delta <= 0) return d
              const change = action.payload.stdpFunc(delta)
              const newWeighting = d.weighting + change
              return {
                ...d,
                spikeTime: 1,
                spikeType: AxonType.Inhibitory,
                // spikeTime: undefined, // TODO: make this work. TEMP FIX
                spikeU: n.izhik.u,
                weighting:
                  newWeighting < maxWeighting ? newWeighting : d.weighting
              }
            } else {
              return d
            }
          })
        }
      }
      return n
    })
  } else if (hyperpolarizeNeuron.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          firePeriod: 0,
          fireU: n.izhik.u,
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
  } else if (setAxonType.test(action)) {
    return _.map(state, (n: NeuronState) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          axon: {
            ...n.axon,
            type: action.payload.type
          }
        }
      }
      return n
    })
  } else if (changeIzhikParams.test(action)) {
    return state.map((n: NeuronState) => {
      if (n.id === action.payload.neuronId) {
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
  } else if (changeNeuronCurrent.test(action)) {
    return state.map((n: NeuronState) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          izhik: {
            ...n.izhik,
            current: action.payload.current
          }
        }
      } else {
        return n
      }
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
  } else if (removeSynapses.test(action)) {
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
  } else if (setDendSource.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          dends: n.dends.map((d: DendState) => {
            if (d.id === action.payload.dendId) {
              return {
                ...d,
                sourceId: action.payload.sourceId
              }
            } else {
              return d
            }
          })
        }
      } else {
        return n
      }
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
  } else if (potentiateDends.test(action)) {
    return state.map((n: NeuronState) => {
      if (n.id === action.payload.id) {
        return {
          ...n,
          dends: n.dends.map((d) => {
            if (d.spikeTime === undefined) return d
            if (d.spikeU === undefined) return d
            if (d.spikeType === undefined) return d
            // const change = (MaxFirePeriod - d.spikeTime) * stdpPotFactor
            // console.log(d.spikeU)
            // console.log(n.fireU)
            // const change =
            //   d.spikeU < n.fireU ? (n.fireU - d.spikeU) * stdpPotFactor : 0
            // const delta = d.spikeU < n.fireU ? d.spikeU - n.fireU : 0
            const delta = -1 * d.spikeTime
            console.log(delta)
            const change = action.payload.stdpFuncs[d.spikeType](delta)
            const weightingMod = action.payload.weightingModFuncs[d.spikeType][
              change > 0 ? StdpType.Potentiation : StdpType.Depression
            ](d.weighting)
            const daMod =
              action.payload.daMods[d.spikeType][
                change > 0 ? StdpType.Potentiation : StdpType.Depression
              ]
            console.log(change)
            // console.log(change)
            const newWeighting = d.weighting + change * weightingMod * daMod
            return {
              ...d,
              spikeTime: undefined,
              spikeU: undefined,
              weighting:
                newWeighting > maxWeighting ? maxWeighting : newWeighting
            }
          })
        }
      } else {
        return n
      }
    })
  } else if (setDendsPos.test(action)) {
    return state.map((n) => {
      if (n.id === action.payload.neuronId) {
        return {
          ...n,
          dends: n.dends.map((d) => {
            const dends: any = action.payload
            const newD = dends[d.id]
            if (newD === undefined) return d
            console.log(newD)
            return {
              ...d,
              baseCpos: newD.baseCPos,
              synCpos: newD.synCPos,
              nu: newD.nu,
              incomingAngle: newD.incomingAngle,
              arc: {
                start: newD.nu - dendArcLength,
                stop: newD.nu + dendArcLength
              }
            }
          })
        }
      }
      return n
    })
    // begin void actions
  } else if (fireVolumeNeuron.test(action)) {
    return state.map((n: NeuronState) => {
      const change = daWeighting * n.izhik.params.receptors
      return {
        ...n,
        potential: n.potential + change
      }
    })
  } else if (decayNeurons.test(action)) {
    return state.map((n: NeuronState) => {
      const v = n.izhik.potToMv(n.potential)
      const newPot = n.izhik.mvToPot(stepIzhikPotential(v, n.izhik))
      const newFirePeriod =
        n.firePeriod + 1 > MaxFirePeriod ? MaxFirePeriod : n.firePeriod + 1
      const newU = stepIzhikU(v, n.izhik)
      // stop updating on small potential changes to save performance
      if (newFirePeriod === MaxFirePeriod) {
        if (
          Math.abs(newPot - n.potential) < 0.01 ||
          Math.abs(n.potential - newPot) < 0.01 ||
          Math.abs(n.izhik.u - newU) < 0.001 ||
          Math.abs(newU - n.izhik.u) < 0.001
        ) {
          // return n
        }
      }
      return {
        ...n,
        firePeriod: newFirePeriod,
        potential: newPot,
        izhik: {
          ...n.izhik,
          u: stepIzhikU(v, n.izhik)
        },
        dends: n.dends.map((d) => ({
          ...d,
          spikeTime: d.spikeTime
            ? d.spikeTime + 1 > MaxFirePeriod
              ? d.spikeTime + 1
              : d.spikeTime
            : undefined
        }))
      }
    })
  } else {
    return state
  }
}
