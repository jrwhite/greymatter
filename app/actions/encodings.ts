import {
  EncodedSourceState,
  EncodedSourceType,
  EncodingFunction,
  ControlPointState
} from '../reducers/encodings'
import { Point } from '../utils/geometry'
import * as _ from 'lodash'
import { actionCreator } from './helpers'

export interface AddEncodingAction {
  id: string
  name: string
  type: EncodedSourceType
  obsId: string
  encoding?: EncodingFunction
  controlPoints: ControlPointState[]
}

export const addEncoding = actionCreator<AddEncodingAction>('ADD_ENCODING')

export interface MoveControlPointAction {
  index: number
  encodingId: string
  newPos: Point
}

export const moveControlPoint = actionCreator<MoveControlPointAction>(
  'MOVE_CONTROL_POINT'
)

export interface AddNewEncodingAction {
  name: string
  type: EncodedSourceType
  obsId: string
}

const initialEncodingState: EncodedSourceState = {
  id: 'enc',
  name: 'UNINITIALIZED',
  type: EncodedSourceType.Tonic,
  obsId: 'obs',
  controlPoints: [{ pos: { x: 0, y: 0 }, index: 0 }]
}

export function addNewEncoding (payload: AddNewEncodingAction) {
  return (dispatch: Function) => {
    const newId = _.uniqueId('enc')

    dispatch(
      addEncoding({
        ...initialEncodingState,
        ...payload,
        id: newId
      })
    )
  }
}
