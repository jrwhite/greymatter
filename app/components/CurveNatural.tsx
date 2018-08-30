import * as React from 'react'
import { Point, Line } from '../utils/geometry'
const d3 = require('d3')

export interface IProps {
    line: Line
}

export const CurveNatural: React.SFC<IProps> = (props) => {
    const {
        line
    } = props

    const lineSetter = d3.line()
        .x((d: Point) => d.x)
        .y((d: Point) => d.y)
        .curve(d3.curveNatural)

    return (
        <g>
            <path stroke='red'
                d={lineSetter([line.start, line.stop])}
            />
        </g>
    )
}