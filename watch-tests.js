const { spawn } = require("child_process");
const fs = require("fs");

const triggerFile = ".runner/.trigger";
const resultFile = ".runner/.test-result";

if (!fs.existsSync(".runner")) {
  fs.mkdirSync(".runner");
}

if (!fs.existsSync(triggerFile)) fs.writeFileSync(triggerFile, "");

console.log("[TEST RUNNER] Aguardando o clique no botão RUN TESTS...");

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

      if (status === "PASS") {
        console.log("\nTODOS OS TESTES PASSARAM!");
      } else {
        console.log("\nALGUNS TESTES FALHARAM.");
      }
    });
  }
});
