import { IBuildingProps, IEntityState, IMapProps, ISlimeProps, Vec2 } from "./utils/gameProps.typed";
import * as U from './utils';
import PARAM from "./utils/parameters";

export interface IConfigProps {
    isShowGrid: boolean;
    isShowFlowCell: boolean;
}
export const DefaultConfigProps: IConfigProps = {
    isShowGrid: false,
    isShowFlowCell: false,
}

export interface IGameStateProps {
    isPaused: boolean;
    sunlight: number;
    nextDay: {
        slimeInfected: ISlimeProps[];
        cellInfected: Vec2[];
    }
}
export const DefaultGameStateProps: IGameStateProps = {
    isPaused: false,
    sunlight: PARAM.InitialSunlight,
    nextDay: {
        slimeInfected: [],
        cellInfected: [],
    }
}

export interface IStoreProps {
    map: IMapProps,
    entityState: IEntityState,
    gameState: IGameStateProps,
    config: IConfigProps,
}

export const initialStore: () => IStoreProps = () => ({
    map: {
        shape: new Array<boolean[]>(U.CELL_ROWS)
            .fill([]).map(() =>
                new Array<boolean>(U.CELL_COLS).fill(false)),
        ways: new Array<boolean[]>(U.CELL_ROWS)
            .fill([]).map(() =>
                new Array<boolean>(U.CELL_COLS).fill(false)),
        buildings: new Array<(IBuildingProps | null)[]>(U.CELL_ROWS)
            .fill([]).map(() =>
                new Array<IBuildingProps | null>(U.CELL_COLS).fill(null)),
        infection: new Array<number[]>(U.CELL_ROWS)
            .fill([]).map(() =>
                new Array<number>(U.CELL_COLS).fill(0)),
    },
    entityState: {
        slimes: [],
        buildings: [],
        sunlights: [],
    },
    gameState: DefaultGameStateProps,
    config: DefaultConfigProps,
})

// eslint-disable-next-line prefer-const
export const Store: IStoreProps = initialStore();

export interface Action {
    type: string;
    value: any;
}

export function reducer(state: IStoreProps, action: Action): IStoreProps {
    switch (action.type) {
        // 修改设置
        case "toggleShowGrid": return {
            ...state,
            config: {
                ...state.config,
                isShowGrid: !state.config.isShowGrid
            }
        };
        case "toggleShowFlowCell": return {
            ...state,
            config: {
                ...state.config,
                isShowFlowCell: !state.config.isShowFlowCell,
            }
        };
        // 暂停、播放
        case "setPause": return {
            ...state,
            gameState: {
                ...state.gameState,
                isPaused: action.value,
            }
        };
    }
}