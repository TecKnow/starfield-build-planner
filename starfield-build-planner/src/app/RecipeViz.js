"use client";
import "client-only";

import { useContext, useEffect, useRef } from "react";
import { RecipeGraphContext } from "./Contexts";
import { instance } from "@viz-js/viz";

function makeGraphNodesJSON(recipeGraph) {
  return recipeGraph.mapNodes((node) => ({ name: node }));
}

function makeGraphEdgesJSON(recipeGraph) {
  return recipeGraph.mapEdges(
    (edge, attributes, source, target, sourceAttributes, targetAttributes) => {
      return { head: target, tail: source, attributes: { label: attributes["count"] } };
    }
  );
}

function getSkills(recipeGraph){
  //TODO: This includes undefined, doesn't recognize identical skill levels as the same.
  return new Set(recipeGraph.mapNodes((node, attributes)=>attributes["skills"]))
}

function getWorkstations(recipeGraph){
  //TODO: This includes undefined.
  return new Set(recipeGraph.mapNodes((node, attributes)=>attributes["workstation"]))
}

function makeGraphJSON(recipeGraph) {
  return { graphAttributes: {rankdir: "LR"},
           nodes: makeGraphNodesJSON(recipeGraph), 
           edges: makeGraphEdgesJSON(recipeGraph)};
}

export default function RecipeViz() {
  const recipeGraph = useContext(RecipeGraphContext);
  const containerRef = useRef();

  useEffect(() => {
    if (recipeGraph === undefined) return;

    console.log(getWorkstations(recipeGraph));
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
