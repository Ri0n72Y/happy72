import { IBuildingProps, ISlimeProps, Vec2 } from "../utils/gameProps.typed"

export type Building =
    "RESIDENTIAL" | "FACTORY" | "TEST_STATION" | "HOSPITAL"

function CreateBuilding(type: Building, slime: ISlimeProps, pos: Vec2) {
}