import { IStoreProps, Store } from "../Store";
import { PosCell2Pixel, PosPixel2Cell } from "../utils";
import { BuildingType, IBuildingProps, ISlimeProps, Vec2 } from "../utils/gameProps.typed"
import PARAM from "../utils/parameters";
import { GetNameDrawer } from "./DrawRandomName";
import { buildingPolute, settleContact } from "./Infection";
import { getNextPosition, GetSlimeIntent } from "./SlimeData";

export function buildingAvailable(building: IBuildingProps) {
    return (isBuildingClosed || isBuildingBlocked) && hasEmptySlot(building);
}
export function isBuildingClosed(building: IBuildingProps) {
    return building.tags.includes('closed');
}
export function isBuildingBlocked(building: IBuildingProps) {
    return building.tags.includes('blocked');
}
export function hasEmptySlot(building: IBuildingProps) {
    return building.slots?.filter(s => s === null).length > 0 ?? false;
}

/**
 * 当一个史莱姆与建筑重合时使用该方法检测
 * drop史莱姆到建筑时可以直接调用这个方法
 * @param slime 
 * @param building 
 * @returns 
 */
export function handleSlimeIntoBuilding(slime: ISlimeProps, building: IBuildingProps) {
    if (isBuildingClosed(building) || !hasEmptySlot(building)) return;
    for (let i = 0; i < 4; i++) {
        if (building.slots[i] === null) {
            const isSick = slime.tags.filter(t => t.key === 'sick' || t.key === 'disease').length > 0;

            slime.inSlot = true;
            if (!isSick) {
                switch (building.type) {
                    case 'CABIN':
                        Store.gameState.sunlight -= slotVaccine(slime);
                        building.slots[i] = { slime, countDown: isSick ? -1 : 10, };
                        break;
                    case 'HEAL':
                        Store.gameState.sunlight -= slotVaccine(slime);
                        building.slots[i] = { slime, countDown: isSick ? -1 : 10, };
                        break;
                    case 'SLEEP':
                        building.slots[i] = { slime, countDown: -1, };
                        break;
                    case 'MONEY':
                        building.slots[i] = { slime, countDown: -1, };
                        break;
                    case 'TESTING':
                        Store.gameState.sunlight -= slotTest(slime, Store.gameState.nextDay.slimeInfected);
                        building.slots[i] = { slime, countDown: 10, };
                        break;
                }
            }
            return;
        }
    }
    takeAwaySlime(slime, building);
}

/**
 * 从像素坐标获取建筑
 * @param pos 像素坐标
 */
export function getBuildingByPos(pos: Vec2): (IBuildingProps | null) {
    const cell = PosPixel2Cell(pos);
    return Store.map.buildings[cell.x][cell.y];
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
 * 每秒结算一次该方法，更新所有格子的计时器
 * @param buildings 
 */
export function updateSlots(buildings: IBuildingProps[], day: 'day'|'night' = 'day') {
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
                takeAwaySlime(prop.slime, b, i);
                return;
            }
            if (day === 'day' && b.type === 'SLEEP' && !isBuildingBlocked(b)) { // 在白天史莱姆不会在房间里呆着
                const dice = Math.random();
                if (dice < 0.8) {
                    takeAwaySlime(prop.slime, b, i);
                }
            }
        })
    }
}

export function takeAwaySlime(slime: ISlimeProps, b: IBuildingProps, i?: number) {
    slime.inSlot = false;
    slime.pos = getNextPosition(PosCell2Pixel(b.pos),
        { x: -1, y: 1 }, 1, Store.map.ways);
    slime.intent = GetSlimeIntent(slime, Store);
    if (i !== undefined) b.slots[i] = null;
}

/**
 * 一天结算<PARAM.Frequency>次该方法（默认5次）
 * 结算阳光和健康值
 * @param buildings 
 */
export function settleSlot(buildings: IBuildingProps[]) {
    for (const b of buildings) {
        if (isBuildingClosed) continue;
        b.slots.forEach((prop, i) => {
            if (prop === null) {
                return
            }
            switch (b.type) {
                case 'CABIN': Store.gameState.sunlight += slotCabin(prop.slime); return;
                case 'HEAL':
                    Store.gameState.sunlight += slotHeal(prop.slime);
                    if (prop.slime.health >= 0.8) {
                        let index = 0;
                        prop.slime.tags.forEach((t, i) => t.key === 'sick' && (index = i));
                        prop.slime.tags.splice(index, 1);
                        prop.slime.tags.forEach((t, i) => t.key === 'disease' && (index = i));
                        prop.slime.tags.splice(index, 1);
                        if (prop.slime.infected) {
                            prop.slime.tags.forEach((t, i) => t.key === 'infected' && (index = i));
                            prop.slime.tags.splice(index, 1);
                            prop.slime.infected = false
                        }
                        prop.slime.tags.push({ // 增加免疫
                            key: 'antibody',
                            value: 0,
                        })
                        takeAwaySlime(prop.slime, b, i)
                    }
                    return;
                case 'MONEY':
                    Store.gameState.sunlight += slotWork(prop.slime);
                    if (isBuildingBlocked(b))
                        slotBlocked(prop.slime)
                    return;
                case 'SLEEP': if (isBuildingBlocked(b))
                    slotBlocked(prop.slime)
                    return;
                case 'TESTING': return;
            }
        })
    }
}

/**
 * 结算休息恢复的健康、每天花费的维护成本
 */
export function reduceBuildingMorning(store: IStoreProps) {
    const buildings = store.entityState.buildings;
    for (const b of buildings) {
        if (b.type === 'SLEEP') {
            b.slots.forEach(props => {
                if (props !== null) {
                    slotRest(props.slime)
                }
            });
        }
        const nextCost = getDailyCost(b.type);
        if (store.gameState.sunlight < nextCost) {
            b.tags.push("closed");
        } else {
            store.gameState.sunlight -= getDailyCost(b.type);
        }
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
    if (slime.infected) {
        slime.tags.push({
            key: 'infected',
            value: slime.infectedDays,
        })
    }
    slime.health += PARAM.SlotHeal.hospital;
    return PARAM.SlotProduce.hospital;
}
function slotVaccine(slime: ISlimeProps): number {
    if (slime.infected) {
        slime.tags.push({
            key: 'infected',
            value: slime.infectedDays,
        })
    }
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

function slotRest(slime: ISlimeProps) {
    slime.health = Math.min(PARAM.ResidentialHeal + slime.health, 1);
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

