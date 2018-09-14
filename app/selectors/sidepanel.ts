import { IState } from "../reducers";
import { IProps } from "../components/SideBar";
import { createSelector } from "reselect";

const getSelectedNeurons = (state: IState, props: IProps) =>
    state.network.config.selectedNeurons

const getSelectedInputs = (state: IState, props: IProps) => 
    state.network.config.selectedInputs

export const makeGetSidepanelState = () => createSelector(
    getSelectedNeurons,
    getSelectedInputs,
    (selectedNeurons, selectedInputs) => (
        {
            selectedNeurons: selectedNeurons,
            selectedInputs: selectedInputs
        }
    )
) 