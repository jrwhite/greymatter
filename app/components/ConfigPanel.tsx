import * as React from 'react'
import { IzhikParamsControls } from './IzhikParamsControls'
import { IzhikParams } from '../reducers/neurons'
import {
  SetDefaultIzhikParamsAction,
  setDefaultIzhikParams
} from '../actions/config'

export interface IProps {
  setDefaultIzhikParams: (payload: SetDefaultIzhikParamsAction) => void
  izhikParams: IzhikParams
}

export class ConfigPanel extends React.Component<IProps> {
  props: IProps

  onIzhikParamsChange (params: IzhikParams) {
    setDefaultIzhikParams(params)
  }

  render () {
    const { izhikParams } = this.props
    return (
      <IzhikParamsControls
        onChange={this.onIzhikParamsChange}
        izhikParams={izhikParams}
      />
    )
  }
}
