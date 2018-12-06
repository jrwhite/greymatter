import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Point, addPoints } from '../utils/geometry'
import { Line } from './Line'
import { ActionPotentialState } from '../reducers/network'
import ActionPotential from '../containers/ActionPotential'
import { FilledLineSeg } from './FilledLineSeg'
import { AxonType } from '../reducers/neurons'

const d3 = require('d3')

export interface IProps extends RouteComponentProps<any> {
  finishFiringApOnSynapse (id: string, synapseId: string): void
  id: string
  axon: { id: string; neuronId: string }
  dend: { id: string; neuronId: string }
  width: number
  length: number
  speed: number
  axonPos: Point
  axonType: AxonType
  dendPos: Point
  isFiring: boolean
  actionPotentials: ActionPotentialState[]
}

export class Synapse extends React.Component<IProps> {
  props: IProps

  render () {
    const {
      finishFiringApOnSynapse,
      axonPos,
      axonType,
      dendPos,
      id,
      speed,
      isFiring,
      actionPotentials
    } = this.props

    // const line = {start: axonPos, stop: dendPos}
    const line = {
      points: [
        axonPos,
        dendPos,
        addPoints(dendPos, { x: 0, y: 10 }),
        addPoints(axonPos, { x: 0, y: 10 })
      ]
    }
    const lineSetter = d3
      .line()
      .x((d: Point) => d.x)
      .y((d: Point) => d.y)
    const length = Math.hypot(axonPos.x - dendPos.x, axonPos.y - dendPos.y)
    const apCallback = (apId: string) => finishFiringApOnSynapse(apId, id)

    return (
      <g id={id}>
        <clipPath id={'clipPath' + id}>
          {/* <Line line={line} width={200} stroke='none' /> */}
          {/* <path d={lineSetter(line.points)} stoke-width={20} /> */}
          <FilledLineSeg
            width={5}
            fill='none'
            line={{ start: axonPos, stop: dendPos }}
          />
        </clipPath>
        <FilledLineSeg
          width={5}
          // fill='#394B59'
          // fill='#182026'
          // fill='#8A9BA8'
          fill='#5C7080'
          line={{ start: axonPos, stop: dendPos }}
        />
        {/* <Line line={line} stroke='black' width={3} /> */}
        //TODO: refactor AP animation into synapse component // actually. i
        think that we just need to take the ActionPotential out of synapse and
        prtty much never allow it to rerender //TODO: refactor into
        ActionPotential container w/ selector. NEVER RERENDER
        {actionPotentials.map((ap) => (
          <ActionPotential
            key={ap.id}
            id={ap.id}
            axonType={axonType}
            synapseId={id}
            start={axonPos}
            stop={dendPos}
            speed={speed}
            length={length}
            // mask={'url(#apMask)'}
            fill='white'
          />
        ))}
      </g>
    )
  }
}
