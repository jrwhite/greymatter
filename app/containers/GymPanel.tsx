import * as React from 'react'
import { render } from 'react-dom'
import { GymState } from '../reducers/gym'
import {
  HTMLSelect,
  Icon,
  Button,
  Text,
  ControlGroup,
  FormGroup
} from '@blueprintjs/core'
import GymClient from './GymClient'
import { GymEnv } from './GymClient'
import {
  setGymEnv,
  SetGymEnvAction,
  ResetGymAction,
  StartGymAction
} from '../actions/gym'
import * as Actions from '../actions/gym'
import { IState as IIState } from '../reducers'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { LineGraph } from '../components/LineGraph'
import { GraphLine } from '../components/GraphLine'
import GymObservationData from '../containers/GymObservationData'
import GymGraph from './GymGraph'
import { AddNewObservableAction } from '../actions/observables'
import { ObservableEnum } from '../reducers/observables'
import NetworkActions from '../actions/network'

const styles = require('../components/GymPanel.scss')

export interface IProps {
  // TODO: only pass gym props that are needed
  addAllGymObservables: () => void
  addNewObservable: (payload: AddNewObservableAction) => void
  resetGym: (payload: ResetGymAction) => void
  startGym: (payload: StartGymAction) => void
  env: GymEnv
  observationSpace: any
  actionSpace: any
  observations: number[]
  setGymEnv: (payload: SetGymEnvAction) => void
  isDone: boolean
  reward: number
  curTotalReward: number
  prevTotalReward: number
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
    const {
      addAllGymObservables,
      addNewObservable,
      resetGym,
      startGym,
      env,
      setGymEnv,
      observations,
      isDone,
      reward,
      prevTotalReward,
      curTotalReward
    } = this.props

    const handleEnvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setGymEnv({ env: e.currentTarget.value as GymEnv })
    }

    const { selectedObservations, showAction, showReward } = this.state

    return (
      <div className={styles.container}>
        {env ? <GymClient /> : undefined}
        <ControlGroup vertical={true}>
          {' '}
          <HTMLSelect onChange={handleEnvChange}>
            <option selected disabled hidden>
              Choose environment...
            </option>
            <option value={GymEnv.Cartpole}>Cartpole-v1</option>
          </HTMLSelect>
          <Button onClick={() => startGym({ shouldStart: true })}>
            'Start'
          </Button>
          <Button onClick={() => resetGym({ shouldReset: true })}>
            'Restart
          </Button>
          <Button onClick={() => addAllGymObservables()}>
            'Add Gym Observables'
          </Button>
        </ControlGroup>

        {/* <Text>'Observations'</Text>
        <Text> {'obs 0: ' + observations[0]}</Text> */}
        <div className={styles.element}>
          <Text> 'Reward' </Text>
          <Text> 'Previous: {prevTotalReward}'</Text>
          <Text> 'Current: {curTotalReward}'</Text>
          <Text>{'Is done?: ' + isDone}</Text>
        </div>
        <div className={styles.element}>
          <Text>'Observations Graph'</Text>
          <GymGraph />
        </div>
        {/* <LineGraph
          scaleX={3}
          rangeX={50}
          scaleY={10}
          rangeY={{ start: -5, stop: 5 }}
        >
          <GraphLine>
            <GymObservationData index={0} />
          </GraphLine>
          <GraphLine>
            <GymObservationData index={1} />
          </GraphLine>
        </LineGraph> */}
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
    actionSpace: state.network.gym.actionSpace,
    observations: state.network.gym.observations,
    isDone: state.network.gym.isDone,
    reward: state.network.gym.reward,
    curTotalReward: state.network.gym.curTotalReward,
    prevTotalReward: state.network.gym.prevTotalReward
  }
}

function mapDispatchToProps (dispatch: Dispatch<IIState>): Partial<IProps> {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
)(GymPanel) as any) as React.StatelessComponent<Partial<IProps>>
