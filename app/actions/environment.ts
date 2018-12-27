import { ControlPointState } from '../reducers/encodings'
import { actionCreator, actionCreatorVoid } from './helpers'
import { TestInput } from '../reducers/environment'
import { Point } from '../utils/geometry'

export const addTestInput = actionCreator<TestInput>('ADD_TEST_INPUT')

export interface MoveTestCtrlPointAction {
  id: string
  index: number
  newPos: Point
  data: number[]
}
export const moveTestCtrlPoint = actionCreator<MoveTestCtrlPointAction>(
  'MOVE_TEST_CTRL_POINT'
)

export const stepEnv = actionCreatorVoid('STEP_ENV')
