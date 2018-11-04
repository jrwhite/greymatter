import * as React from 'react'
import { Point } from '../utils/geometry'
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
    const line = {
      points: _.map(controlPoints, (ctrl) => ctrl.pos)
    }
    return <Line line={line} />
  }

  renderControlPoints () {
    const { controlPoints } = this.props

    const moveCallback = (newPos: Point, index: number) => {}

    return (
      <g>
        {controlPoints !== undefined
          ? _.map(controlPoints, (ctrl: ControlPointState, i: number) => {
            <ControlPoint
                pos={ctrl.pos}
                moveCallback={(newPos: Point) => moveCallback(newPos, i)}
              />
          })
          : undefined}
      </g>
    )
  }
}
