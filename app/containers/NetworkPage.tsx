import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { Network, IProps } from '../components/Network'
import { IState } from '../reducers'
import NetworkActions from '../actions/network'
import { makeGetSourcedDendValues } from '../selectors/neuron'

function mapStateToProps (state: IState): Partial<IProps> {
  return {
    inputs: state.network.inputs,
    neurons: state.network.neurons,
    synapses: state.network.synapses,
    ghostSynapse: state.network.ghostSynapse,
    config: state.network.config
  }
}

function makeMapStateToProps (): (state: IState) => Partial<IProps> {
  const getSourcedDends = makeGetSourcedDendValues()

  return (state: IState) => ({
    inputs: state.network.inputs,
    neurons: state.network.neurons,
    synapses: state.network.synapses,
    ghostSynapse: state.network.ghostSynapse,
    config: state.network.config,
    sourcedDends: getSourcedDends(state)
  })
}

function mapDispatchToProps (dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  makeMapStateToProps(),
  mapDispatchToProps
)(Network) as any) as React.StatelessComponent<IProps>
