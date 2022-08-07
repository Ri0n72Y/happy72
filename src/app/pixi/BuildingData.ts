import { BuildingType, IBuildingProps, ISlimeProps, Vec2 } from "../utils/gameProps.typed"
import PARAM from "../utils/parameters";

export function hasEmptySlot(building: IBuildingProps) {
    return building.slots?.filter(s => s === null).length > 0 ?? false;
}

/**
 * 
 * @param type 
 * @param slime 变成它的史莱姆
 * @param pos 格子坐标
 * @returns 
 */
export function CreateBuilding(type: BuildingType, slime: ISlimeProps, pos: Vec2): IBuildingProps {
    return ({
        name: `${slime.name}'s ROOM`,
        type: type,
        pos: pos,
        tags: [],
        slots: [null, null, null, null],
        origin: slime,
    });
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
function slotCabin(slime: ISlimeProps): number {
    slime.health += PARAM.SlotHeal.squareCabin;
    return PARAM.SlotProduce.squareCabin;
}

function slotTest(slime: ISlimeProps, infected: ISlimeProps[]): number {
    if (slime.infected) {
        const dice = Math.random() < PARAM.TestingCorrectness;
        if (dice) infected.push(slime);
    }
    slime.isTested = true;
    return PARAM.TestingCharge;
}

