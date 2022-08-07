import { IStoreProps } from "../Store";
import * as U from "../utils";
import { IBuildingProps, ISlimeProps, ISunlightProps, SlimeIntent, Vec2 } from "../utils/gameProps.typed";
import PARAM from "../utils/parameters";
import { hasEmptySlot } from "./BuildingData";
import { GetNameDrawer } from "./DrawRandomName";
import { checkCollision } from "./Map";
import { CreateSunlightDrop } from "./Sunlight";

export function CreateSlimeData(pos: Vec2): ISlimeProps {
    const drawer = GetNameDrawer();
    return ({
        name: drawer.getName(),
        health: PARAM.Slime.initialHealth,
        infected: false,
        inSlot: false,
        pos: pos,
        tags: [],
    });
}

/**
 * Dirty: slime health reduce
 * @param slime 
 */
export function NatrualGrow(slime: ISlimeProps): ISunlightProps {
    const produce = Math.ceil(PARAM.NaturalProduction * slime.health);
    slime.health += PARAM.NaturalCost;
    return (CreateSunlightDrop(slime.pos, produce));
}

const slimeActions = ["heal", "test", "work", "idle"] as const;
// type SlimeAction = (typeof slimeActions)[number];

/**
 * 获取下一个史莱姆意图 + target
 * @param slime 
 * @param store 
 * @returns 
 */
export function GetSlimeIntent(slime: ISlimeProps, store: IStoreProps): SlimeIntent {
    const actions = getAvailableAction(slime.pos, store.entityState.buildings);
    const weights = [
        actions.heal // 想去医院
            ? slime.tags.filter(t => t.key === 'sick').length * 1000 // 生病会很想去医院
            + actions.heal.dist * (1 - slime.tags.filter(t => t.key === 'antibody').length) // 免疫之后没有去医院的理由
            : 0,
        slime.isTested ? 0 // 今天做过了
            : actions.test // 想去做核酸
                ? 1000 + actions.test.dist // 那就超想去做核酸
                : 0,
        actions.work
            ? actions.work.dist // 想去上工
            : 0,
    ];
    const actionSum = weights.reduce((p, c) => p + c);
    const mole = Math.max(10, actionSum * PARAM.Slime.idleRate);
    weights.push(mole);
    let dice = Math.random() * (actionSum + mole);
    let i = 0;
    while (dice > 0) {
        dice -= weights[i];
        i++;
    }
    let speed = 0, direction;
    switch (slimeActions[i]) {
        case 'idle':
            speed = Math.random() * 0.5 + 0.1 * PARAM.MoveSpeed;
            return ({
                key: "IDLE",
                time: 0,
                speed: speed,
                target: getNextPosition(slime.pos,
                    U.vecRotate({ x: 0, y: 1 }, Math.random() * 360 - 180),
                    speed,
                    store.map.ways),
            });
        case 'heal':
            direction = U.normalize(U.vecSub(U.PosCell2Pixel(actions.heal.building.pos), slime.pos));
            return ({
                key: "GOTO",
                time: 0,
                speed: 0.8 * PARAM.MoveSpeed,
                goal: actions.heal.building.pos,
                target: getNextPosition(slime.pos, direction,
                    0.8 * PARAM.MoveSpeed, store.map.ways),
            });
        case 'test':
            direction = U.normalize(U.vecSub(U.PosCell2Pixel(actions.test.building.pos), slime.pos));
            return ({
                key: "GOTO",
                time: 0,
                speed: PARAM.MoveSpeed,
                goal: actions.test.building.pos,
                target: getNextPosition(slime.pos, direction,
                    PARAM.MoveSpeed, store.map.ways),
            });
        case 'work':
            direction = U.normalize(U.vecSub(U.PosCell2Pixel(actions.work.building.pos), slime.pos));
            speed = Math.random() * 0.4 + 0.4 * PARAM.MoveSpeed;
            return ({
                key: "GOTO",
                time: 0,
                speed: speed,
                goal: actions.work.building.pos,
                target: getNextPosition(slime.pos, direction,
                    speed, store.map.ways),
            });
    }
}

/**
 * find an available next move position
 * @param pos 
 * @param direction 
 * @param speed 
 * @param ways 
 * @returns a new position, return pos if no move available;
 */
function getNextPosition(pos: Vec2, direction: Vec2, speed: number, ways: boolean[][]) {
    const forward = {
        x: direction.x * speed * U.CELL_SIZE,
        y: direction.y * speed * U.CELL_SIZE,
    }
    const next = U.vecAdd(pos, forward);
    if (!checkCollision(next, ways))
        return next;
    const trys = [-90, 90, 180]
    let i = 0;
    while (i < trys.length) {
        const next = U.vecRotate(forward, trys[i]);
        const nextPos = U.vecAdd(pos, next);
        if (!checkCollision(nextPos, ways))
            return next;
        i++;
    }
    return pos;
}

function getAvailableAction(pos: Vec2, buildings: IBuildingProps[]) {
    const list = buildings.map(b => ({
        building: b,
        dist: circleIntersect(
            pos, PARAM.Slime.searchRadius * U.CELL_SIZE,
            b.pos, U.BUILDING_RADIUS),
    })).filter(b => b.dist > 0);
    const works = list.filter(b => b.building.type === "MONEY" && hasEmptySlot(b.building));
    const tests = list.filter(b => b.building.type === "TESTING" && hasEmptySlot(b.building));
    const heals = list.filter(b => (b.building.type === "HEAL" || b.building.type === "CABIN") && hasEmptySlot(b.building));
    return {
        work: works.length > 0
            ? works.reduce((p, c) => p.dist > c.dist ? p : c)
            : undefined,
        test: tests.length > 0
            ? tests.reduce((p, c) => p.dist > c.dist ? p : c)
            : undefined,
        heal: heals.length > 0
            ? heals.reduce((p, c) => p.dist > c.dist ? p : c)
            : undefined,
    }
}

export function circleIntersect(centre: Vec2, centreRadius: number, target: Vec2, radius = 0) {
    return centreRadius + radius - U.magnitude({ x: centre.x - target.x, y: centre.y - target.y })
}

