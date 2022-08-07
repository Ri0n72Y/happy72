import type { IMapSaveData } from "../utils/gameProps.typed";
import sample from '../../assets/scenarios/sample.json';
import { IStoreProps } from "../Store";

enum SENARIOS {
    SAMPLE, ESAY, NORMAL, HARD, EXTREME,
}
export function MapLoader(name: SENARIOS): IStoreProps {
    const save = getMapObject(name);
    return {
        map: { ...save },
        state: { ...save },
    };
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
