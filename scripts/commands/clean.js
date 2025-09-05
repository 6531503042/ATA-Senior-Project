import spawn from 'cross-spawn';
import path from 'path';
import fs from 'fs';

function cleanProject(cwd, name, command, args) {
    console.log(`🧹 Cleaning ${name}...`);
    const result = spawn.sync(command, args, {
        cwd,
        stdio: 'inherit'
    });

    if (result.status !== 0) {
        console.log(`⚠️  Warning: Failed to clean ${name} with command`);
    }

    console.log(`✅ ${name} cleaned successfully`);
}

function cleanNodeModules(dirPath, name) {
    const nodeModulesPath = path.join(dirPath, 'node_modules');
    const buildPath = path.join(dirPath, '.next');
    
    console.log(`🧹 Cleaning ${name}...`);
    
    try {
        if (fs.existsSync(nodeModulesPath)) {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            console.log(`✅ Removed node_modules for ${name}`);
        }
        
        if (fs.existsSync(buildPath)) {
            fs.rmSync(buildPath, { recursive: true, force: true });
            console.log(`✅ Removed .next build for ${name}`);
        }
        
        console.log(`✅ ${name} cleaned successfully`);
    } catch (error) {
        console.log(`⚠️  Warning: Failed to clean ${name}:`, error.message);
    }
}

export async function runCleanCommand() {
    const projectRoot = process.cwd();
    
    console.log('🧹 Starting clean process...\n');
    
    try {
        // Clean Backend
        cleanProject(
            path.join(projectRoot, 'backend/main'), 
            'Backend', 
            './gradlew', 
            ['clean', '--no-daemon']
        );
        
        // Clean Admin Frontend
        cleanNodeModules(
            path.join(projectRoot, 'frontend/admin'), 
            'Admin Frontend'
        );
        
        // Clean Employee Frontend
        cleanNodeModules(
            path.join(projectRoot, 'frontend/employee'), 
            'Employee Frontend'
        );
        
        console.log('\n🎉 All projects cleaned successfully!');
        console.log('💡 Run `ata install` to reinstall dependencies');
        
    } catch (error) {
        console.error('\n❌ Clean failed:', error.message);
        process.exit(1);
    }
}
