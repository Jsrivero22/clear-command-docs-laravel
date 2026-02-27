# Docker & Deployment Guide

## 📋 Tabla de Contenidos

1. [Quick Start](#quick-start)
2. [Desarrollo Local](#desarrollo-local)
3. [Despliegue en Producción](#despliegue-en-producción)
4. [Monitoreo](#monitoreo)
5. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Requisitos Previos

- Docker 24.0+
- Docker Compose 2.20+
- Git

### Iniciar Desarrollo

```bash
# Clone el repositorio
git clone <repository-url>
cd clear-command-docs-laravel

# Iniciar ambiente de desarrollo
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Acceder a la aplicación
open http://localhost:8080
```

### Detener Ambiente

```bash
docker-compose down
```

---

## Desarrollo Local

### Estructura de la Aplicación

```
clear-command-docs-laravel/
├── Dockerfile                 # Multi-stage build (producción)
├── Dockerfile.dev             # Desarrollo con hot reload
├── docker-compose.yml         # Dev environment
├── docker-compose.prod.yml    # Prod environment
├── nginx.conf                 # Nginx configuration
└── src/
    ├── components/            # React components
    ├── pages/                 # Page components
    └── data/                  # Static data
```

### Volume Mounts en Desarrollo

El `docker-compose.yml` monta tu código fuente:

```yaml
volumes:
  - .:/app              # Monta todo el proyecto
  - /app/node_modules   # Excepto node_modules
```

Esto permite:
- ✅ Hot reload automático
- ✅ Cambios instantáneos
- ✅ Debug directo

### Comandos Útiles

```bash
# Rebuild la imagen (después de cambiar package.json)
docker-compose up --build

# Ejecutar tests
docker-compose exec app npm run test

# Ejecutar linting
docker-compose exec app npm run lint

# Entrar a la terminal del contenedor
docker-compose exec app sh

# Ver logs en tiempo real
docker-compose logs -f

# Ver estado de servicios
docker-compose ps

# Ver uso de recursos
docker stats
```

---

## Despliegue en Producción

### 1. Preparar Servidor

```bash
# En el servidor destino
mkdir -p /opt/apps/clear-command-docs
cd /opt/apps/clear-command-docs

# Clone el repo
git clone <repository-url> .

# Copiar archivos de configuración
cp .env.example .env
# Editar .env con valores de producción
```

### 2. Configurar SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Generar certificado
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com

# Los certificados estarán en:
# /etc/letsencrypt/live/your-domain.com/

# Copiar a docker volume
mkdir -p ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

### 3. Uncomment HTTPS en nginx.conf

```bash
# Editar nginx.conf y descomentar la sección HTTPS
vi nginx.conf
```

### 4. Variables de Entorno

```bash
# Crear .env con valores de producción
cat > .env << EOF
NODE_ENV=production
VITE_API_URL=https://api.your-domain.com
EOF
```

### 5. Deploy

```bash
# Build de imágenes
docker-compose -f docker-compose.prod.yml build

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Verificar estado
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f app

# Health check
curl https://your-domain.com/health
```

### 6. Configurar Auto-reload de Certificados

```bash
# Crear script para renovar certificados
cat > renew-certs.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /path/to/docker/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /path/to/docker/ssl/key.pem
chown $USER:$USER /path/to/docker/ssl/*
docker-compose -f docker-compose.prod.yml exec -T nginx nginx -s reload
EOF

chmod +x renew-certs.sh

# Agregar a crontab
crontab -e
# Agregar línea:
# 0 3 * * * /opt/apps/clear-command-docs/renew-certs.sh >> /var/log/cert-renewal.log 2>&1
```

---

## Escalabilidad

### Horizontal Scaling

Para servir más usuarios, aumenta el número de réplicas:

```bash
# Editar docker-compose.prod.yml
# Cambiar:
# deploy:
#   replicas: 3

docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Load Balancing

Nginx distribuye automáticamente entre réplicas:

```nginx
upstream app_backend {
  least_conn;
  server app:8080;  # Replica 1
  server app:8081;  # Replica 2
  server app:8082;  # Replica 3
}
```

### Auto-scaling with Kubernetes

Si usas Kubernetes:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: clear-command-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: clear-command-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## Monitoreo

### Prometheus

Prometheus se ejecuta en http://localhost:9090

**Métricas disponibles:**
- `up` - State de los servicios
- `node_*` - System metrics
- `process_*` - Process metrics

**Consultas útiles:**

```promql
# CPU usage
rate(process_cpu_seconds_total[5m])

# Memory usage
process_resident_memory_bytes / 1024 / 1024

# Request latency
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])
```

### Grafana (Opcional)

```bash
# Agregar a docker-compose.prod.yml
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
```

### Logs

```bash
# Centralizar logs en JSON
docker-compose -f docker-compose.prod.yml logs --follow --tail 100

# Exportar logs
docker-compose -f docker-compose.prod.yml logs app > logs.txt

# Para logging centralizado (ELK Stack):
# Usar filebeat o fluentd para enviar logs a Elasticsearch
```

---

## Backup & Recovery

### Backup

```bash
# Backup de datos importantes
docker-compose -f docker-compose.prod.yml exec app tar czf backup.tar.gz \
  /app/dist \
  /app/node_modules

# Docker volumes backup
docker run --rm \
  -v clear-command_nginx_cache:/source \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/nginx-cache.tar.gz -C /source .
```

### Recovery

```bash
# Restaurar desde backup
docker-compose -f docker-compose.prod.yml exec app tar xzf backup.tar.gz

# Restore volumes
docker run --rm \
  -v clear-command_nginx_cache:/target \
  -v $(pwd)/backups:/source \
  alpine tar xzf /source/nginx-cache.tar.gz -C /target
```

---

## Troubleshooting

### Problema: Container no inicia

```bash
# Ver logs de error
docker-compose logs app

# Check health
docker-compose ps

# Reintentar con verbose
docker-compose up -d --verbose
```

### Problema: Port en uso

```bash
# Encontrar qué usa el puerto
lsof -i :8080
sudo fuser -k 8080/tcp

# O cambiar el puerto en docker-compose.yml
```

### Problema: Out of memory

```bash
# Limitar memoria del contenedor
# En docker-compose.prod.yml:
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

### Problema: Certificado SSL expirado

```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Copiar nuevos certificados
sudo cp /etc/letsencrypt/live/your-domain/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain/privkey.pem ssl/key.pem

# Recargar Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### Problema: Health check fallando

```bash
# Test manual
curl -v http://localhost:8080/health

# Check application logs
docker-compose logs app

# Aumentar timeouts si es lento
# En docker-compose.yml, cambiar healthcheck
```

---

## Performance Optimization

### Caching

```bash
# Browser caching (30 días para assets)
# Ya configurado en nginx.conf:
expires 30d;
add_header Cache-Control "public, immutable";
```

### Compression

```bash
# Gzip habilitado en Nginx
# Todos los assets se comprimen automáticamente
```

### CDN

Para producción, usar CDN (Cloudflare, AWS CloudFront):

```nginx
# Agregar headers para CDN
add_header Cache-Control "max-age=31536000, immutable";
```

---

## Seguridad

### Docker Security

```bash
# Escanear imagen por vulnerabilidades
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image ghcr.io/your-org/clear-command-docs:latest

# No usar root en contenedores
# Ya configurado: USER nodeuser
```

### Network Security

```bash
# Aislar servicios en red privada
networks:
  clear-command-network:
    driver: bridge
```

---

## Continuous Deployment

El pipeline CI/CD maneja automáticamente:

1. **Push a develop** → Deploy a Staging
2. **Tag v*.*.*** → Build image
3. **Manual trigger** → Deploy a Production

Ver `GITHUB_ACTIONS_SETUP.md` para configuración.

---

**Última actualización**: 2026-02-26
