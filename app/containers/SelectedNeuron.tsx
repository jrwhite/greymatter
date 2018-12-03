import * as React from 'react'
import { IzhikParams, NeuronState, DendState } from '../reducers/neurons'
import {
  ChangeIzhikParamsAction,
  ChangeDendWeightingAction,
  SetUseDefaultConfigAction,
  ChangeNeuronCurrentAction
} from '../actions/neurons'
import { IState } from '../reducers'
import { createSelector } from 'reselect'
import {
  Text,
  Slider,
  ControlGroup,
  Divider,
  Button,
  Checkbox,
  Switch
} from '@blueprintjs/core'
import { Dispatch, bindActionCreators, AnyAction } from 'redux'
import * as NetworkActions from '../actions/network'
import * as Actions from '../actions/neurons'
import * as ObservableActions from '../actions/observables'
import { connect } from 'react-redux'
import { DendList } from '../components/DendList'
import { AddNewObservableAction } from '../actions/observables'
import { ObservableEnum } from '../reducers/observables'
import {
  makeGetNeuronPotential,
  getNeuronFromId,
  makeGetNeuronPotRange,
  makeGetNeuronPeriodRange
} from '../selectors/neurons'

const getSelectedNeuron = (state: IState, props: IProps) =>
  state.network.neurons.find((neuron: NeuronState) => neuron.id === props.id)

const makeGetSelectedNeuronState = () =>
  createSelector(
    getSelectedNeuron,
    (selectedNeuron) => ({
      izhikParams: selectedNeuron!!.izhik.params,
      dends: selectedNeuron!!.dends,
      current: selectedNeuron!!.izhik.current,
      ...selectedNeuron
    })
  )

export interface IProps {
  changeDendWeighting: (payload: ChangeDendWeightingAction) => void
  changeNeuronCurrent: (payload: ChangeNeuronCurrentAction) => void
  changeIzhikParams: (payload: ChangeIzhikParamsAction) => void
  addNewObservable: (payload: AddNewObservableAction) => void
  setUseDefaultConfig: (payload: SetUseDefaultConfigAction) => void
  id: string
  izhikParams: IzhikParams
  dends: DendState[]
  useDefaultConfig: boolean
  current: number
}

export class SelectedNeuron extends React.Component<IProps> {
  props: IProps

  makeGetSelfPotential (id: string) {
    return (state: IState) => getNeuronFromId(state, id)!!.potential
  }

  makeGetSelfPeriod (id: string) {
    return (state: IState) => getNeuronFromId(state, id)!!.firePeriod
  }

  render () {
    const {
      setUseDefaultConfig,
      id,
      izhikParams,
      changeIzhikParams,
      changeNeuronCurrent,
      changeDendWeighting,
      dends,
      current,
      addNewObservable,
      useDefaultConfig
    } = this.props

    const addPotentialObservable = () => {
      addNewObservable({
        name: id.toString() + '-potential',
        type: ObservableEnum.Potential,
        getValue: this.makeGetSelfPotential(id),
        getRange: makeGetNeuronPotRange()
      })
    }

    const addPeriodObservable = () => {
      addNewObservable({
        name: id.toString() + '-period',
        type: ObservableEnum.Period,
        getValue: this.makeGetSelfPeriod(id),
        getRange: makeGetNeuronPeriodRange()
      })
    }

    // TODO: use IzhikParamsSliders instead

    const changeA = (a: number) =>
      changeIzhikParams({
        neuronId: id,
        params: { a }
      })
    const changeB = (b: number) =>
      changeIzhikParams({
        neuronId: id,
        params: { b }
      })
    const changeC = (c: number) =>
      changeIzhikParams({
        neuronId: id,
        params: { c }
      })
    const changeD = (d: number) =>
      changeIzhikParams({
        neuronId: id,
        params: { d }
      })
    const changeCurrent = (current: number) =>
      changeNeuronCurrent({
        neuronId: id,
        current
      })

    return (
      <div>
        <DendList dends={dends} neuronId={id} />
        <ControlGroup fill={false} vertical={true}>
          <Divider />
          <Text>Selected Neuron</Text>
          <Button
            text={'add potential observable'}
            onClick={() => addPotentialObservable()}
          />
          <Button
            text={'add firing rate observable'}
            onClick={() => addPeriodObservable()}
          />
          <Divider />
          <Checkbox
            checked={useDefaultConfig}
            label='Use default'
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setUseDefaultConfig({
                neuronId: id,
                useDefaultConfig: e.currentTarget.checked
              })
            }
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
          <Text>Current:</Text>
          <Slider
            min={0}
            max={20}
            stepSize={1}
            labelStepSize={2}
            value={current}
            onRelease={changeCurrent}
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
