import { IAction } from "./../actions/helpers";
import {
  changeGymDone,
  setGymEnv,
  resetGym,
  closeGym,
  receiveGymStepReply,
  stepGym,
  monitorGym,
  changeGymActionSpace,
  changeGymObsSpace
} from "../actions/gym";
import { GymEnv } from "../containers/GymClient";
export interface GymState {
  env?: GymEnv;
  observation: { [name: string]: any };
  observationSpace?: any;
  action?: number;
  actionSpace?: any;
  reward: number;
  isDone: boolean;
  error?: string;
  info?: any;
  shouldReset?: boolean;
  shouldMonitor?: boolean;
  shouldClose?: boolean;
  shouldStep?: boolean;
}

const initialGymState = {
  observation: {},
  action: undefined,
  reward: 0,
  isDone: true
};

export function gym(state: GymState, action: IAction): GymState {
  if (changeGymDone.test(action)) {
    return {
      ...state,
      isDone: action.payload.isDone
    };
  } else if (setGymEnv.test(action)) {
    return {
      ...state,
      env: action.payload.env
    };
  } else if (resetGym.test(action)) {
    return {
      ...state,
      shouldReset: action.payload.shouldReset
    };
  } else if (closeGym.test(action)) {
    return {
      ...state,
      shouldClose: action.payload.shouldClose
    };
  } else if (receiveGymStepReply.test(action)) {
    return {
      ...state,
      ...action.payload
    };
  } else if (stepGym.test(action)) {
    return {
      ...state,
      shouldStep: action.payload.shouldStep
    };
  } else if (monitorGym.test(action)) {
    return {
      ...state,
      shouldMonitor: action.payload.shouldMonitor
    };
  } else if (changeGymActionSpace.test(action)) {
    return {
      ...state,
      actionSpace: action.payload.space
    };
  } else if (changeGymObsSpace.test(action)) {
    return {
      ...state,
      observationSpace: action.payload.space
    };
  } else {
    return state;
  }
}