"use client"
import { useEffect } from "react";
import Graph from "graphology";
import {random} from "graphology-layout"
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import forceAtlas2 from "graphology-layout-forceatlas2";
import "@react-sigma/core/lib/react-sigma.min.css";

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode("first", {label: "My first node"});
    graph.addNode("second", {label: "My second node"});
    graph.addEdge("first", "second");
    random.assign(graph);
    forceAtlas2.assign(graph, 50);
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export default function DisplayGraph(){
  return (
    <SigmaContainer style={{ height: "500px", width: "500px" }}>
      <LoadGraph />
    </SigmaContainer>
  );
};