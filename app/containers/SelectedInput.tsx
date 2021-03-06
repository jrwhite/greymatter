import * as React from 'react'
import { InputState } from '../reducers/inputs'
import * as _ from 'lodash'
import { IState } from '../reducers'
import { createSelector } from 'reselect'
import { Slider, Text, Divider, Button } from '@blueprintjs/core'
import { Dispatch, bindActionCreators, AnyAction } from 'redux'
import * as Actions from '../actions/inputs'
import { connect } from 'react-redux'
import { remote, ipcRenderer } from 'electron'

const getSelectedInput = (state: IState, props: IProps) =>
  state.network.inputs.find((input: InputState) => input.id === props.id)

const makeGetSelecteInputState = () =>
  createSelector(getSelectedInput, (selectedInput) => ({
    input: selectedInput
  }))

export interface IProps {
  changeInputRate: (payload: Actions.ChangeInputRate) => void
  changeInputHotkey: (payload: Actions.ChangeInputHotkeyAction) => void
  id: string
  input: InputState
}

export interface IIState {
  listenForHotkey: boolean
}

export class SelectedInput extends React.Component<IProps, IIState> {
  props: IProps
  state: IIState = { listenForHotkey: false }

  render () {
    const { id, input, changeInputRate, changeInputHotkey } = this.props

    const sliderHandler = (value: number) =>
      changeInputRate({ id, rate: value })

    return (
      <div>
        <Divider />
        <Text>Input</Text>
        <Divider />
        <Slider
          min={0}
          max={10}
          stepSize={1}
          labelStepSize={10}
          value={input.rate}
          onRelease={sliderHandler}
          vertical={false}
        />
        <Divider />
        <Button
          onClick={() => this.setState({ listenForHotkey: true })}
          onKeyPress={(e: any) => changeInputHotkey({ id, hotkey: e.key })}
        >
          Add Hotkey
        </Button>
        <Text>{input.hotkey}</Text>
      </div>
    )
  }
}

const makeMapStateToProps = () => {
  const getSelectedInputState = makeGetSelecteInputState()
  return (state: IState, props: IProps) => getSelectedInputState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Partial<IProps> => {
  return bindActionCreators(Actions as any, dispatch)
}

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SelectedInput) as any) as React.StatelessComponent<Partial<IProps>>
