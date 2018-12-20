import * as React from 'react'
import {
  Arc,
  Line as LineGeo,
  Point,
  calcDendCurves,
  Ellipse,
  Curve,
  calcTipPos,
  dendArcLength
} from '../utils/geometry'
import { Line } from './Line'
import { CurveNatural } from './CurveNatural'
const d3 = require('d3')
import * as _ from 'lodash'
import { DendState } from '../reducers/neurons'
import { changeDendWeighting } from '../actions/neurons'

export interface DendProps {
  synCpos: Point
  arc: Arc
  bodyEllipse: Ellipse
  weighting: number
  // sourceVal: number
}

export const arcWeightingScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([-1 / 32, 1 / 16])

export class Dendrite extends React.PureComponent<DendProps> {
  props: DendProps

  render () {
    const { arc, bodyEllipse, synCpos, weighting } = this.props
    console.log('rerender dendrite')

    const curves: Curve[] = calcDendCurves(
      synCpos,
      weighting / 12, // ctrlWidth
      weighting / 5, // ctrlHeight
      arc,
      bodyEllipse
    )

    const baseLeft = curves[0].points[0]
    const ctrlLeft = curves[0].points[1]
    const baseRight = curves[1].points[0]
    const ctrlRight = curves[1].points[1]

    if (
      baseLeft === undefined ||
      ctrlLeft === undefined ||
      baseRight === undefined ||
      ctrlRight === undefined ||
      synCpos === undefined
    ) {
      return null
    }

    const pathSetter = d3.path()

    pathSetter.moveTo(baseLeft.x, baseLeft.y)
    pathSetter.quadraticCurveTo(ctrlLeft.x, ctrlLeft.y, synCpos.x, synCpos.y)
    pathSetter.quadraticCurveTo(
      ctrlRight.x,
      ctrlRight.y,
      baseRight.x,
      baseRight.y
    )
    pathSetter.closePath()

    return (
      <g>
        <path d={pathSetter.toString()} stroke='none' />
        {/* <circle cx={baseLeft.x} cy={baseLeft.y} r={2} fill='purple' />
        <circle cx={baseRight.x} cy={baseRight.y} r={2} fill='purple' />
        <circle cx={ctrlLeft.x} cy={ctrlLeft.y} r={2} fill='purple' />
        <circle cx={ctrlRight.x} cy={ctrlRight.y} r={2} fill='purple' /> */}
      </g>
    )
  }
}
