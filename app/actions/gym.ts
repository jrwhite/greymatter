import { GymEnv } from '../containers/GymClient'
import { actionCreator } from './helpers'

export interface ReceiveGymStepReplyAction {
  observation: { [name: string]: any }
  isDone: boolean
  reward: number
  info?: any
}

export interface SetGymEnvAction {
  env: GymEnv
}

export interface ResetGymAction {
  shouldReset: boolean
}

export interface CloseGymAction {
  shouldClose: boolean
}

export interface StepGymAction {
  shouldStep: boolean
}

export interface ChangeGymDoneAction {
  isDone: boolean
}

export interface MonitorGymAction {
  shouldMonitor: boolean
}

export interface ChangeGymSpace {
  space: any
}

export interface SetGymActionAction {
  action: any
}

export const setGymAction = actionCreator<SetGymActionAction>('SET_GYM_ACTION')

export const changeGymActionSpace = actionCreator<ChangeGymSpace>(
  'CHANGE_GYM_ACTION_SPACE'
)
export const changeGymObsSpace = actionCreator<ChangeGymSpace>(
  'CHANGE_GYM_OBS_SPACE'
)
export const monitorGym = actionCreator<MonitorGymAction>('MONITOR_GYM')
export const stepGym = actionCreator<StepGymAction>('STEP_GYM')
export const closeGym = actionCreator<CloseGymAction>('CLOSE_GYM')
export const setGymEnv = actionCreator<SetGymEnvAction>('SET_GYM_ENV')
export const resetGym = actionCreator<ResetGymAction>('RESET_GYM')
export const receiveGymStepReply = actionCreator<ReceiveGymStepReplyAction>(
  'RECEIVE_GYM_OBSERVATION'
)
export const changeGymDone = actionCreator<ChangeGymDoneAction>('GYM_DONE')
