import { Selector } from 'reselect'
import { IState } from '.'
import { IAction } from '../actions/helpers'
import { addObservable } from '../actions/observables'
import _ = require('lodash')

export enum ObservableEnum {
  Gym = 'Gym Observation',
  Potential = 'Neuron Potential',
  Reward = 'Gym Reward'
}

export interface ObservableState {
  id: string
  name: string
  type: ObservableEnum
  getValue: Selector<any, any> | Selector<any, any> // TODO: update with allowed selectors
  getRange: Selector<any, any> // TODO: Update with allowed selectors
}

export type Observable = ObservableState

export default function observables (
  state: ObservableState[] = [],
  action: IAction
): ObservableState[] {
  if (addObservable.test(action)) {
    return _.concat(state, { ...action.payload })
  }
  return state
}
