import { IState } from '../reducers'
import { ObservableState } from '../reducers/observables'
import { createSelector } from 'reselect'

export const getObservableById = (
  state: IState,
  id: string
): ObservableState => {
  return state.network.observables.find((obs) => obs.id === id)!!
}

export const makeGetObservableById = () =>
  createSelector(
    getObservableById,
    (observable) => observable
  )
