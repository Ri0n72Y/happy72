import { IEntityState, IMapProps } from "./utils/gameProps.typed";


export interface IStoreProps {
    map?: IMapProps,
    entityState?: IEntityState,
    gameState?: null,

}

export const Store: IStoreProps = {
}