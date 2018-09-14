import { IState } from "../reducers";
import * as _ from 'lodash'
import { SynapseState, NeuronState, IzhikState } from "../reducers/network";

const d3 = require('d3')

const exciteNeuron = (neuron: NeuronState, dendId: string) => {
    neuron.potential += neuron.dends.find(d => d.id == dendId)!!.weighting
}

const fireSynapse = (neurons: Array<NeuronState>, synapse: SynapseState) => {
    neurons.find(n => n.id == synapse.dend.neuronId)
}

// v in mV
export const stepIzhikPotential = (
    v: number,
    izhik: IzhikState,
    stepSize: number = 1
) : number => {
    return v + stepSize * (
        (0.04 * Math.pow(v,2)) + (5 * v) + 140 - izhik.u + izhik.current 
    )
}

export const stepIzhikU = (
    v: number,
    izhik: IzhikState,
    stepSize: number = 1
) : number => {
    const u = izhik.u
    const {a, b} = izhik.params
    return u + a * (b * v - u)
}