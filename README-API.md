# API CORS Notes

CORS is enabled for `/api/**` via SecurityConfig (WebFlux). Temporarily, you can allow wildcard by adding `*` to `app.allowed-origins` in `application.yml`. For production, replace with explicit public origins (e.g., your TryCloudflare or domain URLs).

Example:
```yaml
app:
  allowed-origins: "https://example.trycloudflare.com,https://admin.yourdomain.com,https://emp.yourdomain.com"
```

Restart the backend after changing CORS settings.
