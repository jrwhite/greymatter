import { createSelector } from 'reselect'
import { IState } from '../reducers'
import { IProps } from '../components/PotentialGraphLine'

const getNeuronPotential = (state: IState, props: IProps) =>
    state.network.neurons.find(n => n.id === props.id)

export const makeGetPotentialGraphLineState = () => createSelector(
    getNeuronPotential,
    neuron => (
        {
            potential: neuron ? neuron.potential : 0
        }
    )
)