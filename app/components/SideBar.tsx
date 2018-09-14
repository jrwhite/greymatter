import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { render } from 'enzyme';
import { NeuronState, SelectedNeuronState, SelectedInputState } from '../reducers/network';
import { Button, Text, Slider } from '@blueprintjs/core'
import { PotentialGraph } from './PotentialGraph';
import SelectedInput from '../containers/SelectedInput';
const d3 = require('d3')

const styles = require('./SideBar.scss')

export interface IProps {
    closeSelectedPanel?: () => void,
    openSelectedPanel?: () => void,
    selectedNeurons: Array<SelectedNeuronState>,
    selectedInputs: Array<SelectedInputState>,
}

export interface IState {
    figures: Array<Object>,
}

const initialState: IState = {
    figures: []
}

export class SideBar extends React.Component<IProps,IState> {
    props: IProps
    state: IState = initialState

    render() {
        const {
            selectedNeurons,
            selectedInputs
        } = this.props
        
        return (

            <div>
            {/* <p>
                "Selected"
            </p> */}
            <svg
                height={300}
                width={300}
            >
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
            {(selectedInputs.length > 0) ?
                <div
                    className={styles.input}
                >
                <SelectedInput
                    id={selectedInputs[0].id}
                    />
                </div>
                :
                undefined
            }
            <Button icon='refresh' />
            </div>

        )
    }
}