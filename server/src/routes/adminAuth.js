const express = require('express');
const router = express.Router();

// Create a new Supabase user using the service_role key (server-side)
router.post('/create-user', async (req, res) => {
  const { email, password, full_name, role = 'candidate' } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return res.status(500).json({ error: 'Supabase service role key not configured on server' });
  }

  try {
    // Create auth user via Supabase admin REST endpoint
    const authResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'apikey': SERVICE_ROLE
      },
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name, role } })
    });

    const authJson = await authResp.json().catch(() => ({}));
    if (!authResp.ok) return res.status(authResp.status).json({ error: authJson });

    const userId = authJson.id || authJson.user?.id || authJson.user_id || authJson?.user?.id;

    // Insert profile into Postgres via PostgREST
    const profileResp = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'apikey': SERVICE_ROLE,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([{ id: userId, full_name, email, role }])
    });

    const profileJson = await profileResp.json().catch(() => ({}));
    if (!profileResp.ok) {
      // return auth result but surface profile error
      return res.status(profileResp.status).json({ auth: authJson, profileError: profileJson });
    }

    return res.json({ auth: authJson, profile: Array.isArray(profileJson) ? profileJson[0] : profileJson });
  } catch (err) {
    console.error('admin/create-user error', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

// Delete a user
router.delete('/delete-user/:id', async (req, res) => {
  const { id } = req.params;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return res.status(500).json({ error: 'Supabase service role key not configured on server' });
  }

  try {
    const authResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'apikey': SERVICE_ROLE
      }
    });

    if (!authResp.ok) {
      const errorJson = await authResp.json().catch(() => ({}));
      return res.status(authResp.status).json({ error: errorJson });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('admin/delete-user error', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

module.exports = router;
