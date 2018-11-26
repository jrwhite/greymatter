import {
  EncodedSourceState,
  EncodedSourceEnum,
  EncodingFunction,
  ControlPointState
} from '../reducers/encodings'
import { Point } from '../utils/geometry'
import * as _ from 'lodash'
import { actionCreator } from './helpers'
import { IState } from '../reducers'
import { getObservableById } from '../selectors/observables'

export const TONIC_RANGE = { start: 0, stop: 20 }

export interface AddEncodingAction {
  id: string
  name: string
  type: EncodedSourceEnum
  obsId: string
  encoding?: EncodingFunction
  controlPoints: ControlPointState[]
  range: { start: number; stop: number }
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
  type: EncodedSourceEnum
  obsId: string
}

const initialEncodingState: Partial<EncodedSourceState> = {
  id: 'enc',
  name: 'UNINITIALIZED',
  // type: EncodedSourceEnum.Tonic,
  obsId: 'obs',
  controlPoints: [
    { pos: { x: 0, y: 0 }, index: 0 },
    { pos: { x: 1, y: 1 }, index: 1 }
  ]
}

export function addNewEncoding (payload: AddNewEncodingAction) {
  return (dispatch: Function, getState: () => IState) => {
    const newId = _.uniqueId('enc')

    const domain = getObservableById(getState(), payload.obsId).getRange(
      getState()
    )
    let range = { start: 0, stop: 1 }
    if (payload.type === EncodedSourceEnum.Tonic) {
      range = TONIC_RANGE
    } else if (payload.type === EncodedSourceEnum.GymAction) {
      range = { start: 0, stop: 1 }
    }
    const controlPoints = [
      { pos: { x: domain.start, y: range.start }, index: 0 },
      { pos: { x: domain.stop, y: range.stop }, index: 1 }
    ]

    dispatch(
      addEncoding({
        ...initialEncodingState,
        ...payload,
        id: newId,
        controlPoints,
        range
      })
    )
  }
}
