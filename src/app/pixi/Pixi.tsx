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
        { name: 'slimeB', url: '../../assets/Shrem_Blue/spritesheet.json' },
        { name: 'slimeG', url: '../../assets/Shrem_Green/spritesheet.json' },
        { name: 'slimeR', url: '../../assets/Shrem_Red/spritesheet.json' },

        { name: 'buildingC', url: '../../assets/FuncBds/CABIN/spritesheet.json' },
        { name: 'buildingH', url: '../../assets/FuncBds/HEAL/spritesheet.json' },
        { name: 'buildingM', url: '../../assets/FuncBds/MONEY/spritesheet.json' },
        { name: 'buildingS', url: '../../assets/FuncBds/SLEEP/spritesheet.json' },
        { name: 'buildingT', url: '../../assets/FuncBds/TESTING/spritesheet.json' },

        { name: 'buildingCi', url: '../../assets/Infected/CABIN/spritesheet.json' },
        { name: 'buildingHi', url: '../../assets/Infected/HEAL/spritesheet.json' },
        { name: 'buildingMi', url: '../../assets/Infected/MONEY/spritesheet.json' },
        { name: 'buildingSi', url: '../../assets/Infected/SLEEP/spritesheet.json' },
        { name: 'buildingTi', url: '../../assets/Infected/TESTING/spritesheet.json' },

        { name: 'sunshine', url: '../../assets/Props/Sunshine/spritesheet.json' }];
    const functions = [
        () => AnimSlimee(app, "Blue"),
        () => AnimSlimee(app, "Green"),
        () => AnimSlimee(app, "Red"),

        () => AnimBuilding(app, "CABIN"),
        () => AnimSunshine(app)
        // () => AnimBuilding(app, type, pos),
    ];
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
