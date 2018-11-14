import * as React from 'react'
import { IProps, IzhikParamsControls } from '../components/IzhikParamsControls'
import { makeGetNeuronIzhikParams } from '../selectors/neuron'
import { IState } from '../reducers'
import { bindActionCreators } from 'redux'
import NetworkActions from '../actions/network'
import { connect, Dispatch } from 'react-redux'
import { changeIzhikParams } from '../actions/neurons'

const makeMapStateToProps = () => {
  const getIzhikParams = makeGetNeuronIzhikParams()
  return (state: IState, props: IProps) => ({
    ...props,
    izhikParams: getIzhikParams(state, { id: props.neuronId })
  })
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
  // return bindActionCreators(changeIzhikParams, dispatch)
}

export default (connect(
  makeMapStateToProps(),
  mapDispatchToProps
)(IzhikParamsControls) as any) as React.StatelessComponent<Partial<IProps>>
