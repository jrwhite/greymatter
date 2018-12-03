import { Point, Arc } from '../utils/geometry'
import { NormalizedObjects } from './normalized'

export interface NeuronState {
  id: string
  name?: string
  pos: Point
  theta: number
  potential: number
  firePeriod: number
  pulseTimes: NormalizedObjects<PulseTime>
  useDefaultConfig: boolean
  izhik: IzhikState
  axon: AxonState
  dendIds: string[]
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
