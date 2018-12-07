import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import Neuron from '../containers/Neuron'
import { Point, addPoints } from '../utils/geometry'
import { remote } from 'electron'

import Synapse from '../containers/Synapse'
import Input from '../containers/Input'
import { GhostSynapse } from './GhostSynapse'
import Sidebar from '../containers/Sidebar'
import {
  Text,
  Button,
  ButtonGroup,
  HotkeysTarget,
  Hotkeys,
  Hotkey,
  EditableText,
  NumericInput,
  ControlGroup
} from '@blueprintjs/core'

import GymClient from '../containers/GymClient'
import { LowerBar } from './LowerBar'
import { GhostSynapseState } from '../reducers/ghostSynapse'
import { InputState } from '../reducers/inputs'
import { NeuronState } from '../reducers/neurons'
import { SynapseState } from '../reducers/synapses'
import {
  ConfigState,
  maxStepInterval,
  minStepInterval,
  minFps,
  maxFps
} from '../reducers/config'
import { NeuronPotentialData } from '../containers/NeuronPotentialData'
import { PotentiateNeuronAction } from '../actions/neurons'
import { SourcedDendValue } from '../selectors/neurons'
import {
  StepGymAction,
  setGymStepRatio,
  SetGymActionAction,
  SetGymStepRatioAction
} from '../actions/gym'
import { SetStepIntervalAction } from '../actions/config'
import { maxGymStepRatio, minGymStepRatio } from '../reducers/gym'
const { Menu } = remote
const d3 = require('d3')

const styles = require('./Network.scss')

export interface IProps extends RouteComponentProps<any> {
  addNewNeuron (pos: Point): void
  potentiateNeuron: (payload: PotentiateNeuronAction) => void
  addNewInput (pos: Point): void
  decayNetwork: () => void
  decayNeurons: () => void
  stepNetwork: () => void // izhik step
  stepGym: (payload: StepGymAction) => void
  pauseNetwork: () => void
  resumeNetwork: () => void
  speedUpNetwork: () => void
  slowDownNetwork: () => void
  setStepInterval: (payload: SetStepIntervalAction) => void
  setGymStepRatio: (payload: SetGymStepRatioAction) => void
  resetNetwork: () => void
  addNewApToSynapse: (id: string) => void
  ghostSynapse: GhostSynapseState
  inputs: InputState[]
  neurons: NeuronState[]
  synapses: SynapseState[]
  config: ConfigState
  sourcedDends: SourcedDendValue[]
  gymStepRatio: number
}

export interface IState {
  mouse: {
    pos: Point;
  }
  interval: any
  gymSteps: number
}

const initialState: IState = {
  mouse: {
    pos: { x: 0, y: 0 }
  },
  interval: Object,
  gymSteps: 0
}

@HotkeysTarget
export class Network extends React.Component<IProps, IState> {
  public props: IProps
  public state: IState = initialState

  public componentDidMount () {
    this.startRuntime()
  }

  public componentDidUpdate (prevProps: IProps, prevState: IState) {
    if (prevProps.config !== this.props.config) {
      this.restartRuntime()
    }
  }

  public onContextMenu (e: any) {
    e.preventDefault()
    const { addNewNeuron, addNewInput } = this.props
    const pos: Point = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }

    Menu.buildFromTemplate([
      {
        label: 'Add neuron',
        // click: () => addNeuron({key: _.uniqueId('n'), pos: poijknt})
        click: () => addNewNeuron(pos)
      },
      {
        label: 'Add input',
        click: () => addNewInput(pos)
      }
    ]).popup(remote.getCurrentWindow())
  }

  public handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault()
    const { mouse } = this.state

    const newPos = { x: e.clientX, y: e.clientY }
    this.setState({ mouse: { pos: newPos } })
  }

  public render () {
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
      setStepInterval,
      setGymStepRatio,
      gymStepRatio,
      config
    } = this.props

    // TODO: refactor ghostSynapse into separate component
    const axonNeuron = ghostSynapse.axon
      ? neurons.find((n) => n.id === ghostSynapse.axon!!.neuronId)
      : undefined
    const dendNeuron = ghostSynapse.dend
      ? neurons.find((n) => n.id === ghostSynapse.dend!!.neuronId)
      : undefined

    // console.log('network rerender')

    return (
      <div className={styles['container-top']}>
        <div className={styles['wrapper-upper']}>
          <div className={styles['container-upper']}>
            <div className={styles.sidebar}>
              <Sidebar />
            </div>
            {/* { config.isPaused ? <GymClient /> : undefined }  */}
            <div className={styles['wrapper-editor']}>
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
                          pos: addPoints(
                              axonNeuron.pos,
                              axonNeuron.axon.cpos
                            )
                        }
                        : undefined
                    }
                    dend={
                      dendNeuron
                        ? {
                          pos: addPoints(
                              dendNeuron.pos,
                              dendNeuron.dends.find(
                                (d) => d.id === ghostSynapse.dend!!.id
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
                  <Neuron key={neuron.id} id={neuron.id} />
                ))}
                {synapses.map((synapse: SynapseState) => (
                  <Synapse key={synapse.id} {...synapse} />
                ))}
              </svg>
              {/* <Text className={styles.overlay}>Overlay</Text> */}
              <div className={styles.overlay}>
                <ControlGroup className={styles.overlay}>
                  {' '}
                  {/* <ButtonGroup minimal={true} className={styles.overlay}> */}
                  <Button icon='fast-backward' onClick={slowDownNetwork} />
                  <Button
                    icon={config.isPaused ? 'play' : 'pause'}
                    onClick={config.isPaused ? resumeNetwork : pauseNetwork}
                  />
                  <Button icon='fast-forward' onClick={speedUpNetwork} />
                  <Button icon='refresh' onClick={resetNetwork} />
                  {/* </ButtonGroup> */}
                  <NumericInput
                    style={{ maxWidth: '40px' }}
                    max={maxFps}
                    min={minFps}
                    onValueChange={(value) =>
                      setStepInterval({
                        stepInterval: Math.round(1000 / value)
                      })
                    }
                    value={Math.round(1000 / config.stepInterval)}
                    stepSize={5}
                  />
                  <NumericInput
                    style={{ maxWidth: '40px' }}
                    max={maxGymStepRatio}
                    min={minGymStepRatio}
                    onValueChange={(value) =>
                      setGymStepRatio({
                        stepRatio: value
                      })
                    }
                    value={gymStepRatio}
                    stepSize={5}
                  />
                </ControlGroup>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['wrapper-lower']}>
          <div className={styles.lowerbar}>
            <LowerBar />
          </div>
        </div>
      </div>
    )
  }

  public renderHotkeys () {
    const { inputs, addNewApToSynapse } = this.props

    return (
      <Hotkeys>
        {inputs.map((input: InputState) =>
          input.hotkey ? (
            <Hotkey
              label={'fire input ' + input.id}
              global={false}
              combo={input.hotkey}
              onKeyDown={() =>
                input.axon.synapses.forEach((s) => addNewApToSynapse(s.id))
              }
            />
          ) : (
            undefined
          )
        )}
      </Hotkeys>
    )
  }

  // TODO: refactor this into a runtime container. also maybe put runtime controls in runtime component
  stepSourcedDends () {
    const { potentiateNeuron, sourcedDends } = this.props
    if (sourcedDends === undefined) return
    sourcedDends.forEach((d) =>
      potentiateNeuron({ id: d.neuronId, change: d.value })
    )
  }

  public startRuntime () {
    const { decayNeurons, gymStepRatio, config, stepGym } = this.props
    let gymSteps = 0

    const step = () => {
      // decayNetwork()
      if (gymSteps++ > gymStepRatio) {
        gymSteps = 0
        stepGym({ shouldStep: true })
      }
      decayNeurons()
      this.stepSourcedDends()
    }
    const interval = d3.interval(step, config.stepInterval)
    this.setState({ interval })
    if (config.isPaused) {
      interval.stop()
    }
  }

  public restartRuntime () {
    const { config, decayNeurons, gymStepRatio, stepGym } = this.props
    let gymSteps = 0
    const { interval } = this.state
    const step = () => {
      if (gymSteps++ > gymStepRatio) {
        gymSteps = 0
        stepGym({ shouldStep: true })
      }
      decayNeurons()
      this.stepSourcedDends()
    }
    if (config.isPaused) {
      interval.stop()
    } else {
      // interval.restart(step, config.stepInterval)
      interval.stop()
      const newInterval = d3.interval(step, config.stepInterval)
      this.setState({ interval: newInterval })
    }
  }
}
