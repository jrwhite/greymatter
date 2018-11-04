import * as _ from 'lodash'
import { IState } from '../reducers'
import { EncodedSourceState } from '../reducers/encodings'
import { createSelector } from 'reselect'

const getEncodingById = (state: IState, id: string): EncodedSourceState => {
  return state.network.encodings.find((enc) => enc.id === id)!!
}

export const makeGetEncodingById = () =>
  createSelector(getEncodingById, (enc) => ({
    ...enc
  }))
