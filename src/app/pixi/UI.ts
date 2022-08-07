import * as PIXI from "pixi.js";
import * as U from "../utils";
import { Vec2 } from "../utils/gameProps.typed";

const COLOR = 0xFFFFFF;
export function DrawCells(app: PIXI.Application) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, COLOR, 0.8);
    for (let i = 0; i < U.CELL_ROWS; i++) {
        graphics.moveTo(0, i * U.CELL_SIZE);
        graphics.lineTo(U.CANVAS_WIDTH, i * U.CELL_SIZE)
    }
    for (let i = 0; i < U.CELL_COLS; i++) {
        graphics.moveTo(i * U.CELL_SIZE, 0);
        graphics.lineTo(i * U.CELL_SIZE, U.CANVAS_HEIGHT)
    }
    app.stage.addChild(graphics);
}

export function PosCell2Pixel(cell: Vec2): Vec2 {
    return {
        x: cell.x * U.CELL_SIZE,
        y: cell.y * U.CELL_SIZE,
    }
}

export function PosPixel2Cell(pos: Vec2): Vec2 {
    return {
        x: Math.floor(pos.x / U.CELL_SIZE),
        y: Math.floor(pos.y / U.CELL_SIZE),
    }
}
