# Run Employee (Next.js) with bun

```bash
# from repo root
cd frontend/employee
bun install
bun run build
bun run start -p 3001
# or dev
bun run dev -p 3001
```

Base path: `/employee`
If behind Caddy at :8088, the app is available at `http://localhost:8088/employee`.
