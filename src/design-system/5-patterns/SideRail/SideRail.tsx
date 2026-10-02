import React, { useState } from 'react';
import styles from './SideRail.module.css';
import { Icon } from '../../3-primitives/Icon';
import type { IconName } from '../../3-primitives/Icon';
import { Avatar } from '../../3-primitives/Avatar';

export interface SideRailItem {
  /** Unique id (also exposed as data-item-id / data-nav-id for callouts) */
  id: string;
  /** Visible label */
  label: string;
  /** Named Ink icon shown on the left (top-level rows only) */
  icon?: IconName;
  /** Custom icon node — takes precedence over `icon` */
  customIcon?: React.ReactNode;
  /** Whether this item is the current selection */
  active?: boolean;
  /** Show a trailing overflow (…) affordance */
  onMoreClick?: () => void;
  /** Click handler for the row itself */
  onClick?: () => void;
  /** Nested items. When present, a chevron is shown and the row expands/collapses. */
  children?: SideRailItem[];
  /** Start expanded (only relevant when `children` is set) */
  defaultExpanded?: boolean;
}

export interface SideRailProps {
  /** Called whenever the rail is collapsed/expanded, with the new collapsed state */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Start in the collapsed state */
  defaultCollapsed?: boolean;
  /** Primary navigation items */
  items: SideRailItem[];
  /** Signed-in user shown in the rail footer */
  user?: { name: string; email?: string; avatar?: string };
  /** Footer avatar click handler */
  onUserClick?: () => void;
  /** Additional className */
  className?: string;
}

const PanelToggleIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2.75" y="2.75" width="14.5" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <line x1="7" y1="3" x2="7" y2="17" stroke="currentColor" strokeWidth="1.5" />
    <path
      d={collapsed ? 'M10.75 7.5L13.25 10l-2.5 2.5' : 'M13.25 7.5L10.75 10l2.5 2.5'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const containsActive = (item: SideRailItem): boolean =>
  !!item.children?.some((c) => c.active || containsActive(c));

interface RailRowProps {
  item: SideRailItem;
  depth: number;
}

const RailRow: React.FC<RailRowProps> = ({ item, depth }) => {
  const hasChildren = !!item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(!!item.defaultExpanded || containsActive(item));

  // Rows that navigate leave expand/collapse to the chevron; rows without a destination toggle on click.
  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (hasChildren) setExpanded((v) => !v);
  };

  const rowClasses = [
    styles.row,
    depth > 0 ? styles.rowNested : '',
    depth > 1 ? styles.rowDeep : '',
    item.active ? styles.rowActive : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={styles.rowWrapper}>
      <div className={rowClasses}>
        <button
          type="button"
          className={styles.rowMain}
          onClick={handleClick}
          data-item-id={item.id}
          data-nav-id={item.id}
          aria-current={item.active ? 'page' : undefined}
          aria-expanded={hasChildren ? expanded : undefined}
        >
          {depth === 0 && (
            <span className={styles.iconSlot}>
              {item.customIcon ?? (item.icon ? <Icon name={item.icon} size={24} className={styles.icon} /> : null)}
            </span>
          )}
          <span className={styles.label}>{item.label}</span>
        </button>
        {item.onMoreClick && (
          <button
            type="button"
            className={styles.trailingButton}
            onClick={item.onMoreClick}
            aria-label={`${item.label} options`}
          >
            <Icon name="overflow-horizontal" size={20} />
          </button>
        )}
        {hasChildren && (
          <button
            type="button"
            className={styles.trailingButton}
            onClick={() => setExpanded((v) => !v)}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.label}`}
            aria-expanded={expanded}
          >
            <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className={styles.subList}>
          {item.children!.map((child) => (
            <RailRow key={child.id} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * SideRail — Docusign dark left navigation rail.
 *
 * Top-level rows show an icon + label; rows with children expand in place with
 * a chevron. A floating toggle on the rail's right edge collapses the rail to a
 * thin strip.
 */
export const SideRail: React.FC<SideRailProps> = ({
  onToggleCollapse,
  defaultCollapsed = false,
  items,
  user,
  onUserClick,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      onToggleCollapse?.(next);
      return next;
    });
  };

  const userInitials = user
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
    : '';

  return (
    <div
      data-ink-component="SideRail"
      className={[styles.root, collapsed ? styles.rootCollapsed : '', className].filter(Boolean).join(' ')}
    >
      {!collapsed && (
        <nav className={styles.rail} aria-label="Primary">
          <ul className={styles.list}>
            {items.map((item) => (
              <RailRow key={item.id} item={item} depth={0} />
            ))}
          </ul>

          {user && (
            <div className={styles.footer}>
              <button type="button" data-user-menu-trigger className={styles.userButton} onClick={onUserClick}>
                <Avatar initials={userInitials} src={user.avatar} size="small" colorIndex={4} />
                <span className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  {user.email && <span className={styles.userEmail}>{user.email}</span>}
                </span>
              </button>
            </div>
          )}
        </nav>
      )}

      <button
        type="button"
        className={styles.toggle}
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        aria-expanded={!collapsed}
      >
        <PanelToggleIcon collapsed={collapsed} />
      </button>
    </div>
  );
};

SideRail.displayName = 'SideRail';
