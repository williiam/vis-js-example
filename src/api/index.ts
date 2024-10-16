import axios from "axios";

const splunkHost = import.meta.env.VITE_SPLUNK_HOST;
const splunkPort = import.meta.env.VITE_SPLUNK_PORT;

export const splunkApi = axios.create({
  baseURL: `https://${splunkHost}:${splunkPort}`,
});
