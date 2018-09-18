import * as _ from 'lodash'
import { Point, Line, Ellipse, DendGeo, calcClosestDend, addPoints } from "../utils/geometry";
import { actionCreator, actionCreatorVoid } from "./helpers";
import { AxonStateType, DendStateType, NeuronState, IzhikParams } from '../reducers/network';
import { IState } from '../reducers';
import { getAxonAbsPos } from '../selectors/synapse';

export type MoveNeuronAction = {
    id: string,
    pos: Point
}

export type RemoveNeuronsAction = {
    neurons: Array<{id: string}>
}

export type AddNeuronAction = {
    id: string,
    axonId: string,
    pos: Point
}

export type SelectNeuronAction = {
    id: string
}

export type SelectInputAction = {
    id: string
}

export type AddNewSynapseAction = {
    axon: {
        id: string,
        neuronId: string
    },
    dend: {
        id: string,
        neuronId: string
    }
}

export type AddSynapseAction = {
    id: string,
} & AddNewSynapseAction

export type RemoveSynapsesAction = {
    synapses: Array<{id: string}>
}

export type MakeGhostSynapseAtAxonAction = {
    id: string,
    neuronId: string,
}

export type MakeGhostSynapseAtDendAction = {
    id: string,
    neuronId: string
}

export type AddDendAction = {
    id: string,
    neuronId: string,
    baseCpos: Point,
    synCpos: Point,
    nu: number,
    incomingAngle: number
}

export type ExciteNeuron = {
    id: string,
    dendId: string
}

export type HyperpolarizeNeuron = {
    id: string
}

export type AddInput = {
    id: string,
    axonId: string,
    pos: Point
}

export type RemoveInput = {
    id: string
}

export type MoveInput = {
    id: string,
    pos: Point
}

export type ChangeInputRate = {
    id: string,
    rate: number
}

export type AddApToSynapse = {
    id: string,
    synapseId: string
}

export type RemoveApFromSynapse = {
    id: string,
    synapseId: string
}

export type ChangeIzhikParamsAction = {
    id: string,
    params: Partial<IzhikParams>
}

export const removeNeurons = actionCreator<RemoveNeuronsAction>('REMOVE_NEURONS')
export const moveNeuron = actionCreator<MoveNeuronAction>('MOVE_NEURON')
export const addNeuron = actionCreator<AddNeuronAction>('ADD_NEURON')
export const selectNeuron = actionCreator<SelectNeuronAction>('SELECT_NEURON')
export const selectInput = actionCreator<SelectInputAction>('SELECT_INPUT')
export const addSynapse = actionCreator<AddSynapseAction>('ADD_SYNAPSE')
export const removeSynapses = actionCreator<RemoveSynapsesAction>('REMOVE_SYNAPSE')
export const addApToSynapse = actionCreator<AddApToSynapse>('ADD_AP_TO_SYNAPSE')
export const removeApFromSynapse = actionCreator<RemoveApFromSynapse>('REMOVE_AP_FROM_SYNAPSE')
export const makeGhostSynapseAtAxon = actionCreator<MakeGhostSynapseAtAxonAction>('MAKE_GHOST_SYNAPSE_AT_AXON')
export const makeGhostSynapseAtDend = actionCreator<MakeGhostSynapseAtDendAction>('MAKE_GHOST_SYNAPSE_AT_DEND')
export const resetGhostSynapse = actionCreatorVoid('RESET_GHOST_SYNAPSE')
export const addDend = actionCreator<AddDendAction>('ADD_DEND')
export const decayNetwork = actionCreatorVoid('DECAY_NETWORK')
export const hyperpolarizeNeuron = actionCreator<HyperpolarizeNeuron>('HYPERPOLARIZE_NEURON')
export const exciteNeuron = actionCreator<ExciteNeuron>('EXCITE_NEURON')
export const addInput = actionCreator<AddInput>('ADD_INPUT')
export const removeInput = actionCreator<RemoveInput>('REMOVE_INPUT')
export const moveInput = actionCreator<MoveInput>('MOVE_INPUT')
export const changeInputRate = actionCreator<ChangeInputRate>('CHANGE_INPUT_RATE')
export const changeIzhikParams = actionCreator<ChangeIzhikParamsAction>('CHANGE_IZHIK_PARAMS')
export const stepNetwork = actionCreatorVoid('STEP_NETWORK')
export const pauseNetwork = actionCreatorVoid('PAUSE_NETWORK')
export const resumeNetwork = actionCreatorVoid('RESUME_NETWORK')
export const speedUpNetwork = actionCreatorVoid('SPEED_UP_NETWORK')
export const slowDownNetwork = actionCreatorVoid('SLOW_DOWN_NETWORK')
export const resetNetwork = actionCreatorVoid('RESET_NETWORK')

export function addNewInput(pos: Point) {
    return (dispatch: Function) => {
        const newId = _.uniqueId('in')
        const newAxonId = _.uniqueId('a')
        dispatch(addInput({id: newId, pos: pos, axonId: newAxonId}))
    }
}

export function fireNeuron(id: string) {
    return (dispatch: Function, getState: () => IState) => {
        dispatch(hyperpolarizeNeuron({id: id}))
    }
}

export function finishFiringApOnSynapse(id: string, synapseId: string) {
    return (dispatch: Function, getState: () => IState) => {
        dispatch(removeApFromSynapse({id: id, synapseId: synapseId}))
        const dend: {id: string, neuronId: string} = getState().network.synapses.find(s => s.id == synapseId)!!.dend
        dispatch(exciteNeuron({id: dend.neuronId, dendId: dend.id}))
    }
}

export function addNewNeuron(pos: Point) {
    return (dispatch: Function) => {
        dispatch(addNeuron({id: _.uniqueId('n'), pos: pos, axonId: _.uniqueId('a')}))
    }
}

export function removeNeuron(id: string) {
    return (dispatch: Function) => {
        dispatch(removeNeurons({neurons: [{id: id}]}))
    }
}

export function removeNeuronWithSynapses(id: string) {
    return (dispatch: Function, getState: () => IState) => {
        const neuronToRemove: NeuronState = getState().network.neurons.find(n => n.id == id)!!
        const synapsesToRemove: Array<{id: string}> = _.concat(
            neuronToRemove.axon.synapses,
            neuronToRemove.dends.map(d => ({id: d.synapseId}))
        )
        dispatch(removeNeuron(id))
        dispatch(removeSynapses({synapses: synapsesToRemove}))
    }
}

export function removeInputWithSynapses(id: string, synapses: Array<{id: string}>) {
    return (dispatch: Function, getState: () => IState) => {
        dispatch(removeSynapses({synapses: synapses}))
        dispatch(removeInput({id: id}))
    }
}

export function addNewSynapse(payload: AddNewSynapseAction) {
    return (dispatch: Function) => {
        dispatch(addSynapse({id: _.uniqueId('s'), ...payload}))
    }
}

export function addNewApToSynapse(id: string) {
    return (dispatch: Function) => {
        dispatch(addApToSynapse({id: _.uniqueId('ap'), synapseId: id}))
    }
}

export function addNewDend(newDendId: string, neuronId: string, neuronPos: Point, axonPos: Point, bodyEllipse: Ellipse) {
    return (dispatch: Function) => {
        const newDendGeo: DendGeo = calcClosestDend(neuronPos, axonPos, bodyEllipse)

        dispatch(addDend(
            {
                id: newDendId,
                neuronId: neuronId,
                baseCpos: newDendGeo.point,
                // synCpos: newDendGeo.point,
                synCpos: addPoints(
                    newDendGeo.point,
                    {
                        x: Math.cos(newDendGeo.inTheta * Math.PI) * 15, // TODO: replace 15 with default short plast
                        y: Math.sin(newDendGeo.inTheta * Math.PI) * 15
                    }
                ),
                nu: newDendGeo.nu,
                incomingAngle: newDendGeo.inTheta
            }
        ))
    }
}

export function tryMakeSynapseAtDend(id: string, neuronId: string) {
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.axon && !ghost.dend) {
            dispatch(addNewSynapse({
                axon: {id: ghost.axon.id, neuronId: ghost.axon.neuronId},
                dend: {id: id, neuronId: neuronId}
            }))
            dispatch(resetGhostSynapse())
        } else {
            dispatch(makeGhostSynapseAtDend({id: id, neuronId: neuronId}))
        }
    }
}

export function tryMakeSynapseAtNewDend(neuronId: string, neuronPos: Point) {
    // using ghost synapse axon
    // this likely replaces tryMakeSynapseAtDend
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.axon && !ghost.dend) {

            const newId = _.uniqueId('d')
            dispatch(
                addNewDend(
                    newId,
                    neuronId,
                    neuronPos,
                    getAxonAbsPos(getState(), ghost),
                    { major: 50, minor: 30, theta: 0, ecc: 50 / 20 }
                )
            )
            dispatch(tryMakeSynapseAtDend(newId, neuronId))
        }
    }
}

export function tryMakeSynapseAtAxon(id: string, neuronId: string) {
    return (dispatch: Function, getState: () => IState) => {
        const ghost = getState().network.ghostSynapse

        if (ghost.dend && !ghost.axon) {
            dispatch(addNewSynapse({
                axon: { id: id, neuronId: neuronId },
                dend: { id: ghost.dend.id, neuronId: ghost.dend.neuronId }
            }))
            dispatch(resetGhostSynapse())
        } else {
            dispatch(makeGhostSynapseAtAxon({id: id, neuronId: neuronId}))
        }
    }
}
