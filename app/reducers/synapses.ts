import { IAction } from "./../actions/helpers";
import {
  removeSynapses,
  addApToSynapse,
  removeApFromSynapse,
  addSynapse
} from "../actions/synapses";
import { ActionPotentialState } from "./network";
import _ = require("lodash");
export interface SynapseState {
  id: string;
  axon: {
    id: string;
    neuronId: string;
  };
  dend: {
    id: string;
    neuronId: string;
  };
  length: number;
  width: number;
  speed: number;
  isFiring: boolean;
  actionPotentials: Array<ActionPotentialState>;
}

const initialSynapseState: SynapseState = {
  id: "s",
  axon: { id: "a", neuronId: "n" },
  dend: { id: "d", neuronId: "n" },
  length: 100,
  width: 2,
  speed: 1,
  isFiring: false,
  actionPotentials: []
};

export default function synapses(
  state: Array<SynapseState> = [],
  action: IAction
): Array<SynapseState> {
  if (removeSynapses.test(action)) {
    // inputs: _.map(state.inputs, n => ({
    //   ...n,
    //   axon: {
    //     ...n.axon,
    //     synapses: _.differenceBy(
    //       n.axon.synapses,
    //       action.payload.synapses,
    //       "id"
    //     )
    //   }
    // })),
    return _.differenceBy(state, action.payload.synapses, "id");
  } else if (addApToSynapse.test(action)) {
    return state.map(s => {
      if (s.id == action.payload.synapseId) {
        return {
          ...s,
          actionPotentials: [
            ...s.actionPotentials,
            {
              id: action.payload.id
            }
          ]
        };
      }
      return s;
    });
  } else if (removeApFromSynapse.test(action)) {
    return state.map(s => {
      if (s.id == action.payload.synapseId) {
        return {
          ...s,
          actionPotentials: _.differenceBy(
            s.actionPotentials,
            [action.payload],
            "id"
          )
        };
      }
      return s;
    });
  } else if (addSynapse.test(action)) {
    // split into two reducers (synapse,neuron) with this logic in action
    // to neuron reducer: add addSynapseToDend and addSynapseToAxon

    // inputs: state.inputs.map(n => {
    //   if (n.id == action.payload.axon.neuronId) {
    //     return {
    //       ...n,
    //       axon: {
    //         ...n.axon,
    //         synapses: _.concat(n.axon.synapses, { id: action.payload.id })
    //       }
    //     };
    //   }
    //   return n;
    // }),
    return [
      ...state,
      {
        ...initialSynapseState,
        ...action.payload
      }
    ];
  } else {
    return state;
  }
}
