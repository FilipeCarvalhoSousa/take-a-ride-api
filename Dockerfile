
# 1. Estágio de Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Instala as dependências para build
COPY package*.json ./
RUN npm ci

# Copia o projeto e compila o NestJS
COPY . .
RUN npm run build


# 2. Estágio de Execução
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Instala as dependências de produção.
# drizzle-kit deve estar em "dependencies" no package.json.
COPY package*.json ./
RUN npm ci --omit=dev

# Aplicação NestJS compilada
COPY --from=builder /usr/src/app/dist ./dist

# Configuração e arquivos de migração do Drizzle
COPY --from=builder /usr/src/app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /usr/src/app/src/database/migrations ./src/database/migrations

# Porta da API
EXPOSE 3000

# Inicia a aplicação NestJS
CMD ["node", "dist/main.js"]
