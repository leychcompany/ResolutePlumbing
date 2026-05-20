import { spawn } from "node:child_process";

const proc = spawn("vercel", ["dev"], { stdio: "inherit" });

proc.on("exit", (code) => process.exit(code ?? 0));
proc.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
