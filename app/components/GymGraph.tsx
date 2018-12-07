import * as React from 'react'
import { IIProps } from '../containers/GymGraph'
import { GraphLine } from './GraphLine'
import GymObservationData from '../containers/GymObservationData'
import { ScaledLine } from './ScaledLine'
import { ControlGroup, Checkbox } from '@blueprintjs/core'
import { dataColors } from '../utils/encoding'
import GymActionData from '../containers/GymActionData'

const styles = require('./GymGraph.scss')
export interface IProps extends IIProps {
  observations: number[] // list of observation indexes to show
  gymShouldreset?: boolean
  //   observationDomains: []
}

export interface ObsLine {
  index: number
  color: string
  range: { start: number; stop: number }
  show: boolean
}

export interface ActionLine {
  color: string
  range: { start: number; stop: number }
}

export interface IState {
  obsLines: ObsLine[]
  actionLine: ActionLine
}

export class GymGraph extends React.Component<IProps, IState> {
  props: IProps
  state: IState = {
    obsLines: [
      {
        index: 0,
        color: dataColors[0],
        range: { start: -1, stop: 1 },
        show: true
      },
      {
        index: 1,
        color: dataColors[1],
        range: { start: -5, stop: 5 },
        show: true
      },
      {
        index: 2,
        color: dataColors[2],
        range: { start: -1, stop: 1 },
        show: true
      },
      {
        index: 3,
        color: dataColors[3],
        range: { start: -5, stop: 5 },
        show: true
      }
    ],
    actionLine: {
      color: dataColors[4],
      range: { start: 0, stop: 1 }
    }
  }

  render () {
    const obsLineProps = {
      color: 'blue',
      width: 200,
      height: 400,
      maxN: 50
    }
    const actionLineProps = {
      color: 'blue',
      width: 200,
      height: 400,
      maxN: 50
    }
    const { obsLines, actionLine } = this.state
    return (
      <div style={{ display: 'flex' }}>
        <ControlGroup vertical={true} fill={false}>
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
        <svg className={styles.graph}>
          {obsLines.map((obs) => {
            return (
              <g display={obs.show ? undefined : 'none'} key={obs.index}>
                <ScaledLine {...obsLineProps} {...obs}>
                  <GymObservationData index={obs.index} />
                </ScaledLine>
              </g>
            )
          })}
          <ScaledLine {...actionLineProps} {...actionLine}>
            <GymActionData />
          </ScaledLine>
        </svg>
      </div>
    )
  }
}
