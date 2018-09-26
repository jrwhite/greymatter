import * as React from "react";
import { RouteComponentProps } from "react-router";
import Neuron from "../containers/Neuron";
import { Point, addPoints } from "../utils/geometry";
import { remote } from "electron";
import {
  SynapseState,
  GhostSynapseState,
  InputState,
  ConfigState
} from "../reducers/network";
import Synapse from "../containers/Synapse";
import Input from "../containers/Input";
import { GhostSynapse } from "./GhostSynapse";
import Sidebar from "../containers/Sidebar";
import {
  Text,
  Button,
  ButtonGroup,
  HotkeysTarget,
  Hotkeys,
  Hotkey
} from "@blueprintjs/core";
import {
  pauseNetwork,
  resumeNetwork,
  speedUpNetwork,
  slowDownNetwork,
  resetNetwork,
  addNewApToSynapse
} from "../actions/network";
import GymClient from "../containers/GymClient";
import { LowerBar } from "./LowerBar";
const { Menu } = remote;
const d3 = require("d3");

let styles = require("./Network.scss");

export interface IProps extends RouteComponentProps<any> {
  addNewNeuron(pos: Point): void;
  addNewInput(pos: Point): void;
  decayNetwork: () => void;
  stepNetwork: () => void; // izhik step
  pauseNetwork: () => void;
  resumeNetwork: () => void;
  speedUpNetwork: () => void;
  slowDownNetwork: () => void;
  resetNetwork: () => void;
  addNewApToSynapse: (id: string) => void;
  ghostSynapse: GhostSynapseState;
  inputs: Array<InputState>;
  neurons: Array<NeuronState>;
  synapses: Array<SynapseState>;
  config: ConfigState;
}

export interface IState {
  mouse: {
    pos: Point;
  };
  interval: any;
}

const initialState: IState = {
  mouse: {
    pos: { x: 0, y: 0 }
  },
  interval: Object
};

@HotkeysTarget
export class Network extends React.Component<IProps, IState> {
  props: IProps;
  state: IState = initialState;

  componentDidMount() {
    this.startRuntime();
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevProps.config != this.props.config) {
      this.restartRuntime();
    }
  }

  onContextMenu(e: any) {
    e.preventDefault();
    const { addNewNeuron, addNewInput } = this.props;
    const pos: Point = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };

    Menu.buildFromTemplate([
      {
        label: "Add neuron",
        // click: () => addNeuron({key: _.uniqueId('n'), pos: poijknt})
        click: () => addNewNeuron(pos)
      },
      {
        label: "Add input",
        click: () => addNewInput(pos)
      }
    ]).popup(remote.getCurrentWindow());
  }

  handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();
    const { mouse } = this.state;

    const newPos = { x: e.clientX, y: e.clientY };
    this.setState({ mouse: { pos: newPos } });
  };

  render() {
    const {
      resetNetwork,
      ghostSynapse,
      neurons,
      synapses,
      inputs,
      slowDownNetwork,
      speedUpNetwork,
      pauseNetwork,
      resumeNetwork,
      config
    } = this.props;

    // TODO: refactor ghostSynapse into separate component
    const axonNeuron = ghostSynapse.axon
      ? neurons.find(n => n.id === ghostSynapse.axon!!.neuronId)
      : undefined;
    const dendNeuron = ghostSynapse.dend
      ? neurons.find(n => n.id === ghostSynapse.dend!!.neuronId)
      : undefined;

    return (
      <div className={styles["container-top"]}>
        <div className={styles["wrapper-upper"]}>
          <div className={styles["container-upper"]}>
            <div className={styles.sidebar}>
              <Sidebar />
            </div>
            {/* { config.isPaused ? <GymClient /> : undefined }  */}
            <div className={styles["wrapper-editor"]}>
              <svg
                className={styles.editor}
                onContextMenu={this.onContextMenu.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
              >
                {ghostSynapse && this.state.mouse ? (
                  <GhostSynapse
                    axon={
                      axonNeuron
                        ? {
                            pos: addPoints(axonNeuron.pos, axonNeuron.axon.cpos)
                          }
                        : undefined
                    }
                    dend={
                      dendNeuron
                        ? {
                            pos: addPoints(
                              dendNeuron.pos,
                              dendNeuron.dends.find(
                                d => d.id === ghostSynapse.dend!!.id
                              )!!.baseCpos
                            )
                          }
                        : undefined
                    }
                    mouse={this.state.mouse}
                  />
                ) : (
                  undefined
                )}
                {inputs.map((input: InputState) => (
                  <Input key={input.id} {...input} />
                ))}
                {neurons.map((neuron: NeuronState) => (
                  <Neuron key={neuron.id} {...neuron} />
                ))}
                {synapses.map((synapse: SynapseState) => (
                  <Synapse key={synapse.id} {...synapse} />
                ))}
              </svg>
              {/* <Text className={styles.overlay}>Overlay</Text> */}
              <div className={styles.overlay}>
                <ButtonGroup minimal={true} className={styles.overlay}>
                  <Button icon="fast-backward" onClick={slowDownNetwork} />
                  <Button
                    icon={config.isPaused ? "play" : "pause"}
                    onClick={config.isPaused ? resumeNetwork : pauseNetwork}
                  />
                  <Button icon="fast-forward" onClick={speedUpNetwork} />
                  <Button icon="refresh" onClick={resetNetwork} />
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["wrapper-lower"]}>
          <LowerBar />
        </div>
      </div>
    );
  }

  renderHotkeys() {
    const { inputs, addNewApToSynapse } = this.props;

    return (
      <Hotkeys>
        {inputs.map(
          (input: InputState) =>
            input.hotkey ? (
              <Hotkey
                label={"fire input " + input.id}
                global={false}
                combo={input.hotkey}
                onKeyDown={() =>
                  input.axon.synapses.forEach(s => addNewApToSynapse(s.id))
                }
              />
            ) : (
              undefined
            )
        )}
      </Hotkeys>
    );
  }

  startRuntime() {
    const { decayNetwork, stepNetwork, config } = this.props;
    const step = () => {
      // decayNetwork()
      stepNetwork();
    };
    const interval = d3.interval(step, config.stepInterval);
    this.setState({ interval: interval });
    if (config.isPaused) {
      interval.stop();
    }
  }

  restartRuntime() {
    const { config, stepNetwork } = this.props;
    const { interval } = this.state;
    const step = () => {
      stepNetwork();
    };
    if (config.isPaused) {
      interval.stop();
    } else {
      // interval.restart(step, config.stepInterval)
      interval.stop();
      const newInterval = d3.interval(step, config.stepInterval);
      this.setState({ interval: newInterval });
    }
  }
}
