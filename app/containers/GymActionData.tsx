import * as React from 'react'
import { IState } from '../reducers/index'
import { createSelector } from 'reselect'
import { DataSource, IProps as DataProps } from './DataSource'
import { connect } from 'react-redux'

// hack to update data in sync with gym steps

const mapStateToProps = (state: IState): Partial<IProps> => ({
  data: state.network.gym.action,
  shouldStep: state.network.gym.shouldStep
})

export interface IProps extends DataProps {}

export class GymActionData extends DataSource {
  props: IProps
}

export default (connect(mapStateToProps)(
  GymActionData
) as any) as React.StatelessComponent<Partial<IProps>>
