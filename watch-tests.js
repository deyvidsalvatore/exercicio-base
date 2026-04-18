const { spawn } = require("child_process");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

let isRunning = false;

app.post("/api/run-tests", (req, res) => {
  if (isRunning) {
    return res
      .status(429)
      .json({ error: "Tests are already running. Please wait." });
  }

  isRunning = true;
  console.log("[WEBHOOK] Received request to run tests.");

  const testProcess = spawn("npx", ["ng", "test"], {
    stdio: "inherit",
    shell: true,
  });

  testProcess.on("close", (code) => {
    isRunning = false;

    const status = code === 0 ? "PASS" : "FAIL";
    console.log(`[WEBHOOK] Tests completed with status: ${status}`);

    res.json({ status: status });
  });
});

app.listen(3000, () => {
  console.log("[WEBHOOK API] Express server listening on port 3000.");
});
