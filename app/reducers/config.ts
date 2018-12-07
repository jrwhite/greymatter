import { IAction } from '../actions/helpers'
import { selectNeuron, removeNeurons } from '../actions/neurons'
import { selectInput } from '../actions/inputs'
import {
  pauseNetwork,
  resumeNetwork,
  speedUpNetwork,
  slowDownNetwork,
  setDefaultIzhikParams,
  setStepInterval
} from '../actions/config'
import { IzhikParams } from './neurons'
import * as _ from 'lodash'
import * as d3 from 'd3'

export const maxStepInterval = 200
export const maxFps = 60
export const minFps = 5
export const minStepInterval = 10

export interface ConfigState {
  selectedNeurons: SelectedNeuronState[]
  selectedInputs: SelectedInputState[]
  stepSize: number // in ms,
  stepInterval: number
  isPaused: boolean
  defaultIzhikParams: IzhikParams
}

export interface SelectedNeuronState {
  id: string
}

export interface SelectedInputState {
  id: string
}

const initialConfigState = {
  selectedNeurons: [],
  selectedInputs: [],
  stepSize: 1,
  stepInterval: 30,
  isPaused: true,
  defaultIzhikParams: {
    a: 0.02,
    b: 0.25,
    c: -65,
    d: 0.05
  }
}

export default function config (
  state: ConfigState = initialConfigState,
  action: IAction
): ConfigState {
  if (selectNeuron.test(action)) {
    return {
      ...state,
      selectedNeurons: [
        {
          id: action.payload.id
        }
      ]
    }
  } else if (selectInput.test(action)) {
    return {
      ...state,
      selectedInputs: [
        {
          id: action.payload.id
        }
      ]
    }
  } else if (setDefaultIzhikParams.test(action)) {
    return {
      ...state,
      defaultIzhikParams: {
        ...action.payload
      }
    }
  } else if (removeNeurons.test(action)) {
    return {
      ...state,
      selectedNeurons: _.differenceBy(
        state.selectedNeurons,
        action.payload.neurons,
        'id'
      )
    }
  } else if (setStepInterval.test(action)) {
    return {
      ...state,
      ...action.payload
    }
    // BEGIN VOID ACTIONS
  } else if (pauseNetwork.test(action)) {
    return {
      ...state,
      isPaused: true
    }
  } else if (resumeNetwork.test(action)) {
    return {
      ...state,
      isPaused: false
    }
  } else if (speedUpNetwork.test(action)) {
    return {
      ...state,
      stepInterval: state.stepInterval >= 20 ? state.stepInterval - 10 : 10
    }
  } else if (slowDownNetwork.test(action)) {
    return {
      ...state,
      stepInterval: state.stepInterval + 10
    }
  } else {
    return state
  }
}
