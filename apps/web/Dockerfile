FROM node:22-alpine

WORKDIR /app

COPY package.json bun.lock ./

RUN npm install -g bun && bun install --frozen-lockfile

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=900" bun run build

RUN mkdir -p build/server/src/app && cp -r src/app/api build/server/src/app/api

EXPOSE 3000

CMD ["bun", "run", "start"]
