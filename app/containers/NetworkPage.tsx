import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { Network, IProps } from '../components/Network'
import { IState } from '../reducers'
import NetworkActions from '../actions/network'
import { makeGetSourcedDendValues } from '../selectors/neurons'

const makeMapStateToProps = (): ((state: IState) => Partial<IProps>) => {
  const getSourcedDends = makeGetSourcedDendValues()

  return (state: IState) => ({
    inputs: state.network.inputs,
    neuronIds: state.network.neurons.allIds,
    synapses: state.network.synapses,
    ghostSynapse: state.network.ghostSynapse,
    config: state.network.config,
    sourcedDends: getSourcedDends(state),
    gymStepRatio: state.network.gym.stepRatio
  })
}

function mapDispatchToProps (dispatch: Dispatch<IState>): Partial<IProps> {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Network) as any) as React.StatelessComponent<IProps>
