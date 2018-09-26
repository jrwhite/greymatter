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
import { DendState, NeuronState, IzhikState, AxonState } from "./neuron";

export interface ActionPotentialState {
  id: string;
}

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

export interface InputState {
  id: string;
  rate: number;
  pos: Point;
  axon: AxonState;
  hotkey?: string;
}

export interface OutputState {
  id: string;
  interface: string;
  pos: Point;
  dends: Array<DendState>;
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
  outputs: Array<OutputState>;
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

const initialInputState: InputState = {
  id: "in",
  rate: 0,
  pos: { x: 0, y: 0 },
  axon: { id: "a", cpos: { x: 50, y: 0 }, synapses: [] },
  hotkey: undefined
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
  if (removeSynapses.test(action)) {
    return {
      ...state,
      inputs: _.map(state.inputs, n => ({
        ...n,
        axon: {
          ...n.axon,
          synapses: _.differenceBy(
            n.axon.synapses,
            action.payload.synapses,
            "id"
          )
        }
      })),
      neurons: _.map(state.neurons, n => ({
        ...n,
        axon: {
          ...n.axon,
          synapses: _.differenceBy(
            n.axon.synapses,
            action.payload.synapses,
            "id"
          )
        },
        dends: _.differenceWith(
          n.dends,
          action.payload.synapses,
          (a, b) => a.synapseId == b.id
        )
      })),
      synapses: _.differenceBy(state.synapses, action.payload.synapses, "id")
    };
  } else if (selectNeuron.test(action)) {
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
  } else if (addApToSynapse.test(action)) {
    return {
      ...state,
      synapses: state.synapses.map(s => {
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
      })
    };
  } else if (removeApFromSynapse.test(action)) {
    return {
      ...state,
      synapses: state.synapses.map(s => {
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
      })
    };
  } else if (addSynapse.test(action)) {
    return {
      ...state,
      // split into two reducers (synapse,neuron) with this logic in action
      inputs: state.inputs.map(n => {
        if (n.id == action.payload.axon.neuronId) {
          return {
            ...n,
            axon: {
              ...n.axon,
              synapses: _.concat(n.axon.synapses, { id: action.payload.id })
            }
          };
        }
        return n;
      }),
      neurons: state.neurons.map(n => {
        if (n.id == action.payload.axon.neuronId) {
          return {
            ...n,
            axon: {
              ...n.axon,
              synapses: _.concat(n.axon.synapses, { id: action.payload.id })
            }
          };
        } else if (n.id == action.payload.dend.neuronId) {
          return {
            ...n,
            dends: n.dends.map(d => {
              if (d.id == action.payload.dend.id) {
                return {
                  ...d,
                  synapseId: action.payload.id
                };
              }
              return d;
            })
          };
        }
        return n;
      }),
      synapses: [
        ...state.synapses,
        {
          ...initialSynapseState,
          ...action.payload
        }
      ]
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
