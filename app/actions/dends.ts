import { actionCreator } from './helpers'
import { Point } from '../utils/geometry'
import { PlastState } from '../types/dends'

export interface AddSynapseToDendAction {
  id: string
  synapseId: string
}
export const addSynapseToDend = actionCreator<AddSynapseToDendAction>(
  'ADD_SYNAPSE_TO_DEND'
)

export interface SetDendSourceAction {
  id: string
  sourceId: string
}
export const setDendSource = actionCreator<SetDendSourceAction>(
  'SET_DEND_SOURCE'
)

export interface SetDendPlastAction {
  id: string
  plast: PlastState
}
export const setDendPlast = actionCreator<SetDendPlastAction>('SET_DEND_PLAST')

export interface AddDendAction {
  id: string
  neuronId: string
  baseCpos: Point
  synCpos: Point
  nu: number
  incomingAngle: number
}
export const addDend = actionCreator<AddDendAction>('ADD_DEND')

// TODO: implement removeDend in reducer
export interface RemoveDendAction {
  id: string
}
export const removeDend = actionCreator<RemoveDendAction>('REMOVE_DEND')
