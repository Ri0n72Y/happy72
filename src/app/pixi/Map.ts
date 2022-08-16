import { PosPixel2Cell } from "../utils";
import { Vec2 } from "../utils/gameProps.typed";

export function checkCollision(pos: Vec2, ways: boolean[][]) {
    const cell = PosPixel2Cell(pos);
    console.log(pos, cell, ways)
    return ways[Math.max(Math.min(31, cell.y), 0)][Math.max(Math.min(19, cell.x), 0)];
}