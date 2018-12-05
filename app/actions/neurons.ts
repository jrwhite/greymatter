import { IState } from '../reducers'
import {
  IzhikParams,
  NeuronState,
  IzhikState,
  initialIzhikState
} from '../reducers/neurons'
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
  izhik: IzhikState
}

export interface ChangeDendWeightingAction {
  neuronId: string
  dendId: string
  weighting: number
}

export interface ChangeIzhikParamsAction {
  neuronId: string
  params: Partial<IzhikParams>
}

export interface ChangeNeuronCurrentAction {
  neuronId: string
  current: number
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

export interface RemoveSynapsesAction {
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
  neuronId: string
  dendId: string
  sourceId: string
}

export interface SetUseDefaultConfigAction {
  neuronId: string
  useDefaultConfig: boolean
}

export const setUseDefaultConfig = actionCreator<SetUseDefaultConfigAction>(
  'SET_USE_DEFAULT_CONFIG'
)

export interface PotentiateNeuronAction {
  id: string
  change: number
}

export const potentiateNeuron = actionCreator<PotentiateNeuronAction>(
  'POTENTIATE_NEURON'
)

export const setDendSource = actionCreator<SetDendSourceAction>(
  'SET_DEND_SOURCE'
)
export const addSynapseToAxon = actionCreator<AddSynapseToAxonAction>(
  'ADD_SYNAPSE_TO_AXON'
)
export const addSynapseToDend = actionCreator<AddSynapseToDendAction>(
  'ADD_SYNAPSE_TO_DEND'
)

export const removeSynapsesFromNeurons = actionCreator<RemoveSynapsesAction>(
  'REMOVE_SYNAPSES'
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
export const changeNeuronCurrent = actionCreator<ChangeNeuronCurrentAction>(
  'CHANGE_NERUON_CURRENT'
)
export const decayNeurons = actionCreatorVoid('DECAY_NEURONS')

export interface PotentiateDendsAction {
  id: string
}
export const potentiateDends = actionCreator<PotentiateDendsAction>(
  'POTENTIATE_DENDS'
)

export function fireNeuron (id: string) {
  return (dispatch: Function, getState: () => IState) => {
    dispatch(potentiateDends({ id }))
    dispatch(hyperpolarizeNeuron({ id }))
  }
}

export function addNewNeuron (pos: Point) {
  return (dispatch: Function, getState: () => IState) => {
    const initialIzhikParams = getState().network.config.defaultIzhikParams
    dispatch(
      addNeuron({
        id: _.uniqueId('n'),
        pos,
        axonId: _.uniqueId('a'),
        izhik: { ...initialIzhikState, params: initialIzhikParams }
      })
    )
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

export function tryMakeSynapseAtNewDend (
  neuronId: string,
  neuronPos: Point,
  bodyEllipse: Ellipse
) {
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
          bodyEllipse
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

export function stepEncodedDends () {
  return (dispatch: Function, getState: () => IState) => {
    // TODO: check if this get properly memoized by reselect
  }
}
