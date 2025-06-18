FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate --schema ./prisma/schema.prisma

COPY . .

# TypeScriptをコンパイル
RUN npm run build
# 本番環境ではdevDependenciesを除外
RUN npm prune --omit=dev

EXPOSE 3001

CMD [ "node", "dist/app.js" ]
