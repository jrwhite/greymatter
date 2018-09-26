import { Line, Point } from "../utils/geometry";
import { IAction, IActionWithPayload } from "../actions/helpers";
import {
  moveNeuron,
  addNeuron,
  addSynapse,
  makeGhostSynapseAtDend,
  makeGhostSynapseAtAxon,
  addDend,
  resetGhostSynapse,
  removeNeuron,
  fireNeuron,
  exciteNeuron,
  decayNetwork,
  hyperpolarizeNeuron,
  addInput,
  removeInput,
  removeSynapses,
  removeNeurons,
  moveInput,
  addApToSynapse,
  removeApFromSynapse,
  selectNeuron,
  selectInput,
  changeInputRate,
  changeIzhikParams,
  stepNetwork,
  pauseNetwork,
  resumeNetwork,
  speedUpNetwork,
  slowDownNetwork,
  resetNetwork,
  rotateNeuron,
  changeInputHotkey,
  changeDendWeighting,
  setGymEnv,
  resetGym,
  closeGym,
  stepGym,
  changeGymDone,
  receiveGymStepReply,
  monitorGym,
  changeGymActionSpace,
  changeGymObsSpace
} from "../actions/network";
import { Arc } from "../utils/geometry";
import * as _ from "lodash";
import { Neuron } from "../components/Neuron";
import { INPUT_GHOST } from "@blueprintjs/core/lib/esm/common/classes";
import { stepIzhikPotential, stepIzhikU } from "../utils/runtime";
import { GymEnv } from "../containers/GymClient";
import { DendState, NeuronState, IzhikState, AxonState } from "./neurons";
import { SynapseState } from "./synapses";

export interface ActionPotentialState {
  id: string;
}

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

export interface SelectedNeuronState {
  id: string;
}

export interface SelectedInputState {
  id: string;
}

export interface ConfigState {
  selectedNeurons: Array<SelectedNeuronState>;
  selectedInputs: Array<SelectedInputState>;
  stepSize: number; // in ms,
  stepInterval: number;
  isPaused: boolean;
}

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

export interface NetworkState {
  ghostSynapse: GhostSynapseState;
  neurons: Array<NeuronState>;
  synapses: Array<SynapseState>;
  inputs: Array<InputState>;
  config: ConfigState;
  gym: GymState;
}

const initialNetworkConfigState = {
  selectedNeurons: [],
  selectedInputs: [],
  stepSize: 1,
  stepInterval: 50,
  isPaused: true
};

const initialGymState = {
  observation: {},
  action: undefined,
  reward: 0,
  isDone: true
};

const initialNetworkState: NetworkState = {
  ghostSynapse: { axon: undefined, dend: undefined },
  neurons: [],
  synapses: [],
  inputs: [],
  outputs: [],
  config: initialNetworkConfigState,
  gym: initialGymState
};

export default function network(
  state: NetworkState = initialNetworkState,
  action: IAction
): NetworkState {
  if (selectNeuron.test(action)) {
    return {
      ...state,
      config: {
        ...state.config,
        selectedNeurons: [
          {
            id: action.payload.id
          }
        ]
      }
    };
  } else if (selectInput.test(action)) {
    return {
      ...state,
      config: {
        ...state.config,
        selectedInputs: [
          {
            id: action.payload.id
          }
        ]
      }
    };
  } else if (changeGymDone.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        isDone: action.payload.isDone
      }
    };
  } else if (setGymEnv.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        env: action.payload.env
      }
    };
  } else if (resetGym.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        shouldReset: action.payload.shouldReset
      }
    };
  } else if (closeGym.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        shouldClose: action.payload.shouldClose
      }
    };
  } else if (receiveGymStepReply.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        ...action.payload
      }
    };
  } else if (stepGym.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        shouldStep: action.payload.shouldStep
      }
    };
  } else if (monitorGym.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        shouldMonitor: action.payload.shouldMonitor
      }
    };
  } else if (changeGymActionSpace.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        actionSpace: action.payload.space
      }
    };
  } else if (changeGymObsSpace.test(action)) {
    return {
      ...state,
      gym: {
        ...state.gym,
        observationSpace: action.payload.space
      }
    };
  } else if (changeInputRate.test(action)) {
    return {
      ...state,
      inputs: _.map(state.inputs, (input: InputState) => {
        if (input.id === action.payload.id) {
          return {
            ...input,
            rate: action.payload.rate
          };
        }
        return input;
      })
    };
  } else if (addInput.test(action)) {
    return {
      ...state,
      inputs: [
        ...state.inputs,
        {
          ...initialInputState,
          id: action.payload.id,
          pos: action.payload.pos,
          axon: {
            ...initialInputState.axon,
            id: action.payload.axonId
          }
        }
      ]
    };
  } else if (removeInput.test(action)) {
    return {
      ...state,
      inputs: _.differenceBy(state.inputs, [{ id: action.payload.id }], "id")
    };
  } else if (moveInput.test(action)) {
    return {
      ...state,
      inputs: state.inputs.map((n: InputState) => {
        if (n.id === action.payload.id) {
          return {
            ...n,
            ...action.payload
          };
        }
        return n;
      })
    };
  } else if (changeInputHotkey.test(action)) {
    return {
      ...state,
      inputs: _.map(state.inputs, (input: InputState) => {
        if (input.id == action.payload.id) {
          return {
            ...input,
            hotkey: action.payload.hotkey
          };
        }
        return input;
      })
    };
  } else if (makeGhostSynapseAtAxon.test(action)) {
    return {
      ...state,
      ghostSynapse: {
        axon: {
          ...action.payload
        }
      }
    };
  } else if (makeGhostSynapseAtDend.test(action)) {
    return {
      ...state,
      ghostSynapse: {
        dend: {
          ...action.payload
        }
      }
    };
  } else if (resetGhostSynapse.test(action)) {
    return {
      ...state,
      ghostSynapse: {
        axon: undefined,
        dend: undefined
      }
    };
  } else if (pauseNetwork.test(action)) {
    return {
      ...state,
      config: {
        ...state.config,
        isPaused: true
      }
    };
  } else if (resumeNetwork.test(action)) {
    return {
      ...state,
      config: {
        ...state.config,
        isPaused: false
      }
    };
  } else if (speedUpNetwork.test(action)) {
    return {
      ...state,
      config: {
        ...state.config,
        stepInterval:
          state.config.stepInterval >= 20 ? state.config.stepInterval - 10 : 10
      }
    };
  } else if (slowDownNetwork.test(action)) {
    return {
      ...state,
      config: {
        ...state.config,
        stepInterval: state.config.stepInterval + 10
      }
    };
  } else if (decayNetwork.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map(n => ({
        ...n,
        potential: (n.potential * 63) / 64
      }))
    };
  } else if (resetNetwork.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map(n => ({
        ...n,
        potential: 0
      }))
    };
  } else {
    return state;
  }
}
