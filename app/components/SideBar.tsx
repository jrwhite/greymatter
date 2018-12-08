import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { render } from 'enzyme'
import {
  Button,
  Text,
  Slider,
  ControlGroup,
  Tabs,
  Tab
} from '@blueprintjs/core'
import { PotentialGraph } from './PotentialGraph'
import SelectedInput from '../containers/SelectedInput'
import SelectedNeuron from '../containers/SelectedNeuron'
import { SelectedNeuronState, SelectedInputState } from '../reducers/config'
import { LineGraph } from './LineGraph'
import { GraphLine } from './GraphLine'
import NeuronPotentialData from '../containers/NeuronPotentialData'
import NeuronRecoveryData from '../containers/NeuronRecoveryData'
import { PhaseGraph } from './PhaseGraph'
const d3 = require('d3')

const styles = require('./SideBar.scss')

export interface IProps {
  closeSelectedPanel?: () => void
  openSelectedPanel?: () => void
  selectedNeurons: SelectedNeuronState[]
  selectedInputs: SelectedInputState[]
}

export interface IState {
  selectedGraphTabId: string
}

export class SideBar extends React.Component<IProps, IState> {
  props: IProps
  state: IState = { selectedGraphTabId: 'time' }

  render () {
    const { selectedNeurons, selectedInputs } = this.props

    const neuronGraphLines = selectedNeurons.map((neuron) => {})

    const selectedNeuron =
      selectedNeurons.length > 0 ? (
        <SelectedNeuron id={selectedNeurons[0].id} />
      ) : (
        undefined
      )
    const selectedInput =
      selectedInputs.length > 0 ? (
        <SelectedInput id={selectedInputs[0].id} />
      ) : (
        undefined
      )

    return (
      <div className={styles.container}>
        {this.renderGraphs()}
        {selectedNeuron}
        {selectedInput}
      </div>
    )
  }

  renderTimeGraph () {
    const { selectedNeurons } = this.props

    const potLines = selectedNeurons.map((n) => {
      return (
        <GraphLine key={n.id}>
          <NeuronPotentialData id={n.id} />
        </GraphLine>
      )
    })

    // recovery graph lines
    const recLines = selectedNeurons.map((n) => {
      return (
        <GraphLine key={n.id}>
          <NeuronRecoveryData id={n.id} />
        </GraphLine>
      )
    })
    return (
      <LineGraph
        scaleX={3 / 4}
        rangeX={200}
        scaleY={0.4}
        rangeY={{ start: -300, stop: 100 }}
      >
        {potLines}
        {/* {recLines} */}
      </LineGraph>
    )
  }

  renderPhaseGraph () {
    const { selectedNeurons } = this.props
    if (selectedNeurons.length === 0) return undefined
    const n = selectedNeurons[0]
    return (
      <PhaseGraph
        width={100}
        height={100}
        maxN={50}
        rangeX={{ start: -20, stop: -10 }}
        rangeY={{ start: -300, stop: 100 }}
      >
        <NeuronPotentialData id={n.id} />
        <NeuronRecoveryData id={n.id} />
      </PhaseGraph>
    )
  }

  renderGraphs () {
    const { selectedGraphTabId } = this.state

    return (
      <Tabs
        id='selectedGraphTab'
        onChange={(id: string) => this.setState({ selectedGraphTabId: id })}
      >
        <Tab id='time' title='Time-Domain' panel={this.renderTimeGraph()} />
        <Tab id='phase' title='Phase-Domain' panel={this.renderPhaseGraph()} />
      </Tabs>
    )
  }
}
