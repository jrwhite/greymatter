import {normalize, schema} from 'normalizr'

const dend = new schema.Entity('dends')

const neuron = new schema.Entity('neurons', {
    dends: [dend]
})