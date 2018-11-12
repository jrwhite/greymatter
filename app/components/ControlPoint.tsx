import * as React from 'react'
import { Point } from '../utils/geometry'
import * as _ from 'lodash'

const d3 = require('d3')

export interface IProps {
  moveCallback: (newPos: Point) => void
  scaleX: (x: number) => number
  scaleY: (y: number) => number
  pos: Point
}

export class ControlPoint extends React.Component<IProps> {
  props: IProps

  render () {
    const { pos } = this.props

    return (
      <g
        transform={'translate(' + pos.x + ' ' + pos.y + ')'}
        ref={(node: SVGGElement) => this.renderD3(node)}
      >
        <circle r={10} fill='red' />
      </g>
    )
  }

  onDragStarted = () => {}

  onDragged = () => {
    const { moveCallback } = this.props

    const newPos: Point = {
      ...d3.event
    }

    moveCallback(newPos)
  }

  renderD3 (ref: SVGGElement) {
    d3.select(ref).call(
      d3
        .drag()
        .on('start', this.onDragStarted)
        .on('drag', this.onDragged)
    )
  }
}
