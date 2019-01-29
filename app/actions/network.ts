import * as ConfigActions from './config'
import * as NeuronActions from './neurons'
import * as InputActions from './inputs'
import * as SynapseActions from './synapses'
import * as GymActions from './gym'
import * as GhostSynapseActions from './ghostSynapse'
import * as EncodingActions from './encodings'
import * as ObservableActions from './observables'
import * as VolumeActions from './volume'
import * as TestInputActions from './testInputs'
import { Dispatch } from 'react-redux'
import { IState } from '../reducers'
import { bindActionCreators } from 'redux'

const NetworkActions: any = {
  ...ConfigActions,
  ...NeuronActions,
  ...InputActions,
  ...SynapseActions,
  ...GymActions,
  ...GhostSynapseActions,
  ...EncodingActions,
  ...ObservableActions,
  ...VolumeActions,
  ...TestInputActions
}

export function mapAllDispatchToProps<T> (
  dispatch: Dispatch<IState>
): Partial<T> {
  return bindActionCreators(NetworkActions as any, dispatch)
}

export default NetworkActions
