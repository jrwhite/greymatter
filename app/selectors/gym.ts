import { IState } from '../reducers'

export const getObservationFromIndex = (state: IState, index: number) => {
  return state.network.gym.observations[index]!!
}

export const getGymSourceItem = (state: IState, index: number) => {}
