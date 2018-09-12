import { createSelector } from 'reselect'
import { IState } from '../reducers';
import { IProps } from '../components/Neuron';

const getNeuron = (state: IState, props: IProps) =>
    state.network.neurons.find(n => n.id === props.id)

export const makeGetNeuronState = () => createSelector(
    getNeuron,
    neuron => (
        {...neuron}
    )
)

export const makeGetNeuronPotentialState = () => createSelector(
    getNeuron,
    neuron => (
        {
            potential: neuron ? neuron.potential : undefined
        }
    )
)