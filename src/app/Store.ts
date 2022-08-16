import { IBuildingProps, IEntityState, IMapProps, ISlimeProps, ISunlightProps } from "./utils/gameProps.typed";
import * as U from './utils';
import PARAM from "./utils/parameters";
import * as PIXI from "pixi.js";

export const CELL_ROWS = 20 as const;
export const CELL_COLS = 32 as const;
export const CELL_SIZE = 48 as const;

export interface IConfigProps {
    isShowGrid: boolean;
    isShowFlowCell: boolean;
}
export const DefaultConfigProps: IConfigProps = {
    isShowGrid: false,
    isShowFlowCell: false,
}

export interface IGameStateProps {
    count: number; second: number;
    isPaused: boolean;
    sunlight: number;
    daynight: 'day' | 'night',
    nextDay: {
        slimeInfected: ISlimeProps[];
    }
}
export const DefaultGameStateProps: IGameStateProps = {
    count: 0,
    second: 0,
    isPaused: false,
    sunlight: PARAM.InitialSunlight,
    daynight: 'day',
    nextDay: {
        slimeInfected: [],
    }
}

interface SpritedSlime {
    sprite: PIXI.AnimatedSprite,
    data: ISlimeProps,
}
interface SpirtedBuilding {
    sprite: PIXI.AnimatedSprite,
    data: IBuildingProps,
}
interface SpritedSunlight {
    sprite: PIXI.AnimatedSprite,
    data: ISunlightProps,
}
export interface IStoreProps {
    map: IMapProps,
    render?: {
        slimes: SpritedSlime[],
        buildings: SpirtedBuilding[],
        sunlights: SpritedSunlight[],
    }
    entityState: IEntityState,
    gameState: IGameStateProps,
    config: IConfigProps,
}

function initArray(value: any, x: number, y: number): any[][] {
    const arr: any[][] = [];
    for (let i = 0; i < x; i++) {
        const row: any[] = [];
        for (let j = 0; j < y; j++) {
            row.push(value);
        }
        arr.push(row);
    }
    return arr;
}

export const initialStore: () => IStoreProps = () => ({
    render: {
        slimes: [],
        buildings: [],
        sunlights: [],
    },
    map: {
        shape: initArray(false, CELL_ROWS, CELL_COLS),
        ways: initArray(false, CELL_ROWS, CELL_COLS),
        buildings: initArray(null, CELL_ROWS, CELL_COLS),
        infection: initArray(0, CELL_ROWS, CELL_COLS),
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