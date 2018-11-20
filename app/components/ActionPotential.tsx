import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import {
  Point,
  addPoints,
  vectorScalarMultiply,
  getLineVector
} from '../utils/geometry'
import * as _ from 'lodash'
import Axios from 'axios'
import { IIProps } from '../containers/ActionPotential'
import { SetApProgressAction } from '../actions/synapses'
const d3 = require('d3')

export interface IProps extends IIProps {
  finishFiringApOnSynapse: Function
  removeApFromSynapse: Function
  addNewApToSynapse: Function
  setApProgress: (payload: SetApProgressAction) => void
  id: string
  synapseId: string
  type: string // inhib / excit
  start: Point
  stop: Point
  progress: number
  speed: number
  length: number
}

export interface IState {
  isAnimating: boolean
  animationProgress: number
}

export class ActionPotential extends React.Component<IProps, IState> {
  props: IProps
  state: IState = { isAnimating: false, animationProgress: 0 }

  componentDidMount () {
    // this.setState({ startAnimation: true })
    this.renderD3(0)
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    // if (this.state.isAnimating && !prevState.isAnimating) {
    // console.log(prevState)
    // console.log(this.state)
    // if (!this.state.isAnimating) {
    // this.renderD3(0)
    // }
    this.renderD3(0)
  }

  // shouldComponentUpdate (nextProps: IProps, nextState: IState) {
  //   if (nextState.isAnimating === false) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  componentWillUpdate (nextProps: IProps, nextState: IState) {
    // d3.select('#' + this.props.id).interrupt()
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
    // console.log('unmount')
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
      synapseId,
      progress
    } = this.props
    // console.log('render')

    const pos: Point = addPoints(
      start,
      vectorScalarMultiply(getLineVector({ start, stop }), progress)
    )

    // d3.select('#' + id).interrupt()
    return (
      <g>
        <circle
          // ref={this.ref}
          onClick={() => this.renderD3(0)}
          id={id}
          cx={pos.x}
          cy={pos.y}
          r={5}
          fill='white'
        />
        {/* {this.renderD3()} */}
      </g>
    )
  }

  getProgress () {
    return this.state.animationProgress
  }

  renderD3 (depth: number) {
    const steps = 50
    // console.log('renderD3')
    // console.log(depth)
    const {
      finishFiringApOnSynapse,
      removeApFromSynapse,
      setApProgress,
      addNewApToSynapse,
      start,
      stop,
      speed,
      length,
      id,
      synapseId,
      progress
    } = this.props

    const { isAnimating, animationProgress } = this.state
    // console.log(isAnimating)

    const nextPos: Point = addPoints(
      start,
      vectorScalarMultiply(getLineVector({ start, stop }), progress + 0.1)
    )

    // console.log(length / speed)
    const duration = length / speed
    const transitionSetter = d3
      .transition(id)
      .duration(duration / steps)
      // .duration(3000 - progress * 3000)
      // .duration(1000 / steps)
      .ease(d3.easeLinear)
      // .ease(d3.easeLinear)
      // DONT DELETE THIS
      // might be useful
      // .attrTween("transform", translateAlong(linePath.node()))
      // .attrTween('fire', (d: any) => {
      //   return (t: number) => {
      // console.log(t)
      // this.setState({ animationProgress: t })
      // this fucking sucks. why am i using react redux for this shit
      // react and d3 are fucking terrible together ughhhhh
      // RIP application performance
      //     setApProgress({ id, synapseId, progress: t })
      //   }
      // })
      // .on('end', () => finishFiringApOnSynapse(id, synapseId))
      .on('end', () => {
        if (progress >= 1 - 1 / steps) {
          finishFiringApOnSynapse(id, synapseId)
        } else {
          setApProgress({ id, synapseId, progress: progress + 1 / steps })
        }
      })
      .on('interrupt', () => {
        // finishFiringApOnSynapse(id, synapseId)
        // console.log('interrupt')
        // removeApFromSynapse({ id, synapseId })
        // addNewApToSynapse({ id, synapseId, progress })
        // console.log(animationProgress)
        // this.setState({ isAnimating: false })
        // this.renderD3(depth + 1)
        // setApProgress({ id, synapseId, progress: this.getProgress() })
      })
    // .on('end', () => console.log('finish'))

    // console.log(d3.selectAll('#' + id))

    d3.select('#' + id)
      // .select(this.ref)
      // .interrupt()
      .transition(transitionSetter)
      .attr('cx', nextPos.x)
      .attr('cy', nextPos.y)
    // .call(() => console.log('call'))
    // .remove()

    // this.setState({ isAnimating: true })

    return null
  }
}
