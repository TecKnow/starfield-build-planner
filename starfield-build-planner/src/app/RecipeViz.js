"use client";
import "client-only";

import { useContext, useEffect, useRef, useState } from "react";
import { RecipeGraphContext } from "./Contexts";
import { instance } from "@viz-js/viz";

function makeGraphJSON(recipeGraph){
    return {edges:[{tail: "a", head: "b"}]}
}

export default function RecipeViz() {
  const recipeGraph = useContext(RecipeGraphContext);
  const containerRef = useRef();

  useEffect(() => {
    if (recipeGraph === undefined) return;

    const containingElement = containerRef.current;
    const graphElement = (async () => {
      const viz = await instance();
      const graphElement = viz.renderSVGElement(makeGraphJSON(recipeGraph));
      containerRef.current.appendChild(graphElement);
      return graphElement;
    })();

    return async () => {
      containingElement.removeChild(await graphElement);
    };
  }, [recipeGraph]);

  return <div ref={containerRef} />;
}
