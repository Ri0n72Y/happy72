import { IBuildingProps, ISlimeProps } from "../utils/gameProps.typed";
import PARAM from "../utils/parameters";

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

export function buildingPolute(slime: IBuildingProps, type: 'close' | 'second'): boolean {
    if (slime.tags.includes('infected')) return true;
    const factor = type === 'close' ? PARAM.Slime.closeContactInfect : PARAM.Slime.secondContactInfect;
    const hasAntibody = slime.tags.includes('inmmune') || slime.tags.includes('disinfected');
    const dice = Math.random();
    return hasAntibody
        ? dice < (1 + PARAM.Slime.immuneResist) * factor
        : dice < factor;
}
