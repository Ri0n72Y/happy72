import { CreateSlimeData } from "./pixi/SlimeData";
import { ISlimeProps, Vec2 } from "./utils/gameProps.typed";

export const CANVAS_WIDTH = 1536 as const;
export const CANVAS_HEIGHT = 960 as const;

export const CELL_ROWS = 20 as const;
export const CELL_COLS = 32 as const;
export const CELL_SIZE = 48 as const;

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
export function vecEq(v1: Vec2, v2: Vec2) {
    return v1.x === v2.x && v1.y == v2.y
}

export function deg2Rad(d: number) {
    return d * (Math.PI / 180);
}

/**
 * 
 * @param width 格子列数
 * @param height 格子行数
 */
export function initialSpawn(width: number, height: number): ISlimeProps[] {
    const dice = Math.random() * 0.4 + 0.8;
    const nums = Math.floor(width * height * 0.3 * dice);
    return spawnSlimeData(nums)
}
export function spawnSlimeData(nums: number): ISlimeProps[] {
    const res: ISlimeProps[] = [];
    for (let i = 0; i < nums; i++) {
        const pos = {
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
        }
        res.push(CreateSlimeData(pos));
    }
    return res;
}

/**
 * 人口大于承载力后不会增长
 * @param currentSize 当前所有史莱姆数量
 * @param cap 承载力，一般是width*height
 * @returns 新增的史莱姆
 */
export function MorningSpawn(currentSize: number, cap: number): ISlimeProps[] {
    const ratio = currentSize / cap;
    const nextNums = 3 * (ratio) * (1 - ratio) * cap;
    const nums = Math.max(cap - nextNums, 0);
    const res: ISlimeProps[] = [];
    for (let i = 0; i < nums; i++) {
        const pos = {
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
        }
        res.push(CreateSlimeData(pos));
    }
    return res;
}
