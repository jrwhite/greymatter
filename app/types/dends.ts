import { Point, Arc } from "../utils/geometry";

// TODO: make selectors for everything derived from weighting/plasticity

export interface DendState {
  id: string
  plast: PlastState
  baseCpos: Point
  synCpos: Point // point of synapse
  nu: number
  arc: Arc // arc width derived from long-term plast
  synapseId: string
  incomingAngle: number
  length: number // derived from short-term plast
  sourceId: string
}

export interface PlastState {
  base: number
  short: number // short term plasticity
  long: number // long-term plasticity
}