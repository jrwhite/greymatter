import { actionCreatorVoid, actionCreator } from './helpers'

export interface SelectNeuronAction {
  id: string
}

export interface SetDefaultIzhikParamsAction {
  a: number
  b: number
  c: number
  d: number
}

export const setDefaultIzhikParams = actionCreator<SetDefaultIzhikParamsAction>(
  'SET_DEFAULT_IZHIK_PARAMS'
)

export const decayNetwork = actionCreatorVoid('DECAY_NETWORK')
export const pauseNetwork = actionCreatorVoid('PAUSE_NETWORK')
export const resumeNetwork = actionCreatorVoid('RESUME_NETWORK')
export const speedUpNetwork = actionCreatorVoid('SPEED_UP_NETWORK')
export const slowDownNetwork = actionCreatorVoid('SLOW_DOWN_NETWORK')
export const resetNetwork = actionCreatorVoid('RESET_NETWORK')
