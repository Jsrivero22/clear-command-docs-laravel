# Kubernetes Deployment Guide

## 📋 Tabla de Contenidos

1. [Prerequisites](#prerequisites)
2. [Instalación](#instalación)
3. [Despliegue](#despliegue)
4. [Monitoreo](#monitoreo)
5. [Scaling](#scaling)

---

## Prerequisites

### Requisitos

- Kubernetes 1.24+
- kubectl configurado
- Helm 3.0+ (opcional)
- Cert-Manager (para SSL automático)

### Verificar Configuración

```bash
# Verificar conexión a cluster
kubectl cluster-info

# Ver nodos disponibles
kubectl get nodes

# Ver namespaces
kubectl get ns
```

---

## Instalación

### 1. Instalar Cert-Manager (para SSL)

```bash
# Add Helm repository
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.crds.yaml

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.0
```

### 2. Instalar Nginx Ingress Controller

```bash
# Agregar Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install nginx-ingress
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --values - <<EOF
controller:
  service:
    type: LoadBalancer
  resources:
    limits:
      cpu: 200m
      memory: 256Mi
EOF
```

### 3. Instalar Prometheus & Grafana

```bash
# Agregar Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values - <<EOF
prometheus:
  prometheusSpec:
    retention: 10d
    storageSpec:
      volumeClaimTemplate:
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 50Gi

grafana:
  adminPassword: "admin"
  persistence:
    enabled: true
    size: 10Gi
EOF
```

---

## Despliegue

### 1. Crear Namespace (Opcional)

```bash
kubectl create namespace clear-command
```

### 2. Crear Docker Registry Secret

```bash
# Si usas private registry
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token> \
  --docker-email=<email>

# Agregar al deployment (ya está en el manifesto)
```

### 3. Desplegar Aplicación

```bash
# Aplicar manifiestos
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml

# Verificar despliegue
kubectl get pods
kubectl get svc
kubectl get ing
```

### 4. Configurar DNS

```bash
# Obtener IP del Ingress
kubectl get ingress clear-command-docs

# Configurar DNS que apunte a esa IP
# En tu proveedor DNS:
# clear-command-docs.example.com -> <INGRESS_IP>
```

### 5. Verificar SSL Certificate

```bash
# Ver certificados
kubectl get certificate

# Ver detalles del certificado
kubectl describe certificate clear-command-docs-cert

# Ver secret del certificado
kubectl get secret clear-command-docs-tls -o yaml
```

---

## Monitoreo

### 1. Desplegar Prometheus Rules

```bash
# Install Prometheus Operator (si no está instalado con kube-prometheus-stack)
kubectl apply -f kubernetes/monitoring.yaml
```

### 2. Acceder a Prometheus

```bash
# Port-forward
kubectl port-forward svc/kube-prometheus-stack-prometheus 9090:9090 -n monitoring

# Acceder a http://localhost:9090
```

### 3. Acceder a Grafana

```bash
# Port-forward
kubectl port-forward svc/kube-prometheus-stack-grafana 3000:80 -n monitoring

# Acceder a http://localhost:3000
# Username: admin
# Password: [la que configuraste durante la instalación]
```

### 4. Ver Logs

```bash
# Logs de un pod
kubectl logs deployment/clear-command-docs

# Logs en tiempo real
kubectl logs -f deployment/clear-command-docs

# Logs de múltiples pods
kubectl logs -l app=clear-command-docs
```

---

## Scaling

### Manual Scaling

```bash
# Escalar a 5 replicas
kubectl scale deployment clear-command-docs --replicas=5

# Ver auto-scaling status
kubectl get hpa
```

### Verificar HPA

```bash
# Ver estado del HPA
kubectl describe hpa clear-command-docs-hpa

# Ver métricas en tiempo real
kubectl get hpa -w
```

---

## Actualizaciones

### Rolling Update

```bash
# Actualizar imagen
kubectl set image deployment/clear-command-docs \
  app=ghcr.io/your-org/clear-command-docs:v2.0.0

# Ver progreso del rollout
kubectl rollout status deployment/clear-command-docs

# Ver historial de deployments
kubectl rollout history deployment/clear-command-docs
```

### Rollback

```bash
# Revertir a versión anterior
kubectl rollout undo deployment/clear-command-docs

# Revertir a una revisión específica
kubectl rollout undo deployment/clear-command-docs --to-revision=2
```

---

## Troubleshooting

### Pod no inicia

```bash
# Ver descripción del pod
kubectl describe pod <pod-name>

# Ver logs del pod
kubectl logs <pod-name>

# Ver eventos
kubectl get events --sort-by='.lastTimestamp'
```

### Ingress no funciona

```bash
# Verificar ingress
kubectl describe ingress clear-command-docs

# Ver service
kubectl get svc clear-command-docs

# Test conectividad
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://clear-command-docs
```

### Certificate no se genera

```bash
# Ver certificado
kubectl describe certificate clear-command-docs-cert

# Ver cert-manager logs
kubectl logs -n cert-manager deployment/cert-manager

# Ver cert-manager webhook
kubectl logs -n cert-manager deployment/cert-manager-webhook
```

---

## Backup & Disaster Recovery

### Backup de ConfigMaps y Secrets

```bash
# Backup de todos los recursos
kubectl get all -o yaml > backup-all.yaml

# Backup específico
kubectl get deployment clear-command-docs -o yaml > deployment-backup.yaml
kubectl get configmap clear-command-config -o yaml > config-backup.yaml
```

### Restaurar desde Backup

```bash
# Restaurar todos los recursos
kubectl apply -f backup-all.yaml

# Restaurar recurso específico
kubectl apply -f deployment-backup.yaml
```

---

## Seguridad

### Network Policies

```bash
# Ya incluido en ingress.yaml
# Verifica que esté aplicado:
kubectl get networkpolicy
```

### Pod Security Policies

```bash
# Verificar PSP (si está habilitado en tu cluster)
kubectl get psp

# Ver detalles
kubectl describe psp clear-command-docs
```

### RBAC

```bash
# Ver service account
kubectl describe sa clear-command-docs

# Ver role bindings
kubectl get rolebindings
```

---

## Performance Optimization

### Resource Limits

```bash
# Ya configurados en deployment.yaml
# Verificar:
kubectl describe deployment clear-command-docs | grep -A 10 "Limits\|Requests"
```

### Pod Disruption Budget

```bash
# Ver PDB
kubectl get pdb

# Verificar que no hay más disruptiones que el permitido
kubectl describe pdb clear-command-docs-pdb
```

---

## GitOps (Opcional con ArgoCD)

### Instalar ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Crear Application

```bash
cat <<EOF | kubectl apply -f -
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: clear-command-docs
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/clear-command-docs-laravel
    targetRevision: HEAD
    path: kubernetes
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF
```

---

## Helm Chart (Opcional)

Como alternativa a YAML puro, puedes usar Helm:

```bash
# Crear chart
helm create charts/clear-command-docs

# Install
helm install clear-command-docs ./charts/clear-command-docs \
  --namespace default \
  --values charts/clear-command-docs/values.yaml

# Upgrade
helm upgrade clear-command-docs ./charts/clear-command-docs \
  --namespace default \
  --values charts/clear-command-docs/values.yaml
```

---

**Última actualización**: 2026-02-26
