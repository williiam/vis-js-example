import { splunkApi } from "./index";

const login = async ({ username, password }: { username: string; password: string }) => {
  const response = await splunkApi.post("/services/auth/login", {
    username,
    password,
  });

  return response;
};

export { login };
