import { PosPixel2Cell } from "../utils";
import { Vec2 } from "../utils/gameProps.typed";

export function checkCollision(pos: Vec2, ways: boolean[][]) {
    const cell = PosPixel2Cell(pos);
    return ways[cell.x][cell.y];
}