import * as React from 'react'
import { IState } from '../reducers'
import { bindActionCreators, AnyAction } from 'redux'
import NetworkActions from '../actions/network'
import { connect, Dispatch } from 'react-redux'
import { EncodingGraph, IProps as IIProps } from '../components/EncodingGraph'
import { makeGetEncodingById } from '../selectors/encoding'
import * as Actions from '../actions/encodings'

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
  return (state: IState, props: IProps): Partial<IIProps> => ({
    ...props,
    controlPoints: getEncoding(state, props.id).controlPoints
  })
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IIProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(EncodingGraph)
