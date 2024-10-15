export interface EdgeMap {
  [key: string]: {
    count: number;
    services: Set<string>;
    protocols: Set<string>;
  };
}

export interface NodeData {
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

export interface NewtWorkLog {
  result: NodeData;
}

export interface EdgeData {
  id: string;
  from: string;
  to: string;
  value: number;
}

export interface NetworkEventParams<T> {
  nodes: Array<NodeData["id"]>;
  edges: Array<EdgeData["id"]>;
  event: T;
  pointer: {
    DOM: {
      x: number;
      y: number;
    };
    canvas: {
      x: number;
      y: number;
    };
  };
}
