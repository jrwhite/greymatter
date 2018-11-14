import { IState } from '../reducers'
import { ObservableState } from '../reducers/observables'

export const getObservableById = (
  state: IState,
  id: string
): ObservableState => {
  return state.network.observables.find((obs) => obs.id === id)!!
}
