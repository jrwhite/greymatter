import { actionCreator, actionCreatorVoid } from './helpers'

export interface AddDaAction {
  amount: number
}
export const addDa = actionCreator<AddDaAction>('ADD_DA')

export const decayDa = actionCreatorVoid('DECAY_DA')
