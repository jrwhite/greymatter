import * as React from 'react'
import { GymState } from '../reducers/network';
import { ReceiveGymInputsAction } from '../actions/network';
import { GymHttpClient } from '../utils/gymHTTPClient';
const d3 = require('d3')
import { IState as IIState } from '../reducers'
import * as NetworkActions from '../actions/network'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux';

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
    receiveGymInputs: (payload: ReceiveGymInputsAction) => void,
    gymStopped: () => void,
    pauseNetwork: () => void,
    gym: GymState,
}

export interface IState {
    remote: string,
    client?: GymHttpClient
}

export class GymClient extends React.Component<IProps,IState> {
    props: IProps
    state: IState = {
        remote: "http://127.0.0.1:5000",
        client: undefined
    }

    makeCartpoleEnv = () => {
        const {
            remote,
            client
        } = this.state

        const newClient = new GymHttpClient(remote)
        console.log(newClient)
        const p = newClient.envCreate("CartPole-v1")
        p.then((reply) => console.log("Reply: " + JSON.stringify(reply)))
        p.catch((error) => console.log("Error: " + error))
        this.setState(
            {
                client: newClient
            }
        )
    }

    componentDidMount() {
        this.makeCartpoleEnv()
    }

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        const {
            gym,
            pauseNetwork
        } = this.props
        // if gym is now stopped, send a pause command
        if (!prevProps.gym.isStopped && gym.isStopped){
            pauseNetwork()
        }
    }

    /**
     * API requests:
     * Step (output) -> (input, reward, isStopped, )
     * Start
     * Reset -- maybe the same as Start??
     * Render
     */

     gymStep = (outputs: CartpoleOutputs) => {
       const {
        gym
       } = this.props

       const {
        client
       } = this.state

     }

     gymStart = () => {

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
