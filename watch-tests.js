const { spawn } = require('child_process');
const fs = require('fs');

const triggerFile = '.trigger';

if (!fs.existsSync(triggerFile)) {
  fs.writeFileSync(triggerFile, '');
}

console.log('[TEST RUNNER] Aguardando o clique no botão RUN TESTS...');

fs.watch(triggerFile, (eventType) => {
  if (eventType === 'change') {
    console.log('\n[TEST RUNNER] Disparando testes...\n');

    spawn('npx', ['ng', 'test', '--watch=false', '--browsers=ChromeHeadless'], {
      stdio: 'inherit',
      shell: true
    });
  }
});
