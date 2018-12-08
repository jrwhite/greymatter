import * as React from 'react'
import { RouteComponentProps, StaticRouter } from 'react-router'
import { Ellipse } from './Ellipse'
import { Point, calcAxonPos, Ellipse as EllipseGeo } from '../utils/geometry'
import { Rotate } from './Rotate'

import Draggable from 'react-draggable'
import { NeuronBody } from './NeuronBody'
import { Dendrite } from './Dendrite'
import { Soma } from './Soma'
import { remote } from 'electron'
import { Popover, Text, Button, Position } from '@blueprintjs/core'
import { PotentialGraph } from './PotentialGraph'
import { PotentialGraphLine } from './PotentialGraphLine'
import {
  MoveNeuronAction,
  RotateNeuronAction,
  fireVolumeNeuron,
  FireNeuronAction
} from '../actions/neurons'
import { SelectNeuronAction } from '../actions/config'
import { AxonState, DendState, AxonType } from '../reducers/neurons'
import { IIProps } from '../containers/Neuron'
import NeuronOverlay from '../containers/NeuronOverlay'
// import { PotentialGraphLine } from "./PotentialGraphLine"
const { Menu } = remote
const d3 = require('d3')

export const potGreyScale = d3
  .scaleLinear()
  .domain([-300, 100])
  .range([0.8, 0.4])

export interface IProps extends IIProps {
  fireNeuron: (payload: FireNeuronAction) => void
  fireVolumeNeuron: () => void
  addNewApToSynapse: (id: string) => void
  removeNeuron: (id: string) => void
  moveNeuron: (payload: MoveNeuronAction) => void
  tryMakeSynapseAtAxon: (id: string, neuronId: string) => void
  tryMakeSynapseAtNewDend: (
    neuronId: string,
    neuronPos: Point,
    bodyEllipse: EllipseGeo
  ) => void
  selectNeuron: (payload: SelectNeuronAction) => void
  rotateNeuron: (payload: RotateNeuronAction) => void
  recalcAllDends: () => void
  id: string
  pos: Point
  theta: number
  axon: AxonState
  dends: DendState[]
  potential: number
  isSelected: boolean
}

export interface IState {
  dragging: boolean
  pos: Point
  offset: Point
}

export class Neuron extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {
    dragging: false,
    pos: { x: 100, y: 100 },
    offset: { x: 0, y: 0 }
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    if (this.state.dragging !== prevState.dragging) {
      this.renderD3()
    }
  }

  componentDidMount () {
    this.renderD3()
  }

  shouldComponentUpdate (nextProps: IProps, nextState: IState) {
    return !nextState.dragging
  }

  handleNeuronClick (e: React.MouseEvent<SVGGElement>) {
    e.preventDefault()
    const {
      tryMakeSynapseAtNewDend,
      id,
      selectNeuron,
      pos,
      theta
    } = this.props
    // const { pos } = this.state

    tryMakeSynapseAtNewDend(id, pos, {
      major: 50,
      minor: 30,
      theta,
      ecc: 5 / 3
    })
    selectNeuron({ id })
  }

  handleAxonClick (e: React.MouseEvent<SVGCircleElement>) {
    e.preventDefault()
    const { tryMakeSynapseAtAxon, id, axon } = this.props

    tryMakeSynapseAtAxon(axon.id, id)
  }

  handleContextMenu (e: React.MouseEvent<SVGGElement>) {
    e.stopPropagation()
    e.preventDefault()
    const { removeNeuron, id } = this.props

    Menu.buildFromTemplate([
      {
        label: 'Remove neuron',
        click: () => removeNeuron(id)
      }
    ]).popup(remote.getCurrentWindow())
  }

  ref: React.RefObject<SVGGElement> = React.createRef()

  render () {
    const {
      fireNeuron,
      fireVolumeNeuron,
      addNewApToSynapse,
      rotateNeuron,
      theta,
      id,
      pos,
      axon,
      dends,
      potential,
      isSelected
    } = this.props

    const { dragging } = this.state

    if (potential >= 100) {
      fireNeuron({ id, axonType: axon.type })
      if (axon.type === AxonType.Volume) fireVolumeNeuron()
      axon.synapses.forEach((s) => addNewApToSynapse(s.id))
    }

    console.log('neuron rerender')

    const axonPos: Point = calcAxonPos({
      major: 50,
      minor: 30,
      theta,
      ecc: 5 / 3
    })

    return (
      <g
        id={id}
        ref={this.ref}
        transform={'translate(' + pos.x + ' ' + pos.y + ')'}
        onContextMenu={this.handleContextMenu.bind(this)}
      >
        <g
          onClick={this.handleNeuronClick.bind(this)}
          fill={d3.interpolateGreys(potGreyScale(potential))}
        >
          <NeuronBody id={id} dends={dends} theta={theta} />
          {/* <Soma potential={potential} id={id} theta={theta} /> */}
        </g>
        <circle
          cx={axonPos.x}
          cy={axonPos.y}
          r={5}
          onClick={this.handleAxonClick.bind(this)}
        />
        {isSelected ? <NeuronOverlay id={id} axon={axon} /> : undefined}
      </g>
    )
  }

  onDragStarted = () => {
    const { pos } = this.props
    const { offset } = this.state
    const mousePos: Point = {
      ...d3.event
    }
    this.setState({
      dragging: true,
      offset: { x: pos.x - mousePos.x, y: pos.y - mousePos.y }
    })
  }

  onDragged = () => {
    const { id, moveNeuron } = this.props

    const { offset } = this.state

    const newPos: Point = {
      ...d3.event
    }

    d3.select(this.ref.current)
      // .transition()
      // .duration(10)
      .attr(
        'transform',
        'translate(' + (newPos.x + offset.x) + ',' + (newPos.y + offset.y) + ')'
      )
    // .on('end', () => moveNeuron({ id, pos: newPos }))
    moveNeuron({
      id,
      pos: { x: newPos.x + offset.x, y: newPos.y + offset.y }
    })
    // this.setState({ pos: newPos })
  }

  onDragEnded = () => {
    const { id, moveNeuron, recalcAllDends } = this.props
    const { pos, offset } = this.state
    this.setState({ dragging: false })
    const newPos: Point = {
      ...d3.event
    }
    moveNeuron({
      id,
      pos: { x: newPos.x + offset.x, y: newPos.y + offset.y }
    })
    recalcAllDends()
  }

  renderD3 () {
    const { id } = this.props

    const { dragging } = this.state

    d3.select(this.ref.current)
      .classed('dragging', dragging)
      .call(
        d3
          .drag()
          .on('start', this.onDragStarted)
          .on('drag', this.onDragged)
          .on('end', this.onDragEnded)
      )
  }
}
