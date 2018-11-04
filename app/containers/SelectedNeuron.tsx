import * as React from 'react'
import { IzhikParams, NeuronState, DendState } from '../reducers/neurons'
import {
  ChangeIzhikParamsAction,
  ChangeDendWeightingAction
} from '../actions/neurons'
import { IState } from '../reducers'
import { createSelector } from 'reselect'
import { Text, Slider, ControlGroup, Divider, Button } from '@blueprintjs/core'
import { Dispatch, bindActionCreators, AnyAction } from 'redux'
import * as NetworkActions from '../actions/network'
import * as Actions from '../actions/neurons'
import * as ObservableActions from '../actions/observables'
import { connect } from 'react-redux'
import { DendList } from '../components/DendList'
import { AddNewObservableAction } from '../actions/observables'
import { ObservableType } from '../reducers/observables'
import { makeGetNeuronPotential } from '../selectors/neuron'

const getSelectedNeuron = (state: IState, props: IProps) =>
  state.network.neurons.find((neuron: NeuronState) => neuron.id === props.id)

const makeGetSelectedNeuronState = () =>
  createSelector(getSelectedNeuron, (selectedNeuron) => ({
    izhikParams: selectedNeuron!!.izhik.params,
    dends: selectedNeuron!!.dends
  }))

export interface IProps {
  changeDendWeighting: (payload: ChangeDendWeightingAction) => void
  changeIzhikParams: (payload: ChangeIzhikParamsAction) => void
  addNewObservable: (payload: AddNewObservableAction) => void
  id: string
  izhikParams: IzhikParams
  dends: DendState[]
}

export class SelectedNeuron extends React.Component<IProps> {
  props: IProps

  render () {
    const {
      id,
      izhikParams,
      changeIzhikParams,
      changeDendWeighting,
      dends,
      addNewObservable
    } = this.props

    const addPotentialObservable = () => {
      addNewObservable({
        name: id.toString(),
        type: ObservableType.Potential,
        getValue: (state: any) => makeGetNeuronPotential()(state, id)
      })
    }

    const changeA = (a: number) =>
      changeIzhikParams({
        id,
        params: { a }
      })
    const changeB = (b: number) =>
      changeIzhikParams({
        id,
        params: { b }
      })
    const changeC = (c: number) =>
      changeIzhikParams({
        id,
        params: { c }
      })
    const changeD = (d: number) =>
      changeIzhikParams({
        id,
        params: { d }
      })

    return (
      <div>
        <DendList dends={dends} />
        <ControlGroup fill={false} vertical={true}>
          <Divider />
          <Text>Selected Neuron</Text>
          <Button
            text={'add observable'}
            onClick={() => addPotentialObservable()}
          />
          <Divider />
          <Text>Izhik 'a':</Text>
          <Slider
            min={0.02}
            max={0.1}
            stepSize={0.01}
            labelStepSize={0.01}
            value={izhikParams.a}
            onRelease={changeA}
          />
          <Text>Izhik 'b':</Text>
          <Slider
            min={0.2}
            max={0.25}
            stepSize={0.005}
            labelStepSize={0.01}
            value={izhikParams.b}
            onRelease={changeB}
          />
          <Text>Izhik 'c':</Text>
          <Slider
            min={-65}
            max={-50}
            stepSize={1}
            labelStepSize={3}
            value={izhikParams.c}
            onRelease={changeC}
          />
          <Text>Izhik 'd':</Text>
          <Slider
            min={0.05}
            max={8}
            stepSize={1}
            labelStepSize={1}
            value={izhikParams.d}
            onRelease={changeD}
          />
          <Divider />
          <Text>Dendrites:</Text>
          {dends.map((d) => (
            <Slider
              min={0}
              max={100}
              stepSize={1}
              labelStepSize={20}
              value={d.weighting}
              onRelease={(w: number) =>
                changeDendWeighting({
                  neuronId: id,
                  dendId: d.id,
                  weighting: w
                })
              }
            />
          ))}
        </ControlGroup>
      </div>
    )
  }
}

const makeMapStateToProps = () => {
  const getSelectedNeuronState = makeGetSelectedNeuronState()
  return (state: IState, props: IProps) => getSelectedNeuronState(state, props)
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): Partial<IProps> => {
  return {
    ...bindActionCreators(Actions as any, dispatch),
    ...bindActionCreators(ObservableActions as any, dispatch)
  }
}

export default (connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SelectedNeuron) as any) as React.StatelessComponent<Partial<IProps>>
