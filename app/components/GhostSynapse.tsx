import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Point, Curve } from '../utils/geometry'
import { Line } from './Line'

export interface IProps {
  axon?: { pos: Point }
  dend?: { pos: Point }
  mouse: any
}

export class GhostSynapse extends React.Component<IProps> {
  props: IProps

  render () {
    const { axon, dend, mouse } = this.props

    const mousePoint: Point = {
      x: mouse.pos.x,
      y: mouse.pos.y
    }

    const line: Curve = {
      points: axon
        ? [axon.pos, mousePoint]
        : dend
        ? [mousePoint, dend.pos]
        : []
    }

    if (line) {
      return <Line line={line} />
    } else return <g />
  }
}
