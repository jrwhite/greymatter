import * as React from 'react'
import { render } from 'react-dom'
import { GymState } from '../reducers/gym'
import { HTMLSelect, Icon } from '@blueprintjs/core'
import GymClient from './GymClient'
import { GymEnv } from './GymClient'
import { setGymEnv, SetGymEnvAction } from '../actions/gym'
import * as Actions from '../actions/gym'
import { IState as IIState } from '../reducers'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { LineGraph } from '../components/LineGraph'
import { GraphLine } from '../components/GraphLine'
import GymObservationData from '../containers/GymObservationData'

export interface IProps {
  // TODO: only pass gym props that are needed
  env: GymEnv
  observationSpace: any
  actionSpace: any
  setGymEnv: (payload: SetGymEnvAction) => void
}

export interface IState {
  selectedObservations: string[]
  showAction: boolean
  showReward: boolean
}

export class GymPanel extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {
    selectedObservations: [],
    showAction: false,
    showReward: false
  }

  render () {
    const { env, setGymEnv } = this.props

    const handleEnvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setGymEnv({ env: e.currentTarget.value as GymEnv })
    }

    const { selectedObservations, showAction, showReward } = this.state

    return (
      <div>
        {env ? <GymClient /> : undefined}
        <HTMLSelect onChange={handleEnvChange}>
          <option selected disabled hidden>
            Choose environment...
          </option>
          <option value={GymEnv.Cartpole}>Cartpole-v1</option>
        </HTMLSelect>
        <LineGraph
          scaleX={3}
          rangeX={50}
          scaleY={10}
          rangeY={{ start: -5, stop: 5 }}
        >
          <GraphLine>
            <GymObservationData name={'0'} />
          </GraphLine>
        </LineGraph>
      </div>
    )
  }

  renderGraph () {
    const { observationSpace } = this.props
  }
}

function mapStateToProps (state: IIState): Partial<IProps> {
  return {
    env: state.network.gym.env,
    observationSpace: state.network.gym.observationSpace,
    actionSpace: state.network.gym.actionSpace
  }
}

function mapDispatchToProps (dispatch: Dispatch<IIState>): Partial<IProps> {
  return bindActionCreators(Actions as any, dispatch)
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(GymPanel) as any) as React.StatelessComponent<Partial<IProps>>
