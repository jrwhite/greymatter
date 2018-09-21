import * as React from "react";
import { RouteComponentProps } from "react-router";
import { render } from "enzyme";
import {
  NeuronState,
  SelectedNeuronState,
  SelectedInputState
} from "../reducers/network";
import { Button, Text, Slider, ControlGroup } from "@blueprintjs/core";
import { PotentialGraph } from "./PotentialGraph";
import SelectedInput from "../containers/SelectedInput";
import SelectedNeuron from "../containers/SelectedNeuron";
const d3 = require("d3");

const styles = require("./SideBar.scss");

export interface IProps {
  closeSelectedPanel?: () => void;
  openSelectedPanel?: () => void;
  selectedNeurons: Array<SelectedNeuronState>;
  selectedInputs: Array<SelectedInputState>;
}

export interface IState {
  figures: Array<Object>;
}

const initialState: IState = {
  figures: []
};

export class SideBar extends React.Component<IProps, IState> {
  props: IProps;
  state: IState = initialState;

  render() {
    const { selectedNeurons, selectedInputs } = this.props;

    return (
      <div className={styles.container}>
        {/* <p>
                "Selected"
            </p> */}

        {selectedNeurons.length > 0 ? (
          <div>
            <svg>
              <PotentialGraph
                neurons={selectedNeurons}
                scaleX={3}
                rangeX={50}
                scaleY={0.4}
                rangeY={{ start: -300, stop: 100 }}
              />
            </svg>
            <SelectedNeuron id={selectedNeurons[0].id} />
          </div>
        ) : (
          undefined
        )}
        {/* <ControlGroup 
                fill={false}
                vertical={true}
            > */}
        {selectedInputs.length > 0 ? (
          <SelectedInput id={selectedInputs[0].id} />
        ) : (
          undefined
        )}
        {/* </ControlGroup> */}
      </div>
    );
  }
}
