import * as PIXI from "pixi.js";

export function GenerateSlimee(app: PIXI.Application) {
    app.loader
        .add('spritesheet', '../../assets/ShremAnim/spritesheet.json')
        .load(onAssetsLoaded);
    function onAssetsLoaded() {
        // create an array to store the textures
        const Textures = [];
        let i;

        for (i = 0; i < 4; i++) {
            const slmtexture = PIXI.Texture.from(`Shrem_40x40_outline_${i}.png`);
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