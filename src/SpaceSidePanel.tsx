import React, { useState, useRef, useEffect, type CSSProperties, type KeyboardEvent } from 'react';
import { Avatar, Icon } from '@/design-system';
import type { IconName } from '@/design-system/3-primitives/Icon/Icon';

export type SidePanelTab = 'activity' | 'messages' | 'iris';

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
  colorIndex: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
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

interface SpaceSidePanelProps {
  activity: SidePanelActivityItem[];
  conversations: SidePanelConversation[];
  style?: CSSProperties;
}

const TITLES: Record<SidePanelTab, string> = {
  activity: 'Activity Feed',
  messages: 'Messages',
  iris: 'Iris Chat',
};

const FONT = 'var(--ink-font-family-default)';
const TEXT_DEFAULT = 'var(--ink-font-color-default)';
const TEXT_SECONDARY = 'var(--ink-font-color-secondary)';
const BORDER_SUBTLE = 'var(--ink-border-color-subtle, var(--ink-border-subtle))';
const CIRCLE_BG = 'var(--ink-neutral-20)';

const isComposing = (e: KeyboardEvent) => e.nativeEvent.isComposing || e.keyCode === 229;

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

function IrisGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
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

const TAB_ICONS: Record<SidePanelTab, () => React.JSX.Element> = {
  activity: ActivityGlyph,
  messages: MessagesGlyph,
  iris: IrisGlyph,
};

function PanelTabs({ active, onChange }: { active: SidePanelTab; onChange: (tab: SidePanelTab) => void }) {
  return (
    <div role="tablist" aria-label="Side panel" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {(Object.keys(TAB_ICONS) as SidePanelTab[]).map((tab) => {
        const Glyph = TAB_ICONS[tab];
        const selected = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={TITLES[tab]}
            onClick={() => onChange(tab)}
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

function ActivityFeed({ items, onOpenMessage }: { items: SidePanelActivityItem[]; onOpenMessage?: (item: SidePanelActivityItem) => void }) {
  if (items.length === 0) {
    return <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: TEXT_SECONDARY }}>No activity yet.</p>;
  }
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <li key={item.id} style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <IconCircle>
                <Icon name={item.icon} size={16} color={TEXT_SECONDARY} />
              </IconCircle>
              {!isLast && <span aria-hidden="true" style={{ flex: 1, width: 1, minHeight: 16, background: BORDER_SUBTLE }} />}
            </div>
            {(() => {
              const clickable = !!onOpenMessage && isMessageEvent(item);
              const content = (
                <>
                  <p style={{ margin: 0, fontSize: 'var(--ink-font-element-label-emphasis-size)', lineHeight: 'var(--ink-font-element-label-emphasis-line-height)', fontWeight: 500, color: TEXT_DEFAULT }}>
                    <strong style={{ fontWeight: 600 }}>{item.user}</strong> {item.action}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 'var(--ink-font-detail-s-size)', lineHeight: 'var(--ink-font-detail-s-line-height)', color: TEXT_SECONDARY }}>{item.time}</p>
                </>
              );
              const boxStyle: CSSProperties = { flex: 1, minWidth: 0, paddingTop: 10, paddingBottom: isLast ? 0 : 16, fontFamily: FONT };
              return clickable ? (
                <button
                  type="button"
                  onClick={() => onOpenMessage!(item)}
                  aria-label={`${item.user} ${item.action}. Open message`}
                  style={{ ...boxStyle, display: 'block', textAlign: 'left', background: 'none', border: 'none', paddingLeft: 0, paddingRight: 0, cursor: 'pointer' }}
                >
                  {content}
                </button>
              ) : (
                <div style={boxStyle}>{content}</div>
              );
            })()}
          </li>
        );
      })}
    </ol>
  );
}

function NewMessageButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 16, color: TEXT_DEFAULT, textAlign: 'left' }}
    >
      <IconCircle>
        <Icon name="plus" size={20} color={TEXT_DEFAULT} />
      </IconCircle>
      New message
    </button>
  );
}

function MessageList({
  conversations,
  onOpen,
  onNewMessage,
}: {
  conversations: SidePanelConversation[];
  onOpen: (name: string) => void;
  onNewMessage: () => void;
}) {
  const [query, setQuery] = useState('');

  if (conversations.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: TEXT_DEFAULT, fontFamily: FONT }}>
          Send messages to anyone in this agreement space. You have no messages yet.
        </p>
        <NewMessageButton onClick={onNewMessage} />
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? conversations.filter((c) => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))
    : conversations;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, padding: '0 16px', border: `1px solid ${BORDER_SUBTLE}`, borderRadius: 999 }}>
        <Icon name="search" size={20} color={TEXT_SECONDARY} />
        <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Search messages</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages"
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: FONT, fontSize: 16, color: TEXT_DEFAULT }}
        />
      </label>

      <NewMessageButton onClick={onNewMessage} />

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map((c) => (
          <li key={c.name}>
            <button
              type="button"
              onClick={() => onOpen(c.name)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 16, width: '100%', padding: 0, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: FONT }}
            >
              <Avatar initials={c.initials} size="medium" colorIndex={c.colorIndex} />
              <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 16, lineHeight: 1.5, color: TEXT_DEFAULT }}>{c.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: TEXT_SECONDARY, flexShrink: 0 }}>{c.date}</span>
                </span>
                <span
                  style={{
                    fontSize: 16, lineHeight: 1.5, color: TEXT_SECONDARY,
                    fontStyle: c.preview ? 'normal' : 'italic',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}
                >
                  {c.preview || 'No messages'}
                </span>
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ fontSize: 14, color: TEXT_SECONDARY }}>No conversations match your search.</li>
        )}
      </ul>
    </div>
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
        <button type="button" onClick={onBack} aria-label="Back to messages" style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginLeft: -4 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1, background: 'var(--ink-cobalt-10)', borderRadius: 16, padding: '12px 20px', fontSize: 15, lineHeight: 1.5, color: TEXT_DEFAULT }}>
                  {conversation.preview.replace(/…$/, '')}
                </div>
                <button type="button" aria-label="Reply" style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}>
                  <Icon name="reply" size={18} color={TEXT_DEFAULT} />
                </button>
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

export function SpaceSidePanel({ activity, conversations, style }: SpaceSidePanelProps) {
  const [tab, setTab] = useState<SidePanelTab>('activity');
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [draftThread, setDraftThread] = useState(false);
  const [replies, setReplies] = useState<Record<string, ThreadMessage[]>>({});

  const activeConversation = conversations.find((c) => c.name === openThread) ?? null;
  const inThread = tab === 'messages' && activeConversation !== null;

  const changeTab = (next: SidePanelTab) => {
    setTab(next);
    if (next !== 'messages') setOpenThread(null);
  };

  const sendReply = (text: string) => {
    if (!openThread) return;
    setReplies((prev) => ({
      ...prev,
      [openThread]: [...(prev[openThread] ?? []), { id: `${Date.now()}`, fromMe: true, text, time: nowStamp() }],
    }));
  };

  const openFromActivity = (item: SidePanelActivityItem) => {
    const match = conversations.find((c) => c.name === item.conversation || c.name === item.user) ?? conversations[0];
    if (!match) return;
    setDraftThread(false);
    setTab('messages');
    setOpenThread(match.name);
  };

  const startNewMessage = () => {
    if (conversations.length > 0) {
      setOpenThread(conversations[0].name);
    } else {
      setDraftThread(true);
    }
  };

  return (
    <aside
      aria-label={TITLES[tab]}
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
        <h2 style={{ margin: 0, fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 'var(--ink-font-weight-medium)' as CSSProperties['fontWeight'], color: 'var(--ink-cobalt-140)' }}>{TITLES[tab]}</h2>
        <PanelTabs active={tab} onChange={changeTab} />
      </header>

      <div
        role="tabpanel"
        style={{
          flex: 1, minHeight: 0,
          padding: inThread ? '0 24px 24px' : tab === 'iris' ? '0 24px 24px' : '8px 24px 24px',
          overflowY: inThread || tab === 'iris' ? 'hidden' : 'auto',
          ...(tab === 'activity'
            ? { maskImage: 'linear-gradient(to bottom, #000 85%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, #000 85%, transparent)' }
            : {}),
        }}
      >
        {tab === 'activity' && (
          <ActivityFeed items={activity} onOpenMessage={conversations.length > 0 ? openFromActivity : undefined} />
        )}

        {tab === 'messages' && (activeConversation ? (
          <MessageThread
            conversation={activeConversation}
            replies={replies[activeConversation.name] ?? []}
            onBack={() => setOpenThread(null)}
            onSend={sendReply}
          />
        ) : draftThread ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button type="button" onClick={() => setDraftThread(false)} aria-label="Back to messages" style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginLeft: -4 }}>
                <Icon name="arrow-left" size={20} color={TEXT_DEFAULT} />
              </button>
              <span style={{ fontSize: 16, fontWeight: 500, color: TEXT_DEFAULT }}>New message</span>
            </div>
            <div style={{ flex: 1 }} />
            <PillComposer placeholder="Send message..." onSend={() => setDraftThread(false)} />
          </div>
        ) : (
          <MessageList conversations={conversations} onOpen={setOpenThread} onNewMessage={startNewMessage} />
        ))}

        {tab === 'iris' && <IrisChat />}
      </div>
    </aside>
  );
}
