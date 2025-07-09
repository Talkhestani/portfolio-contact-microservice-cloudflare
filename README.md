# 📦 Cloudflare Worker Telegram Contact API

This project is a simple Cloudflare Worker that accepts `name`, `email`, and `message` fields from a contact form and sends them to your Telegram chat using a Bot Token.

---

## ✨ Features

* Accepts POST requests from a website form
* Validates data using [zod](https://github.com/colinhacks/zod)
* Sends messages directly to Telegram
* Rate limits to prevent spamming
* Supports CORS for browser use
* Handles preflight (OPTIONS) requests

---

## ⚙️ Setup & Installation

1. Clone the project:

```bash
git clone https://github.com/Aking16/portfolio-contact-microservice-cloudflare.git
```

2. Install the packages:

```bash
npm install
```

3. Add environment variables in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "TELEGRAM_BOT_TOKEN": "YOUR_BOT_TOKEN",
    "TELEGRAM_CHAT_ID": "YOUR_CHAT_ID"
  },
}
```

Alternatively, use secrets for better security:

```bash
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHAT_ID
```

4. Add your KV storage in `wrangler.jsonc`:

```bash
wrangler kv namespace create "RATE_LIMIT_KV"
```

then place the given ID after creating the namespace in the wrangler config.

```jsonc
  "kv_namespaces": [
    {
      "binding": "RATE_LIMIT_KV",
      "id": "YOUR_KV_STORAGE_ID"
    }
  ]
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