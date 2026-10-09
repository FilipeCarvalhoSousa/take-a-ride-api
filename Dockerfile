# 1. Estágio de Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copia o código-fonte e constrói o projeto NestJS
COPY . .
RUN npm run build

# 2. Estágio de Execução (Production)
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copia apenas as dependências de produção e o build otimizado
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta 3000 do container
EXPOSE 3000

# Executa a aplicação
CMD ["node", "dist/main.js"]