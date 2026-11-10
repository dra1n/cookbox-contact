# cookbox-contact

Cloudflare Worker that forwards messages from the cookbox.rocks contact form
to Telegram via https://telegram.me/cookbox_contact_bot.

`POST /message` with `{"email": "...", "text": "..."}`.

## Deploy

```sh
npm install
npx wrangler login
npx wrangler secret put TOKEN        # Telegram bot token
npx wrangler secret put RECIPIENTS   # comma-separated chat ids
npm run deploy
```

## Local development

Put the secrets in `.dev.vars`:

```
TOKEN=...
RECIPIENTS=...
```

and run `npm run dev`.
