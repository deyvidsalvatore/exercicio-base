const { spawn } = require("child_process");
const fs = require("fs");

const triggerFile = ".runner/.trigger";
const resultFile = ".runner/.test-result";

if (!fs.existsSync(".runner")) fs.mkdirSync(".runner");
if (!fs.existsSync(triggerFile)) fs.writeFileSync(triggerFile, "");

function limparLixoParaOSnapshot() {
  const lixos = ["dist", "coverage", ".angular", ".vscode"];
  lixos.forEach((pasta) => {
    if (fs.existsSync(pasta)) {
      try {
        fs.rmSync(pasta, { recursive: true, force: true });
        console.log(`Lixo removido: ${pasta}/`);
      } catch (e) {}
    }
  });
}

console.log("[TEST RUNNER] Aguardando o clique no botão RUN TESTS...");

fs.watch(triggerFile, (eventType) => {
  if (eventType === "change") {
    console.log("\n[TEST RUNNER] Disparando testes...\n");
    fs.writeFileSync(resultFile, "RUNNING");

    limparLixoParaOSnapshot();

    const faxinaEmTempoReal = setInterval(limparLixoParaOSnapshot, 1000);

    const testProcess = spawn("npx", ["ng", "test"], {
      stdio: "inherit",
      shell: true,
    });

    testProcess.on("close", (code) => {
      clearInterval(faxinaEmTempoReal);

      limparLixoParaOSnapshot();

      const status = code === 0 ? "PASS" : "FAIL";
      fs.writeFileSync(resultFile, status);
    });
  }
});
