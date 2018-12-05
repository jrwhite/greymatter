import { Point, Arc } from '../utils/geometry'
import { NormalizedObjects } from './normalized'

export const MaxFirePeriod = 50

export interface NeuronState {
  id: string
  name?: string
  pos: Point
  theta: number
  potential: number
  firePeriod: number
  useDefaultConfig: boolean
  izhik: IzhikState
  axon: AxonState
  dends: NormalizedObjects<DendState>
}

export interface AxonState {
  id: string
  cpos: Point
  synapseIds: string[]
}

export interface PulseTime {
  // pulse timestamp relative to firing event
  dendId: string
  time: number
}

export interface DendState {
  id: string
  //   weighting: number // derived from plast
  plast: PlastState
  baseCpos: Point
  //   synCpos: Point // point of synapse
  //   nu: number
  arc: Arc // arc width derived from long-term plast
  arcWidth: number
  synapseId: string
  //   incomingAngle: number
  //   length: number // derived from short-term plast
  sourceId: string
}

export interface PlastState {
  base: number
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

export const initialNeuronState: NeuronState = {
  id: 'n',
  pos: { x: 0, y: 0 },
  theta: 0,
  potential: 0,
  firePeriod: 0,
  useDefaultConfig: true,
  izhik: initialIzhikState,
  axon: { id: 'a', cpos: { x: 50, y: 0 }, synapses: [] },
  dends: []
}

export const initialDendState: DendState = {
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
