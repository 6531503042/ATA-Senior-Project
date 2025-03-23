# HR Feedback System with Traefik

This setup uses Traefik as a reverse proxy to route all services through a single port, making it easy to expose your application via ngrok.

## Quick Start

1. Add to your `/etc/hosts` file:
```
127.0.0.1 localhost api.localhost traefik.localhost
```

2. Generate certificates and start the system:
```bash
chmod +x generate-certs.sh start-with-traefik.sh
./start-with-traefik.sh
```

## Accessing Services

- Frontend: https://localhost
- API Endpoints:
  - User Service: https://api.localhost/user
  - Feedback Service: https://api.localhost/feedback
  - Feedback Scoring Service: https://api.localhost/scoring
- Traefik Dashboard: https://traefik.localhost (admin/admin)

## Exposing with ngrok

```bash
ngrok http https://localhost
```

This provides a public URL that forwards to your local application. 