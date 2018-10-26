import { AddSynapseAction } from './synapses'
import { actionCreator } from './helpers'
import { exciteNeuron, addSynapseToAxon, addSynapseToDend } from './neurons'
import { IState } from '../reducers'
const _ = require('lodash')

export interface AddSynapseAction {
  id: string
  axon: {
    id: string;
    neuronId: string;
  }
  dend: {
    id: string;
    neuronId: string;
  }
}

export interface RemoveSynapsesAction {
  synapses: Array<{ id: string }>
}

export interface AddApToSynapse {
  id: string
  synapseId: string
}

export interface RemoveApFromSynapse {
  id: string
  synapseId: string
}

export interface AddNewSynapseAction {
  axon: {
    id: string;
    neuronId: string;
  }
  dend: {
    id: string;
    neuronId: string;
  }
}

export const addApToSynapse = actionCreator<AddApToSynapse>(
  'ADD_AP_TO_SYNAPSE'
)
export const removeApFromSynapse = actionCreator<RemoveApFromSynapse>(
  'REMOVE_AP_FROM_SYNAPSE'
)
export const addSynapse = actionCreator<AddSynapseAction>('ADD_SYNAPSE')
export const removeSynapses = actionCreator<RemoveSynapsesAction>(
  'REMOVE_SYNAPSE'
)

export function finishFiringApOnSynapse (id: string, synapseId: string) {
  return (dispatch: Function, getState: () => IState) => {
    dispatch(removeApFromSynapse({ id, synapseId }))
    const dend: {
      id: string;
      neuronId: string;
    } = getState().network.synapses.find((s) => s.id === synapseId)!!.dend
    dispatch(exciteNeuron({ id: dend.neuronId, dendId: dend.id }))
  }
}

export function addNewApToSynapse (id: string) {
  return (dispatch: Function) => {
    dispatch(addApToSynapse({ id: _.uniqueId('ap'), synapseId: id }))
  }
}

export function addNewSynapse (payload: AddNewSynapseAction) {
  return (dispatch: Function) => {
    const newId = _.uniqueId('s')

    dispatch(
      addSynapseToAxon({
        neuronId: payload.axon.neuronId,
        synapseId: newId,
        axonId: payload.axon.id
      })
    )

    dispatch(
      addSynapseToDend({
        neuronId: payload.dend.neuronId,
        synapseId: newId,
        dendId: payload.dend.id
      })
    )

    dispatch(addSynapse({ id: newId, ...payload }))
  }
}
