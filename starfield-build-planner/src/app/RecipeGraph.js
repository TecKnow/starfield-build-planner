"use client";
import { Fragment, useEffect } from "react";
import { DirectedGraph } from "graphology";

export const LoadGraph = ({recipesData}) => {
  useEffect(() => {
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
  }, [recipesData]);
};

export default function RecipeGraph({ recipesData }) {
  return (
    <Fragment>
      
    </Fragment>
  );
}
