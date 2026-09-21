import React, { useCallback, useRef, useState } from 'react';
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
  /** Called whenever the rail is collapsed/expanded, with the new collapsed state */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Start in the collapsed (icon-only) state */
  defaultCollapsed?: boolean;
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

interface FlyoutState {
  item: SideRailItem;
  top: number;
  left: number;
}

interface RailRowProps {
  item: SideRailItem;
  nested?: boolean;
  collapsed: boolean;
  onRowEnter: (item: SideRailItem, el: HTMLElement | null) => void;
  onRowLeave: () => void;
}

const RailRow: React.FC<RailRowProps> = ({ item, nested, collapsed, onRowEnter, onRowLeave }) => {
  const hasChildren = !!item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(!!item.defaultExpanded);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const rowClasses = [
    styles.row,
    nested ? styles.rowNested : '',
    item.active ? styles.rowActive : '',
    item.muted ? styles.rowMuted : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (!collapsed && hasChildren) setExpanded((v) => !v);
    item.onClick?.();
  };

  const renderIcon = () =>
    item.customIcon ? (
      <span className={styles.customIcon}>{item.customIcon}</span>
    ) : item.icon ? (
      <Icon name={item.icon} size={24} className={styles.icon} />
    ) : (
      <span className={styles.iconPlaceholder} aria-hidden="true" />
    );

  return (
    <li
      className={styles.rowWrapper}
      onMouseEnter={collapsed ? () => onRowEnter(item, buttonRef.current) : undefined}
      onMouseLeave={collapsed ? onRowLeave : undefined}
    >
      <button
        ref={buttonRef}
        type="button"
        className={rowClasses}
        onClick={handleClick}
        data-item-id={item.id}
        data-nav-id={item.id}
        aria-current={item.active ? 'page' : undefined}
        aria-expanded={!collapsed && hasChildren ? expanded : undefined}
        aria-label={collapsed ? item.label : undefined}
        title={collapsed ? item.label : undefined}
      >
        <span className={styles.rowLeading}>
          {renderIcon()}
          {!collapsed && <span className={styles.label}>{item.label}</span>}
        </span>
        {!collapsed && hasChildren && (
          <Icon
            name="chevron-right"
            size={20}
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
          />
        )}
      </button>

      {!collapsed && hasChildren && expanded && (
        <ul className={styles.subList}>
          {item.children!.map((child) => (
            <RailRow
              key={child.id}
              item={child}
              nested
              collapsed={collapsed}
              onRowEnter={onRowEnter}
              onRowLeave={onRowLeave}
            />
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
 *
 * The panel toggle collapses the rail to an icon-only strip. While collapsed,
 * hovering an item reveals a light flyout with the item's label and any nested
 * items.
 */
export const SideRail: React.FC<SideRailProps> = ({
  logo,
  onToggleCollapse,
  defaultCollapsed = false,
  createLabel = 'Create',
  onCreateClick,
  items,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [flyout, setFlyout] = useState<FlyoutState | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const railClasses = [styles.rail, collapsed ? styles.railCollapsed : '', className]
    .filter(Boolean)
    .join(' ');

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setFlyout(null), 120);
  }, [cancelClose]);

  const handleRowEnter = useCallback(
    (item: SideRailItem, el: HTMLElement | null) => {
      cancelClose();
      if (!el || !navRef.current) return;
      const rowRect = el.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      setFlyout({ item, top: rowRect.top, left: navRect.right });
    },
    [cancelClose],
  );

  const toggleCollapsed = () => {
    setFlyout(null);
    setCollapsed((prev) => {
      const next = !prev;
      onToggleCollapse?.(next);
      return next;
    });
  };

  const flyoutHasChildren = !!flyout?.item.children && flyout.item.children.length > 0;

  return (
    <nav ref={navRef} data-ink-component="SideRail" className={railClasses} aria-label="Primary">
      <div className={styles.header}>
        {!collapsed && <span className={styles.logo}>{logo}</span>}
        <button
          type="button"
          className={styles.toggle}
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-pressed={collapsed}
        >
          <PanelIcon />
        </button>
      </div>

      <button
        type="button"
        className={styles.createButton}
        onClick={onCreateClick}
        aria-label={collapsed ? createLabel : undefined}
        title={collapsed ? createLabel : undefined}
      >
        <Icon name="plus" size={24} className={styles.createIcon} />
        {!collapsed && <span className={styles.createLabel}>{createLabel}</span>}
      </button>

      <ul className={styles.list}>
        {items.map((item) => (
          <RailRow
            key={item.id}
            item={item}
            collapsed={collapsed}
            onRowEnter={handleRowEnter}
            onRowLeave={scheduleClose}
          />
        ))}
      </ul>

      {collapsed && flyout && (
        <div
          className={styles.flyout}
          style={{ top: flyout.top, left: flyout.left }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          role="menu"
        >
          {flyoutHasChildren ? (
            <>
              <div className={styles.flyoutTitle}>{flyout.item.label}</div>
              {flyout.item.children!.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  role="menuitem"
                  className={`${styles.flyoutLink} ${child.muted ? styles.flyoutLinkMuted : ''}`}
                  onClick={() => {
                    child.onClick?.();
                    setFlyout(null);
                  }}
                >
                  {child.label}
                </button>
              ))}
            </>
          ) : (
            <button
              type="button"
              role="menuitem"
              className={styles.flyoutTitleButton}
              onClick={() => {
                flyout.item.onClick?.();
                setFlyout(null);
              }}
            >
              {flyout.item.label}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

SideRail.displayName = 'SideRail';
