import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { render } from 'enzyme'
import { Button, Text, Slider, ControlGroup } from '@blueprintjs/core'
import { PotentialGraph } from './PotentialGraph'
import SelectedInput from '../containers/SelectedInput'
import SelectedNeuron from '../containers/SelectedNeuron'
import { SelectedNeuronState, SelectedInputState } from '../reducers/config'
import { LineGraph } from './LineGraph'
import { GraphLine } from './GraphLine'
import NeuronPotentialData from '../containers/NeuronPotentialData'
const d3 = require('d3')

const styles = require('./SideBar.scss')

export interface IProps {
  closeSelectedPanel?: () => void
  openSelectedPanel?: () => void
  selectedNeurons: SelectedNeuronState[]
  selectedInputs: SelectedInputState[]
}

export interface IState {
  figures: Object[]
}

const initialState: IState = {
  figures: []
}

export class SideBar extends React.Component<IProps, IState> {
  props: IProps
  state: IState = initialState

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
        {this.renderGraph()}
        {selectedNeuron}
        {selectedInput}
      </div>
    )
  }

  renderGraph () {
    const { selectedNeurons } = this.props

    const lines = selectedNeurons.map((n) => {
      return (
        <GraphLine key={n.id}>
          <NeuronPotentialData id={n.id} />
        </GraphLine>
      )
    })

    return (
      <LineGraph
        scaleX={3}
        rangeX={50}
        scaleY={0.4}
        rangeY={{ start: -300, stop: 100 }}
      >
        {lines}
      </LineGraph>
    )
  }
}
