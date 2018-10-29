import { makeGetSidepanelState } from '../selectors/sidepanel'
import { IState } from '../reducers'
import { IProps, SideBar } from '../components/SideBar'
import { Dispatch, connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../actions/neurons'

const makeMapStateToProps = () => {
  const getSidepanelState = makeGetSidepanelState()
  return (state: IState, props: IProps) => getSidepanelState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(Actions as any, dispatch)
}

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SideBar) as any) as React.StatelessComponent
