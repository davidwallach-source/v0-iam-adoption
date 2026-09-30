import React, { useState, useRef, useEffect, useMemo, type CSSProperties, type KeyboardEvent } from 'react';
import { Avatar, Icon } from '@/design-system';
import type { IconName } from '@/design-system/3-primitives/Icon/Icon';

type PanelView = 'all' | 'activity' | 'messages' | 'iris';
type ColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SidePanelActivityItem {
  id: string;
  icon: IconName;
  user: string;
  action: string;
  time: string;
  conversation?: string;
}

const MESSAGE_ICONS: ReadonlySet<string> = new Set(['comment', 'comments', 'chat', 'message']);
const isMessageEvent = (item: SidePanelActivityItem) => !!item.conversation || MESSAGE_ICONS.has(item.icon);

export interface SidePanelConversation {
  name: string;
  initials: string;
  colorIndex: ColorIndex;
  preview: string;
  date: string;
  receivedAt: string;
}

interface ThreadMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

interface QuotedEvent {
  id: string;
  icon: IconName;
  title: string;
  time: string;
}

type FeedEntry =
  | { kind: 'event'; id: string; icon: IconName; user: string; action: string; time: string }
  | {
      kind: 'message';
      id: string;
      name: string;
      initials: string;
      colorIndex: ColorIndex;
      text: string;
      time: string;
      conversation?: string;
      quote?: QuotedEvent;
      isIris?: boolean;
    };

interface Mentionable {
  name: string;
  initials: string;
  colorIndex: ColorIndex;
  isIris?: boolean;
}

interface SpaceSidePanelProps {
  activity: SidePanelActivityItem[];
  conversations: SidePanelConversation[];
  style?: CSSProperties;
  fitToViewport?: boolean;
}

const TITLES: Record<PanelView, string> = {
  all: 'Activity Feed',
  activity: 'Activity',
  messages: 'Messages',
  iris: 'Iris Chat',
};

const FONT = 'var(--ink-font-family-default)';
const TEXT_DEFAULT = 'var(--ink-font-color-default)';
const TEXT_SECONDARY = 'var(--ink-font-color-secondary)';
const BORDER_SUBTLE = 'var(--ink-border-color-subtle, var(--ink-border-subtle))';
const CIRCLE_BG = 'var(--ink-neutral-20)';
const MENTION_COLOR = 'var(--ink-cobalt-100)';

const isComposing = (e: KeyboardEvent) => e.nativeEvent.isComposing || e.keyCode === 229;

const initialsOf = (name: string) =>
  name === 'You' ? 'YO' : name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const colorFor = (name: string): ColorIndex => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return (hash % 10) as ColorIndex;
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function ActivityGlyph() {
  return (
    <svg width="18" height="17" viewBox="0 0 15 14" fill="none" aria-hidden="true">
      <path d="M9.29 9.83L7 7.54V3H9V6.71L10.71 8.42L9.3 9.83H9.29ZM8 0C5.45 0 3.22 1.37 2 3.42V1H0V7H6V5H3.32C4.1 3.18 5.9 1.9 8 1.9C10.81 1.9 13.1 4.19 13.1 7C13.1 9.81 10.81 12.1 8 12.1C5.9 12.1 4.09 10.82 3.31 9H1.29C2.15 11.89 4.83 14 8 14C11.87 14 15 10.87 15 7C15 3.13 11.87 0 8 0Z" fill="currentColor" />
    </svg>
  );
}

function MessagesGlyph() {
  return (
    <svg width="18" height="17" viewBox="0 0 16 15" fill="none" aria-hidden="true">
      <path d="M14 2V10H4.3L2 12.3V2H14ZM16 0H0V15H2L5 12H16V0ZM12 5H4V7H12V5Z" fill="currentColor" />
    </svg>
  );
}

function ReplyGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8.99 4H3.4L5.99 1.39L4.6 0L0.29 4.29C0.09 4.49 0 4.74 0 5C0 5.26 0.1 5.51 0.29 5.71L4.59 10L6 8.59L3.41 6H9.12C11.88 6 14 8.12 14 10.88V16H16V11C16 7.14 12.86 4 9 4H8.99Z" fill="currentColor" />
    </svg>
  );
}

function IrisGlyph({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M9.10854 6.20697C8.14168 5.01705 6.68378 4.41935 4.23801 3.92444C4.10515 3.91895 3.92703 4.08122 3.92348 4.23865C4.41871 6.68442 5.01609 8.14232 6.20601 9.10918C7.4221 8.33336 8.3324 7.42307 9.10822 6.20697H9.10854Z" fill="#CBC2FF" />
      <path d="M16.2928 9.10918C17.4828 8.14232 18.0805 6.68442 18.5754 4.23865C18.5915 4.15945 18.5718 4.0809 18.5204 4.01786C18.469 3.95515 18.3937 3.91895 18.3145 3.91895C15.8154 4.41967 14.3572 5.01705 13.3906 6.20697C14.1664 7.42339 15.0767 8.33369 16.2928 9.10918Z" fill="#CBC2FF" />
      <path d="M6.20605 13.3906C5.01613 14.3575 4.41843 15.8154 3.92352 18.2612C3.90735 18.3407 3.92675 18.4189 3.97847 18.4819C4.04151 18.5589 4.13816 18.5961 4.23805 18.5757C6.68382 18.0805 8.14172 17.4831 9.10858 16.2932C8.33276 15.0771 7.42247 14.1668 6.20637 13.3909L6.20605 13.3906Z" fill="#CBC2FF" />
      <path d="M13.3906 16.2928C14.3575 17.4828 15.8154 18.0805 18.2612 18.5754C18.3556 18.5957 18.4574 18.5592 18.5204 18.4819C18.5718 18.4189 18.5915 18.3404 18.5754 18.2608C18.0801 15.8154 17.4828 14.3572 16.2928 13.3906C15.0764 14.1664 14.1661 15.0767 13.3906 16.2928Z" fill="#CBC2FF" />
      <path d="M19.7609 10.554C18.2748 10.0032 17.1732 9.494 16.2898 8.9224C15.1466 8.19492 14.3152 7.36351 13.5877 6.22033C13.0265 5.33695 12.5069 4.22495 11.9561 2.74919C11.8521 2.44781 11.5715 2.26074 11.2598 2.26074C10.948 2.26074 10.6674 2.44781 10.5635 2.74919C10.0127 4.23534 9.50341 5.33695 8.93182 6.22033C8.20434 7.36351 7.36254 8.19492 6.21935 8.9224C5.33598 9.48361 4.22397 10.0032 2.74822 10.554C2.44683 10.658 2.25977 10.9386 2.25977 11.2503C2.25977 11.5621 2.44683 11.8427 2.74822 11.9467C4.23436 12.4871 5.33598 13.0067 6.21935 13.5783C7.36254 14.3058 8.19394 15.1372 8.93182 16.2804C9.49302 17.1741 10.0127 18.2758 10.5635 19.7515C10.6778 20.0529 10.948 20.24 11.2598 20.24C11.5715 20.24 11.8521 20.0425 11.9561 19.7515C12.5069 18.2654 13.0161 17.1637 13.5877 16.2804C14.3152 15.1372 15.1466 14.3058 16.2898 13.5783C17.1836 13.0171 18.2852 12.4975 19.7609 11.9467C20.0623 11.8323 20.2494 11.5621 20.2494 11.2503C20.2494 10.9386 20.0519 10.658 19.7609 10.554ZM15.2505 11.3647C12.9434 12.1857 12.1847 12.9443 11.3637 15.2515C11.3221 15.3554 11.1662 15.3554 11.1351 15.2515C10.314 12.9443 9.55538 12.1857 7.24822 11.3647C7.14429 11.3231 7.14429 11.1672 7.24822 11.136C9.55538 10.315 10.314 9.55635 11.1351 7.24919C11.1766 7.13488 11.3325 7.13488 11.3637 7.24919C12.1847 9.55635 12.9434 10.315 15.2505 11.136C15.3545 11.1776 15.3545 11.3335 15.2505 11.3647Z" fill="url(#side-panel-iris-gradient)" />
      <defs>
        <linearGradient id="side-panel-iris-gradient" x1="2.28928" y1="11.2503" x2="20.2859" y2="11.2503" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D9155D" />
          <stop offset="0.501049" stopColor="#A02AAC" />
          <stop offset="1" stopColor="#4C06FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const VIEW_BUTTONS: { view: Exclude<PanelView, 'all'>; label: string; Glyph: () => React.JSX.Element }[] = [
  { view: 'activity', label: 'Show only activity', Glyph: ActivityGlyph },
  { view: 'messages', label: 'Show only messages', Glyph: MessagesGlyph },
  { view: 'iris', label: 'Iris Chat', Glyph: () => <IrisGlyph /> },
];

function ViewToggles({ active, onChange }: { active: PanelView; onChange: (view: PanelView) => void }) {
  return (
    <div role="group" aria-label="Filter side panel" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {VIEW_BUTTONS.map(({ view, label, Glyph }) => {
        const selected = view === active;
        return (
          <button
            key={view}
            type="button"
            aria-pressed={selected}
            aria-label={label}
            title={label}
            onClick={() => onChange(selected ? 'all' : view)}
            style={{
              width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: selected ? 'var(--ink-cobalt-10)' : 'transparent',
              color: selected ? 'var(--ink-cobalt-100)' : 'rgba(19, 0, 50, 0.7)',
              transition: 'background 120ms ease',
            }}
          >
            <Glyph />
          </button>
        );
      })}
    </div>
  );
}

function IconCircle({ children, size = 40 }: { children: React.ReactNode; size?: number }) {
  return (
    <span style={{ width: size, height: size, borderRadius: '50%', background: CIRCLE_BG, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </span>
  );
}

function MentionText({ text, names }: { text: string; names: string[] }) {
  if (names.length === 0 || !text.includes('@')) return <>{text}</>;
  const pattern = new RegExp(`(@(?:${names.map(escapeRegExp).join('|')}))`, 'g');
  return (
    <>
      {text.split(pattern).map((part, i) =>
        i % 2 === 1
          ? <span key={i} style={{ color: MENTION_COLOR, fontWeight: 500 }}>{part}</span>
          : <React.Fragment key={i}>{part}</React.Fragment>,
      )}
    </>
  );
}

function QuoteCard({ quote }: { quote: QuotedEvent }) {
  return (
    <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'var(--ink-neutral-10, #F7F7F9)', border: `1px solid ${BORDER_SUBTLE}` }}>
      <span style={{ display: 'inline-flex', paddingTop: 2, flexShrink: 0 }}>
        <Icon name={quote.icon} size={16} color={TEXT_SECONDARY} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 14, lineHeight: 1.4, color: TEXT_DEFAULT }}>{quote.title}</span>
        <span style={{ fontSize: 12, lineHeight: 1.4, color: TEXT_SECONDARY }}>{quote.time}</span>
      </span>
    </span>
  );
}

const eventTitle = (e: { user: string; action: string }) => `${e.user} ${e.action}`;

function Feed({
  entries,
  view,
  mentionNames,
  onOpenMessage,
  onReply,
}: {
  entries: FeedEntry[];
  view: PanelView;
  mentionNames: string[];
  onOpenMessage: (entry: Extract<FeedEntry, { kind: 'message' }>) => void;
  onReply: (entry: FeedEntry) => void;
}) {
  if (entries.length === 0) {
    return (
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: TEXT_SECONDARY }}>
        {view === 'messages' ? 'No messages yet. Start the conversation below.' : 'No activity yet.'}
      </p>
    );
  }
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {entries.map((entry, idx) => {
        const isLast = idx === entries.length - 1;
        const isMessage = entry.kind === 'message';
        const clickable = isMessage;
        const titleStyle: CSSProperties = { margin: 0, fontSize: 'var(--ink-font-element-label-emphasis-size)', lineHeight: 'var(--ink-font-element-label-emphasis-line-height)', fontWeight: 500, color: TEXT_DEFAULT };
        const metaStyle: CSSProperties = { margin: '2px 0 0', fontSize: 'var(--ink-font-detail-s-size)', lineHeight: 'var(--ink-font-detail-s-line-height)', color: TEXT_SECONDARY };

        const content = isMessage ? (
          <>
            <span style={{ ...titleStyle, display: 'block' }}>
              <strong style={{ fontWeight: 600 }}>{entry.name}</strong> {entry.isIris ? 'replied' : 'sent a message'}
            </span>
            <span style={{ display: 'block', marginTop: 2, fontSize: 14, lineHeight: 1.5, color: TEXT_DEFAULT, ...(entry.conversation ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}) }}>
              <MentionText text={entry.text} names={mentionNames} />
            </span>
            {entry.quote && <QuoteCard quote={entry.quote} />}
            <span style={{ ...metaStyle, display: 'block' }}>{entry.time}</span>
          </>
        ) : (
          <>
            <span style={{ ...titleStyle, display: 'block' }}>
              <strong style={{ fontWeight: 600 }}>{entry.user}</strong> {entry.action}
            </span>
            <span style={{ ...metaStyle, display: 'block' }}>{entry.time}</span>
          </>
        );

        const divided = view === 'messages';
        const boxStyle: CSSProperties = { flex: 1, minWidth: 0, padding: 0, paddingBottom: divided || isLast ? 0 : 16, fontFamily: FONT };
        const replyLabel = isMessage ? `Reply to ${entry.name}` : `Reply to: ${eventTitle(entry)}`;
        const itemStyle: CSSProperties = divided
          ? { display: 'flex', gap: 16, padding: '16px 0', borderBottom: isLast ? 'none' : `1px solid ${BORDER_SUBTLE}` }
          : { display: 'flex', gap: 16 };

        return (
          <li key={entry.id} className="feed-item" style={itemStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              {isMessage ? (
                entry.isIris
                  ? <IconCircle><IrisGlyph size={20} /></IconCircle>
                  : <Avatar initials={entry.initials} size="medium" colorIndex={entry.colorIndex} />
              ) : (
                <IconCircle>
                  <Icon name={entry.icon} size={16} color={TEXT_SECONDARY} />
                </IconCircle>
              )}
              {!isLast && !divided && <span aria-hidden="true" style={{ flex: 1, width: 1, minHeight: 16, background: BORDER_SUBTLE }} />}
            </div>
            {clickable ? (
              <button
                type="button"
                onClick={() => onOpenMessage(entry)}
                aria-label={`${entry.name} sent a message: ${entry.text}. Open conversation`}
                className="feed-select"
                style={{ ...boxStyle, display: 'block', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                {content}
              </button>
            ) : (
              <div style={boxStyle}>{content}</div>
            )}
            <button
              type="button"
              className="feed-reply"
              onClick={() => onReply(entry)}
              aria-label={replyLabel}
              title="Reply"
              style={{ width: 32, height: 32, flexShrink: 0, border: 'none', borderRadius: 6, background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(19, 0, 50, 0.9)' }}
            >
              <ReplyGlyph />
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function FeedComposer({
  mentionables,
  replyTo,
  onCancelReply,
  onSend,
}: {
  mentionables: Mentionable[];
  replyTo: QuotedEvent | null;
  onCancelReply: () => void;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const [mention, setMention] = useState<{ start: number; query: string } | null>(null);
  const [highlight, setHighlight] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  const matches = mention
    ? mentionables
        .filter((m) => m.name.toLowerCase().split(/\s+/).some((w) => w.startsWith(mention.query.toLowerCase())) || m.name.toLowerCase().startsWith(mention.query.toLowerCase()))
        .slice(0, 6)
    : [];
  const showMentions = mention !== null && matches.length > 0;

  const detectMention = (value: string, caret: number) => {
    const match = /(?:^|\s)@([^\s@]*)$/.exec(value.slice(0, caret));
    if (match) {
      setMention({ start: caret - match[1].length - 1, query: match[1] });
      setHighlight(0);
    } else {
      setMention(null);
    }
  };

  const insertMention = (m: Mentionable) => {
    const el = textareaRef.current;
    if (!mention || !el) return;
    const caret = el.selectionStart;
    const token = `@${m.name} `;
    const next = draft.slice(0, mention.start) + token + draft.slice(caret);
    setDraft(next);
    setMention(null);
    const pos = mention.start + token.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
    setMention(null);
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      style={{ position: 'relative', border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 12, padding: '14px 14px 12px 20px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--ink-white-100)' }}
    >
      {showMentions && (
        <ul
          role="listbox"
          aria-label="Mention someone"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(100% + 8px)', margin: 0, padding: 6, listStyle: 'none', background: 'var(--ink-white-100)', border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 12, boxShadow: '0 8px 24px rgba(19, 0, 50, 0.12)', zIndex: 5 }}
        >
          {matches.map((m, i) => (
            <li key={m.name} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); insertMention(m); }}
                onMouseEnter={() => setHighlight(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '8px 10px', border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontFamily: FONT, fontSize: 14, color: TEXT_DEFAULT, background: i === highlight ? 'var(--ink-cobalt-10)' : 'transparent' }}
              >
                {m.isIris
                  ? <IconCircle size={28}><IrisGlyph size={16} /></IconCircle>
                  : <Avatar initials={m.initials} size="small" colorIndex={m.colorIndex} />}
                <span style={{ flex: 1, minWidth: 0 }}>{m.name}</span>
                {m.isIris && <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>AI assistant</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {replyTo && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px', marginRight: 6, borderRadius: 8, background: 'var(--ink-neutral-10, #F7F7F9)' }}>
          <span style={{ display: 'inline-flex', paddingTop: 2, color: TEXT_SECONDARY }}><ReplyGlyph /></span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>Replying to</span>
            <span style={{ fontSize: 14, lineHeight: 1.4, color: TEXT_DEFAULT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyTo.title}</span>
          </span>
          <button type="button" onClick={onCancelReply} aria-label="Cancel reply" style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <Icon name="close" size={16} color={TEXT_SECONDARY} />
          </button>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          detectMention(e.target.value, e.target.selectionStart);
        }}
        onClick={(e) => detectMention(e.currentTarget.value, e.currentTarget.selectionStart)}
        onBlur={() => setMention(null)}
        onKeyDown={(e) => {
          if (showMentions) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => (h + 1) % matches.length); return; }
            if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => (h - 1 + matches.length) % matches.length); return; }
            if ((e.key === 'Enter' || e.key === 'Tab') && !isComposing(e)) { e.preventDefault(); insertMention(matches[highlight]); return; }
            if (e.key === 'Escape') { e.preventDefault(); setMention(null); return; }
          }
          if (e.key === 'Escape' && replyTo) { onCancelReply(); return; }
          if (e.key === 'Enter' && !e.shiftKey && !isComposing(e)) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder="Ask, @mention, or / for actions"
        aria-label="Write a message. Type @ to mention someone or Iris"
        style={{ resize: 'none', border: 'none', outline: 'none', background: 'transparent', fontFamily: FONT, fontSize: 16, lineHeight: 1.5, color: TEXT_DEFAULT }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button type="button" aria-label="Add attachment" style={{ width: 32, height: 32, marginLeft: -8, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={20} color={TEXT_DEFAULT} />
        </button>
        <button type="submit" aria-label="Send message" style={{ width: 36, height: 36, borderRadius: 6, border: 'none', background: 'var(--ink-cobalt-140)', color: 'var(--ink-white-100)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-up" size={20} color="currentColor" />
        </button>
      </div>
    </form>
  );
}

function PillComposer({ placeholder, onSend }: { placeholder: string; onSend: (text: string) => void }) {
  const [draft, setDraft] = useState('');
  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      style={{ display: 'flex', alignItems: 'center', gap: 16 }}
    >
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ flex: 1, minWidth: 0, height: 44, padding: '0 20px', border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 999, outline: 'none', fontFamily: FONT, fontSize: 16, color: TEXT_DEFAULT, background: 'var(--ink-white-100)' }}
      />
      <button type="submit" aria-label="Send message" style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <Icon name="send" size={20} color={TEXT_DEFAULT} />
      </button>
    </form>
  );
}

function MessageThread({
  conversation,
  replies,
  onBack,
  onSend,
}: {
  conversation: SidePanelConversation;
  replies: ThreadMessage[];
  onBack: () => void;
  onSend: (text: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [replies.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
        <button type="button" onClick={onBack} aria-label="Back to feed" style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginLeft: -4 }}>
          <Icon name="arrow-left" size={20} color={TEXT_DEFAULT} />
        </button>
        <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: TEXT_DEFAULT, fontFamily: FONT }}>{conversation.name}</span>
        <button type="button" aria-label="Conversation options" style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <Icon name="overflow-vertical" size={20} color={TEXT_DEFAULT} />
        </button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16, fontFamily: FONT }}>
          {conversation.preview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={conversation.initials} size="small" colorIndex={conversation.colorIndex} />
                <span style={{ fontSize: 16, fontWeight: 500, color: TEXT_DEFAULT }}>{conversation.name}</span>
                <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{conversation.receivedAt}</span>
              </div>
              <div style={{ background: 'var(--ink-cobalt-10)', borderRadius: 16, padding: '12px 20px', fontSize: 15, lineHeight: 1.5, color: TEXT_DEFAULT }}>
                {conversation.preview.replace(/…$/, '')}
              </div>
            </div>
          )}
          {replies.map((m) => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div style={{ background: 'var(--ink-cobalt-110)', color: 'var(--ink-white-100)', borderRadius: 16, padding: '12px 20px', fontSize: 15, lineHeight: 1.5, maxWidth: '100%' }}>
                {m.text}
              </div>
              <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{m.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 8 }}>
        <PillComposer placeholder="Send message..." onSend={onSend} />
      </div>
    </div>
  );
}

function IrisChat() {
  const [draft, setDraft] = useState('');
  const [log, setLog] = useState<{ id: string; role: 'user' | 'iris'; text: string }[]>([]);

  const ask = (text: string) => {
    const prompt = text.trim();
    if (!prompt) return;
    const id = Date.now().toString(36);
    setLog((prev) => [
      ...prev,
      { id: `${id}-u`, role: 'user', text: prompt },
      { id: `${id}-i`, role: 'iris', text: 'I’m reviewing the documents in this agreement space and will pull together an answer.' },
    ]);
    setDraft('');
  };

  const suggestions: { label: string; icon: IconName }[] = [
    { label: 'Summarize key terms', icon: 'comment-plus' },
    { label: 'Counterparty brief', icon: 'building-person' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, fontFamily: FONT }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
          {log.length === 0 ? (
            <>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 500, lineHeight: 1.3, color: TEXT_DEFAULT }}>Jump back in</h3>
                <p style={{ margin: '4px 0 0', fontSize: 20, lineHeight: 1.4, color: TEXT_DEFAULT }}>Ask anything about your agreements</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => ask(s.label)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 15, color: TEXT_SECONDARY, textAlign: 'left' }}
                  >
                    <Icon name={s.icon} size={20} color={TEXT_SECONDARY} />
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            log.map((m) => (
              <div
                key={m.id}
                style={m.role === 'user'
                  ? { alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--ink-cobalt-10)', borderRadius: 16, padding: '10px 16px', fontSize: 15, lineHeight: 1.5, color: TEXT_DEFAULT }
                  : { display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.5, color: TEXT_DEFAULT }}
              >
                {m.role === 'iris' && <span style={{ flexShrink: 0 }}><IrisGlyph /></span>}
                <span>{m.text}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(draft); }}
        style={{ border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 12, padding: '16px 16px 12px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing(e)) {
              e.preventDefault();
              ask(draft);
            }
          }}
          rows={1}
          placeholder="Ask, @mention, or / for actions"
          aria-label="Ask Iris"
          style={{ resize: 'none', border: 'none', outline: 'none', background: 'transparent', fontFamily: FONT, fontSize: 16, lineHeight: 1.5, color: TEXT_DEFAULT }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" aria-label="Add attachment" style={{ width: 32, height: 32, marginLeft: -8, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={20} color={TEXT_DEFAULT} />
          </button>
          <button type="submit" aria-label="Send to Iris" style={{ width: 36, height: 36, borderRadius: 6, border: 'none', background: 'var(--ink-cobalt-100)', color: 'var(--ink-white-100)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-up" size={20} color="currentColor" />
          </button>
        </div>
      </form>
    </div>
  );
}

function nowStamp() {
  const d = new Date();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `${time}, ${date}`;
}

// Interleave people's messages with system events so the default feed reads as one mixed timeline.
function buildBaseFeed(activity: SidePanelActivityItem[], conversations: SidePanelConversation[]): FeedEntry[] {
  const messages: FeedEntry[] = [
    ...conversations.map((c): FeedEntry => ({
      kind: 'message', id: `conv-${c.name}`, name: c.name, initials: c.initials, colorIndex: c.colorIndex,
      text: c.preview, time: c.date, conversation: c.name,
    })),
    ...activity.filter(isMessageEvent).map((a): FeedEntry => ({
      kind: 'message', id: `act-${a.id}`, name: a.user, initials: initialsOf(a.user), colorIndex: colorFor(a.user),
      text: a.action.charAt(0).toUpperCase() + a.action.slice(1), time: a.time,
      conversation: conversations.find((c) => c.name === a.conversation || c.name === a.user)?.name,
    })),
  ];
  const events: FeedEntry[] = activity
    .filter((a) => !isMessageEvent(a))
    .map((a) => ({ kind: 'event', id: a.id, icon: a.icon, user: a.user, action: a.action, time: a.time }));

  const mixed: FeedEntry[] = [];
  const longest = Math.max(messages.length, events.length);
  for (let i = 0; i < longest; i++) {
    if (messages[i]) mixed.push(messages[i]);
    if (events[i]) mixed.push(events[i]);
  }
  return mixed;
}

const IRIS: Mentionable = { name: 'Iris', initials: 'IR', colorIndex: 0, isIris: true };

export function SpaceSidePanel({ activity, conversations, style, fitToViewport }: SpaceSidePanelProps) {
  const [view, setView] = useState<PanelView>('all');
  const [openThread, setOpenThread] = useState<{ key: string; conversation: SidePanelConversation } | null>(null);
  const [replies, setReplies] = useState<Record<string, ThreadMessage[]>>({});
  const [posted, setPosted] = useState<FeedEntry[]>([]);
  const [replyTo, setReplyTo] = useState<QuotedEvent | null>(null);
  const feedScrollRef = useRef<HTMLDivElement>(null);
  const irisTimers = useRef<number[]>([]);

  useEffect(() => () => irisTimers.current.forEach((t) => window.clearTimeout(t)), []);

  const activeConversation = openThread?.conversation ?? null;

  const openMessage = (entry: Extract<FeedEntry, { kind: 'message' }>) => {
    const existing = entry.conversation ? conversations.find((c) => c.name === entry.conversation) : undefined;
    setOpenThread({
      key: existing?.name ?? entry.id,
      conversation: existing ?? {
        name: entry.name, initials: entry.initials, colorIndex: entry.colorIndex,
        preview: entry.text, date: entry.time, receivedAt: entry.time,
      },
    });
  };
  const inThread = view !== 'iris' && activeConversation !== null;

  const mentionables = useMemo<Mentionable[]>(() => {
    const seen = new Set<string>();
    const people: Mentionable[] = [];
    const add = (name: string, initials?: string, colorIndex?: ColorIndex) => {
      if (!name || seen.has(name) || name === 'You' || name === 'System' || /agent/i.test(name)) return;
      seen.add(name);
      people.push({ name, initials: initials ?? initialsOf(name), colorIndex: colorIndex ?? colorFor(name) });
    };
    conversations.forEach((c) => add(c.name, c.initials, c.colorIndex));
    activity.forEach((a) => add(a.user));
    return [IRIS, ...people];
  }, [activity, conversations]);
  const mentionNames = useMemo(() => mentionables.map((m) => m.name), [mentionables]);

  const baseFeed = useMemo(() => buildBaseFeed(activity, conversations), [activity, conversations]);
  const feed = useMemo(() => {
    const all = [...posted, ...baseFeed];
    if (view === 'activity') return all.filter((e) => e.kind === 'event');
    if (view === 'messages') return all.filter((e) => e.kind === 'message');
    return all;
  }, [posted, baseFeed, view]);

  const changeView = (next: PanelView) => {
    setView(next);
    setOpenThread(null);
  };

  const sendThreadReply = (text: string) => {
    if (!openThread) return;
    const { key } = openThread;
    setReplies((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), { id: `${Date.now()}`, fromMe: true, text, time: nowStamp() }],
    }));
  };

  const postMessage = (text: string) => {
    const stamp = Date.now();
    const quote = replyTo ?? undefined;
    setPosted((prev) => [
      { kind: 'message', id: `me-${stamp}`, name: 'You', initials: 'YO', colorIndex: 5, text, time: 'Just now', quote },
      ...prev,
    ]);
    setReplyTo(null);
    if (view === 'activity') setView('all');
    feedScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    if (/(^|\s)@Iris\b/.test(text)) {
      const timer = window.setTimeout(() => {
        setPosted((prev) => [
          {
            kind: 'message', id: `iris-${stamp}`, name: 'Iris', initials: 'IR', colorIndex: 0, isIris: true, time: 'Just now',
            text: quote
              ? `I’m looking into “${quote.title}” now and will summarize what changed and what’s still outstanding.`
              : 'I’m reviewing the documents in this agreement space and will pull together an answer.',
          },
          ...prev,
        ]);
      }, 900);
      irisTimers.current.push(timer);
    }
  };

  const startReply = (entry: FeedEntry) => {
    setReplyTo(
      entry.kind === 'event'
        ? { id: entry.id, icon: entry.icon, title: eventTitle(entry), time: entry.time }
        : { id: entry.id, icon: 'comment' as IconName, title: `${entry.name}: ${entry.text}`, time: entry.time },
    );
  };

  const asideRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!fitToViewport) return;
    const el = asideRef.current;
    if (!el) return;
    let frame = 0;
    // Sticky top:0 means the panel's top is max(0, distance to viewport top); fill the rest of the viewport below it.
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const parentTop = el.parentElement?.getBoundingClientRect().top ?? 0;
        el.style.height = `${Math.max(320, window.innerHeight - Math.max(0, parentTop))}px`;
      });
    };
    fit();
    window.addEventListener('scroll', fit, { capture: true, passive: true });
    window.addEventListener('resize', fit);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', fit, { capture: true });
      window.removeEventListener('resize', fit);
    };
  }, [fitToViewport]);

  const title = inThread ? TITLES.messages : TITLES[view];

  return (
    <aside
      ref={asideRef}
      aria-label={title}
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--ink-white-100)',
        borderLeft: `1px solid ${BORDER_SUBTLE}`,
        boxSizing: 'border-box',
        fontFamily: FONT,
        ...style,
      }}
    >
      <header
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 52,
          padding: '0 24px',
          boxSizing: 'border-box',
          borderBottom: inThread ? `1px solid ${BORDER_SUBTLE}` : '1px solid transparent',
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 'var(--ink-font-weight-medium)' as CSSProperties['fontWeight'], color: 'var(--ink-cobalt-140)' }}>{title}</h2>
        <ViewToggles active={view} onChange={changeView} />
      </header>

      <div
        style={{
          flex: 1, minHeight: 0,
          padding: inThread || view === 'iris' ? '0 24px 24px' : '8px 24px 24px',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {view === 'iris' ? (
          <IrisChat />
        ) : openThread ? (
          <MessageThread
            conversation={openThread.conversation}
            replies={replies[openThread.key] ?? []}
            onBack={() => setOpenThread(null)}
            onSend={sendThreadReply}
          />
        ) : (
          <>
            <div ref={feedScrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 16 }}>
              <Feed
                entries={feed}
                view={view}
                mentionNames={mentionNames}
                onOpenMessage={openMessage}
                onReply={startReply}
              />
            </div>
            <FeedComposer
              mentionables={mentionables}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
              onSend={postMessage}
            />
          </>
        )}
      </div>
    </aside>
  );
}
