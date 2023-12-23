"use client";
import { DirectedGraph } from "graphology";
import { RecipeGraphContext } from "./Contexts";
import "client-only";

function makeGraph(recipesData) {
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
}

export default function RecipeGraphContextProvider({ children, recipesData }) {
  return (
    <RecipeGraphContext.Provider value={makeGraph(recipesData)}>
      {children}
    </RecipeGraphContext.Provider>
  );
}
