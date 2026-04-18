const { spawn } = require("child_process");
const fs = require("fs");

const triggerFile = ".runner/.trigger";
const resultFile = "src/assets/test-result.json";

if (!fs.existsSync(".runner")) fs.mkdirSync(".runner");
if (!fs.existsSync(triggerFile)) fs.writeFileSync(triggerFile, "");
if (!fs.existsSync("src/assets"))
  fs.mkdirSync("src/assets", { recursive: true });

fs.writeFileSync(resultFile, JSON.stringify({ status: "PENDING" }));

fs.watch(triggerFile, (eventType) => {
  if (eventType === "change") {
    console.log("[TEST RUNNER] Disparando testes...");
    fs.writeFileSync(resultFile, JSON.stringify({ status: "RUNNING" }));

    const testProcess = spawn("npx", ["ng", "test", "--watch=false"], {
      stdio: "inherit",
      shell: true,
    });

    testProcess.on("close", (code) => {
      const status = code === 0 ? "PASS" : "FAIL";
      fs.writeFileSync(resultFile, JSON.stringify({ status }));
      console.log(`[TEST RUNNER] Testes concluídos com status: ${status}`);
    });
  }
});
