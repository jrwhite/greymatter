import { ControlPointState } from './encodings'
import { NeuronState } from './neurons'
import { IAction } from '../actions/helpers'
import { freemem } from 'os'
import { addTestInput, moveTestCtrlPoint } from '../actions/testInputs'
import * as _ from 'lodash'
import { InputState } from './inputs'

export enum TestInputType {
  SourcedDend
}

export interface TestState {
  steps: number
  stepTime: number
  maxSteps: number
  isPaused: boolean
  // resetNeurons: NeuronState[]
  inputs: TestInput[]
}

const initialTestState: TestState = {
  steps: 0,
  stepTime: 5,
  maxSteps: 10000,
  isPaused: false,
  inputs: []
}

export interface TestInput {
  type: TestInputType
  id: string
  name?: string
  controlPoints: ControlPointState[]
}

export const initialTestInput: TestInput = {
  type: TestInputType.SourcedDend,
  id: 'tin',
  controlPoints: []
}

export default function testInputs (
  state: TestState = initialTestState,
  action: IAction
): TestState {
  if (addTestInput.test(action)) {
    return {
      ...state,
      inputs: _.concat(state.inputs, action.payload)
    }
  } else if (moveTestCtrlPoint.test(action)) {
    return {
      ...state,
      inputs: state.inputs.map(
        (input: TestInput): TestInput => {
          if (input.id === action.payload.id) {
            return {
              ...input,
              controlPoints: _.map(
                input.controlPoints,
                (ctrl: ControlPointState, i: number): ControlPointState => {
                  if (i === action.payload.index) {
                    return { ...ctrl, pos: action.payload.newPos }
                  } else {
                    return ctrl
                  }
                }
              )
            }
          }
          return input
        }
      )
    }
  }
  return state
}
