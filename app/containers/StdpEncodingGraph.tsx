import * as React from 'react'
import { IState } from '../reducers'
import { bindActionCreators, AnyAction } from 'redux'
import NetworkActions from '../actions/network'
import { connect, Dispatch } from 'react-redux'
import { EncodingGraph, IProps as IIProps } from '../components/EncodingGraph'
import { makeGetEncodingById } from '../selectors/encodings'
import * as Actions from '../actions/encodings'
import { makeGetObservableById } from '../selectors/observables'
import { moveStdpControlPoint } from '../actions/config'

export interface IProps {
  id: string // axonType
  color?: string
  // rangeX: { start: number; stop: number }
  // rangeY: { start: number; stop: number }
  width: number
  height: number
}

const mapStateToProps = (state: IState, props: IProps): Partial<IIProps> => {
  const encoding = state.network.config.stdpEncodings[props.id]
  return {
    ...props,
    rangeX: encoding.domain,
    rangeY: encoding.range,
    controlPoints: encoding.controlPoints
  }
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IIProps> => {
  return bindActionCreators(
    { moveControlPoint: moveStdpControlPoint },
    dispatch
  )
}

class StdpEncodingGraph extends EncodingGraph {
  props: IIProps
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StdpEncodingGraph)
