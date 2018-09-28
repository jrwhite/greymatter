import { IState } from "../reducers";
import { IProps } from "../components/Synapse";
import { createSelector } from "reselect";
import { addPoints } from "../utils/geometry";
import * as _ from "lodash";

const getSynapse = (state: IState, props: IProps) =>
  state.network.synapses.find(s => s.id === props.id);

export const getAxonNeuronPos = (state: IState, props: Partial<IProps>) => {
  if (_.includes(props.axon!!.neuronId, "in")) {
    return state.network.inputs.find(n => n.id === props.axon!!.neuronId)!!.pos;
  } else {
    return state.network.neurons.find(n => n.id === props.axon!!.neuronId)!!
      .pos;
  }
};

const getDendNeuronPos = (state: IState, props: IProps) =>
  state.network.neurons.find(n => n.id === props.dend.neuronId)!!.pos;

export const getAxonPos = (state: IState, props: Partial<IProps>) =>
  _.concat(
    _.map(state.network.neurons, n => n.axon),
    _.map(state.network.inputs, n => n.axon)
  ).find(a => a.id == props.axon!!.id)!!.cpos;

export const getAxonAbsPos = (state: IState, props: Partial<IProps>) =>
  addPoints(getAxonPos(state, props), getAxonNeuronPos(state, props));

const getDendPos = (state: IState, props: IProps) =>
  state.network.neurons
    .find(n => n.id === props.dend.neuronId)!!
    .dends.find(d => d.id === props.dend.id)!!.synCpos;

export const makeGetSynapseState = () =>
  createSelector(
    getSynapse,
    getAxonNeuronPos,
    getDendNeuronPos,
    getAxonPos,
    getDendPos,
    (synapse, axonNeuronPos, dendNeuronPos, axonPos, dendPos) => ({
      ...synapse,
      // id: synapse!!.id,
      // axon: synapse!!.axon,
      // dend: synapse!!.dend,
      // length: synapse!!.length,
      // width: synapse!!.width,
      // speed: synapse!!.speed,
      axonPos: addPoints(axonNeuronPos, axonPos),
      dendPos: addPoints(dendNeuronPos, dendPos)
    })
  );

// export const makeGetSynapseState = () => createSelector(
//     getSynapse,
//     synapse => (
//         {...synapse}
//     )
// )
