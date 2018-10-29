import * as React from 'react'
import { Point } from '../utils/geometry'

const d3 = require('d3')

export interface IProps {
  setControlPointPos: any
  id: string
  pos: Point
}

export class ControlPoint extends React.Component<IProps> {
  props: IProps

  render () {
    const { pos, id } = this.props

    return (
      <g id={id} transform={'translate(' + pos.x + ' ' + pos.y + ')'}>
        <circle r={5} />
      </g>
    )
  }

  onDragStarted = () => {}

  onDragged = () => {
    const { id, setControlPointPos } = this.props

    const newPos: Point = {
      ...d3.event
    }

    setControlPointPos({ id, newPos })
  }
  renderD3 () {
    const { id } = this.props

    d3.select('#' + id).call(
      d3
        .drag()
        .on('start', this.onDragStarted)
        .on('drag', this.onDragged)
    )
  }
}
