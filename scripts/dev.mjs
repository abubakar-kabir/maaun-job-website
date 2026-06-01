import { spawn } from 'node:child_process';

function run(label, command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${label}] exited with code ${code}`);
      process.exit(code);
    }
  });
  return child;
}

const server = run('api', 'npm', ['run', 'server']);
const web = run('web', 'npm', ['run', 'dev:client']);

function shutdown() {
  server.kill();
  web.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
