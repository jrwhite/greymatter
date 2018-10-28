import { Selector } from 'reselect'
import { IAction } from '../actions/helpers';

export enum EncodedSourceType {
  Tonic = 'Tonically active',
  GymAction = 'Gym Action'
}

export interface EncodedSourceState {
  id: string
  name: string
  type: EncodedSourceType
  obsId: string
  encoding: (input: number) => number
}

export default function encodings (
  state: EncodedSourceState[] = [],
  action: IAction
): EncodedSourceState[] {
  return state
}
