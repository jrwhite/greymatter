import * as React from 'react'
import { Point } from '../utils/geometry'
import { DataSource, IProps as DataProps } from '../containers/DataSource'
import * as _ from 'lodash'
import { line } from 'd3'
const d3 = require('d3')

export interface IProps {
  children: React.ReactElement<DataProps>
  color?: string
  width: number
  height: number
  maxN: number
  //   domain: { start: number; stop: number }
  range: { start: number; stop: number }
}

export interface IState {
  pathData: number[]
  n: number
}

export class ScaledLine extends React.Component<IProps, IState> {
  props: IProps
  state: IState = { pathData: [], n: 0 }

  onChange = (newData: number) => {
    const { pathData, n } = this.state
    const { maxN } = this.props
    const newPathData = _.concat(pathData, newData)
    this.setState({
      pathData: n === maxN ? _.tail(newPathData) : newPathData,
      n: n < maxN ? n + 1 : n
    })
  }

  render () {
    const { color, maxN, width, height, range } = this.props
    const { pathData } = this.state

    const scaleX = d3
      .scaleLinear()
      .domain([0, maxN])
      .range([0, width])

    const scaleY = d3
      .scaleLinear()
      .domain([range.stop, range.start])
      .range([0, width])

    const lineSetter = d3
      .line()
      .x((d: number, i: number) => scaleX(i))
      .y((d: number) => scaleY(d))

    return (
      <g>
        <path
          fill='none'
          stroke={color ? color : 'red'}
          ref={(node) => d3.select(node).attr('d', lineSetter(pathData))}
        />
        {this.renderChildren()}
      </g>
    )
  }

  renderChildren () {
    return React.cloneElement(this.props.children, {
      onChange: this.onChange
    })
  }
}
