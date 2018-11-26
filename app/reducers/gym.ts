import { IAction } from './../actions/helpers'
import {
  changeGymDone,
  setGymEnv,
  resetGym,
  closeGym,
  receiveGymStepReply,
  stepGym,
  monitorGym,
  changeGymActionSpace,
  changeGymObsSpace,
  setGymAction,
  startGym
} from '../actions/gym'
import { GymEnv } from '../containers/GymClient'

export interface GymObservationSpace {
  high: number[]
  low: number[]
  shape: number[]
}

export interface GymState {
  env?: GymEnv
  // observation: { [name: string]: any }
  observations: number[]
  observationSpace?: GymObservationSpace
  action?: number
  actionSpace?: any
  reward: number
  isDone: boolean
  error?: string
  info?: any
  shouldReset?: boolean
  shouldMonitor?: boolean
  shouldClose?: boolean
  shouldStep?: boolean
  shouldStart?: boolean
  stepRatio: number
}

const initialGymState = {
  observations: [],
  // action: undefined,
  action: 0,
  reward: 0,
  isDone: true,
  stepRatio: 10
}

export function gym (
  state: GymState = initialGymState,
  action: IAction
): GymState {
  if (changeGymDone.test(action)) {
    return {
      ...state,
      isDone: action.payload.isDone
    }
  } else if (setGymEnv.test(action)) {
    return {
      ...state,
      env: action.payload.env
    }
  } else if (resetGym.test(action)) {
    return {
      ...state,
      shouldReset: action.payload.shouldReset
    }
  } else if (closeGym.test(action)) {
    return {
      ...state,
      shouldClose: action.payload.shouldClose
    }
  } else if (receiveGymStepReply.test(action)) {
    return {
      ...state,
      ...action.payload
    }
  } else if (setGymAction.test(action)) {
    return {
      ...state,
      action: action.payload.action
    }
  } else if (stepGym.test(action)) {
    return {
      ...state,
      shouldStep: action.payload.shouldStep
    }
  } else if (monitorGym.test(action)) {
    return {
      ...state,
      shouldMonitor: action.payload.shouldMonitor
    }
  } else if (changeGymActionSpace.test(action)) {
    return {
      ...state,
      actionSpace: action.payload.space
    }
  } else if (changeGymObsSpace.test(action)) {
    return {
      ...state,
      observationSpace: action.payload.space
    }
  } else if (startGym.test(action)) {
    return {
      ...state,
      shouldStart: action.payload.shouldStart
    }
  } else {
    return state
  }
}
