import * as React from "react";
import { IzhikParams, NeuronState, DendStateType } from "../reducers/network";
import { ChangeIzhikParamsAction } from "../actions/network";
import { IState } from "../reducers";
import { createSelector } from "reselect";
import { Text, Slider, ControlGroup, Divider } from "@blueprintjs/core";
import { Dispatch, bindActionCreators } from "redux";
import * as NetworkActions from "../actions/network";
import { connect } from "react-redux";

const getSelectedNeuron = (state: IState, props: IProps) =>
  state.network.neurons.find((neuron: NeuronState) => neuron.id === props.id);

const makeGetSelectedNeuronState = () =>
  createSelector(getSelectedNeuron, selectedNeuron => ({
    izhikParams: selectedNeuron!!.izhik.params,
    dends: selectedNeuron!!.dends
  }));

export interface IProps {
  changeDendWeighting: (
    payload: NetworkActions.ChangeDendWeightingAction
  ) => void;
  changeIzhikParams: (payload: ChangeIzhikParamsAction) => void;
  id: string;
  izhikParams: IzhikParams;
  dends: Array<DendStateType>;
}

export class SelectedNeuron extends React.Component<IProps> {
  props: IProps;

  render() {
    const {
      id,
      izhikParams,
      changeIzhikParams,
      changeDendWeighting,
      dends
    } = this.props;

    const changeA = (a: number) =>
      changeIzhikParams({
        id: id,
        params: { a: a }
      });
    const changeB = (b: number) =>
      changeIzhikParams({
        id: id,
        params: { b: b }
      });
    const changeC = (c: number) =>
      changeIzhikParams({
        id: id,
        params: { c: c }
      });
    const changeD = (d: number) =>
      changeIzhikParams({
        id: id,
        params: { d: d }
      });

    return (
      <ControlGroup fill={false} vertical={true}>
        <Divider />
        <Text>Selected Neuron</Text>
        <Divider />
        <Text>Izhik 'a':</Text>
        <Slider
          min={0.02}
          max={0.1}
          stepSize={0.01}
          labelStepSize={0.01}
          value={izhikParams.a}
          onRelease={changeA}
        />
        <Text>Izhik 'b':</Text>
        <Slider
          min={0.2}
          max={0.25}
          stepSize={0.005}
          labelStepSize={0.01}
          value={izhikParams.b}
          onRelease={changeB}
        />
        <Text>Izhik 'c':</Text>
        <Slider
          min={-65}
          max={-50}
          stepSize={1}
          labelStepSize={3}
          value={izhikParams.c}
          onRelease={changeC}
        />
        <Text>Izhik 'd':</Text>
        <Slider
          min={0.05}
          max={8}
          stepSize={1}
          labelStepSize={1}
          value={izhikParams.d}
          onRelease={changeD}
        />
        <Divider />
        <Text>Dendrites:</Text>
        {dends.map(d => (
          <Slider
            min={0}
            max={100}
            stepSize={1}
            labelStepSize={20}
            value={d.weighting}
            onRelease={(w: number) =>
              changeDendWeighting({
                neuronId: id,
                dendId: d.id,
                weighting: w
              })
            }
          />
        ))}
      </ControlGroup>
    );
  }
}

const makeMapStateToProps = () => {
  const getSelectedNeuronState = makeGetSelectedNeuronState();
  return (state: IState, props: IProps) => getSelectedNeuronState(state, props);
};

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
  return bindActionCreators(NetworkActions as any, dispatch);
};

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SelectedNeuron) as any) as React.StatelessComponent<Partial<IProps>>;
