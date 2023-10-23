"use client";
import { Fragment, useState } from "react";
import { DirectedGraph } from "graphology";
import { hasCycle, topologicalGenerations } from "graphology-dag";

const makeMaterialsGraph = (recipesData) => {
  const materialsGraph = new DirectedGraph();
  Array.prototype.forEach.call(
    Object.entries(recipesData),
    ([recipeName, recipeInfo]) => {
      if ("materials" in recipeInfo === false) {
        console.warn(`Found recipe ${recipeName} without materials`);
        return;
      }
      Array.prototype.forEach.call(
        Object.entries(recipeInfo["materials"]),
        ([materialName, materialCount]) => {
          materialsGraph.mergeEdge(recipeName, materialName, {
            count: materialCount,
          });
        }
      );
    }
  );
  return materialsGraph;
};

export default function RecipeGraph({ recipesData }) {
  const [materialsGraph, setMaterialsGraph] = useState(
    makeMaterialsGraph(recipesData)
  );
  return (
    <Fragment>
      <ul>
        <li key="order">Number of nodes: {materialsGraph.order}</li>
        <li key="size">Number of edges: {materialsGraph.size}</li>
        <li key="cycle">
          Graph has cycle: {hasCycle(materialsGraph) ? "true" : "false"}
        </li>
      </ul>
      <ul>
        {Array.prototype.map.call(
          topologicalGenerations(materialsGraph),
          (topologicalList, i) => {
            return <li key={i}>{JSON.stringify(topologicalList)}</li>;
          }
        )}
      </ul>
    </Fragment>
  );
}
