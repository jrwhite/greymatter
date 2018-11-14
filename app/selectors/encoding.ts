import * as _ from 'lodash'
import { IState } from '../reducers'
import { EncodedSourceState } from '../reducers/encodings'
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

export const makeGetEncodedValueById = () =>
  createSelector(
    getEncodedValueById,
    (val) => val
  )
