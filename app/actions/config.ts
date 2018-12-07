import { actionCreatorVoid, actionCreator } from './helpers'

export interface SelectNeuronAction {
  id: string
}

export interface SetDefaultIzhikParamsAction {
  receptors: number
  a: number
  b: number
  c: number
  d: number
}

export const setDefaultIzhikParams = actionCreator<SetDefaultIzhikParamsAction>(
  'SET_DEFAULT_IZHIK_PARAMS'
)

export interface SetStepSizeAction {
  stepSize: number
}
export const setStepSize = actionCreator<SetStepSizeAction>('SET_STEP_SIZE')

export interface SetStepIntervalAction {
  stepInterval: number
}
export const setStepInterval = actionCreator<SetStepIntervalAction>(
  'SET_STEP_INTERVAL'
)

export const decayNetwork = actionCreatorVoid('DECAY_NETWORK')
export const pauseNetwork = actionCreatorVoid('PAUSE_NETWORK')
export const resumeNetwork = actionCreatorVoid('RESUME_NETWORK')
export const speedUpNetwork = actionCreatorVoid('SPEED_UP_NETWORK')
export const slowDownNetwork = actionCreatorVoid('SLOW_DOWN_NETWORK')
export const resetNetwork = actionCreatorVoid('RESET_NETWORK')
