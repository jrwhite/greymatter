import { IState } from "../reducers";
import { IProps } from "../components/SideBar";
import { createSelector } from "reselect";

const getSelectedNeurons = (state: IState, props: IProps) =>
    state.network.config.selectedNeurons

export const makeGetSidepanelState = () => createSelector(
    getSelectedNeurons,
    selectedNeurons => (
        {
            selectedNeurons: selectedNeurons
        }
    )
) 