import spawn from 'cross-spawn'
import path from 'path'

function installBun(cwd, name) {
    console.log(`📦 Installing dependencies for ${name}...`);
    const result = spawn.sync('bun', [
        'install',
        '--prefer-offline'
    ], {
        cwd,
        stdio: 'inherit'
    })

    if (result.status !== 0) {
        throw new Error(`❌ Failed to install dependencies for ${name}`)
    }

    console.log(`✅ Dependencies for ${name} installed successfully`)
}

function installGradle(cwd, name) {
    console.log(`📦 Installing dependencies for ${name}...`);
    const result = spawn.sync('./gradlew', [
        'build',
        '--no-daemon'
    ], {
        cwd,
        stdio: 'inherit'
    })

    if (result.status !== 0) {
        throw new Error(`❌ Failed to build ${name}`)
    }

    console.log(`✅ ${name} built successfully`)
}

export async function runInstallCommand() {
    const projectRoot = process.cwd();
    
    console.log('🚀 Starting installation process...\n');
    
    try {
        // Install Admin Frontend
        installBun(path.join(projectRoot, 'frontend/admin'), 'Admin Frontend');
        
        // Install Employee Frontend
        installBun(path.join(projectRoot, 'frontend/employee'), 'Employee Frontend');
        
        // Build Backend
        installGradle(path.join(projectRoot, 'backend/main'), 'Backend');
        
        console.log('\n🎉 Installation complete!');
        console.log('💡 Available commands:');
        console.log('   • ata dev     - Start development servers');
        console.log('   • ata build   - Build all projects');
        console.log('   • ata clean   - Clean build artifacts');
        
    } catch (error) {
        console.error('\n❌ Installation failed:', error.message);
        process.exit(1);
    }
}