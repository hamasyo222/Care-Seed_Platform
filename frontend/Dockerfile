# Dockerfile

# --- Build Stage ---
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# NginxがReact Routerを正しく扱えるように設定
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
