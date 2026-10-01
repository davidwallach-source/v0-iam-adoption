import React from 'react';
import styles from './DocuSignShell.module.css';
import { GlobalNav } from '../../5-patterns/GlobalNav';
import type { GlobalNavProps } from '../../5-patterns/GlobalNav';
import { LocalNav } from '../../5-patterns/LocalNav';
import type { LocalNavProps } from '../../5-patterns/LocalNav';
import { SideRail } from '../../5-patterns/SideRail';
import type { SideRailProps } from '../../5-patterns/SideRail';
import { TopNav } from '../../5-patterns/TopNav';
import type { TopNavProps } from '../../5-patterns/TopNav';

export interface DocuSignShellProps {
  /**
   * SideRail configuration. When provided, the primary navigation is rendered
   * as a full-height left rail (replacing the top GlobalNav).
   */
  sideRail?: Omit<SideRailProps, 'className'>;

  /** Full-width top header rendered above the side rail layout */
  topNav?: Omit<TopNavProps, 'className'>;

  /** GlobalNav configuration (used when `sideRail` is not provided) */
  globalNav?: Omit<GlobalNavProps, 'className'>;

  /** LocalNav configuration (optional - some pages don't have sidebar) */
  localNav?: Omit<LocalNavProps, 'className'>;

  /** Main content */
  children: React.ReactNode;

  /** Additional className for the shell container */
  className?: string;
}

/**
 * DocuSignShell - Application shell layout
 *
 * Provides the standard DocuSign application layout with:
 * - GlobalNav (header) - always present
 * - LocalNav (sidebar) - optional, based on top-level navigation
 * - Main content area
 *
 * @example
 * // With sidebar
 * <DocuSignShell
 *   globalNav={{ logo: <Logo />, navItems: [...] }}
 *   localNav={{ sections: [...] }}
 * >
 *   <PageContent />
 * </DocuSignShell>
 *
 * @example
 * // Without sidebar (e.g., settings page)
 * <DocuSignShell globalNav={{ logo: <Logo />, navItems: [...] }}>
 *   <SettingsContent />
 * </DocuSignShell>
 */
export const DocuSignShell: React.FC<DocuSignShellProps> = ({
  sideRail,
  topNav,
  globalNav,
  localNav,
  children,
  className,
}) => {
  const shellClasses = [styles.shell, className].filter(Boolean).join(' ');

  /* SideRail layout: full-height left rail as the primary navigation. */
  if (sideRail) {
    return (
      <div data-ink-component="DocuSignShell" className={`${shellClasses} ${styles.shellDark}`}>
        {topNav && <TopNav {...topNav} />}
        <div className={styles.shellRail}>
          <aside className={styles.rail}>
            <SideRail {...sideRail} />
          </aside>

          <div className={styles.surface}>
            {localNav && (
              <aside className={styles.sidebar}>
                <LocalNav {...localNav} />
              </aside>
            )}
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-ink-component="DocuSignShell" className={shellClasses}>
      {/* Header - GlobalNav */}
      {globalNav && (
        <header className={styles.header}>
          <GlobalNav {...globalNav} />
        </header>
      )}

      {/* Body - Sidebar + Content */}
      <div className={styles.body}>
        {/* Sidebar - LocalNav (optional) */}
        {localNav && (
          <aside className={styles.sidebar}>
            <LocalNav {...localNav} />
          </aside>
        )}

        {/* Main Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

DocuSignShell.displayName = 'DocuSignShell';
