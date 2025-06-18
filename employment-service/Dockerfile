FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# TypeScriptをコンパイル
RUN npm run build
# 本番環境ではdevDependenciesを除外
RUN npm prune --omit=dev

EXPOSE 3004

CMD [ "node", "dist/main.js" ]
