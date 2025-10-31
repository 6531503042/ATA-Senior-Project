#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."

# Backend (Spring Boot)
(
  cd "${ROOT_DIR}/Backend/main"
  ./gradlew bootRun
) &

# Admin
(
  cd "${ROOT_DIR}/frontend/admin"
  bun install
  bun run build
  bun run start -p 3000
) &

# Employee
(
  cd "${ROOT_DIR}/frontend/employee"
  bun install
  bun run build
  bun run start -p 3001
) &

cat <<EOF
Health checks:
API     : http://localhost:8080/actuator/health
Admin   : http://localhost:3000/admin
Employee: http://localhost:3001/employee
EOF

wait
