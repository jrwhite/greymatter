import * as React from 'react'
import DendInfo from '../containers/DendInfo'
import { DendState } from '../types/neurons';

export interface IProps {
  dends: DendState[]
  neuronId: string
}

export class DendList extends React.Component<IProps> {
  props: IProps

  render () {
    const { dends, neuronId } = this.props
    return (
      <div>
        {dends.map((d, i) => (
          <DendInfo {...d} index={i} key={d.id} neuronId={neuronId} />
        ))}
      </div>
    )
  }
}
