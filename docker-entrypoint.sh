#!/bin/sh
set -e

CERT_DIR=/etc/nginx/certs
CERT_FILE="$CERT_DIR/cert.pem"
KEY_FILE="$CERT_DIR/key.pem"

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
	echo "Generating self-signed TLS certificate for HTTPS on :4343..."
	openssl req -x509 -nodes -newkey rsa:2048 \
		-keyout "$KEY_FILE" \
		-out "$CERT_FILE" \
		-days 365 \
		-subj "/CN=localhost"
	chmod 600 "$KEY_FILE"
	chmod 644 "$CERT_FILE"
else
	echo "Using existing TLS certificate in $CERT_DIR"
fi

exec nginx -g 'daemon off;'
