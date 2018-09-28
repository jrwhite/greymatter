import { IAction } from "./../actions/helpers";
import { addSynapseToInputAxon, changeInputRate, addInput, removeInput, moveInput, changeInputHotkey } from "../actions/inputs";
import { Point } from "electron";
import { AxonState } from "./neurons";
import _ = require("lodash");
export interface InputState {
  id: string;
  rate: number;
  pos: Point;
  axon: AxonState;
  hotkey?: string;
}

const initialInputState: InputState = {
  id: "in",
  rate: 0,
  pos: { x: 0, y: 0 },
  axon: { id: "a", cpos: { x: 50, y: 0 }, synapses: [] },
  hotkey: undefined
};

export default function inputs(
  state: Array<InputState> = [],
  action: IAction
): Array<InputState> {
  if (addSynapseToInputAxon.test(action)) {
    return state.map(n => {
      if (n.id == action.payload.inputId) {
        return {
          ...n,
          axon: {
            ...n.axon,
            synapses: _.concat(n.axon.synapses, { id: action.payload.synapseId })
          }
        };
      }
      return n;
    }),
  } else if (changeInputRate.test(action)) {
      return _.map(state, (input: InputState) => {
        if (input.id === action.payload.id) {
          return {
            ...input,
            rate: action.payload.rate
          };
        }
        return input;
      })
  } else if (addInput.test(action)) {
      return [
        ...state,
        {
          ...initialInputState,
          id: action.payload.id,
          pos: action.payload.pos,
          axon: {
            ...initialInputState.axon,
            id: action.payload.axonId
          }
        }
      ]
  } else if (removeInput.test(action)) {
      return _.differenceBy(state, [{ id: action.payload.id }], "id")
  } else if (moveInput.test(action)) {
      return state.map((n: InputState) => {
        if (n.id === action.payload.id) {
          return {
            ...n,
            ...action.payload
          };
        }
        return n;
      })
  } else if (changeInputHotkey.test(action)) {
      return _.map(state, (input: InputState) => {
        if (input.id == action.payload.id) {
          return {
            ...input,
            hotkey: action.payload.hotkey
          };
        }
        return input;
      })
  } else {
    return state
  }
}
