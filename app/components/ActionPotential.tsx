import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import {
  Point,
  getLineVector,
  vectorScalarMultiply,
  addPoints
} from '../utils/geometry'
import * as _ from 'lodash'
import Axios from 'axios'
import { IIProps } from '../containers/ActionPotential'
const d3 = require('d3')

export interface IProps extends IIProps {
  id: string
  synapseId: string
  finishFiringApOnSynapse: Function
  type: string // inhib / excit
  start: Point
  stop: Point
  speed: number
  length: number
}

export interface IState {
  started: boolean
  progress: number
}

export class ActionPotential extends React.Component<IProps, IState> {
  props: IProps
  state: IState = { progress: 0, started: false }

  componentDidMount () {
    // this.setState({ started: true })
    this.renderD3()
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    // if (!this.state.started && prevState.started) {
    // this.renderD3()
    // }
  }

  componentWillUpdate () {
    const { id } = this.props
    d3.select('#' + id).interrupt()
    console.log(this.state.progress)
  }

  // shouldComponentUpdate (prevProps: IProps, prevState: IState) {
  //   // if (this.state.startAnimation) {
  //   //   return false
  //   // }
  //   // return true
  //   return false
  // }

  componentWillUnmount () {
    const { finishFiringApOnSynapse, id, synapseId } = this.props
    console.log('unmount')
    // finishFiringApOnSynapse(id, synapseId)
  }

  // componentDidMount () {
  //   this.renderD3()
  // }

  // ref = React.createRef<SVGCircleElement>()

  render () {
    const {
      id,
      type,
      start,
      stop,
      finishFiringApOnSynapse,
      synapseId
    } = this.props
    const { progress, started } = this.state
    console.log('render')
    const pos: Point = addPoints(
      start,
      vectorScalarMultiply(getLineVector({ start, stop }), progress)
    )
    return (
      <g>
        <circle
          // ref={this.ref}
          id={id}
          cx={pos.x}
          cy={pos.y}
          r={5}
          fill='white'
        />
      </g>
    )
  }

  renderD3 () {
    console.log('renderD3')
    const {
      finishFiringApOnSynapse,
      stop,
      speed,
      length,
      id,
      synapseId
    } = this.props

    const { started, progress } = this.state
    // console.log(startAnimation)

    let prog = 0

    const transitionSetter = d3
      .transition()
      // .duration(length / speed)
      .duration(3000)
      // .ease(d3.easeLinear)
      // DONT DELETE THIS
      // might be useful
      // .attrTween("transform", translateAlong(linePath.node()))
      .attrTween('fire', (d: any) => {
        return (t: number) => {
          // console.log(t)
          prog = t
          // this.setState({ progress: t })
        }
      })
      .on('end', () => finishFiringApOnSynapse(id, synapseId))
      // .on('interrupt', () => finishFiringApOnSynapse(id, synapseId))
      .on('interrupt', (d: any) => {
        console.log('interrupted')
        // set cx, cy to current position from progress?
        this.setState({ started: false, progress: prog })
        // restart the renderD3
        // this.renderD3()
      })

    d3.select('#' + id)
      // .select(this.ref)
      .transition(transitionSetter)
      .attr('cx', stop.x)
      .attr('cy', stop.y)
      .call(() => console.log('call'))
    // .call(() => this.setState({ started: true }))
    // .remove()
  }
}
