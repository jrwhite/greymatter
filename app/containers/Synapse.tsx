import { makeGetSynapseState } from "../selectors/synapse";
import { IState } from "../reducers";
import { IProps, Synapse } from "../components/Synapse";
import { Dispatch, connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../actions/synapses";

const makeMapStateToProps = () => {
  const getSynapseState = makeGetSynapseState();
  return (state: IState, props: IProps) => getSynapseState(state, props);
};

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(Actions as any, dispatch);
};

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Synapse as any) as any) as React.StatelessComponent<Partial<IProps>>;
