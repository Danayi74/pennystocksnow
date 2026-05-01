// Netlify Function: POST /.netlify/functions/subscribe
// Forwards a subscribe request to the beehiiv Subscriptions API using a
// server-side API key so the key is never exposed in the browser.
//
// Required environment variables (set these in Netlify → Site settings →
// Environment variables):
//   BEEHIIV_API_KEY    -- your beehiiv API key (secret)
//   BEEHIIV_PUB_ID     -- your beehiiv publication id, starts with "pub_"
//
// Optional:
//   ALLOWED_ORIGIN     -- CORS origin to allow (defaults to the site origin)

exports.handler = async (event) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://www.pennystocksnow.com';

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUB_ID;
  if (!apiKey || !pubId) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server not configured' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const email = (body.email || '').trim();
  // Simple email sanity check
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Valid email is required' }),
    };
  }

  // Optional UTM capture passed through from the client
  const utmSource = body.utm_source || 'pennystocksnow.com';
  const utmMedium = body.utm_medium || 'website';
  const utmCampaign = body.utm_campaign || 'weekly-alerts';
  const referringSite = body.referring_site || 'https://www.pennystocksnow.com';

  const url = `https://api.beehiiv.com/v2/publications/${encodeURIComponent(pubId)}/subscriptions`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        double_opt_override: 'off',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        referring_site: referringSite,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: data.error || data.message || 'beehiiv rejected the request' }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Upstream error contacting beehiiv' }),
    };
  }
};
