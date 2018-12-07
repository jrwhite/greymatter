import * as React from 'react'
import { IState } from '../reducers'
import { IProps, GymGraph } from '../components/GymGraph'
import { connect } from 'react-redux'

export interface IIProps {}

const mapStateToProps = (state: IState, props: IIProps): IProps => ({
  observations: state.network.gym.observations,
  gymShouldreset: state.network.gym.shouldReset
})

export default (connect(mapStateToProps)(
  GymGraph
) as any) as React.StatelessComponent<IIProps>
