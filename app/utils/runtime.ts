import { IState } from "../reducers";
import * as _ from 'lodash'
import { SynapseState, NeuronState } from "../reducers/network";

const d3 = require('d3')

const exciteNeuron = (neuron: NeuronState, dendId: string) => {
    neuron.potential += neuron.dends.find(d => d.id == dendId)!!.weighting
}

const fireSynapse = (neurons: Array<NeuronState>, synapse: SynapseState) => {
    neurons.find(n => n.id == synapse.dend.neuronId)
}

const step = (state: IState) => {
}

const startRuntime = () => {
    const interval = d3.interval(step, 100)
}