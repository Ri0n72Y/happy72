import * as PIXI from "pixi.js";
import { ISlimeProps, IBuildingProps, Vec2, BuildingType, ISunlightProps } from "../utils/gameProps.typed"
import { sound } from '@pixi/sound';
import { CreateBuilding } from "./BuildingData";

export function init(app: PIXI.Application, funcs: (() => void)[], sources: { name: string; url: string; }[]) {
    app.loader
        .add(sources)
        .load(() => {
            for (const func of funcs) {
                func()
            }
        })
}
export function playSound() {
    sound.play('mysound');
}

export function AnimSlimee(app: PIXI.Application, color: string) {
    // app.loader
    //     .add('spritesheet1', '../../assets/Shrem_' + color + '/spritesheet.json')

    const Textures = [];
    let i;

    for (i = 0; i < 4; i++) {
        const slmtexture = PIXI.Texture.from(`Shrem_` + color + `_Frame_${i}.png`);
        Textures.push(slmtexture);
    }

    for (i = 0; i < 20; i++) {
        const slimee = new PIXI.AnimatedSprite(Textures);
        slimee.interactive = true;
        slimee.buttonMode = true;
        slimee.anchor.set(0.5);
        slimee.alpha = 0.8;
        slimee.x = Math.random() * app.screen.width;
        slimee.y = Math.random() * app.screen.height;
        slimee.zIndex = 1; // 渲染图层
        slimee.scale.set(1, 1);
        slimee.gotoAndPlay(Math.random() * 27);
        slimee
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
        slimee.animationSpeed = 0.1;
        app.stage.addChild(slimee);
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
}

export function SingleSlimee(app: PIXI.Application, color: string) {
    const Textures = [];
    let i;

    for (i = 0; i < 4; i++) {
        const slmtexture = PIXI.Texture.from(`Shrem_` + color + `_Frame_${i}.png`);
        Textures.push(slmtexture);
    }
    const slimee = new PIXI.AnimatedSprite(Textures);
    slimee.interactive = true;
    slimee.buttonMode = true;
    slimee.anchor.set(0.5);
    slimee.alpha = 0.8;
    slimee.x = 0.6 * app.screen.width;
    slimee.y = 0.6 * app.screen.height;
    slimee.zIndex = 1; // 渲染图层
    slimee.scale.set(2, 2); // 仅用于区分，不需要的时候注释掉
    slimee.gotoAndPlay(Math.random() * 27);
    slimee
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    slimee.animationSpeed = 0.1;
    app.stage.addChild(slimee);


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
}

export function AnimSunshine(app: PIXI.Application, data: ISunlightProps) {
    const Textures = [];
    let i;
    for (i = 0; i <= 4; i++) {
        const stexture = PIXI.Texture.from(`Props_SunshineFrame_${i}.png`);
        Textures.push(stexture);
    }
    let j;
    for (j = 0; j < data.value; j++) {
        const sunshine = new PIXI.AnimatedSprite(Textures);
        sunshine.anchor.set(0.5);
        sunshine.x = data.pos.x
        sunshine.y = data.pos.y; 
        sunshine.zIndex = 6; // 渲染图层
        sunshine.gotoAndPlay(Math.random() * 27);
        sunshine.animationSpeed = 0.1;
        sunshine.scale.set(0.8, 0.8);
        app.stage.addChild(sunshine);
    }
}

export function GeneBuilding(app: PIXI.Application, data: IBuildingProps) {
    const Textures = [];
    let i;
    for (i = 0; i <= 8; i++) {
        const covtexture = PIXI.Texture.from(data.type + `_cover_${i}.png`);
        Textures.push(covtexture);
    }

    const cover = new PIXI.AnimatedSprite(Textures);
    cover.anchor.set(0.5);
    cover.buttonMode = true;
    cover.interactive = true;
    cover.x = data.pos.x;
    cover.y = data.pos.y;
    cover.zIndex = 3; // 渲染图层
    cover.gotoAndPlay(Math.random() * 27);
    cover.animationSpeed = 0.1;

    const groundtexture = PIXI.Texture.from(data.type + `_ground.png`);
    const ground = new PIXI.Sprite(groundtexture);
    ground.anchor.set(0.5);
    ground.x = data.pos.x;
    ground.y = data.pos.y;
    ground.zIndex = 0; // 渲染图层

    app.stage.addChild(ground);
    app.stage.addChild(cover);
}
