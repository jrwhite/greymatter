import { actionCreatorVoid, actionCreator } from './helpers'
import { Point } from '../utils/geometry'
import { AxonType, StdpType } from '../reducers/neurons'
import { MoveControlPointAction } from './encodings'
import { StdpModTypes } from '../reducers/config'

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

export const moveStdpControlPoint = actionCreator<MoveControlPointAction>(
  'MOVE_STDP_CONTROL_POINT'
)

export interface MoveModControlPointAction extends MoveControlPointAction {
  modType: StdpModTypes
  stdpType: StdpType
}

export const moveModControlPoint = actionCreator<MoveModControlPointAction>(
  'MOVE_MOD_CONTROL_POINT'
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

export function moveDaControlPoint (payload: MoveControlPointAction) {
  return (dispatch: Function) => {
    dispatch(
      moveModControlPoint({
        ...payload,
        modType: StdpModTypes.Volume,
        stdpType: StdpType.Potentiation
      })
    )
  }
}
