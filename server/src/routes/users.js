const express = require('express');
const router = express.Router();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

/**
 * Helper: make a fetch to Supabase PostgREST with the correct auth.
 * We prefer service_role key for server-side operations to bypass RLS.
 */
async function supabaseFetch(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const authKey = SERVICE_ROLE || SUPABASE_ANON_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': authKey,
    ...(SERVICE_ROLE ? { 'Authorization': `Bearer ${SERVICE_ROLE}` } : {}),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, ok: response.ok, body };
}

/**
 * GET /api/users/me?userId=<id>
 * Get the full profile for the authenticated user.
 */
router.get('/me', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId query param is required' });

  try {
    const result = await supabaseFetch(`users?id=eq.${userId}&select=*`, { method: 'GET' });
    if (!result.ok) return res.status(result.status).json({ error: result.body });
    const profile = Array.isArray(result.body) ? result.body[0] : result.body;
    if (!profile) return res.status(404).json({ error: 'User not found' });
    return res.json(profile);
  } catch (err) {
    console.error('GET /users/me error', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

/**
 * PUT /api/users/profile
 * Update the user's profile fields.
 * Body: { userId, full_name?, phone?, location?, bio?, github_url?, portfolio_url?, linkedin_url?, skills?, avatar_initials?, avatar_color? }
 */
router.put('/profile', async (req, res) => {
  const { userId, ...updates } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  // Only allow specific fields to be updated
  const allowedFields = [
    'full_name', 'phone', 'location', 'bio',
    'github_url', 'portfolio_url', 'linkedin_url',
    'skills', 'avatar_initials', 'avatar_color'
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const result = await supabaseFetch(`users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(updateData),
    });

    if (!result.ok) return res.status(result.status).json({ error: result.body });

    const profile = Array.isArray(result.body) ? result.body[0] : result.body;
    return res.json(profile);
  } catch (err) {
    console.error('PUT /users/profile error', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

module.exports = router;

