import * as React from 'react'
import { IzhikParamsControls } from './IzhikParamsControls'
import { IzhikParams, StdpType } from '../reducers/neurons'
import {
  SetDefaultIzhikParamsAction,
  setDefaultIzhikParams
} from '../actions/config'
import StdpEncodingGraph from '../containers/StdpEncodingGraph'
import DaModulationGraph from '../containers/DaModulationGraph'
import { StdpModTypes } from '../reducers/config'
import WeightingModulationGraph from '../containers/WeightingModulationGraph';

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
        <div className={styles.izhik}>
          <IzhikParamsControls
            onChange={onIzhikParamsChange}
            izhikParams={izhikParams}
          />
        </div>
        <div className={styles.graph}>
          <StdpEncodingGraph
            id={'Excitatory'}
            color={'blue'}
            width={250}
            height={150}
          />
        </div>
        <div className={styles.graph}>
          <StdpEncodingGraph
            id={'Inhibitory'}
            color={'blue'}
            width={250}
            height={150}
          />
        </div>
        <div className={styles.graph}>
          <DaModulationGraph
            id={'Excitatory'}
            modType={StdpModTypes.Volume}
            color={'blue'}
            width={125}
            height={150}
          />
        </div>
        <div className={styles.graph}>
          <WeightingModulationGraph
            id={'Excitatory'}
            modType={StdpModTypes.Weighting}
            color={'blue'}
            width={125}
            height={150}
          />
        </div>
      </div>
    )
  }
}
