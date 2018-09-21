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

export type AxonStateType = {
  id: string;
  cpos: Point;
  synapses: Array<{ id: string }>;
};

export type PlastStateType = {
  short: number; // short term plasticity
  long: number; // long-term plasticity
};

export type DendStateType = {
  id: string;
  weighting: number; // derived from plast
  plast: PlastStateType;
  baseCpos: Point;
  synCpos: Point; // point of synapse
  nu: number;
  arc: Arc; // arc width derived from long-term plast
  synapseId: string;
  incomingAngle: number;
  length: number; // derived from short-term plast
};

export type IzhikParams = {
  a: number;
  b: number;
  c: number;
  d: number;
};

export type IzhikState = {
  params: IzhikParams;
  u: number;
  current: number;
  potToMv: (pot: number) => number; // multiply with potential to get mV
  mvToPot: (mv: number) => number;
};

export type NeuronState = {
  id: string;
  pos: Point;
  theta: number;
  potential: number;
  izhik: IzhikState;
  axon: AxonStateType;
  dends: Array<DendStateType>;
};

export type ActionPotentialState = {
  id: string;
};

export type SynapseState = {
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
};

export type GhostSynapseState = {
  axon?: {
    id: string;
    neuronId: string;
  };
  dend?: {
    id: string;
    neuronId: string;
  };
};

export type InputState = {
  id: string;
  rate: number;
  pos: Point;
  axon: AxonStateType;
  hotkey?: string;
};

export type OutputState = {
  id: string;
  type: string;
  pos: Point;
  dends: Array<DendStateType>;
};

export type SelectedNeuronState = {
  id: string;
};

export type SelectedInputState = {
  id: string;
};

export type NetworkConfigState = {
  selectedNeurons: Array<SelectedNeuronState>;
  selectedInputs: Array<SelectedInputState>;
  stepSize: number; // in ms,
  stepInterval: number;
  isPaused: boolean;
};

export type GymState = {
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
};

export type NetworkState = {
  ghostSynapse: GhostSynapseState;
  neurons: Array<NeuronState>;
  synapses: Array<SynapseState>;
  inputs: Array<InputState>;
  outputs: Array<OutputState>;
  config: NetworkConfigState;
  gym: GymState;
};

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

const initialIzhikState: IzhikState = {
  params: {
    a: 0.02,
    b: 0.2,
    c: -65,
    d: 2
  },
  u: 0,
  current: 0,
  potToMv: (pot: number) => pot * (30 / 100),
  mvToPot: (mv: number) => mv * (100 / 30)
};

const initialNeuronState: NeuronState = {
  id: "n",
  pos: { x: 0, y: 0 },
  theta: 0,
  potential: 0,
  izhik: initialIzhikState,
  axon: { id: "a", cpos: { x: 50, y: 0 }, synapses: [] },
  dends: []
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

const initialDendState: DendStateType = {
  id: "d",
  weighting: 30,
  plast: { short: 15, long: 15 },
  baseCpos: { x: 0, y: 0 },
  synCpos: { x: 0, y: 0 },
  nu: 1,
  arc: { start: 1, stop: 1 },
  synapseId: "s",
  incomingAngle: 1,
  length: 2
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
  if (moveNeuron.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map((n: NeuronState) => {
        if (n.id === action.payload.id) {
          return {
            ...n,
            ...action.payload
          };
        }
        return n;
      })
    };
  } else if (addNeuron.test(action)) {
    return {
      ...state,
      neurons: [
        ...state.neurons,
        {
          ...initialNeuronState,
          id: action.payload.id,
          pos: action.payload.pos,
          axon: {
            ...initialNeuronState.axon,
            id: action.payload.axonId
          }
        }
      ]
    };
  } else if (removeNeurons.test(action)) {
    return {
      ...state,
      neurons: _.differenceBy(state.neurons, action.payload.neurons, "id")
    };
  } else if (removeSynapses.test(action)) {
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
  } else if (rotateNeuron.test(action)) {
    return {
      ...state,
      neurons: _.map(state.neurons, (n: NeuronState) => {
        if (n.id == action.payload.id) {
          return {
            ...n,
            theta: action.payload.theta
          };
        }
        return n;
      })
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
  } else if (changeIzhikParams.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map((n: NeuronState) => {
        if (n.id == action.payload.id) {
          return {
            ...n,
            izhik: {
              ...n.izhik,
              params: {
                ...n.izhik.params,
                ...action.payload.params
              }
            }
          };
        }
        return n;
      })
    };
  } else if (changeDendWeighting.test(action)) {
    return {
      ...state,
      neurons: _.map(state.neurons, (n: NeuronState) => {
        if (n.id == action.payload.neuronId) {
          return {
            ...n,
            dends: _.map(n.dends, (d: DendStateType) => {
              if (d.id == action.payload.dendId) {
                return {
                  ...d,
                  weighting: action.payload.weighting
                };
              }
              return d;
            })
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
  } else if (exciteNeuron.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map(n => {
        if (n.id == action.payload.id) {
          return {
            ...n,
            potential:
              n.potential +
              n.dends.find(d => d.id == action.payload.dendId)!!.weighting
          };
        }
        return n;
      })
    };
  } else if (hyperpolarizeNeuron.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map(n => {
        if (n.id == action.payload.id) {
          return {
            ...n,
            potential: n.izhik.mvToPot(n.izhik.params.c),
            izhik: {
              ...n.izhik,
              u: n.izhik.u + n.izhik.params.d
            }
          };
        }
        return n;
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
  } else if (addDend.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map((n: NeuronState) => {
        if (n.id == action.payload.neuronId) {
          return {
            ...n,
            dends: [
              ...n.dends,
              {
                ...initialDendState,
                ...action.payload,
                arc: {
                  start: action.payload.nu - 1 / 16,
                  stop: action.payload.nu + 1 / 16
                }
              }
            ]
          };
        }
        return n;
      })
    };
  } else if (resetGhostSynapse.test(action)) {
    return {
      ...state,
      ghostSynapse: {
        axon: undefined,
        dend: undefined
      }
    };
  } else if (stepNetwork.test(action)) {
    return {
      ...state,
      neurons: state.neurons.map((n: NeuronState) => {
        const v = n.izhik.potToMv(n.potential);
        return {
          ...n,
          potential: n.izhik.mvToPot(stepIzhikPotential(v, n.izhik)),
          izhik: {
            ...n.izhik,
            u: stepIzhikU(v, n.izhik)
          }
        };
      })
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
