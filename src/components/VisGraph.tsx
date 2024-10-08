import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";

type NodeData = {
  id: number;
  label: string;
  group: string;
};

type EdgeData = {
  from: number;
  to: number;
};

function VisGraph() {
  const visJsContainerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ nodes: NodeData[]; edges: EdgeData[] }>({
    nodes: [],
    edges: [],
  });
  const [network, setNetwork] = useState<Network | null>(null);

  useEffect(() => {
    if (visJsContainerRef.current) {
      fetch("src/data/node-data.json")
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setNetwork(
            new Network(
              visJsContainerRef.current as HTMLElement,
              {
                nodes: data.nodes,
                edges: data.edges,
              },
              {
                height: "100%",
                width: "100%",
                physics: { enabled: false },
              }
            )
          );
        });
    }
  }, []);
  return <div ref={visJsContainerRef} className="graph-container" />;
}

export default VisGraph;
