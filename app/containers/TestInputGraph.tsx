import * as React from 'react'
import { IProps, TestInputGraph } from '../components/TestInputGraph'
import { IState } from '../reducers'
import { createSelector } from 'reselect'
import { TestInput } from '../reducers/testInputs'
import { connect, Dispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetworkActions, { mapAllDispatchToProps } from '../actions/network'

export interface IIProps {
  id: string
  width: number
  height: number
  rangeY: { start: number; stop: number }
}

const getTestInput = (state: IState, props: { id: string }): TestInput => {
  return state.network.testInputs.inputs.find(
    (testInput) => testInput.id === props.id
  )!!
}

const makeGetTestInputState = () =>
  createSelector(
    getTestInput,
    (testInput) => ({
      ...testInput
    })
  )

const makeMapStateToProps = () => {
  const getTestInputState = makeGetTestInputState()
  return (state: IState, props: IIProps): Partial<IProps> => ({
    ...props,
    rangeX: {
      start: state.network.testInputs.steps,
      stop: state.network.testInputs.maxSteps
    },
    controlPoints: getTestInputState(state, props).controlPoints
  })
}

export default (connect(
  makeMapStateToProps,
  (dispatch) => mapAllDispatchToProps<IProps>(dispatch)
)(TestInputGraph) as any) as React.StatelessComponent<Partial<IIProps>>
