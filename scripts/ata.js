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
    case 'build': {
      const module = await import('./commands/build.js');
      await module.runBuildCommand();
      break;
    }
    case 'clean': {
      const module = await import('./commands/clean.js');
      await module.runCleanCommand();
      break;
    }
    case 'docker': {
      const module = await import('./commands/docker.js');
      await module.runDockerCommand();
      break;
    }
    case 'full-build': {
      console.log('🚀 Running full build process...');
      const { spawn } = await import('child_process');
      const path = await import('path');
      const projectRoot = process.cwd();
      
      spawn('bash', ['build.sh'], { 
        stdio: 'inherit',
        cwd: projectRoot 
      });
      break;
    }
    default:
      console.log(`❌ Unknown command: ${command}`);
      console.log('\n💡 Available commands:');
      console.log('   • ata dev        - Start development servers');
      console.log('   • ata install    - Install all dependencies');
      console.log('   • ata build      - Build all projects');
      console.log('   • ata clean      - Clean build artifacts');
      console.log('   • ata docker     - Docker operations');
      console.log('   • ata full-build - Run complete build process (includes Docker)');
      console.log('\n📖 Usage: ata <command>');
      console.log('\n🔧 Alternative: Use ./build.sh for complete build process');
  }