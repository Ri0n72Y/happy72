import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { sound } from '@pixi/sound';
import * as U from "../utils";
import * as UI from "./UI";
import { app } from "electron";
import { init, AnimSlimee, AnimBuilding, AnimSunshine } from "./AnimGenerator";
import * as AG from "./AnimGenerator";
import { Vec2 } from "../utils/gameProps.typed"

const PIXIConfig = {
    width: U.CANVAS_WIDTH,
    height: U.CANVAS_HEIGHT,
    backgroundColor: 0x66ccff,
    resolution: window.devicePixelRatio,
} as const;

function Pixi() {
    const app = new PIXI.Application(PIXIConfig);
    const sources = [
        { name: 'slime', url: '../../assets/Shrem_Blue/spritesheet.json' },
        { name: 'sunshine', url: '../../assets/Props/Sunshine/spritesheet.json' }];
    const functions = [
        () => AnimSlimee(app, "Blue"),
        // () => AnimBuilding(app, "CABIN", pos),
        // () => AnimBuilding(app, type, pos),
        () => AnimSunshine(app)];
    init(app, functions, sources);



    UI.DrawCells(app);
    // AG.AnimSlimee(app, 'Blue');
    // const sounds = sound.add('mysound', '../../assets/sounds/Music/health.mp3');
    // sounds.play('mysound');
    // app.loader.reset();
    // AG.AnimBuilding();
    // AG.AnimSunshine(app);

    const ReactContainer = useRef(null);
    useEffect(() => {
        ReactContainer.current.innerHTML = "";
        ReactContainer.current.append(app.view);
    }, [ReactContainer, app]);
    return <div className="main-canvas" ref={ReactContainer} />
}

export default Pixi;
