import type { EdgeMap, NewtWorkLog } from "../types/vis-network";

self.onmessage = (event) => {
  const data: NewtWorkLog[] = event.data;
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

  self.postMessage(edges);
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

