# 📦 Cloudflare Worker Telegram Contact API

This project is a simple Cloudflare Worker that accepts `name`, `email`, and `message` fields from a contact form and sends them to your Telegram chat using a Bot Token.

---

## ✨ Features

* Accepts POST requests from a website form
* Validates data using [zod](https://github.com/colinhacks/zod)
* Sends messages directly to Telegram
* Supports CORS for browser use
* Handles preflight (OPTIONS) requests

---

## ⚙️ Setup & Installation

1. Initialize the project with [Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/):

```bash
npm install -g wrangler
wrangler init my-telegram-worker
cd my-telegram-worker
```

2. Install zod:

```bash
npm install zod
```

3. Replace the contents of `src/index.js` (or `src/worker.js`) with your Worker code.

4. Add environment variables in `wrangler.jsonc`:

```jsonc
{
  "name": "my-telegram-worker",
  "type": "javascript",
  "vars": {
    "TELEGRAM_BOT_TOKEN": "YOUR_BOT_TOKEN",
    "TELEGRAM_CHAT_ID": "YOUR_CHAT_ID"
  }
}
```

Alternatively, use secrets for better security:

```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
```

5. Deploy your Worker:

```bash
wrangler deploy
```

---

## 🧪 Testing the API

You can test it using Postman or axios:

```js
await axios.post("https://your-worker-url.workers.dev", {
  name: "Ali",
  email: "ali@example.com",
  message: "Hello from my portfolio!"
});
```

---

## 🔒 Security Notes

* Replace `*` in `Access-Control-Allow-Origin` with your actual domain for production.
* Never commit your Bot Token directly into source code. Use environment variables or secrets.

---

## ✍️ Suggested Improvements

* Add rate limiting to prevent spam
* Store messages in a database for logging
* Send an email notification to the site owner alongside Telegram

---

## 📄 License

MIT

---

> Built with ❤️ to easily send contact form messages to Telegram
