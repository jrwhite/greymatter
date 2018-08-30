import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { render } from 'enzyme';
import { NeuronState } from '../reducers/network';

export interface IProps extends RouteComponentProps<any> {
    closeSelectedPanel: () => void,
    openSelectedPanel: () => void,
    selectedNeuron: NeuronState,
}

export interface IState {
    figures: Array<Object>,
}

const initialState: IState = {
    figures: []
}

export class SelectedPanel extends React.Component<IProps,IState> {
    props: IProps
    state: IState = initialState

    render() {
        
        return (
            <p>
                "Selected"
            </p>
        )
    }
}