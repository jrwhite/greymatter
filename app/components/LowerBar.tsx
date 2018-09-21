import * as React from "react";
import { Tabs, TabId, Tab } from "@blueprintjs/core";
import GymPanel from "../containers/GymPanel";

export interface IProps {}

export interface IState {
  navbarTabId: TabId;
}

export class LowerBar extends React.Component<IProps, IState> {
  props: IProps;
  state: IState;

  handleTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId });

  render() {
    const {} = this.props;

    console.log("test");

    return (
      <Tabs id="lowertabs" onChange={this.handleTabChange}>
        <Tab id="gym" title="Gym" panel={<GymPanel />} />
        {/* <Tab id="plas" title="Plasticity" panel={} /> */}
      </Tabs>
    );
  }
}
