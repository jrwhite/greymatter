import * as React from 'react'
import { Rotate } from './Rotate'
import {
  RemoveNeuronsAction,
  RotateNeuronAction,
  SetAxonTypeAction,
  FireNeuronAction
} from '../actions/neurons'
import { Icon } from '@blueprintjs/core'
import { AxonState, AxonType } from '../reducers/neurons'

export interface IProps {
  recalcAllDends: () => void
  fireVolumeNeuron: () => void
  setAxonType: (payload: SetAxonTypeAction) => void
  removeNeuron: (id: string) => void
  rotateNeuron: (payload: RotateNeuronAction) => void
  addNewApToSynapse: (id: string) => void
  fireNeuron: (payload: FireNeuronAction) => void
  tryMakeSynapseAtAxon: (axonId: string, neuronId: string) => void
  id: string
  axon: AxonState
}

export class NeuronOverlay extends React.Component<IProps> {
  props: IProps

  render () {
    const {
      setAxonType,
      removeNeuron,
      rotateNeuron,
      recalcAllDends,
      id,
      axon,
      fireVolumeNeuron,
      fireNeuron,
      tryMakeSynapseAtAxon,
      addNewApToSynapse
    } = this.props
    return (
      <g>
        <g transform={'translate(' + 60 + ',' + 40 + ')'}>
          <Rotate
            onRotate={(newTheta: number) => {
              rotateNeuron({ id, theta: newTheta })
            }}
            onRotateDone={() => recalcAllDends()}
            sensitivity={0.01}
            pivot={{ x: 0, y: 0 }}
          />
        </g>
        <g
          onClick={() => removeNeuron(id)}
          transform={'translate(' + 60 + ',' + -50 + ')'}
          pointerEvents='all'
        >
          <rect width='15' height='15' fill='none' stroke='black' />
          <Icon icon='cross' tagName='g' />
        </g>
        <g
          onClick={() => tryMakeSynapseAtAxon(axon.id, id)}
          transform={'translate(' + 60 + ',' + -20 + ')'}
          pointerEvents='all'
        >
          <rect width='15' height='15' fill='none' stroke='black' />
          <Icon icon='flows' tagName='g' />
        </g>
        <g
          onClick={() => {
            fireNeuron({ id, axonType: axon.type })
            if (axon.type === AxonType.Volume) fireVolumeNeuron()
            axon.synapses.forEach((s) => addNewApToSynapse(s.id))
          }}
          transform={'translate(' + 60 + ',' + 10 + ')'}
          pointerEvents='all'
        >
          <rect width='15' height='15' fill='none' stroke='black' />
          <Icon icon='send-to' tagName='g' />
        </g>
        <g
          onClick={() =>
            setAxonType({
              id,
              type:
                axon.type === AxonType.Excitatory
                  ? AxonType.Inhibitory
                  : AxonType.Excitatory
            })
          }
          transform={'translate(' + 60 + ',' + 70 + ')'}
          pointerEvents='all'
        >
          <rect width='15' height='15' fill='none' stroke='black' />
          <Icon
            icon={axon.type === AxonType.Excitatory ? 'ban-circle' : 'add'}
            tagName='g'
          />
        </g>
      </g>
    )
  }
}
