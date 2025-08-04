import inquirer from 'inquirer';
import spawn from 'cross-spawn';

export async function runDevComand() {
    const { selected } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected',
            message: 'Select a service to start:',
            choices: [
                { name: 'Docker Compose', value: 'docker'},
                { name: 'Webflux Backend', value: 'webflux'},
                { name: 'Next.js Admin Frontend', value: 'admin' },
            ],
        },
    ]);
    
    switch (selected) {
        case 'docker': 
            spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });
            break;
        case 'webflux':
            spawn('bun', ['run', 'dev'], { stdio: 'inherit' });
            break;
        case 'admin':
            spawn('bun', ['run', 'dev'], { stdio: 'inherit' });
            break;

        default:
            console.log('No service selected.')
    } 
}