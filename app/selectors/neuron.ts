import { createSelector, Selector } from 'reselect'
import { IState } from '../reducers'
import { IProps } from '../components/Neuron'
import { NeuronState } from '../reducers/neurons'

const getNeuronFromId = (state: IState, id: string) =>
  state.network.neurons.find((n) => n.id === id)

const getNeuron = (state: IState, props: IProps) =>
  state.network.neurons.find((n) => n.id === props.id)

export const makeGetNeuronState = () =>
  createSelector(getNeuron, (neuron) => ({ ...neuron }))

// export const getNeuronPotential: Selector<state: IState, number > = (state) => state.

export const makeGetNeuronPotential = () =>
  createSelector(getNeuronFromId, (neuron) => neuron!!.potential)
