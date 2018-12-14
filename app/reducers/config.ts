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
  moveStdpControlPoint,
  moveModControlPoint
} from '../actions/config'
import {
  IzhikParams,
  AxonType,
  recoveryDeltaRange,
  stdpRange,
  firePeriodRange,
  maxWeighting
} from './neurons'
import * as _ from 'lodash'
import * as d3 from 'd3'
import { ControlPointState, EncodingFunction } from './encodings'
import { ControlPoint } from '../components/ControlPoint'
import { daRange } from './volume'

export const maxStepInterval = 200
export const maxFps = 60
export const minFps = 5
export const minStepInterval = 10
export const dendWeightingRange = { start: 0, stop: 80 }

export enum StdpModTypes {
  Volume = 'Volume',
  Weighting = 'Weighting'
}

export interface StdpModEncoding {
  domain: { start: number; stop: number }
  range: { start: number; stop: number }
  // encoding?: EncodingFunction
  controlPoints: { [stdpType: string]: ControlPointState[] }
  // controlPoints: ControlPointState[]
}

export interface StdpEncoding {
  domain: { start: number; stop: number }
  range: { start: number; stop: number }
  encoding?: EncodingFunction
  controlPoints: ControlPointState[]
  modEncodings: { [modType: string]: StdpModEncoding }
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

// TODO: add depression modifier

// what percentage of the potentiation gets applied
const initialModEncodings: { [modType: string]: StdpModEncoding } = {
  Volume: {
    domain: daRange,
    range: { start: 0, stop: 1 },
    controlPoints: {
      Potentiation: [
        { index: 0, pos: { x: daRange.start, y: 0.25 } },
        { index: 1, pos: { x: daRange.stop / 4, y: 0.7 } },
        { index: 2, pos: { x: daRange.stop / 2, y: 0.9 } },
        { index: 3, pos: { x: daRange.stop, y: 1 } }
      ]
    }
  },
  Weighting: {
    domain: dendWeightingRange,
    range: { start: 0, stop: 1 },
    controlPoints: {
      Potentiation: [
        { index: 0, pos: { x: dendWeightingRange.start, y: 1 } },
        { index: 1, pos: { x: (maxWeighting * 1) / 4, y: 0.75 } },
        { index: 2, pos: { x: (maxWeighting * 3) / 4, y: 0.25 } },
        { index: 3, pos: { x: dendWeightingRange.stop, y: 0 } }
      ]
    }
  }
}

const zeroModEncodings = {
  Volume: {
    domain: daRange,
    range: { start: 0, stop: 1 },
    controlPoints: {
      Potentiation: [
        { index: 0, pos: { x: daRange.start, y: 1 } },
        { index: 1, pos: { x: daRange.stop, y: 1 } }
      ],
      Depression: [
        { index: 0, pos: { x: daRange.start, y: 1 } },
        { index: 1, pos: { x: daRange.stop, y: 1 } }
      ]
    }
  },
  Weighting: {
    domain: dendWeightingRange,
    range: { start: 0, stop: 1 },
    controlPoints: {
      Potentiation: [
        { index: 0, pos: { x: dendWeightingRange.start, y: 1 } },
        { index: 1, pos: { x: dendWeightingRange.stop, y: 1 } }
      ],
      Depression: [
        { index: 0, pos: { x: dendWeightingRange.start, y: 1 } },
        { index: 1, pos: { x: dendWeightingRange.stop, y: 1 } }
      ]
    }
  }
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
      ],
      modEncodings: initialModEncodings
    },
    Inhibitory: {
      domain: firePeriodRange,
      range: stdpRange,
      controlPoints: [
        {
          index: 0,
          pos: { x: firePeriodRange.start, y: -0.1 * stdpRange.start }
        },
        {
          index: 1,
          pos: { x: 0.25 * firePeriodRange.start, y: stdpRange.stop / 2 }
        },
        {
          index: 2,
          pos: { x: 0.25 * firePeriodRange.stop, y: stdpRange.stop / 2 }
        },
        {
          index: 3,
          pos: { x: firePeriodRange.stop, y: -0.1 * stdpRange.start }
        }
      ],
      modEncodings: zeroModEncodings
    },
    Volume: {
      domain: firePeriodRange,
      range: stdpRange,
      controlPoints: [
        { index: 0, pos: { x: firePeriodRange.start, y: 0 } },
        { index: 1, pos: { x: 0, y: stdpRange.stop } },
        { index: 2, pos: { x: 0.000001, y: stdpRange.start } },
        { index: 3, pos: { x: firePeriodRange.stop, y: 0 } }
      ],
      modEncodings: zeroModEncodings
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
  } else if (moveModControlPoint.test(action)) {
    const encoding = state.stdpEncodings[action.payload.encodingId]
    const mod = encoding.modEncodings[action.payload.modType]
    // return {
    //   ...state,
    //   stdpEncodings: {
    //     ...state.stdpEncodings,
    //     [action.payload.encodingId]: {
    //       ...encoding,
    //       modEncodings: {
    //         ...encoding.modEncodings,
    //         [action.payload.modType]: {
    //           ...mod,
    //           controlPoints: {
    //             ...mod.controlPoints,
    //             [action.payload.stdpType]: mod.controlPoints[
    //               action.payload.stdpType
    //             ].map((c, i) => {
    //               if (i === action.payload.index) {
    //                 return {
    //                   ...c,
    //                   pos:
    //                     i === 1 || i === 2
    //                       ? { ...action.payload.newPos, x: c.pos.x }
    //                       : action.payload.newPos
    //                 }
    //               }
    //               return c
    //             })
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    return state
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
