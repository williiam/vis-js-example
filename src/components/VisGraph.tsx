import { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";

interface NodeData {
  id: number; // Changed type from string to number
  label: string;
  group: string;
}

interface EdgeData {
  id: string;
  from: number; // Changed type from string to number
  to: number; // Changed type from string to number
}

const defaultOptions = { height: "100%", width: "100%", physics: false };

function VisNetwork() {
  const networkRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<DataSet<NodeData>>(new DataSet());
  const edges = useRef<DataSet<EdgeData>>(new DataSet());
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("data/node-data.json"); // Fetching node data
      const data = await response.json();

      nodes.current = new DataSet(data.nodes); // Using fetched data

      edges.current = new DataSet(data.edges);

      const container = networkRef.current;
      const networkData = { nodes: nodes.current, edges: edges.current };

      if (container) {
        const network = new Network(
          container as HTMLElement,
          networkData,
          defaultOptions
        );
      }
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData(); // Call the fetch function
  }, []);

  const addNode = () => {
    if (!nodes.current) return;
    nodes.current.add({
      id: nodes.current.length + 1,
      label: `Node ${nodes.current.length + 1}`,
      group: "nodes",
    });
  };

  if (loading) return <div>Loading...</div>; // Show loading state

  return (
    <>
      <div ref={networkRef} style={{ height: "400px" }} />
      <button onClick={addNode} type="button" className="add-node-button">
        Add Node
      </button>
    </>
  );
}

export default VisNetwork;
