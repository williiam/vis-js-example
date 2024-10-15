import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer/esm/vis-data";
import { Network } from "vis-network/peer/esm/vis-network";
import hub from "../assets/hub.png";
import ConnectionHistoryTable from "./ConnectionHistoryTable";

import type {
  EdgeData,
  NodeData,
  NewtWorkLog,
  EdgeMap,
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

function createEdges(data: NewtWorkLog[]) {
  const edgeMap: EdgeMap = {};

  for (const entry of data) {
    const key = `${entry.result.srcip}-${entry.result.dstip}`;
    if (!edgeMap[key]) {
      edgeMap[key] = { count: 0, services: new Set(), protocols: new Set() };
    }
    edgeMap[key].count++;
    edgeMap[key].services.add(entry.result.service);
    edgeMap[key].protocols.add(entry.result.proto);
  }

  return Object.entries(edgeMap).map(([key, value]) => {
    const [from, to] = key.split("-");
    return {
      id: key,
      from,
      to,
      value: value.count, // This will affect edge thickness
      title: `Connections: ${value.count}`,
      color: getEdgeColor(Array.from(value.services)[0]), // Color based on the first service
    };
  });
}

function getEdgeColor(service: string) {
  switch (service) {
    case "DNS":
      return "#FFA500"; // Orange for DNS
    case "HTTPS":
      return "#4CAF50"; // Green for HTTPS
    default:
      return "#2196F3"; // Blue for other services
  }
}

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

      const uniqueIPs = new Set<string>();
      const nodeData = data.flatMap((entry: NewtWorkLog) => {
        const nodes = [];
        if (!uniqueIPs.has(entry.result.srcip)) {
          uniqueIPs.add(entry.result.srcip);
          nodes.push({
            id: entry.result.srcip,
            label: entry.result.srcip,
            group: "nodes",
          });
        }
        if (!uniqueIPs.has(entry.result.dstip)) {
          uniqueIPs.add(entry.result.dstip);
          nodes.push({
            id: entry.result.dstip,
            label: entry.result.dstip,
            group: "nodes",
          });
        }
        return nodes;
      });

      nodes.current = new DataSet(nodeData);

      edges.current = new DataSet(createEdges(data));

      const networkData = { nodes: nodes.current, edges: edges.current };

      function initNetwork() {
        if (!networkRef.current) {
          networkRef.current = new Network(
            containerRef.current as HTMLElement,
            networkData,
            defaultOptions
          );
        }
        networkRef.current.on("click", handleNodeClick);
      }

      animationFrame.current = requestAnimationFrame(initNetwork);
      setLoading(false); // Set loading to false after data is fetched

      // Parse connection connectionHistory
      const connectionHistory: ConnectionHistory = {};
      for (const entry of data) {
        const { srcip, dstip, date, time, service, proto, srcport, dstport } =
          entry.result;
        if (!connectionHistory[srcip]) connectionHistory[srcip] = [];
        if (!connectionHistory[dstip]) connectionHistory[dstip] = [];

        //get traffic from edge dataset, the count value is the traffic
        let traffic = 0;
        const filteredEdges = edges.current.get({
          filter: (edge) => edge.from === srcip && edge.to === dstip,
        });
        if (filteredEdges?.length) {
          traffic = filteredEdges[0].value;
        }

        const commonData = {
          time: `${date} ${time}`,
          service,
          protocol: proto,
          srcPort: srcport,
          dstPort: dstport,
          traffic,
        };

        connectionHistory[srcip].push({
          ...commonData,
          direction: "outgoing",
          otherIP: dstip,
        });

        connectionHistory[dstip].push({
          ...commonData,
          direction: "incoming",
          otherIP: srcip,
        });
      }

      // Sort each node's connectionHistory by time
      for (const ip of Object.keys(connectionHistory)) {
        connectionHistory[ip].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
      }

      setConnectionHistory(connectionHistory);
    };

    fetchData();

    return () => {
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
