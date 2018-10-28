import * as React from 'react'
import { DendState } from '../reducers/neurons'
import DendInfo from '../containers/DendInfo'

export interface IProps {
  dends: DendState[]
}

export class DendList extends React.Component<IProps> {
  props: IProps

  render () {
    const { dends } = this.props
    return <div>{dends.map(this.renderDendInfo)}</div>
  }

  renderDendInfo (dend: DendState, index: number) {
    return <DendInfo {...dend} index={index} key={dend.id} />
  }
}
