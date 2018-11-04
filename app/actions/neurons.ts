import { IState } from '../reducers'
import { IzhikParams, NeuronState } from '../reducers/neurons'
import { getAxonAbsPos } from '../selectors/synapse'
import {
  addPoints,
  calcClosestDend,
  DendGeo,
  Ellipse,
  Point
} from '../utils/geometry'
import { SelectNeuronAction } from './config'
import {
  makeGhostSynapseAtAxon,
  makeGhostSynapseAtDend,
  resetGhostSynapse
} from './ghostSynapse'
import { actionCreator, actionCreatorVoid } from './helpers'
import { addNewSynapse, removeSynapses } from './synapses'
import { addSynapseToInputAxon } from './inputs'
const _ = require('lodash')

export interface MoveNeuronAction {
  id: string
  pos: Point
}

export interface RotateNeuronAction {
  id: string
  theta: number
}

export interface RemoveNeuronsAction {
  neurons: Array<{ id: string }>
}

export interface AddNeuronAction {
  id: string
  axonId: string
  pos: Point
}

export interface ChangeDendWeightingAction {
  neuronId: string
  dendId: string
  weighting: number
}

export interface ChangeIzhikParamsAction {
  id: string
  params: Partial<IzhikParams>
}

export interface HyperpolarizeNeuron {
  id: string
}

export interface ExciteNeuron {
  id: string
  dendId: string
}

export interface AddDendAction {
  id: string
  neuronId: string
  baseCpos: Point
  synCpos: Point
  nu: number
  incomingAngle: number
}

export interface RemoveSynapsesFromNeuronsAction {
  synapses: Array<{ id: string }>
}

export interface AddSynapseToDendAction {
  neuronId: string
  dendId: string
  synapseId: string
}

export interface AddSynapseToAxonAction {
  neuronId: string
  axonId: string
  synapseId: string
}

export interface SetDendSourceAction {
  dendId: string
  sourceId: string
}

export const setDendSource = actionCreator<SetDendSourceAction>(
  'SET_DEND_SOURCE'
)
export const addSynapseToAxon = actionCreator<AddSynapseToAxonAction>(
  'ADD_SYNAPSE_TO_AXON'
)
export const addSynapseToDend = actionCreator<AddSynapseToDendAction>(
  'ADD_SYNAPSE_TO_DEND'
)
export const removeSynapsesFromNeurons = actionCreator<RemoveSynapsesFromNeuronsAction>(
  'REMOVE_SYNAPSE_FROM_NEURON'
  )
export const hyperpolarizeNeuron = actionCreator<HyperpolarizeNeuron>(
  'HYPERPOLARIZE_NEURON'
)
export const changeDendWeighting = actionCreator<ChangeDendWeightingAction>(
  'CHANGE_DEND_WEIGHTING'
)
export const rotateNeuron = actionCreator<RotateNeuronAction>('ROTATE_NEURON')
export const removeNeurons = actionCreator<RemoveNeuronsAction>(
  'REMOVE_NEURONS'
)
export const moveNeuron = actionCreator<MoveNeuronAction>('MOVE_NEURON')
export const addNeuron = actionCreator<AddNeuronAction>('ADD_NEURON')
export const selectNeuron = actionCreator<SelectNeuronAction>('SELECT_NEURON')
export const exciteNeuron = actionCreator<ExciteNeuron>('EXCITE_NEURON')
export const addDend = actionCreator<AddDendAction>('ADD_DEND')
export const changeIzhikParams = actionCreator<ChangeIzhikParamsAction>(
  'CHANGE_IZHIK_PARAMS'
)
// TODO: change stepNetwork to stepNeurons to make room for more step logic
export const stepNetwork = actionCreatorVoid('STEP_NETWORK')

export function fireNeuron (id: string) {
  return (dispatch: Function, getState: () => IState) => {
    dispatch(hyperpolarizeNeuron({ id }))
  }
}

export function addNewNeuron (pos: Point) {
  return (dispatch: Function) => {
    dispatch(addNeuron({ id: _.uniqueId('n'), pos, axonId: _.uniqueId('a') }))
  }
}

export function removeNeuron (id: string) {
  return (dispatch: Function, getState: () => IState) => {
    const neuronToRemove: NeuronState = getState().network.neurons.find(
      (n) => n.id === id
    )!!
    const synapsesToRemove: Array<{ id: string }> = _.concat(
      neuronToRemove.axon.synapses,
      neuronToRemove.dends.map((d) => ({ id: d.synapseId }))
    )
    // TODO: refactor to accept arrays of neurons to remove
    dispatch(removeNeurons({ neurons: [{ id }] }))
    dispatch(removeSynapses({ synapses: synapsesToRemove }))
  }
}

export function addNewDend (
  newDendId: string,
  neuronId: string,
  neuronPos: Point,
  axonPos: Point,
  bodyEllipse: Ellipse
) {
  return (dispatch: Function) => {
    const newDendGeo: DendGeo = calcClosestDend(
      neuronPos,
      axonPos,
      bodyEllipse
    )

    dispatch(
      addDend({
        id: newDendId,
        neuronId,
        baseCpos: newDendGeo.point,
        // synCpos: newDendGeo.point,
        synCpos: addPoints(newDendGeo.point, {
          x: Math.cos(newDendGeo.inTheta * Math.PI) * 15, // TODO: replace 15 with default short plast
          y: Math.sin(newDendGeo.inTheta * Math.PI) * 15
        }),
        nu: newDendGeo.nu,
        incomingAngle: newDendGeo.inTheta
      })
    )
  }
}

export function tryMakeSynapseAtDend (id: string, neuronId: string) {
  return (dispatch: Function, getState: () => IState) => {
    const ghost = getState().network.ghostSynapse

    if (ghost.axon && !ghost.dend) {
      dispatch(
        addNewSynapse({
          axon: { id: ghost.axon.id, neuronId: ghost.axon.neuronId },
          dend: { id, neuronId }
        })
      )
      dispatch(resetGhostSynapse())
    } else {
      dispatch(makeGhostSynapseAtDend({ id, neuronId }))
    }
  }
}

export function tryMakeSynapseAtNewDend (neuronId: string, neuronPos: Point) {
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

export function tryMakeSynapseAtAxon (id: string, neuronId: string) {
  return (dispatch: Function, getState: () => IState) => {
    const ghost = getState().network.ghostSynapse

    if (ghost.dend && !ghost.axon) {
      dispatch(
        addNewSynapse({
          axon: { id, neuronId },
          dend: { id: ghost.dend.id, neuronId: ghost.dend.neuronId }
        })
      )
      dispatch(resetGhostSynapse())
    } else {
      dispatch(makeGhostSynapseAtAxon({ id, neuronId }))
    }
  }
}
