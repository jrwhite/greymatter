import * as React from 'react'
import * as _ from 'lodash'
import { removeListener } from 'cluster'
import { render } from 'enzyme'
import { DataSource, IProps as DataProps } from '../containers/DataSource'
import { GymObservationData } from '../containers/GymObservationData'
import { connect } from 'react-redux'

const d3 = require('d3')

export interface IProps {
  children: React.ReactElement<DataProps>
  color?: string
  deltaX?: number
  height?: number
  maxN?: number
  rangeY?: { start: number; stop: number }
}

export interface IState {
  pathData: number[]
  n: number
}

export class GraphLine extends React.Component<Partial<IProps>, IState> {
  props: IProps
  state: IState = {
    pathData: [],
    n: 0
  }

  // TODO: separate logic into buffered data holder if this logic isnt going to use d3
  onChange = (newData: number) => {
    const { pathData, n } = this.state
    const { maxN } = this.props
    // Check that prop was injected by parent component
    if (!maxN) return

    // buffer the new data
    this.setState({
      pathData: _.concat(pathData, newData),
      n: n + 1
    })

    // shift as FIFO
    if (n > maxN) {
      this.setState({
        pathData: _.tail(pathData),
        n: n - 1
      })
    }
  }

  // TODO: figure out how to use transition setter
  //   transitionSetter = d3
  //     .transition()
  //     .duration()
  //     .ease(d3.easeLinear)
  //     .on('end', this.shift)

  render () {
    const { color, deltaX, height, rangeY } = this.props
    // These props MUST be injected by parent component:
    if (!deltaX || !height || !rangeY) return undefined

    const { pathData } = this.state

    const y = d3
      .scaleLinear()
      .domain([rangeY.stop, rangeY.start])
      .range([0, height])

    const lineSetter = d3
      .line()
      .x((d: number, i: number) => i * deltaX)
      .y((d: number) => y(d))

    const padding = 20

    return (
      // <g transform={'translate(' + padding + ',' + padding + ')'}>
      <g>
        <path
          fill='none'
          stroke='red'
          ref={(node) => d3.select(node).attr('d', lineSetter(pathData))}
        />
        {this.renderChildren()}
      </g>
    )
  }

  renderChildren () {
    return React.cloneElement(this.props.children, {
      onChange: this.onChange
    })
  }
}
