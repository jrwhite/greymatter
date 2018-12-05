import * as React from 'react'
import { IState } from '../reducers';
import { IProps } from '../components/GhostSynapse';
import { addPoints } from '../utils/geometry';

export interface IIProps {
    mouse: any
}

const mapStateToProps = (state: IState, props: IIProps): Partial<IProps> => {
        const ghost = state.network.ghostSynapse
        const preNeuron = ghost.axon ? state.network.neurons.byId[ghost.axon.neuronId] : undefined     
        const axonPos = preNeuron ? addPoints(preNeuron.pos , preNeuron.axon.cpos) : undefined
        const dendPos = ghost.axon ? state.network.neurons.byId[ghost.axon.neuronId].axon                 
}
