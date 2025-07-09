import { z } from "zod";

const RATE_LIMIT_WINDOW_SECONDS = 60 * 2; // 2 minutes
const MAX_REQUESTS_PER_WINDOW = 3;    // Max 3 messages per IP per minute

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        message: "Method not allowed"
      }), { status: 405, headers: corsHeaders });
    }

    try {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const now = Math.floor(Date.now() / 1000);
      const windowStart = Math.floor(now / RATE_LIMIT_WINDOW_SECONDS) * RATE_LIMIT_WINDOW_SECONDS;
      const windowKey = `rate:${ip}:${Math.floor(now / RATE_LIMIT_WINDOW_SECONDS)}`;
      const count = await env.RATE_LIMIT_KV.get(windowKey);

      if (count && parseInt(count) >= MAX_REQUESTS_PER_WINDOW) {
        const windowEnd = windowStart + RATE_LIMIT_WINDOW_SECONDS;
        const secondsRemaining = windowEnd - now;

        return new Response(JSON.stringify({
          message: "Rate limit exceeded. Please try again later.",
          timeout: secondsRemaining
        }), {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }

      await env.RATE_LIMIT_KV.put(windowKey, `${(parseInt(count || "0") + 1)}`, {
        expirationTtl: RATE_LIMIT_WINDOW_SECONDS
      });

      const data = await request.json();

      const schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters."),
        email: z.string().email("Invalid email format."),
        message: z.string().min(5, "Message must be at least 5 characters.")
      });

      const parsed = schema.safeParse(data);

      if (!parsed.success) {
        const errors = parsed.error.errors.map(e => `${e.path[0]}: ${e.message}`).join("; ");
        return new Response(JSON.stringify({
          message: `Validation failed: ${errors}`
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const { name, email, message } = parsed.data;

      const text = `📩 New Message:\n\n👤 Name: ${name}\n✉️ Email: ${email}\n📝 Message:\n ${message}`;

      const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

      const telegramRes = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text
        })
      });

      const telegramData = await telegramRes.json();

      if (!telegramRes.ok) {
        return new Response(JSON.stringify({
          message: `Telegram API error: ${telegramData.description}`
        }), {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({
        message: "Message sent successfully!"
      }), {
        status: 200,
        headers: corsHeaders
      });
    } catch (err) {
      return new Response(JSON.stringify({
        message: `Server error: ${err.message}`
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
