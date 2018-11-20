import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Point, addPoints } from '../utils/geometry'
import { Line } from './Line'
import { ActionPotentialState } from '../reducers/network'
import ActionPotential from '../containers/ActionPotential'
import { FilledLineSeg } from './FilledLineSeg'

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
        {/* <clipPath id={'clipPath' + id}> */}
        <clipPath id={'clipPath'}>
          {/* <Line line={line} width={200} stroke='none' /> */}
          {/* <path d={lineSetter(line.points)} stoke-width={20} /> */}
          <FilledLineSeg
            width={5}
            fill='none'
            line={{ start: axonPos, stop: dendPos }}
          />
          {/* <line
            x1={axonPos.x}
            y1={axonPos.y}
            x2={dendPos.x}
            y2={dendPos.y}
            strokeWidth={10}
          /> */}
          {/* <rect width={500} height={500} /> */}
        </clipPath>
        {/* <path d={lineSetter(line.points)} fill='black' stroke-width={10} /> */}
        <FilledLineSeg width={5} fill='grey' line={{start: axonPos, stop: dendPos}} />
        {/* <Line line={line} stroke='black' width={3} /> */}
        //TODO: refactor AP animation into synapse component // actually. i
        think that we just need to take the ActionPotential out of synapse and
        prtty much never allow it to rerender //TODO: refactor into
        ActionPotential container w/ selector. NEVER RERENDER
        {actionPotentials.map((ap) => (
          // <ActionPotential
          //   key={ap.id}
          //   id={ap.id}
          //   callback={() => apCallback(ap.id)}
          //   type={'EXCIT'}
          //   start={axonPos}
          //   stop={dendPos}
          //   speed={speed}
          //   length={length}
          // />
          <ActionPotential
            key={ap.id}
            id={ap.id}
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
