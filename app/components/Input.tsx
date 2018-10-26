import * as React from 'react'
import { remote } from 'electron'
import { RouteComponentProps } from 'react-router'
import { Point } from '../utils/geometry'
import { TimeInterval, Timer } from 'd3'
import { MoveInput, SelectInputAction } from '../actions/inputs'
import { AxonState } from '../reducers/neurons'
const { Menu } = remote
const d3 = require('d3')

export interface IProps extends RouteComponentProps<any> {
  addNewApToSynapse: (id: string) => void
  removeInput: (id: string) => void
  moveInput: (payload: MoveInput) => void
  tryMakeSynapseAtAxon: (id: string, neuronId: string) => void
  selectInput: (payload: SelectInputAction) => void
  id: string
  pos: Point
  axon: AxonState
  rate: number
}

export interface IState {
  selected: boolean
  interval?: Timer
}

export class Input extends React.Component<IProps, IState> {
  props: IProps
  state: IState = { selected: false, interval: undefined }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    if (this.state.selected !== prevState.selected) {
      this.renderD3()
    }
    if (this.props.rate !== prevProps.rate) {
      this.startFireRate()
    }
  }

  componentDidMount () {
    this.renderD3()
  }

  fire = () => {
    const { id, axon, addNewApToSynapse, selectInput } = this.props
    axon.synapses.forEach((s) => addNewApToSynapse(s.id))
  }

  handleInputClick (e: React.MouseEvent<SVGGElement>) {
    e.preventDefault()
    const { id, axon, addNewApToSynapse, selectInput } = this.props

    // axon.synapses.forEach((s) => fireSynapse({ id: s.id }))
    this.fire()
    selectInput({ id })
  }

  handleAxonClick (e: React.MouseEvent<SVGCircleElement>) {
    e.preventDefault()
    const { tryMakeSynapseAtAxon, id, pos, axon } = this.props

    tryMakeSynapseAtAxon(axon.id, id)
  }

  handleContextMenu (e: React.MouseEvent<SVGGElement>) {
    e.stopPropagation()
    e.preventDefault()
    const { removeInput, id } = this.props

    Menu.buildFromTemplate([
      {
        label: 'Remove input',
        click: () => removeInput(id)
      }
    ]).popup(remote.getCurrentWindow())
  }

  startFireRate () {
    const { rate } = this.props

    const { interval } = this.state

    if (interval) {
      interval.stop()
    }

    if (rate !== 0) {
      this.setState({
        interval: d3.interval(this.fire, 1000 * (1 / rate))
      })
    }
  }

  render () {
    const { pos, id, axon, rate } = this.props

    return (
      <g
        id={id}
        transform={'translate(' + pos.x + ' ' + pos.y + ')'}
        onContextMenu={this.handleContextMenu.bind(this)}
      >
        <g onClick={this.handleInputClick.bind(this)}>
          <rect fill='red' x={0} y={0} width={50} height={50} />
        </g>
        <circle
          cx={50}
          cy={0}
          r={5}
          onClick={this.handleAxonClick.bind(this)}
        />
      </g>
    )
  }

  setSelected = (val: boolean) => {
    this.setState({ selected: val })
  }

  onDragStarted = () => {
    this.setSelected(true)
  }

  onDragged = () => {
    const { id, pos, moveInput } = this.props

    const newPos: Point = {
      ...d3.event
    }

    moveInput({
      id,
      pos: newPos
    })
  }

  renderD3 () {
    const { id } = this.props

    const { selected } = this.state

    d3.select('#' + id)
      .classed('selected', selected)
      .call(
        d3
          .drag()
          .on('start', this.onDragStarted)
          .on('drag', this.onDragged)
      )
  }
}
