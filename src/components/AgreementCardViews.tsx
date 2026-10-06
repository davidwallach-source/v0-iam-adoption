import React from 'react';
import './agreement-card-views.css';

export type AgreementLayout = 'list' | 'grid';

export interface AgreementCardItem {
  id: string;
  name: string;
  party: string;
  dealValue?: string;
  agreementType?: string;
  termLength?: string;
  status: string;
  statusKind: 'success' | 'warning' | 'info' | 'neutral';
  documentsCount: number;
  tasksCount: number;
  envelopesCount: number;
  people: string[];
}

interface ViewProps {
  items: AgreementCardItem[];
  onOpen: (id: string) => void;
  renderName?: (id: string, fallback: React.ReactNode) => React.ReactNode;
  renderMenu: (id: string) => React.ReactNode;
  emptyMessage: string;
}

const MAX_AVATARS = 3;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const hasValue = (v?: string) => !!v && v !== '—';

function statusTone(item: AgreementCardItem) {
  if (item.statusKind === 'success') return 'completed';
  if (item.statusKind === 'neutral') return 'neutral';
  return 'progress';
}

function AvatarStack({ people }: { people: string[] }) {
  if (people.length === 0) return null;
  const shown = people.slice(0, MAX_AVATARS);
  const extra = people.length - shown.length;
  return (
    <div className="acv-avatars">
      <div className="acv-avatar-stack" aria-label={`${people.length} participants`}>
        {shown.map((initials, i) => (
          <span key={`${initials}-${i}`} className="acv-avatar" data-tone={i % 3} aria-hidden="true">
            {initials}
          </span>
        ))}
      </div>
      {extra > 0 && <span className="acv-avatar-more">+{extra}</span>}
    </div>
  );
}

function activateOnKey(e: React.KeyboardEvent, open: () => void) {
  if (e.target !== e.currentTarget) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open();
  }
}

export function AgreementListView({ items, onOpen, renderName, renderMenu, emptyMessage }: ViewProps) {
  if (items.length === 0) return <p className="acv-empty">{emptyMessage}</p>;
  return (
    <ul className="acv-list" aria-label="Agreements">
      {items.map(item => {
        const name = <span className="acv-row-name">{item.name}</span>;
        return (
          <li key={item.id}>
            <div
              className="acv-card acv-row"
              role="button"
              tabIndex={0}
              onClick={() => onOpen(item.id)}
              onKeyDown={e => activateOnKey(e, () => onOpen(item.id))}
            >
              <div className="acv-row-title">
                <span className="acv-dot" data-tone={statusTone(item)} role="img" aria-label={item.status} />
                {renderName ? renderName(item.id, name) : name}
              </div>
              <span className="acv-row-meta">
                {hasValue(item.dealValue) ? `${item.party} · ${item.dealValue}` : item.party}
              </span>
              <AvatarStack people={item.people} />
              <div className="acv-row-counts">
                <span>{plural(item.documentsCount, 'document', 'documents')}</span>
                <span>{plural(item.envelopesCount, 'envelope', 'envelopes')}</span>
              </div>
              <div className="acv-menu" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
                {renderMenu(item.id)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function AgreementGridView({ items, onOpen, renderName, emptyMessage }: Omit<ViewProps, 'renderMenu'> & { renderMenu?: ViewProps['renderMenu'] }) {
  if (items.length === 0) return <p className="acv-empty">{emptyMessage}</p>;
  return (
    <ul className="acv-grid" aria-label="Agreements">
      {items.map(item => {
        const details = [item.agreementType, item.termLength, item.dealValue].filter(hasValue).join(' · ');
        const name = <h3 className="acv-tile-name">{item.name}</h3>;
        return (
          <li key={item.id} style={{ display: 'flex' }}>
            <div
              className="acv-card acv-tile"
              role="button"
              tabIndex={0}
              onClick={() => onOpen(item.id)}
              onKeyDown={e => activateOnKey(e, () => onOpen(item.id))}
            >
              <div className="acv-tile-head">
                <div className="acv-tile-heading">
                  {renderName ? renderName(item.id, name) : name}
                  <span className="acv-tile-party">{item.party}</span>
                </div>
                <span className="acv-tile-status" data-tone={statusTone(item)}>
                  <span className="acv-dot" data-tone={statusTone(item)} aria-hidden="true" />
                  {item.status}
                </span>
              </div>
              {details && <p className="acv-tile-details">{details}</p>}
              <div className="acv-tile-foot">
                <AvatarStack people={item.people} />
                <span className="acv-tile-counts">
                  {plural(item.tasksCount, 'task', 'tasks')} | {plural(item.envelopesCount, 'envelope', 'envelopes')}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function AgreementLayoutToggle({ value, onChange }: { value: AgreementLayout; onChange: (v: AgreementLayout) => void }) {
  return (
    <div className="acv-toggle" role="group" aria-label="Layout">
      <button type="button" className="acv-toggle-btn" aria-pressed={value === 'list'} aria-label="List view" onClick={() => onChange('list')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2.5" y="3.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2.5" y="11.5" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6h7.5M10 14h7.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button type="button" className="acv-toggle-btn" aria-pressed={value === 'grid'} aria-label="Grid view" onClick={() => onChange('grid')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2.5" y="2.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="12" y="2.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2.5" y="12" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="12" y="12" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}
