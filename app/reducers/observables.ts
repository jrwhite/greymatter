import { Selector } from 'reselect'
import { IState } from '.'
import { IAction } from '../actions/helpers'
import { addObservable } from '../actions/observables'
import _ = require('lodash')

export enum ObservableType {
  Gym = 'Gym Observation',
  Potential = 'Neuron Potential'
}

export interface ObservableState {
  id: string
  name: string
  type: ObservableType
  getValue: Selector<any, any> | Selector<any, any> // TODO: update with allowed selectors
  // getRange
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
