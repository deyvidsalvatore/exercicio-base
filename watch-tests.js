const { spawn } = require("child_process");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const triggerFile = ".runner/.trigger";
const resultFile = ".runner/.test-result";

if (!fs.existsSync(".runner")) fs.mkdirSync(".runner");
if (!fs.existsSync(triggerFile)) fs.writeFileSync(triggerFile, "");

const app = express();
app.use(cors());
app.get("/api/status", (req, res) => {
  try {
    const status = fs.readFileSync(resultFile, "utf8");
    res.json({ status: status.trim() });
  } catch (error) {
    res.json({ status: "PENDING" });
  }
});

app.listen(3000, () => {
  console.log("[WEBHOOK API] Express rodando na porta 3000...");
});

fs.watch(triggerFile, (eventType) => {
  if (eventType === "change") {
    console.log("\n[TEST RUNNER] Disparando testes...\n");
    fs.writeFileSync(resultFile, "RUNNING");

    const testProcess = spawn("npx", ["ng", "test"], {
      stdio: "inherit",
      shell: true,
    });

    testProcess.on("close", (code) => {
      const status = code === 0 ? "PASS" : "FAIL";
      fs.writeFileSync(resultFile, status);
      console.log(
        `\nArquivo atualizado! Express pronto para servir: ${status}`,
      );
    });
  }
});
