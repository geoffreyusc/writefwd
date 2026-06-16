// Server-side proxy to Buttondown.
//
// Keeps the Buttondown API token OUT of the browser and the repo. The client
// POSTs { email, variant } to /.netlify/functions/waitlist; this function adds
// the token (from an env var) and forwards the subscriber to Buttondown.
//
// Required env var (set in Netlify -> Site settings -> Environment variables):
//   BUTTONDOWN_API_TOKEN
//
// Runtime: Node 18+ (global fetch). This is Netlify's default.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  var token = process.env.BUTTONDOWN_API_TOKEN;
  if (!token) {
    return json(500, { error: 'Server not configured' });
  }

  var email, variant;
  try {
    var data = JSON.parse(event.body || '{}');
    email = (data.email || '').trim();
    variant = data.variant || 'unknown';
  } catch (e) {
    return json(400, { error: 'Invalid request body' });
  }

  if (!email || email.indexOf('@') === -1) {
    return json(400, { error: 'Invalid email' });
  }

  try {
    var res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        tags: ['waitlist'],
        metadata: { variant: variant }
      })
    });

    if (res.ok) {
      return json(200, { ok: true });
    }

    // Treat an already-subscribed address as success so returning visitors
    // don't see an error.
    var detail = await res.text();
    if (res.status === 400 && /already/i.test(detail)) {
      return json(200, { ok: true, alreadySubscribed: true });
    }

    return json(502, {
      error: 'Upstream error',
      status: res.status,
      detail: detail
    });
  } catch (err) {
    return json(502, { error: 'Request failed' });
  }
};

function json(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}
