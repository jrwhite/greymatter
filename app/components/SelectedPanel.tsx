import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { render } from 'enzyme';
import { NeuronState, SelectedNeuronState } from '../reducers/network';
import { Button } from '@blueprintjs/core'
import { PotentialGraph } from './PotentialGraph';

export interface IProps {
    closeSelectedPanel?: () => void,
    openSelectedPanel?: () => void,
    selectedNeurons: Array<SelectedNeuronState>,
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
        const {
            selectedNeurons
        } = this.props
        
        return (
            <div>
            <p>
                "Selected"
            </p>
            <svg>
                {(selectedNeurons.length > 0) ?
                    <PotentialGraph
                        neurons={selectedNeurons}
                        scaleX={1}
                        rangeX={50}
                        scaleY={1}
                        rangeY={{ start: -150, stop: 150 }}
                    />
                    :
                    undefined
                }
            </svg>
            <Button icon='refresh' />
            </div>

        )
    }
}