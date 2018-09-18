import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux';
import { Network, IProps } from '../components/Network'
import * as NetworkActions from '../actions/network'
import { IState } from '../reducers';

function mapStateToProps(state: IState): Partial<IProps> {
    return {
        inputs: state.network.inputs,
        neurons: state.network.neurons,
        synapses: state.network.synapses,
        ghostSynapse: state.network.ghostSynapse,
        config: state.network.config,
    }
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<IProps> {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(Network) as any as React.StatelessComponent<IProps>);