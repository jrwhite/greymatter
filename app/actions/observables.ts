import { ObservableType } from '../reducers/observables'
import { Selector } from 'reselect'
import { actionCreator } from './helpers'
import { IState } from '../reducers'
import * as _ from 'lodash'

export interface AddObservableAction {
  id: string
  name: string
  type: ObservableType
  getValue: Selector<any, any>
}

export const addObservable = actionCreator<AddObservableAction>(
  'ADD_OBSERVABLE'
)

export interface AddNewObservableAction {
  name: string
  type: ObservableType
  getValue: Selector<any, any>
}

export function addNewObservable (payload: AddNewObservableAction) {
  return (dispatch: Function) => {
    dispatch(addObservable({ id: _.uniqueId('obs'), ...payload }))
  }
}
