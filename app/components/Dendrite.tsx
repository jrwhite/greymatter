import * as React from 'react'
import { DendStateType } from '../reducers/network'
import { Arc } from '../utils/geometry'
import { Line } from './Line';
import { Ellipse } from './Ellipse';

export interface IProps {
    dend: DendStateType
}

export const Dendrite: React.SFC<IProps> = (props) => {
    const {
       dend
    } = props

    const line = {
        start: {...dend.cpos},
        stop: {
            x: Math.cos(dend.nu) * 10,
            y: Math.sin(dend.nu) * 10
        }
    }

    return (
        <Line stroke='red' line={line} />
        // <Ellipse major={50} minor={30} theta={0} arcs={[dend.arc]} />
    )
}