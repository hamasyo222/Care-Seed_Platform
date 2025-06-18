FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# TypeScriptをコンパイル
RUN npm run build

EXPOSE 3004

CMD [ "node", "dist/main.js" ]
