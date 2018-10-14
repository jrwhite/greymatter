import { makeGetInputState } from '../selectors/input'
import { IState } from '../reducers'
import { IProps, Input } from '../components/Input'
import { Dispatch, connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../actions/inputs'
import NetworkActions from '../actions/network'

const makeMapStateToProps = () => {
  const getInputState = makeGetInputState()
  return (state: IState, props: IProps) => getInputState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Input as any) as any) as React.StatelessComponent<Partial<IProps>>
