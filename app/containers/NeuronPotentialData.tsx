import * as React from 'react'
import * as NetworkActions from '../actions/network'
import { IState } from '../reducers';
import { Dispatch, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RouteComponentProps } from 'react-router';
import { createSelector } from 'reselect';

// temporarily just putting the selector here
const getNeuron = (state: IState, props: IProps) => {
    return state.network.neurons.find(n => n.id === props.id)
}

const makeGetNeuronPotentialState = () => createSelector(
    getNeuron,
    neuron => (
        {
            potential: neuron ? neuron.potential : undefined
        }
    )
)
export interface IProps {
    onChange: (potential: number) => void,
    id: string,
    potential: number
}

export class NeuronPotentialData extends React.Component<IProps> {
    props: IProps

    componentDidUpdate () {
        const {
            potential,
            onChange
        } = this.props
        onChange(potential)
    }

    render () {
        return null
    }
}

const makeMapStateToProps = () => {
    const getPotentialState = makeGetNeuronPotentialState()
    return (state: IState, props: IProps) => getPotentialState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>) : Partial<IProps> => {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(makeMapStateToProps, mapDispatchToProps)(NeuronPotentialData) as any as React.StatelessComponent<Partial<IProps>>)
