"use client";

import { useEffect, useRef, useState } from "react";
import { instance } from "@viz-js/viz";

export default function App() {
  const containerRef = useRef();
  const [data, setData] = useState();

  useEffect(() => {
    setData("digraph {a -> b}");
  }, []);

  useEffect(() => {
    if (data === undefined) return;

    const containingElement = containerRef.current;
    const graphElement = (async () => {
      const viz = await instance();
      const graphElement = viz.renderSVGElement(data);
      containerRef.current.appendChild(graphElement);
    })();

    return async () => {
      containingElement.removeChild(await graphElement);
    };
  }, [data]);

  return <div ref={containerRef} />;
}
