import * as React from 'react'
import {
  Arc,
  Line as LineGeo,
  Point,
  calcDendCurves,
  Ellipse,
  Curve
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
  bodyEllipse: Ellipse
  // sourceVal: number
}

export class Dendrite extends React.Component<IProps> {
  props: IProps

  render () {
    const { synCpos, weighting, arc, bodyEllipse } = this.props
    const curves: Curve[] = calcDendCurves(
      synCpos,
      weighting / 12, // ctrlWidth
      weighting / 5, // ctrlHeight
      arc,
      bodyEllipse
    )

    return (
      <g>
        {curves.map((curve: Curve) => (
          <CurveNatural key={_.uniqueId('dl')} curve={curve} />
        ))}
      </g>
    )
  }
}
