// import * as React from 'react'
// import { Ellipse, Arc } from '../utils/geometry'
// import { makeGetEncodedValueById } from '../selectors/encodings'
// import { IState } from '../reducers'
// import {
//   DendProps,
//   Dendrite as RenderDend,
//   Dendrite
// } from '../components/Dendrite'
// import { getDendFromId, getNeuronFromId } from '../selectors/neurons'
// import { createSelector } from 'reselect'
// import { DendState } from '../reducers/neurons'
// import { connect } from 'react-redux'

// export interface IIProps {
//   id: string
//   neuronId: string
//   bodyEllipse: Ellipse
//   arc: Arc
//   overlap: number
// }

// const getDendState = (state: IState, props: IIProps): DendState => {
//   const neuron = getNeuronFromId(state, props.neuronId)!!
//   return getDendFromId(neuron, props.id)!!
// }

// const makeGetDendState = () =>
//   createSelector(
//     getDendState,
//     (dend) => ({
//       synCpos: dend.synCpos,
//       weighting: dend.weighting,
//       baseCpos: dend.baseCpos,
//       incomingAngle: dend.incomingAngle,
//       nu: dend.nu
//     })
//   )

// const makeMapStateToProps = () => {
//   // const getSourceValue = makeGetEncodedValueById()
//   const getDendState = makeGetDendState()
//   return (state: IState, props: IIProps): DendProps => ({
//     ...props,
//     ...getDendState(state, props)
//     // sourceVal: getSourceValue(state, getDendState(state, props).sourceId)
//   })
// }

// export default (connect(makeMapStateToProps())(
//   Dendrite as any
// ) as any) as React.StatelessComponent<IIProps>
