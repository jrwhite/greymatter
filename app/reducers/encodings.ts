import { Selector } from 'reselect'
import { IAction } from '../actions/helpers'
import { Point } from '../utils/geometry'
import { addEncoding, moveControlPoint } from '../actions/encodings'
import * as _ from 'lodash'
import { ENVELOPE } from '@blueprintjs/icons/lib/esm/generated/iconNames'

export enum EncodedSourceType {
  Tonic = 'Tonically active',
  GymAction = 'Gym Action'
}

export type EncodingFunction = (input: number) => number
export interface ControlPoint {
  pos: Point
  index: number
  id: string
}

export interface EncodedSourceState {
  id: string
  name: string
  type: EncodedSourceType
  obsId: string
  encoding?: EncodingFunction // if there is no encdoing, selector will build it from control points
  controlPoints: Point[]
}

const changeEncodingWithId = (
  state: EncodedSourceState[],
  id: string,
  changes: Partial<EncodedSourceState>
) => {
  return _.map(state, (enc: EncodedSourceState) => {
    if (enc.id === id) {
      return {
        ...enc,
        ...changes
      }
    } else {
      return enc
    }
  })
}

export default function encodings (
  state: EncodedSourceState[] = [],
  action: IAction
): EncodedSourceState[] {
  if (addEncoding.test(action)) {
    return _.concat(state, { ...action.payload })
  } else if (moveControlPoint.test(action)) {
    return _.map(
      state,
      (enc: EncodedSourceState): EncodedSourceState => {
        if (enc.id === action.payload.encodingId) {
          return {
            ...enc,
            controlPoints: _.map(
              enc.controlPoints,
              (ctrl: Point, i: number): Point => {
                if (i === action.payload.index) {
                  return action.payload.newPos
                } else {
                  return ctrl
                }
              }
            )
          }
        } else {
          return enc
        }
      }
    )
  }
  return state
}
