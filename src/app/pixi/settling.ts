import { IStoreProps } from "../Store";
import { MorningSpawn } from "../utils";
import { reduceBuildingMorning } from "./BuildingData";

/**
 * 结算每天早上的行动
 * @param store 
 */
export function MorningSettle(store: IStoreProps) {
    reduceBuildingMorning(store); // 结算建筑相关
    MorningSpawn( // 每天早上新的史莱姆生成
        store.entityState.slimes.length,
        store.map.shape.length * store.map.shape[0].length
    );
}