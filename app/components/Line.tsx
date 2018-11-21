import * as React from 'react'
import { Line as LineGeo, Point, Curve } from '../utils/geometry'
import { render } from 'enzyme'
const d3 = require('d3')

export interface IProps {
  line: Curve
  stroke?: string
  width?: number
}

export const Line: React.SFC<IProps> = (props) => {
  const { line, width } = props

  const lineSetter = d3
    .line()
    .x((d: Point) => d.x)
    .y((d: Point) => d.y)

  return (
    <path
      stroke={props.stroke ? props.stroke : 'red'}
      d={lineSetter(line.points)}
      stroke-width={width ? width : 5}
    />
  )
}
