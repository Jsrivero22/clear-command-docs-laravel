# Build stage
FROM node:24-slim AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json bun.lockb ./

# Instalar dependencias
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Production stage
FROM node:24-slim

WORKDIR /app

# Crear usuario no-root
RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser

# Instalar curl para health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos necesarios del builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Cambiar permisos
RUN chown -R nodeuser:nodeuser /app

# Usar usuario no-root
USER nodeuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Variables de entorno
ENV NODE_ENV=production
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:3000/api}

# Exponer puerto
EXPOSE 8080

# Comando para servir la app
CMD ["npm", "run", "preview"]
