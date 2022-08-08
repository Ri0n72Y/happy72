import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import * as U from "../utils";
import * as UI from "./UI";
import * as AG from "./AnimGenerator";
import { app } from "electron";

const PIXIConfig = {
    width: U.CANVAS_WIDTH,
    height: U.CANVAS_HEIGHT,
    backgroundColor: 0x66ccff,
    resolution: window.devicePixelRatio,
} as const;

function Pixi() {
    const app = new PIXI.Application(PIXIConfig);
    UI.DrawCells(app);
    AG.AnimSlimee(app, 'Blue');
    // AG.AnimSunshine(app);

    const ReactContainer = useRef(null);
    useEffect(() => {
        ReactContainer.current.innerHTML = "";
        ReactContainer.current.append(app.view);
    }, [ReactContainer, app]);
    return <div className="main-canvas" ref={ReactContainer} />
}

export default Pixi;
