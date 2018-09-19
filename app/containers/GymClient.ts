import * as React from 'react'
import { GymState } from '../reducers/network';
import {  ResetGymAction, StepGymAction, CloseGymAction,  ChangeGymDoneAction, ReceiveGymStepReplyAction, MonitorGymAction, resetGym, stepGym, ChangeGymSpace, } from '../actions/network';
import { GymHttpClient } from '../utils/gymHTTPClient';
const d3 = require('d3')
import { IState as IIState } from '../reducers'
import * as NetworkActions from '../actions/network'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux';

export enum GymEnv {
    Cartpole = "CartPole-v0",
}

export interface CartpoleInputs {
    theta: number,
    phi: number,
    x: number,
    y: number,
    dTheta: number
}

export interface CartpoleOutputs {
    accelerate: boolean
}

export interface IProps {
    changeGymActionSpace: (payload: ChangeGymSpace) => void,
    changeGymObsSpace: (payload: ChangeGymSpace) => void,
    resetGym: (payload: ResetGymAction) => void,
    stepGym: (payload: StepGymAction) => void,
    closeGym: (payload: CloseGymAction) => void,
    monitorGym: (payload: MonitorGymAction) => void,
    changeGymDone: (payload: ChangeGymDoneAction) => void,
    receiveGymStepReply: (payload: ReceiveGymStepReplyAction) => void,
    gymStopped: () => void,
    pauseNetwork: () => void,
    gym: GymState,
}

export interface IState {
    remote: string,
    client?: GymHttpClient,
    instance?: string
}

export class GymClient extends React.Component<IProps,IState> {
    props: IProps
    state: IState = {
        remote: "http://127.0.0.1:5000",
        client: undefined,
        instance: undefined
    }

    // this should be called when the gym panel is open??
    makeEnv = (env: GymEnv) => {
        const {
            changeGymActionSpace,
            changeGymObsSpace
        } = this.props

        const {
            remote,
            client
        } = this.state

        // process.env.SHOULD_LOG = "true"

        const newClient = new GymHttpClient(remote)
        let newInstance: string
        newClient.envCreate(env)
        .then((reply: any) => {
            // console.log(reply)
            newInstance = reply.instance_id
            this.setState(
                {
                    instance: newInstance
                }
            )
            return newClient.envObservationSpaceInfo(newInstance)
        }).then((reply: any) => {
            // console.log(reply)
            changeGymObsSpace({space: reply.info})
            return newClient.envActionSpaceInfo(newInstance)
        }).then((reply: any) => {
            // console.log(reply)
            changeGymActionSpace({space: reply.info})
        })
        .catch((error) => console.log("Error: " + error))
        this.setState(
            {
                client: newClient
            }
        )
    }

    componentDidMount () {
        this.makeEnv(GymEnv.Cartpole)
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        const {
            gym: prevGym
        } = prevProps
        const {
            gym,
            pauseNetwork
        } = this.props
        // if gym is now done, send a pause command
        if (!prevGym.isDone && gym.isDone) {
            pauseNetwork()
        }
        if (!prevGym.shouldReset && gym.shouldReset) {
            this.gymReset()
        }
        if (!prevGym.shouldStep && gym.shouldStep) {
            this.gymStep()
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
         const {
            gym,
            resetGym,
            receiveGymStepReply
         } = this.props

         const {
             instance,
             client
         } = this.state

         if (client && instance) {
            client.envReset(instance)
                .then((reply: any) => {
                    receiveGymStepReply(reply.observation)
                    resetGym({shouldReset: false})
                }).catch((error) => {
                    console.error("Gym reset failed!")
                    console.error(error)
                })
         } else {
             console.error("No gym client to reset!")
         }
     }

     gymStep = () => {
       const {
        gym,
        stepGym,
        receiveGymStepReply,
        changeGymDone
       } = this.props

       const {
        client,
        instance
       } = this.state

       if (client && instance && gym.action) {
           client.envStep(instance, gym.action)
            .then((reply: any) => {
                receiveGymStepReply(
                    {
                        observation: reply.observation,
                        isDone: reply.done,
                        reward: reply.reward,
                        info: reply.info ? reply.info : undefined,
                    }
                )
                stepGym({shouldStep: false})
            }).catch((error) => {
                console.error("Gym step failed!")
                console.error(error)
            })
       } else {
           console.error("No gym client to step!")
       }

     }

    render () {
        const {

        } = this.props

        return null
    }
}

function mapStateToProps(state: IIState): Partial<IProps> {
    return {
        gym: state.network.gym,
    }
}

function mapDispatchToProps(dispatch: Dispatch<IIState>): Partial<IProps> {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(mapStateToProps, mapDispatchToProps)(GymClient) as any as React.StatelessComponent<Partial<IProps>>);
