import { DendState } from '../types/dends'
import {
  addDend,
  addSynapseToDend,
  setDendSource,
  setDendPlast
} from '../actions/dends'
import { IAction } from '../actions/helpers'

export default function dends (
  state: { [id: string]: DendState },
  action: IAction
): { [id: string]: DendState } {
  if (addDend.test(action)) {
    const dend = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...dend,
        ...action.payload
      }
    }
  } else if (addSynapseToDend.test(action)) {
    const dend = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...dend,
        synapseId: action.payload.synapseId
      }
    }
  } else if (setDendSource.test(action)) {
    const dend = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...dend,
        sourceId: action.payload.sourceId
      }
    }
  } else if (setDendPlast.test(action)) {
    const dend = state[action.payload.id]
    return {
      ...state,
      [action.payload.id]: {
        ...dend,
        plast: action.payload.plast
      }
    }
  } else {
    return state
  }
}
