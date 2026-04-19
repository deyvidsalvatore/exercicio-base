const { spawn } = require("child_process");

const PREFIX = "@@__TEST_RESULT__@@=";

console.log("[TEST RUNNER] Iniciando testes...");
console.log(PREFIX + JSON.stringify({ status: "RUNNING" }));

const testProcess = spawn("npx", ["ng", "test", "--watch=false"], {
  stdio: "inherit",
  shell: true,
});

testProcess.on("close", (code) => {
  const status = code === 0 ? "PASS" : "FAIL";

  if (status === "PASS") {
    console.log("\nTODOS OS TESTES PASSARAM!");
  } else {
    console.log("\nALGUNS TESTES FALHARAM.");
  }

  console.log(PREFIX + JSON.stringify({ status }));
});
