import * as _ from 'lodash'
import { combineReducers } from 'redux'
import config, { ConfigState } from './config'
import { ghostSynapse, GhostSynapseState } from './ghostSynapse'
import { gym, GymState } from './gym'
import inputs, { InputState } from './inputs'
import neurons from './neurons'
import synapses, { SynapseState } from './synapses'
import encodings, { EncodedSourceState } from './encodings'
import observables, { ObservableState } from './observables'
import { NormalizedObjects } from '../types/normalized';
import { NeuronState } from '../types/neurons';

export interface ActionPotentialState {
  id: string
  shouldAnimate: boolean
  progress: number
}

export interface NetworkState {
  ghostSynapse: GhostSynapseState
  neurons: NormalizedObjects<NeuronState>
  synapses: SynapseState[]
  inputs: InputState[]
  config: ConfigState
  gym: GymState
  encodings: EncodedSourceState[]
  observables: ObservableState[]
}

const network = combineReducers({
  ghostSynapse,
  neurons,
  synapses,
  inputs,
  config,
  gym,
  encodings,
  observables
})

export default network
