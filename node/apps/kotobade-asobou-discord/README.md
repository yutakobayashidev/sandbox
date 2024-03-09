# kotobade-asobou-discord

言葉で遊ぼう BOT

## Stack

- Hono.js
- Cloudflare Workers

## 環境構築

1. 環境変数の設定

`.env.vars`を作成して適切な値を割り当てます。

```bash
cp .env.vars.env .env.vars
```

2. コマンドの登録

Discord 上にコマンドを登録します。

```bash
pnpm run deploy:command
```

3. デプロイ

Cloudflare Workers にデプロイします。

```bash
pnpm run deploy
```
