import React, { useMemo } from "react";
import './app.less';
import Pixi from "./pixi/Pixi";

function App() {
  const canvas = useMemo(() => <Pixi />, []);
  return (<div>
    {canvas}
  </div>)
}

export default App;