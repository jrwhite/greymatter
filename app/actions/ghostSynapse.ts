import { actionCreator, actionCreatorVoid } from "./helpers";
export interface MakeGhostSynapseAtAxonAction {
  id: string;
  neuronId: string;
}

export interface MakeGhostSynapseAtDendAction {
  id: string;
  neuronId: string;
}
export const makeGhostSynapseAtAxon = actionCreator<
  MakeGhostSynapseAtAxonAction
>("MAKE_GHOST_SYNAPSE_AT_AXON");
export const makeGhostSynapseAtDend = actionCreator<
  MakeGhostSynapseAtDendAction
>("MAKE_GHOST_SYNAPSE_AT_DEND");

export const resetGhostSynapse = actionCreatorVoid("RESET_GHOST_SYNAPSE");
