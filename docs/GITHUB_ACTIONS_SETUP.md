# GitHub Actions Configuration Guide

## 🔐 Required Secrets Setup

Para que los workflows de CI/CD funcionen correctamente, necesitas configurar los siguientes secrets en GitHub:

### Secrets para **Staging**

```
STAGING_HOST              - Dirección/IP del servidor staging
STAGING_PORT              - Puerto SSH (default: 22)
STAGING_USER              - Usuario SSH para staging
STAGING_SSH_KEY           - Private SSH key para acceso a staging
STAGING_APP_PATH          - Ruta de la aplicación en el servidor
STAGING_API_URL           - URL de la API para staging
```

### Secrets para **Production**

```
PROD_HOST                 - Dirección/IP del servidor producción
PROD_PORT                 - Puerto SSH (default: 22)
PROD_USER                 - Usuario SSH para producción  
PROD_SSH_KEY              - Private SSH key para acceso a producción
PROD_APP_PATH             - Ruta de la aplicación en el servidor
PROD_API_URL              - URL de la API para producción
```

### Secrets para **Notificaciones**

```
SLACK_WEBHOOK_URL         - Webhook URL de Slack para notificaciones
```

### Secrets para **Registry**

```
DOCKER_REGISTRY_USERNAME  - Usuario del Docker Registry
DOCKER_REGISTRY_PASSWORD  - Password del Docker Registry
```

---

## 📝 Cómo Configurar Secrets

### Opción 1: GitHub UI

1. Ve a tu repositorio
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Ingresa Name y Value
5. Click "Add secret"

### Opción 2: GitHub CLI

```bash
# Install GitHub CLI if not already installed
gh auth login

# Add a secret
gh secret set SECRET_NAME --body "secret_value"

# List all secrets
gh secret list

# Delete a secret
gh secret delete SECRET_NAME
```

### Opción 3: Terraform/IaC

```hcl
resource "github_actions_secret" "staging_host" {
  repository       = "clear-command-docs-laravel"
  secret_name      = "STAGING_HOST"
  plaintext_value  = "staging.example.com"
}
```

---

## 🔑 SSH Key Setup

### Generar SSH Keys para CI/CD

```bash
# Generar key sin passphrase
ssh-keygen -t rsa -b 4096 -f deploy_key -N ""

# La key pública va en .ssh/authorized_keys del servidor
cat deploy_key.pub | ssh user@server "mkdir -p .ssh && cat >> .ssh/authorized_keys"

# La key privada (deploy_key) va como secret en GitHub
cat deploy_key | gh secret set STAGING_SSH_KEY
```

---

## 🔌 Workflows Disponibles

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)

Se ejecuta automáticamente en:
- Push a `main` o `develop`
- Pull Requests a `main` o `develop`
- Manual trigger

Pasos:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Vitest)
- ✅ Security scanning
- ✅ Docker build

### 2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)

Se ejecuta en:
- Push de tags (v*.*.*)
- Manual trigger con environment selection

Opciones:
- 🎯 Deploy a Staging
- 🚀 Deploy a Production
- 🔄 Blue-Green deployment
- ⏮️ Rollback automático

### 3. **Security Scanning** (`.github/workflows/security.yml`)

Ejecución:
- Cada push a `main` o `develop`
- Diariamente a las 2 AM UTC
- Manual trigger

Checks:
- 🔍 Dependency vulnerabilities
- 🔎 SAST analysis
- 🏠 Container scanning
- 📜 License compliance

---

## 📊 Monitoreo de Workflows

### Ver status de workflows

```bash
# List workflow runs
gh run list

# View specific workflow run
gh run view <run-id>

# Follow workflow in real-time
gh run watch <run-id>

# View logs
gh run view <run-id> --log
```

### Notifications

Los workflows pueden notificar a:
- ✉️ Email (GitHub default)
- 💬 Slack (si configuramos webhook)
- 📱 Pagerduty (escalation automática)

---

## 🚨 Troubleshooting

### Workflow no se ejecuta

```bash
# Verificar que el archivo está en la rama correcta
git log .github/workflows/ci.yml

# Verificar sintaxis YAML
yamllint .github/workflows/

# Reactivar workflow si fue deshabilitado
gh workflow enable <workflow-name>
```

### SSH Connection Failed

```bash
# Verificar SSH key
ssh-keyscan -H ${{ secrets.STAGING_HOST }} >> ~/.ssh/known_hosts

# Test connection
ssh -i deploy_key user@staging.host "echo 'Connection successful'"
```

### Docker push failed

```bash
# Login to registry
echo ${{ secrets.DOCKER_REGISTRY_PASSWORD }} | docker login -u ${{ secrets.DOCKER_REGISTRY_USERNAME }} --password-stdin

# Test image push
docker tag test-image:latest registry/test:latest
docker push registry/test:latest
```

---

## 🔐 Best Practices

1. **Never commit secrets**
   ```bash
   echo ".env" >> .gitignore
   ```

2. **Use short-lived credentials**
   - Rotate SSH keys periodically
   - Use OIDC tokens when possible

3. **Audit secret access**
   ```bash
   # Check what has access to secrets
   gh secret list
   ```

4. **Limit secret scope**
   - Use environment secrets for prod/staging
   - Different credentials per environment

5. **Encrypt sensitive data**
   ```bash
   # GitHub automatically encrypts secrets
   # Use GitHub's secret masking in logs
   ```

---

## 📚 Documentación Adicional

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Reference](https://cli.github.com/manual)
- [OWASP CI/CD Security](https://owasp.org/www-project-ci-cd-security/)

---

**Última actualización**: 2026-02-26
