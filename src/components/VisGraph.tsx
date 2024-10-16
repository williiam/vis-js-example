import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { type Data, Network } from "vis-network/peer/esm/vis-network";
import hub from "../assets/hub.png";
import ConnectionHistoryTable from "./ConnectionHistoryTable";

import type {
  EdgeData,
  NodeData,
  NetworkEventParams,
} from "../types/vis-network";
import type { ConnectionHistory } from "../types/ip-connection";

const defaultOptions = {
  height: "100%",
  width: "100%",
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -12000,
      centralGravity: 0.2,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.1,
    },
  },
  nodes: {
    shape: "image",
    image: hub,
    size: 92,
    font: {
      size: 32,
      color: "#000",
      face: "arial",
    },
  },
  edges: {
    color: {
      color: "#d6d6d6",
    },
    length: 300,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.5,
      },
    },
  },
  layout: {
    randomSeed: 1,
    improvedLayout: true,
  },
};

function VisNetwork() {
  const networkRef = useRef<Network | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<DataSet<NodeData>>(new DataSet());
  const edges = useRef<DataSet<EdgeData>>(new DataSet());
  const [loading, setLoading] = useState(true); // Added loading state
  const animationFrame = useRef<number | null>(null);
  const [connectionHistory, setConnectionHistory] = useState<ConnectionHistory>(
    {}
  );
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isTableOpen, setIsTableOpen] = useState(false);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/createGraph.ts", import.meta.url),
      { type: "module" }
    );

    const handleNodeClick = (params: NetworkEventParams<MouseEvent>) => {
      const clickedNode = params.nodes[0];
      if (clickedNode) {
        console.log(clickedNode);
        setSelectedNode((prev) => (prev === clickedNode ? prev : clickedNode));
        setIsTableOpen(true);
      }
    };

    const fetchData = async () => {
      const response = await fetch("data/network-log.json"); // Fetching node data
      const data = await response.json();

      worker.postMessage(data);
      worker.onmessage = (
        e: MessageEvent<{
          nodes: NodeData[];
          edges: EdgeData[];
          connectionHistory: ConnectionHistory;
        }>
      ) => {
        console.log("graph created by web worker");
        const {
          nodes: nodeData,
          edges: edgeData,
          connectionHistory: cHistory,
        } = e.data;
        nodes.current = new DataSet(nodeData);
        edges.current = new DataSet(edgeData);
        const networkData = { nodes: nodes.current, edges: edges.current };
        animationFrame.current = requestAnimationFrame(() =>
          initNetwork(networkData)
        );
        setConnectionHistory(cHistory);
      };

      function initNetwork(networkData: Data) {
        if (!networkRef.current) {
          networkRef.current = new Network(
            containerRef.current as HTMLElement,
            networkData,
            defaultOptions
          );
        }
        networkRef.current.on("click", handleNodeClick);
      }

      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();

    return () => {
      worker.terminate();
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (networkRef.current) {
        networkRef.current.off("click", handleNodeClick);
      }
    };
  }, []);

  const closeConnectionHistoryTable = () => {
    setIsTableOpen(false);
  };

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <>
      <div ref={containerRef} className="graph-container" />
      {selectedNode ? (
        <ConnectionHistoryTable
          history={connectionHistory[selectedNode] ?? []}
          nodeIP={selectedNode ?? ""}
          isOpen={isTableOpen}
          onClose={closeConnectionHistoryTable}
        />
      ) : null}
    </>
  );
}

export default VisNetwork;
