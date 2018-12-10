import { IAction } from '../actions/helpers'
import { addDa, decayDa } from '../actions/volume'

export const daRange = {
  start: 0,
  stop: 100
}

export interface ExpDecayState {
  tau: number
  stepSize: number
}

// experimentally 200 ms half life
export const daHalfLife = 200

export interface DaState {
  molarity: number
  decay: ExpDecayState
}

export interface VolumeState {
  da: DaState
}

export const initialDaState = {
  molarity: 0,
  decay: {
    tau: daHalfLife / Math.LN2,
    stepSize: 1
  }
}

export default function volume (
  state: VolumeState = { da: initialDaState },
  action: IAction
): VolumeState {
  if (addDa.test(action)) {
    return {
      ...state,
      da: {
        ...state.da,
        molarity: state.da.molarity + action.payload.amount
      }
    }
  } else if (decayDa.test(action)) {
    const { molarity, decay } = state.da
    return {
      ...state,
      da: {
        ...state.da,
        molarity:
          molarity -
          (molarity / decay.tau) *
            Math.exp(-decay.stepSize / decay.tau) *
            decay.stepSize
      }
    }
  }
  return state
}
