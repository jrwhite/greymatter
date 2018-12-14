import * as React from 'react'
import { IState } from '../reducers'
import { bindActionCreators, AnyAction } from 'redux'
import NetworkActions from '../actions/network'
import { connect, Dispatch } from 'react-redux'
import { EncodingGraph, IProps as IIIProps } from '../components/EncodingGraph'
import { makeGetEncodingById } from '../selectors/encodings'
import * as Actions from '../actions/encodings'
import { makeGetObservableById } from '../selectors/observables'
import { moveStdpControlPoint } from '../actions/config'
import {
  StdpEncoding,
  StdpModEncoding,
  StdpModTypes
} from '../reducers/config'
import { StdpType } from '../reducers/neurons'
import StdpEncodingGraph from './StdpEncodingGraph'

export interface IProps {
  id: string // axonType
  modType: StdpModTypes
  color?: string
  // rangeX: { start: number; stop: number }
  // rangeY: { start: number; stop: number }
  width: number
  height: number
}

export interface IIProps extends IIIProps {
  modType: StdpModTypes
}

const mapStateToProps = (state: IState, props: IProps): Partial<IIProps> => {
  const encoding: StdpModEncoding =
    state.network.config.stdpEncodings[props.id].modEncodings[props.modType]
  return {
    ...props,
    rangeX: encoding.domain,
    rangeY: encoding.range,
    controlPoints: encoding.controlPoints.Potentiation
  }
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IIProps> => {
  return bindActionCreators(
    { moveControlPoint: moveStdpControlPoint },
    dispatch
  )
}

class DaModulationGraph extends React.Component<IIProps> {
  props: IIProps

  render () {
    return <EncodingGraph {...this.props} />
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DaModulationGraph)
