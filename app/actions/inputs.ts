import { actionCreator } from './helpers'
import { Point } from 'electron'
import _ = require('lodash')
import { removeSynapses, addNewSynapse } from './synapses'
import { IState } from '../reducers'
import { resetGhostSynapse, makeGhostSynapseAtAxon } from './ghostSynapse'
export interface SelectInputAction {
  id: string
}

export interface AddInput {
  id: string
  axonId: string
  pos: Point
}

export interface RemoveInput {
  id: string
}

export interface MoveInput {
  id: string
  pos: Point
}

export interface ChangeInputRate {
  id: string
  rate: number
}

export interface ChangeInputHotkeyAction {
  id: string
  hotkey: string
}

export interface AddSynapseToInputAxonAction {
  inputId: string
  axonId: string
  synapseId: string
}

export const addSynapseToInputAxon = actionCreator<AddSynapseToInputAxonAction>(
  'ADD_SYNAPSE_TO_INPUT_AXON'
)
export const changeInputHotkey = actionCreator<ChangeInputHotkeyAction>(
  'CHANGE_INPUT_HOTKEY'
)
export const selectInput = actionCreator<SelectInputAction>('SELECT_INPUT')
export const addInput = actionCreator<AddInput>('ADD_INPUT')
export const removeInput = actionCreator<RemoveInput>('REMOVE_INPUT')
export const moveInput = actionCreator<MoveInput>('MOVE_INPUT')
export const changeInputRate = actionCreator<ChangeInputRate>(
  'CHANGE_INPUT_RATE'
)

export function addNewInput (pos: Point) {
  return (dispatch: Function) => {
    const newId = _.uniqueId('in')
    const newAxonId = _.uniqueId('a')
    dispatch(addInput({ id: newId, pos, axonId: newAxonId }))
  }
}

export function removeInputWithSynapses (
  id: string,
  synapses: Array<{ id: string }>
) {
  return (dispatch: Function) => {
    dispatch(removeSynapses({ synapses }))
    dispatch(removeInput({ id }))
  }
}

export function tryMakeSynapseAtInputAxon (id: string, neuronId: string) {
  return (dispatch: Function, getState: () => IState) => {
    const ghost = getState().network.ghostSynapse

    if (ghost.dend && !ghost.axon) {
      dispatch(
        addNewSynapse({
          axon: { id, neuronId },
          dend: { id: ghost.dend.id, neuronId: ghost.dend.neuronId }
        })
      )
      dispatch(resetGhostSynapse())
    } else {
      dispatch(makeGhostSynapseAtAxon({ id, neuronId }))
    }
  }
}
