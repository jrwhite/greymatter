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
    console.log(this.props.dends === nextProps.dends)
    console.log(this.props)
    console.log(nextProps)
    // return false
    return true
  }

  render () {
    const { dends, theta, bodyArcs } = this.props

    // const dendArcs: Arc[] = dends.map((d) => {
    //   return d.arc!!
    // })

    // // if an arc is below a certain length, maybe just make it a joining segmetn??

    // const sortedDendArcs: Arc[] = _.sortBy(dendArcs, 'start')
    // // const noOverlap: Arc[] = _.map(sortedDendArcs, (arc) => {
    // //   _.takeRightWhile()
    // // })

    // const bodyArcs: Arc[] = _.reduce(
    //   sortedDendArcs,
    //   (body, d): Arc[] => {
    //     return _.concat(_.initial(body), [
    //       {
    //         start: _.last(body)!!.start,
    //         stop: d.stop
    //       },
    //       {
    //         start: d.start,
    //         stop: _.last(body)!!.stop
    //       }
    //     ])
    //   },
    //   [{ start: 1 / 4, stop: 7 / 4 }]
    // )

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
