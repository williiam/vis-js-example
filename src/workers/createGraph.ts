import type { EdgeMap, NewtWorkLog, NodeData } from "../types/vis-network";

self.onmessage = (event) => {
  const data: NewtWorkLog[] = event.data;
  const edgeMap: EdgeMap = {};
  const uniqueIPs = new Set<string>();
  const nodeData: Array<Pick<NodeData, "id" | "label" | "group">> = [];

  for (const entry of data) {
    // Create nodes
    if (!uniqueIPs.has(entry.result.srcip)) {
      uniqueIPs.add(entry.result.srcip);
      nodeData.push({
        id: entry.result.srcip,
        label: entry.result.srcip,
        group: "nodes",
      });
    }
    if (!uniqueIPs.has(entry.result.dstip)) {
      uniqueIPs.add(entry.result.dstip);
      nodeData.push({
        id: entry.result.dstip,
        label: entry.result.dstip,
        group: "nodes",
      });
    }

    // Create edges
    const key = `${entry.result.srcip}-${entry.result.dstip}`;
    if (!edgeMap[key]) {
      edgeMap[key] = { count: 0, services: new Set(), protocols: new Set() };
    }
    edgeMap[key].count++;
    edgeMap[key].services.add(entry.result.service);
    edgeMap[key].protocols.add(entry.result.proto);
  }

  const edges = Object.entries(edgeMap).map(([key, value]) => {
    const [from, to] = key.split("-");
    return {
      id: key,
      from,
      to,
      value: value.count,
      title: `Connections: ${value.count}`,
      color: getEdgeColor(Array.from(value.services)[0]),
    };
  });

  self.postMessage({ nodes: nodeData, edges });
};

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
