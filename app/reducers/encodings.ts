import { Selector } from 'reselect'
import { IAction } from '../actions/helpers'
import { Point } from '../utils/geometry'

export enum EncodedSourceType {
  Tonic = 'Tonically active',
  GymAction = 'Gym Action'
}

export interface EncodedSourceState {
  id: string
  name: string
  type: EncodedSourceType
  obsId: string
  encoding?: (input: number) => number // if there is no encdoing, selector will build it from control points
  controlPoints: Array<{ pos: Point; index: number }>
}

export default function encodings (
  state: EncodedSourceState[] = [],
  action: IAction
): EncodedSourceState[] {
  return state
}
