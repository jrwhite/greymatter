import * as React from 'react'
import { Point, Line, Curve } from '../utils/geometry'
const d3 = require('d3')

export interface IProps {
    curve: Curve
}

export const CurveNatural: React.SFC<IProps> = (props) => {
    const {
        curve
    } = props

    const lineSetter = d3.line()
        .x((d: Point) => d.x)
        .y((d: Point) => d.y)
        .curve(d3.curveNatural)

    return (
        <g>
            <path stroke='red'
                d={lineSetter(curve.points)}
            />
        </g>
    )
}