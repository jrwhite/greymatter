import { makeGetPotentialGraphLineState } from "../selectors/PotentialGraphLine";
import { IState } from '../reducers'
import { IProps, PotentialGraphLine } from '../components/PotentialGraphLine'
import * as NetworkActions from '../actions/network'
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

const makeMapStateToProps = () => {
    const getLineState = makeGetPotentialGraphLineState()
    return (state: IState, props: IProps) => getLineState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(makeMapStateToProps, mapDispatchToProps)(PotentialGraphLine) as any as React.StatelessComponent<Partial<IProps>>)