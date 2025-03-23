#!/bin/bash
set -e

# Create certs directory if it doesn't exist
mkdir -p ./certs

# Generate a private key
openssl genrsa -out ./certs/localhost.key 2048

# Create a configuration file for the certificate
cat > ./certs/openssl.conf << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=US
ST=State
L=City
O=Organization
OU=OrganizationalUnit
CN=localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
DNS.3 = api.localhost
DNS.4 = traefik.localhost
EOF

# Generate the certificate
openssl req -new -x509 -key ./certs/localhost.key -out ./certs/localhost.crt -days 3650 -config ./certs/openssl.conf

# Output success message
echo "Self-signed certificate generated successfully!"
echo "Certificate: ./certs/localhost.crt"
echo "Private key: ./certs/localhost.key"
echo ""
echo "You may need to add these certificates to your system's trusted certificates"
echo "Add the following to your /etc/hosts file:"
echo "127.0.0.1 localhost api.localhost traefik.localhost"

# Make the certificate files readable by Traefik
chmod 644 ./certs/localhost.crt
chmod 600 ./certs/localhost.key 