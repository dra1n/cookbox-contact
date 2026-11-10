// Telegram caps a message at 4096 characters, leave room for the header
const MAX_TEXT_LENGTH = 3500;
const MAX_EMAIL_LENGTH = 254;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function respond(status, body) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function sendMessage(env, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${env.TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) {
    throw new Error(`Telegram responded with ${response.status}: ${await response.text()}`);
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname !== '/message') {
      return respond(404, { message: 'Not Found' });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return respond(405, { message: 'Method Not Allowed' });
    }

    let data;
    try {
      data = await request.json();
    } catch (_) {
      return respond(400, { message: 'Invalid JSON' });
    }

    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const text = typeof data.text === 'string' ? data.text.trim() : '';

    if (!email || !text || email.length > MAX_EMAIL_LENGTH || text.length > MAX_TEXT_LENGTH) {
      return respond(400, { message: 'Invalid message' });
    }

    const message = `Message from <${email}>:\n${text}`;
    const recipients = env.RECIPIENTS.split(',').map((r) => r.trim()).filter(Boolean);

    try {
      await Promise.all(recipients.map((chatId) => sendMessage(env, chatId, message)));
    } catch (err) {
      console.error(err);
      return respond(502, { message: 'Failed to deliver message' });
    }

    return respond(200);
  }
};
