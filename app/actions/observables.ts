import { ObservableEnum } from '../reducers/observables'
import { Selector } from 'reselect'
import { actionCreator, actionCreatorVoid } from './helpers'
import { IState } from '../reducers'
import * as _ from 'lodash'
import { getObservationRange, getObservationByIndex } from '../selectors/gym'

export interface AddObservableAction {
  id: string
  name: string
  type: ObservableEnum
  getValue: Selector<any, any>
  getRange: Selector<any, any>
}

export const addObservable = actionCreator<AddObservableAction>(
  'ADD_OBSERVABLE'
)

export interface RemoveObservableAction {
  id: string
}

export const removeObservable = actionCreator<RemoveObservableAction>(
  'REMOVE_OBSERVABLe'
)

export const removeGymObservables = actionCreatorVoid('REMOVE_GYM_OBSERVABLES')

export interface AddNewObservableAction {
  name: string
  type: ObservableEnum
  getValue: Selector<any, any>
  getRange: Selector<any, any>
}

export function addNewObservable (payload: AddNewObservableAction) {
  return (dispatch: Function) => {
    dispatch(addObservable({ id: _.uniqueId('obs'), ...payload }))
  }
}

export function addAllGymObservables () {
  return (dispatch: Function, getState: () => IState) => {
    getState().network.gym.observations.map((obs, i) =>
      dispatch(
        addNewObservable({
          name: 'obs' + i,
          type: ObservableEnum.Gym,
          getValue: (state: IState) => getObservationByIndex(state, i),
          getRange: (state: IState) => getObservationRange(state, i)
        })
      )
    )
  }
}
