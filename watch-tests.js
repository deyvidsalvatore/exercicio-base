const { spawn } = require("child_process");
const fs = require("fs");

const triggerFile = ".runner/.trigger";
const resultFile = "src/assets/test-result.json";

if (!fs.existsSync(".runner")) fs.mkdirSync(".runner");
if (!fs.existsSync(triggerFile)) fs.writeFileSync(triggerFile, "");
if (!fs.existsSync("src/assets"))
  fs.mkdirSync("src/assets", { recursive: true });

fs.writeFileSync(resultFile, JSON.stringify({ status: "PENDING" }));

let isRunning = false;
let debounceTimeout = null;

fs.watch(triggerFile, (eventType) => {
  if (eventType === "change") {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      if (isRunning) {
        console.log(
          "[TEST RUNNER] Os testes já estão em execução. Ignorando novo gatilho.",
        );
        return;
      }

      isRunning = true;
      console.log("[TEST RUNNER] Disparando testes...");
      fs.writeFileSync(resultFile, JSON.stringify({ status: "RUNNING" }));

      const testProcess = spawn("npx", ["ng", "test"], {
        stdio: "inherit",
        shell: true,
      });

      testProcess.on("exit", (code) => {
        isRunning = false;

        const processCode = code === null ? 1 : code;
        const status = processCode === 0 ? "PASS" : "FAIL";

        fs.writeFileSync(resultFile, JSON.stringify({ status }));
        console.log(`[TEST RUNNER] Testes concluídos com status: ${status}`);
      });
    }, 500);
  }
});
