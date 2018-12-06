import { createSelector } from 'reselect'
import { IState } from '../reducers'
import { Dispatch, connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NetworkActions from '../actions/network'
import { DendInfo, IProps as IIProps } from '../components/DendInfo'
import { EncodedSourceState } from '../reducers/encodings'
import { getSynapse } from '../selectors/synapses'
import { SynapseState } from '../reducers/synapses'
import { SourceItem } from '../items/source'

export interface IProps {
  id: string
  neuronId: string
  index: number
  weighting: number
  synapseId: string
}

// selector needs to take DendState and give DendItem

const getSource = (state: IState, id: string): EncodedSourceState =>
  state.network.encodings.find((s) => s.id === id)!!

const getSourceItem = (state: IState, id: string) => {
  const source: EncodedSourceState = getSource(state, id)

  return {
    id: source.id,
    name: source.name,
    type: source.type
  }
}

const getSynapseSourceItem = (
  state: IState,
  props: IProps
): SourceItem | undefined => {
  const synapse: SynapseState | undefined = getSynapse(state, props)
  if (synapse) {
    return getSourceItem(state, synapse.id)
  } else {
    return undefined
  }
}

const makeGetSourceItemState = () =>
  createSelector(getSynapseSourceItem, (sourceItem) => ({
    source: sourceItem ? { ...sourceItem } : undefined
  }))

const getDendItem = (state: IState, props: IProps) => ({
  id: props.id,
  index: props.index,
  weighting: props.weighting,
  source: getSynapseSourceItem(state, props),
  sourceItems: state.network.encodings
})

const makeGetDendItemState = () =>
  createSelector(getDendItem, (dendItem) => ({ ...dendItem }))

const makeMapStateToProps = () => {
  const getSourceItem = makeGetSourceItemState()
  return (state: IState, props: IProps): Partial<IIProps> => ({
    id: props.id,
    index: props.index,
    weighting: props.weighting,
    sourceItems: state.network.encodings,
    ...getSourceItem(state, props)
  })
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IIProps> => {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(DendInfo)
