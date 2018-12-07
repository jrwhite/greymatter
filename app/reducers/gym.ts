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
  startGym,
  setGymStepRatio
} from '../actions/gym'
import { GymEnv } from '../containers/GymClient'

export const maxGymStepRatio = 500
export const minGymStepRatio = 10

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
  actionSpace?: any
  reward: number
  prevTotalReward: number
  curTotalReward: number
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
  prevTotalReward: 0,
  curTotalReward: 0,
  isDone: true,
  stepRatio: 50
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
    if (action.payload.shouldReset === false) {
      return {
        ...state,
        shouldReset: false,
        prevTotalReward: state.curTotalReward,
        curTotalReward: 0
      }
    }
    return {
      ...state,
      shouldReset: true
    }
  } else if (closeGym.test(action)) {
    return {
      ...state,
      shouldClose: action.payload.shouldClose
    }
  } else if (setGymStepRatio.test(action)) {
    return {
      ...state,
      ...action.payload
    }
  } else if (receiveGymStepReply.test(action)) {
    return {
      ...state,
      ...action.payload,
      curTotalReward: state.curTotalReward + action.payload.reward
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
