import { IAction } from '../actions/helpers';
import { selectNeuron } from '../actions/neurons';
import { selectInput } from '../actions/inputs';
import {
  pauseNetwork,
  resumeNetwork,
  speedUpNetwork,
  slowDownNetwork,
} from '../actions/config';

export interface ConfigState {
  selectedNeurons: Array<SelectedNeuronState>;
  selectedInputs: Array<SelectedInputState>;
  stepSize: number; // in ms,
  stepInterval: number;
  isPaused: boolean;
}

export interface SelectedNeuronState {
  id: string;
}

export interface SelectedInputState {
  id: string;
}

const initialConfigState = {
  selectedNeurons: [],
  selectedInputs: [],
  stepSize: 1,
  stepInterval: 50,
  isPaused: true,
};

export default function config(
  state: ConfigState = initialConfigState,
  action: IAction
): ConfigState {
  if (selectNeuron.test(action)) {
    return {
      ...state,
      selectedNeurons: [
        {
          id: action.payload.id,
        },
      ],
    };
  } else if (selectInput.test(action)) {
    return {
      ...state,
      selectedInputs: [
        {
          id: action.payload.id,
        },
      ],
    };
    // BEGIN VOID ACTIONS
  } else if (pauseNetwork.test(action)) {
    return {
      ...state,
      isPaused: true,
    };
  } else if (resumeNetwork.test(action)) {
    return {
      ...state,
      isPaused: false,
    };
  } else if (speedUpNetwork.test(action)) {
    return {
      ...state,
      stepInterval: state.stepInterval >= 20 ? state.stepInterval - 10 : 10,
    };
  } else if (slowDownNetwork.test(action)) {
    return {
      ...state,
      stepInterval: state.stepInterval + 10,
    };
  } else {
    return state;
  }
}
