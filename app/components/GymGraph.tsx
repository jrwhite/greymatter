import * as React from 'react'
import { IIProps } from '../containers/GymGraph'
import { GraphLine } from './GraphLine'
import GymObservationData from '../containers/GymObservationData'
import { ScaledLine } from './ScaledLine'
import { ControlGroup, Checkbox } from '@blueprintjs/core'

export interface IProps extends IIProps {
  observations: number[] // list of observation indexes to show
  //   observationDomains: []
}

export interface ObsLine {
  index: number
  color: string
  range: { start: number; stop: number }
  show: boolean
}

export interface IState {
  obsLines: ObsLine[]
}

export class GymGraph extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {
    obsLines: [
      { index: 0, color: 'blue', range: { start: -5, stop: 5 }, show: true },
      { index: 1, color: 'red', range: { start: -5, stop: 5 }, show: true },
      { index: 2, color: 'green', range: { start: -1, stop: 1 }, show: true },
      { index: 3, color: 'purple', range: { start: -5, stop: 5 }, show: true }
    ]
  }

  render () {
    const lineProps = {
      color: 'blue',
      width: 200,
      height: 400,
      maxN: 50
    }
    const { obsLines } = this.state
    return (
      <div>
        <ControlGroup vertical={true}>
          {obsLines.map((obs) => {
            return (
              <Checkbox
                key={obs.index}
                checked={obs.show}
                onChange={() =>
                  this.setState({
                    obsLines: obsLines.map((prev) => {
                      if (prev.index === obs.index) {
                        return { ...obs, show: !obs.show }
                      } else {
                        return prev
                      }
                    })
                  })
                }
              >
                {obs.index}
              </Checkbox>
            )
          })}
        </ControlGroup>
        <svg>
          {obsLines.map((obs) => {
            return (
              <g display={obs.show ? undefined : 'none'} key={obs.index}>
                <ScaledLine {...lineProps} {...obs}>
                  <GymObservationData index={obs.index} />
                </ScaledLine>
              </g>
            )
          })}
        </svg>
      </div>
    )
  }
}
