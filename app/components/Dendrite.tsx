import * as React from 'react'
import { DendStateType } from '../reducers/network'
import { Arc, Line as LineGeo, Point, calcDendLines, Ellipse } from '../utils/geometry'
import { Line } from './Line';
import { CurveNatural } from './CurveNatural';
const d3 = require('d3')
import * as _ from 'lodash'

export interface IProps {
    dend: DendStateType,
    bodyEllipse: Ellipse
}

export class Dendrite extends React.Component<IProps> {
    props: IProps

    render() {
        const {
            dend,
            bodyEllipse
        } = this.props

        const debugLine: LineGeo = {
            start: { ...dend.baseCpos },
            stop: { ...dend.synCpos }
        }

        const lines: Array<LineGeo> = calcDendLines(
            dend.synCpos,
            dend.arc,
            bodyEllipse
        )

        return (
            <g>
                <Line stroke='black' line={debugLine} /> // debug line
                {lines.map((l: LineGeo) =>
                    <CurveNatural
                        key={_.uniqueId('dl')}
                        line={l}
                    />
                )}
            </g>
        )
    }
}