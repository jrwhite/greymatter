import * as React from 'react'
import { IState } from '../reducers'
import { IProps, NeuronOverlay } from '../components/NeuronOverlay'
import { bindActionCreators } from 'redux'
import { Dispatch, connect } from 'react-redux'
import NetworkActions from '../actions/network'

export interface IIProps {
  id: string
}

const mapStateToProps = (state: IState, props: IIProps): Partial<IProps> => {
  return {
    ...props
  }
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(NeuronOverlay) as any) as React.StatelessComponent<IIProps>
