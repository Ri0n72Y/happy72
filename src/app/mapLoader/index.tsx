import type { IBuildingProps, IEntityState, IMapProps, IMapSaveData } from "../utils/gameProps.typed";
import sample from '../../assets/scenarios/sample.json';
import { DefaultConfigProps, DefaultGameStateProps, IStoreProps } from "../Store";

enum SENARIOS {
    SAMPLE, ESAY, NORMAL, HARD, EXTREME,
}
export function MapLoader(name: SENARIOS): IStoreProps {
    const save = getMapObject(name);
    const map = convertSave2Map(save);
    const [buildings, entityState] = convertSave2Entity(save, map.buildings);
    return {
        map: { ...map, buildings: buildings },
        entityState: entityState,
        gameState: DefaultGameStateProps,
        config: DefaultConfigProps,
    };
}

function convertSave2Entity(save: IMapSaveData, buildings: (IBuildingProps | null)[][]): [(IBuildingProps | null)[][], IEntityState] {
    for (const building of save.buildings) {
        if (buildings[building.pos.x][building.pos.y] !== null) continue;
        buildings[building.pos.x][building.pos.y] = building;
        buildings[building.pos.x + 1][building.pos.y + 1] = building;
        buildings[building.pos.x + 1][building.pos.y - 1] = building;
        buildings[building.pos.x - 1][building.pos.y + 1] = building;
    }
    return [
        buildings,
        {
            slimes: save.slimes,
            buildings: save.buildings,
        }
    ]
}

function convertSave2Map(save: IMapSaveData): IMapProps {
    const shape: boolean[][] = []; // 地图块的贴图信息 true / 有障碍物无法通行
    const ways: boolean[][] = []; // 地图块的通行信息，true = 无法通行
    const buildings: (IBuildingProps | null)[][] = []; // 现在地图的建筑信息（指针）
    for (const row of save.map) {
        const shapeRow: boolean[] = [];
        const waysRow: boolean[] = [];
        const buildingsRow: (IBuildingProps | null)[] = [];
        for (const cell of row) {
            shapeRow.push(cell === -1);
            waysRow.push(cell !== -1);
            buildings.push(null);
        }
        shape.push(shapeRow);
        ways.push(waysRow);
        buildings.push(buildingsRow);
    }
    return {
        shape: shape,
        ways: ways,
        buildings: buildings,
        infection: save.infection,
    }
}
function getMapObject(name: SENARIOS): IMapSaveData {
    switch (name) {
        case SENARIOS.SAMPLE: return sample as IMapSaveData;
        case SENARIOS.ESAY: return sample as IMapSaveData;
        case SENARIOS.NORMAL: return sample as IMapSaveData;
        case SENARIOS.HARD: return sample as IMapSaveData;
        case SENARIOS.EXTREME: return sample as IMapSaveData;
    }
}
