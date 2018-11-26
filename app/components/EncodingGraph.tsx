import * as React from 'react'
import { Point, Curve } from '../utils/geometry'
import { ControlPoint } from './ControlPoint'
import { Line } from './Line'
import { MoveControlPointAction } from '../actions/encodings'
import { ControlPointState } from '../reducers/encodings'
import { IProps as IIProps } from '../containers/EncodingGraph'
import * as _ from 'lodash'

const d3 = require('d3')

export interface IProps extends IIProps {
  moveControlPoint: (payload: MoveControlPointAction) => void
  controlPoints: ControlPointState[]
  color?: string
  width: number
  rangeX: { start: number; stop: number }
  height: number
  rangeY: { start: number; stop: number }
}

export class EncodingGraph extends React.Component<IProps> {
  props: IProps

  render () {
    const { rangeX, rangeY, width, height } = this.props

    const yAxisScale = d3
      .scaleLinear()
      .domain([rangeY.stop, rangeY.start])
      .range([0, height])

    const xAxisScale = d3
      .scaleLinear()
      .domain([rangeX.stop, rangeX.start])
      .range([0, width])

    const yAxis = d3.axisLeft(yAxisScale).ticks(5)
    const xAxis = d3.axisBottom(xAxisScale).ticks(8)

    const axisRef = (node: SVGGElement | null) =>
      d3
        .select(node)
        // .attr('transform', 'translate(' + width + ',' + height + ')')
        .call(yAxis)
        .call(xAxis)

    const xAxisRef = (node: SVGGElement | null) =>
      d3
        .select(node)
        .attr('transform', 'translate(' + '0' + ',' + height + ')')
        .call(xAxis)

    const yAxisRef = (node: SVGGElement | null) =>
      d3
        .select(node)
        // .attr('transform', 'translate(' + '10' + ',' + '0' + ')')
        .call(yAxis)

    const padding = 30

    return (
      <svg width={width + padding * 2} height={height + padding * 2}>
        <g transform={'translate(' + padding + ',' + padding + ')'}>
          {/* <g ref={axisRef} /> */}
          <g ref={yAxisRef} />
          <g ref={xAxisRef} />
          {/* <g
          ref={(node) =>
            d3
              .select(node)
              .call(yAxis)
              .call(xAxis)
          }
        /> */}
          {this.renderControlPoints()}
          {this.renderLines()}
        </g>
      </svg>
    )
  }
  scaleX = (x: number) => {
    const { rangeX, width } = this.props
    return width - ((x - rangeX.start) / (rangeX.stop - rangeX.start)) * width
  }
  scaleY = (y: number) => {
    const { rangeY, height } = this.props
    return (
      height - ((y - rangeY.start) / (rangeY.stop - rangeY.start)) * height
    )
  }

  renderLines () {
    const { controlPoints, rangeX, rangeY, width, height } = this.props

    const line: Curve = {
      points: _.map(controlPoints, (ctrl) => ctrl.pos)
    }
    // return <Line line={line} />

    const lineSetter = d3
      .line()
      .x((d: ControlPointState) => this.scaleX(d.pos.x))
      .y((d: ControlPointState) => this.scaleY(d.pos.y))
    if (controlPoints === undefined) return null
    return (
      <g>
        <path
          fill='none'
          stroke='red'
          ref={(node) => d3.select(node).attr('d', lineSetter(controlPoints))}
        />
      </g>
    )
  }

  renderControlPoints () {
    const {
      id,
      controlPoints,
      moveControlPoint,
      rangeX,
      rangeY,
      height,
      width
    } = this.props

    // const invScaleX = (x: number) => {
    //   return (
    //     rangeX.start + ((width - x) / width) * (rangeX.stop - rangeX.start)
    //   )
    // }
    const invScaleX = d3
      .scaleLinear()
      .domain([0, width])
      .range([rangeX.stop, rangeX.start])
    // const invScaleY = (y: number) => {
    //   return (
    //     rangeY.start + ((height - y) / height) * (rangeY.stop - rangeY.start)
    //   )
    // }
    const invScaleY = d3
      .scaleLinear()
      .domain([0, height])
      .range(rangeY.stop, rangeY.start)

    const moveCallback = (newPos: Point, index: number) => {
      moveControlPoint({
        index,
        encodingId: id,
        newPos: { x: invScaleX(newPos.x), y: invScaleY(newPos.y) }
      })
    }

    if (controlPoints === undefined) return null

    return (
      <g>
        {controlPoints.map((ctrl: ControlPointState, i: number) => (
          <ControlPoint
            // scaleX={this.scaleX}
            // scaleY={this.scaleY}
            pos={{ x: this.scaleX(ctrl.pos.x), y: this.scaleY(ctrl.pos.y) }}
            moveCallback={(newPos: Point) => moveCallback(newPos, i)}
          />
        ))}
      </g>
    )
  }
}
