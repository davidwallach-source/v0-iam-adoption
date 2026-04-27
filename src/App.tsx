import { useState, useMemo, useCallback, useEffect, useRef, type CSSProperties } from 'react';
import {
  DocuSignShell,
  AgreementTableView,
  DataTable,
  PageHeader,
  FilterBar,
  Button,
  Banner,
  Badge,
  ComboButton,
  AIIcon,
  AIBadge,
  Accordion,
  Avatar,
  Divider,
  Input,
  IrisIcon,
  Icon,
  IconButton,
  Card,
  Stack,
  Grid,
  Inline,
  Container,
  Heading,
  Tabs,
  Text,
  Chip,
  StatusLight,
  Link,
  ProgressBar,
  SearchInput,
  Alert,
  AlertBadge,
  Modal,
  dataTableStyles,
} from '@/design-system';

/* ═══════════════════════════════════════
   StartNewModal Component
   ═══════════════════════════════════════ */

interface StartNewModalProps {
  open: boolean;
  onClose: () => void;
}

function StartNewModal({ open, onClose }: StartNewModalProps) {
  const [search, setSearch] = useState('');

  const agreements = [
    { id: 'blank', title: 'Start Blank', description: 'Create a new agreement from scratch.' },
    { id: 'nda', title: 'Instant NDA', description: 'Instantly generate an NDA and automatically send out for e-signature.' },
    { id: 'purchase', title: 'Purchase Request', description: 'Initiate a purchase with a new or existing vendor.' },
    { id: 'legal', title: 'New Request', description: 'Submit a request for help on agreements.' },
  ];

  return (
    <Modal open={open} onClose={onClose} size="full">
      {/* Lavender gradient top edge */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: 'linear-gradient(90deg, var(--ink-cobalt-fade-10) 0%, var(--ink-lavender-fade-20) 100%)',
        borderRadius: '16px 16px 0 0',
      }} />
      
      <div style={{ padding: '40px' }}>
        {/* Title - light weight */}
        <h2 style={{
          margin: '0 0 32px 0',
          fontSize: 28,
          fontWeight: 300,
          fontFamily: 'var(--ink-font-family)',
          color: '#130032',
        }}>Start New</h2>

        {/* Search bar - pill shaped with background */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          background: 'var(--ink-neutral-fade-5)',
          borderRadius: 999,
          marginBottom: 32,
        }}>
          <Icon name="search" size={18} color="var(--ink-neutral-60)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What would you like to do?"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: 14,
              fontFamily: 'var(--ink-font-family)',
              color: 'var(--ink-neutral-100)',
              outline: 'none',
            }}
          />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'var(--ink-neutral-fade-10)',
            borderRadius: 999,
          }}>
            <Icon name="ai-spark-filled" size={14} color="var(--ink-cobalt-100)" />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#130032' }}>AI-Assisted</span>
          </div>
        </div>

        {/* Agreements section */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            margin: '0 0 10px 0',
            fontSize: 20,
            fontWeight: 400,
            fontFamily: 'var(--ink-font-family)',
            color: '#130032',
          }}>Agreements</p>
          
          <div style={{
            display: 'flex',
            gap: 12,
          }}>
            {agreements.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 14px 14px 14px',
                  border: '1px solid var(--ink-neutral-fade-10)',
                  borderRadius: 8,
                  background: 'white',
                }}
              >
                {/* Card header with title and overflow menu */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--ink-font-family)',
                    color: '#130032',
                    lineHeight: 1.3,
                  }}>{item.title}</span>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--ink-neutral-60)',
                      marginTop: -2,
                    }}
                    aria-label="More options"
                  >
                    <Icon name="overflow-horizontal" size={18} />
                  </button>
                </div>
                
                {/* Description */}
                <p style={{
                  margin: '0 0 auto 0',
                  fontSize: 13,
                  fontFamily: 'var(--ink-font-family)',
                  color: '#130032',
                  lineHeight: 1.5,
                }}>{item.description}</p>
                
                {/* Start button */}
                <div style={{ marginTop: 12 }}>
                  <Button kind="secondary" size="small">Start</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}



const tableRowStaggerStyles = `
@keyframes inkRowEntrance {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply staggered entrance to DataTable body rows */
[data-ink-component="DataTable"] tbody tr {
  animation: inkRowEntrance 300ms cubic-bezier(0.33, 0, 0.67, 1) backwards;
}

/* Stagger rows — 20ms increments, capped at 10 rows (200ms) */
[data-ink-component="DataTable"] tbody tr:nth-child(1) { animation-delay: 0ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(2) { animation-delay: 20ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(3) { animation-delay: 40ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(4) { animation-delay: 60ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(5) { animation-delay: 80ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(6) { animation-delay: 100ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(7) { animation-delay: 120ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(8) { animation-delay: 140ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(9) { animation-delay: 160ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(10) { animation-delay: 180ms; }
[data-ink-component="DataTable"] tbody tr:nth-child(n+11) { animation-delay: 200ms; }

/* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
  [data-ink-component="DataTable"] tbody tr {
  animation: none;
  }
  }

  /* Hide Tasks column when table is too narrow */
  @media (max-width: 900px) {
  [data-ink-component="DataTable"] th.dt-col-hide-narrow,
  [data-ink-component="DataTable"] td.dt-col-hide-narrow {
  display: none;
  }
  }
  `;

/* ═══════════════════════════════════════
   Entrance Animation Hooks
   ═══════════════════════════════════════ */

/**
 * Hook for staggered entrance animations.
 * Returns a function that generates style props for each item.
 */
function useStaggerEntrance(itemCount: number, options?: {
  baseDelay?: number;
  staggerInterval?: number;
  duration?: number;
  distance?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const {
    baseDelay = 0,
    staggerInterval = 30,
    duration = 400,
    distance = 8,
  } = options || {};

  return (index: number) => ({
    style: {
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : `translateY(${distance}px)`,
      transition: `opacity ${duration}ms cubic-bezier(0.33, 0, 0.67, 1) ${baseDelay + index * staggerInterval}ms, transform ${duration}ms cubic-bezier(0.35, 0, 0.2, 1) ${baseDelay + index * staggerInterval}ms`,
    } as CSSProperties,
  });
}

/**
 * Hook for a simple fade-in on mount.
 */
function useFadeIn(delay: number = 0, duration: number = 300) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return {
    style: {
      opacity: mounted ? 1 : 0,
      transition: `opacity ${duration}ms cubic-bezier(0.33, 0, 0.67, 1) ${delay}ms`,
    } as CSSProperties,
  };
}

/**
 * Wrapper component that fades in its children.
 * Use key={someValue} on the component to re-trigger on changes.
 */
function FadeIn({ children, keyProp: _keyProp }: { children: React.ReactNode; keyProp: string }) {
  const fade = useFadeIn(0, 250);
  return <div {...fade}>{children}</div>;
}

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */

type TabId = 'home' | 'agreements' | 'templates' | 'insights' | 'admin';
type SidebarView = 'all-agreements' | 'drafts' | 'in-progress' | 'completed' | 'deleted' | 'parties' | 'requests';
type TemplatesSidebarView = 'my-templates' | 'shared-with-me' | 'favorites' | 'all-templates';
type InsightsSidebarView = 'overview' | 'dashboards' | 'reports';

/* ═══════════════════════════════════════
   Agreement Workspace Data (Sales Use Case)
   An Agreement Workspace is a dynamic package of 
   documents, data, and tasks required to execute 
   a specific transaction between parties.
   ═══════════════════════════════════════ */

interface Agreement {
  id: string;
  name: string;                    // Deal/Agreement name
  party: string;                   // Primary counterparty
  partyLogo?: string;              // Logo initials
  status: string;                  // Workflow status
  statusIcon: 'status-check' | 'status-void' | 'clock' | 'status-warn';
  statusKind: 'success' | 'warning' | 'info' | 'neutral';
  statusSub?: string;              // Status detail
  dealValue?: string;              // Deal value
  agreementType?: string;          // MSA, SOW, NDA, etc.
  termLength?: string;             // Contract term
  closeDate?: string;              // Expected close
  date: string;                    // Last activity date
  time: string;
  action: 'Copy' | 'Download' | 'Edit';
  documentsCount?: number;
  tasksCount?: number;
  tasksPending?: number;
}

const AGREEMENTS_DATA: Agreement[] = [
  // Draft - Agreements being prepared
  { id: '1', name: 'Apex Manufacturing MSA', party: 'Apex Manufacturing Co.', partyLogo: 'AM', status: 'Draft', statusIcon: 'clock', statusKind: 'neutral', statusSub: 'Preparing Documents', dealValue: '$1.8M', agreementType: 'Master Services Agreement', termLength: '36 months', closeDate: 'May 30, 2026', date: '27/4/2026', time: '09:15', action: 'Edit', documentsCount: 1, tasksCount: 8, tasksPending: 8 },
  { id: '2', name: 'Sterling Logistics NDA', party: 'Sterling Logistics', partyLogo: 'SL', status: 'Draft', statusIcon: 'clock', statusKind: 'neutral', statusSub: 'Internal Review', dealValue: '$0', agreementType: 'Non-Disclosure Agreement', termLength: '24 months', closeDate: 'May 5, 2026', date: '26/4/2026', time: '14:30', action: 'Edit', documentsCount: 1, tasksCount: 3, tasksPending: 3 },
  { id: '3', name: 'Horizon Cloud Services RFP', party: 'Horizon Cloud Inc.', partyLogo: 'HC', status: 'Draft', statusIcon: 'clock', statusKind: 'neutral', statusSub: 'Awaiting Approval', dealValue: '$425K', agreementType: 'Request for Proposal', termLength: '12 months', closeDate: 'May 20, 2026', date: '25/4/2026', time: '11:00', action: 'Edit', documentsCount: 2, tasksCount: 5, tasksPending: 5 },
  
  // In Progress - Active negotiations and pending signatures
  { id: '4', name: 'Quantum Solutions Enterprise License', party: 'Quantum Solutions Ltd.', partyLogo: 'QS', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Legal Review', dealValue: '$2.4M', agreementType: 'Enterprise Software License', termLength: '36 months', closeDate: 'Jun 15, 2026', date: '27/4/2026', time: '16:45', action: 'Edit', documentsCount: 5, tasksCount: 12, tasksPending: 4 },
  { id: '5', name: 'Pinnacle Consulting SOW', party: 'Pinnacle Consulting Group', partyLogo: 'PC', status: 'In Progress', statusIcon: 'clock', statusKind: 'warning', statusSub: '1 of 3 signed', dealValue: '$890K', agreementType: 'Statement of Work', termLength: '18 months', closeDate: 'May 10, 2026', date: '26/4/2026', time: '10:20', action: 'Edit', documentsCount: 3, tasksCount: 9, tasksPending: 2 },
  { id: '6', name: 'Atlas Supply Chain Agreement', party: 'Atlas Supply Co.', partyLogo: 'AS', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Negotiating Terms', dealValue: '$1.2M', agreementType: 'Supply Agreement', termLength: '24 months', closeDate: 'Jun 1, 2026', date: '25/4/2026', time: '15:30', action: 'Edit', documentsCount: 4, tasksCount: 11, tasksPending: 6 },
  { id: '7', name: 'Vertex Technologies Renewal', party: 'Vertex Technologies', partyLogo: 'VT', status: 'In Progress', statusIcon: 'clock', statusKind: 'warning', statusSub: '2 of 2 signed', dealValue: '$675K', agreementType: 'License Renewal', termLength: '12 months', closeDate: 'Apr 30, 2026', date: '24/4/2026', time: '13:00', action: 'Edit', documentsCount: 2, tasksCount: 6, tasksPending: 1 },
  { id: '8', name: 'Nova Dynamics Purchase Order', party: 'Nova Dynamics Inc.', partyLogo: 'ND', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Finance Approval', dealValue: '$340K', agreementType: 'Purchase Order', termLength: '6 months', closeDate: 'May 8, 2026', date: '23/4/2026', time: '09:45', action: 'Edit', documentsCount: 2, tasksCount: 7, tasksPending: 3 },
  
  // Completed - Fully executed agreements
  { id: '9', name: 'Meridian Partners MSA', party: 'Meridian Partners LLC', partyLogo: 'MP', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Fully Executed', dealValue: '$3.1M', agreementType: 'Master Services Agreement', termLength: '36 months', date: '15/4/2026', time: '10:30', action: 'Download', documentsCount: 7, tasksCount: 15, tasksPending: 0 },
  { id: '10', name: 'Catalyst Innovation License', party: 'Catalyst Innovation Corp.', partyLogo: 'CI', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '$1.5M', agreementType: 'Technology License', termLength: '24 months', date: '10/4/2026', time: '14:15', action: 'Download', documentsCount: 4, tasksCount: 10, tasksPending: 0 },
  { id: '11', name: 'Summit Healthcare Vendor Agreement', party: 'Summit Healthcare Systems', partyLogo: 'SH', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '$780K', agreementType: 'Vendor Agreement', termLength: '12 months', date: '5/4/2026', time: '09:45', action: 'Download', documentsCount: 3, tasksCount: 8, tasksPending: 0 },
  { id: '12', name: 'Orion Financial Services SOW', party: 'Orion Financial Group', partyLogo: 'OF', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '$520K', agreementType: 'Statement of Work', termLength: '18 months', date: '1/4/2026', time: '11:30', action: 'Download', documentsCount: 5, tasksCount: 12, tasksPending: 0 },
  { id: '13', name: 'BlueStar Retail Platform Deal', party: 'BlueStar Retail Inc.', partyLogo: 'BR', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '$2.2M', agreementType: 'Platform License', termLength: '36 months', date: '28/3/2026', time: '16:00', action: 'Download', documentsCount: 6, tasksCount: 14, tasksPending: 0 },
  
  // Expired / Voided
  { id: '14', name: 'Legacy Procurement NDA', party: 'Legacy Systems Corp.', partyLogo: 'LS', status: 'Expired', statusIcon: 'status-void', statusKind: 'neutral', statusSub: 'Term Ended', dealValue: '$0', agreementType: 'Non-Disclosure Agreement', termLength: '12 months', date: '1/3/2026', time: '12:00', action: 'Copy', documentsCount: 1, tasksCount: 3, tasksPending: 0 },
  { id: '15', name: 'Falcon Industries Purchase Order', party: 'Falcon Industries', partyLogo: 'FI', status: 'Voided', statusIcon: 'status-void', statusKind: 'neutral', statusSub: 'Cancelled', dealValue: '$280K', agreementType: 'Purchase Order', termLength: '6 months', date: '15/2/2026', time: '16:20', action: 'Copy', documentsCount: 2, tasksCount: 5, tasksPending: 0 },
  { id: '16', name: 'Titan Corp Services Agreement', party: 'Titan Corporation', partyLogo: 'TC', status: 'Expired', statusIcon: 'status-void', statusKind: 'neutral', statusSub: 'Not Renewed', dealValue: '$450K', agreementType: 'Services Agreement', termLength: '24 months', date: '1/2/2026', time: '10:00', action: 'Copy', documentsCount: 3, tasksCount: 7, tasksPending: 0 },
];

// Natural language relative dates from dd/mm/yyyy strings
function relativeDate(dateStr: string): string {
  const [d, m, y] = dateStr.split('/').map(Number);
  const then = new Date(y, m - 1, d);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  return `${diffMonths} months ago`;
}

const agreementColumns = [
  {
    key: 'name',
    header: 'Agreement',
    sortable: true,
    width: '30%',
    cell: (row: Agreement) => (
      <Stack gap="none" style={{ gap: 2 }}>
        <Text size="sm" weight="medium">{row.name}</Text>
        <Text size="xs" color="secondary">{row.agreementType} · {row.dealValue}</Text>
      </Stack>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: '15%',
    cell: (row: Agreement) => (
      <Inline gap="small" align="center">
        <Icon name={row.statusIcon} size={14} color={row.statusKind === 'success' ? 'var(--ink-green-80)' : row.statusKind === 'warning' ? 'var(--ink-orange-80)' : 'var(--ink-neutral-60)'} />
        <Text size="sm">{row.status}</Text>
      </Inline>
    ),
  },
  {
    key: 'docs',
    header: 'Docs',
    alignment: 'center',
    width: '10%',
    cell: (row: Agreement) => (
      <Text size="sm">{row.documentsCount || 0}</Text>
    ),
  },
  {
    key: 'parties',
    header: 'Parties',
    alignment: 'center',
    width: '12%',
    cell: (row: Agreement) => (
      <Inline gap="small" align="center" justify="center">
        <Text size="sm">1</Text>
        <Text size="xs" color="secondary" style={{ color: 'var(--ink-cobalt-80)' }}>ext</Text>
      </Inline>
    ),
  },
  {
    key: 'tasks',
    header: 'Tasks',
    alignment: 'center',
    width: '12%',
    className: 'dt-col-hide-narrow',
    cell: (row: Agreement) => (
      <Inline gap="small" align="center" justify="center">
        {row.tasksPending && row.tasksPending > 0 ? (
          <Text size="sm" style={{ color: 'var(--ink-orange-60)', fontWeight: 500 }}>{row.tasksPending} active</Text>
        ) : (
          <Text size="sm" color="secondary">{row.tasksCount || 0} total</Text>
        )}
      </Inline>
    ),
  },
  {
    key: 'date',
    header: 'Updated',
    sortable: true,
    width: '15%',
    cell: (row: Agreement) => (
      <Text size="sm">{relativeDate(row.date)}</Text>
    ),
  },
  {
    key: 'action',
    header: '',
    alignment: 'end',
    width: 'auto',
    cell: (row: Agreement) => (
      <Inline gap="small" align="center" justify="end" style={{ marginLeft: 'auto' }}>
        <Button kind="secondary" size="small">{row.status === 'Executed' ? 'View' : 'Edit'}</Button>
        <IconButton icon="overflow-vertical" variant="tertiary" size="small" aria-label="More actions" />
      </Inline>
    ),
  },
];

/* ═══════════════════════════════════════
   Navigator (Completed) Data — matches Navigator view
   ═══════════════════════════════════════ */

interface NavigatorAgreement {
  id: string;
  fileName: string;
  fileStatus: 'uploaded' | 'completed';
  fileStatusDetail: string;
  parties: string[];
  status: 'active' | 'inactive';
  statusDate?: string;
  agreementType: string;
  contractValue?: string;
  effectiveDate?: string;
  expirationDate?: string;
  isAIAssisted: boolean;
}

const NAVIGATOR_DATA: NavigatorAgreement[] = [
  { id: '1', fileName: 'Meridian_Partners_MSA_2026_Executed.pdf', fileStatus: 'completed', fileStatusDetail: 'Fully Executed', parties: ['Meridian Partners LLC', 'Your Company'], status: 'active', agreementType: 'MSA', contractValue: '$3,100,000 USD', effectiveDate: '4/15/2026', expirationDate: '4/15/2029', isAIAssisted: true },
  { id: '2', fileName: 'Catalyst_Innovation_License_Agreement.pdf', fileStatus: 'completed', fileStatusDetail: 'All Signatures Complete', parties: ['Catalyst Innovation Corp.', '+1 More'], status: 'active', agreementType: 'License', contractValue: '$1,500,000 USD', effectiveDate: '4/10/2026', expirationDate: '4/10/2028', isAIAssisted: true },
  { id: '3', fileName: 'Summit_Healthcare_Vendor_Agreement.pdf', fileStatus: 'completed', fileStatusDetail: 'Countersigned', parties: ['Summit Healthcare Systems'], status: 'active', agreementType: 'Vendor Agreement', contractValue: '$780,000 USD', effectiveDate: '4/5/2026', expirationDate: '4/5/2027', isAIAssisted: false },
  { id: '4', fileName: 'Orion_Financial_SOW_Q2_2026.pdf', fileStatus: 'completed', fileStatusDetail: 'Executed', parties: ['Orion Financial Group', '+2 More'], status: 'active', agreementType: 'SOW', contractValue: '$520,000 USD', effectiveDate: '4/1/2026', expirationDate: '10/1/2027', isAIAssisted: true },
  { id: '5', fileName: 'BlueStar_Retail_Platform_License.pdf', fileStatus: 'completed', fileStatusDetail: 'Fully Signed', parties: ['BlueStar Retail Inc.'], status: 'active', agreementType: 'Platform License', contractValue: '$2,200,000 USD', effectiveDate: '3/28/2026', expirationDate: '3/28/2029', isAIAssisted: false },
  { id: '6', fileName: 'Vanguard_Supply_Chain_NDA.pdf', fileStatus: 'completed', fileStatusDetail: 'Mutual NDA Signed', parties: ['Vanguard Supply Chain'], status: 'active', agreementType: 'NDA', effectiveDate: '3/20/2026', expirationDate: '3/20/2028', isAIAssisted: true },
  { id: '7', fileName: 'Nexus_Technologies_PO_2026-0412.pdf', fileStatus: 'completed', fileStatusDetail: 'Order Confirmed', parties: ['Nexus Technologies Ltd.', 'Procurement Dept.'], status: 'active', agreementType: 'Purchase Order', contractValue: '$156,000 USD', effectiveDate: '3/15/2026', isAIAssisted: false },
  { id: '8', fileName: 'Evergreen_Consulting_Services_Renewal.pdf', fileStatus: 'completed', fileStatusDetail: 'Renewal Complete', parties: ['Evergreen Consulting'], status: 'active', agreementType: 'Service Renewal', contractValue: '$340,000 USD', effectiveDate: '3/1/2026', expirationDate: '3/1/2027', isAIAssisted: true },
  { id: '9', fileName: 'Legacy_Systems_NDA_Expired.pdf', fileStatus: 'uploaded', fileStatusDetail: 'Archived', parties: ['Legacy Systems Corp.'], status: 'inactive', statusDate: 'Expired 3/1/2026', agreementType: 'NDA', effectiveDate: '3/1/2025', expirationDate: '3/1/2026', isAIAssisted: false },
  { id: '10', fileName: 'Falcon_Industries_PO_Cancelled.pdf', fileStatus: 'uploaded', fileStatusDetail: 'Voided', parties: ['Falcon Industries'], status: 'inactive', statusDate: 'Cancelled 2/15/2026', agreementType: 'Purchase Order', contractValue: '$280,000 USD', isAIAssisted: true },
];

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const navigatorColumns: any[] = [
  {
    key: 'aiAssisted',
    header: '',
    width: '40px',
    cell: (row: NavigatorAgreement) =>
      row.isAIAssisted ? (
        <span className={dataTableStyles.aiSparkle}>
          <AIIcon name="ai-spark-filled" size={14} />
        </span>
      ) : null,
  },
  {
    key: 'fileName',
    header: 'File Name',
    sortable: true,
    width: '280px',
    className: dataTableStyles.columnBorderRight,
    cell: (row: NavigatorAgreement) => (
      <div className={dataTableStyles.cellContent}>
        <a href="#" className={dataTableStyles.cellPrimary} style={{ textDecoration: 'none', color: 'inherit' }}>
          {row.fileName}
        </a>
        <span className={dataTableStyles.cellSecondary}>
          {row.fileStatus === 'uploaded' ? '↑' : '✓'}{' '}
          {row.fileStatus === 'uploaded' ? 'Uploaded: ' : 'Completed envelope: '}
          <a href="#">{row.fileStatusDetail}</a>
        </span>
      </div>
    ),
  },
  {
    key: 'parties',
    header: 'Parties',
    width: '180px',
    cell: (row: NavigatorAgreement) => (
      <div className={dataTableStyles.cellContent}>
        {row.parties.length > 0 ? (
          row.parties.map((party, i) => {
            const isMoreLink = party.startsWith('+');
            if (isMoreLink) {
              return <a key={i} href="#" className={dataTableStyles.partyMoreLink}>{party}</a>;
            }
            return (
              <span key={i} className={dataTableStyles.partyChip}>
                <a href="#" className={dataTableStyles.partyLink}>{party}</a>
              </span>
            );
          })
        ) : (
          <span className={dataTableStyles.cellSecondary}>&mdash;</span>
        )}
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '120px',
    cell: (row: NavigatorAgreement) => (
      <div className={dataTableStyles.statusCell}>
        <span className={dataTableStyles.statusDot} data-status={row.status} />
        <div className={dataTableStyles.statusText}>
          <span className={dataTableStyles.statusLabel}>
            {row.status === 'active' ? 'Active' : 'Inactive'}
          </span>
          {row.statusDate && (
            <span className={dataTableStyles.statusDate}>{row.statusDate}</span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'agreementType',
    header: 'Agreement Type',
    sortable: true,
    width: '140px',
  },
  {
    key: 'contractValue',
    header: 'Total Contract Value',
    sortable: true,
    width: '160px',
    alignment: 'right',
    cell: (row: NavigatorAgreement) => row.contractValue || '—',
  },
  {
    key: 'effectiveDate',
    header: 'Effective Date',
    sortable: true,
    width: '130px',
    cell: (row: NavigatorAgreement) => row.effectiveDate || '—',
  },
  {
    key: 'expirationDate',
    header: 'Expiration Date',
    sortable: true,
    width: '140px',
    alignment: 'right',
    cell: (row: NavigatorAgreement) => row.expirationDate || '—',
  },
];

/* ══════════════════════════════════�������������════
   Parties Data (matches real DocuSign)
   ═══════════════════════════════════════ */

interface Party {
  id: string;
  name: string;
  role: string;
  activeAgreements: number;
  existingAgreements: number;
  starred?: boolean;
}

const PARTIES_DATA: Party[] = [
  { id: '1', name: 'Quantum Solutions Ltd.', role: 'Customer', activeAgreements: 3, existingAgreements: 8, starred: true },
  { id: '2', name: 'Meridian Partners LLC', role: 'Customer', activeAgreements: 2, existingAgreements: 5, starred: true },
  { id: '3', name: 'Atlas Supply Co.', role: 'Vendor', activeAgreements: 4, existingAgreements: 12, starred: false },
  { id: '4', name: 'Pinnacle Consulting Group', role: 'Partner', activeAgreements: 1, existingAgreements: 6, starred: false },
  { id: '5', name: 'Catalyst Innovation Corp.', role: 'Customer', activeAgreements: 2, existingAgreements: 4, starred: true },
  { id: '6', name: 'Summit Healthcare Systems', role: 'Customer', activeAgreements: 1, existingAgreements: 3, starred: false },
  { id: '7', name: 'Orion Financial Group', role: 'Customer', activeAgreements: 3, existingAgreements: 7, starred: false },
  { id: '8', name: 'BlueStar Retail Inc.', role: 'Customer', activeAgreements: 1, existingAgreements: 2, starred: false },
  { id: '9', name: 'Nova Dynamics Inc.', role: 'Vendor', activeAgreements: 2, existingAgreements: 5, starred: false },
  { id: '10', name: 'Horizon Cloud Inc.', role: 'Vendor', activeAgreements: 1, existingAgreements: 3, starred: false },
  { id: '11', name: 'Sterling Logistics', role: 'Partner', activeAgreements: 1, existingAgreements: 2, starred: false },
  { id: '12', name: 'Apex Manufacturing Co.', role: 'Customer', activeAgreements: 1, existingAgreements: 1, starred: false },
];

const partyColumns: any[] = [
  { key: 'name', header: 'Name', sortable: true, width: '280px' },
  { key: 'role', header: 'Role', sortable: true, width: '120px' },
  {
    key: 'activeAgreements',
    header: 'Active agreements',
    sortable: true,
    width: '160px',
    cell: (row: Party) => (
      <Inline gap="small" align="center">
        <Badge kind="success" size="small">Active</Badge>
        <Text size="sm">{row.activeAgreements.toLocaleString()}</Text>
      </Inline>
    ),
  },
  { key: 'existingAgreements', header: 'Existing agreements', sortable: true, width: '160px' },
  {
    key: 'starred',
    header: '',
    width: '48px',
    alignment: 'center' as const,
    cell: (row: Party) => (
      <IconButton icon={row.starred ? 'star' : 'star'} variant="tertiary" size="small" aria-label="Favorite" />
    ),
  },
];

/* ═══════════════════════════════════════
   Requests Data (matches real DocuSign)
   ═══════════�����═══════════════════════════ */

interface RequestItem {
  id: string;
  title: string;
  requestId: string;
  status: 'New' | 'In Progress' | 'Completed' | 'Overdue';
  lastActivityAt: string;
  dueDate: string;
  submitterName: string;
  submitterEmail: string;
  submitterInitials: string;
  owner: string;
}

const REQUESTS_DATA: RequestItem[] = [
  { id: '1', title: '[Example] General Legal Request by DocuSign User Rename', requestId: 'REQ-0006', status: 'New', lastActivityAt: '6/3/2026 07:16', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
  { id: '2', title: '[Example] General Legal Request by DocuSign User JR', requestId: 'REQ-0007', status: 'New', lastActivityAt: '26/2/2026 21:31', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
  { id: '3', title: '[Example] General Legal Request by DocuSign User', requestId: 'REQ-0005', status: 'New', lastActivityAt: '9/2/2026 19:19', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
  { id: '4', title: '[Example] NDA Request by DocuSign User', requestId: 'REQ-0004', status: 'New', lastActivityAt: '18/12/2025 23:10', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
  { id: '5', title: '[Example] General Legal Request by DocuSign User', requestId: 'REQ-0003', status: 'New', lastActivityAt: '18/12/2025 21:55', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
  { id: '6', title: '[Example] NDA Request by DocuSign User', requestId: 'REQ-0002', status: 'New', lastActivityAt: '15/11/2025 21:25', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
  { id: '7', title: '[Example] NDA Request by DocuSign User', requestId: 'REQ-0001', status: 'New', lastActivityAt: '23/10/2025 18:35', dueDate: '', submitterName: 'DocuSign User', submitterEmail: 'navigator_test_admin@dsxtr.com', submitterInitials: 'DU', owner: 'Unassigned' },
];

const requestColumns: any[] = [
  {
    key: 'title',
    header: 'Title',
    sortable: true,
    width: '360px',
    cell: (row: RequestItem) => (
      <div className={dataTableStyles.cellContent}>
        <Text size="sm">{row.title}</Text>
        <Text size="xs" color="secondary">{row.requestId}</Text>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '100px',
    cell: (row: RequestItem) => (
      <Inline gap="small" align="center">
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink-green-60)', flexShrink: 0 }} />
        <Badge kind="success" size="small">{row.status}</Badge>
      </Inline>
    ),
  },
  { key: 'lastActivityAt', header: 'Last Activity At', sortable: true, width: '170px' },
  { key: 'dueDate', header: 'Due Date', sortable: true, width: '120px', cell: (row: RequestItem) => row.dueDate || '—' },
  {
    key: 'submitter',
    header: 'Submitter',
    sortable: true,
    width: '220px',
    cell: (row: RequestItem) => (
      <Inline gap="small" align="center">
        <Avatar size="small" initials={row.submitterInitials} />
        <div className={dataTableStyles.cellContent}>
          <Text size="sm">{row.submitterName}</Text>
          <Text size="xs" color="secondary">{row.submitterEmail}</Text>
        </div>
      </Inline>
    ),
  },
  {
    key: 'owner',
    header: 'Owner',
    sortable: true,
    width: '140px',
    cell: (row: RequestItem) => (
      <Inline gap="small" align="center">
        <Icon name="person" size={16} color="var(--ink-text-secondary)" />
        <Text size="sm" color="secondary">{row.owner}</Text>
      </Inline>
    ),
  },
];

/* ═══════════════════════════════════════
   Templates Data (matches real DocuSign)
   ���������������������══════════════════════════════════════ */

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  owner: string;
  lastModified: string;
  shared: boolean;
  uses: number;
  favorited: boolean;
}

const TEMPLATES_DATA: TemplateItem[] = [
  { id: '1', name: 'quick send', description: 'Default template for quick envelope sending', owner: 'Akshat Mishra', lastModified: '03/13/2026', shared: false, uses: 24, favorited: true },
  { id: '2', name: 'shared template info', description: 'Shared informational template', owner: 'Akshat Mishra', lastModified: '08/12/2025', shared: true, uses: 12, favorited: true },
  { id: '3', name: 'Non-Disclosure Agreement', description: 'Standard NDA for external partners', owner: 'Legal Team', lastModified: '02/28/2026', shared: true, uses: 156, favorited: false },
  { id: '4', name: 'Service Agreement', description: 'Master service agreement template', owner: 'Legal Team', lastModified: '01/15/2026', shared: true, uses: 89, favorited: false },
  { id: '5', name: 'Offer Letter', description: 'Standard offer letter for new hires', owner: 'HR Department', lastModified: '03/05/2026', shared: true, uses: 203, favorited: false },
  { id: '6', name: 'Consulting Agreement', description: 'Independent contractor consulting agreement', owner: 'Akshat Mishra', lastModified: '02/10/2026', shared: false, uses: 7, favorited: false },
  { id: '7', name: 'Sales Contract', description: 'Standard sales contract with payment terms', owner: 'Sales Ops', lastModified: '03/20/2026', shared: true, uses: 342, favorited: false },
  { id: '8', name: 'Vendor Onboarding', description: 'New vendor setup and compliance form', owner: 'Procurement', lastModified: '12/08/2025', shared: true, uses: 45, favorited: false },
  { id: '9', name: 'Employment Agreement', description: 'Full-time employment agreement', owner: 'HR Department', lastModified: '03/01/2026', shared: true, uses: 178, favorited: false },
  { id: '10', name: 'Change Order', description: 'Amendment to existing SOW or contract', owner: 'Akshat Mishra', lastModified: '03/22/2026', shared: false, uses: 3, favorited: false },
];

const templateColumns: any[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    width: '300px',
    cell: (row: TemplateItem) => (
      <div className={dataTableStyles.cellContent}>
        <Text size="sm">{row.name}</Text>
        <Text size="xs" color="secondary">{row.description}</Text>
      </div>
    ),
  },
  { key: 'owner', header: 'Owner', sortable: true, width: '160px' },
  { key: 'lastModified', header: 'Last Modified', sortable: true, width: '140px' },
  {
    key: 'shared',
    header: 'Shared',
    width: '100px',
    cell: (row: TemplateItem) => row.shared ? <Badge kind="info" size="small">Shared</Badge> : <Text size="sm" color="secondary">Private</Text>,
  },
  { key: 'uses', header: 'Uses', sortable: true, width: '80px', alignment: 'right' as const },
  {
    key: 'actions',
    header: '',
    width: '80px',
    alignment: 'end' as const,
    cell: (row: TemplateItem) => (
      <Inline gap="small" align="center" justify="end">
        <IconButton icon="star" variant="tertiary" size="small" aria-label="Favorite" style={row.favorited ? { color: 'var(--ink-yellow-80)' } : undefined} />
        <IconButton icon="overflow-vertical" variant="tertiary" size="small" aria-label="More actions" />
      </Inline>
    ),
  },
];

/* ═══════════════════════════════════════
   Insights Reports Data
   ═══════════════════════════════════════ */

interface ReportItem {
  id: string;
  name: string;
  type: 'dashboard' | 'report';
  owner: string;
  lastViewed: string;
  shared: boolean;
}

const REPORTS_DATA: ReportItem[] = [
  { id: '1', name: 'Expiring agreements', type: 'report', owner: 'System', lastViewed: '03/26/2026', shared: true },
  { id: '2', name: 'Upcoming renewals', type: 'report', owner: 'System', lastViewed: '03/18/2026', shared: true },
  { id: '3', name: 'All agreements', type: 'report', owner: 'System', lastViewed: '02/28/2026', shared: true },
  { id: '4', name: 'Agreements with renewal notice date', type: 'report', owner: 'System', lastViewed: '02/26/2026', shared: true },
  { id: '5', name: 'Obligations by type', type: 'report', owner: 'System', lastViewed: '02/26/2026', shared: true },
  { id: '6', name: 'Envelope Velocity Report', type: 'dashboard', owner: 'Akshat Mishra', lastViewed: '03/25/2026', shared: false },
  { id: '7', name: 'Agreement Trends', type: 'dashboard', owner: 'Akshat Mishra', lastViewed: '03/20/2026', shared: false },
  { id: '8', name: 'Renewals Dashboard', type: 'dashboard', owner: 'Legal Team', lastViewed: '03/15/2026', shared: true },
  { id: '9', name: 'Monthly Signing Activity', type: 'report', owner: 'System', lastViewed: '03/10/2026', shared: true },
  { id: '10', name: 'Compliance Overview', type: 'dashboard', owner: 'Legal Team', lastViewed: '03/01/2026', shared: true },
];

const reportColumns: any[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    width: '360px',
    cell: (row: ReportItem) => (
      <Inline gap="small" align="center">
        <Icon name={row.type === 'dashboard' ? 'grid' : 'bar-chart-2'} size={16} color="var(--ink-text-secondary)" />
        <Text size="sm">{row.name}</Text>
      </Inline>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    width: '120px',
    cell: (row: ReportItem) => <Badge kind={row.type === 'dashboard' ? 'info' : 'neutral'} size="small">{capitalize(row.type)}</Badge>,
  },
  { key: 'owner', header: 'Owner', sortable: true, width: '160px' },
  { key: 'lastViewed', header: 'Last Viewed', sortable: true, width: '140px' },
  {
    key: 'shared',
    header: 'Shared',
    width: '100px',
    cell: (row: ReportItem) => row.shared ? <Badge kind="info" size="small">Shared</Badge> : <Text size="sm" color="secondary">Private</Text>,
  },
];

/* ═��═════════════════════════════════════
   Home Page
   ═══════════════════════���═══════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text as="span" size="xs" weight="semibold" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
      {children}
    </Text>
  );
}

function DocPreview({ hasLogo, hasForm }: { hasLogo?: boolean; hasForm?: boolean }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 2,
      height: '100%',
      padding: '10px 10px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      boxShadow: 'var(--ink-shadow-xs)',
    }}>
      {hasLogo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink-cobalt-90)' }} />
          <div style={{ height: 4, width: 32, background: 'var(--ink-cobalt-90)', borderRadius: 1 }} />
        </div>
      )}
      {hasForm ? (
        <>
          <div style={{ height: 4, width: '90%', background: '#d0d0d0', borderRadius: 1 }} />
          <div style={{ height: 4, width: '60%', background: '#e0e0e0', borderRadius: 1, marginBottom: 2 }} />
          <div style={{ height: 3, width: '100%', background: '#ebebeb', borderRadius: 1 }} />
          <div style={{ height: 3, width: '100%', background: '#ebebeb', borderRadius: 1 }} />
          <div style={{ height: 3, width: '80%', background: '#efefef', borderRadius: 1 }} />
          <div style={{ height: 3, width: '100%', background: '#ebebeb', borderRadius: 1 }} />
          <div style={{ height: 3, width: '75%', background: '#f2f2f2', borderRadius: 1 }} />
          <div style={{ height: 3, width: '100%', background: '#ebebeb', borderRadius: 1 }} />
        </>
      ) : (
        <>
          <div style={{ height: 3, width: '80%', background: '#d8d8d8', borderRadius: 1 }} />
          <div style={{ height: 3, width: '60%', background: '#e2e2e2', borderRadius: 1 }} />
          <div style={{ height: 3, width: '70%', background: '#e8e8e8', borderRadius: 1 }} />
          <div style={{ height: 3, width: '55%', background: '#ebebeb', borderRadius: 1 }} />
          <div style={{ height: 3, width: '75%', background: '#efefef', borderRadius: 1 }} />
          <div style={{ height: 3, width: '50%', background: '#f0f0f0', borderRadius: 1 }} />
          <div style={{ height: 3, width: '65%', background: '#f2f2f2', borderRadius: 1 }} />
          <div style={{ height: 3, width: '45%', background: '#f4f4f4', borderRadius: 1 }} />
        </>
      )}
    </div>
  );
}

function HomePage() {
  const getStaggerProps = useStaggerEntrance(5, { baseDelay: 80, staggerInterval: 60, duration: 380, distance: 10 });

  // Tasks for Sales use case
  const tasks = [
    {
      icon: 'status-check' as const,
      title: 'Finance Approval',
      description: 'Momentum Driver MSA 2026',
      badge: 'Due today',
      badgeColor: 'var(--ink-red-80)',
    },
    {
      icon: 'edit' as const,
      title: 'Review Redlines',
      description: 'TechStart Platform Agreement',
      badge: 'Due in 2 days',
      badgeColor: 'var(--ink-orange-60)',
    },
    {
      icon: 'eye' as const,
      title: 'Review SOW Terms',
      description: 'CloudCo Services SOW',
      sub: 'From: Legal Team',
    },
    {
      icon: 'document' as const,
      title: 'Upload Security Addendum',
      description: 'Acme Solutions Renewal',
      sub: 'From: Security Team',
    },
  ];

  // Agreement activity for Sales
  const activity = [
    { name: 'GlobalTech Enterprise Deal',     time: '2 hours ago', type: 'completed' as const },
    { name: 'Momentum Driver MSA 2026',       time: '4 hours ago', type: 'waiting' as const,  progress: 75 },
    { name: 'TechStart Platform Agreement',   time: '1 day ago',   type: 'waiting' as const,  progress: 45 },
    { name: 'CloudCo Services SOW',           time: '2 days ago',  type: 'expiring' as const  },
    { name: 'Innovate Labs Partnership',      time: '3 days ago',  type: 'completed' as const },
  ];

  // Templates for Sales
  const templates = [
    { name: 'Master Service Agreement', sub: 'Document Template',  badge: 'Favorite',     badgeColor: 'var(--ink-cobalt-100)', hasLogo: true,  hasForm: false },
    { name: 'Statement of Work',        sub: 'Document Template',  badge: 'Favorite',     badgeColor: 'var(--ink-cobalt-100)', hasLogo: false, hasForm: false },
    { name: 'Enterprise NDA',           sub: 'Envelope Template',  badge: 'Sales',        badgeColor: 'var(--ink-green-80)',   hasLogo: false, hasForm: true  },
    { name: 'Order Form',               sub: 'Web Form Template',  badge: 'Sales',        badgeColor: 'var(--ink-green-80)',   hasLogo: true,  hasForm: false },
  ];

  // Recommended for Sales
  const recommended = [
    { icon: 'ai-spark-filled' as const, label: 'Accelerate deal velocity with AI', active: true },
    { icon: 'document' as const,        label: 'Standardize contract language' },
    { icon: 'workflow' as const,        label: 'Automate approval workflows' },
  ];

  return (
    /* Gradient flows from #DBD6FE at top to #FFFFFF at bottom, covering both hero and cards */
    <div style={{
      background: 'linear-gradient(180deg, #DBD6FE 0%, #ffffff 420px)',
      minHeight: '100%',
    }}>
      {/* ── Hero banner — transparent so gradient shows through ── */}
      <div style={{
        textAlign: 'center',
        padding: '40px 24px 52px',
      }}>
        {/* Greeting */}
        <div style={{ fontSize: 24, fontWeight: 400, color: '#130032', marginBottom: 16, fontFamily: 'var(--ink-font-family)' }}>
          Welcome, Kathie Brown
        </div>

        {/* Stats pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0,
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(19,0,50,0.12)',
          borderRadius: 'var(--ink-radius-size-full)',
          padding: '7px 20px',
          marginBottom: 32,
          fontSize: 13,
          color: '#130032',
          fontFamily: 'var(--ink-font-family)',
        }}>
          <span>2 expiring soon</span>
          <span style={{ margin: '0 14px', opacity: 0.3 }}>|</span>
          <span>3 open requests</span>
          <span style={{ margin: '0 14px', opacity: 0.3 }}>|</span>
          <span>8 upcoming renewals</span>
        </div>

        {/* Action buttons row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 56 }}>
          {[
            { icon: 'plus' as const,      label: 'Start',            onClick: () => setShowStartModal(true) },
            { icon: 'send' as const,      label: 'Get\nSignatures',  onClick: () => {} },
            { icon: 'edit' as const,      label: 'Sign a\nDocument', onClick: () => {} },
            { icon: 'templates' as const, label: 'Use\nTemplate',    onClick: () => {} },
          ].map((btn) => (
            <div key={btn.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={btn.onClick}>
              {/* Setting color on the wrapper resolves currentColor to white for all child SVG paths */}
              <div style={{
                width: 48, height: 48,
                background: 'var(--ink-cobalt-100)',
                borderRadius: 'var(--ink-radius-size-s)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff',
              }}>
                <Icon name={btn.icon} size={22} />
              </div>
              <div style={{ color: '#130032', fontSize: 13, textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-line', fontFamily: 'var(--ink-font-family)' }}>
                {btn.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Page body — sits on the gradient, no background of its own ── */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px 40px' }}>
        <Stack gap="none" style={{ gap: 20 }}>

          {/* ── Tasks ── */}
          <div {...getStaggerProps(0)}>
            <div style={{
              background: 'var(--ink-white-100)',
              borderRadius: 'var(--ink-radius-size-m)',
              border: '1px solid var(--ink-neutral-fade-10)',
              boxShadow: 'var(--ink-shadow-sm)',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>Tasks</span>
                <Button kind="tertiary" size="small">View all</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {tasks.map((task, i) => (
                  <div key={i} style={{
                    background: 'var(--ink-white-100)',
                    border: '1px solid var(--ink-neutral-fade-10)',
                    borderRadius: 'var(--ink-radius-size-s)',
                    padding: '12px 12px 14px',
                    boxShadow: 'var(--ink-shadow-xs)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <Icon name={task.icon} size={18} />
                      <IconButton icon="overflow-vertical" variant="tertiary" size="small" aria-label="More options" />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)', marginBottom: 4, lineHeight: 1.3 }}>{task.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)', lineHeight: 1.4, marginBottom: task.badge ? 8 : 0 }}>{task.description}</div>
                    {task.sub && <div style={{ fontSize: 13, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)' }}>{task.sub}</div>}
                    {task.badge && (
                      <div style={{
                        display: 'inline-block',
                        marginTop: 6,
                        padding: '2px 8px',
                        borderRadius: 'var(--ink-radius-size-xs)',
                        background: task.badgeColor,
                        color: 'var(--ink-white-100)',
                        fontSize: 12,
                        fontWeight: 500,
                        fontFamily: 'var(--ink-font-family)',
                      }}>
                        {task.badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Agreement activity ── */}
          <div {...getStaggerProps(1)}>
            <div style={{
              background: 'var(--ink-white-100)',
              borderRadius: 'var(--ink-radius-size-m)',
              border: '1px solid var(--ink-neutral-fade-10)',
              boxShadow: 'var(--ink-shadow-sm)',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>Agreement activity</span>
                  <Icon name="info" size={15} color="var(--ink-font-color-secondary)" />
                </div>
                <Button kind="tertiary" size="small">View all</Button>
              </div>
              {activity.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 0',
                  borderTop: i > 0 ? '1px solid var(--ink-neutral-fade-10)' : 'none',
                  cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)' }}>{item.time}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {item.type === 'completed' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="status-check" size={16} color="var(--ink-green-80)" />
                        <span style={{ fontSize: 13, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>Completed</span>
                      </div>
                    )}
                    {item.type === 'waiting' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                          <div style={{ width: 80, height: 4, background: 'var(--ink-neutral-30)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${item.progress}%`, height: '100%', background: 'var(--ink-cobalt-90)', borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)' }}>Waiting for 2 others</span>
                        </div>
                      </div>
                    )}
                    {item.type === 'expiring' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Icon name="status-warn" size={16} color="var(--ink-orange-60)" />
                          <span style={{ fontSize: 13, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>Expiring soon</span>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--ink-cobalt-90)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'var(--ink-font-family)' }}>View Details</span>
                      </div>
                    )}
                    <Icon name="chevron-right" size={16} color="var(--ink-font-color-secondary)" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Templates ── */}
          <div {...getStaggerProps(2)}>
            <div style={{
              background: 'var(--ink-white-100)',
              borderRadius: 'var(--ink-radius-size-m)',
              border: '1px solid var(--ink-neutral-fade-10)',
              boxShadow: 'var(--ink-shadow-sm)',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>Templates</span>
                <Button kind="tertiary" size="small">View all</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {templates.map((t, i) => (
                  <div key={i} style={{
                    background: 'var(--ink-white-100)',
                    border: '1px solid var(--ink-neutral-fade-10)',
                    borderRadius: 'var(--ink-radius-size-s)',
                    overflow: 'hidden',
                    boxShadow: 'var(--ink-shadow-xs)',
                    cursor: 'pointer',
                  }}>
                    {/* Document preview area */}
                    <div style={{ background: 'var(--ink-neutral-10)', height: 148, position: 'relative', padding: 12 }}>
                      <span style={{
                        position: 'absolute', top: 8, right: 8, zIndex: 1,
                        padding: '3px 8px',
                        borderRadius: 'var(--ink-radius-size-xs)',
                        background: t.badgeColor,
                        color: 'var(--ink-white-100)',
                        fontSize: 11,
                        fontWeight: 500,
                        fontFamily: 'var(--ink-font-family)',
                      }}>
                        {t.badge}
                      </span>
                      <DocPreview hasLogo={t.hasLogo} hasForm={t.hasForm} />
                    </div>
                    {/* Label */}
                    <div style={{ padding: '10px 12px 12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)', marginBottom: 2 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)' }}>{t.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Recommended for you ── */}
          <div {...getStaggerProps(3)}>
            <div style={{
              background: 'var(--ink-white-100)',
              borderRadius: 'var(--ink-radius-size-m)',
              border: '1px solid var(--ink-neutral-fade-10)',
              boxShadow: 'var(--ink-shadow-sm)',
              padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>Recommended for you</span>
                <Button kind="tertiary" size="small">View all</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 220px', gap: 24 }}>
                {/* Left: action list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recommended.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 10px',
                      borderRadius: 'var(--ink-radius-size-s)',
                      background: r.active ? 'var(--ink-cobalt-10)' : 'transparent',
                      cursor: 'pointer',
                      border: r.active ? '1px solid var(--ink-cobalt-30)' : '1px solid transparent',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 'var(--ink-radius-size-xs)',
                          background: r.active ? 'var(--ink-cobalt-100)' : 'var(--ink-neutral-20)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon name={r.icon} size={16} color={r.active ? 'var(--ink-white-100)' : 'var(--ink-font-color-secondary)'} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: r.active ? 500 : 400, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)', lineHeight: 1.35 }}>{r.label}</span>
                      </div>
                      <Icon name="chevron-right" size={14} color="var(--ink-font-color-secondary)" />
                    </div>
                  ))}
                </div>

                {/* Center: description */}
                <div style={{ padding: '4px 0' }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)', lineHeight: 1.3, marginBottom: 10 }}>
                    Centralize your requests in Agreement Desk
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)', lineHeight: 1.55, marginBottom: 18 }}>
                    Learn how to create intake forms and manage documents through every stage of the signing process.
                  </div>
                  <Button kind="brand" size="small">Watch Video</Button>
                </div>

                {/* Right: video thumbnail */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--ink-neutral-120) 0%, var(--ink-cobalt-100) 100%)',
                  borderRadius: 'var(--ink-radius-size-s)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minHeight: 130,
                }}>
                  <div style={{
                    width: 44, height: 44,
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 0, height: 0,
                      borderTop: '9px solid transparent',
                      borderBottom: '9px solid transparent',
                      borderLeft: '15px solid var(--ink-cobalt-100)',
                      marginLeft: 4,
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Research panel / footer links ── */}
          <div {...getStaggerProps(4)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '8px 0' }}>
              <div style={{ maxWidth: 480 }}>
                <div style={{ fontSize: 13, color: 'var(--ink-font-color-secondary)', fontFamily: 'var(--ink-font-family)', lineHeight: 1.5, marginBottom: 4 }}>
                  Want to participate in DocuSign research studies such as surveys, interviews, and testing of new product ideas and features?
                </div>
                <Link href="#" style={{ fontSize: 13 }}>Join our Product Experience Research Panel</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                {[
                  { icon: 'help' as const,   label: 'Support Home'  },
                  { icon: 'people' as const,  label: 'Community'     },
                  { icon: 'shield' as const,  label: 'Trust Center'  },
                ].map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <Icon name={l.icon} size={15} color="var(--ink-font-color-secondary)" />
                    <span style={{ fontSize: 13, color: 'var(--ink-font-color-default)', fontFamily: 'var(--ink-font-family)' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </Stack>
      </div>
    </div>
  );
}

/* ═════���═════════════════════════════════
   Insights — Overview sub-view
   ═══════════════════════════════════════ */

function InsightsOverview() {
  const getStaggerProps = useStaggerEntrance(4, { baseDelay: 50, staggerInterval: 80, duration: 400, distance: 10 });

  const recents = [
    { name: 'Expiring agreements', time: 'viewed 5 days ago' },
    { name: 'Upcoming renewals', time: 'viewed 13 days ago' },
    { name: 'All agreements', time: 'viewed 32 days ago' },
    { name: 'Agreements with renewal notice date', time: 'viewed 34 days ago' },
    { name: 'Obligations by type', time: 'viewed 34 days ago' },
  ];

  const favorites = [
    'Envelope Velocity Report',
    'Agreement Trends',
    'Renewals Dashboard',
  ];

  return (
    <div style={{ padding: 'var(--ink-spacing-300)' }}>
      <div {...getStaggerProps(0)}>
        <PageHeader title="Overview" />
      </div>

      <div {...getStaggerProps(1)} style={{ ...getStaggerProps(1).style, marginTop: 'var(--ink-spacing-200)', marginBottom: 'var(--ink-spacing-300)' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          border: '1px solid var(--ink-border-subtle)', borderRadius: 'var(--ink-radius-md)',
          padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', gap: 'var(--ink-spacing-100)',
        }}>
          <Icon name="search" size={16} />
          <span style={{ fontSize: 14, color: 'var(--ink-font-secondary)' }}>Find reports or dashboards</span>
        </div>
      </div>

      <div {...getStaggerProps(2)}>
      <Grid columns={2} gap="medium">
        <Card radius="large">
          <div style={{ padding: 'var(--ink-spacing-200)' }}>
            <Text size="sm" weight="semibold">Your Recents</Text>
            <Stack gap="none" style={{ marginTop: 'var(--ink-spacing-150)' }}>
              {recents.map((r, i) => (
                <Inline key={i} justify="between" align="center" style={{
                  padding: 'var(--ink-spacing-100) 0',
                  borderTop: i > 0 ? '1px solid var(--ink-border-subtle)' : 'none',
                }}>
                  <Inline gap="small" align="center">
                    <Icon name="bar-chart-2" size={16} />
                    <Text size="sm">{r.name}</Text>
                  </Inline>
                  <Text size="xs" color="secondary">{r.time}</Text>
                </Inline>
              ))}
            </Stack>
            <div style={{ textAlign: 'center', marginTop: 'var(--ink-spacing-150)', borderTop: '1px solid var(--ink-border-subtle)', paddingTop: 'var(--ink-spacing-100)' }}>
              <Link href="#">View all</Link>
            </div>
          </div>
        </Card>

        <Card radius="large">
          <div style={{ padding: 'var(--ink-spacing-200)' }}>
            <Text size="sm" weight="semibold">Your Favorites</Text>
            <Stack gap="none" style={{ marginTop: 'var(--ink-spacing-150)' }}>
              {favorites.map((f, i) => (
                <Inline key={i} gap="small" align="center" style={{
                  padding: 'var(--ink-spacing-100) 0',
                  borderTop: i > 0 ? '1px solid var(--ink-border-subtle)' : 'none',
                }}>
                  <Icon name="star" size={16} color="var(--ink-yellow-80)" />
                  <Text size="sm">{f}</Text>
                </Inline>
              ))}
            </Stack>
          </div>
        </Card>
      </Grid>
      </div>

      <div {...getStaggerProps(3)} style={{ ...getStaggerProps(3).style, marginTop: 'var(--ink-spacing-300)' }}>
        <Text size="md" weight="semibold">Weekly Insights</Text>
        <Grid columns={3} gap="medium" style={{ marginTop: 'var(--ink-spacing-200)' }}>
          <Card radius="large">
            <div style={{ padding: 'var(--ink-spacing-200)', textAlign: 'center' }}>
              <Text size="sm" weight="medium">All agreements</Text>
              <Text size="xs" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>Count</Text>
              <div style={{ fontSize: 36, fontWeight: 600, margin: 'var(--ink-spacing-100) 0', color: 'var(--ink-cobalt-90)' }}>42,357</div>
              <Text size="sm">Agreements</Text>
            </div>
          </Card>
          <Card radius="large">
            <div style={{ padding: 'var(--ink-spacing-200)', textAlign: 'center' }}>
              <Text size="sm" weight="medium">New agreements ingested</Text>
              <Text size="xs" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>Count</Text>
              <div style={{ fontSize: 36, fontWeight: 600, margin: 'var(--ink-spacing-100) 0', color: 'var(--ink-cobalt-90)' }}>25</div>
              <Text size="sm">Agreements</Text>
            </div>
          </Card>
          <Card radius="large">
            <div style={{ padding: 'var(--ink-spacing-200)', textAlign: 'center' }}>
              <Text size="sm" weight="medium">Expiring soon</Text>
              <Text size="xs" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>Next 90 days</Text>
              <div style={{ fontSize: 36, fontWeight: 600, margin: 'var(--ink-spacing-100) 0', color: 'var(--ink-yellow-80)' }}>138</div>
              <Text size="sm">Agreements</Text>
            </div>
          </Card>
        </Grid>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Templates Page — no longer used as standalone
   (rendered inline via AgreementTableView)
   ═══════════════════════════════════════ */

/* ═══════════════════════════════════════
   Admin Page
   ═══════════════════════════════════════ */

function AdminPage() {
  return (
    <div style={{ padding: 'var(--ink-spacing-300)' }}>
      <PageHeader title="Admin" />
      <div style={{ marginTop: 'var(--ink-spacing-400)', textAlign: 'center' }}>
        <Icon name="settings" size={48} />
        <div style={{ fontSize: 16, fontWeight: 500, marginTop: 'var(--ink-spacing-150)' }}>Account Settings</div>
        <div style={{ fontSize: 13, color: 'var(--ink-font-secondary)', marginTop: 4 }}>Manage users, billing, and account preferences.</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Footer
   ══════════���������════════════════════════════ */

function Footer() {
  const links = ['Contact Us', 'Terms of Use', 'Privacy', 'Intellectual Property', 'Trust'];
  return (
    <footer style={{
      borderTop: '1px solid var(--ink-border-subtle)',
      padding: 'var(--ink-spacing-200) var(--ink-spacing-300)',
      marginTop: 'auto',
    }}>
      <Inline justify="between" align="center">
        <Inline gap="small" align="center">
          <Text size="xs" color="secondary">English (US)</Text>
          <Icon name="chevron-down" size={12} />
          <Text size="xs" color="secondary" style={{ margin: '0 var(--ink-spacing-100)' }}>|</Text>
          {links.map((link, i) => (
            <Text key={i} as="span" size="xs" color="secondary" style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'transparent' }}>
              {link}
            </Text>
          ))}
        </Inline>
        <Text size="xs" color="secondary">
          Version: 1.13043 &middot; Copyright &copy; 2026 Docusign, Inc. All rights reserved.
        </Text>
      </Inline>
    </footer>
  );
}

/* ════════════��═════════════���════════════
   App
   ═══════════════════════════════════════ */

const VALID_TABS: TabId[] = ['home', 'agreements', 'templates', 'insights', 'admin'];

/* ═══════════════════════════════════════
   Agreement Detail View (Navigator Viewer)
   Full-screen dialog with PDF viewer + detail sidebar
   ═════════════════════��═════════════════ */

const AGREEMENT_DETAIL = {
  fileName: 'Batterii MLA_00992.pdf',
  agreementType: 'License',
  status: 'Inactive',
  parties: [
    { name: 'Batterii, LLC', role: 'Licensor' },
    { name: 'ABC COMPANY INC', role: 'Licensee' },
  ],
  lineOfBusiness: 'Unspecified',
  languages: 'English',
  terminationNoticePeriod: '30 days',
  governingLaw: 'Ohio',
  fields: 34,
  suggestions: 5,
  clauses: [
    'Assignment Clause #1', 'Assignment Clause #2',
    'Change of Control Clause #1', 'Change of Control Clause #2',
    'Confidentiality Clause #1', 'Confidentiality Clause #2',
    'Indemnification Clause',
    'Intellectual Property Rights Clause #1', 'Intellectual Property Rights Clause #2', 'Intellectual Property Rights Clause #3',
    'Limitation of Liability Clause',
    'Separation Clause #1', 'Separation Clause #2', 'Separation Clause #3', 'Separation Clause #4',
    'Service Level Agreements Clause',
    'Termination for Breach Clause #1', 'Termination for Breach Clause #2', 'Termination for Breach Clause #3',
  ],
};

const DETAIL_TABS = [
  { id: 'details', icon: 'info' as const, label: 'Details' },
  { id: 'obligations', icon: 'flag' as const, label: 'Obligations' },
  { id: 'sets', icon: 'diamond-stack' as const, label: 'Agreement sets' },
  { id: 'related', icon: 'hierarchy' as const, label: 'Related agreements' },
  { id: 'chat', icon: 'comment' as const, label: 'Chat' },
];

/* ═══════════════════════════════════════
   Deal Workspace View (Draft / In Progress)
   ═══════════════════════════════════════ */

interface DealTask {
  id: string;
  title: string;
  type: string;
  team: string;
  assignee: string;
  assigneeInitials: string;
  status: 'In progress' | 'Not started' | 'Complete';
  dueDate: string;
  isDueSoon?: boolean;
}

interface DealDocument {
  id: string;
  name: string;
  commentCount?: number;
  status: 'In Review' | 'Executed';
  owner: string;
  ownerInitials: string;
  dateModified: string;
  isParent?: boolean;
  parentId?: string;
}

// Agreement-specific workspace data keyed by agreement ID
const WORKSPACE_DATA: Record<string, {
  tasks: DealTask[];
  documents: DealDocument[];
  supplementalDocs: DealDocument[];
  attentionItems: { id: string; item: string; description: string; riskLevel: 'High' | 'Medium' }[];
  activityItems: { id: string; icon: 'clock' | 'upload' | 'status-check' | 'comment' | 'edit'; user: string; action: string; time: string; isAI?: boolean }[];
  teamProgress: { team: string; completed: number; total: number; color: string }[];
  alertMessage?: string;
  alertAssignee?: string;
}> = {
  // Apex Manufacturing MSA (Draft)
  '1': {
    tasks: [
      { id: '1', title: 'Draft Master Services Agreement', type: 'Upload', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'In progress', dueDate: '5/5/26' },
      { id: '2', title: 'Define Manufacturing SLA Requirements', type: 'Upload', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Not started', dueDate: '5/8/26' },
      { id: '3', title: 'Draft Quality Assurance Standards', type: 'Upload', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Not started', dueDate: '5/10/26' },
      { id: '4', title: 'Create Pricing Schedule', type: 'Upload', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'Not started', dueDate: '5/12/26' },
      { id: '5', title: 'Budget Approval ($1.8M)', type: 'Approval', team: 'Finance', assignee: 'CFO - Robert Hayes', assigneeInitials: 'RH', status: 'Not started', dueDate: '5/15/26' },
      { id: '6', title: 'Legal Review - Indemnification Terms', type: 'Review', team: 'Legal', assignee: 'James Park', assigneeInitials: 'JP', status: 'Not started', dueDate: '5/18/26' },
      { id: '7', title: 'Stakeholder Sign-off', type: 'Approval', team: 'Executive', assignee: 'VP Sales - Mark Johnson', assigneeInitials: 'MJ', status: 'Not started', dueDate: '5/22/26' },
      { id: '8', title: 'Send for Customer Signature', type: 'Sign', team: 'Sales', assignee: 'Rachel Kim', assigneeInitials: 'RK', status: 'Not started', dueDate: '5/25/26' },
    ],
    documents: [
      { id: '1', name: 'Master Services Agreement', status: 'In Review', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '4/27/2026' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Apex Manufacturing Credit Report', status: 'Executed', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/20/2026' },
      { id: '11', name: 'Apex Manufacturing Company Profile', status: 'Executed', owner: 'Rachel Kim', ownerInitials: 'RK', dateModified: '4/15/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Initial Draft Needed', description: 'MSA template needs customization for manufacturing terms', riskLevel: 'Medium' },
      { id: '2', item: 'Large Deal Value', description: '$1.8M deal requires CFO approval', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'clock', user: 'AI Agent', action: 'Analyzing Apex Manufacturing company profile', time: 'Running...', isAI: true },
      { id: '2', icon: 'edit', user: 'Laura Chen', action: 'Created new agreement workspace', time: '2 hours ago' },
      { id: '3', icon: 'upload', user: 'Rachel Kim', action: 'Uploaded company profile', time: '1 day ago' },
    ],
    teamProgress: [
      { team: 'Legal', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Operations', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Finance', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Sales', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
    ],
    alertMessage: 'Initial MSA draft is due next week. Start drafting terms.',
    alertAssignee: 'Laura Chen',
  },
  // Sterling Logistics NDA (Draft)
  '2': {
    tasks: [
      { id: '1', title: 'Customize NDA Template', type: 'Upload', team: 'Legal', assignee: 'James Park', assigneeInitials: 'JP', status: 'In progress', dueDate: '5/2/26' },
      { id: '2', title: 'Define Confidential Information Scope', type: 'Review', team: 'Legal', assignee: 'James Park', assigneeInitials: 'JP', status: 'Not started', dueDate: '5/3/26' },
      { id: '3', title: 'Internal Stakeholder Review', type: 'Approval', team: 'Sales', assignee: 'Rachel Kim', assigneeInitials: 'RK', status: 'Not started', dueDate: '5/4/26' },
      { id: '4', title: 'Send for Counterparty Signature', type: 'Sign', team: 'Legal', assignee: 'James Park', assigneeInitials: 'JP', status: 'Not started', dueDate: '5/5/26' },
    ],
    documents: [
      { id: '1', name: 'Mutual Non-Disclosure Agreement', status: 'In Review', owner: 'James Park', ownerInitials: 'JP', dateModified: '4/26/2026' },
    ],
    supplementalDocs: [
      { id: '5', name: 'Sterling Logistics Company Overview', status: 'Executed', owner: 'Rachel Kim', ownerInitials: 'RK', dateModified: '4/22/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Confidentiality Scope', description: 'Define scope of confidential information for logistics data', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'edit', user: 'James Park', action: 'Started NDA customization', time: '4 hours ago' },
    ],
    teamProgress: [
      { team: 'Legal', completed: 0, total: 3, color: 'var(--ink-neutral-60)' },
      { team: 'Sales', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
    ],
  },
  // Horizon Cloud Services RFP (Draft)
  '3': {
    tasks: [
      { id: '1', title: 'Draft RFP Requirements Document', type: 'Upload', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'In progress', dueDate: '5/10/26' },
      { id: '2', title: 'Define Technical Requirements', type: 'Upload', team: 'IT', assignee: 'Kevin Nguyen', assigneeInitials: 'KN', status: 'In progress', dueDate: '5/12/26' },
      { id: '3', title: 'Security Requirements Review', type: 'Review', team: 'Security', assignee: 'Tom Bradley', assigneeInitials: 'TB', status: 'Not started', dueDate: '5/14/26' },
      { id: '4', title: 'Budget Allocation ($425K)', type: 'Approval', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'Not started', dueDate: '5/15/26' },
      { id: '5', title: 'Vendor Shortlist Approval', type: 'Approval', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Not started', dueDate: '5/18/26' },
      { id: '6', title: 'Issue RFP to Vendors', type: 'Upload', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Not started', dueDate: '5/20/26' },
    ],
    documents: [
      { id: '1', name: 'Request for Proposal (RFP)', status: 'In Review', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '4/25/2026' },
      { id: '2', name: 'Technical Requirements Specification', status: 'In Review', owner: 'Kevin Nguyen', ownerInitials: 'KN', dateModified: '4/24/2026' },
      { id: '3', name: 'Security Requirements Checklist', status: 'In Review', owner: 'Tom Bradley', ownerInitials: 'TB', dateModified: '4/23/2026' },
      { id: '4', name: 'Vendor Evaluation Scorecard', status: 'In Review', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '4/22/2026' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Current Infrastructure Assessment', status: 'Executed', owner: 'Kevin Nguyen', ownerInitials: 'KN', dateModified: '4/10/2026' },
      { id: '11', name: 'Cloud Migration Strategy Document', status: 'Executed', owner: 'Kevin Nguyen', ownerInitials: 'KN', dateModified: '4/5/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Technical Specs Incomplete', description: 'IT team needs to finalize cloud infrastructure requirements', riskLevel: 'Medium' },
      { id: '2', item: 'Security Review Pending', description: 'Security team needs to review cloud compliance requirements', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'clock', user: 'AI Agent', action: 'Comparing vendor capabilities', time: 'Running...', isAI: true },
      { id: '2', icon: 'upload', user: 'Sarah Miller', action: 'Uploaded initial RFP draft', time: '1 day ago' },
      { id: '3', icon: 'edit', user: 'Kevin Nguyen', action: 'Updated technical requirements', time: '2 days ago' },
    ],
    teamProgress: [
      { team: 'Procurement', completed: 1, total: 3, color: 'var(--ink-cobalt-80)' },
      { team: 'IT', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Security', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
      { team: 'Finance', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
    ],
  },
  // Quantum Solutions Enterprise License (In Progress)
  '4': {
    tasks: [
      { id: '1', title: 'Review License Agreement Terms', type: 'Review', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'In progress', dueDate: '5/1/26' },
      { id: '2', title: 'Finance Approval ($2.4M)', type: 'Approval', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'In progress', dueDate: 'Tomorrow', isDueSoon: true },
      { id: '3', title: 'Security Assessment - Data Handling', type: 'Review', team: 'Security', assignee: 'Tom Bradley', assigneeInitials: 'TB', status: 'Not started', dueDate: '5/5/26' },
      { id: '4', title: 'Data Privacy Review (DPA)', type: 'Review', team: 'Legal', assignee: 'James Park', assigneeInitials: 'JP', status: 'In progress', dueDate: '5/3/26' },
      { id: '5', title: 'Integration Planning Complete', type: 'Review', team: 'IT', assignee: 'Kevin Nguyen', assigneeInitials: 'KN', status: 'Complete', dueDate: '4/25/26' },
      { id: '6', title: 'Negotiate Liability Terms', type: 'Review', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'Not started', dueDate: '5/8/26' },
      { id: '7', title: 'Executive Approval', type: 'Approval', team: 'Executive', assignee: 'CFO - Robert Hayes', assigneeInitials: 'RH', status: 'Not started', dueDate: '5/10/26' },
      { id: '8', title: 'Internal Signature - Legal', type: 'Sign', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'Not started', dueDate: '5/12/26' },
      { id: '9', title: 'Send for Customer Signature', type: 'Sign', team: 'Sales', assignee: 'Rachel Kim', assigneeInitials: 'RK', status: 'Not started', dueDate: '5/15/26' },
    ],
    documents: [
      // Parent: Enterprise Software License Agreement with nested exhibits
      { id: '1', name: 'Enterprise Software License Agreement', commentCount: 4, status: 'In Review', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '4/27/2026' },
      { id: '2', name: 'Exhibit A: Data Processing Addendum (DPA)', commentCount: 2, status: 'In Review', owner: 'James Park', ownerInitials: 'JP', dateModified: '4/26/2026', parentId: '1' },
      { id: '3', name: 'Exhibit B: Security Requirements', status: 'In Review', owner: 'Tom Bradley', ownerInitials: 'TB', dateModified: '4/25/2026', parentId: '1' },
      { id: '4', name: 'Exhibit C: Support and SLA Terms', commentCount: 1, status: 'In Review', owner: 'Kevin Nguyen', ownerInitials: 'KN', dateModified: '4/24/2026', parentId: '1' },
      { id: '5', name: 'Exhibit D: Pricing Schedule', status: 'In Review', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/23/2026', parentId: '1' },
      // Standalone documents
      { id: '6', name: 'Implementation Statement of Work', status: 'In Review', owner: 'Kevin Nguyen', ownerInitials: 'KN', dateModified: '4/22/2026' },
      { id: '7', name: 'Professional Services Agreement', status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/20/2026' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Quantum Solutions Company Profile', status: 'Executed', owner: 'Rachel Kim', ownerInitials: 'RK', dateModified: '3/15/2026' },
      { id: '11', name: 'Non-Disclosure Agreement (Executed)', status: 'Executed', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '2/20/2026' },
      { id: '12', name: 'Proof of Concept Results', status: 'Executed', owner: 'Kevin Nguyen', ownerInitials: 'KN', dateModified: '3/1/2026' },
      { id: '13', name: 'Vendor Security Questionnaire', status: 'Executed', owner: 'Tom Bradley', ownerInitials: 'TB', dateModified: '2/15/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Finance Approval', description: 'Finance approval pending since 4/24 - $2.4M deal value', riskLevel: 'High' },
      { id: '2', item: 'Unlimited Liability Request', description: 'Quantum requesting unlimited liability for data breaches', riskLevel: 'High' },
      { id: '3', item: 'Extended Payment Terms', description: 'Net 60 payment terms requested vs standard Net 30', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'clock', user: 'AI Agent', action: 'Analyzing Quantum Solutions contract history', time: 'Running...', isAI: true },
      { id: '2', icon: 'clock', user: 'AI Agent', action: 'Extracting prevailing license terms', time: 'Running...', isAI: true },
      { id: '3', icon: 'upload', user: 'Laura Chen', action: 'Uploaded DPA revision v2', time: '2 hours ago' },
      { id: '4', icon: 'comment', user: 'Tom Bradley', action: 'Added comment on Security Exhibit', time: '4 hours ago' },
      { id: '5', icon: 'status-check', user: 'Kevin Nguyen', action: 'Completed Integration Planning', time: '1 day ago' },
    ],
    teamProgress: [
      { team: 'Legal', completed: 1, total: 4, color: 'var(--ink-cobalt-80)' },
      { team: 'Finance', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Security', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
      { team: 'IT', completed: 1, total: 1, color: 'var(--ink-green-80)' },
      { team: 'Sales', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
    ],
    alertMessage: 'Finance Approval is due tomorrow. Would you like to send Diana Walsh a reminder?',
    alertAssignee: 'Diana Walsh',
  },
  // Pinnacle Consulting SOW (In Progress)
  '5': {
    tasks: [
      { id: '1', title: 'Define Project Scope', type: 'Upload', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Complete', dueDate: '4/18/26' },
      { id: '2', title: 'Create Project Milestones', type: 'Upload', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Complete', dueDate: '4/20/26' },
      { id: '3', title: 'Legal Review of SOW Terms', type: 'Review', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'In progress', dueDate: '4/28/26' },
      { id: '4', title: 'Finalize Rate Card', type: 'Upload', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'Complete', dueDate: '4/22/26' },
      { id: '5', title: 'Budget Sign-off ($890K)', type: 'Approval', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'Complete', dueDate: '4/22/26' },
      { id: '6', title: 'Internal Executive Approval', type: 'Approval', team: 'Executive', assignee: 'VP Operations - Lisa Park', assigneeInitials: 'LP', status: 'Complete', dueDate: '4/24/26' },
      { id: '7', title: 'Send for Client Signature', type: 'Sign', team: 'Sales', assignee: 'Rachel Kim', assigneeInitials: 'RK', status: 'In progress', dueDate: '5/5/26', isDueSoon: true },
      { id: '8', title: 'Countersign After Client Approval', type: 'Sign', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'Not started', dueDate: '5/8/26' },
    ],
    documents: [
      // Parent: Statement of Work with attachments
      { id: '1', name: 'Statement of Work (SOW)', commentCount: 2, status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/26/2026' },
      { id: '2', name: 'Attachment A: Project Milestones', status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/25/2026', parentId: '1' },
      { id: '3', name: 'Attachment B: Rate Card and Pricing', status: 'Executed', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/22/2026', parentId: '1' },
      { id: '4', name: 'Attachment C: Resource Allocation Plan', status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/24/2026', parentId: '1' },
      // Standalone
      { id: '5', name: 'Change Order Template', status: 'In Review', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '4/20/2026' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Pinnacle Consulting MSA (Governing)', status: 'Executed', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '1/15/2025' },
      { id: '11', name: 'Original Proposal Submitted', status: 'Executed', owner: 'Rachel Kim', ownerInitials: 'RK', dateModified: '3/10/2026' },
      { id: '12', name: 'Pinnacle Project Requirements', status: 'Executed', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '3/15/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Pending Client Signature', description: '1 of 3 signatures collected - awaiting Pinnacle CEO', riskLevel: 'Medium' },
      { id: '2', item: 'Milestone Payment Terms', description: 'Client requesting milestone-based payments vs monthly', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'status-check', user: 'Diana Walsh', action: 'Approved budget allocation', time: '2 days ago' },
      { id: '2', icon: 'upload', user: 'Mike Torres', action: 'Updated milestone schedule', time: '3 days ago' },
      { id: '3', icon: 'comment', user: 'Rachel Kim', action: 'Sent signature request to client', time: '4 days ago' },
      { id: '4', icon: 'status-check', user: 'Lisa Park', action: 'Executive approval granted', time: '3 days ago' },
    ],
    teamProgress: [
      { team: 'Operations', completed: 2, total: 2, color: 'var(--ink-green-80)' },
      { team: 'Legal', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Finance', completed: 2, total: 2, color: 'var(--ink-green-80)' },
      { team: 'Sales', completed: 0, total: 1, color: 'var(--ink-neutral-60)' },
    ],
    alertMessage: 'Awaiting client signature. Send a follow-up to Pinnacle?',
    alertAssignee: 'Rachel Kim',
  },
  // Atlas Supply Chain Agreement (In Progress)
  '6': {
    tasks: [
      { id: '1', title: 'Draft Supply Agreement Terms', type: 'Upload', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Complete', dueDate: '4/22/26' },
      { id: '2', title: 'Review Quality Standards', type: 'Review', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'In progress', dueDate: '5/3/26' },
      { id: '3', title: 'Negotiate Pricing Terms', type: 'Review', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'In progress', dueDate: '5/5/26' },
      { id: '4', title: 'Review Supply Terms - Legal', type: 'Review', team: 'Legal', assignee: 'James Park', assigneeInitials: 'JP', status: 'Not started', dueDate: '5/8/26' },
      { id: '5', title: 'Evaluate Exclusivity Request', type: 'Review', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'In progress', dueDate: '5/1/26' },
      { id: '6', title: 'Approve Logistics Plan', type: 'Approval', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Not started', dueDate: '5/10/26' },
      { id: '7', title: 'Finance Approval ($1.2M)', type: 'Approval', team: 'Finance', assignee: 'CFO - Robert Hayes', assigneeInitials: 'RH', status: 'Not started', dueDate: '5/12/26' },
      { id: '8', title: 'Vendor Signature Collection', type: 'Sign', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Not started', dueDate: '5/18/26' },
      { id: '9', title: 'Internal Countersignature', type: 'Sign', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'Not started', dueDate: '5/20/26' },
    ],
    documents: [
      // Parent: Supply Agreement with schedules
      { id: '1', name: 'Supply Chain Master Agreement', commentCount: 3, status: 'In Review', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '4/25/2026' },
      { id: '2', name: 'Schedule A: Quality Assurance Standards', commentCount: 1, status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/24/2026', parentId: '1' },
      { id: '3', name: 'Schedule B: Pricing and Volume Tiers', status: 'In Review', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/23/2026', parentId: '1' },
      { id: '4', name: 'Schedule C: Delivery Terms', status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/22/2026', parentId: '1' },
      { id: '5', name: 'Schedule D: Product Specifications', status: 'In Review', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '4/21/2026', parentId: '1' },
      // Standalone
      { id: '6', name: 'Vendor Compliance Certificate', status: 'In Review', owner: 'Tom Bradley', ownerInitials: 'TB', dateModified: '4/20/2026' },
      { id: '7', name: 'Insurance Certificate of Coverage', status: 'In Review', owner: 'James Park', ownerInitials: 'JP', dateModified: '4/18/2026' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Atlas Supply Co. Vendor Profile', status: 'Executed', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '3/1/2026' },
      { id: '11', name: 'Vendor Due Diligence Report', status: 'Executed', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '3/15/2026' },
      { id: '12', name: 'Market Pricing Analysis', status: 'Executed', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/1/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Volume Discount Negotiation', description: 'Atlas requesting 15% discount for volume commitment', riskLevel: 'Medium' },
      { id: '2', item: 'Exclusivity Clause Request', description: 'Vendor requesting exclusivity for certain product categories', riskLevel: 'High' },
      { id: '3', item: 'Lead Time Requirements', description: '30-day lead time may not meet operational needs', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'clock', user: 'AI Agent', action: 'Comparing Atlas pricing to market benchmarks', time: 'Running...', isAI: true },
      { id: '2', icon: 'comment', user: 'Diana Walsh', action: 'Counter-offered on volume pricing', time: '3 hours ago' },
      { id: '3', icon: 'upload', user: 'Sarah Miller', action: 'Updated supply agreement draft', time: '1 day ago' },
    ],
    teamProgress: [
      { team: 'Procurement', completed: 1, total: 3, color: 'var(--ink-cobalt-80)' },
      { team: 'Operations', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Finance', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
      { team: 'Legal', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
    ],
  },
  // Vertex Technologies Renewal (In Progress)
  '7': {
    tasks: [
      { id: '1', title: 'Review Renewal Terms vs Original', type: 'Review', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'Complete', dueDate: '4/20/26' },
      { id: '2', title: 'Evaluate Price Increase (5%)', type: 'Review', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'Complete', dueDate: '4/21/26' },
      { id: '3', title: 'Update Pricing Schedule', type: 'Upload', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'Complete', dueDate: '4/22/26' },
      { id: '4', title: 'Customer Approval of New Terms', type: 'Approval', team: 'Sales', assignee: 'Rachel Kim', assigneeInitials: 'RK', status: 'Complete', dueDate: '4/24/26' },
      { id: '5', title: 'Obtain Customer Signature', type: 'Sign', team: 'Sales', assignee: 'Rachel Kim', assigneeInitials: 'RK', status: 'In progress', dueDate: 'Today', isDueSoon: true },
      { id: '6', title: 'Internal Countersignature', type: 'Sign', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'Not started', dueDate: 'Today' },
    ],
    documents: [
      // Renewal with updated schedule
      { id: '1', name: 'License Renewal Amendment', commentCount: 1, status: 'In Review', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '4/24/2026' },
      { id: '2', name: 'Exhibit A: Updated Pricing Schedule', status: 'Executed', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/22/2026', parentId: '1' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Original License Agreement (2025)', status: 'Executed', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '4/30/2025' },
      { id: '11', name: 'Original Pricing Schedule (2025)', status: 'Executed', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '4/30/2025' },
      { id: '12', name: 'Vertex Account History', status: 'Executed', owner: 'Rachel Kim', ownerInitials: 'RK', dateModified: '4/15/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Signature Deadline', description: 'Renewal must be signed by end of day to avoid lapse', riskLevel: 'High' },
    ],
    activityItems: [
      { id: '1', icon: 'status-check', user: 'Diana Walsh', action: 'Approved 5% price increase', time: '2 days ago' },
      { id: '2', icon: 'status-check', user: 'Laura Chen', action: 'Completed legal review', time: '4 days ago' },
      { id: '3', icon: 'upload', user: 'Rachel Kim', action: 'Sent for client signature', time: '1 day ago' },
    ],
    teamProgress: [
      { team: 'Legal', completed: 1, total: 2, color: 'var(--ink-cobalt-80)' },
      { team: 'Finance', completed: 2, total: 2, color: 'var(--ink-green-80)' },
      { team: 'Sales', completed: 1, total: 2, color: 'var(--ink-cobalt-80)' },
    ],
    alertMessage: 'Renewal signature is due today! Follow up with Vertex immediately.',
    alertAssignee: 'Rachel Kim',
  },
  // Nova Dynamics Purchase Order (In Progress)
  '8': {
    tasks: [
      { id: '1', title: 'Create Purchase Requisition', type: 'Upload', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Complete', dueDate: '4/18/26' },
      { id: '2', title: 'Verify Product Specifications', type: 'Review', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Complete', dueDate: '4/20/26' },
      { id: '3', title: 'Validate Pricing Against Contract', type: 'Review', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'In progress', dueDate: '4/28/26' },
      { id: '4', title: 'Budget Approval ($340K)', type: 'Approval', team: 'Finance', assignee: 'Diana Walsh', assigneeInitials: 'DW', status: 'In progress', dueDate: '4/28/26' },
      { id: '5', title: 'Confirm Delivery Schedule', type: 'Approval', team: 'Operations', assignee: 'Mike Torres', assigneeInitials: 'MT', status: 'Not started', dueDate: '5/1/26' },
      { id: '6', title: 'Issue PO to Vendor', type: 'Upload', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Not started', dueDate: '5/3/26' },
      { id: '7', title: 'Vendor Acknowledgment', type: 'Approval', team: 'Procurement', assignee: 'Sarah Miller', assigneeInitials: 'SM', status: 'Not started', dueDate: '5/5/26' },
    ],
    documents: [
      { id: '1', name: 'Purchase Order #PO-2026-0892', status: 'In Review', owner: 'Sarah Miller', ownerInitials: 'SM', dateModified: '4/23/2026' },
      { id: '2', name: 'Product Specifications Sheet', status: 'Executed', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/20/2026' },
      { id: '3', name: 'Delivery Schedule', status: 'In Review', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/22/2026' },
    ],
    supplementalDocs: [
      { id: '10', name: 'Nova Dynamics Vendor Agreement (Governing)', status: 'Executed', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '1/15/2026' },
      { id: '11', name: 'Approved Vendor Pricing Sheet', status: 'Executed', owner: 'Diana Walsh', ownerInitials: 'DW', dateModified: '1/20/2026' },
      { id: '12', name: 'Original Purchase Requisition', status: 'Executed', owner: 'Mike Torres', ownerInitials: 'MT', dateModified: '4/15/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Budget Approval Pending', description: 'Finance review needed for $340K purchase', riskLevel: 'Medium' },
    ],
    activityItems: [
      { id: '1', icon: 'status-check', user: 'Sarah Miller', action: 'Verified PO specifications', time: '3 days ago' },
      { id: '2', icon: 'upload', user: 'Sarah Miller', action: 'Submitted PO for approval', time: '4 days ago' },
      { id: '3', icon: 'status-check', user: 'Mike Torres', action: 'Created purchase requisition', time: '5 days ago' },
    ],
    teamProgress: [
      { team: 'Operations', completed: 1, total: 2, color: 'var(--ink-cobalt-80)' },
      { team: 'Procurement', completed: 1, total: 3, color: 'var(--ink-cobalt-80)' },
      { team: 'Finance', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
    ],
  },
};

// Default fallback data for agreements without specific workspace data
const DEFAULT_WORKSPACE_DATA = {
  tasks: [
    { id: '1', title: 'Review Agreement Terms', type: 'View', team: 'Legal', assignee: 'Legal Team', assigneeInitials: 'LT', status: 'Not started' as const, dueDate: 'TBD' },
  ],
  documents: [
    { id: '1', name: 'Agreement Document', status: 'In Review' as const, owner: 'Owner', ownerInitials: 'OW', dateModified: 'N/A', isParent: true },
  ],
  supplementalDocs: [] as DealDocument[],
  attentionItems: [] as { id: string; item: string; description: string; riskLevel: 'High' | 'Medium' }[],
  activityItems: [] as { id: string; icon: 'clock' | 'upload' | 'status-check' | 'comment' | 'edit'; user: string; action: string; time: string; isAI?: boolean }[],
  teamProgress: [] as { team: string; completed: number; total: number; color: string }[],
};

function WorkspaceView({ agreement, onClose }: { agreement: Agreement; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents'>('overview');
  const [taskSearch, setTaskSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['1']));
  const fadeIn = useFadeIn(0, 250);
  
  // Get agreement-specific workspace data
  const workspaceData = WORKSPACE_DATA[agreement.id] || DEFAULT_WORKSPACE_DATA;

  const toggleGroup = (id: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedGroups(newExpanded);
  };

  const tabStyle = (isActive: boolean): CSSProperties => ({
    padding: 'var(--ink-spacing-100) var(--ink-spacing-150)',
    border: 'none',
    background: 'none',
    borderBottom: isActive ? '2px solid var(--ink-neutral-140)' : '2px solid transparent',
    color: isActive ? 'var(--ink-text-primary)' : 'var(--ink-text-secondary)',
    cursor: 'pointer',
    fontSize: 'var(--ink-font-size-sm)',
    fontWeight: isActive ? 600 : 400,
    fontFamily: 'var(--ink-font-family-default)',
  });

  const getStatusBadgeStyle = (status: string): CSSProperties => {
    if (status === 'In progress') return { background: 'var(--ink-cobalt-20)', color: 'var(--ink-cobalt-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
    if (status === 'Not started') return { background: 'var(--ink-neutral-20)', color: 'var(--ink-neutral-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
    if (status === 'Complete') return { background: 'var(--ink-green-20)', color: 'var(--ink-green-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
    if (status === 'In Review') return { background: 'var(--ink-cobalt-20)', color: 'var(--ink-cobalt-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
    if (status === 'Executed') return { background: 'var(--ink-green-20)', color: 'var(--ink-green-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
    return {};
  };

  const getRiskBadgeStyle = (level: 'High' | 'Medium'): CSSProperties => {
    if (level === 'High') return { background: 'var(--ink-red-20)', color: 'var(--ink-red-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
    return { background: 'var(--ink-yellow-20)', color: 'var(--ink-yellow-100)', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ink-font-size-xs)', fontWeight: 500 };
  };

  const innerStyle: CSSProperties = {
    maxWidth: 1440,
    minWidth: 1280,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 var(--ink-spacing-300)',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1060,
      ...fadeIn.style,
      background: 'var(--ink-bg-color-default)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header + Tabs — single full-width block */}
      <div style={{ background: 'var(--ink-bg-color-canvas-page)', borderBottom: '1px solid var(--ink-border-subtle)' }}>
        {/* Actions row ��� back arrow far left, actions far right, both outside constraint */}
        <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--ink-spacing-100) var(--ink-spacing-200)' }}>
          <button onClick={onClose} aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, flexShrink: 0 }}>
            <Icon name="arrow-left" size={20} />
          </button>
          <div style={{ flex: 1 }} />
          <Inline gap="small" align="center">
            <div style={{ display: 'flex' }}>
              <Avatar initials="SS" size="small" style={{ border: '2px solid white', marginRight: -8 }} />
              <Avatar initials="JL" size="small" style={{ border: '2px solid white', marginRight: -8 }} />
              <Avatar initials="NK" size="small" style={{ border: '2px solid white' }} />
            </div>
            <IconButton icon="comment" variant="tertiary" size="medium" aria-label="Comments" />
            <Button kind="primary">Add</Button>
          </Inline>
        </div>

        {/* Title row — constrained */}
        <div style={{ ...innerStyle, paddingBottom: 'var(--ink-spacing-150)' }}>
          <Inline gap="medium" align="center">
            <Heading level={3} style={{ margin: 0 }}>{agreement.name}</Heading>
            <Badge kind={agreement.statusKind === 'success' ? 'success' : agreement.statusKind === 'warning' ? 'warning' : 'emphasis'}>{agreement.status}</Badge>
          </Inline>
        </div>

        {/* Tabs — constrained, no top border */}
        <div style={{ ...innerStyle, alignItems: 'stretch', gap: 0, paddingTop: 'var(--ink-spacing-100)' }}>
          <button onClick={() => setActiveTab('overview')} style={tabStyle(activeTab === 'overview')}>Overview</button>
          <button onClick={() => setActiveTab('tasks')} style={tabStyle(activeTab === 'tasks')}>Tasks</button>
          <button onClick={() => setActiveTab('documents')} style={tabStyle(activeTab === 'documents')}>Documents</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--ink-bg-color-secondary)' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: '100%', maxWidth: 1440, minWidth: 1280, margin: '0 auto' }}>
            {/* Main content */}
            <div style={{ padding: 'var(--ink-spacing-300)', background: 'var(--ink-bg-color-default)' }}>
              {/* Deal info card */}
              <div style={{
                background: 'var(--ink-white-100)',
                border: '1px solid var(--ink-neutral-fade-10)',
                borderRadius: 'var(--ink-radius-size-s)',
                padding: '24px 16px',
                marginBottom: 'var(--ink-spacing-300)',
              }}>
                <Inline justify="between" align="flex-start">
                  <Inline gap="medium" align="center">
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--ink-cobalt-80)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: 'var(--ink-font-size-sm)' }}>{agreement.partyLogo || agreement.party.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <Inline gap="small" align="center">
                        <Text size="sm" weight="semibold">{agreement.party}</Text>
                        <Icon name="chevron-down" size={16} />
                      </Inline>
                      <Inline gap="small" align="center">
                        <StatusLight kind={agreement.statusKind === 'success' ? 'success' : 'info'} />
                        <Text size="xs" color="secondary">OPP-{agreement.id.padStart(4, '0')}</Text>
                      </Inline>
                    </div>
                  </Inline>
                </Inline>
                <Grid columns={4} gap="large" style={{ marginTop: 'var(--ink-spacing-200)' }}>
                  <div>
                    <Text size="xs" color="secondary">Deal Value</Text>
                    <Text size="sm" weight="semibold">{agreement.dealValue || '—'}</Text>
                  </div>
                  <div>
                    <Text size="xs" color="secondary">Agreement Type</Text>
                    <Text size="sm">{agreement.agreementType || '—'}</Text>
                  </div>
                  <div>
                    <Text size="xs" color="secondary">Term Length</Text>
                    <Text size="sm">{agreement.termLength || '—'}</Text>
                  </div>
                  <div>
                    <Text size="xs" color="secondary">Anticipated Close</Text>
                    <Text size="sm">{agreement.closeDate || '—'}</Text>
                  </div>
                </Grid>
              </div>

              {/* Needs Attention */}
              <div style={{ fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 600, marginBottom: 'var(--ink-spacing-200)' }}>Needs Attention</div>
              
              {/* Alert banner */}
              {workspaceData.alertMessage && (
                <Alert kind="warning" action={{ label: 'Send reminder', onClick: () => {} }} onClose={() => {}} style={{ marginBottom: 'var(--ink-spacing-200)' }}>
                  {workspaceData.alertMessage}
                </Alert>
              )}

              {/* Attention items table */}
              <div style={{ border: '1px solid var(--ink-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--ink-bg-color-secondary)' }}>
                      <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Item</th>
                      <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Description</th>
                      <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Risk Level</th>
                      <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspaceData.attentionItems.map((item) => (
                      <tr key={item.id} style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                        <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{item.item}</td>
                        <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)', color: 'var(--ink-text-secondary)' }}>{item.description}</td>
                        <td style={{ padding: 'var(--ink-spacing-150)' }}>
                          <span style={getRiskBadgeStyle(item.riskLevel)}>{item.riskLevel}</span>
                        </td>
                        <td style={{ padding: 'var(--ink-spacing-150)' }}>
                          <Button kind={item.riskLevel === 'High' && item.item === 'Finance Approval' ? 'secondary' : 'primary'} size="small">
                            {item.item === 'Finance Approval' ? 'Remind' : 'View'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity sidebar */}
            <div style={{ padding: 'var(--ink-spacing-300)', borderLeft: '1px solid var(--ink-border-subtle)', background: 'var(--ink-bg-color-default)' }}>
              <Inline justify="between" align="center" style={{ marginBottom: 'var(--ink-spacing-200)' }}>
                <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>ACTIVITY</Text>
                <IconButton icon="filter" variant="tertiary" size="small" aria-label="Filter" />
              </Inline>
              <Stack gap="medium">
                {workspaceData.activityItems.map((item) => (
                  <Inline key={item.id} gap="medium" align="flex-start">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: item.isAI ? 'var(--ink-cobalt-20)' : 'var(--ink-bg-color-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name={item.icon} size={16} color={item.isAI ? 'var(--ink-cobalt-100)' : undefined} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text size="sm">
                        <strong>{item.user}</strong> {item.action}
                      </Text>
                      <Text size="xs" color="secondary">{item.time}</Text>
                    </div>
                  </Inline>
                ))}
              </Stack>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div style={{ padding: 'var(--ink-spacing-300)', background: 'var(--ink-bg-color-default)', minHeight: '100%', maxWidth: 1440, minWidth: 1280, margin: '0 auto' }}>
            {/* Alert banner */}
            {workspaceData.alertMessage && (
              <Alert kind="warning" action={{ label: 'Send reminder', onClick: () => {} }} onClose={() => {}} style={{ marginBottom: 'var(--ink-spacing-300)' }}>
                {workspaceData.alertMessage}
              </Alert>
            )}

            <div style={{ fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 600, marginBottom: 'var(--ink-spacing-200)' }}>Tasks</div>

            {/* Team progress cards */}
            <Grid columns={4} gap="medium" style={{ marginBottom: 'var(--ink-spacing-300)' }}>
              {workspaceData.teamProgress.map((team) => (
                <div key={team.team} style={{
                  background: 'var(--ink-white-100)',
                  border: '1px solid var(--ink-neutral-fade-10)',
                  borderRadius: 'var(--ink-radius-size-s)',
                  padding: '24px 16px',
                }}>
                  <ProgressBar 
                    value={(team.completed / team.total) * 100}
                    label={team.team}
                  />
                  <Text size="xs" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>{team.completed} of {team.total} complete</Text>
                </div>
              ))}
            </Grid>

            {/* Search and filters */}
            <Inline gap="medium" style={{ marginBottom: 'var(--ink-spacing-200)' }}>
              <SearchInput placeholder="Search tasks..." value={taskSearch} onChange={setTaskSearch} style={{ width: 240 }} />
              <Button kind="secondary" size="small">Any status <Icon name="chevron-down" size={14} /></Button>
              <Button kind="secondary" size="small">Any team <Icon name="chevron-down" size={14} /></Button>
            </Inline>

            {/* Tasks table */}
            <div style={{ border: '1px solid var(--ink-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--ink-bg-color-secondary)' }}>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Task</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Team</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Assigned To</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Status</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Due Date</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workspaceData.tasks.map((task) => (
                    <tr key={task.id} style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Inline gap="small" align="center">
                          <Icon name={task.type === 'View' ? 'eye' : task.type === 'Approval' ? 'status-check' : 'upload'} size={16} color="var(--ink-text-secondary)" />
                          <div>
                            <Text size="sm">{task.title}</Text>
                            <Text size="xs" color="secondary">{task.type}</Text>
                          </div>
                        </Inline>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{task.team}</td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Inline gap="small" align="center">
                          <Avatar initials={task.assigneeInitials} size="small" />
                          <Text size="sm">{task.assignee}</Text>
                        </Inline>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <span style={getStatusBadgeStyle(task.status)}>{task.status}</span>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Text size="sm" color={task.isDueSoon ? 'warning' : undefined} style={task.isDueSoon ? { color: 'var(--ink-yellow-100)' } : {}}>{task.dueDate}</Text>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Button kind={task.isDueSoon ? 'primary' : 'secondary'} size="small">
                          {task.isDueSoon ? 'Remind' : 'View'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div style={{ padding: 'var(--ink-spacing-300)', background: 'var(--ink-bg-color-default)', minHeight: '100%', maxWidth: 1440, minWidth: 1280, margin: '0 auto' }}>
            <div style={{ fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 600, marginBottom: 'var(--ink-spacing-200)' }}>Documents</div>

            {/* Documents table */}
            <div style={{ border: '1px solid var(--ink-border-subtle)', borderRadius: 8, overflow: 'hidden', marginBottom: 'var(--ink-spacing-300)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--ink-bg-color-secondary)' }}>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Document</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Status</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Owner</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Date Modified</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workspaceData.documents.map((doc) => {
                    const isChild = !!doc.parentId;
                    const isParentExpanded = !doc.parentId || expandedGroups.has(doc.parentId);
                    if (isChild && !isParentExpanded) return null;
                    
                    // Check if this document has any children
                    const hasChildren = workspaceData.documents.some(d => d.parentId === doc.id);
                    
                    return (
                      <tr key={doc.id} style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                        <td style={{ padding: 'var(--ink-spacing-150)', paddingLeft: isChild ? 'calc(var(--ink-spacing-150) + 24px)' : 'var(--ink-spacing-150)' }}>
                          <Inline gap="small" align="center">
                            {hasChildren && (
                              <button onClick={() => toggleGroup(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                <Icon name={expandedGroups.has(doc.id) ? 'chevron-down' : 'chevron-right'} size={16} />
                              </button>
                            )}
                            <Text size="sm">{doc.name}</Text>
                            {doc.commentCount && (
                              <AlertBadge value={doc.commentCount} kind="emphasis" />
                            )}
                          </Inline>
                        </td>
                        <td style={{ padding: 'var(--ink-spacing-150)' }}>
                          <span style={getStatusBadgeStyle(doc.status)}>{doc.status}</span>
                        </td>
                        <td style={{ padding: 'var(--ink-spacing-150)' }}>
                          <Inline gap="small" align="center">
                            <Avatar initials={doc.ownerInitials} size="small" />
                            <Text size="sm">{doc.owner}</Text>
                          </Inline>
                        </td>
                        <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{doc.dateModified}</td>
                        <td style={{ padding: 'var(--ink-spacing-150)' }}>
                          <Inline gap="small" align="center">
                            <Button kind="secondary" size="small">View</Button>
                            <IconButton icon="dots-vertical" variant="tertiary" size="small" aria-label="More options" />
                          </Inline>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 600, marginBottom: 'var(--ink-spacing-200)' }}>Supplemental Documents</div>

            {/* Supplemental documents table */}
            <div style={{ border: '1px solid var(--ink-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--ink-bg-color-secondary)' }}>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Document</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Status</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Owner</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Date Modified</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workspaceData.supplementalDocs.map((doc) => (
                    <tr key={doc.id} style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                      <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{doc.name}</td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <span style={getStatusBadgeStyle(doc.status)}>{doc.status}</span>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Inline gap="small" align="center">
                          <Avatar initials={doc.ownerInitials} size="small" />
                          <Text size="sm">{doc.owner}</Text>
                        </Inline>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{doc.dateModified}</td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Inline gap="small" align="center">
                          <Button kind="secondary" size="small">View</Button>
                          <IconButton icon="dots-vertical" variant="tertiary" size="small" aria-label="More options" />
                        </Inline>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgreementDetailView({ onClose }: { onClose: () => void }) {
  const detail = AGREEMENT_DETAIL;
  const [activeDetailTab, setActiveDetailTab] = useState<string | null>('details');
  const fadeIn = useFadeIn(0, 250);
  const getDetailStagger = useStaggerEntrance(5, { baseDelay: 150, staggerInterval: 50, duration: 350, distance: 8 });

  const handleSidebarTabClick = (tabId: string) => {
    if (activeDetailTab === tabId) {
      setActiveDetailTab(null); // close panel
    } else {
      setActiveDetailTab(tabId); // open/switch panel
    }
  };

  const detailContent = (
    <Stack gap="medium" style={{ padding: 'var(--ink-spacing-200)' }}>
      {/* AI suggestion banner */}
      <div {...getDetailStagger(0)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--ink-spacing-100)', flexDirection: 'column' }}>
          <AIBadge infoContent={false}>AI-Assisted</AIBadge>
          <Text size="sm">
            It looks like this agreement type is <strong>{detail.agreementType}</strong>. There are <strong>{detail.fields}</strong> fields and <strong>{detail.suggestions}</strong> new suggestions for you to review.
          </Text>
          <Button kind="secondary" size="small">Review All</Button>
        </div>
      </div>

      <div {...getDetailStagger(1)}>
        <Divider />
      </div>

      {/* Search */}
      <div {...getDetailStagger(2)}>
        <Input placeholder="Find details" />
      </div>

      {/* Agreement Type */}
      <div {...getDetailStagger(3)}>
        <Inline gap="small" align="center">
          <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agreement Type</Text>
          <AIIcon name="ai-spark-filled" size={12} />
        </Inline>
        <Text size="sm">{detail.agreementType}</Text>
      </div>

      {/* Accordion sections */}
      <div {...getDetailStagger(4)}>
      <Accordion
        allowMultiple
        defaultOpenItems={['general', 'termination', 'clauses', 'legal']}
        bordered
        items={[
          {
            id: 'general',
            title: 'General',
            subtitle: 'AI Suggested',
            content: (
              <Stack gap="medium">
                <div>
                  <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</Text>
                  <Text size="sm">{detail.status}</Text>
                </div>
                <div>
                  <Inline gap="small" align="center">
                    <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parties</Text>
                    <AIIcon name="ai-spark-filled" size={12} />
                  </Inline>
                  {detail.parties.map((p, i) => (
                    <Inline key={i} justify="between" align="center" style={{ padding: 'var(--ink-spacing-50) 0' }}>
                      <Text size="sm">{p.name}</Text>
                      <Link href="#">View</Link>
                    </Inline>
                  ))}
                </div>
                <div>
                  <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Name</Text>
                  <Text size="sm">{detail.fileName}</Text>
                </div>
                <div>
                  <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Line of Business</Text>
                  <Text size="sm">{detail.lineOfBusiness}</Text>
                </div>
                <div>
                  <Inline gap="small" align="center">
                    <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Languages</Text>
                    <AIIcon name="ai-spark-filled" size={12} />
                  </Inline>
                  <Text size="sm">{detail.languages}</Text>
                </div>
                <Button kind="secondary" size="small">Show 7 empty fields</Button>
              </Stack>
            ),
          },
          {
            id: 'termination',
            title: 'Termination',
            subtitle: 'AI Suggested',
            content: (
              <Stack gap="medium">
                <div>
                  <Inline gap="small" align="center">
                    <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Termination for Convenience - Notice Period</Text>
                    <AIIcon name="ai-spark-filled" size={12} />
                  </Inline>
                  <Text size="sm">{detail.terminationNoticePeriod}</Text>
                </div>
                <Button kind="secondary" size="small">Show 1 empty field</Button>
              </Stack>
            ),
          },
          { id: 'renewal', title: 'Renewal', content: <Text size="sm" color="secondary">No renewal terms found.</Text> },
          { id: 'payment', title: 'Payment', content: <Text size="sm" color="secondary">No payment terms found.</Text> },
          {
            id: 'legal',
            title: 'Legal and Compliance',
            subtitle: 'AI Suggested',
            content: (
              <Stack gap="medium">
                <div>
                  <Inline gap="small" align="center">
                    <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Governing Law</Text>
                    <AIIcon name="ai-spark-filled" size={12} />
                  </Inline>
                  <Text size="sm">{detail.governingLaw}</Text>
                </div>
                <Button kind="secondary" size="small">Show 4 empty fields</Button>
              </Stack>
            ),
          },
          {
            id: 'clauses',
            title: 'Clauses',
            subtitle: 'AI Suggested',
            content: (
              <Stack gap="small">
                {detail.clauses.map((clause, i) => (
                  <Inline key={i} justify="between" align="center" style={{ padding: 'var(--ink-spacing-50) 0' }}>
                    <Inline gap="small" align="center">
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{clause}</Text>
                      <AIIcon name="ai-spark-filled" size={12} />
                    </Inline>
                    <Text size="sm">Found</Text>
                  </Inline>
                ))}
              </Stack>
            ),
          },
        ]}
      />
      </div>
    </Stack>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1060,
      ...fadeIn.style,
      background: 'var(--ink-bg-color-default)',
      display: 'grid', gridTemplateRows: 'auto auto 1fr',
    }}>
      {/* Row 1: Dark top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--ink-spacing-100)',
        padding: '0 var(--ink-spacing-100)',
        background: 'var(--ink-neutral-140)',
        color: 'white',
        height: 64,
      }}>
        <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 64 }}>
          <Icon name="close" size={20} />
        </button>
        <Text size="sm" style={{ flex: 1, color: 'white' }}>{detail.fileName}</Text>
        <button aria-label="Set a notification" style={{ width: 40, height: 40, borderRadius: 4, border: '1px solid transparent', background: 'var(--ink-cobalt-140)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bell-slash" size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button style={{ background: 'var(--ink-cobalt-140)', border: 'none', color: 'white', padding: '0 16px', height: 40, borderRadius: '4px 0 0 4px', cursor: 'pointer', fontSize: 'var(--ink-font-size-sm)', fontFamily: 'var(--ink-font-family-default)' }}>Download</button>
          <button aria-label="More actions" style={{ background: 'var(--ink-cobalt-140)', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.2)', color: 'white', width: 40, height: 40, borderRadius: '0 4px 4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevron-down" size={16} />
          </button>
        </div>
      </div>

      {/* Row 2: Document controls bar — full width */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 'var(--ink-spacing-200)', padding: 'var(--ink-spacing-50) var(--ink-spacing-100)',
        borderBottom: '1px solid var(--ink-border-subtle)',
        background: 'var(--ink-bg-color-default)',
        minHeight: 40, position: 'relative',
      }}>
        <Inline gap="small" align="center" style={{ whiteSpace: 'nowrap' }}>
          <Input style={{ width: 36, textAlign: 'center', padding: '2px 4px' }} value="1" readOnly />
          <Text size="sm" color="secondary" style={{ whiteSpace: 'nowrap' }}>/ 5</Text>
          <IconButton icon="chevron-up" variant="tertiary" size="small" aria-label="Previous page" />
          <IconButton icon="chevron-down" variant="tertiary" size="small" aria-label="Next page" />
        </Inline>
        <div style={{ width: 1, height: 16, background: 'var(--ink-border-subtle)' }} />
        <Inline gap="small" align="center">
          <IconButton icon="zoom-in" variant="tertiary" size="small" aria-label="Zoom in" />
          <Text size="xs">100%</Text>
          <IconButton icon="zoom-out" variant="tertiary" size="small" aria-label="Zoom out" />
        </Inline>
        <IconButton icon="search" variant="tertiary" size="small" aria-label="Search document" style={{ position: 'absolute', right: 'var(--ink-spacing-100)' }} />
      </div>

      {/* Row 3: left sidebar + detail panel + document */}
      <div style={{ display: 'grid', gridTemplateColumns: activeDetailTab ? '64px 380px 1fr' : '64px 1fr', overflow: 'hidden' }}>
        {/* Left icon sidebar — controls right panel tabs */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 4px', gap: '16px',
          background: 'white',
          width: 64,
        }}>
          {DETAIL_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSidebarTabClick(tab.id)}
              aria-label={tab.label}
              style={{
                width: 40, height: 40,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: activeDetailTab === tab.id ? 'var(--ink-cobalt-140)' : 'transparent',
                color: activeDetailTab === tab.id ? 'rgba(255,255,255,0.9)' : 'var(--ink-neutral-140)',
              }}
            >
              <Icon name={tab.icon} size={20} />
            </button>
          ))}
        </div>

        {/* Detail panel — LEFT side, toggled by sidebar icons, no tab bar */}
        {activeDetailTab && (
          <div style={{
            borderRight: '1px solid var(--ink-border-subtle)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: 'var(--ink-bg-color-default)',
          }}>
            <div style={{ overflow: 'auto', height: 'calc(100vh - 104px)' }}>
              {activeDetailTab === 'details' && (
                <>
                  <div style={{ padding: 'var(--ink-spacing-150) var(--ink-spacing-200)', display: 'flex', alignItems: 'center', gap: 'var(--ink-spacing-100)' }}>
                    <Heading level={2}>Details</Heading>
                    <IconButton icon="edit" variant="tertiary" size="small" aria-label="Edit" />
                    <IconButton icon="plus" variant="tertiary" size="small" aria-label="Create new Fields or Clauses" />
                  </div>
                  {detailContent}
                </>
              )}
              {activeDetailTab === 'obligations' && (
                <div style={{ padding: 'var(--ink-spacing-200)' }}>
                  <Heading level={2}>Obligations</Heading>
                  <Text size="sm" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>No obligations found.</Text>
                </div>
              )}
              {activeDetailTab === 'sets' && (
                <div style={{ padding: 'var(--ink-spacing-200)' }}>
                  <Heading level={2}>Agreement sets</Heading>
                  <Text size="sm" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>No agreement sets.</Text>
                </div>
              )}
              {activeDetailTab === 'related' && (
                <div style={{ padding: 'var(--ink-spacing-200)' }}>
                  <Heading level={2}>Related agreements</Heading>
                  <Text size="sm" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>No related agreements.</Text>
                </div>
              )}
              {activeDetailTab === 'chat' && (
                <div style={{ padding: 'var(--ink-spacing-200)' }}>
                  <Heading level={2}>Chat</Heading>
                  <Text size="sm" color="secondary" style={{ marginTop: 'var(--ink-spacing-100)' }}>Start a conversation about this agreement.</Text>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Document viewer — RIGHT side */}
        <div style={{
          background: 'var(--ink-bg-color-subtle)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Document */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: 'var(--ink-spacing-300)' }}>
            <div style={{
              width: 680, maxWidth: '100%', background: 'white', borderRadius: 'var(--ink-radius-size-m)',
              boxShadow: 'var(--ink-shadow-elevation-2)',
              padding: 'var(--ink-spacing-400) var(--ink-spacing-500)',
              minHeight: 900,
            }}>
              <Stack gap="medium">
                <Text size="xs" color="secondary" style={{ textAlign: 'right' }}>2135C Central Parkway Cincinnati, OH 45214</Text>
                <Heading level={2} style={{ textAlign: 'center', fontFamily: 'serif' }}>batterii</Heading>
                <Text size="xs" color="secondary" style={{ textAlign: 'center' }}>Inspiring Innovation™</Text>
                <Heading level={3}>Master Licensing Agreement</Heading>
                <Text size="sm">
                  This Agreement (the &quot;License&quot;) is for the use of the Batterii SaaS Platform (&quot;Batterii&quot;) as defined below. Use of Batterii SaaS Platform is expressly conditioned upon acceptance of &quot;Company Name&quot; (&quot;Master Licensee&quot;) and compliance with the following terms and conditions.
                </Text>
                <Heading level={4}>1.0 Definitions</Heading>
                <Text size="sm">The following terms have the meaning set forth herein:</Text>
                <Text size="sm"><strong>Customer Data</strong> — All materials, including but not limited to graphic, picture, text, audio, video, software or information not generated by Batterii...</Text>
                <Text size="sm"><strong>Privacy Policy</strong> — The Batterii Privacy Policy identifies the manner in which Batterii obtains, accesses and provides others with access to information obtained by Batterii...</Text>
                <Heading level={4}>2.0 Grant of License</Heading>
                <Text size="sm">Batterii grants Master Licensee, a non-exclusive, non-transferable, worldwide right to use Batterii SaaS as set forth herein.</Text>
                <Heading level={4}>3.0 Fee and Payment</Heading>
                <Text size="sm">The License fee shall be billed in advance of the usage by mutually agreed time periods; typically quarterly, semi-annually or annually.</Text>
                <Heading level={4}>4.0 License Term</Heading>
                <Text size="sm">This license shall be for the agreed term unless terminated in writing by Master Licensee or by Batterii.</Text>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash as TabId) ? (hash as TabId) : 'home';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(getTabFromHash);
  const [sidebarView, setSidebarView] = useState<SidebarView>('all-agreements');
  const [templatesSidebarView, setTemplatesSidebarView] = useState<TemplatesSidebarView>('my-templates');
  const [insightsSidebarView, setInsightsSidebarView] = useState<InsightsSidebarView>('overview');
  const [search, setSearch] = useState('');
  const [showAgreementDetail, setShowAgreementDetail] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [showDealWorkspace, setShowDealWorkspace] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  /* ── Sync hash ↔ state ── */
  useEffect(() => {
    const onHashChange = () => {
      setActiveTab(getTabFromHash());
      setSearch('');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    window.location.hash = tabId;
    if (tabId === 'agreements') setSidebarView('all-agreements');
    if (tabId === 'templates') setTemplatesSidebarView('my-templates');
    if (tabId === 'insights') setInsightsSidebarView('overview');
  }, []);

  /* ── GlobalNav — matches production DocuSign comp ── */
  const globalNavConfig = {
    logo: <img src="/docusign-logo.svg" alt="DocuSign" />,
    showAppSwitcher: false,
    onAppSwitcherClick: () => {},
    navItems: [
      { id: 'home',       label: 'Home',        active: activeTab === 'home',       onClick: () => handleTabClick('home') },
      { id: 'agreements', label: 'Agreements',   active: activeTab === 'agreements', onClick: () => handleTabClick('agreements') },
      { id: 'templates',  label: 'Templates',    active: activeTab === 'templates',  onClick: () => handleTabClick('templates') },
      { id: 'admin',      label: 'Admin',        active: activeTab === 'admin',      onClick: () => handleTabClick('admin') },
    ],
    showSettings: true,
    settingsIcon: 'sliders-horizontal' as const,
    user: { name: 'Kathie P' },
  };

  /* ── LocalNav — Agreements tab ── */
  const agreementsSidebar = {
    headerLabel: 'Start',
    headerIcon: 'plus' as const,
    onHeaderClick: () => setShowStartModal(true),
    activeItemId: sidebarView,
    sections: [
      {
        id: 'agreements',
        items: [
          { id: 'all-agreements', label: 'All Agreements', icon: 'envelope' as const, onClick: () => setSidebarView('all-agreements') },
          { id: 'drafts', label: 'Drafts', nested: true, onClick: () => setSidebarView('drafts') },
          { id: 'in-progress', label: 'In Progress', nested: true, onClick: () => setSidebarView('in-progress') },
          { id: 'completed', label: 'Completed', nested: true, onClick: () => setSidebarView('completed') },
        ],
      },
      { id: 'folders-divider', hasDivider: true, items: [
        { id: 'folders-item', label: 'Folders', icon: 'folder' as const, hasMenu: true },
      ]},
      {
        id: 'features',
        hasDivider: true,
        items: [
          { id: 'parties', label: 'Parties', icon: 'building-person' as const, onClick: () => setSidebarView('parties') },
          { id: 'requests', label: 'Requests', icon: 'ticket' as const, onClick: () => setSidebarView('requests') },
        ],
      },
    ],
  };

  /* ── Templates sidebar — matches production DocuSign ── */
  const templatesSidebar = {
    headerLabel: 'Start',
    headerIcon: 'plus' as const,
    headerMenuItems: [
      { id: 'new-template', label: 'Create Template', icon: 'edit' as const },
      { id: 'upload-template', label: 'Upload Template', icon: 'upload' as const },
    ],
    activeItemId: templatesSidebarView,
    sections: [
      {
        id: 'envelope-templates',
        items: [
          { id: 'envelope-templates-header', label: 'Envelope Templates', icon: 'templates' as const, onClick: () => setTemplatesSidebarView('my-templates') },
          { id: 'my-templates', label: 'My Templates', nested: true, onClick: () => setTemplatesSidebarView('my-templates') },
          { id: 'shared-with-me', label: 'Shared with Me', nested: true, onClick: () => setTemplatesSidebarView('shared-with-me') },
          { id: 'favorites', label: 'Favorites', nested: true, onClick: () => setTemplatesSidebarView('favorites') },
        ],
      },
      {
        id: 'other-templates',
        hasDivider: true,
        items: [
          { id: 'document-templates', label: 'Document Templates', icon: 'document' as const, badge: 'New' },
          { id: 'workflow-templates', label: 'Workflow Templates', icon: 'workflow' as const, badge: 'New' },
        ],
      },
      {
        id: 'web-forms',
        hasDivider: true,
        items: [
          { id: 'web-forms-header', label: 'Web Forms', icon: 'globe-language' as const },
          { id: 'my-web-forms', label: 'My Web Forms', nested: true },
          { id: 'shared-web-forms', label: 'Shared with Me', nested: true },
          { id: 'all-web-forms', label: 'All Web Forms', nested: true, onClick: () => setTemplatesSidebarView('all-templates') },
          { id: 'template-gallery', label: 'Template Gallery', nested: true, badge: 'New' },
        ],
      },
    ],
  };

  /* ── Insights sidebar — matches production DocuSign Reports ── */
  const insightsSidebar = {
    headerLabel: 'Create',
    headerIcon: 'plus' as const,
    activeItemId: insightsSidebarView,
    sections: [
      {
        id: 'insights-overview',
        items: [
          { id: 'overview', label: 'Overview', icon: 'home' as const, onClick: () => setInsightsSidebarView('overview') },
        ],
      },
      {
        id: 'insights-dashboards',
        hasDivider: true,
        items: [
          { id: 'dashboards', label: 'Dashboards', icon: 'layout-grid' as const, onClick: () => setInsightsSidebarView('dashboards') },
          { id: 'my-dashboard', label: 'My dashboard', nested: true, onClick: () => setInsightsSidebarView('dashboards') },
          { id: 'admin-dashboard', label: 'Administrator dashboard', nested: true, onClick: () => setInsightsSidebarView('dashboards') },
          { id: 'agreements-dashboard', label: 'Agreements', nested: true, onClick: () => setInsightsSidebarView('dashboards') },
          { id: 'obligations-dashboard', label: 'Obligations', nested: true, onClick: () => setInsightsSidebarView('dashboards') },
          { id: 'renewals-dashboard', label: 'Renewals', nested: true, onClick: () => setInsightsSidebarView('dashboards') },
          { id: 'requests-dashboard', label: 'Requests', nested: true, onClick: () => setInsightsSidebarView('dashboards') },
        ],
      },
      {
        id: 'insights-reports',
        hasDivider: true,
        items: [
          { id: 'reports', label: 'Reports', icon: 'bar-chart-2' as const, onClick: () => setInsightsSidebarView('reports') },
        ],
      },
    ],
  };

  /* ── View-filtered data (Sales Agreement Workspaces) ── */
  const viewAgreements = useMemo(() => {
    switch (sidebarView) {
      case 'drafts':
        return AGREEMENTS_DATA.filter(a => a.status === 'Draft');
      case 'in-progress':
        return AGREEMENTS_DATA.filter(a => a.status === 'In Progress');
      case 'completed':
        return AGREEMENTS_DATA.filter(a => a.status === 'Completed');
      case 'deleted':
        return AGREEMENTS_DATA.filter(a => ['Expired', 'Voided'].includes(a.status));
      default:
        return AGREEMENTS_DATA;
    }
  }, [sidebarView]);

  const filteredAgreements = useMemo(() => {
    if (!search) return viewAgreements;
    const q = search.toLowerCase();
    return viewAgreements.filter((a) => a.name.toLowerCase().includes(q) || a.party.toLowerCase().includes(q));
  }, [search, viewAgreements]);

  const filteredParties = useMemo(() => {
    if (!search) return PARTIES_DATA;
    const q = search.toLowerCase();
    return PARTIES_DATA.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
  }, [search]);

  const VIEW_LABELS: Record<SidebarView, string> = {
    'all-agreements': 'All Agreements', drafts: 'Drafts', 'in-progress': 'In Progress',
    completed: 'Completed', deleted: 'Expired / Voided', parties: 'Parties', requests: 'Requests',
  };

  const isPartiesView = sidebarView === 'parties';
  const isNavigatorView = sidebarView === 'completed';
  const isRequestsView = sidebarView === 'requests';

  /* ── Navigator filtered data ── */
  const filteredNavigator = useMemo(() => {
    if (!search) return NAVIGATOR_DATA;
    const q = search.toLowerCase();
    return NAVIGATOR_DATA.filter(a => a.fileName.toLowerCase().includes(q) || a.parties.some(p => p.toLowerCase().includes(q)));
  }, [search]);

  /* ── Requests filtered data ── */
  const filteredRequests = useMemo(() => {
    if (!search) return REQUESTS_DATA;
    const q = search.toLowerCase();
    return REQUESTS_DATA.filter(r => r.title.toLowerCase().includes(q) || r.requestId.toLowerCase().includes(q));
  }, [search]);

  /* ── Templates filtered data ── */
  const viewTemplates = useMemo(() => {
    switch (templatesSidebarView) {
      case 'my-templates':
        return TEMPLATES_DATA.filter(t => t.owner === 'Akshat Mishra');
      case 'shared-with-me':
        return TEMPLATES_DATA.filter(t => t.shared && t.owner !== 'Akshat Mishra');
      case 'favorites':
        return TEMPLATES_DATA.filter(t => t.favorited);
      default:
        return TEMPLATES_DATA;
    }
  }, [templatesSidebarView]);

  const filteredTemplates = useMemo(() => {
    if (!search) return viewTemplates;
    const q = search.toLowerCase();
    return viewTemplates.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [search, viewTemplates]);

  /* ── Reports filtered data ── */
  const viewReports = useMemo(() => {
    if (insightsSidebarView === 'dashboards') return REPORTS_DATA.filter(r => r.type === 'dashboard');
    return REPORTS_DATA;
  }, [insightsSidebarView]);

  const filteredReports = useMemo(() => {
    if (!search) return viewReports;
    const q = search.toLowerCase();
    return viewReports.filter(r => r.name.toLowerCase().includes(q));
  }, [search, viewReports]);

  const TEMPLATE_VIEW_LABELS: Record<TemplatesSidebarView, string> = {
    'my-templates': 'My Templates', 'shared-with-me': 'Shared with Me',
    favorites: 'Favorites', 'all-templates': 'All Templates',
  };

  const INSIGHTS_VIEW_LABELS: Record<InsightsSidebarView, string> = {
    overview: 'Overview', dashboards: 'Dashboards', reports: 'Reports',
  };

  /* ── Templates content ── */
  const templatesContent = (
    <AgreementTableView
      pageHeader={
        <PageHeader
          title={TEMPLATE_VIEW_LABELS[templatesSidebarView]}
          actions={
            <>
              <Button kind="secondary" startElement={<Icon name="upload" size={16} />}>Upload</Button>
              <Button kind="secondary">New Template</Button>
            </>
          }
        />
      }
      filterBar={
        <FilterBar
          search={{
            value: search,
            onChange: setSearch,
            placeholder: 'Search templates...',
          }}
          filters={
            <Inline gap="small" align="center" style={{ flexWrap: 'nowrap' }}>
              <Button kind="secondary" size="small" menuTrigger>Owner</Button>
              <Button kind="secondary" size="small" menuTrigger>Shared</Button>
              <Button kind="secondary" size="small" startElement={<Icon name="filter" size={14} />}>All Filters</Button>
            </Inline>
          }
        />
      }
    >
      <DataTable
        columns={templateColumns}
        data={filteredTemplates}
        getRowKey={(row) => row.id}
        stickyHeader
        showColumnControl
        emptyMessage="No templates found"
        pagination={{ page: 1, pageSize: 25, totalItems: filteredTemplates.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }}
      />
    </AgreementTableView>
  );

  /* ── Insights content ── */
  const insightsContent = insightsSidebarView === 'overview' ? (
    <InsightsOverview />
  ) : (
    <AgreementTableView
      pageHeader={
        <PageHeader
          title={INSIGHTS_VIEW_LABELS[insightsSidebarView]}
          actions={
            <Button kind="secondary" startElement={<Icon name="plus" size={16} />}>
              {insightsSidebarView === 'dashboards' ? 'New Dashboard' : 'New Report'}
            </Button>
          }
        />
      }
      filterBar={
        <FilterBar
          search={{
            value: search,
            onChange: setSearch,
            placeholder: insightsSidebarView === 'dashboards' ? 'Search dashboards...' : 'Search reports...',
          }}
          filters={
            <Inline gap="small" align="center" style={{ flexWrap: 'nowrap' }}>
              <Button kind="secondary" size="small" menuTrigger>Type</Button>
              <Button kind="secondary" size="small" menuTrigger>Owner</Button>
            </Inline>
          }
        />
      }
    >
      <DataTable
        columns={reportColumns}
        data={filteredReports}
        getRowKey={(row) => row.id}
        stickyHeader
        showColumnControl
        emptyMessage={insightsSidebarView === 'dashboards' ? 'No dashboards found' : 'No reports found'}
        pagination={{ page: 1, pageSize: 25, totalItems: filteredReports.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }}
      />
    </AgreementTableView>
  );

  /* ── Agreements content ── */
  const agreementsContent = (
    <AgreementTableView
      pageHeader={
        <PageHeader
          title={isPartiesView ? 'Parties' : isRequestsView ? 'Requests' : VIEW_LABELS[sidebarView]}
          showAIBadge={isPartiesView}
          aiBadgeText="AI-Assisted"
          actions={isPartiesView
            ? (<>
                <IconButton icon="bar-chart-2" variant="tertiary" size="small" aria-label="Analytics" />
                <Button kind="secondary" startElement={<Icon name="settings" size={16} />}>Manage Parties</Button>
              </>)
            : isRequestsView
            ? <Button kind="secondary">Create Request</Button>
            : null
          }
        />
      }
      filterBar={
        <FilterBar
          viewSelector={isPartiesView ? (
            <Button kind="secondary" size="small" menuTrigger>Role View</Button>
          ) : undefined}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: isPartiesView ? 'Search parties...'
              : isRequestsView ? 'Search Request Titles or IDs...'
              : 'Search agreements',
          }}
          showSearchIndicator={false}
          quickActions={isRequestsView ? [
            <IconButton key="bm" icon="bookmark" variant="secondary" size="small" aria-label="Bookmarks" />,
          ] : undefined}
          filters={isPartiesView ? (
            <Inline gap="small" align="center" style={{ flexWrap: 'nowrap' }}>
              <Button kind="secondary" size="small" menuTrigger>Party Roles</Button>
              <Button kind="secondary" size="small" menuTrigger>Party Side</Button>
            </Inline>
          ) : isRequestsView ? (
            <Inline gap="small" align="center" style={{ flexWrap: 'nowrap' }}>
              <Chip onRemove={() => {}}>Status Type: Open</Chip>
              <Button kind="secondary" size="small" menuTrigger>Created At</Button>
              <Button kind="secondary" size="small" menuTrigger>Due Date</Button>
              <Button kind="secondary" size="small" menuTrigger>Last Activity At</Button>
              <Button kind="secondary" size="small" menuTrigger>Owner</Button>
              <Button kind="secondary" size="small" aria-label="All Filters" style={{ minWidth: 'auto', padding: '0 8px' }}>
                <Icon name="filter" size={16} />
              </Button>
            </Inline>
          ) : (
            <Inline gap="small" align="center" style={{ flexWrap: 'nowrap' }}>
              <Button kind="secondary" size="small" menuTrigger>Party</Button>
              <Button kind="secondary" size="small" menuTrigger>Type</Button>
              <Button kind="secondary" size="small" menuTrigger>Status</Button>
              <Button kind="secondary" size="small" menuTrigger>Owner</Button>
              <Button kind="secondary" size="small" aria-label="All Filters" style={{ minWidth: 'auto', padding: '0 8px' }}>
                <Icon name="filter" size={16} />
              </Button>
            </Inline>
          )}
        />
      }
    >
      {isPartiesView ? (
        <DataTable columns={partyColumns} data={filteredParties} getRowKey={(row) => row.id} stickyHeader showColumnControl emptyMessage="No parties match your search" pagination={{ page: 1, pageSize: 25, totalItems: 1334, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      ) : isRequestsView ? (
        <DataTable columns={requestColumns} data={filteredRequests} getRowKey={(row) => row.id} stickyHeader showColumnControl rowHeight="tall" emptyMessage="No requests found" pagination={{ page: 1, pageSize: 10, totalItems: filteredRequests.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      ) : (
        <DataTable columns={agreementColumns} data={filteredAgreements} getRowKey={(row) => row.id} selectable stickyHeader showColumnControl rowHeight="tall" emptyMessage={
          sidebarView === 'drafts' ? 'No draft agreements' :
          sidebarView === 'in-progress' ? 'No agreements in progress' :
          sidebarView === 'completed' ? 'No completed agreements' :
          'No agreements match your search'
        } onRowClick={(row: Agreement) => {
          setSelectedAgreement(row);
          setShowDealWorkspace(true);
        }} pagination={{ page: 1, pageSize: 25, totalItems: filteredAgreements.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      )}
    </AgreementTableView>
  );

  /* ── Resolve content + sidebar ── */
  const sidebarMap: Record<TabId, object | undefined> = {
    home: undefined,
    agreements: agreementsSidebar,
    templates: templatesSidebar,
    insights: insightsSidebar,
    admin: undefined,
  };

  const contentMap: Record<TabId, JSX.Element> = {
    home: <HomePage />,
    agreements: agreementsContent,
    templates: templatesContent,
    insights: insightsContent,
    admin: <AdminPage />,
  };

  /* ── Transition key — changes on tab OR sidebar view to trigger animation ── */
  const transitionKey = `${activeTab}-${sidebarView}-${templatesSidebarView}-${insightsSidebarView}`;

  return (
    <>
    <style>{tableRowStaggerStyles}</style>
    <DocuSignShell
      globalNav={globalNavConfig}
      localNav={sidebarMap[activeTab]}
    >
      <FadeIn keyProp={transitionKey} key={transitionKey}>
        <div className="page-transition" style={{ flex: 1 }}>
          {contentMap[activeTab]}
        </div>
      </FadeIn>
      <Footer />
    </DocuSignShell>
    {showAgreementDetail && (
      <AgreementDetailView onClose={() => setShowAgreementDetail(false)} />
    )}
    {showDealWorkspace && selectedAgreement && (
      <WorkspaceView agreement={selectedAgreement} onClose={() => {
        setShowDealWorkspace(false);
        setSelectedAgreement(null);
      }} />
    )}
    <StartNewModal open={showStartModal} onClose={() => setShowStartModal(false)} />
    </>
  );
}
