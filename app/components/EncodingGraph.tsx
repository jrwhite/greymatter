import * as React from 'react'
import { Point } from '../utils/geometry'
import { ControlPoint } from './ControlPoint'
import { Line } from './Line'
import { MoveControlPointAction } from '../actions/encodings'

const d3 = require('d3')

export interface IProps {
  moveControlPoint: (payload: MoveControlPointAction) => void
  controlPoints: Array<{ pos: Point; index: number }>
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
        .attr('transform', 'translate(0,0)')
        .call(axis)

    return (
      <svg>
        <g ref={axisRef} />
        {this.renderControlPoints()}
        {this.renderLines()}
      </svg>
    )
  }

  renderLines () {
    const { controlPoints } = this.props
    const line = { points: controlPoints.map((ctrl) => ctrl.pos) }
    return <Line line={line} />
  }

  renderControlPoints () {
    const { controlPoints } = this.props

    const moveCallback = (newPos: Point, index: number) => {}

    return (
      <g>
        {controlPoints.map((ctrl: any, i: number) => {
          <ControlPoint
            pos={ctrl.pos}
            moveCallback={(newPos: Point) => moveCallback(newPos, i)}
          />
        })}
      </g>
    )
  }
}
