import * as React from 'react'
const PotentialGraphLine = require( '../containers/PotentialGraphLine')
const d3 = require('d3')

export interface IProps {
    neurons: Array<{id: string, color: string}>,
    // scaleX: number,
    // rangeX: {start: number, stop: number},
    // scaleY: number,
    // rangeY: {start: number, stop: number},
}

export class PotentialGraph extends React.Component<IProps> {
    props: IProps

    render () {
        const {
            neurons,
            // scaleX,
            // rangeX,
            // scaleY,
            // rangeY
        } = this.props

        return (
            <g>
                {neurons.map((neuron: {id: string, color: string}) =>
                    <PotentialGraphLine
                        key={neuron.id}
                        {...neuron}
                        deltaX={10}
                        height={100}
                        maxN={50}
                    />
                )}
            </g>
        )
    }
}