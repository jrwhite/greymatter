import { createSelector, Selector } from 'reselect'
import { IState } from '../reducers'
import { IProps } from '../components/Neuron'
import neurons, {
  NeuronState,
  DendState,
  IzhikParams
} from '../reducers/neurons'
import * as _ from 'lodash'
import { getEncodedValueById } from './encoding'

export const getNeuronFromId = (state: IState, id: string) =>
  state.network.neurons.find((n) => n.id === id)

export const getDendFromId = (state: NeuronState, id: string): DendState =>
  state.dends.find((d) => d.id === id)!!

const getNeuron = (state: IState, props: { id: string }) =>
  state.network.neurons.find((n) => n.id === props.id)

export const makeGetNeuronState = () =>
  createSelector(
    getNeuron,
    (neuron) => ({ ...neuron })
  )

const getIzhikParamsFromId = (
  state: IState,
  props: { id: string }
): IzhikParams => getNeuron(state, props)!!.izhik.params

export const makeGetNeuronIzhikParams = () =>
  createSelector(
    getIzhikParamsFromId,
    (params) => params
  )

export interface SourcedDendValue {
  id: string
  neuronId: string
  value: number
}

export interface SourcedDendState {
  id: string
  neuronId: string
  sourceId: string
}

const getSourcedDendsFromNeuron = (state: NeuronState): SourcedDendState[] => {
  const encodedDends = _.filter(state.dends, (d) => d.sourceId !== 'src')
  return _.map(encodedDends, (d) => ({
    id: d.id,
    sourceId: d.sourceId,
    neuronId: state.id
  }))
}

const getSourcedDendValues = (state: IState): SourcedDendValue[] => {
  const sourcedDends: SourcedDendState[][] = _.map(state.network.neurons, (n) =>
    getSourcedDendsFromNeuron(n)
  )
  const flattened: SourcedDendState[] = _.flatten(sourcedDends)
  const sourcedValues = _.map(flattened, (d) => ({
    ...d,
    value: getEncodedValueById(state, d.sourceId)
  }))
  return sourcedValues
}

export const makeGetSourcedDendValues = () =>
  createSelector(
    getSourcedDendValues,
    (values) => values
  )

// export const getNeuronPotential: Selector<state: IState, number > = (state) => state.

export const makeGetNeuronPotential = () =>
  createSelector(
    getNeuronFromId,
    (neuron) => neuron!!.potential
  )
