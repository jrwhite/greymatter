import * as React from 'react'
import { IState } from '../reducers/index'
import { createSelector } from 'reselect'
import { DataSource, IProps as DataProps } from './DataSource'
import { connect } from 'react-redux'

// TODO: move this to a gym selector file
const getObservationState = (state: IState, props: { index: number }) => {
  return state.network.gym.observations[props.index]
}

const makeGetObservationState = () =>
  createSelector(
    getObservationState,
    (observation) => ({
      data: observation ? observation : undefined
    })
  )

const makeMapStateToProps = () => {
  const getObservationState = makeGetObservationState()
  return (state: IState, props: IProps) => getObservationState(state, props)
}

export interface IProps extends DataProps {
  index: number
}

export class GymObservationData extends DataSource {
  props: IProps
}

export default (connect(makeMapStateToProps)(
  GymObservationData
) as any) as React.StatelessComponent<Partial<IProps>>
