import { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import hub from "../assets/hub.png";

interface NodeData {
  id: string;
  label: string;
  group: string;
  srcip: string;
  dstip: string;
  poluuid: string;
  sessionid: string;
  service: string;
  proto: string;
}

interface NewtWorkLog {
  result: NodeData;
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

const defaultOptions = {
  height: "100%",
  width: "100%",
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.1,
    },
  },
  nodes: {
    shape: "image",
    image: hub,
    size: 45,
  },
  edges: {
    color: {
      color: "#d6d6d6",
    },
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

function createIPEdge(srcip: string, dstip: string, entry: NewtWorkLog) {
  return {
    id: `${srcip}-${dstip}-${entry.result.sessionid}`,
    from: srcip,
    to: dstip,
    title: `${entry.result.service} (${entry.result.proto})`,
    value: 1, // You can increment this for repeated connections
  };
}

function VisNetwork() {
  const networkRef = useRef<Network | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<DataSet<NodeData>>(new DataSet());
  const edges = useRef<DataSet<EdgeData>>(new DataSet());
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
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

      edges.current = new DataSet(
        data.map((entry: NewtWorkLog) =>
          createIPEdge(entry.result.srcip, entry.result.dstip, entry)
        )
      );

      console.log({ edges: edges.current });

      const networkData = { nodes: nodes.current, edges: edges.current };

      if (containerRef.current && !networkRef.current) {
        networkRef.current = new Network(
          containerRef.current as HTMLElement,
          networkData,
          defaultOptions
        );
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData(); // Call the fetch function
  }, []);

  // const addNode = () => {
  // if (!nodes.current) return;
  // nodes.current.add({
  // id: (nodes.current.length + 1).toString(),
  // label: `Node ${nodes.current.length + 1}`,
  // group: "nodes",
  // });
  // };

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <>
      <div ref={containerRef} className="graph-container" />
      {/* <button onClick={addNode} type="button" className="add-node-button"> */}
      {/* Add Node */}
      {/* </button> */}
    </>
  );
}

export default VisNetwork;
