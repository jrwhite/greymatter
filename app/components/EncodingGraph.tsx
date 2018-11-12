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
    const { rangeY, width, height } = this.props

    const scale = d3
      .scaleLinear()
      .domain([rangeY.stop - rangeY.start])
      .range([0, height])

    const axis = d3.axisRight(scale).ticks(10)

    const axisRef = (node: SVGGElement | null) =>
      d3
        .select(node)
        // .attr('transform', 'translate(0,0)')
        .call(axis)

    return (
      <svg>
        {/* <g ref={axisRef} /> */}
        {this.renderControlPoints()}
        {this.renderLines()}
      </svg>
    )
  }
  scaleX = (x: number) => {
    const { rangeX, width } = this.props
    return ((x - rangeX.start) / (rangeX.stop - rangeX.start)) * width
  }
  scaleY = (y: number) => {
    const { rangeY, height } = this.props
    return ((y - rangeY.start) / (rangeY.stop - rangeY.start)) * height
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

    const invScaleX = (x: number) => {
      return rangeX.start + (x / width) * (rangeX.stop - rangeX.start)
    }
    const invScaleY = (y: number) => {
      return rangeY.start + (y / height) * (rangeY.stop - rangeY.start)
    }

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
            scaleX={this.scaleX}
            scaleY={this.scaleY}
            pos={{ x: this.scaleX(ctrl.pos.x), y: this.scaleY(ctrl.pos.y) }}
            moveCallback={(newPos: Point) => moveCallback(newPos, i)}
          />
        ))}
      </g>
    )
  }
}
