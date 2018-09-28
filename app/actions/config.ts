import { actionCreatorVoid } from "./helpers";

export interface SelectNeuronAction {
  id: string;
}

export const decayNetwork = actionCreatorVoid("DECAY_NETWORK");
export const pauseNetwork = actionCreatorVoid("PAUSE_NETWORK");
export const resumeNetwork = actionCreatorVoid("RESUME_NETWORK");
export const speedUpNetwork = actionCreatorVoid("SPEED_UP_NETWORK");
export const slowDownNetwork = actionCreatorVoid("SLOW_DOWN_NETWORK");
export const resetNetwork = actionCreatorVoid("RESET_NETWORK");
