import spawn from 'cross-spawn'

function installBun(cwd, name) {
    console.log('install dependencies for ${name}....');
    const result = spawn.sync('bun', [
        'install',
        '--prefer-offline'
    ], {
        cwd,
        stdio: 'inherit'
    })

    if (result.status !== 0) {
        throw new Error(`Failed to install dependencies for ${name}`)
    }

    console.log(`dependencies for ${name} installed successfully`)
}

export async function runInstallCommand() {
    installBun('frontend/admin', 'Admin Frontend')

    console.log('installation complete!\n');
    console.log('run `ata dev` to start the development server');
}