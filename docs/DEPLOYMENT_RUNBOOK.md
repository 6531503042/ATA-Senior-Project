# Deployment Runbook (Caddy + Cloudflare)

Single, end-to-end guide for running ATA Senior Project in a production-like setup with Caddy and Cloudflare. Use this as the handoff document for anyone deploying or operating the stack.

## Contents
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Build + runtime preparation](#build--runtime-preparation)
- [Start the platform](#start-the-platform)
- [Reverse proxy](#reverse-proxy)
- [Cloudflare tunnel](#cloudflare-tunnel)
- [Health checks & verification](#health-checks--verification)
- [Operational playbook](#operational-playbook)

## Repository layout
- `ops/caddy/` — `caddy.exe` and `Caddyfile` used by the reverse proxy.
- `ops/cloudflare/` — Cloudflare tunnel configuration (named tunnel credentials/config when used).
- `scripts/` — cross-platform helper scripts, including tunnel helpers under `scripts/cloudflare/`.
- `scripts/windows/` — Windows-specific all-in-one launcher.
- Services: `Backend/main` (Spring Boot API), `frontend/admin` and `frontend/employee` (Next.js apps).

## Prerequisites
- Java 17+
- Node.js 18+ (for building the frontends)
- Caddy (place `caddy.exe` in `ops/caddy/` or install system-wide)
- Cloudflared (for Cloudflare Tunnel)
- Git, and access to the repository

## Build + runtime preparation
1. Install dependencies for the frontends:
   ```bash
   npm install
   ```
2. Build production bundles:
   ```bash
   cd frontend/admin && npm run build && cd ../employee && npm run build && cd ../..
   ```
3. Ensure the backend can start (Gradle wrapper is included):
   ```bash
   cd Backend/main && ./gradlew bootRun && cd ../..
   ```
   Stop it after verifying; the launcher scripts will handle startup.
4. Verify `ops/caddy/Caddyfile` matches the desired host/port mapping (defaults route `/admin` to 3000, `/employee` to 3001, `/api/*` to 8080 via port 8088).

## Start the platform
### Windows (all-in-one)
Run the consolidated launcher that starts backend, both frontends, Caddy, and Cloudflare tunnel:
```powershell
./scripts/windows/start-all-services.ps1
```

### Linux/macOS
Use the shell starter to launch API, frontends, and Caddy:
```bash
./scripts/start-all.sh
```

If you need the tunnel as part of startup, use the combined script:
```powershell
./scripts/start-all-with-tunnel.ps1
```

## Reverse proxy
To run only the proxy (after services are up):
```powershell
./ops/caddy/caddy.exe run --config ./ops/caddy/Caddyfile
```
Restart with the hardened helper (frees ports, validates config):
```powershell
./scripts/restart-caddy.ps1
```

## Cloudflare tunnel
### Quick tunnel (temporary URL)
```powershell
./scripts/cloudflare/start-quick-tunnel.ps1
```
The latest URL is written to `logs/current-cloudflare-url.txt`.

### Named tunnel (static domain)
1. Authenticate once: `cloudflared tunnel login`.
2. Create a tunnel: `cloudflared tunnel create ata-tunnel` (store the tunnel ID).
3. Fill `ops/cloudflare/config.yml` with your ingress rules and `credentials-file` path.
4. Start the tunnel:
   ```powershell
   ./scripts/cloudflare/start-named-tunnel.ps1
   ```

## Health checks & verification
- API: `curl http://127.0.0.1:8080/api/health`
- Admin app: `curl http://127.0.0.1:3000/admin --head`
- Employee app: `curl http://127.0.0.1:3001/employee/login --head`
- Proxy: `curl http://127.0.0.1:8088/admin --head`
- Tunnel status: `Get-Process cloudflared -ErrorAction SilentlyContinue`

## Operational playbook
- **Clean restart of proxy**: `./scripts/restart-caddy.ps1`.
- **Stop Cloudflare tunnel**: `Stop-Process -Name cloudflared -Force`.
- **Check service health**: `./scripts/check-services-health.ps1` (Windows PowerShell).
- **Investigate 502/504**:
  1. Confirm backend and frontends are up (see health checks above).
  2. Restart proxy: `./scripts/restart-caddy.ps1`.
  3. Recreate quick tunnel: stop `cloudflared`, then run `./scripts/cloudflare/start-quick-tunnel.ps1`.
- **Log locations**: Cloudflare logs under `logs/cloudflared.log`; app logs emitted to console by default.

This runbook replaces the scattered individual setup docs; keep it with the codebase when handing off to operations.
