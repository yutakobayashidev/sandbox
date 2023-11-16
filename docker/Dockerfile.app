FROM oven/bun

# render の ディレクトリ
WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
# apps / packages などがないと bun workspace でコケる
COPY . .
RUN bun install
COPY . .

# テストなので、一旦設定。render に設定し、 .env をコピるなどすればOK
ENV NODE_ENV production

# monorepo の app をホスティングするための切り替え
WORKDIR /usr/src/app/apps/fix-twitter-opengraph
CMD [ "bun", "run", "dev" ]