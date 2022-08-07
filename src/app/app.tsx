import React, { useEffect, useMemo, useRef } from "react";
import * as PIXI from "pixi.js";
import * as U from "./utils";
import { Slime } from "../assets/ShremAnim/AnimatedImage";
import './app.less';

function App() {
  const canvas = useMemo(() => <Pixi />, []);
  return (<div>
    {canvas}
  </div>)
}

const PIXIConfig = {
  width: U.WINDOW_WIDTH,
  height: U.WINDOW_HEIGHT,
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
  });

  const ReactContainer = useRef(null);
  useEffect(() => {
    ReactContainer.current.innerHTML = "";
    ReactContainer.current.append(app.view);
  }, [ReactContainer, app]);
  return <div className="main-canvas" ref={ReactContainer} />
}

export default App;