# Clear Command Docs - Laravel Documentation Platform

> Interactive React + TypeScript documentation for Laravel, Filament & Livewire commands with enterprise-ready Docker & Kubernetes deployment

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node](https://img.shields.io/badge/Node-24-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

## 🚀 Quick Start

```bash
# Development (30 seconds)
docker-compose up -d
open http://localhost:8080
```

## 📖 Documentation

👉 **[README_DEPLOYMENT.md](README_DEPLOYMENT.md)** - Start here for deployment & Docker instructions

👉 **[docs/](docs/)** - Complete documentation folder:
- `docs/DEPLOYMENT_PLAN.md` - Full deployment strategy
- `docs/DOCKER_DEPLOYMENT_GUIDE.md` - Docker & compose guide  
- `docs/GITHUB_ACTIONS_SETUP.md` - CI/CD configuration
- `docs/ENTERPRISE_DEPLOYMENT_SUMMARY.md` - Executive summary

👉 **[kubernetes/](kubernetes/)** - Kubernetes manifests and guide

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + TypeScript 5.8 + Vite + Tailwind CSS
- **Deployment**: Docker + Kubernetes + Nginx
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Runtime**: Node.js 24 (slim)

## 📦 Project Structure

```
.
├── src/                      ← React application code
├── Dockerfile               ← Production build
├── Dockerfile.dev           ← Development build
├── docker-compose.yml       ← Dev environment
├── docker-compose.prod.yml  ← Production setup
├── .dockerignore            ← Docker exclusions
├── docker/
│   ├── nginx/
│   │   └── nginx.conf       ← Nginx configuration
│   └── ssl/                 ← SSL certificates (optional)
├── config/
│   ├── prometheus.yml       ← Monitoring config
│   └── .env.example         ← Environment variables
├── docs/                    ← Deployment documentation
├── kubernetes/              ← K8s manifests
├── scripts/                 ← Utility scripts
└── .github/workflows/       ← CI/CD pipelines
```

## 🎯 Getting Started

### For Development
```bash
docker-compose up -d
# App running at http://localhost:8080
```

### For Production
See [README_DEPLOYMENT.md](README_DEPLOYMENT.md) for complete instructions

### For Kubernetes
See [kubernetes/README.md](kubernetes/README.md)

## 📚 Documentation

| Topic | Location |
|-------|----------|
| Deployment Overview | [README_DEPLOYMENT.md](README_DEPLOYMENT.md) |
| Docker & Compose | [docs/DOCKER_DEPLOYMENT_GUIDE.md](docs/DOCKER_DEPLOYMENT_GUIDE.md) |
| CI/CD Setup | [docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md) |
| Kubernetes | [kubernetes/README.md](kubernetes/README.md) |
| Full Plan | [docs/DEPLOYMENT_PLAN.md](docs/DEPLOYMENT_PLAN.md) |
| File Index | [docs/FILES_INDEX.md](docs/FILES_INDEX.md) |

## ✨ Features

- ✅ Interactive command documentation
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Docker containerization
- ✅ Kubernetes ready
- ✅ CI/CD automation
- ✅ Prometheus monitoring
- ✅ Enterprise-grade security

## 🔄 Development Workflow

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Development
docker-compose up -d      # Start dev
docker-compose down       # Stop dev

# Production
docker-compose -f docker-compose.prod.yml up -d      # Start prod
docker-compose -f docker-compose.prod.yml ps          # Check status
docker-compose -f docker-compose.prod.yml logs -f     # View logs
```

## 🔄 CI/CD

Push to trigger GitHub Actions:
- `develop` → Auto-deploy to dev
- `v*.*.* tag` → Build & push to registry
- Manual trigger → Deploy to staging/production

See [docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md) for full setup

## 📊 Monitoring

- **Prometheus**: http://localhost:9090 (production)
- **Grafana**: Configure manually or through Prometheus
- **Health Check**: `curl http://localhost:8080/health`

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8080 in use | `docker-compose down` or change port |
| Build fails | `docker system prune -a` |
| Hot reload not working | Check volume mounts in docker-compose.yml |

See [docs/DOCKER_DEPLOYMENT_GUIDE.md](docs/DOCKER_DEPLOYMENT_GUIDE.md) for more troubleshooting

## 📝 Environment Variables

Create `.env` from `.env.example`:
```bash
cp config/.env.example .env
```

See [config/.env.example](config/.env.example) for all variables

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Push and create a pull request
4. CI/CD will automatically test and deploy to dev

## 📄 License

Proprietary - Clear Command Docs

---

## 🎯 Next Steps

1. **[Read deployment guide](README_DEPLOYMENT.md)** (5 min)
2. **Start developing** (`docker-compose up -d`)
3. **Configure CI/CD** (See [docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md))
4. **Deploy to production** (See [docs/DEPLOYMENT_PLAN.md](docs/DEPLOYMENT_PLAN.md))

**Status**: ✅ Production Ready  
**Last Updated**: 2026-02-26
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
