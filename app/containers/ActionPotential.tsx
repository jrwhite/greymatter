import * as React from 'react'
import {
  makeGetSynapse,
  makeGetAp,
  getSynapse,
  getAp,
  getAxonAbsPos,
  makeGetSynapseState,
  getDendPos,
  getDendNeuronPos
} from '../selectors/synapse'
import { IState } from '../reducers'
import { connect, Dispatch } from 'react-redux'
import { ActionPotential, IProps } from '../components/ActionPotential'
import NetworkActions from '../actions/network'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import { addPoints, Point } from '../utils/geometry'

export interface IIProps {
  id: string
  synapseId: string
  start: Point
  stop: Point
  speed: number
  length: number
}

// const makeGetApState = () =>
//   createSelector(
//     getAp,
//     getSynapse,
//     getAxonAbsPos,
//     getDendNeuronPos,
//     getDendPos,
//     (ap, synapse, axonPos, dendNeuronPos, dendPos) => ({
//       ...ap,
//       start: axonPos,
//       stop: addPoints(dendNeuronPos, dendPos)
//     })
//   )

const makeMapStateToProps = () => {
  // const getApState = makeGetApState()
  const getApState = makeGetAp()
  const getSynapseState = makeGetSynapse()
  return (state: IState, props: IIProps): Partial<IProps> => ({
    ...props,
    ...getApState(state, props)
    // ...getSynapseState(state, { id: props.synapseId })
  })
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(ActionPotential) as any
