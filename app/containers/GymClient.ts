import * as React from 'react'
import { GymState } from '../reducers/gym'
import {
  ResetGymAction,
  StepGymAction,
  CloseGymAction,
  ChangeGymDoneAction,
  ReceiveGymStepReplyAction,
  MonitorGymAction,
  resetGym,
  stepGym,
  ChangeGymSpace,
  StartGymAction
} from '../actions/gym'
import { GymHttpClient } from '../utils/gymHTTPClient'
const d3 = require('d3')
import { IState as IIState } from '../reducers'
import * as Actions from '../actions/gym'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux'
import NetworkActions from '../actions/network'
import { makeGetEncodedAction } from '../selectors/encoding'

export enum GymEnv {
  Cartpole = 'CartPole-v1'
}

export interface CartpoleInputs {
  theta: number
  phi: number
  x: number
  y: number
  dTheta: number
}

export interface CartpoleOutputs {
  accelerate: boolean
}

export interface IProps {
  pauseNetwork: () => void
  changeGymActionSpace: (payload: ChangeGymSpace) => void
  changeGymObsSpace: (payload: ChangeGymSpace) => void
  resetGym: (payload: ResetGymAction) => void
  stepGym: (payload: StepGymAction) => void
  closeGym: (payload: CloseGymAction) => void
  startGym: (payload: StartGymAction) => void
  monitorGym: (payload: MonitorGymAction) => void
  changeGymDone: (payload: ChangeGymDoneAction) => void
  receiveGymStepReply: (payload: ReceiveGymStepReplyAction) => void
  gymStopped: () => void
  gym: GymState
  action?: number
}

export interface IState {
  remote: string
  client?: GymHttpClient
  instance?: string
}

export class GymClient extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {
    // remote: 'http://127.0.0.1:5000',
    remote: 'http://35.226.48.74:5000',
    client: undefined,
    instance: undefined
  }

  // this should be called when the gym panel is open??
  makeEnv = (env: GymEnv) => {
    const { changeGymActionSpace, changeGymObsSpace, startGym } = this.props

    const { remote, client } = this.state

    // process.env.SHOULD_LOG = "true"

    const newClient = new GymHttpClient(remote)
    let newInstance: string
    newClient
      .envCreate(env)
      .then((reply: any) => {
        // console.log(reply)
        newInstance = reply.instance_id
        this.setState({
          instance: newInstance
        })
        return newClient.envObservationSpaceInfo(newInstance)
      })
      .then((reply: any) => {
        // console.log(reply)
        changeGymObsSpace({ space: reply.info })
        return newClient.envActionSpaceInfo(newInstance)
      })
      .then((reply: any) => {
        // console.log(reply)
        changeGymActionSpace({ space: reply.info })
      })
      .catch((error) => console.log('Error: ' + error))
    this.setState({
      client: newClient
    })
    startGym({ shouldStart: false })
  }

  componentDidMount () {
    const { gym } = this.props

    if (gym.env) {
      this.makeEnv(gym.env)
    }
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    const { gym: prevGym } = prevProps
    const { gym, pauseNetwork } = this.props
    // console.log(gym)
    // if gym is now done, send a pause command
    if (!prevGym.isDone && gym.isDone) {
      // pauseNetwork()
      this.gymReset()
    }
    if (!prevGym.shouldReset && gym.shouldReset) {
      this.gymReset()
    }
    if (!prevGym.shouldStep && gym.shouldStep) {
      this.gymStep()
    }
    // if (gym.env && prevGym.env !== gym.env) {
    //   this.makeEnv(gym.env)
    // }
    if (!prevGym.shouldStart && gym.shouldStart && gym.env) {
      this.makeEnv(gym.env)
    }
  }

  /**
   * API requests:
   * Step (output) -> (input, reward, isStopped, )
   * Start
   * Reset -- maybe the same as Start??
   * Render
   */

  gymReset = () => {
    const { gym, resetGym, receiveGymStepReply, changeGymDone } = this.props

    const { instance, client } = this.state

    if (client && instance) {
      client
        .envReset(instance)
        .then((reply: any) => {
          // receiveGymStepReply(reply.observation)
          changeGymDone({ isDone: false })
        })
        .catch((error) => {
          console.error('Gym reset failed!')
          console.error(error)
        })
    } else {
      console.error('No gym client to reset!')
    }
    resetGym({ shouldReset: false })
  }

  gymStep = () => {
    const {
      gym,
      action,
      stepGym,
      receiveGymStepReply,
      changeGymDone
    } = this.props

    const { client, instance } = this.state

    // console.log(gym.action)
    // console.log(client)
    // console.log(instance)

    if (client && instance && action !== undefined && gym.isDone === false) {
      // console.log('gym step much success')
      // console.log(action)
      // console.log(Math.round(action))
      client
        .envStep(instance, Math.round(action))
        .then((reply: any) => {
          // console.log(reply)
          receiveGymStepReply({
            observations: reply.observation,
            isDone: reply.done,
            reward: reply.reward,
            info: reply.info ? reply.info : undefined
          })
        })
        .catch((error) => {
          console.error('Gym step failed!')
          console.error(error)
          // this.gymReset()
        })
    } else {
      console.error('No gym client to step!')
    }
    stepGym({ shouldStep: false })
  }

  render () {
    const {} = this.props

    return null
  }
}

function makeMapStateToProps () {
  const getAction = makeGetEncodedAction()
  return (state: IIState): Partial<IProps> => {
    return {
      gym: state.network.gym,
      action: getAction(state)
    }
  }
}

function mapStateToProps (state: IIState): Partial<IProps> {
  return {
    gym: state.network.gym
  }
}

function mapDispatchToProps (dispatch: Dispatch<IIState>): Partial<IProps> {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(
  // mapStateToProps,
  makeMapStateToProps(), // TODO: Remove parentheses here?
  mapDispatchToProps
)(GymClient) as any) as React.StatelessComponent<Partial<IProps>>
