# Public Tunnel (TryCloudflare / LocalTunnel)

1) Start all services (backend + frontends)
- Windows: `./scripts/start-all.ps1`
- Linux/macOS: `./scripts/start-all.sh`

2) Start Caddy at :8088
- Windows: `./caddy.exe run --config ./Caddyfile`
- Linux: `./caddy run --config ./Caddyfile`

3) Use one of the tunnels

TryCloudflare (recommended when installed):
- Windows: `./scripts/public-tunnel.ps1`
- Linux/macOS: `./scripts/public-tunnel.sh`

LocalTunnel (no install required):
- `npx localtunnel --port 8088 --subdomain ata-portal`
- Windows helper: double-click `run-tunnels.cmd`
- PowerShell helper: `pwsh -File scripts/run-lt.ps1 -Port 8088 -Subdomain ata-portal -PrintRequests`

You will get a public URL like `https://<random>.trycloudflare.com` or `https://<name>.loca.lt`.

Final endpoints:
- <PUBLIC_URL>/api/**
- <PUBLIC_URL>/admin/**
- <PUBLIC_URL>/employee/**
