import { IStoreProps, Store } from "../Store";
import { MorningSpawn } from "../utils";
import { reduceBuildingMorning, settleSlot, updateSlots } from "./BuildingData";
import { reduceHealthMorning, reduceSlimeInfection } from "./Infection";
import { NatrualGrow, reduceSlimeSecond } from "./SlimeData";

import * as PIXI from "pixi.js";
import PARAM from "../utils/parameters";

const SECOND = 60

export function run(app: PIXI.Application) {
    app.ticker.add((delta) => {
        Store.gameState.count++;
        if (Store.gameState.count % SECOND === 0) {
            Store.gameState.second++;
            SecondSettle(Store);
        }
        if (Store.gameState.second % (PARAM.DayTime / PARAM.Frequency)) {
            PartialSettle(Store);
        }
        if (Store.gameState.second % PARAM.DayTime === 0) {
            MorningSettle(Store);
        }
    })
}
/**
 * 结算每天早上的行动
 * @param store 
 */
export function MorningSettle(store: IStoreProps) {
    reduceBuildingMorning(store); // 结算建筑相关
    store.map.infection.forEach(row => {
        row.forEach((_, i) => row[i] > 0 && row[i]--)
    }); // 自我清除
    store.entityState.buildings.forEach(b => { // 清除单日的buff
        let index = -1;
        b.tags.find((t, i) => t === 'disinfected' && (index = i));
        if (index > -1) {
            b.tags.splice(index, 1);
        }
    });
    store.entityState.slimes.forEach(s => {
        s.isTested = false;
        s.infected && (s.infectedDays = (s.infectedDays ?? 0) + 1)
    })
    // 结算史莱姆健康值
    reduceHealthMorning(store.entityState.slimes, store.gameState.nextDay.slimeInfected)
    store.entityState.slimes = store.entityState.slimes.filter(s => !s.dying); // 清理掉死亡的史莱姆
    MorningSpawn( // 每天早上新的史莱姆生成
        store.entityState.slimes.length,
        store.map.shape.length * store.map.shape[0].length
    );
}

export function SecondSettle(store: IStoreProps) {
    reduceSlimeSecond(store.entityState.slimes, store);
    reduceSlimeInfection(store.entityState.slimes, store.map.infection);
    updateSlots(store.entityState.buildings, 'day');
}

export function PartialSettle(store: IStoreProps) {
    settleSlot(store.entityState.buildings);
    store.entityState.slimes.forEach(slime => {
        if (slime.dying) {
            return;
        }
        NatrualGrow(slime);
    });
}