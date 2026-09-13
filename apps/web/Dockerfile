FROM node:22-alpine AS base
WORKDIR /app

FROM base AS development
COPY package.json ./
RUN npm install
COPY vite.config.ts tsconfig.json index.html ./
COPY src ./src
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS build
COPY package.json ./
RUN npm install
COPY vite.config.ts tsconfig.json index.html ./
COPY src ./src
RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
