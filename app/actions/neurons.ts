import { IState } from '../reducers'
import {
  IzhikParams,
  NeuronState,
  IzhikState,
  initialIzhikState,
  AxonType
} from '../reducers/neurons'
import { getAxonAbsPos, getSynapse } from '../selectors/synapses'
import {
  addPoints,
  calcClosestDend,
  DendGeo,
  Ellipse,
  Point,
  calcTipPos
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
import { getNeuronEllipseGeo } from '../selectors/neurons'
import { makeEncodingFromCtrlPoints } from '../utils/encoding'
import { StdpEncoding, StdpModEncoding } from '../reducers/config'
import { ControlPointState } from '../reducers/encodings'
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

export const fireVolumeNeuron = actionCreatorVoid('FIRE_VOLUME_NEURON')

export interface ExciteNeuron {
  id: string
  dendId: string
  stdpFunc: (delta: number) => number
}

export interface PolarizeNeuronAction {
  id: string
  dendId: string
  stdpFunc: (delta: number) => number
}
export const polarizeNeuron = actionCreator<PolarizeNeuronAction>(
  'POLARIZE_NEURON'
)

export interface AddDendAction {
  id: string
  neuronId: string
  baseCpos: Point
  synCpos: Point
  nu: number
  incomingAngle: number
}

export interface DendPos {
  baseCPos: Point
  synCPos: Point
  nu: number
  incomingAngle: number
}

export interface SetDendsPosAction {
  neuronId: string
  dends: {
    [id: string]: DendPos;
  }
}
export const setDendsPos = actionCreator<SetDendsPosAction>('SET_DENDS_POS')

export const redrawDends = actionCreatorVoid('REDRAW_DENDS')

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
  // stdpFunc: (delta: number) => number
  weightingModFuncs: {
    [axonType: string]: { [stdpType: string]: (val: number) => number };
  }
  daMods: { [axonType: string]: { [stdpType: string]: number } }
  stdpFuncs: { [axonType: string]: (val: number) => number }
}
export const potentiateDends = actionCreator<PotentiateDendsAction>(
  'POTENTIATE_DENDS'
)

export interface SetAxonTypeAction {
  id: string
  type: AxonType
}
export const setAxonType = actionCreator<SetAxonTypeAction>('SET_AXON_TYPE')

export interface DepressDendsAction {
  id: string
}
export const depressDends = actionCreator<DepressDendsAction>('DEPRESS_DENDS')

export interface FireNeuronAction {
  id: string
  axonType: AxonType
}

export function fireNeuron (payload: FireNeuronAction) {
  return (dispatch: Function, getState: () => IState) => {
    const stdpEncodings = getState().network.config.stdpEncodings
    // const stdpFuncs = stdpEncodings((enc) => makeEncodingFromCtrlPoints(stdpEncoding.controlPoints))
    const stdpFuncs = _.mapValues(stdpEncodings, (enc: StdpEncoding) =>
      makeEncodingFromCtrlPoints(enc.controlPoints)
    )
    const weightingModFuncs = _.mapValues(stdpEncodings, (enc: StdpEncoding) =>
      _.mapValues(
        enc.modEncodings.Weighting.controlPoints,
        (ctrl: ControlPointState[]) => makeEncodingFromCtrlPoints(ctrl)
      )
    )
    const da = getState().network.volume.da
    const daMods = _.mapValues(stdpEncodings, (enc: StdpEncoding) => {
      return _.mapValues(
        enc.modEncodings.Volume.controlPoints,
        (ctrl: ControlPointState[]) => {
          const encFunc = makeEncodingFromCtrlPoints(ctrl)
          return encFunc(da.molarity)
        }
      )
    })
    dispatch(
      potentiateDends({ id: payload.id, stdpFuncs, weightingModFuncs, daMods })
    )
    dispatch(hyperpolarizeNeuron({ id: payload.id }))
    dispatch(calcDends({neuronId: payload.id}))
    // dispatch(depressDends({ id }))
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

export interface CalcDendsAction {
  neuronId: string
}

export function calcDends (payload: CalcDendsAction) {
  // calculate closest dendrite positions for neuron
  return (dispatch: Function, getState: () => IState) => {
    const neurons = getState().network.neurons
    const synapses = getState().network.synapses
    const state = getState()
    neurons.map((n) => {
      if (n.id === payload.neuronId) {
        const closestDends: Array<DendPos | { id: string }> = n.dends.map((d) => {
          const synapse = getSynapse(state, { id: d.synapseId })
          const axonPos = getAxonAbsPos(getState(), synapse)
          const ellipse = getNeuronEllipseGeo(n)
          const dendGeo = calcClosestDend(n.pos, axonPos, ellipse)
          const dendPos: DendPos = {
            baseCPos: dendGeo.point,
            synCPos: calcTipPos(
              dendGeo.point,
              dendGeo.inTheta,
              15 + d.weighting / 5
            ),
            nu: dendGeo.nu,
            incomingAngle: dendGeo.inTheta
          }
          return {
            id: d.id,
            ...dendPos
          }
        })
        const payload: SetDendsPosAction = _.keyBy(closestDends, 'id')
        console.log(payload)
        dispatch(setDendsPos({ neuronId: n.id, ...payload }))
      }
    })
  }
}

export function recalcAllDends () {
  return (dispatch: Function, getState: () => IState) => {
    const neurons = getState().network.neurons
    const synapses = getState().network.synapses
    const state = getState()

    neurons.map((n) => {
      const closestDends: Array<DendPos | { id: string }> = n.dends.map((d) => {
        const synapse = getSynapse(state, { id: d.synapseId })
        const axonPos = getAxonAbsPos(getState(), synapse)
        const ellipse = getNeuronEllipseGeo(n)
        const dendGeo = calcClosestDend(n.pos, axonPos, ellipse)
        const dendPos: DendPos = {
          baseCPos: dendGeo.point,
          synCPos: calcTipPos(
            dendGeo.point,
            dendGeo.inTheta,
            15 + d.weighting / 5
          ),
          nu: dendGeo.nu,
          incomingAngle: dendGeo.inTheta
        }
        return {
          id: d.id,
          ...dendPos
        }
      })
      const payload: SetDendsPosAction = _.keyBy(closestDends, 'id')
      console.log(payload)
      dispatch(setDendsPos({ neuronId: n.id, ...payload }))
    })
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
        synCpos: calcTipPos(newDendGeo.point, newDendGeo.inTheta, 30),
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
