import * as React from 'react'
const d3 = require('d3')
import * as _ from 'lodash'
import { CanvasPath_D3Shape, Selection } from 'd3';
import { RouteComponentProps } from 'react-router';
import { Text } from '@blueprintjs/core';

export interface IProps extends RouteComponentProps<any>{
    id: string,
    potential: number,
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

    componentDidUpdate (prevProps: IProps, prevState: IState) {
        // this.renderD3()
        if (this.state.n !== prevState.n) {}
    }

    static getDerivedStateFromProps () {
        
    }

    render() {

        const {
            potential,
            color,
            deltaX,
            id,
            height
        } = this.props

        const {
            // container,
            // path,
            pathData,
            n
        } = this.state

        // const y = d3.scale.linear()
        //     .domain([0, 100])
        //     .range([height, 0])

        const lineSetter = d3.line()
            .x((d: number, i: number) => i * deltaX)
            .y((d: number) => d)

        // add point
        this.setState(
            {
                pathData: _.concat(pathData, potential),
                n: n+1
            }
        )
                {/* <path 
                    ref={node => d3.select(node).attr("d",
                        lineSetter(pathData)
                    )}
                /> */}
        return (
            <g>
                <path
                    stroke='red'
                    id={id}
                    d={lineSetter(pathData)}
                />
            </g>
        )
    }

    // renderD3() {
    //     const {
    //         potential,
    //         maxN,
    //         deltaX
    //     } = this.props

    //     const {
    //         path,
    //         pathData,
    //         n
    //     } = this.state

    //     // remove last point
    //     const shift = () => {
    //         if (n > maxN) {
    //             this.setState(
    //                 {
    //                     pathData: _.tail(pathData),
    //                     n: n - 1
    //                 }
    //             )
    //         }
    //     }

    //     // slide line left
    //     const transitionSetter = d3.transition()
    //         .duration(100)
    //         .ease(d3.easeLinear)
    //         .on("end", shift)

    //     path.attr('transform', null)
    //         .transition(transitionSetter)
    //         .attr('transform', 'translate(' + deltaX + ')')
    // }
}