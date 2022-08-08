import * as PIXI from "pixi.js";
import { ISlimeProps, Vec2, BuildingType } from "../utils/gameProps.typed"

export function AnimSlimee(app: PIXI.Application, color: string) {
    app.loader
        .add('spritesheet', '../../assets/Shrem_' + color + '/spritesheet.json')
        .load(onAssetsLoaded);
    function onAssetsLoaded() {
        // create an array to store the textures
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

        //     // start animating
        //     app.start();
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
        this.alpha = 1;
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

export function AnimBuilding(
    app: PIXI.Application, type: BuildingType, slime: ISlimeProps, pos: Vec2) {
    app.loader
        .add('spritesheet', '../../assets/FuncBds/' + type + '/spritesheet.json')
        .load(onAssetsLoaded)
    function onAssetsLoaded() {
        const Textures = [];
        let i;
        for (i = 0; i <= 8; i++) {
            const covtexture = PIXI.Texture.from(type + `_cover_${i}.png`);
            Textures.push(covtexture);
        }

        const cover = new PIXI.AnimatedSprite(Textures);
        cover.anchor.set(0.5);
        cover.buttonMode = true;
        cover.interactive = true;
        cover.x = 0;
        cover.y = 0;
        cover.zIndex = 3; // 渲染图层
        cover.gotoAndPlay(Math.random() * 27);
        cover.animationSpeed = 0.1;

        const groundtexture = PIXI.Texture.from(type + `_ground.png`);
        const ground = new PIXI.Sprite(groundtexture);
        ground.anchor.set(0.5);
        ground.x = pos.x;
        ground.y = pos.y;
        ground.zIndex = 0; // 渲染图层

        ground.addChild(cover);
        app.stage.addChild(ground);
    }
}

export function AnimSunshine(app: PIXI.Application, pos: Vec2) {
    // export function AnimSunshine(app: PIXI.Application) {
    app.loader
        .add('spritesheet', '../../assets/Props/Sunshine/spritesheet.json')
        .load(onAssetsLoaded)
    function onAssetsLoaded() {
        const Textures = [];
        let i;
        for (i = 0; i <= 4; i++) {
            const stexture = PIXI.Texture.from(`Props_SunshineFrame_${i}.png`);
            Textures.push(stexture);
        }
        const sunshine = new PIXI.AnimatedSprite(Textures);
        sunshine.anchor.set(0.5);
        sunshine.x = pos.x;
        sunshine.y = pos.y;
        // sunshine.x = 0.5 * app.screen.width; // 测试用
        // sunshine.y = 0.5 * app.screen.height; // 测试用
        sunshine.zIndex = 2; // 渲染图层
        sunshine.gotoAndPlay(Math.random() * 27);
        sunshine.animationSpeed = 0.1;
        // sunshine.scale.set(2, 2);
        app.stage.addChild(sunshine);
    }
}