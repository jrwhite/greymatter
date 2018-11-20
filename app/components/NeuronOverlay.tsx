import * as React from 'react'
import { Rotate } from './Rotate'
import { RemoveNeuronsAction, RotateNeuronAction } from '../actions/neurons'
import { Icon } from '@blueprintjs/core'

export interface IProps {
  removeNeurons: (payload: RemoveNeuronsAction) => void
  rotateNeuron: (payload: RotateNeuronAction) => void
  fireNeuron: (id: string) => void
  tryMakeSynapseAtAxon: (axonId: string, neuronId: string) => void
  id: string
  axonId: string
}

export class NeuronOverlay extends React.Component<IProps> {
  props: IProps

  render () {
    const {
      removeNeurons,
      rotateNeuron,
      id,
      axonId,
      fireNeuron,
      tryMakeSynapseAtAxon
    } = this.props
    return (
      <g>
        <Rotate
          onRotate={(newTheta: number) => rotateNeuron({ id, theta: newTheta })}
          sensitivity={0.01}
          pivot={{ x: 0, y: 0 }}
        />
        <g
          onClick={() => removeNeurons({ neurons: [{ id }] })}
          transform={'translate(' + 45 + ',' + -45 + ')'}
          pointerEvents='all'
        >
          <rect width='15' height='15' fill='none' stroke='black' />
          <Icon icon='cross' tagName='g' />
        </g>
        <g
          onClick={() => tryMakeSynapseAtAxon(axonId, id)}
          transform={'translate(' + 50 + ',' + 10 + ')'}
          pointerEvents='all'
        >
          <rect width='15' height='15' fill='none' stroke='black' />
          <Icon icon='flows' tagName='g' />
        </g>
      </g>
    )
  }
}
