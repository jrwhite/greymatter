
import { makeGetNeuronState } from '../selectors/neuron';
import { IState } from '../reducers';
import { connect, Dispatch } from 'react-redux';
import * as NetworkActions from '../actions/network'
import { bindActionCreators } from 'redux';
import { IProps, Neuron } from '../components/Neuron';

const makeMapStateToProps = () => {
    const getNeuronState = makeGetNeuronState()
    return (state: IState, props: IProps) => getNeuronState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>) : Partial<IProps> => {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(makeMapStateToProps, mapDispatchToProps)(Neuron) as any as React.StatelessComponent)