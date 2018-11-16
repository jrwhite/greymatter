import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Point } from '../utils/geometry'
import { Line } from './Line'
import { ActionPotentialState } from '../reducers/network'
import ActionPotential from '../containers/ActionPotential'

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
    const line = { points: [axonPos, dendPos] }
    const length = Math.hypot(axonPos.x - dendPos.x, axonPos.y - dendPos.y)
    const apCallback = (apId: string) => finishFiringApOnSynapse(apId, id)

    return (
      <g id={id}>
        <Line line={line} />
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
          />
        ))}
      </g>
    )
  }
}
