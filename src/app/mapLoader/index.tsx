import { IBuildingProps, ISlimeProps } from "../utils/gameProps.typed";
import sample from '../../assets/scenarios/sample.json';

type TileType = 0 // 普通的草地
    | 1 // 建筑
    | -1 // 障碍物类型1 
    | -2 // 障碍物类型2（贴图不同）
    | -3; // 障碍物类型3
interface IMapProps {
    map: TileType[][], // 现在地图的地图块
    infection: number[][], // 地图块的感染模式，0代表未被感染，数字代表当前区域还有几天自然解除感染的倒计时
    slimes: ISlimeProps[], // 地图上史莱姆的状态
    buildings: IBuildingProps[], // 地图上的所有建筑的状态
}

enum SENARIOS {
    SAMPLE, ESAY, NORMAL, HARD, EXTREME,
}
export function MapLoader(name: SENARIOS) {
    return getMapObject(name);
}

function getMapObject(name: SENARIOS): IMapProps {
    switch (name) {
        case SENARIOS.SAMPLE: return sample as IMapProps;
        case SENARIOS.ESAY: return sample as IMapProps;
        case SENARIOS.NORMAL: return sample as IMapProps;
        case SENARIOS.HARD: return sample as IMapProps;
        case SENARIOS.EXTREME: return sample as IMapProps;
    }
}
