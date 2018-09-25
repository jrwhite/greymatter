import * as React from 'react'
import { Point } from '../utils/geometry'
const d3 = require('d3')

export interface IProps {
    onRotate: (newTheta: number) => void,
    sensitivity: number,
    pivot: Point
}

export interface IState {
    mousePos?: Point,
    theta: number,
    selected: boolean
}

export class Rotate extends React.Component<IProps,IState> {
    props: IProps
    state: IState = { mousePos: undefined, theta: 0, selected: false }

    setSelected = (val: boolean) => {
        this.setState({ selected: val })
    }
    
    onDragStarted = () => {
       this.setSelected(true)
    }

    onDragged = () => {
        const {
            onRotate,
            sensitivity
        } = this.props

        const {
            mousePos,
            theta,
        } = this.state

        const newMousePos: Point = {
            ...d3.event
        }

        if (mousePos) {
            const newTheta = theta + sensitivity * (newMousePos.x - mousePos.x)
            onRotate(newTheta)

            this.setState({
                mousePos: newMousePos,
                theta: newTheta
            })
        } else {
            this.setState({
                mousePos: newMousePos
            })
        }
    }

    render () {
        const {
            onRotate
        } = this.props

        const {
            selected
        } = this.state

        return (
            <circle
                cx={10}
                cy={10}
                r={10}
                fill='red'
                ref={
                    node => d3.select(node)
                        .classed("selected", selected)
                        .call(
                            d3.drag()
                                .on("start", this.onDragStarted)
                                .on("drag", this.onDragged)
                        )
                }
            />
        )
    }

    renderD3() {

    }
}