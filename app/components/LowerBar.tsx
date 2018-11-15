import * as React from 'react'
import {
  Tabs,
  TabId,
  Tab,
  Checkbox,
  Slider,
  ControlGroup,
  Text
} from '@blueprintjs/core'
import GymPanel from '../containers/GymPanel'
import EncodingPanel from '../containers/EncodingPanel'
import ConfigPanel from '../containers/ConfigPanel'

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
        <Tab id='config' title='Config' panel={<ConfigPanel />} />
        {/* <Tab id='test1' title='1' panel={<div />} /> */}
        {/* <Tab id='test2' title='2' panel={<div />} /> */}
        {/* <Tab
          id='test4'
          title='3'
          panel={
            <div>
              <ControlGroup vertical={true} fill={false}>
                <Text>'test'</Text>
                <Slider />
                <Text></Text>
                <Slider />
              </ControlGroup>
            </div>
          }
        /> */}
      </Tabs>
    )
  }
}
