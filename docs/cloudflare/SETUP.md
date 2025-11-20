# Cloudflare Tunnel (Permanent)

```bash
# Login and pick your domain
cloudflared login

# Create a tunnel
cloudflared tunnel create mfu-app
# Note the credentials file path printed; put it into config.yml

# Route DNS
cloudflared tunnel route dns mfu-app api.yourdomain.com
cloudflared tunnel route dns mfu-app admin.yourdomain.com
cloudflared tunnel route dns mfu-app emp.yourdomain.com

# Run (foreground)
cloudflared tunnel --config ./cloudflare-tunnel/config.yml run mfu-app

# Or install as a service (platform-specific)
```

Optional: Use Cloudflare Zero Trust Access to protect admin/employee hosts.
