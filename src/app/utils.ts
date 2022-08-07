import { Vec2 } from "./utils/gameProps.typed";

export const CANVAS_WIDTH = 1536;
export const CANVAS_HEIGHT = 960;

export const CELL_ROWS = 20;
export const CELL_COLS = 32;
export const CELL_SIZE = 48;

export const BUILDING_RADIUS = Math.sqrt(CELL_SIZE ** 2 * 2);

export function PosCell2Pixel(cell: Vec2): Vec2 {
    return {
        x: cell.x * CELL_SIZE,
        y: cell.y * CELL_SIZE,
    }
}

export function PosPixel2Cell(pos: Vec2): Vec2 {
    return {
        x: Math.floor(pos.x / CELL_SIZE),
        y: Math.floor(pos.y / CELL_SIZE),
    }
}