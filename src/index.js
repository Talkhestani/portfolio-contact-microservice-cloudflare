import { z } from 'zod';


export default {
	async fetch(request, env, ctx) {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const data = await request.json();

			const schema = z.object({
				name: z.string().min(2, 'Name must be at least 2 characters.'),
				email: z.string().email('Invalid email format.'),
				message: z.string().min(5, 'Message must be at least 5 characters.'),
			});

			// ولیدیشن داده‌ها
			const parsed = schema.safeParse(data);

			if (!parsed.success) {
				const errors = parsed.error.errors.map((e) => `${e.path[0]}: ${e.message}`).join('; ');
				return new Response(`Validation failed: ${errors}`, { status: 400 });
			}

			const { name, email, message } = parsed.data;

			const text = `📩 New Message:\n\n👤 Name: ${name}\n✉️ Email: ${email}\n📝 Message: ${message}`;

			const telegramApiUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

			const telegramResponse = await fetch(telegramApiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: env.TELEGRAM_CHAT_ID,
					text: text,
				}),
			});

			const telegramData = await telegramResponse.json();

			if (!telegramResponse.ok) {
				return new Response(`Telegram API error: ${telegramData.description}`, { status: 500 });
			}

			return new Response('Message sent successfully!', { status: 200 });
		} catch (err) {
			return new Response(`Server error: ${err.message}`, { status: 500 });
		}
	},
};
