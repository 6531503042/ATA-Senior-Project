import spawn from 'cross-spawn';
import path from 'path';

function buildProject(cwd, name, command, args) {
    console.log(`🔨 Building ${name}...`);
    const result = spawn.sync(command, args, {
        cwd,
        stdio: 'inherit'
    });

    if (result.status !== 0) {
        throw new Error(`❌ Failed to build ${name}`);
    }

    console.log(`✅ ${name} built successfully`);
}

export async function runBuildCommand() {
    const projectRoot = process.cwd();
    
    console.log('🔨 Starting build process...\n');
    
    try {
        // Build Backend
        buildProject(
            path.join(projectRoot, 'backend/main'), 
            'Backend', 
            './gradlew', 
            ['build', '--no-daemon']
        );
        
        // Build Admin Frontend
        buildProject(
            path.join(projectRoot, 'frontend/admin'), 
            'Admin Frontend', 
            'bun', 
            ['run', 'build']
        );
        
        // Build Employee Frontend
        buildProject(
            path.join(projectRoot, 'frontend/employee'), 
            'Employee Frontend', 
            'bun', 
            ['run', 'build']
        );
        
        console.log('\n🎉 All projects built successfully!');
        
    } catch (error) {
        console.error('\n❌ Build failed:', error.message);
        process.exit(1);
    }
}
