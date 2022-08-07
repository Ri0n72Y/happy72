import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import * as U from "../utils";
import * as UI from "./UI";
import { Slime } from "../../assets/ShremAnim/AnimatedImage";
import { app } from "electron";

const PIXIConfig = {
    width: U.CANVAS_WIDTH,
    height: U.CANVAS_HEIGHT,
    backgroundColor: 0x66ccff,
    resolution: window.devicePixelRatio,
} as const;

function Pixi() {
    const app = new PIXI.Application(PIXIConfig);
    const container = new PIXI.Container();
    app.stage.addChild(container);

    const texture = PIXI.Texture.from(Slime[0]);
    container.addChild(new PIXI.Sprite(texture));
    container.x = app.screen.width * 0.5;
    container.y = app.screen.height * 0.5;

    app.ticker.add((delta) => {
        container.rotation -= 0.01 * delta;
        UI.DrawCells(app);
    });

    // Scale mode for pixelation
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

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
            slimee.x = Math.random() * app.screen.width;
            slimee.y = Math.random() * app.screen.height;
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

    const ReactContainer = useRef(null);
    useEffect(() => {
        ReactContainer.current.innerHTML = "";
        ReactContainer.current.append(app.view);
    }, [ReactContainer, app]);
    return <div className="main-canvas" ref={ReactContainer} />
}

export default Pixi;
