import client from "./client";

export const register = (username, email, password) =>
  client.post("/auth/register", { username, email, password }).then((r) => r.data);

export const login = (email, password) =>
  client.post("/auth/login", { email, password }).then((r) => r.data);

export const fetchMe = () => client.get("/auth/me").then((r) => r.data);
