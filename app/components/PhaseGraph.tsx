import * as React from 'react'
import * as _ from 'lodash'
import { removeListener } from 'cluster'
import { render } from 'enzyme'
import { DataSource, IProps as DataProps } from '../containers/DataSource'
import { GymObservationData } from '../containers/GymObservationData'
import { connect } from 'react-redux'
import { Point } from '../utils/geometry'

const d3 = require('d3')

/**
 * Children needs to be:
 * 1. potential data (Y-axis)
 * 2. phase data (X-axis)
 */

export interface IProps {
  children: Array<React.ReactElement<DataProps>>
  // children: React.ReactElement<DataProps>
  color?: string
  width: number
  height: number
  maxN: number
  rangeY: { start: number; stop: number }
  rangeX: { start: number; stop: number }
}

export interface IState {
  pathData: Point[]
  n: number
  newU?: number
  newV?: number
}

export class PhaseGraph extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {
    pathData: [],
    n: 0
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    const { maxN } = this.props
    const { pathData, n, newU, newV } = this.state
    if (newU && newV) {
      // console.log(newU)
      const newPathData = _.concat(pathData, { x: newU, y: newV })
      this.setState({
        pathData: n === maxN ? _.tail(newPathData) : newPathData,
        n: n < maxN ? n + 1 : n,
        newU: undefined,
        newV: undefined
      })
    }
  }

  // TODO: separate logic into buffered data holder if this logic isnt going to use d3

  onPotChange = (newData: number) => {
    this.setState({ newV: newData })
  }

  onRecChange = (newData: number) => {
    this.setState({ newU: newData })
  }

  // TODO: figure out how to use transition setter
  //   transitionSetter = d3
  //     .transition()
  //     .duration()
  //     .ease(d3.easeLinear)
  //     .on('end', this.shift)

  render () {
    const { color, rangeX, width, height, rangeY } = this.props

    const { pathData } = this.state

    const yScale = d3
      .scaleLinear()
      .domain([rangeY.stop, rangeY.start])
      .range([0, height])

    const xScale = d3
      .scaleLinear()
      .domain([rangeX.start, rangeX.stop])
      .range([0, width])

    const yAxis = d3.axisLeft(yScale).ticks(5)
    const xAxis = d3.axisTop(xScale).ticks(5)

    const deltaX = width / (rangeX.stop - rangeX.start)

    const lineSetter = d3
      .line()
      .x((d: Point, i: number) => xScale(d.x))
      .y((d: Point) => yScale(d.y))

    const padding = 30

    if (this.props.children.length < 2) return undefined

    const potentialData = React.cloneElement(this.props.children[0], {
      onChange: this.onPotChange
    })

    const recoveryData = React.cloneElement(this.props.children[1], {
      onChange: this.onRecChange
    })

    // console.log(pathData)
    return (
      <svg>
        <g transform={'translate(' + padding + ',' + padding + ')'}>
          {/* <g> */}
          <g ref={(node) => d3.select(node).call(xAxis)} />
          <g ref={(node) => d3.select(node).call(yAxis)} />
        </g>
        <g>
          <path
            fill='none'
            stroke='red'
            strokeWidth={2}
            ref={(node) => d3.select(node).attr('d', lineSetter(pathData))}
          />
          {potentialData}
          {recoveryData}
        </g>
      </svg>
    )
  }
}
