import { IBuildingProps } from "../utils/gameProps.typed";

export function hasEmptySlot(building: IBuildingProps) {
    return building.slots?.filter(s => s === null).length > 0 ?? false;
}