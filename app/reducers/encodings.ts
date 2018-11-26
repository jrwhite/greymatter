import { Selector } from 'reselect'
import { IAction } from '../actions/helpers'
import { Point, Line } from '../utils/geometry'
import { addEncoding, moveControlPoint } from '../actions/encodings'
import * as _ from 'lodash'
import { ENVELOPE } from '@blueprintjs/icons/lib/esm/generated/iconNames'

export enum EncodedSourceEnum {
  Tonic = 'Tonically active',
  GymAction = 'Gym Action'
}

export type EncodingFunction = (input: number) => number

export interface ControlPointState {
  pos: Point
  index: number
}

export interface EncodedSourceState {
  id: string
  name: string
  type: EncodedSourceEnum
  obsId: string
  encoding?: EncodingFunction // if there is no encdoing, selector will build it from control points
  controlPoints: ControlPointState[]
  range: { start: number; stop: number }
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
              (ctrl: ControlPointState, i: number): ControlPointState => {
                if (i === action.payload.index) {
                  return { ...ctrl, pos: action.payload.newPos }
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
