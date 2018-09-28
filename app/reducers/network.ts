import * as _ from "lodash";
import neurons, { NeuronState } from "./neurons";
import synapses, { SynapseState } from "./synapses";
import inputs, { InputState } from "./inputs";
import config, { ConfigState } from "./config";
import { combineReducers } from "redux";
import { ghostSynapse, GhostSynapseState } from "./ghostSynapse";
import { GymState, gym } from "./gym";

export interface ActionPotentialState {
  id: string;
}

export interface NetworkState {
  ghostSynapse: GhostSynapseState;
  neurons: Array<NeuronState>;
  synapses: Array<SynapseState>;
  inputs: Array<InputState>;
  config: ConfigState;
  gym: GymState;
}

const network = combineReducers({
  ghostSynapse,
  neurons,
  synapses,
  inputs,
  config,
  gym
});

export default network;
