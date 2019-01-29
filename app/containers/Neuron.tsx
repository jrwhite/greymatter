import { makeGetNeuronState } from '../selectors/neurons'
import { IState } from '../reducers'
import { connect, Dispatch } from 'react-redux'
import * as Actions from '../actions/neurons'
import { bindActionCreators } from 'redux'
import { IProps, Neuron } from '../components/Neuron'
import NetworkActions, { mapAllDispatchToProps } from '../actions/network'

export interface IIProps {
  id: string
}

const makeMapStateToProps = () => {
  const getNeuronState = makeGetNeuronState()
  return (state: IState, props: IIProps): Partial<IProps> =>
    getNeuronState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  makeMapStateToProps(),
  (dispatch) => mapAllDispatchToProps<Partial<IProps>>(dispatch)
)(Neuron) as any) as React.StatelessComponent<IIProps>
