import * as React from 'react'
import { Rotate } from './Rotate'
import { RemoveNeuronsAction, RotateNeuronAction } from '../actions/neurons'

export interface IProps {
  removeNeuron: (payload: RemoveNeuronsAction) => void
  rotateNeuron: (payload: RotateNeuronAction) => void
  id: string
}

export class NeuronOverlay extends React.Component<IProps> {
  props: IProps

  render () {
    const { rotateNeuron, id } = this.props
    return (
      <g>
        <Rotate
          onRotate={(newTheta: number) => rotateNeuron({ id, theta: newTheta })}
          sensitivity={0.01}
          pivot={{ x: 0, y: 0 }}
        />
      </g>
    )
  }
}
