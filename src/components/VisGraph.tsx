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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("data/network-log.json"); // Fetching node data
      const data = await response.json();

      nodes.current = new DataSet(
        data.map((entry: NewtWorkLog, index: number) => ({
          id: `${entry.result.poluuid}-${index}`,
          label: entry.result.srcip,
          srcip: entry.result.srcip,
          dstip: entry.result.dstip,
          group: "nodes",
        }))
      ); // Using fetched data

      edges.current = new DataSet(data.edges);

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
