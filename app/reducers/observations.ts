import { Selector } from 'reselect'

export interface ObservationState {
  id: string
  name: string
  getValue: Selector<any, any> | Selector<any, any> // TODO: update with allowed selectors
}

export type Observation = ObservationState
