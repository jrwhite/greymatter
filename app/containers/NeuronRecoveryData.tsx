import * as React from 'react'
import * as Actions from '../actions/neurons'
import { IState } from '../reducers'
import { Dispatch, connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RouteComponentProps } from 'react-router'
import { createSelector } from 'reselect'
import { DataSource, IProps as DataProps } from './DataSource'

// temporarily just putting the selector here
const getNeuronData = (state: IState, props: IProps) => {
  return state.network.neurons.find((n) => n.id === props.id)
}

const makeGetNeuronRecoveryState = () =>
  createSelector(
    getNeuronData,
    (neuron) => ({
      data: neuron ? neuron.izhik.u : undefined
    })
  )

export interface IProps extends DataProps {
  id: string
}

export class NeuronRecoveryData extends DataSource {
  props: IProps
}

const makeMapStateToProps = () => {
  const getRecoveryState = makeGetNeuronRecoveryState()
  return (state: IState, props: IProps) => getRecoveryState(state, props)
}

export default (connect(makeMapStateToProps)(
  NeuronRecoveryData
) as any) as React.StatelessComponent<Partial<IProps>>
