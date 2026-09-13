FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

FROM base AS development
COPY package.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY nest-cli.json tsconfig.json ./
COPY src ./src
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

FROM base AS build
COPY package.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY nest-cli.json tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
