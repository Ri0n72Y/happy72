import { IGameStateProps, Store } from "../Store";
import { ISunlightProps, Vec2 } from "../utils/gameProps.typed";

export function CreateSunlightDrop(pos: Vec2, value: number): ISunlightProps {
    const sun = {
        pos: pos,
        value: value,
    }
    Store.entityState.sunlights.push(sun);
    return sun;
}

/**
 * Dirty: update gameState
 * @param sun 
 * @param gameState 
 */
export function PickupSunlight(sun: ISunlightProps, gameState: IGameStateProps) {
    gameState.sunlight += sun.value;
}

