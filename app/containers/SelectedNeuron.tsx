import * as React from 'react'
import {
  IzhikParams,
  NeuronState,
  DendState,
  AxonState,
  AxonType
} from '../reducers/neurons'
import {
  ChangeIzhikParamsAction,
  ChangeDendWeightingAction,
  SetUseDefaultConfigAction,
  ChangeNeuronCurrentAction,
  SetAxonTypeAction
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
  Switch,
  RadioGroup,
  Radio
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
import { IzhikParamsControls } from '../components/IzhikParamsControls';

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
  setAxonType: (payload: SetAxonTypeAction) => void
  changeDendWeighting: (payload: ChangeDendWeightingAction) => void
  changeNeuronCurrent: (payload: ChangeNeuronCurrentAction) => void
  changeIzhikParams: (payload: ChangeIzhikParamsAction) => void
  addNewObservable: (payload: AddNewObservableAction) => void
  setUseDefaultConfig: (payload: SetUseDefaultConfigAction) => void
  id: string
  izhikParams: IzhikParams
  dends: DendState[]
  axon: AxonState
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

  onIzhikParamsChange (params: IzhikParams) {
    const { changeIzhikParams, id } = this.props
    changeIzhikParams({ neuronId: id, params })
  }

  render () {
    const {
      setUseDefaultConfig,
      setAxonType,
      id,
      izhikParams,
      changeIzhikParams,
      changeNeuronCurrent,
      changeDendWeighting,
      dends,
      axon,
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
          <RadioGroup
            label='Transmitter Type'
            onChange={(value) =>
              setAxonType({
                id,
                type:
                  value.type === 'Excitatory'
                    ? AxonType.Excitatory
                    : value.type === 'Inhibitory'
                    ? AxonType.Inhibitory
                    : AxonType.Volume
              })
            }
            selectedValue={axon.type}
          >
            <Radio label={'Excitatory'} value={AxonType.Excitatory} />
            <Radio label={'Inhibitory'} value={AxonType.Inhibitory} />
            <Radio label={'Volume'} value={AxonType.Volume} />
          </RadioGroup>
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
          <IzhikParamsControls
            izhikParams={izhikParams}
            onChange={(params: IzhikParams) => this.onIzhikParamsChange(params)}
          />
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
