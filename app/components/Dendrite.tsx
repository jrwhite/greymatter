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
import { IIProps } from '../containers/Dendrite'

export interface IProps extends IIProps {
  synCpos: Point
  weighting: number
  arc: Arc
  nu: number
  bodyEllipse: Ellipse
  incomingAngle: number
  baseCpos: Point
  overlap: number
  // sourceVal: number
}

export const arcWeightingScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([-1 / 32, 1 / 16])

export class Dendrite extends React.Component<IProps> {
  props: IProps

  render () {
    const {
      arc,
      nu,
      baseCpos,
      weighting,
      bodyEllipse,
      incomingAngle,
      overlap
    } = this.props
    const tipPos = calcTipPos(
      baseCpos,
      incomingAngle,
      15 + weighting / 5,
      overlap
    )
    // const arcAdjustment = arcWeightingScale(weighting)
    // const arc = {
    //   start: nu - dendArcLength - arcAdjustment,
    //   stop: nu + dendArcLength + arcAdjustment
    // }

    // do overlap calculations here

    const curves: Curve[] = calcDendCurves(
      tipPos,
      weighting / 12, // ctrlWidth
      weighting / 5, // ctrlHeight
      arc,
      bodyEllipse
    )

    // const lineSetter = d3
    //   .line()
    //   .x((d: Point) => d.x)
    //   .y((d: Point) => d.y)
    // .curve(d3.curveNatural)

    const baseLeft = curves[0].points[0]
    const ctrlLeft = curves[0].points[1]
    const baseRight = curves[1].points[0]
    const ctrlRight = curves[1].points[1]

    const pathSetter = d3.path()

    pathSetter.moveTo(baseLeft.x, baseLeft.y)
    pathSetter.quadraticCurveTo(ctrlLeft.x, ctrlLeft.y, tipPos.x, tipPos.y)
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
