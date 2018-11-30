import { actionCreator, actionCreatorVoid } from './helpers'
export interface MakeGhostAtAxonAction {
  id: string
  neuronId: string
}

export interface MakeGhostAtDendAction {
  id: string
  neuronId: string
}
export const makeGhostSynapseAtAxon = actionCreator<MakeGhostAtAxonAction>(
  'MAKE_GHOST_SYNAPSE_AT_AXON'
)
export const makeGhostSynapseAtDend = actionCreator<MakeGhostAtDendAction>(
  'MAKE_GHOST_SYNAPSE_AT_DEND'
)

export const resetGhostSynapse = actionCreatorVoid('RESET_GHOST_SYNAPSE')
