import * as React from 'react'
import { DendStateType } from '../reducers/network'
import { Arc, Line as LineGeo, Point, calcDendCurves, Ellipse, Curve } from '../utils/geometry'
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

        const curves: Array<Curve> = calcDendCurves(
            dend.synCpos,
            5,
            10,
            dend.arc,
            bodyEllipse
        )

        return (
            <g>
                <Line stroke='black' line={debugLine} /> // debug line
                {curves.map((curve: Curve) =>
                    // <CurveNatural
                    //     key={_.uniqueId('dl')}
                    //     curve={curve}
                    // />
                    curve.points.map(p => 
                        <circle cx={p.x} cy={p.y} r={2} />
                    )
                    
                )}
            </g>
        )
    }
}