import client from "./client";

export const listSessions = (algorithm) =>
  client.get("/sessions", { params: algorithm ? { algorithm } : {} }).then((r) => r.data);

export const createSession = (payload) => client.post("/sessions", payload).then((r) => r.data);

export const updateSession = (id, payload) => client.put(`/sessions/${id}`, payload).then((r) => r.data);

export const deleteSession = (id) => client.delete(`/sessions/${id}`);
