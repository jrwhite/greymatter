import * as React from 'react'
const d3 = require('d3')
import * as _ from 'lodash'
import { CanvasPath_D3Shape, Selection } from 'd3';
import { RouteComponentProps } from 'react-router';
import { Text } from '@blueprintjs/core';
import NeuronPotentialData from '../containers/NeuronPotentialData';

export interface IProps{
    id: string,
    color: string,
    deltaX: number,
    height: number,
    maxN: number,
}

export interface IState {
    // container: Selection<SVGGElement,{},null,null>,
    // path: Selection<SVGPathElement,number,SVGGElement,{}>,
    pathData: Array<number>,
    n: number,
}

export class PotentialGraphLine extends React.Component<IProps,IState> {
    props: IProps
    state: IState = {
        pathData: [],
        n: 0,
    }

    // componentWillMount () {
    //     const container = d3.create('g')
    //     this.setState(
    //         {
    //             container: container,
    //             path: container.append('path')
    //         }
    //     )
    // }

    onChange = (potential: number) => {
        const {
            pathData,
            n
        } = this.state
        this.setState(
            {
                pathData: _.concat(pathData, potential),
                n: n+1
            }
        )
        this.shift()
    }

    shift = () => {
        if (this.state.n > this.props.maxN) {
            this.setState(
                {
                    pathData: _.tail(this.state.pathData),
                    n: this.state.n - 1
                }
            )
        }
    }

    transitionSetter = d3.transition()
            .duration(100)
            .ease(d3.easeLinear)
            .on("end", this.shift)

    render() {

        const {
            color,
            deltaX,
            id,
            height
        } = this.props

        const {
            pathData
        } = this.state

        // const y = d3.scale.linear()
        //     .domain([0, 100])
        //     .range([height, 0])

        const lineSetter = d3.line()
            .x((d: number, i: number) => i * deltaX)
            .y((d: number) => d)

        
                {/* <path 
                    ref={node => d3.select(node).attr("d",
                        lineSetter(pathData)
                    )}
                /> */}
        return (
            <g>
                {/* <path
                    stroke='red'
                    id={id}
                    d={lineSetter(pathData)}
                /> */}
                <path 
                    stroke='red'
                    ref={
                        node => d3.select(node)
                        .attr("d", lineSetter(pathData))
                        // .attr('transform', null)
                        // .transition(this.transitionSetter)
                        // .attr('transform', 'translate(' + deltaX + ')')
                    }
                />
                <NeuronPotentialData
                    id={id}
                    onChange={this.onChange}
                />
            </g>
        )
    }
}