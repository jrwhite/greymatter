import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Point } from '../utils/geometry';
import { Line } from './Line';

export interface IProps{
    axon?: {pos: Point},
    dend?: {pos: Point},
    mouse: any
}

export class GhostSynapse extends React.Component<IProps> {
    props: IProps

    render() {
        const {
            axon,
            dend,
            mouse
        } = this.props

        const line = axon ?
            {start: axon.pos, stop: mouse.pos}
            : dend ?
            {start: mouse.pos, stop: dend.pos}
            : undefined

        if (line) {
            return (
              <Line
                line={line}
                />
            )
        } else return <g></g>
    }
}
