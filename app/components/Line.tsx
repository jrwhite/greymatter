import * as React from 'react'
import { Line as LineGeo } from '../utils/geometry';
import { render } from 'enzyme';

export interface IProps {
    line: LineGeo,
    stroke?: string
}

export class Line extends React.Component<IProps> {
    props: IProps

    render() {
        const {
            line
        } = this.props

        return (
            <g>
                <line
                    stroke={this.props.stroke ? this.props.stroke : 'blue'}
                    x1={line.start.x} x2={line.stop.x}
                    y1={line.start.y} y2={line.stop.y}
                />
            </g>
        )
    }
}