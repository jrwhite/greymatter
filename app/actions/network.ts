import * as _ from "lodash";
import { Point } from "../utils/geometry";
import { actionCreator, actionCreatorVoid } from "./helpers";
import { NeuronState } from "../reducers/neurons";
import { IState } from "../reducers";
import { getAxonAbsPos } from "../selectors/synapse";
import { GymEnv } from "../containers/GymClient";
import { exciteNeuron, removeNeuron, addNewDend } from "./neurons";

export interface SelectInputAction {
  id: string;
}

export interface MakeGhostSynapseAtAxonAction {
  id: string;
  neuronId: string;
}

export interface MakeGhostSynapseAtDendAction {
  id: string;
  neuronId: string;
}

export interface AddInput {
  id: string;
  axonId: string;
  pos: Point;
}

export interface RemoveInput {
  id: string;
}

export interface MoveInput {
  id: string;
  pos: Point;
}

export interface ChangeInputRate {
  id: string;
  rate: number;
}

export interface ChangeInputHotkeyAction {
  id: string;
  hotkey: string;
}

export interface ReceiveGymStepReplyAction {
  observation: { [name: string]: any };
  isDone: boolean;
  reward: number;
  info?: any;
}

export interface SetGymEnvAction {
  env: GymEnv;
}

export interface ResetGymAction {
  shouldReset: boolean;
}

export interface CloseGymAction {
  shouldClose: boolean;
}

export interface StepGymAction {
  shouldStep: boolean;
}

export interface ChangeGymDoneAction {
  isDone: boolean;
}

export interface MonitorGymAction {
  shouldMonitor: boolean;
}

export interface ChangeGymSpace {
  space: any;
}

export const changeGymActionSpace = actionCreator<ChangeGymSpace>(
  "CHANGE_GYM_ACTION_SPACE"
);
export const changeGymObsSpace = actionCreator<ChangeGymSpace>(
  "CHANGE_GYM_OBS_SPACE"
);
export const monitorGym = actionCreator<MonitorGymAction>("MONITOR_GYM");
export const stepGym = actionCreator<StepGymAction>("STEP_GYM");
export const closeGym = actionCreator<CloseGymAction>("CLOSE_GYM");
export const setGymEnv = actionCreator<SetGymEnvAction>("SET_GYM_ENV");
export const resetGym = actionCreator<ResetGymAction>("RESET_GYM");
export const receiveGymStepReply = actionCreator<ReceiveGymStepReplyAction>(
  "RECEIVE_GYM_OBSERVATION"
);
export const changeGymDone = actionCreator<ChangeGymDoneAction>("GYM_DONE");
export const changeInputHotkey = actionCreator<ChangeInputHotkeyAction>(
  "CHANGE_INPUT_HOTKEY"
);
export const selectInput = actionCreator<SelectInputAction>("SELECT_INPUT");
export const makeGhostSynapseAtAxon = actionCreator<
  MakeGhostSynapseAtAxonAction
>("MAKE_GHOST_SYNAPSE_AT_AXON");
export const makeGhostSynapseAtDend = actionCreator<
  MakeGhostSynapseAtDendAction
>("MAKE_GHOST_SYNAPSE_AT_DEND");
export const resetGhostSynapse = actionCreatorVoid("RESET_GHOST_SYNAPSE");
export const decayNetwork = actionCreatorVoid("DECAY_NETWORK");
export const addInput = actionCreator<AddInput>("ADD_INPUT");
export const removeInput = actionCreator<RemoveInput>("REMOVE_INPUT");
export const moveInput = actionCreator<MoveInput>("MOVE_INPUT");
export const changeInputRate = actionCreator<ChangeInputRate>(
  "CHANGE_INPUT_RATE"
);
export const pauseNetwork = actionCreatorVoid("PAUSE_NETWORK");
export const resumeNetwork = actionCreatorVoid("RESUME_NETWORK");
export const speedUpNetwork = actionCreatorVoid("SPEED_UP_NETWORK");
export const slowDownNetwork = actionCreatorVoid("SLOW_DOWN_NETWORK");
export const resetNetwork = actionCreatorVoid("RESET_NETWORK");

export function addNewInput(pos: Point) {
  return (dispatch: Function) => {
    const newId = _.uniqueId("in");
    const newAxonId = _.uniqueId("a");
    dispatch(addInput({ id: newId, pos: pos, axonId: newAxonId }));
  };
}

export function removeInputWithSynapses(
  id: string,
  synapses: Array<{ id: string }>
) {
  return (dispatch: Function) => {
    dispatch(removeSynapses({ synapses: synapses }));
    dispatch(removeInput({ id: id }));
  };
}
