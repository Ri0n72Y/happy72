import * as PIXI from "pixi.js";
import { ISlimeProps, Vec2, BuildingType } from "../utils/gameProps.typed"
import { sound } from '@pixi/sound';
import { isSlimeInfected, slimeMove } from "./SlimeData";

export function CreateSlimeSprite(app: PIXI.Application, data: ISlimeProps) {
    const Textures = [];
    let i;

    const color = () => {
        if (isSlimeInfected(data)) return 'Red';
        if (data.tags.filter(t => t.key === 'antibody').length > 0) return 'Green';
        return 'Blue';
    }

    for (i = 0; i < 4; i++) {
        const slmtexture = PIXI.Texture.from(`Shrem_` + color + `_Frame_${i}.png`);
        Textures.push(slmtexture);
    }
    const slimee = new PIXI.AnimatedSprite(Textures);
    slimee.interactive = true;
    slimee.buttonMode = true;
    slimee.anchor.set(0.5);
    slimee.alpha = 0.8;
    slimee.x = data.pos.x;
    slimee.y = data.pos.y;
    slimee.zIndex = 1; // 渲染图层
    slimee.scale.set(1.4, 1.4);
    slimee.gotoAndPlay(Math.random() * 27);
    slimee
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    slimee.animationSpeed = 0.1;
    app.stage.addChild(slimee);
    return slimee;
}

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 0.8;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}