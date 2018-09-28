import {
  makeGhostSynapseAtAxon,
  makeGhostSynapseAtDend,
  resetGhostSynapse,
} from '../actions/ghostSynapse';
import { IAction } from './../actions/helpers';
export interface GhostSynapseState {
  axon?: {
    id: string;
    neuronId: string;
  };
  dend?: {
    id: string;
    neuronId: string;
  };
}

export const initialGhostSynapseState = {
  axon: undefined,
  dend: undefined,
};

export function ghostSynapse(
  state: GhostSynapseState = initialGhostSynapseState,
  action: IAction
): GhostSynapseState {
  if (makeGhostSynapseAtAxon.test(action)) {
    return {
      axon: {
        ...action.payload,
      },
    };
  } else if (makeGhostSynapseAtDend.test(action)) {
    return {
      dend: {
        ...action.payload,
      },
    };
  } else if (resetGhostSynapse.test(action)) {
    return {
      axon: undefined,
      dend: undefined,
    };
  } else {
    return state;
  }
}
