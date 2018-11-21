import * as React from 'react'
import { GymState } from '../reducers/gym'
import { GraphLine, IProps as GraphLineProps } from './GraphLine'
import d3 = require('d3')

export interface IProps {
  children?:
    | Array<React.ReactElement<GraphLineProps>>
    | React.ReactElement<GraphLineProps>
  scaleX: number
  rangeX: number
  scaleY: number
  rangeY: { start: number; stop: number }
}

export class LineGraph extends React.Component<IProps> {
  props: IProps

  render () {
    const {
      children,
      scaleX, // unit pixels
      rangeX, // total number of values to store
      scaleY, // unit pixels
      rangeY // {start, stop} number e.g. -150% - 150%
    } = this.props

    const maxN = rangeX
    const height = (rangeY.stop - rangeY.start) * scaleY
    const scale = d3
      .scaleLinear()
      .domain([rangeY.stop, rangeY.start])
      .range([0, height])
    // .clamp(true)
    const axis = d3
      .axisLeft(scale)
      .ticks(5)
      .tickPadding(20) // have to add tick padding the left-oriented axis to work for some reason
    const lines = React.Children.map(
      children,
      (line: React.ReactElement<GraphLineProps>) =>
        React.cloneElement(line, {
          color: line.props.color ? line.props.color : 'red',
          deltaX: line.props.deltaX ? line.props.deltaX : scaleX,
          height: line.props.height ? line.props.height : height,
          maxN,
          rangeY: line.props.rangeY ? line.props.rangeY : rangeY
        })
    )

    const axisRef = (node: SVGGElement | null) =>
      d3
        .select(node)
        // .attr('transform', 'translate(0,0)')
        .call(axis)

    const padding = 5
    const paddingLeft = 40
    const paddingTop = 5

    return (
      <svg>
        <g transform={'translate(' + paddingLeft + ',' + paddingTop + ')'}>
          <g ref={axisRef} />
          {lines}
        </g>
      </svg>
    )
  }
}
