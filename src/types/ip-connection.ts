export interface ConnectionEntry {
  time: string;
  direction: "outgoing" | "incoming";
  otherIP: string;
  service: string;
  srcport: string;
  dstport: string;
  traffic: number;
}

export interface ConnectionHistory {
  [key: string]: ConnectionEntry[];
}
