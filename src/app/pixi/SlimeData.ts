import { ISlimeProps, Vec2 } from "../utils/gameProps.typed";
import PARAM from "../utils/parameters";
import { GetNameDrawer } from "./DrawRandomName";
import { ISunlightProps } from "./Sunlight";


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
    return ({
        pos: slime.pos,
        value: produce,
    })
}

