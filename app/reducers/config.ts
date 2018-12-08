import { IAction } from '../actions/helpers'
import { selectNeuron, removeNeurons } from '../actions/neurons'
import { selectInput } from '../actions/inputs'
import {
  pauseNetwork,
  resumeNetwork,
  speedUpNetwork,
  slowDownNetwork,
  setDefaultIzhikParams,
  setStepInterval,
  moveStdpControlPoint
} from '../actions/config'
import {
  IzhikParams,
  AxonType,
  recoveryDeltaRange,
  stdpRange,
  firePeriodRange
} from './neurons'
import * as _ from 'lodash'
import * as d3 from 'd3'
import { ControlPointState, EncodingFunction } from './encodings'

export const maxStepInterval = 200
export const maxFps = 60
export const minFps = 5
export const minStepInterval = 10

export interface StdpEncoding {
  domain: { start: number; stop: number }
  range: { start: number; stop: number }
  encoding?: EncodingFunction
  controlPoints: ControlPointState[]
}
export interface ConfigState {
  selectedNeurons: SelectedNeuronState[]
  selectedInputs: SelectedInputState[]
  stepSize: number // in ms,
  stepInterval: number
  isPaused: boolean
  defaultIzhikParams: IzhikParams
  stdpEncodings: {
    [axonType: string]: StdpEncoding;
  }
}

export interface SelectedNeuronState {
  id: string
}

export interface SelectedInputState {
  id: string
}

const initialConfigState: ConfigState = {
  selectedNeurons: [],
  selectedInputs: [],
  stepSize: 1,
  stepInterval: 30,
  isPaused: true,
  defaultIzhikParams: {
    receptors: 3,
    a: 0.02,
    b: 0.25,
    c: -65,
    d: 0.05
  },
  stdpEncodings: {
    Excitatory: {
      domain: firePeriodRange,
      range: stdpRange,
      controlPoints: [
        { index: 0, pos: { x: firePeriodRange.start, y: 0 } },
        { index: 1, pos: { x: 0, y: stdpRange.stop } },
        { index: 2, pos: { x: 0.000001, y: stdpRange.start } },
        { index: 3, pos: { x: firePeriodRange.stop, y: 0 } }
      ]
    },
    Inhibitory: {
      domain: firePeriodRange,
      range: stdpRange,
      controlPoints: [
        { index: 0, pos: { x: firePeriodRange.start, y: 0 } },
        { index: 1, pos: { x: 0, y: stdpRange.stop } },
        { index: 2, pos: { x: 0.000001, y: stdpRange.start } },
        { index: 3, pos: { x: firePeriodRange.stop, y: 0 } }
      ]
    },
    Volume: {
      domain: firePeriodRange,
      range: stdpRange,
      controlPoints: [
        { index: 0, pos: { x: firePeriodRange.start, y: 0 } },
        { index: 1, pos: { x: 0, y: stdpRange.stop } },
        { index: 2, pos: { x: 0.000001, y: stdpRange.start } },
        { index: 3, pos: { x: firePeriodRange.stop, y: 0 } }
      ]
    }
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
  } else if (moveStdpControlPoint.test(action)) {
    const encoding = state.stdpEncodings[action.payload.encodingId]
    return {
      ...state,
      stdpEncodings: {
        ...state.stdpEncodings,
        [action.payload.encodingId]: {
          ...encoding,
          controlPoints: encoding.controlPoints.map((c, i) => {
            if (i === action.payload.index) {
              return {
                ...c,
                pos:
                  i === 1 || i === 2
                    ? { ...action.payload.newPos, x: c.pos.x }
                    : action.payload.newPos
              }
            }
            return c
          })
        }
      }
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
