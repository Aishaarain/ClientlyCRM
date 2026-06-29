import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { Mail, User, Shield, Building2, Send } from 'lucide-react';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-line last:border-0">
      <div className="mt-0.5 rounded-xl bg-soft p-2">
        <Icon size={15} className="text-primary" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-black text-ink">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Your account details and workspace configuration."
      />

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Account */}
        <Card className="space-y-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-ink">Account</h3>
            <Badge status={isAdmin ? 'active' : 'default'}>
              {isAdmin ? 'Admin' : 'Freelancer'}
            </Badge>
          </div>

          <InfoRow icon={User}    label="Full name"  value={user?.name} />
          <InfoRow icon={Mail}    label="Email"      value={user?.email} />
          <InfoRow icon={Shield}  label="Role"       value={user?.role} />
          <InfoRow icon={Building2} label="Workspace" value={user?.workspaceId ? 'Connected' : 'No workspace'} />
        </Card>

        {/* Email sender */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Send size={18} className="text-primary" />
            <h3 className="text-lg font-black text-ink">Invite emails</h3>
          </div>

          <p className="text-sm leading-6 text-muted">
            When you invite a team member, Velora sends the invite from the system
            email. Replies are automatically directed to your registered email via
            the <span className="font-bold text-ink">Reply-To</span> header.
          </p>

         <div className="mt-4 space-y-2 rounded-2xl bg-soft p-4 font-mono text-sm">
  <p className="text-muted">From: <span className="text-primary">Velora CRM &lt;system&gt;</span></p>
  <p className="text-muted">Reply-To: <span className="text-primary">{isAdmin ? user?.email : 'Managed by your admin'}</span></p>
</div>
        </Card>

        {/* Session */}
        <Card>
          <h3 className="mb-4 text-lg font-black text-ink">Session</h3>
          <p className="text-sm leading-6 text-muted">
            You are currently authenticated. 
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Badge status="active">Authenticated</Badge>
            {user?.role && (
              <Badge status="default" className="capitalize">{user.role}</Badge>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}