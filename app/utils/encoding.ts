import { ControlPoint } from '../components/ControlPoint'
import lowerCase = require('lodash/fp/lowerCase')
import { ControlPointState } from '../reducers/encodings'

const d3 = require('d3')

export function makeEncodingFromCtrlPoints (
  controlPoints: ControlPointState[]
): (obs: number) => number {
  // piecewise linearly interpolated transfer function

  // assume ordered controlPoints array ordered by pos.x
  // ACTUALLY it doesnt need to be
  return (obs: number) => {
    const lower: ControlPointState = controlPoints.reduce((prev, cur) => {
      if (cur.pos.x < obs) {
        return cur
      } else {
        return prev
      }
    })
    const upper: ControlPointState = controlPoints.reduce((prev, cur) => {
      if (cur.pos.x > obs) {
        return cur
      } else {
        return prev
      }
    })
    if (!lower || !upper) return 0
    const scale = d3
      .scaleLinear()
      .domain([lower.pos.x, upper.pos.x])
      .range([lower.pos.y, upper.pos.y])
      .clamp(true)
    return scale(obs)
  }
}
