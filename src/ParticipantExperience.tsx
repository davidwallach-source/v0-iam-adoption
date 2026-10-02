import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/design-system';
import type { IconName } from '@/design-system/3-primitives/Icon/Icon';

type PETaskKind = 'sign' | 'upload' | 'form' | 'review';
type PETaskStatus = 'not-started' | 'started' | 'complete';

interface PETask {
  id: string;
  title: string;
  kind: PETaskKind;
  status: PETaskStatus;
  sentDate: string;
  hasMessage?: boolean;
}

interface PEDocument {
  id: string;
  name: string;
  status: string;
  dateModified: string;
  sharedBy: string;
}

interface SourceTask {
  id: string;
  title: string;
  type: string;
  team: string;
  assignee: string;
  status: string;
}

interface SourceDocument {
  id: string;
  name: string;
  status?: string;
  owner?: string;
  dateModified: string;
}

export interface ParticipantSpaceSource {
  spaceName: string;
  partyName: string;
  tasks: SourceTask[];
  documents: SourceDocument[];
  supplementalDocs: SourceDocument[];
}

export interface ParticipantContact {
  name: string;
  title: string;
  email: string;
  phone: string;
  initials: string;
}

interface ParticipantExperienceProps {
  source: ParticipantSpaceSource;
  participantName: string;
  contact: ParticipantContact;
  onExit: () => void;
  preview?: boolean;
}

const COLORS = {
  ink: '#130032',
  inkMuted: '#4B4366',
  surface: '#F4F4F6',
  card: '#FFFFFF',
  border: '#E3E1EA',
  action: '#2A1560',
  continue: '#4C00FF',
  success: '#0E8A4F',
};

const KIND_ICON: Record<PETaskKind, IconName> = {
  sign: 'sign',
  upload: 'upload',
  form: 'document-pencil',
  review: 'eye',
};

function formatLongDate(raw: string): string {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(raw.trim());
  if (!m) return raw;
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  const d = new Date(year, Number(m[1]) - 1, Number(m[2]));
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function toKind(type: string): PETaskKind {
  if (/sign/i.test(type)) return 'sign';
  if (/upload/i.test(type)) return 'upload';
  if (/form/i.test(type)) return 'form';
  return 'review';
}

function toStatus(status: string | undefined): PETaskStatus {
  if (!status) return 'not-started';
  if (/complete|executed/i.test(status)) return 'complete';
  if (/progress/i.test(status)) return 'started';
  return 'not-started';
}

const isSamePerson = (a: string, b: string) =>
  a.toLowerCase().split(' ')[0] === b.toLowerCase().split(' ')[0];

// Builds the external participant's view of a space: only the tasks routed to
// their organization, plus the documents that have been shared with them.
function deriveParticipantView(source: ParticipantSpaceSource): { tasks: PETask[]; documents: PEDocument[] } {
  const { partyName } = source;
  const fallbackDate = source.documents[0]?.dateModified ?? '4/20/2026';

  const tasks: PETask[] = [];
  const seen = new Set<string>();
  const push = (t: PETask) => {
    const key = t.title.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    tasks.push(t);
  };

  source.tasks
    .filter(t => t.team === 'External' || t.team === 'Family' || isSamePerson(t.assignee, partyName))
    .forEach((t, i) => push({
      id: `task-${t.id}`,
      title: t.title,
      kind: toKind(t.type),
      status: toStatus(t.status),
      sentDate: fallbackDate,
      hasMessage: i === 0,
    }));

  source.documents
    .filter(d => d.status !== 'Draft')
    .forEach(d => {
      const status = d.status ?? '';
      if (/pending signature/i.test(status)) {
        push({ id: `doc-sign-${d.id}`, title: `Sign ${d.name}`, kind: 'sign', status: 'not-started', sentDate: d.dateModified });
      } else if (/in review/i.test(status)) {
        push({ id: `doc-review-${d.id}`, title: `Review ${d.name}`, kind: 'review', status: 'not-started', sentDate: d.dateModified });
      } else if (/executed|completed/i.test(status) && tasks.length < 3) {
        push({ id: `doc-signed-${d.id}`, title: `Sign ${d.name}`, kind: 'sign', status: 'complete', sentDate: d.dateModified });
      }
    });

  source.supplementalDocs
    .filter(d => d.owner && isSamePerson(d.owner, partyName))
    .forEach(d => push({ id: `doc-upload-${d.id}`, title: `Upload ${d.name}`, kind: 'upload', status: 'complete', sentDate: d.dateModified }));

  const documents: PEDocument[] = [
    ...source.documents
      .filter(d => d.status !== 'Draft')
      .map(d => ({ id: `d-${d.id}`, name: d.name, status: d.status ?? 'Shared', dateModified: d.dateModified, sharedBy: 'shared' })),
    ...source.supplementalDocs
      .filter(d => d.owner && isSamePerson(d.owner, partyName))
      .map(d => ({ id: `s-${d.id}`, name: d.name, status: 'Uploaded', dateModified: d.dateModified, sharedBy: 'you' })),
  ];

  return { tasks: tasks.slice(0, 8), documents };
}

const GROUPS: { title: string; kinds: PETaskKind[] }[] = [
  { title: 'Review and sign', kinds: ['review', 'sign'] },
  { title: 'Forms and documentation', kinds: ['form', 'upload'] },
];

function actionLabel(task: PETask): string {
  if (task.status === 'complete') return 'View';
  if (task.status === 'started') return 'Continue';
  if (task.kind === 'sign') return 'Sign';
  if (task.kind === 'upload') return 'Upload';
  if (task.kind === 'review') return 'Review';
  return 'Start';
}

function StatusDot({ status }: { status: PETaskStatus }) {
  const label = status === 'complete' ? 'Completed' : status === 'started' ? 'Started' : 'Not started';
  const color = status === 'not-started' ? COLORS.inkMuted : COLORS.success;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color, fontSize: 15, minWidth: 120 }}>
      {status === 'complete'
        ? <Icon name="status-check" size={14} color={COLORS.success} />
        : <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />}
      {label}
    </span>
  );
}

function TaskRow({ task, contactName, onAction }: { task: PETask; contactName: string; onAction: () => void }) {
  const label = actionLabel(task);
  const isComplete = task.status === 'complete';
  const isContinue = task.status === 'started';
  const buttonStyle: CSSProperties = {
    minWidth: 96,
    height: 40,
    padding: '0 20px',
    borderRadius: 4,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    border: isComplete ? `1px solid ${COLORS.border}` : 'none',
    background: isComplete ? COLORS.card : isContinue ? COLORS.continue : COLORS.action,
    color: isComplete ? COLORS.ink : '#FFFFFF',
  };
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxShadow: '0 1px 2px rgba(19,0,50,0.06)' }}>
      <Icon name={KIND_ICON[task.kind]} size={22} color={COLORS.ink} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 18, color: COLORS.ink, textDecoration: isComplete ? 'none' : undefined }}>{task.title}</span>
        <span style={{ fontSize: 14, color: COLORS.inkMuted }}>
          {`Sent by ${contactName}, ${formatLongDate(task.sentDate)}`}
          {task.hasMessage && (
            <>
              {' | '}
              <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: COLORS.inkMuted, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>View message</button>
            </>
          )}
        </span>
      </div>
      <StatusDot status={task.status} />
      <button type="button" onClick={onAction} style={buttonStyle} aria-label={`${label}: ${task.title}`}>{label}</button>
    </li>
  );
}

export function ParticipantExperience({ source, participantName, contact, onExit, preview = false }: ParticipantExperienceProps) {
  const initial = useMemo(() => deriveParticipantView(source), [source]);

  // Without the preview banner there's no visible exit, so Escape returns to the sender view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);
  const [tasks, setTasks] = useState<PETask[]>(initial.tasks);
  const [tab, setTab] = useState<'tasks' | 'documents'>('tasks');
  const [toast, setToast] = useState<string | null>(null);

  const remaining = tasks.filter(t => t.status !== 'complete').length;

  const advance = (task: PETask) => {
    if (task.status === 'complete') {
      setToast(`Opening ${task.title.replace(/^(Sign|Upload|Review) /, '')}`);
    } else if (task.kind === 'form' && task.status === 'not-started') {
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: 'started' } : t)));
      setToast(`${task.title} started`);
    } else {
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: 'complete' } : t)));
      setToast(`${task.title} completed`);
    }
    window.setTimeout(() => setToast(null), 3000);
  };

  const inner: CSSProperties = { maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 48px', boxSizing: 'border-box' };

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Participant view for ${participantName}`} style={{ position: 'fixed', inset: 0, zIndex: 1080, background: COLORS.surface, overflowY: 'auto', color: COLORS.ink }}>
      {preview && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '8px 16px', background: '#FFF4CC', color: COLORS.ink, fontSize: 14 }}>
          <Icon name="eye" size={16} color={COLORS.ink} />
          <span>{`Previewing the participant experience as ${participantName} (${source.partyName})`}</span>
          <button type="button" onClick={onExit} style={{ background: 'none', border: `1px solid ${COLORS.ink}`, borderRadius: 4, padding: '2px 10px', fontSize: 13, cursor: 'pointer', color: COLORS.ink }}>Exit preview</button>
        </div>
      )}

      <header style={{ background: 'linear-gradient(180deg, #160430 0%, #2A1560 60%, #3C2482 100%)', color: '#FFFFFF' }}>
        <div style={{ ...inner, paddingTop: 28, display: 'flex', justifyContent: 'space-between', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <img src="/docusign-logo-white.svg" alt="Docusign" style={{ height: 32, width: 'auto', alignSelf: 'flex-start' }} />
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 400, lineHeight: 1.2, textWrap: 'balance' }}>{`Welcome, ${participantName}`}</h1>
            <div style={{ display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start', gap: 16, padding: '10px 24px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', fontSize: 15 }}>
              <span style={{ fontWeight: 500 }}>{source.spaceName}</span>
              <span aria-hidden="true" style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.4)' }} />
              <span>{remaining === 0 ? 'All tasks complete' : `${remaining} ${remaining === 1 ? 'task' : 'tasks'} remaining`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <button type="button" aria-label="Messages" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="messages" size={22} color="#FFFFFF" /></button>
              <button type="button" aria-label="Docusign AI assistant" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="ai-spark-filled" size={22} color="#C9A7FF" /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 15 }}>
                <span style={{ fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.85 }}>Your contact</span>
                <span style={{ fontWeight: 600 }}>{`${contact.name} - ${contact.title}`}</span>
                <span>{contact.email}</span>
                <span>{contact.phone}</span>
                <button type="button" onClick={() => { setToast(`Message sent to ${contact.name}`); window.setTimeout(() => setToast(null), 3000); }} style={{ marginTop: 8, alignSelf: 'flex-start', background: 'transparent', color: '#FFFFFF', border: '1px solid #FFFFFF', borderRadius: 999, padding: '8px 22px', fontSize: 15, cursor: 'pointer' }}>Send message</button>
              </div>
              <span aria-hidden="true" style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFFFFF', color: COLORS.action, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 600 }}>{contact.initials}</span>
            </div>
          </div>
        </div>

        <nav style={{ ...inner, display: 'flex', gap: 8, marginTop: 8 }} role="tablist" aria-label="Participant sections">
          {(['tasks', 'documents'] as const).map(key => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              style={{ background: 'none', border: 'none', borderBottom: `3px solid ${tab === key ? '#FFFFFF' : 'transparent'}`, color: '#FFFFFF', fontSize: 17, fontWeight: tab === key ? 600 : 400, padding: '14px 40px', cursor: 'pointer' }}
            >
              {key === 'tasks' ? 'Tasks' : 'Documents'}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ ...inner, paddingTop: 40, paddingBottom: 64, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {tab === 'tasks' && (
          tasks.length === 0 ? (
            <p style={{ fontSize: 16, color: COLORS.inkMuted }}>{'You have no tasks in this space right now.'}</p>
          ) : GROUPS.map(group => {
            const items = tasks.filter(t => group.kinds.includes(t.kind));
            if (items.length === 0) return null;
            return (
              <section key={group.title} aria-labelledby={`pe-${group.title}`} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 id={`pe-${group.title}`} style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>{group.title}</h2>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {items.map(task => <TaskRow key={task.id} task={task} contactName={contact.name} onAction={() => advance(task)} />)}
                </ul>
              </section>
            );
          })
        )}

        {tab === 'documents' && (
          <section aria-labelledby="pe-docs" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 id="pe-docs" style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Shared with you</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {initial.documents.map(doc => (
                <li key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px', background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, boxShadow: '0 1px 2px rgba(19,0,50,0.06)' }}>
                  <Icon name="document" size={22} color={COLORS.ink} />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 18 }}>{doc.name}</span>
                    <span style={{ fontSize: 14, color: COLORS.inkMuted }}>
                      {doc.sharedBy === 'you'
                        ? `Uploaded by you, ${formatLongDate(doc.dateModified)}`
                        : `Shared by ${contact.name}, ${formatLongDate(doc.dateModified)}`}
                    </span>
                  </div>
                  <span style={{ fontSize: 15, color: COLORS.inkMuted, minWidth: 140 }}>{doc.status}</span>
                  <button type="button" aria-label={`Download ${doc.name}`} onClick={() => { setToast(`Downloading ${doc.name}`); window.setTimeout(() => setToast(null), 3000); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                    <Icon name="download" size={20} color={COLORS.ink} />
                  </button>
                  <button type="button" onClick={() => { setToast(`Opening ${doc.name}`); window.setTimeout(() => setToast(null), 3000); }} style={{ minWidth: 96, height: 40, borderRadius: 4, border: `1px solid ${COLORS.border}`, background: COLORS.card, color: COLORS.ink, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>View</button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {toast && (
        <div role="status" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: COLORS.ink, color: '#FFFFFF', padding: '12px 20px', borderRadius: 4, fontSize: 14, boxShadow: '0 4px 12px rgba(19,0,50,0.25)' }}>{toast}</div>
      )}
    </div>,
    document.body,
  );
}
