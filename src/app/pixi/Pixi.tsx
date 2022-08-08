import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import * as U from "../utils";
import * as UI from "./UI";
import { app } from "electron";
import { init, GeneBuilding, AnimSlimee, SingleSlimee, AnimBuilding, AnimSunshine, playSound } from "./AnimGenerator";
import * as AG from "./AnimGenerator";
import { ISlimeProps, Vec2 } from "../utils/gameProps.typed"

const PIXIConfig = {
    width: U.CANVAS_WIDTH,
    height: U.CANVAS_HEIGHT,
    backgroundColor: 0x66ccff,
    resolution: window.devicePixelRatio,
} as const;

function Pixi() {
    const app = new PIXI.Application(PIXIConfig);
    UI.setBackground(app);
    UI.DrawCells(app);
    app.stage.sortableChildren = true;
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

        { name: 'sunshine', url: '../../assets/Props/Sunshine/spritesheet.json' },

        { name: 'mysound', url: '../../assets/sounds/Music/ending.wav' }

    ];
    const functions = [
        () => AnimSlimee(app, "Blue"),
        () => AnimSlimee(app, "Green"),
        () => AnimSlimee(app, "Red"),


        () => GeneBuilding(app,
            {
                type: "HEAL",
                pos: {
                    x: 0.4 * app.screen.width, y: 0.4 * app.screen.height
                },
                tags: []
            }),
        () => GeneBuilding(app,
            {
                type: "TESTING",
                pos: {
                    x: 0.4 * app.screen.width, y: 0.5 * app.screen.height
                },
                tags: []
            }),
        () => GeneBuilding(app,
            {
                type: "MONEY",
                pos: {
                    x: 0.5 * app.screen.width, y: 0.4 * app.screen.height
                },
                tags: []
            }),
        () => GeneBuilding(app,
            {
                type: "CABIN",
                pos: {
                    x: 0.5 * app.screen.width, y: 0.5 * app.screen.height
                },
                tags: []
            }),
        () => GeneBuilding(app,
            {
                type: "SLEEP",
                pos: {
                    x: 0.6 * app.screen.width, y: 0.5 * app.screen.height
                },
                tags: []
            }),
        () => GeneBuilding(app,
            {
                type: "SLEEP",
                pos: {
                    x: 0.6 * app.screen.width, y: 0.4 * app.screen.height
                },
                tags: []
            }),

        () => AnimSunshine(app,
            {
                pos: { x: 0.48 * app.screen.width, y: 0.35 * app.screen.height },
                value: 2
            }),
        () => AnimSunshine(app,
            {
                pos: { x: 0.4 * app.screen.width, y: 0.5 * app.screen.height },
                value: 1
            }),
        () => SingleSlimee(app, "Blue"),
        // () => playSound()
        // () => AnimBuilding(app, type, pos),
    ];
    init(app, functions, sources);

    const ReactContainer = useRef(null);
    useEffect(() => {
        ReactContainer.current.innerHTML = "";
        ReactContainer.current.append(app.view);
    }, [ReactContainer, app]);
    return <div className="main-canvas" ref={ReactContainer} />
}

export default Pixi;
