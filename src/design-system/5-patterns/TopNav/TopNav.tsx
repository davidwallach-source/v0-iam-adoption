import React, { useEffect, useRef, useState } from 'react';
import styles from './TopNav.module.css';
import { Icon } from '../../3-primitives/Icon';

export interface TopNavMenuItem {
  id: string;
  label: string;
  onClick: () => void;
  dividerAfter?: boolean;
}

export interface TopNavProps {
  logo: React.ReactNode;
  onLogoMenuClick?: () => void;
  startLabel?: string;
  startMenuItems?: TopNavMenuItem[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  hasNotifications?: boolean;
  onNotificationsClick?: () => void;
  irisLabel?: string;
  irisIcon?: React.ReactNode;
  onIrisClick?: () => void;
  className?: string;
}

/**
 * TopNav — full-width dark app header with the brand, a Start menu, a
 * centered global search, notifications, and the Ask Iris CTA.
 */
export const TopNav: React.FC<TopNavProps> = ({
  logo,
  onLogoMenuClick,
  startLabel = 'Start',
  startMenuItems = [],
  searchPlaceholder = 'Search agreements, templates, people',
  onSearch,
  hasNotifications,
  onNotificationsClick,
  irisLabel = 'Ask Iris',
  irisIcon,
  onIrisClick,
  className,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const startRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointer = (e: MouseEvent) => {
      if (!startRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [menuOpen]);

  return (
    <header data-ink-component="TopNav" className={[styles.nav, className].filter(Boolean).join(' ')}>
      <div className={styles.left}>
        <button type="button" className={styles.brand} onClick={onLogoMenuClick} aria-label="Switch app" data-nav-id="app-switcher">
          <span className={styles.logo}>{logo}</span>
          <Icon name="chevron-down" size={16} className={styles.brandChevron} />
        </button>

        <div className={styles.startWrap} ref={startRef}>
          <button
            type="button"
            className={styles.start}
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            {startLabel}
            <Icon name="chevron-down" size={16} />
          </button>
          {menuOpen && startMenuItems.length > 0 && (
            <div className={styles.menu} role="menu" aria-label={startLabel}>
              {startMenuItems.map((item) => (
                <React.Fragment key={item.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={styles.menuItem}
                    onClick={() => {
                      setMenuOpen(false);
                      item.onClick();
                    }}
                  >
                    {item.label}
                  </button>
                  {item.dividerAfter && <hr className={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      <form
        role="search"
        className={styles.search}
        onSubmit={(e) => {
          e.preventDefault();
          onSearch?.(query.trim());
        }}
      >
        <Icon name="search" size={18} className={styles.searchIcon} />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
          className={styles.searchInput}
        />
        <kbd className={styles.kbd}>⌘K</kbd>
      </form>

      <div className={styles.right}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onNotificationsClick}
          aria-label={hasNotifications ? 'Notifications, unread' : 'Notifications'}
          data-nav-id="notifications"
        >
          <Icon name="bell" size={22} />
          {hasNotifications && <span className={styles.dot} aria-hidden="true" />}
        </button>
        <button type="button" className={styles.iris} onClick={onIrisClick} data-nav-id="iris">
          {irisLabel}
          {irisIcon && <span className={styles.irisIcon}>{irisIcon}</span>}
        </button>
      </div>
    </header>
  );
};

TopNav.displayName = 'TopNav';
