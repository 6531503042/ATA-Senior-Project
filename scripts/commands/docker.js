import inquirer from 'inquirer';
import spawn from 'cross-spawn';
import path from 'path';

export async function runDockerCommand() {
    const { selected } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected',
            message: 'Select Docker operation:',
            choices: [
                { name: '🐳 Build All Images', value: 'build' },
                { name: '🚀 Start All Services', value: 'up' },
                { name: '🛑 Stop All Services', value: 'down' },
                { name: '🔄 Restart All Services', value: 'restart' },
                { name: '📊 View Service Status', value: 'status' },
                { name: '📋 View Service Logs', value: 'logs' },
                { name: '🧹 Clean Up (Remove containers, networks, volumes)', value: 'clean' },
                { name: '🔧 Build & Start All Services', value: 'build-up' },
            ],
        },
    ]);
    
    const projectRoot = process.cwd();
    
    switch (selected) {
        case 'build':
            console.log('🐳 Building all Docker images...');
            spawn('docker', ['compose', 'build'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'up':
            console.log('🚀 Starting all services...');
            spawn('docker', ['compose', 'up', '-d'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'down':
            console.log('🛑 Stopping all services...');
            spawn('docker', ['compose', 'down'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'restart':
            console.log('🔄 Restarting all services...');
            spawn('docker', ['compose', 'restart'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'status':
            console.log('📊 Service status:');
            spawn('docker', ['compose', 'ps'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'logs':
            const { service } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'service',
                    message: 'Select service to view logs:',
                    choices: [
                        { name: 'All Services', value: '' },
                        { name: 'Backend', value: 'backend' },
                        { name: 'Admin Frontend', value: 'admin-frontend' },
                        { name: 'Employee Frontend', value: 'employee-frontend' },
                        { name: 'PostgreSQL', value: 'postgres' },
                        { name: 'Redis', value: 'redis' },
                    ],
                },
            ]);
            
            const logArgs = service ? ['compose', 'logs', '-f', service] : ['compose', 'logs', '-f'];
            console.log(`📋 Viewing logs for ${service || 'all services'}...`);
            spawn('docker', logArgs, { 
                stdio: 'inherit',
                cwd: projectRoot 
            });
            break;
            
        case 'clean':
            console.log('🧹 Cleaning up Docker resources...');
            console.log('This will remove all containers, networks, and volumes. Continue?');
            
            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Are you sure you want to clean up all Docker resources?',
                    default: false,
                },
            ]);
            
            if (confirm) {
                spawn('docker', ['compose', 'down', '-v', '--remove-orphans'], { 
                    stdio: 'inherit',
                    cwd: projectRoot 
                });
                console.log('✅ Cleanup completed!');
            } else {
                console.log('❌ Cleanup cancelled.');
            }
            break;
            
        case 'build-up':
            console.log('🔧 Building and starting all services...');
            console.log('Building images...');
            spawn('docker', ['compose', 'build'], { 
                stdio: 'inherit',
                cwd: projectRoot 
            }).on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Build successful! Starting services...');
                    spawn('docker', ['compose', 'up', '-d'], { 
                        stdio: 'inherit',
                        cwd: projectRoot 
                    });
                } else {
                    console.log('❌ Build failed!');
                }
            });
            break;

        default:
            console.log('❌ No operation selected.')
    } 
}
