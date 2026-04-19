const { spawn } = require("child_process");
const fs = require("fs");

const triggerFile = ".runner/.trigger";
const resultFile = "public/test-result.json";

if (!fs.existsSync(".runner")) {
  fs.mkdirSync(".runner");
}

if (!fs.existsSync(triggerFile)) fs.writeFileSync(triggerFile, "");

if (!fs.existsSync("public")) {
  fs.mkdirSync("public", { recursive: true });
}

console.log("[TEST RUNNER] Aguardando o clique no botão RUN TESTS...");

fs.watch(triggerFile, (eventType) => {
  if (eventType === "change") {
    console.log("\n[TEST RUNNER] Disparando testes...\n");

    fs.writeFileSync(resultFile, JSON.stringify({ status: "RUNNING" }));

    const testProcess = spawn("npx", ["ng", "test", "--watch=false"], {
      stdio: "inherit",
      shell: true,
    });

    testProcess.on("close", (code) => {
      const status = code === 0 ? "PASS" : "FAIL";

      fs.writeFileSync(resultFile, JSON.stringify({ status }));

      if (status === "PASS") {
        console.log("\nTODOS OS TESTES PASSARAM!");
      } else {
        console.log("\nALGUNS TESTES FALHARAM.");
      }
    });
  }
});
