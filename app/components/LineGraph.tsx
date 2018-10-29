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
    const axis = d3.axisRight(scale).ticks(5)