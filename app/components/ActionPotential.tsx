import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Point } from '../utils/geometry'
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
  startAnimation: boolean
}

export class ActionPotential extends React.Component<IProps, IState> {
  props: IProps
  state: IState = { startAnimation: false }

  componentDidMount () {
    // this.setState({ startAnimation: true })
    this.renderD3()
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    if (this.state.startAnimation && !prevState.startAnimation) {
      this.renderD3()
    }
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
    const { id, type, start, finishFiringApOnSynapse, synapseId } = this.props
    console.log('render')
    return (
      <g>
        <circle
          // ref={this.ref}
          id={id}
          cx={start.x}
          cy={start.y}
          r={5}
          fill='white'
        />
        {/* {this.renderD3()} */}
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

    const { startAnimation } = this.state
    // console.log(startAnimation)

    const transitionSetter = d3
      .transition()
      // .duration(length / speed)
      .duration(3000)
      // .ease(d3.easeLinear)
      // DONT DELETE THIS
      // might be useful
      // .attrTween("transform", translateAlong(linePath.node()))
      .on('end', () => finishFiringApOnSynapse(id, synapseId))
      .on('interrupt', () => finishFiringApOnSynapse(id, synapseId))
    // .on('end', () => console.log('finish'))

    d3.select('#' + id)
      // .select(this.ref)
      .transition(transitionSetter)
      .attr('cx', stop.x)
      .attr('cy', stop.y)
      .call(() => console.log('call'))
    // .remove()

    return null
  }
}
