import { makeGetSidepanelState } from "../selectors/sidepanel";
import { IState } from "../reducers";
import { IProps, SelectedPanel } from "../components/SelectedPanel";
import { Dispatch, connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as NetworkActions from '../actions/network'

const makeMapStateToProps = () => {
    const getSidepanelState = makeGetSidepanelState()
    return (state: IState, props: IProps) => getSidepanelState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>) : Partial<IProps> => {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(makeMapStateToProps, mapDispatchToProps)(SelectedPanel) as any as React.StatelessComponent)