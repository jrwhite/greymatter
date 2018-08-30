import { createSelector } from 'reselect'
import { IState } from '../reducers'
import { IProps } from '../components/Input'

const getInput = (state: IState, props: IProps) => 
    state.network.inputs.find(n => n.id === props.id)


export const makeGetInputState = () => createSelector(
    getInput,
    input => (
        {...input}
    )
)