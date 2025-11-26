# ATA Senior Project

## 🚀 Quick Start

For a single, handoff-ready guide to running the stack with Caddy and Cloudflare, start with the [Deployment Runbook](docs/DEPL
OYMENT_RUNBOOK.md).

If you only need the bare minimum commands:

```powershell
# Start backend + frontends + proxy on Windows
./scripts/windows/start-all-services.ps1

# Start Cloudflare tunnel (quick URL)
./scripts/cloudflare/start-quick-tunnel.ps1

# Get the current tunnel URL
./scripts/cloudflare/get-url.ps1
```

---

## 📁 Project Structure

```
ATA-Senior-Project/
├── Backend/              # Spring Boot backend
├── frontend/
│   ├── admin/           # Admin frontend (Next.js)
│   └── employee/        # Employee frontend (Next.js)
├── ops/
│   ├── caddy/          # Caddyfile + caddy.exe
│   └── cloudflare/     # Cloudflare installers and helpers
├── scripts/
│   ├── cloudflare/     # Cloudflare tunnel scripts
│   ├── commands/       # Build/dev scripts
│   └── windows/        # Windows orchestration helpers
├── docs/               # Documentation
│   └── cloudflare/     # Cloudflare documentation
└── logs/               # Log files
```

---

## 📚 Documentation

- **Deployment Runbook (Caddy + Cloudflare)**: [docs/DEPLOYMENT_RUNBOOK.md](docs/DEPLOYMENT_RUNBOOK.md)
- **Development Guide**: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **API Documentation**: [docs/README-API.md](docs/README-API.md)
- **Commit Guide**: [docs/COMMIT_GUIDE.MD](docs/COMMIT_GUIDE.MD)

---

## 🔧 Configuration

### Cloudflare Tunnel

- **Config Template**: `config/cloudflare/config.yml.template`
- **Setup Guide**: `docs/cloudflare/SETUP_NAMED_TUNNEL.md`
- **Scripts**: `scripts/cloudflare/`

### Caddy Reverse Proxy

- **Config**: `Caddyfile`
- **Port**: `8088`
- **Routes**:
  - `/api/*` → `127.0.0.1:8080` (Backend)
  - `/admin/*` → `127.0.0.1:3000` (Admin Frontend)
  - `/employee/*` → `127.0.0.1:3001` (Employee Frontend)

---

## 🛠️ Development

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development guide.

---

## 📝 Notes

- Cloudflare credentials (`config/cloudflare/credentials.json`) are gitignored
- Logs are stored in `logs/` directory
- Use Named Tunnel for production (static domain)
- Use Quick Tunnel only for testing (temporary URL)
