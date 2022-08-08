import { PosPixel2Cell } from "../utils";
import { IBuildingProps, ISlimeProps, Vec2 } from "../utils/gameProps.typed";
import PARAM from "../utils/parameters";
import { isSlimeDisease, isSlimeSicked } from "./SlimeData";

/**
 * 计算史莱姆是否被传染
 * @param slime 
 * @param type 'close': 密接, 'second': 次密接
 * @returns 
 */
export function settleContact(slime: ISlimeProps, type: 'close' | 'second'): boolean {
    if (slime.infected) return true;
    const factor = type === 'close' ? PARAM.Slime.closeContactInfect : PARAM.Slime.secondContactInfect;
    const hasAntibody = slime.tags.filter(t => t.key === 'antibody').length > 0;
    const dice = Math.random();
    return hasAntibody
        ? dice < (1 + PARAM.Slime.immuneResist) * factor
        : dice < factor;
}

/**
 * 结算建筑是否被感染
 * @param slime 
 * @param type 
 * @returns 
 */
export function buildingPolute(slime: IBuildingProps, type: 'close' | 'second'): boolean {
    if (slime.tags.includes('infected')) return true;
    const factor = type === 'close' ? PARAM.Slime.closeContactInfect : PARAM.Slime.secondContactInfect;
    const hasAntibody = slime.tags.includes('inmmune') || slime.tags.includes('disinfected');
    const dice = Math.random();
    return hasAntibody
        ? dice < (1 + PARAM.Slime.immuneResist) * factor
        : dice < factor;
}

/**
 * 所有史莱姆行动的时候都去判断，可以每秒判断一次
 * @param slime 
 * @param infect 
 * @returns 
 */
export function cellPolute(slime: ISlimeProps, infect: number[][]): (Vec2 | undefined) {
    if (!slime.infected) return undefined;
    const dice = Math.random()
    const isPolute = dice < PARAM.Slime.closeContactInfect;
    const cell = PosPixel2Cell(slime.pos);
    if (isPolute) {
        infect[cell.x][cell.y] = PARAM.NaturalClean;
    }
    return cell;
}

/**
 * 
 */
export function reduceHealthMorning(slimes: ISlimeProps[], TestedSlime: ISlimeProps[]) {
    for (const slime of slimes) {
        const dice = Math.random()
        if (!slime.inSlot) {
            slime.health = dice < 0.04 ? 1 : Math.min(slime.health + 0.1, 0.8);
        }
        if (isSlimeSicked(slime) && !slime.inSlot)  // 小病伤身
            slime.health -= dice * 0.2;
        if (isSlimeDisease(slime) && !slime.inSlot) // 大病去世
            slime.health -= 0.2;
        if (!isSlimeSicked(slime) && !isSlimeDisease(slime)) {
            if (slime.infected) { // 瘟疫致病
                slime.infectedDays ? slime.infectedDays++ : slime.infectedDays = 1;
                const isSick = dice < PARAM.Slime.sickRate * (slime.infectedDays - PARAM.Slime.incubationMin);
                if (isSick)
                    slime.tags.push({
                        key: 'sick',
                        value: 0,
                    });
            }
            if (slime.health < 0.6) { // 虚弱致病
                slime.tags.push({
                    key: 'sick',
                    value: 0,
                })
            }
        }
        if ((slime.health < 0.2 && !isSlimeDisease(slime))
            || slime.infected && isSlimeSicked(slime) && slime.health < 0.35) {
            if (slime.tags.find(t => t.key === 'antibody')) {
                break; // 抗体不会变成重症
            }
            let index = 0;
            slime.tags.forEach((t, i) => t.key === 'sick' && (index = i));
            slime.tags.splice(index, 1);
            slime.tags.push({
                key: 'disease',
                value: 0,
            });
        }
        slime.tags.forEach(t => t.value = (t.value ?? 0) + 1);
        if (isSlimeSicked(slime)) {
            const sick = slime.tags.find(t => t.key === 'sick');
            if (sick.value > PARAM.Slime.sickHealDays && slime.health > 0.4) { // 自愈
                let index = 0;
                slime.tags.forEach((t, i) => t.key === 'sick' && (index = i));
                slime.tags.splice(index, 1);
                if (slime.infected) {
                    slime.tags.forEach((t, i) => t.key === 'infected' && (index = i));
                    slime.tags.splice(index, 1);
                    slime.infected = false
                    slime.tags.push({ // 增加免疫
                        key: 'antibody',
                        value: 0,
                    })
                }
            }
        }
    }
    for (const slime of TestedSlime) {
        slime.tags.push({
            key: 'infected',
            value: slime.infectedDays ?? 0,
        })
    }
}

/**
 * 在每秒执行这个函数，让史莱姆去尝试感染格子并尝试被传染
 * 建议与其他函数错开执行，这个对性能影响相对大
 * @param slimes 
 * @param infect 
 */
export function reduceSlimeInfection(slimes: ISlimeProps[], infect: number[][]) {
    const closeCells: boolean[][] = [];
    const slimeInCell: (ISlimeProps[] | null)[][] = [];
    for (let i = 0; i < infect.length; i++) { // 初始化
        const cols: boolean[] = [];
        const slimeCols: (ISlimeProps[] | null)[] = [];
        for (let j = 0; j < infect[i].length; j++) {
            cols.push(false);
            slimeCols.push(null);
        }
        closeCells.push(cols);
        slimeInCell.push(slimeCols);
    }
    for (const s of slimes) { // 传播
        const slimeCell = PosPixel2Cell(s.pos);
        if (slimeInCell[slimeCell.x][slimeCell.y]) {
            slimeInCell[slimeCell.x][slimeCell.y].push(s);
        } else {
            slimeInCell[slimeCell.x][slimeCell.y] = [s];
        }
        const cell = cellPolute(s, infect);
        if (cell !== undefined) closeCells[cell.x][cell.y] = true;
    }
    for (let i = 0; i < closeCells.length; i++) {
        for (let j = 0; j < closeCells[i].length; j++) {
            if (slimeInCell[i][j] === null) continue;
            if (closeCells[i][j]) {
                slimeInCell[i][j].forEach(s => s.infected = settleContact(s, "close"));
            } else if (infect[i][j] > 0) {
                slimeInCell[i][j].forEach(s => s.infected = settleContact(s, "second"));
            }
        }
    }
}