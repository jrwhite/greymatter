import * as React from 'react'
import { Ellipse } from './Ellipse'
import { Arc, Ellipse as EllipseGeo, dendArcLength } from '../utils/geometry'
import * as _ from 'lodash'
import { DendState } from '../reducers/neurons'
import Dendrite from '../containers/Dendrite'
import { arcWeightingScale } from './Dendrite'
const d3 = require('d3')

export interface IProps {
  id: string
  dends: DendState[]
  theta: number
}

export const defaultEllipseGeo: EllipseGeo = {
  major: 50,
  minor: 30,
  theta: 0,
  ecc: 5 / 3
}

export class NeuronBody extends React.Component<IProps> {
  props: IProps

  render () {
    const { dends, theta, id } = this.props

    const dendArcs: Arc[] = dends.map((d) => {
      const arcAdjustment = arcWeightingScale(d.weighting)
      const arc = {
        start: d.nu - dendArcLength - arcAdjustment,
        stop: d.nu + dendArcLength + arcAdjustment
      }

      return arc
    })

    // if an arc is below a certain length, maybe just make it a joining segmetn??

    const bodyArcs: Arc[] = _.reduce(
      dendArcs,
      (body, d): Arc[] => {
        return _.concat(_.initial(body), [
          {
            start: _.last(body)!!.start,
            stop: d.stop
          },
          {
            start: d.start,
            stop: _.last(body)!!.stop
          }
        ])
      },
      [{ start: 1 / 4, stop: 7 / 4 }]
    )

    return (
      <g>
        <Ellipse {...defaultEllipseGeo} theta={theta} arcs={bodyArcs} />
        {dends.map((d) => (
          <Dendrite
            key={d.id}
            id={d.id}
            arc={{
              start: d.nu - dendArcLength - arcWeightingScale(d.weighting),
              stop: d.nu + dendArcLength + arcWeightingScale(d.weighting)
            }}
            neuronId={id}
            bodyEllipse={{
              ...defaultEllipseGeo,
              theta
            }}
          />
        ))}
      </g>
    )
  }
}
