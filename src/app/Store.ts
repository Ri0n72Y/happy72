import { IEntityState, IMapProps } from "./utils/gameProps.typed";


export interface IStoreProps {
    map?: IMapProps,
    state?: IEntityState,
}

export const Store: IStoreProps = {
}