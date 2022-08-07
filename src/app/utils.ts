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

export function vecAdd(v1: Vec2, v2: Vec2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y }
}
export function vecSub(v1: Vec2, v2: Vec2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y }
}
export function vecScale(v: Vec2, scale: number) {
    return { x: v.x * scale, y: v.y * scale };
}
export function magnitude(v: Vec2): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2)
}
export function normalize(v: Vec2): Vec2 {
    const mag = magnitude(v);
    return { x: v.x / mag, y: v.y / mag }
}
export function vecRotate(v: Vec2, deg: number) {
    const rad = deg2Rad(deg);
    return {
        x: v.x * Math.cos(rad) - v.y * Math.sin(rad),
        y: v.x * Math.sin(rad) + v.y * Math.cos(rad),
    }
}

export function deg2Rad(d: number) {
    return d * (Math.PI / 180);
}