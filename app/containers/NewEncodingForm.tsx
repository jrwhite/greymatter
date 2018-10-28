import * as React from 'react'
import { NewEncodingForm, IProps } from '../components/NewEncodingForm'
import { connect } from 'react-redux'
import { IState } from '../reducers'
import { bindActionCreators } from 'redux'
import NetworkActions from '../actions/network'

const mapStateToProps = (state: IState, props: IProps) => {
  return {
    observableItems: state.network.observables
  }
}

export default (connect(
  mapStateToProps,
  (dispatch) => bindActionCreators(NetworkActions as any, dispatch)
)(NewEncodingForm) as any) as React.Component
