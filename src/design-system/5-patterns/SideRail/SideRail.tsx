import React, { useState } from 'react';
import styles from './SideRail.module.css';
import { Icon } from '../../3-primitives/Icon';
import type { IconName } from '../../3-primitives/Icon';

export interface SideRailItem {
  /** Unique id (also exposed as data-item-id / data-nav-id for callouts) */
  id: string;
  /** Visible label */
  label: string;
  /** Named Ink icon shown on the left */
  icon?: IconName;
  /** Custom icon node (e.g. the colorful Iris mark) — takes precedence over `icon` */
  customIcon?: React.ReactNode;
  /** Whether this item is the current selection */
  active?: boolean;
  /** Render the label in a de-emphasized color (e.g. the "6 more" row) */
  muted?: boolean;
  /** Click handler for the row itself */
  onClick?: () => void;
  /** Nested items. When present, a chevron is shown and the row expands/collapses. */
  children?: SideRailItem[];
  /** Start expanded (only relevant when `children` is set) */
  defaultExpanded?: boolean;
}

export interface SideRailProps {
  /** Brand logo node, rendered top-left */
  logo: React.ReactNode;
  /** Collapse/expand toggle handler (panel icon, top-right) */
  onToggleCollapse?: () => void;
  /** Label for the primary Create CTA */
  createLabel?: string;
  /** Create CTA click handler */
  onCreateClick?: () => void;
  /** Primary navigation items */
  items: SideRailItem[];
  /** Additional className */
  className?: string;
}

/** Panel / collapse-rail glyph shown in the top-right of the rail header. */
const PanelIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2.25" y="3.25" width="15.5" height="13.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
    <line x1="7.5" y1="3.75" x2="7.5" y2="16.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const RailRow: React.FC<{ item: SideRailItem; nested?: boolean }> = ({ item, nested }) => {
  const hasChildren = !!item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(!!item.defaultExpanded);

  const rowClasses = [
    styles.row,
    nested ? styles.rowNested : '',
    item.active ? styles.rowActive : '',
    item.muted ? styles.rowMuted : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (hasChildren) setExpanded((v) => !v);
    item.onClick?.();
  };

  return (
    <li className={styles.rowWrapper}>
      <button
        type="button"
        className={rowClasses}
        onClick={handleClick}
        data-item-id={item.id}
        data-nav-id={item.id}
        aria-current={item.active ? 'page' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <span className={styles.rowLeading}>
          {item.customIcon ? (
            <span className={styles.customIcon}>{item.customIcon}</span>
          ) : item.icon ? (
            <Icon name={item.icon} size={24} className={styles.icon} />
          ) : (
            <span className={styles.iconPlaceholder} aria-hidden="true" />
          )}
          <span className={styles.label}>{item.label}</span>
        </span>
        {hasChildren && (
          <Icon
            name="chevron-right"
            size={20}
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
          />
        )}
      </button>

      {hasChildren && expanded && (
        <ul className={styles.subList}>
          {item.children!.map((child) => (
            <RailRow key={child.id} item={child} nested />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * SideRail — DocuSign duotone left navigation rail.
 *
 * A full-height dark rail containing the brand logo with a collapse toggle,
 * a prominent Create CTA, and the primary navigation. Items can nest one level
 * deep (shown with a chevron that expands in place).
 */
export const SideRail: React.FC<SideRailProps> = ({
  logo,
  onToggleCollapse,
  createLabel = 'Create',
  onCreateClick,
  items,
  className,
}) => {
  const railClasses = [styles.rail, className].filter(Boolean).join(' ');

  return (
    <nav data-ink-component="SideRail" className={railClasses} aria-label="Primary">
      <div className={styles.header}>
        <span className={styles.logo}>{logo}</span>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.toggle}
            onClick={onToggleCollapse}
            aria-label="Collapse navigation"
          >
            <PanelIcon />
          </button>
        )}
      </div>

      <button type="button" className={styles.createButton} onClick={onCreateClick}>
        <Icon name="plus" size={24} className={styles.createIcon} />
        <span>{createLabel}</span>
      </button>

      <ul className={styles.list}>
        {items.map((item) => (
          <RailRow key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};

SideRail.displayName = 'SideRail';
