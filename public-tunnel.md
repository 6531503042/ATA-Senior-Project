# Public Tunnel (TryCloudflare)

1) Start all services (backend + frontends)
- Windows: `./scripts/start-all.ps1`
- Linux/macOS: `./scripts/start-all.sh`

2) Start Caddy at :8088
- Windows: `./caddy.exe run --config ./Caddyfile`
- Linux: `./caddy run --config ./Caddyfile`

3) Run the tunnel
- Windows: `./scripts/public-tunnel.ps1`
- Linux/macOS: `./scripts/public-tunnel.sh`

You will get a public URL like `https://<random>.trycloudflare.com`.

Final endpoints:
- <PUBLIC_URL>/api/**
- <PUBLIC_URL>/admin/**
- <PUBLIC_URL>/employee/**
