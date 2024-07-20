const { spawn } = require("child_process");

process.on('message', (packet) => {
  if (packet.type === 'process:msg' && packet.topic === 'command') {
    const { command, path } = packet.data;
    const commandProcess = runCommand(command, path);

    commandProcess.stdout.on('data', (data) => {
      process.send({
        type: 'process:msg',
        data: data.toString(),
        topic: 'command-out',
      });
    });

    commandProcess.stderr.on('data', (data) => {
      process.send({
        type: 'process:msg',
        data: data.toString(),
        topic: 'command-out',
      });
    });

    commandProcess.on('close', (code) => {
      process.send({
        type: 'process:msg',
        data: `Process exited with code ${code}`,
        topic: 'command-out',
      });
    });
  }
});

function runCommand(cmd, cwd) {
  const shell = '/bin/sh';
  const shellFlag = '-c';

  return spawn(shell, [shellFlag, cmd], { cwd });
}
