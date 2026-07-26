import client from "./client";

export const solveProblem = (problem) =>
  client.post("/solver/solve", { problem }).then((r) => r.data);
