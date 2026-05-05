import test from 'node:test';
import assert from 'node:assert/strict';

import { buildFallbackUser, resolveRoleFromAuthUser } from '../src/context/authProfile.js';

test('buildFallbackUser preserves recruiter role from auth metadata', () => {
  const fallbackUser = buildFallbackUser({
    id: 'demo-recruiter-id',
    email: 'recruiter@joblinkdz.com',
    user_metadata: {
      full_name: 'Demo Recruiter',
      role: 'admin',
    },
  });

  assert.deepEqual(fallbackUser, {
    id: 'demo-recruiter-id',
    full_name: 'Demo Recruiter',
    email: 'recruiter@joblinkdz.com',
    role: 'admin',
  });
});

test('resolveRoleFromAuthUser falls back to candidate for unknown roles', () => {
  assert.equal(resolveRoleFromAuthUser({ user_metadata: { role: 'recruiter' } }), 'candidate');
  assert.equal(resolveRoleFromAuthUser({}), 'candidate');
});
