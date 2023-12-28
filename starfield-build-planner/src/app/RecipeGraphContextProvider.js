"use client";
import "client-only";
import { DirectedGraph } from "graphology";
import { useMemo } from "react";
import { RecipeGraphContext } from "./Contexts";

function makeGraph(recipesData) {
  const materialsGraph = new DirectedGraph({ allowSelfLoops: false });
  Array.prototype.forEach.call(
    Object.entries(recipesData),
    ([recipeName, recipeInfo]) => {
      if ("workstation" in recipeInfo === false) {
        console.warn(
          `Found recipe ${recipeName} without associated workstation`
        );
      } else {
        materialsGraph.mergeNode(recipeName, {
          workstation: recipeInfo["workstation"],
        });
      }
      if ("skills" in recipeInfo) {
        materialsGraph.mergeNode(recipeName, { skills: recipeInfo["skills"] });
      }
      if ("materials" in recipeInfo === false) {
        console.warn(`Found recipe ${recipeName} without materials`);
        return;
      } else {
        Array.prototype.forEach.call(
          Object.entries(recipeInfo["materials"]),
          ([materialName, materialCount]) => {
            materialsGraph.mergeEdge(recipeName, materialName, {
              count: materialCount,
            });
          }
        );
      }
    }
  );
  return materialsGraph;
}

export default function RecipeGraphContextProvider({ recipesData, children }) {
  const recipeGraph = useMemo(() => makeGraph(recipesData), [recipesData]);
  return (
    <RecipeGraphContext.Provider value={makeGraph(recipesData)}>
      {children}
    </RecipeGraphContext.Provider>
  );
}
