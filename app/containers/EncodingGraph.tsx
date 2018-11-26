import * as React from 'react'
import { IState } from '../reducers'
import { bindActionCreators, AnyAction } from 'redux'
import NetworkActions from '../actions/network'
import { connect, Dispatch } from 'react-redux'
import { EncodingGraph, IProps as IIProps } from '../components/EncodingGraph'
import { makeGetEncodingById } from '../selectors/encoding'
import * as Actions from '../actions/encodings'
import { makeGetObservableById } from '../selectors/observables'

export interface IProps {
  id: string
  color?: string
  rangeX: { start: number; stop: number }
  rangeY: { start: number; stop: number }
  width: number
  height: number
}

const makeMapStateToProps = () => {
  const getEncoding = makeGetEncodingById()
  const getObservable = makeGetObservableById()
  return (state: IState, props: IProps): Partial<IIProps> => {
    const encoding = getEncoding(state, props.id)
    const observable = getObservable(state, encoding.obsId)
    return {
      ...props,
      controlPoints: encoding.controlPoints,
      rangeX: observable ? observable.getRange(state) : { start: 0, stop: 100 }, // TODO: GET RID OF DEFAULT
      rangeY: encoding.range ? encoding.range : { start: 0, stop: 100 }
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IIProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(EncodingGraph)
