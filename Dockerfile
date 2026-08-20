# ==== BUILD =====
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==== RUN =======
FROM nginx:1.27-alpine AS runner

RUN apk add --no-cache openssl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html/pokedexreact

VOLUME ["/etc/nginx/certs"]
EXPOSE 4343

ENTRYPOINT ["/docker-entrypoint.sh"]
