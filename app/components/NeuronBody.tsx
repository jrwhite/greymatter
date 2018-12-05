import * as React from 'react'
import { Ellipse } from './Ellipse'
import { Arc, Ellipse as EllipseGeo } from '../utils/geometry'
import * as _ from 'lodash'
import Dendrite from '../containers/Dendrite'
import { DendState } from '../types/neurons';
const d3 = require('d3')

export interface IProps {
  id: string
  dends: DendState[]
  theta: number
}

export class NeuronBody extends React.Component<IProps> {
  props: IProps

  render () {
    const { dends, theta, id } = this.props

    const bodyArcs: Arc[] = _.reduce(
      dends,
      (body, d): Arc[] => {
        return _.concat(_.initial(body), [
          {
            start: _.last(body)!!.start,
            stop: d.arc.start
          },
          {
            start: d.arc.stop,
            stop: _.last(body)!!.stop
          }
        ])
      },
      [{ start: 1 / 4, stop: 7 / 4 }]
    )

    const defaultEllipseGeo: EllipseGeo = {
      major: 50,
      minor: 30,
      theta: 0,
      ecc: 5 / 3
    }

    return (
      <g>
        <Ellipse {...defaultEllipseGeo} theta={theta} arcs={bodyArcs} />
        {dends.map((d) => (
          <Dendrite
            key={d.id}
            id={d.id}
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
