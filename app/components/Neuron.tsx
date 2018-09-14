import * as React from "react";
import { RouteComponentProps, StaticRouter } from "react-router";
import { Ellipse } from "./Ellipse";
import { Point } from "../utils/geometry";
import {
  SelectNeuronAction,
  MoveNeuronAction,
  makeGhostSynapseAtAxon,
  MakeGhostSynapseAtAxonAction,
  makeGhostSynapseAtDend,
  MakeGhostSynapseAtDendAction,
  tryMakeSynapseAtAxon,
  tryMakeSynapseAtDend,
  tryMakeSynapseAtNewDend,
  RemoveNeuronsAction,
  HyperpolarizeNeuron,
  addApToSynapse,
  AddApToSynapse,
  addNewApToSynapse
} from "../actions/network";
import Draggable from "react-draggable";
import { DendStateType, AxonStateType } from "../reducers/network";
import { NeuronBody } from "./NeuronBody";
import { Dendrite } from "./Dendrite";
import { Soma } from "./Soma";
import { remote } from "electron";
import { Popover, Text, Button, Position } from "@blueprintjs/core";
import { PotentialGraph } from "./PotentialGraph";
import { PotentialGraphLine } from "./PotentialGraphLine";
// import { PotentialGraphLine } from "./PotentialGraphLine"
const { Menu } = remote;
const d3 = require("d3");

export interface IProps extends RouteComponentProps<any> {
  fireNeuron: (id: string) => void;
  addNewApToSynapse: (id: string) => void;
  removeNeuron: (id: string) => void;
  moveNeuron: (payload: MoveNeuronAction) => void;
  tryMakeSynapseAtAxon: (id: string, neuronId: string) => void;
  tryMakeSynapseAtNewDend: (neuronId: string, neuronPos: Point) => void;
  selectNeuron: (payload: SelectNeuronAction) => void;
  id: string;
  pos: Point;
  axon: AxonStateType;
  dends: Array<DendStateType>;
  potential: number;
}

export interface IState {
  selected: boolean;
}

export class Neuron extends React.Component<IProps, IState> {
  props: IProps;
  state: IState = { selected: false };

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.state.selected != prevState.selected) {
      this.renderD3();
    }
  }

  componentDidMount() {
    this.renderD3();
  }

  handleNeuronClick(e: React.MouseEvent<SVGGElement>) {
    e.preventDefault();
    const { tryMakeSynapseAtNewDend, id, pos, selectNeuron } = this.props;

    tryMakeSynapseAtNewDend(id, pos);
    selectNeuron({id: id})
  }

  handleAxonClick(e: React.MouseEvent<SVGCircleElement>) {
    e.preventDefault();
    const { tryMakeSynapseAtAxon, id, pos, axon } = this.props;

    tryMakeSynapseAtAxon(axon.id, id);
  }

  handleContextMenu(e: React.MouseEvent<SVGGElement>) {
    e.stopPropagation();
    e.preventDefault();
    const { removeNeuron, id } = this.props;

    Menu.buildFromTemplate([
      {
        label: "Remove neuron",
        click: () => removeNeuron(id)
      }
    ]).popup(remote.getCurrentWindow());
  }

  render() {
    const {
      fireNeuron,
      addNewApToSynapse,
      pos,
      id,
      axon,
      dends,
      potential
    } = this.props;

    const graphPopover: JSX.Element = (
      <Popover>
        <strong>test</strong>
      </Popover>
    )

    if (potential > 100) {
      fireNeuron(id);
      axon.synapses.forEach(s => addNewApToSynapse(s.id));
    }

    return ( 
      <g
        id={id}
        transform={"translate(" + pos.x + " " + pos.y + ")"}
        onContextMenu={this.handleContextMenu.bind(this)}
      >
        <g onClick={this.handleNeuronClick.bind(this)}>
          <NeuronBody dends={dends} />
          <Soma potential={potential} id={id} />
        </g>
        <circle
          cx={50}
          cy={0}
          r={5}
          onClick={this.handleAxonClick.bind(this)}
        />
      </g> 
      
    )
  }

  setSelected = (val: boolean) => {
    this.setState({ selected: val });
  };

  onDragStarted = () => {
    this.setSelected(true);
  };

  onDragged = () => {
    const { id, pos, moveNeuron } = this.props;

    const newPos: Point = {
      ...d3.event
    };

    moveNeuron({
      id: id,
      pos: newPos
    });
  };

  renderD3() {
    const { id } = this.props;

    const { selected } = this.state;

    d3.select("#" + id)
      .classed("selected", selected)
      .call(
        d3
          .drag()
          .on("start", this.onDragStarted)
          .on("drag", this.onDragged)
      );
  }
}
