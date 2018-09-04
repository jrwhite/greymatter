import { Line, Point } from "../utils/geometry";
import { IAction, IActionWithPayload } from "../actions/helpers";
import { moveNeuron, addNeuron, addSynapse, makeGhostSynapseAtDend, makeGhostSynapseAtAxon, addDend, resetGhostSynapse, removeNeuron, fireNeuron, exciteNeuron,  decayNetwork, hyperpolarizeNeuron, addInput, removeInput, removeSynapses, removeNeurons, moveInput, addApToSynapse, removeApFromSynapse,  } from "../actions/network";
import { Arc } from '../utils/geometry'
import * as _ from 'lodash'
import { Neuron } from "../components/Neuron";

export type AxonStateType = {
    id: string,
    cpos: Point,
    synapses: Array<{id: string}>
}

export type PlastStateType = {
    short: number, // short term plasticity
    long: number // long-term plasticity
}

export type DendStateType = {
    id: string,
    weighting: number, // derived from plast
    plast: PlastStateType,
    baseCpos: Point,
    synCpos: Point, // point of synapse
    nu: number,
    arc: Arc, // arc width derived from long-term plast
    synapseId: string,
    incomingAngle: number,
    length: number // derived from short-term plast
}

export type NeuronState = {
    id: string,
    pos: Point,
    potential: number,
    axon: AxonStateType,
    dends: Array<DendStateType>
}

export type ActionPotentialState = {
    id: string
}

export type SynapseState = {
    id: string,
    axon: {
        id: string,
        neuronId: string,
    },
    dend: {
        id: string,
        neuronId: string,
    },
    length: number,
    width: number,
    speed: number,
    isFiring: boolean,
    actionPotentials: Array<ActionPotentialState>
}

export type GhostSynapseState = {
    axon?: {
        id: string,
        neuronId: string
    },
    dend?: {
        id: string,
        neuronId: string
    }
}

export type InputState = {
    id: string,
    type: string,
    pos: Point,
    axon: AxonStateType,
}

export type OutputState = {
    id: string,
    type: string,
    pos: Point,
    dends: Array<DendStateType>
}

export type NetworkState = {
    ghostSynapse: GhostSynapseState,
    neurons: Array<NeuronState>,
    synapses: Array<SynapseState>,
    inputs:  Array<InputState>,
    outputs: Array<OutputState>,
}

const initialNeuronState: NeuronState = {
    id: 'n',
    pos: {x: 0, y: 0},
    potential: 0,
    axon: {id: 'a', cpos: {x: 50, y: 0}, synapses: []},
    dends: []
}

const initialSynapseState: SynapseState = {
    id: 's',
    axon: {id: 'a', neuronId: 'n'},
    dend: {id: 'd', neuronId: 'n'},
    length: 100,
    width: 2,
    speed: 1,
    isFiring: false,
    actionPotentials: []
}

const initialDendState: DendStateType = {
    id: 'd',
    weighting: 30,
    plast: {short: 15, long: 15},
    baseCpos: {x: 0, y: 0},
    synCpos: {x: 0, y: 0},
    nu: 1,
    arc: {start:1, stop:1},
    synapseId: 's',
    incomingAngle: 1,
    length: 2
}
const initialInputState: InputState = {
    id: 'in',
    type: 'click',
    pos: {x: 0, y: 0},
    axon: {id: 'a', cpos: {x: 50, y: 0}, synapses: []},
}

const initialNetworkState: NetworkState = {
    ghostSynapse: {axon: undefined, dend: undefined},
    neurons: [],
    synapses: [],
    inputs: [],
    outputs: [],
}

export default function network(
    state: NetworkState = initialNetworkState,
    action: IAction
 ) : NetworkState {
    if (moveNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(
                (n: NeuronState) => {
                    if (n.id === action.payload.id) {
                        return {
                            ...n,
                            ...action.payload
                        }
                    }
                    return n
                }
            )
        }
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
        }
    } else if (removeNeurons.test(action)) {

        return {
            ...state,
            neurons: _.differenceBy(state.neurons, action.payload.neurons, 'id')
        }
    } else if (removeSynapses.test(action)) {
        return {
            ...state,
            inputs: _.map(state.inputs, n => ({
                ...n,
                axon: {
                    ...n.axon,
                    synapses: _.differenceBy(n.axon.synapses, action.payload.synapses, 'id')
                }
            })),
            neurons: _.map(state.neurons, n => ({
                ...n,
                axon: {
                    ...n.axon,
                    synapses: _.differenceBy(n.axon.synapses, action.payload.synapses, 'id')
                },
                dends: _.differenceWith(n.dends, action.payload.synapses, (a,b) => a.synapseId == b.id)
            })),
            synapses: _.differenceBy(state.synapses, action.payload.synapses, 'id')
        }
    }
    else if (addInput.test(action)) {
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
        }
    } else if (removeInput.test(action)) {
        return {
            ...state,
            inputs: _.differenceBy(state.inputs, [{id: action.payload.id}], 'id')
        }
    } else if (moveInput.test(action)) {
        return {
            ...state,
            inputs: state.inputs.map(
                (n: InputState) => {
                    if (n.id === action.payload.id) {
                        return {
                            ...n,
                            ...action.payload
                        }
                    }
                    return n
                }
            )
        }
    }
    else if (exciteNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(n => {
                if (n.id == action.payload.id) {
                    return {
                        ...n,
                        potential: n.potential + n.dends.find(d => d.id == action.payload.dendId)!!.weighting
                    }
                }
                return n
            })
        }
    } else if (hyperpolarizeNeuron.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(n => {
                if (n.id == action.payload.id) {
                    return {
                        ...n,
                        potential: -100
                    }
                }
                return n
            })
        }
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
                    }
                }
                return s
            })
        }
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
                            'id'
                        )
                    }
                }
                return s
            })
        }
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
                            synapses: _.concat(
                                n.axon.synapses, {id: action.payload.id}
                            )
                        }
                    }
                }
                return n
            }),
            neurons: state.neurons.map(n => {
                if (n.id == action.payload.axon.neuronId) {
                    return {
                        ...n,
                        axon: {
                            ...n.axon,
                            synapses: _.concat(n.axon.synapses, {id: action.payload.id})
                        }
                    }
                } else if (n.id == action.payload.dend.neuronId) {
                    return {
                        ...n,
                        dends: n.dends.map(d => {
                            if (d.id == action.payload.dend.id) {
                                return {
                                    ...d,
                                    synapseId: action.payload.id
                                }
                            }
                            return d
                        })
                    }
                }
                return n
            }),
            synapses: [
                ...state.synapses,
                {
                    ...initialSynapseState,
                    ...action.payload
                }
            ]
        }
    } else if (makeGhostSynapseAtAxon.test(action)) {
        return {
            ...state,
            ghostSynapse: {
                axon: {
                    ...action.payload
                }
            }
        }
    } else if (makeGhostSynapseAtDend.test(action)) {
        return {
            ...state,
            ghostSynapse: {
                dend: {
                    ...action.payload
                }
            }
        }
    } else if (addDend.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(
                (n: NeuronState) => {
                    if (n.id == action.payload.neuronId) {
                        return {
                            ...n,
                            dends: [
                                ...n.dends,
                                {
                                    ...initialDendState,
                                    ...action.payload,
                                    arc: { start: action.payload.nu - 1 / 16, stop: action.payload.nu + 1 / 16 },
                                }
                            ]
                        }
                    }
                    return n
                }
            )
        }
    } else if (resetGhostSynapse.test(action)) {
        return {
            ...state,
            ghostSynapse: {
                axon: undefined,
                dend: undefined
            }
        }
    } else if (decayNetwork.test(action)) {
        return {
            ...state,
            neurons: state.neurons.map(n => ({
                ...n,
                potential: n.potential * 63 /64
            }))
        }
    }
    else {
        return state
    }
}