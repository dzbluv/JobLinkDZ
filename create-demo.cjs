const SUPABASE_URL = "https://rhiicftiqnbrywjpfwpc.supabase.co";
const SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoaWljZnRpcW5icnl3anBmd3BjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc0NTg2NywiZXhwIjoyMDkzMzIxODY3fQ.QYrbGQUjyqvkgCyfNk65oVRa7bzDWMr4-Qiop6tpdXw";

async function createUser(email, password, full_name, role) {
  try {
    const authResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'apikey': SERVICE_ROLE
      },
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { full_name, role } })
    });
    const authJson = await authResp.json();
    const userId = authJson.id;
    if (!userId) return;

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
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await createUser('candidatedemo@joblinkdz.com', 'demo123456', 'Demo Candidate', 'candidate');
  await createUser('recruiterdemo@joblinkdz.com', 'demo123456', 'Demo Recruiter', 'admin');
}
run();
