import { IAction } from '../actions/helpers'
import { selectNeuron, removeNeurons } from '../actions/neurons'
import { selectInput } from '../actions/inputs'
import {
  pauseNetwork,
  resumeNetwork,
  speedUpNetwork,
  slowDownNetwork,
  setDefaultIzhikParams
} from '../actions/config'
import { IzhikParams } from './neurons'
import * as _ from 'lodash'

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
  stepInterval: 50,
  isPaused: true,
  defaultIzhikParams: {
    a: 0.02,
    b: 0.2,
    c: -65,
    d: 2
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
