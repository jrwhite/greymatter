import * as React from 'react'
import { IIProps } from '../containers/GymGraph'
import { GraphLine } from './GraphLine'
import GymObservationData from '../containers/GymObservationData'
import { ScaledLine } from './ScaledLine'

export interface IProps extends IIProps {
  observations: number[]
  //   observationDomains: []
}

export interface IState {}

export class GymGraph extends React.Component<IProps, IState> {
  props: IProps
  state: IState

  render () {
    const lineProps = {
      color: 'blue',
      width: 200,
      height: 400,
      maxN: 50
    }
    return (
      <svg>
        <ScaledLine
          {...lineProps}
          color={'blue'}
          range={{ start: -5, stop: 5 }}
        >
          <GymObservationData index={0} />
        </ScaledLine>
        <ScaledLine
          {...lineProps}
          color={'green'}
          range={{ start: -5, stop: 5 }}
        >
          <GymObservationData index={1} />
        </ScaledLine>
        <ScaledLine
          {...lineProps}
          color={'purple'}
          range={{ start: -1, stop: 1 }}
        >
          <GymObservationData index={2} />
        </ScaledLine>
        <ScaledLine
          {...lineProps}
          color={'orange'}
          range={{ start: -5, stop: 5 }}
        >
          <GymObservationData index={3} />
        </ScaledLine>
      </svg>
    )
  }
}
