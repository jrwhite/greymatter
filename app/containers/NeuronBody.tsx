import * as React from 'react'
import { DendState } from '../reducers/neurons'
import { IState } from '../reducers'
import { IProps, NeuronBody } from '../components/NeuronBody'
import { DendList } from '../components/DendList'
import { DendPos } from '../actions/neurons'
import { connect } from 'react-redux'
import { DendProps } from '../components/Dendrite'
import { Point, Arc } from '../utils/geometry'
import { createSelector } from 'reselect'

export interface IIProps {
  id: string
  dends: DendState[]
  theta: number
  bodyArcs: Arc[]
}

export interface InjectedDendProps {
  synCpos: Point
  arc: Arc
  weighting: number
}

const mapStateToProps = (state: IState, props: IIProps): IProps => {
  return {
    ...props,
    dends: props.dends.map(
      (d): InjectedDendProps => ({
        synCpos: d.synCpos,
        arc: d.arc,
        weighting: d.weighting
      })
    )
  }
}

export default (connect(mapStateToProps)(
  NeuronBody as any
) as any) as React.Component<IProps>
