import * as ConfigActions from './config'
import * as NeuronActions from './neurons'
import * as InputActions from './inputs'
import * as SynapseActions from './synapses'
import * as GymActions from './gym'
import * as GhostSynapseActions from './ghostSynapse'
import * as EncodingActions from './encodings'

const NetworkActions: any = {
  ...ConfigActions,
  ...NeuronActions,
  ...InputActions,
  ...SynapseActions,
  ...GymActions,
  ...GhostSynapseActions,
  ...EncodingActions
}

export default NetworkActions
