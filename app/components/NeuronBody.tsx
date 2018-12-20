import * as React from 'react'
import { Ellipse } from './Ellipse'
import {
  Arc,
  Ellipse as EllipseGeo,
  dendArcLength,
  calcArcOverlap,
  DendGeo
} from '../utils/geometry'
import * as _ from 'lodash'
import { DendState } from '../reducers/neurons'
import { arcWeightingScale, DendProps, Dendrite } from './Dendrite'
import { DendPos } from '../actions/neurons'
import { InjectedDendProps } from '../containers/NeuronBody'
const d3 = require('d3')

export interface IProps {
  id: string
  dends: InjectedDendProps[]
  theta: number
  bodyArcs: Arc[]
}

export const defaultEllipseGeo: EllipseGeo = {
  major: 50,
  minor: 30,
  theta: 0,
  ecc: 5 / 3
}

export class NeuronBody extends React.PureComponent<IProps> {
  props: IProps

  componentDidUpdate (prev: IProps, current: IProps, blah: IProps) {
    console.log(prev)
    console.log(current)
    console.log(blah)
  }

  shouldComponentUpdate (nextProps: IProps) {
    return !(this.props.bodyArcs === nextProps.bodyArcs)
  }

  render () {
    const { dends, theta, bodyArcs } = this.props

    return (
      <g>
        <Ellipse {...defaultEllipseGeo} theta={theta} arcs={bodyArcs} />
        {dends.map((d, i) => (
          <Dendrite
            key={i}
            weighting={d.weighting!!}
            arc={d.arc}
            bodyEllipse={{
              ...defaultEllipseGeo,
              theta
            }}
            synCpos={d.synCpos!!}
          />
        ))}
      </g>
    )
  }
}
