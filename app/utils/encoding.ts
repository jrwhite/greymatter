import { ControlPoint } from '../components/ControlPoint'
import lowerCase = require('lodash/fp/lowerCase')
import { ControlPointState } from '../reducers/encodings'
import * as _ from 'lodash'

const d3 = require('d3')

export const dataColors = [
  '#2965CC',
  '#29A634',
  '#D99E0B',
  '#D13913',
  '#8F398F',
  '#00B3A4',
  '#DB2C6F',
  '#9BBF30',
  '#96622D',
  '#7157D9'
]

export function makeEncodingFromCtrlPoints (
  controlPoints: ControlPointState[]
): (obs: number) => number {
  // piecewise linearly interpolated transfer function

  // assume ordered controlPoints array ordered by pos.x
  // ACTUALLY it doesnt need to be
  // EDIT: ACTUALLY it does have to be...
  if (_.isEmpty(controlPoints)) return () => 0
  return (obs: number) => {
    const lower: ControlPointState | undefined = _.reduce(
      controlPoints,
      (prev, cur) => {
        if (cur.pos.x <= obs) {
          if (prev.pos.x < cur.pos.x) {
            return cur
          }
        }
        return prev
      }
    )
    const upper: ControlPointState | undefined = _.reduceRight(
      controlPoints,
      (prev, cur) => {
        if (cur.pos.x >= obs) {
          if (prev.pos.x > cur.pos.x) {
            return cur
          }
        }
        return prev
      }
    )
    if (!lower || !upper) return () => 0
    console.log(lower)
    console.log(upper)
    const scale = d3
      .scaleLinear()
      .domain([lower.pos.x, upper.pos.x])
      .range([lower.pos.y, upper.pos.y])
      .clamp(true)
    return scale(obs)
  }
}
