import { actionCreator } from './helpers'
import { Point } from '../utils/geometry'
import { PlastState } from '../types/dends'
import * as _ from 'lodash'
import { IState } from '../reducers'

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
  // baseCpos: Point
  // synCpos: Point
  // nu: number
  // incomingAngle: number
}
export const addDend = actionCreator<AddDendAction>('ADD_DEND')

export interface AddNewDendAction {
  neuronId: string
}
export function addNewDend (payload: AddNewDendAction) {
  return (dispatch: Function, getState: () => IState) => {
    const newId = _.uniqueId('d')
    dispatch(addDend({ id: newId, neuronId: payload.neuronId }))
  }
}

export interface TryMakeSynapseAtNewDendAction {
  neuronId: string
}
export function tryMakeSynapseAtNewDend (
  payload: TryMakeSynapseAtNewDendAction
) {
  return (dispatch: Function, getState: () => IState) => {
    dispatch
  }
}

// TODO: implement removeDend in reducer
export interface RemoveDendAction {
  id: string
}
export const removeDend = actionCreator<RemoveDendAction>('REMOVE_DEND')
