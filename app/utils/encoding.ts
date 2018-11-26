import { ControlPoint } from '../components/ControlPoint'
import lowerCase = require('lodash/fp/lowerCase')
import { ControlPointState } from '../reducers/encodings'

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
      console.log(cur)
      console.log(prev)
      if (cur.pos.x > obs) {
        return cur
      } else {
        return prev
      }
    })
    console.log(lower)
    console.log(upper)
    if (!lower || !upper) return 0
    return (
      (obs - lower.pos.x) *
      ((upper.pos.y - lower.pos.y) / (upper.pos.x - lower.pos.x))
    )
  }
}
