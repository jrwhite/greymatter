import { Selector } from 'reselect'
import { IState } from '.'
import { IAction } from '../actions/helpers'

export interface ObservableState {
  id: string
  name: string
  getValue: Selector<any, any> | Selector<any, any> // TODO: update with allowed selectors
}

export type Observable = ObservableState

export default function observables (
  state: ObservableState[] = [],
  action: IAction
): ObservableState[] {
  return state
}
