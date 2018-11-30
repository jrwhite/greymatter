import * as React from 'react'
import { IzhikParams } from '../reducers/neurons'
import { ChangeIzhikParamsAction } from '../actions/neurons'
import { ControlGroup, Slider, Text } from '@blueprintjs/core'

const styles = require('./IzhikParamsControls.scss')

export interface IProps {
  onChange: (params: IzhikParams) => void
  izhikParams: IzhikParams
}

export class IzhikParamsControls extends React.Component<IProps> {
  props: IProps

  render () {
    const { izhikParams, onChange } = this.props

    const changeA = (a: number) => onChange({ ...izhikParams, a })
    const changeB = (b: number) => onChange({ ...izhikParams, b })
    const changeC = (c: number) => onChange({ ...izhikParams, c })
    const changeD = (d: number) => onChange({ ...izhikParams, d })

    return (
      <ControlGroup fill={false} vertical={true}>
        <Text>Recovery Decay Rate:</Text>
        <Slider
          min={0.02}
          max={0.1}
          stepSize={0.01}
          labelStepSize={0.01}
          value={izhikParams.a}
          onRelease={changeA}
        />
        <Text>Recovery Sensitivity:</Text>
        <Slider
          min={0.2}
          max={0.25}
          stepSize={0.005}
          labelStepSize={0.01}
          value={izhikParams.b}
          onRelease={changeB}
        />
        <Text>Hyperpolarized Potential:</Text>
        <Slider
          min={-65}
          max={-50}
          stepSize={1}
          labelStepSize={3}
          value={izhikParams.c}
          onRelease={changeC}
        />
        <Text>Hyperpolarized Recovery:</Text>
        <Slider
          min={0.05}
          max={8}
          stepSize={1}
          labelStepSize={1}
          value={izhikParams.d}
          onRelease={changeD}
        />
      </ControlGroup>
    )
  }
}
