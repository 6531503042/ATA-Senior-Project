import inquirer from 'inquirer';
import spawn from 'cross-spawn';
import path from 'path';

export async function runDevCommand() {
    const { selected } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected',
            message: 'Select a service to start:',
            choices: [
                { name: '🐳 Docker Compose (All Services)', value: 'docker'},
                { name: '☕ Spring Boot Backend (WebFlux)', value: 'backend'},
                { name: '⚛️  Admin Frontend (Next.js)', value: 'admin' },
                { name: '👤 Employee Frontend (Next.js)', value: 'employee' },
                { name: '🚀 All Frontend Services', value: 'all-frontend' },
                { name: '🔧 Backend Build & Run', value: 'backend-build' },
            ],
        },
    ]);
    
    const projectRoot = process.cwd();
    
    switch (selected) {
        case 'docker': 
            console.log('🐳 Starting Docker Compose...');
            spawn('docker', ['compose', 'up', '-d'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'backend':
            console.log('☕ Starting Spring Boot Backend...');
            spawn('./gradlew', ['bootRun'], { 
                stdio: 'inherit',
                cwd: path.join(projectRoot, 'backend/main')
            });
            break;
            
        case 'admin':
            console.log('⚛️  Starting Admin Frontend...');
            spawn('bun', ['run', 'dev'], { 
                stdio: 'inherit',
                cwd: path.join(projectRoot, 'frontend/admin')
            });
            break;
            
        case 'employee':
            console.log('👤 Starting Employee Frontend...');
            spawn('bun', ['run', 'dev'], { 
                stdio: 'inherit',
                cwd: path.join(projectRoot, 'frontend/employee')
            });
            break;
            
        case 'all-frontend':
            console.log('🚀 Starting All Frontend Services...');
            console.log('Starting Admin Frontend...');
            spawn('bun', ['run', 'dev'], { 
                stdio: 'inherit',
                cwd: path.join(projectRoot, 'frontend/admin')
            });
            
            // Wait a bit then start employee frontend
            setTimeout(() => {
                console.log('Starting Employee Frontend...');
                spawn('bun', ['run', 'dev'], { 
                    stdio: 'inherit',
                    cwd: path.join(projectRoot, 'frontend/employee')
                });
            }, 2000);
            break;
            
        case 'backend-build':
            console.log('🔧 Building and Running Backend...');
            console.log('Building backend...');
            spawn('./gradlew', ['build'], { 
                stdio: 'inherit',
                cwd: path.join(projectRoot, 'backend/main')
            }).on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Build successful! Starting application...');
                    spawn('./gradlew', ['bootRun'], { 
                        stdio: 'inherit',
                        cwd: path.join(projectRoot, 'backend/main')
                    });
                } else {
                    console.log('❌ Build failed!');
                }
            });
            break;

        default:
            console.log('❌ No service selected.')
    } 
}