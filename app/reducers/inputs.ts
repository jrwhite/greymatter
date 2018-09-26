import { IAction } from "./../actions/helpers";
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
  state: Array<InputState> = initialInputState,
  action: IAction
): Array<InputState> {}
