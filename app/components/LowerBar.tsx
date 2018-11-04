import * as React from 'react'
import { Tabs, TabId, Tab } from '@blueprintjs/core'
import GymPanel from '../containers/GymPanel'
import EncodingPanel from '../containers/EncodingPanel';

export interface IProps {}

export interface IState {
  navbarTabId: TabId
}

export class LowerBar extends React.Component<IProps, IState> {
  props: IProps
  state: IState

  handleTabChange = (navbarTabId: TabId) => this.setState({ navbarTabId })

  render () {
    const {} = this.props

    return (
      <Tabs id='lowertabs' onChange={this.handleTabChange}>
        <Tab id='gym' title='Gym' panel={<GymPanel />} />
        {/* <Tab id="plas" title="Plasticity" panel={} /> */}
        <Tab id='coding' title='Coding' panel={<EncodingPanel />} />
      </Tabs>
    )
  }
}
