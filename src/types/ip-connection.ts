export interface ConnectionEntry {
  time: string;
  direction: "outgoing" | "incoming";
  otherIP: string;
  service: string;
  srcPort: string;
  dstPort: string;
  traffic: number;
}

export interface ConnectionHistory {
  [key: string]: ConnectionEntry[];
}
