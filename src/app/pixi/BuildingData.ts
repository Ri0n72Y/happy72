import { Store } from "../Store";
import { PosCell2Pixel } from "../utils";
import { BuildingType, IBuildingProps, ISlimeProps, Vec2 } from "../utils/gameProps.typed"
import PARAM from "../utils/parameters";
import { GetNameDrawer } from "./DrawRandomName";
import { buildingPolute, settleContact } from "./Infection";
import { getNextPosition, GetSlimeIntent } from "./SlimeData";

export function buildingAvailable(building: IBuildingProps) {
    return building.tags.filter(b => b === 'closed' || b === 'blocked').length === 0 && hasEmptySlot(building);
}

export function hasEmptySlot(building: IBuildingProps) {
    return building.slots?.filter(s => s === null).length > 0 ?? false;
}

/**
 * Dirty: Store.gameState.sunlight down
 * 需要在执行之前使用getBuildCost来检查是否有足够的钱去扣，该方法不会做检查
 * @param type 
 * @param slime 变成它的史莱姆
 * @param pos 格子坐标
 * @returns 
 */
export function CreateBuilding(type: BuildingType, slime: ISlimeProps, pos: Vec2): IBuildingProps {
    Store.gameState.sunlight -= getBuildCost(type);
    const drawer = GetNameDrawer();
    return ({
        name: `${slime.name ?? drawer.getName()}'s ROOM`,
        type: type,
        pos: pos,
        tags: [],
        slots: [null, null, null, null],
        origin: slime,
    });
}

/**
 * 每秒结算一次该方法
 * @param buildings 
 */
export function updateSlots(buildings: IBuildingProps[]) {
    for (const b of buildings) {
        b.slots.forEach((prop, i) => {
            if (prop === null) { // 没有上岗或者factory里搬砖
                return;
            }
            // 传染
            if (prop.slime.infected) {
                buildingPolute(b, "close");
            }
            if (b.tags.includes("infected")) {
                settleContact(prop.slime, "close");
            }
            // 倒计时
            if (prop.countDown === -1) {
                return
            }
            if (prop.countDown > 0) { // 有秒数的倒计时
                prop.countDown -= 1;
                return;
            }
            if (prop.countDown === 0) { // 将史莱姆丢出去
                prop.slime.inSlot = false;
                prop.slime.pos = getNextPosition(PosCell2Pixel(b.pos),
                    { x: -1, y: 1 }, 1, Store.map.ways);
                prop.slime.intent = GetSlimeIntent(prop.slime, Store);
                b.slots[i] = null;
                return;
            }
        })
    }
}

/**
 * 一天结算<PARAM.Frequency>次该方法
 * 结算阳光和健康值
 * @param buildings 
 */
export function settleSlot(buildings: IBuildingProps[]) {
    for (const b of buildings) {
        b.slots.forEach(prop => {
            if (prop === null) {
                return
            }
            switch (b.type) {
                case 'CABIN': Store.gameState.sunlight += slotCabin(prop.slime); return;
                case 'HEAL': Store.gameState.sunlight += slotHeal(prop.slime); return;
                case 'MONEY': Store.gameState.sunlight += slotWork(prop.slime); return;
                case 'SLEEP': if (b.tags.filter(t => t === 'blocked'))
                    slotBlocked(prop.slime)
                    return;
                case 'TESTING': if (b.tags.filter(t => t === 'blocked'))
                    slotBlocked(prop.slime)
                    return;
            }
        })
    }
}

/**
 * Dirty: reduce slime health
 * @param slime 
 * @return sunlight income result
 */
function slotWork(slime: ISlimeProps): number {
    const res = slime.health * PARAM.SlotProduce.factory;
    slime.health += PARAM.SlotHeal.factory;
    return res;
}
function slotHeal(slime: ISlimeProps): number {
    slime.health += PARAM.SlotHeal.hospital;
    return PARAM.SlotProduce.hospital;
}
function slotVaccine(slime: ISlimeProps): number {
    slime.tags.push({
        key: "antibody",
        value: 0,
    });
    return PARAM.TestingCharge * 30;
}
function slotCabin(slime: ISlimeProps): number {
    slime.health += PARAM.SlotHeal.squareCabin;
    return PARAM.SlotProduce.squareCabin;
}

/**
 * 如果史莱姆被检测出来，会加入第二天的阳性名单
 * @param slime 
 * @param infected 第二天会展示为阳性的史莱姆
 * @returns 
 */
function slotTest(slime: ISlimeProps, infected: ISlimeProps[]): number {
    if (slime.infected) {
        const dice = Math.random() < PARAM.TestingCorrectness;
        if (dice) infected.push(slime);
    }
    slime.isTested = true;
    return PARAM.TestingCharge;
}

function slotBlocked(slime: ISlimeProps) {
    slime.health += PARAM.SlotHeal.residential;
    return PARAM.SlotProduce.residential;
}

function getDailyCost(type: BuildingType) {
    switch (type) {
        case 'CABIN': return PARAM.DailyCost.squareCabin;
        case 'HEAL': return PARAM.DailyCost.hospital;
        case 'MONEY': return PARAM.DailyCost.factory;
        case 'SLEEP': return PARAM.DailyCost.residential;
        case 'TESTING': return PARAM.DailyCost.testStation;
    }
}
export function getBuildCost(type: BuildingType) {
    switch (type) {
        case 'CABIN': return PARAM.BuildCost.squareCabin;
        case 'HEAL': return PARAM.BuildCost.hospital;
        case 'MONEY': return PARAM.BuildCost.factory;
        case 'SLEEP': return PARAM.BuildCost.residential;
        case 'TESTING': return PARAM.BuildCost.testStation;
    }
}

