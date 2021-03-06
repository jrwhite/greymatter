import { AddSynapseAction } from './synapses'
import { actionCreator } from './helpers'
import {
  exciteNeuron,
  addSynapseToAxon,
  addSynapseToDend,
  polarizeNeuron
} from './neurons'
import { IState } from '../reducers'
import { addSynapseToInputAxon } from './inputs'
import { AxonType } from '../reducers/neurons'
import { makeEncodingFromCtrlPoints } from '../utils/encoding'
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
  progress: number
  shouldAnimate: boolean
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

export interface SetApProgressAction {
  id: string
  synapseId: string
  progress: number
}

export interface SetApShouldAnimateAction {
  id: string
  synapseId: string
  shouldAnimate: boolean
}

export const setApShouldAnimate = actionCreator<SetApShouldAnimateAction>(
  'SET_AP_SHOULD_ANIMATE'
)

export const setApProgress = actionCreator<SetApProgressAction>(
  'SET_AP_PROGRESS'
)

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

export function finishFiringApOnSynapse (
  id: string,
  synapseId: string,
  axonType: AxonType
) {
  return (dispatch: Function, getState: () => IState) => {
    dispatch(removeApFromSynapse({ id, synapseId }))
    const dend: {
      id: string;
      neuronId: string;
    } = getState().network.synapses.find((s) => s.id === synapseId)!!.dend
    const stdpFunc = makeEncodingFromCtrlPoints(
      getState().network.config.stdpEncodings[axonType].controlPoints
    )
    if (axonType === AxonType.Excitatory) {
      dispatch(exciteNeuron({ id: dend.neuronId, dendId: dend.id, stdpFunc }))
    } else if (axonType === AxonType.Inhibitory) {
      dispatch(
        polarizeNeuron({ id: dend.neuronId, dendId: dend.id, stdpFunc })
      )
    }
  }
}

export function addNewApToSynapse (id: string, progress?: number) {
  return (dispatch: Function) => {
    dispatch(
      addApToSynapse({
        id: _.uniqueId('ap'),
        synapseId: id,
        progress: progress ? progress : 0,
        shouldAnimate: true
      })
    )
  }
}

export function addNewSynapse (payload: AddNewSynapseAction) {
  return (dispatch: Function) => {
    const newId = _.uniqueId('s')

    if (payload.axon.neuronId.includes('in')) {
      dispatch(
        addSynapseToInputAxon({
          inputId: payload.axon.neuronId,
          synapseId: newId,
          axonId: payload.axon.id
        })
      )
    } else {
      dispatch(
        addSynapseToAxon({
          neuronId: payload.axon.neuronId,
          synapseId: newId,
          axonId: payload.axon.id
        })
      )
    }

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
