import * as React from 'react'
import { IState } from '../reducers'
import { IProps, ConfigPanel } from '../components/ConfigPanel'
import { Dispatch, connect } from 'react-redux'
import { bindActionCreators, AnyAction } from 'redux'
import { setDefaultIzhikParams } from '../actions/config'
import NetworkActions from '../actions/network'

const mapStateToProps = (state: IState, props: IProps) => ({
  izhikParams: state.network.config.defaultIzhikParams
})

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> =>
  bindActionCreators(NetworkActions, dispatch) as any

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigPanel) as any
