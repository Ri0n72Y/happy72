import * as PIXI from "pixi.js";
import * as U from "../utils";

const COLOR = 0xFFFFFF;
export function DrawCells(app: PIXI.Application) {
    const graphics = new PIXI.Graphics();
    graphics.zIndex = 5;
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

export function setBackground(app: PIXI.Application) {
    const bgImage = PIXI.Texture.from('../../assets/scenarios/Grass.png')
    const tilingSprite = new PIXI.TilingSprite(bgImage, app.screen.width, app.screen.height)
    app.stage.addChild(tilingSprite)
    app.ticker.add(() => {
        tilingSprite.tilePosition.y += 2;
    })
}


