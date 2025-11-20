# ATA Senior Project

## 🚀 Quick Start

### 1. Start Services

```powershell
# Start all services (backend + frontends)
.\scripts\start-all.ps1

# Start Caddy reverse proxy
.\caddy.exe run --config .\Caddyfile
```

### 2. Start Cloudflare Tunnel

#### Option A: Named Tunnel (Static Domain) ⭐ **Recommended**

```powershell
# First time setup (see docs/cloudflare/SETUP_NAMED_TUNNEL.md)
.\scripts\cloudflare\start-named-tunnel.ps1
```

#### Option B: Quick Tunnel (Temporary URL - Testing Only)

```powershell
.\scripts\cloudflare\start-quick-tunnel.ps1
```

### 3. Get Tunnel URL

```powershell
.\scripts\cloudflare\get-url.ps1
```

---

## 📁 Project Structure

```
ATA-Senior-Project/
├── Backend/              # Spring Boot backend
├── frontend/
│   ├── admin/           # Admin frontend (Next.js)
│   └── employee/        # Employee frontend (Next.js)
├── config/
│   └── cloudflare/     # Cloudflare tunnel configuration
├── scripts/
│   ├── cloudflare/     # Cloudflare tunnel scripts
│   └── commands/       # Build/dev scripts
├── docs/               # Documentation
│   └── cloudflare/     # Cloudflare documentation
└── logs/               # Log files
```

---

## 📚 Documentation

- **Cloudflare Tunnel Setup**: [docs/cloudflare/SETUP_NAMED_TUNNEL.md](docs/cloudflare/SETUP_NAMED_TUNNEL.md)
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
