import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // ── Verify token is valid on mount ──────────────────────────────
  useEffect(() => {
    if (!token) {
      setError('Invalid invite link.');
      setChecking(false);
      return;
    }
    // Just verify the token exists and get the email
    api.get(`/workspaces/invite/verify/${token}`)
      .then((res) => { setInviteEmail(res.data.email); setChecking(false); })
      .catch(() => { setError('This invite link is invalid or has expired.'); setChecking(false); });
  }, [token]);

  // ── Submit registration ─────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match.');

    setLoading(true);
    setError('');
    try {
      await api.post(`/workspaces/invite/accept/${token}`, {
        name: form.name,
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not accept invite.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted">Verifying invite...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-black text-ink">Join Velora CRM</h1>

        {success ? (
          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-green-600">✅ Account created successfully!</p>
            <p className="mt-2 text-sm text-muted">You can now log in with your email and password.</p>
            <Link to="/login" className="mt-4 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-black text-white">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
            {inviteEmail && (
              <p className="mt-3 text-sm text-muted">
                Joining as <span className="font-black text-ink">{inviteEmail}</span>
              </p>
            )}

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-muted">Your name</label>
                <input
                  required
                  placeholder="Sara Khan"
                  className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-muted">Password</label>
                <input
                  required
                  type="password"
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-black uppercase tracking-wide text-muted">Confirm password</label>
                <input
                  required
                  type="password"
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !!error}
                className="w-full rounded-xl bg-primary py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Accept & Join'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}