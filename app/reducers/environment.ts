import { ControlPointState } from './encodings'
import { NeuronState } from './neurons';

export enum EnvType {
  Free,
  Test,
  Gym
}

export interface EnvState {
  type: EnvType
  steps: number
  stepTime: number
  maxSteps: number
  isPaused: boolean
  resetNeurons: NeuronState[]
  testInputs: { [id: string]: object }
}

export interface TestInput {
  data: number[] // step series data
  id: string
  name: string
  value: number
  controlPoints: ControlPointState[]
}
