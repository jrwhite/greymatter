import * as React from 'react'
import { ControlPointState } from '../reducers/encodings'
import { Curve, Point } from '../utils/geometry'
import * as _ from 'lodash'
import { ControlPoint } from './ControlPoint'
import { MoveTestCtrlPointAction } from '../actions/testInputs'
import { IIProps } from '../containers/TestInputGraph'

const d3 = require('d3')

export interface IProps extends IIProps {
  moveTestCtrlPoint: (payload: MoveTestCtrlPointAction) => void
  width: number
  height: number
  rangeY: { start: number; stop: number }
  rangeX: { start: number; stop: number }
  id: string
  controlPoints: ControlPointState[]
}

export class TestInputGraph extends React.Component<IProps> {
  props: IProps

  render () {
    const { width, height } = this.props

    return <g>{this.renderLines()}</g>
  }

  makeScaleX () {
    const { rangeX, width } = this.props
    const scale = d3
      .scaleLinear()
      .domain([rangeX.start, rangeX.stop])
      .range([0, width])
    return scale
  }

  makeScaleY () {
    const { rangeY, height } = this.props
    const scale = d3
      .scaleLinear()
      .domain([rangeY.stop, rangeY.start])
      .range([0, height])
    return scale
  }

  renderLines () {
    const { controlPoints } = this.props

    const scaleX = this.makeScaleX()
    const scaleY = this.makeScaleY()

    const lineSetter = d3
      .line()
      .x((d: ControlPointState) => scaleX(d.pos.x))
      .y((d: ControlPointState) => scaleY(d.pos.y))
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
      moveTestCtrlPoint,
      rangeX,
      rangeY,
      height,
      width
    } = this.props

    const invScaleX = d3
      .scaleLinear()
      .domain([0, width])
      .range([rangeX.start, rangeX.stop])

    const invScaleY = d3
      .scaleLinear()
      .domain([0, height])
      .range([rangeY.stop, rangeY.start])

    const moveCallback = (newPos: Point, index: number) => {
      moveTestCtrlPoint({
        index,
        id,
        newPos: { x: invScaleX(newPos.x), y: invScaleY(newPos.y) }
      })
    }

    if (controlPoints === undefined) return null

    const scaleX = this.makeScaleX()
    const scaleY = this.makeScaleY()

    return (
      <g>
        {controlPoints.map((ctrl: ControlPointState, i: number) => (
          <ControlPoint
            // scaleX={this.scaleX}
            // scaleY={this.scaleY}
            pos={{ x: scaleX(ctrl.pos.x), y: scaleY(ctrl.pos.y) }}
            moveCallback={(newPos: Point) => moveCallback(newPos, i)}
          />
        ))}
      </g>
    )
  }
}
