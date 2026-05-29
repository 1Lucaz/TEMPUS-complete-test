# =============================================================================
# Stage 1 — Build do Frontend (React + Vite)
# =============================================================================
FROM node:20-slim AS frontend-builder

WORKDIR /build

# Contexto = raiz do projeto → paths começam com src/front-end/
COPY src/front-end/package.json src/front-end/package-lock.json ./

RUN npm ci

COPY src/front-end/ .

# Em produção o frontend usa rotas relativas (/api/...) via nginx
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
# Resultado em /build/dist


# =============================================================================
# Stage 2 — Dependências Python (Poetry)
# =============================================================================
FROM python:3.13 AS backend-builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_VERSION=1.8.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

COPY src/back-end/pyproject.toml src/back-end/poetry.lock ./

RUN poetry install


# =============================================================================
# Stage 3 — Runtime (nginx + uvicorn via supervisord)
# =============================================================================
FROM python:3.13 AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /var/log/supervisor

# ── Python packages ──────────────────────────────────────────────────────────
COPY --from=backend-builder \
    /usr/local/lib/python3.12/site-packages \
    /usr/local/lib/python3.12/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# ── Código do backend ─────────────────────────────────────────────────────────
COPY src/back-end/ ./back-end/

# ── Frontend buildado → nginx ─────────────────────────────────────────────────
COPY --from=frontend-builder /build/dist /usr/share/nginx/html

# ── Configs (todos em src/) ───────────────────────────────────────────────────
COPY src/nginx.conf       /etc/nginx/nginx.conf
COPY src/supervisord.conf /etc/supervisor/conf.d/app.conf
COPY src/entrypoint.sh    /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost/api/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]