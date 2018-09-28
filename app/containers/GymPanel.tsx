import * as React from "react";
import { render } from "react-dom";
import { GymState } from "../reducers/gym";
import { HTMLSelect } from "@blueprintjs/core";
import GymClient from "./GymClient";
import { GymEnv } from "./GymClient";
import { setGymEnv, SetGymEnvAction } from "../actions/gym";
import * as Actions from "../actions/gym";
import { IState as IIState } from "../reducers";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";

export interface IProps {
  gym: GymState;
  setGymEnv: (payload: SetGymEnvAction) => void;
}

export class GymPanel extends React.Component<IProps> {
  props: IProps;

  render() {
    const { gym, setGymEnv } = this.props;

    const handleEnvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setGymEnv({ env: e.currentTarget.value as GymEnv });
    };

    return (
      <div>
        {gym.env ? <GymClient /> : undefined}
        <HTMLSelect onChange={handleEnvChange}>
          <option selected disabled hidden>
            Choose environment...
          </option>
          <option value={GymEnv.Cartpole}>Cartpole-v1</option>
        </HTMLSelect>
      </div>
    );
  }
}

function mapStateToProps(state: IIState): Partial<IProps> {
  return {
    gym: state.network.gym
  };
}

function mapDispatchToProps(dispatch: Dispatch<IIState>): Partial<IProps> {
  return bindActionCreators(Actions as any, dispatch);
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(GymPanel) as any) as React.StatelessComponent<Partial<IProps>>;
