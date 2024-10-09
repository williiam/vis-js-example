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

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

const defaultOptions = {
  height: "100%",
  width: "100%",
  physics: false,
  nodes: {
    shape: "image",
    image: hub,
    size: 10,
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
        data.map((entry: { result: NodeData }, index: number) => ({
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
