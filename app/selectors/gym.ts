import { IState } from '../reducers'
import { createSelector } from 'reselect'

export const getObservationRange = (
  state: IState,
  index: number
): { start: number; stop: number } => {
  const start = state.network.gym.observationSpace!!.low[index]
  const stop = state.network.gym.observationSpace!!.high[index]
  // TODO: why is the range so big OpenAI?!?
  if (index === 1 || index === 3) {
    return {
      start: -5,
      stop: 5
    }
  } else {
    return { start, stop }
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
