# Run Admin (Next.js) with bun

```bash
# from repo root
cd frontend/admin
bun install
bun run build
bun run start -p 3000
# or dev
bun run dev -p 3000
```

Base path: `/admin`
If behind Caddy at :8088, the app is available at `http://localhost:8088/admin`.
