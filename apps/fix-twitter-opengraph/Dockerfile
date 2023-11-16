FROM oven/bun

WORKDIR /usr/src/app/apps/fix-twitter-opengraph

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]