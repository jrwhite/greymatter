import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { render } from 'enzyme';
import { NeuronState } from '../reducers/network';
import { Button } from '@blueprintjs/core'

export interface IProps {
    // closeSelectedPanel: () => void,
    // openSelectedPanel: () => void,
    // selectedNeuron: NeuronState,
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
            <div>
            <p>
                "Selected"
            </p>
            <Button icon='refresh' />
            </div>

        )
    }
}