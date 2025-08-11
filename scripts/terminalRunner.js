import path from 'path';
import { spawn } from 'child_process';
import os from 'os';

export function runInNewTerminal(title, command, cwd) {
  const fullPath = path.resolve(cwd);
  const platform = os.platform();

  let cmd;

  if (platform === 'win32') {
    cmd = `start "${title}" cmd /k "cd /d ${fullPath} && ${command}"`;
  } else if (platform === 'darwin') {
    cmd = `osascript -e 'tell app "Terminal" to do script "cd \\"${fullPath}\\" && ${command}"'`;
  } else if (platform === 'linux') {
    cmd = `gnome-terminal -- bash -c 'cd "${fullPath}" && ${command}; exec bash'`;
  } else {
    console.error('❌ ไม่รองรับ OS นี้');
    return;
  }
  const [command, ...args] = cmd.split(' ');
  spawn(command, args, { stdio: 'inherit' });
}