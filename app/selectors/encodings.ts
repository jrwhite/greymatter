import * as _ from 'lodash'
import { IState } from '../reducers'
import { EncodedSourceState, EncodedSourceEnum } from '../reducers/encodings'
import { createSelector } from 'reselect'
import { getObservableById } from './observables'
import { makeEncodingFromCtrlPoints } from '../utils/encoding'

const getEncodingById = (state: IState, id: string): EncodedSourceState => {
  return state.network.encodings.find((enc) => enc.id === id)!!
}

export const makeGetEncodingById = () =>
  createSelector(
    getEncodingById,
    (enc) => ({
      ...enc
    })
  )

export const getEncodedValueById = (state: IState, id: string): number => {
  const source = getEncodingById(state, id)
  const observable = getObservableById(state, source.obsId)
  const obsValue = observable.getValue(state)
  const encodingFunc = makeEncodingFromCtrlPoints(source.controlPoints)
  const encodedValue = encodingFunc(obsValue)
  return encodedValue
}

export const getEncodedValue = (
  state: IState,
  encoding: EncodedSourceState
) => {
  const observable = getObservableById(state, encoding.obsId)
  const obsValue = observable.getValue(state)
  const encodingFunc = makeEncodingFromCtrlPoints(encoding.controlPoints)
  const encodedValue = encodingFunc(obsValue)
  return encodedValue
}

export const makeGetEncodedValueById = () =>
  createSelector(
    getEncodedValueById,
    (val) => val
  )

export const getEncodedAction = (state: IState) => {
  const encoding = state.network.encodings.find(
    (enc) => enc.type === EncodedSourceEnum.GymAction
  )
  if (encoding === undefined) return 0
  return getEncodedValue(state, encoding)
}

export const makeGetEncodedAction = () =>
  createSelector(
    getEncodedAction,
    (action) => action
  )
