import * as React from "react";
import * as Actions from "../actions/gym"
import { IState } from "../reducers";
import { createSelector } from "reselect";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";

/**
 * Gym Data Format:
 * 
 * Observations
 * Real valued observations in observation space
 * 
 * Actions:
 * -usually just one (e.g. 0,1)
 */

const getObservation = (state: IState, name: string): number => {
    return state.network.gym.observation[name]
}

const makeGetObservationState = () => 
    createSelector(getObservation, observation => ({
        observation: observation ? observation : undefined
    }))

//TODO: split this into components specific to data
// GymObservationData -- w/ observations selector
// GymActionData -- just the latest action value
// Don't put space info here. Accessor component already knows the space and name info


export interface IProps {
    name: string,
    //TODO: allow more than just numerical observations
    observation: number,
    onChange: (observation: number) => void;
}

export class GymObservationData extends React.Component<IProps> {
    props: IProps;

    componentDidUpdate() {
        const { observation, onChange} = this.props
        onChange(observation);
    }

    render() {
        return null
    }
}

const makeMapStateToProps = () => {
    const getObservationState = makeGetObservationState()
    return (state: IState, props: IProps) => getObservationState(state, props.name)
}

const mapDispatchToProps = (dispatch: Dispatch<IState>): Partial<IProps> => {
    return bindActionCreators(Actions as any, dispatch)
}

export default (connect(
    makeMapStateToProps,
    mapDispatchToProps
)(GymObservationData) as any) as React.StatelessComponent<Partial<IProps>>