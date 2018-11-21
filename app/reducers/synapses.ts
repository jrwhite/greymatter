import { IAction } from './../actions/helpers'
import {
  removeSynapses,
  addApToSynapse,
  removeApFromSynapse,
  addSynapse,
  setApProgress
} from '../actions/synapses'
import { ActionPotentialState } from './network'
import _ = require('lodash')
export interface SynapseState {
  id: string
  axon: {
    id: string;
    neuronId: string;
  }
  dend: {
    id: string;
    neuronId: string;
  }
  current?: number
  encodedSourceId?: string
  length: number
  width: number
  speed: number
  isFiring: boolean
  actionPotentials: ActionPotentialState[]
}

const initialSynapseState: SynapseState = {
  id: 's',
  axon: { id: 'a', neuronId: 'n' },
  dend: { id: 'd', neuronId: 'n' },
  length: 100,
  width: 2,
  speed: 0.5,
  isFiring: false,
  actionPotentials: []
}

export default function synapses (
  state: SynapseState[] = [],
  action: IAction
): SynapseState[] {
  if (removeSynapses.test(action)) {
    // inputs: _.map(state.inputs, n => ({
    //   ...n,
    //   axon: {
    //     ...n.axon,
    //     synapses: _.differenceBy(
    //       n.axon.synapses,
    //       action.payload.synapses,
    //       "id"
    //     )
    //   }
    // })),
    return _.differenceBy(state, action.payload.synapses, 'id')
  } else if (addApToSynapse.test(action)) {
    return state.map((s) => {
      if (s.id === action.payload.synapseId) {
        return {
          ...s,
          actionPotentials: [
            ...s.actionPotentials,
            {
              id: action.payload.id,
              progress: action.payload.progress
            }
          ]
        }
      }
      return s
    })
  } else if (removeApFromSynapse.test(action)) {
    return state.map((s) => {
      if (s.id === action.payload.synapseId) {
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
  } else if (setApProgress.test(action)) {
    return state.map((s) => {
      if (s.id === action.payload.synapseId) {
        return {
          ...s,
          actionPotentials: s.actionPotentials.map(
            (ap: ActionPotentialState) => {
              if (ap.id === action.payload.id) {
                return {
                  ...ap,
                  progress: action.payload.progress
                }
              } else {
                return ap
              }
            }
          )
        }
      } else {
        return s
      }
    })
  } else if (addSynapse.test(action)) {
    // split into two reducers (synapse,neuron) with this logic in action
    // to neuron reducer: add addSynapseToDend and addSynapseToAxon
    return [
      ...state,
      {
        ...initialSynapseState,
        ...action.payload
      }
    ]
  } else {
    return state
  }
}
