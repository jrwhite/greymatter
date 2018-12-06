import { IState } from '../reducers'
import { IProps } from '../components/Synapse'
import { createSelector } from 'reselect'
import {
  addPoints,
  calcAxonPos,
  Point,
  subtractPoints
} from '../utils/geometry'
import * as _ from 'lodash'
import { getNeuronFromId } from './neuron'
import { ActionPotentialState } from '../reducers/network'
import { SynapseState } from '../reducers/synapses'
import { AxonType } from '../reducers/neurons'

export const getSynapse = (
  state: IState,
  props: { id: string }
): SynapseState => state.network.synapses.find((s) => s.id === props.id)!!

export const getAxonAbsPos = (state: IState, props: Partial<IProps>): Point => {
  if (props.axon && _.includes(props.axon!!.neuronId, 'in')) {
    return state.network.inputs.find((n) => n.id === props.axon!!.neuronId)!!.pos
  } else {
    const neuronState = state.network.neurons.find(
      (n) => n.id === props.axon!!.neuronId
    )!!
    const axonCPos = calcAxonPos({
      major: 50,
      minor: 30,
      theta: neuronState.theta,
      ecc: 5 / 3
    })
    return addPoints(neuronState.pos, axonCPos)
  }
}

export const getAxonType = (
  state: IState,
  props: Partial<IProps>
): AxonType => {
  if (props.axon && _.includes(props.axon!!.neuronId, 'in')) {
    return AxonType.Excitatory
  } else {
    const neuronState = state.network.neurons.find(
      (n) => n.id === props.axon!!.neuronId
    )!!
    return neuronState.axon.type
  }
}

export const getDendNeuronPos = (state: IState, props: IProps) =>
  state.network.neurons.find((n) => n.id === props.dend.neuronId)!!.pos

// DEPRECATED
export const getAxonPos = (state: IState, props: Partial<IProps>) =>
  _.concat(
    _.map(state.network.neurons, (n) => n.axon),
    _.map(state.network.inputs, (n) => n.axon)
  ).find((a) => a.id === props.axon!!.id)!!.cpos

// export const getAxonAbsPos = (state: IState, props: Partial<IProps>) =>
//   addPoints(getAxonPos(state, props), getAxonNeuronPos(state, props))

export const getDendPos = (state: IState, props: IProps) =>
  state.network.neurons
    .find((n) => n.id === props.dend.neuronId)!!
    .dends.find((d) => d.id === props.dend.id)!!.synCpos

export const makeGetSynapse = () =>
  createSelector(
    getSynapse,
    (synapse) => ({
      ...synapse
    })
  )

export const getAp = (
  state: IState,
  props: { id: string; synapseId: string }
): ActionPotentialState => {
  return getSynapse(state, { id: props.synapseId })!!.actionPotentials.find(
    (ap) => ap.id === props.id
  )!!
}

export const makeGetAp = () =>
  createSelector(
    getAp,
    (ap) => ap
  )

export const makeGetSynapseState = () =>
  createSelector(
    getSynapse,
    getAxonAbsPos,
    getDendNeuronPos,
    getAxonPos,
    getDendPos,
    getAxonType,
    (synapse, axonAbsPos, dendNeuronPos, axonPos, dendPos, axonType) => ({
      ...synapse,
      // id: synapse!!.id,
      // axon: synapse!!.axon,
      // dend: synapse!!.dend,
      // length: synapse!!.length,
      // width: synapse!!.width,
      // speed: synapse!!.speed,
      axonPos: axonAbsPos,
      dendPos: addPoints(dendNeuronPos, dendPos),
      length: subtractPoints(dendPos, axonPos),
      axonType
    })
  )

// export const makeGetSynapseState = () => createSelector(
//     getSynapse,
//     synapse => (
//         {...synapse}
//     )
// )
