import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input, { Field } from '../../components/ui/Input.jsx';
import ErrorBanner from '../../components/ui/ErrorBanner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthShell from './AuthShell.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Login to your Velora CRM workspace.">
      <ErrorBanner message={error} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Email address">
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="aisha@example.com" />
        </Field>
        <Field label="Password">
          <Input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </Field>
        <Button type="submit" variant="gradient" size="lg" className="w-full" loading={loading}>Login</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New to Velora? <Link className="font-black text-primary" to="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}
