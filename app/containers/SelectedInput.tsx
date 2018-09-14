import * as React from 'react'
import { InputState } from '../reducers/network'
import * as _ from 'lodash'
import { IState } from '../reducers';
import { createSelector } from 'reselect';
import { Slider, Text } from '@blueprintjs/core';
import { Dispatch, bindActionCreators } from 'redux';
import * as NetworkActions from '../actions/network'
import { connect } from 'react-redux';

const getSelectedInput = (state: IState, props: IProps) =>
    state.network.inputs.find(
        (input: InputState) => input.id === props.id
    )

const makeGetSelecteInputState = () => createSelector(
    getSelectedInput,
    (selectedInput) => (
        {
            input: selectedInput
        }
    )
)

export interface IProps {
    changeInputRate: (payload: NetworkActions.ChangeInputRate) => void,
    id: string,
    input: InputState
}

export class SelectedInput extends React.Component<IProps> {
    props: IProps

    render () {
        const {
            id,
            input,
            changeInputRate
        } = this.props

        const sliderHandler = (value: number) => 
            changeInputRate({id: id, rate: value})
        
        return (
            <div>
            <Text>Input</Text>
            <Slider
                min={0}
                max={10}
                stepSize={0.1}
                labelStepSize={10}
                value={input.rate}
                onRelease={sliderHandler}
                vertical={false}
            />
            </div>
        )
    }
}

const makeMapStateToProps = () => {
    const getSelectedInputState = makeGetSelecteInputState()
    return (state: IState, props: IProps) => getSelectedInputState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>) : Partial<IProps> => {
    return bindActionCreators(NetworkActions as any, dispatch)
}

export default (connect(makeMapStateToProps, mapDispatchToProps)(SelectedInput) as any as React.StatelessComponent<Partial<IProps>>)