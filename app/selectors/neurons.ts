import { createSelector, Selector } from 'reselect'
import { IState } from '../reducers'
import { IProps } from '../components/Neuron'
import {
  NeuronState,
  DendState,
  IzhikParams,
  MaxFirePeriod
} from '../reducers/neurons'
import * as _ from 'lodash'
import { getEncodedValueById } from './encodings'
import { defaultEllipseGeo } from '../components/NeuronBody'
import { Ellipse as EllipseGeo } from '../utils/geometry'

export const getNeuronFromId = (state: IState, id: string) =>
  state.network.neurons.find((n) => n.id === id)

export const getDendFromId = (state: NeuronState, id: string): DendState =>
  state.dends.find((d) => d.id === id)!!

export const getNeuronEllipseGeo = (state: NeuronState): EllipseGeo => {
  return {
    ...defaultEllipseGeo,
    theta: state.theta
  }
}

export const getNeuronRecoveryRange = (state: IState) => ({
  start: -20,
  stop: 0
})

export const makeGetNeuronRecoveryRange = () =>
  createSelector(
    getNeuronRecoveryRange,
    (recoveryRange) => recoveryRange
  )

export const getNeuronPotRange = (state: IState) => ({
  start: -300,
  stop: 100
})

export const makeGetNeuronPotRange = () =>
  createSelector(
    getNeuronPotRange,
    (potRange) => potRange
  )

export const getNeuronPeriodRange = (state: IState) => ({
  start: 0,
  stop: MaxFirePeriod
})

export const makeGetNeuronPeriodRange = () =>
  createSelector(
    getNeuronPeriodRange,
    (periodRange) => periodRange
  )

const getNeuron = (state: IState, props: { id: string }) =>
  state.network.neurons.find((n) => n.id === props.id)

const getIsNeuronSelected = (state: IState, props: { id: string }): boolean =>
  state.network.config.selectedNeurons.find((s) => s.id === props.id)
    ? true
    : false

export const makeGetNeuronState = () =>
  createSelector(
    getNeuron,
    getIsNeuronSelected,
    (neuron, isSelected) => ({ ...neuron, isSelected })
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
