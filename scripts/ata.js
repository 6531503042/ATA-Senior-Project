#!/usr/bin/env node

const command = process.argv[2];

switch (command) {
    case 'dev': {
      const module = await import('./commands/dev.js');
      await module.runDevCommand();
      break;
    }
    case 'install': {
      const module = await import('./commands/install.js');
      await module.runInstallCommand();
      break;
    }
    case 'i': {
      const module = await import('./commands/install.js');
      await module.runInstallCommand();
      break;
    }
    default:
      console.log(`unknown command: ${command}`);
      console.log('ใช้ได้: dev, install');
  }