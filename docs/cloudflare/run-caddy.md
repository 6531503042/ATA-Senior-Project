# Run Caddy reverse proxy

## Windows
1. Download caddy.exe: https://caddyserver.com/api/download?os=windows&arch=amd64
2. Place `caddy.exe` in the repo root (same folder as `Caddyfile`).
3. Run:

```powershell
./caddy.exe run --config ./Caddyfile
```

## Linux
```bash
wget -O caddy https://caddyserver.com/api/download?os=linux&arch=amd64 && chmod +x caddy
./caddy run --config ./Caddyfile
```

Proxy routes on http://localhost:8088
- /api/*      -> 127.0.0.1:8080
- /admin/*    -> 127.0.0.1:3000
- /employee/* -> 127.0.0.1:3001
