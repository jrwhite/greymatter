import { IState } from '../reducers'
import { createSelector } from 'reselect'

export const getObservationRange = (
  state: IState,
  index: number
): { start: number; stop: number } => {
  return {
    start: state.network.gym.observationSpace!!.low[index],
    stop: state.network.gym.observationSpace!!.high[index]
  }
}

export const makeGetObservationRange = () =>
  createSelector(
    getObservationRange,
    (observationRange) => observationRange
  )

export const getObservationByIndex = (state: IState, index: number): number =>
  state.network.gym.observations[index]

export const makeGetObservationByIndex = () =>
  createSelector(
    getObservationByIndex,
    (observation) => observation
  )
