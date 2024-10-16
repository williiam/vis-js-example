// src/api/auth.ts
import { splunkApi } from "./index";
import qs from "qs";

const login = async ({ username, password }: { username: string; password: string }) => {
  const payload = qs.stringify({ username, password });

  try {
    const response = await splunkApi.post("/services/auth/login", payload);
    return response.data; // Adjust based on your needs
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export { login };
