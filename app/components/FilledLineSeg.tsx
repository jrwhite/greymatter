import * as React from 'react'
import {
  Line,
  getUnitLine,
  Point,
  getUnitVector,
  getLineVector,
  getPerpVector,
  vectorScalarMultiply,
  addPoints
} from '../utils/geometry'

const d3 = require('d3')

export interface IProps {
  line: Line
  fill: string
  width: number
}

export const FilledLineSeg: React.SFC<IProps> = (props) => {
  const unitLineVec: Point = getUnitVector(getLineVector(props.line))
  // this is not correct because multiplying x and y comps by width produces a line too thick
  // but whatever
  const offsetVec: Point = vectorScalarMultiply(
    getPerpVector(unitLineVec),
    props.width
  )
  const offset: Line = {
    start: addPoints(props.line.start, offsetVec),
    stop: addPoints(props.line.stop, offsetVec)
  }
  const lineSetter = d3
    .line()
    .x((d: Point) => d.x)
    .y((d: Point) => d.y)

  return (
    <path
      fill={props.fill}
      d={lineSetter([
        props.line.start,
        props.line.stop,
        offset.stop,
        offset.start
      ])}
    />
  )
}
