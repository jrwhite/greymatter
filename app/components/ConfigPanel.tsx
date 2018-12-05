import * as React from 'react'
import { IzhikParamsControls } from './IzhikParamsControls'
import { IzhikParams } from '../reducers/neurons'
import {
  SetDefaultIzhikParamsAction,
  setDefaultIzhikParams
} from '../actions/config'

const styles = require('./ConfigPanel.scss')

export interface IProps {
  setDefaultIzhikParams: (payload: SetDefaultIzhikParamsAction) => void
  izhikParams: IzhikParams
}

export class ConfigPanel extends React.Component<IProps> {
  props: IProps

  render () {
    const { izhikParams, setDefaultIzhikParams } = this.props
    const onIzhikParamsChange = (params: IzhikParams) => {
      setDefaultIzhikParams(params)
    }
    return (
      <div className={styles.container}>
        {/* <div> */}
        <IzhikParamsControls
          onChange={onIzhikParamsChange}
          izhikParams={izhikParams}
        />
      </div>
    )
  }
}
