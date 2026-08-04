import React, { useState, useMemo, useCallback, useEffect, useRef, createContext, useContext, type CSSProperties } from 'react';
import {
  DocuSignShell,
  AgreementTableView,
  DataTable,
  PageHeader,
  FilterBar,
  Button,
  Banner,
  Badge,
  Breadcrumb,
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
  Tooltip,
  Drawer,
  Link,
  ProgressBar,
  SearchInput,
  Alert,
  AlertBadge,
  Modal,
  Popover,
  Dropdown,
  Checkbox,
  Radio,
  dataTableStyles,
} from '@/design-system';

/* ═══════════════════════════════════════
   FilePickerDialog Component
   macOS-style "Open" file picker, shared by
   the Start New modal and the Agreement Space
   Add menu (Document).
   ═══════════════════════════════════════ */

interface PickerFile { name: string; kind: string; size: string; modified: string }

interface FilePickerDialogProps {
  open: boolean;
  onCancel: () => void;
  onOpen: (fileName: string) => void;
  // Optional custom file list. When omitted, the default vendor/procurement
  // files are shown. The Permission Slip space passes a school-relevant list.
  files?: PickerFile[];
}

// Default Finder-style file list. "New Vendor MSA" stays pinned at the top.
const DEFAULT_PICKER_FILES: PickerFile[] = [
  { name: 'New Vendor MSA', kind: 'PDF Document', size: '248 KB', modified: 'Today, 9:41 AM' },
  { name: 'Master Services Template', kind: 'Word Document', size: '182 KB', modified: 'Yesterday, 4:12 PM' },
  { name: 'Vendor Onboarding Packet', kind: 'PDF Document', size: '1.4 MB', modified: 'May 8, 2026' },
  { name: '2026 Budget Proposal', kind: 'Word Document', size: '96 KB', modified: 'May 2, 2026' },
  { name: 'Statement of Work Q3', kind: 'PDF Document', size: '311 KB', modified: 'Apr 28, 2026' },
  { name: 'Non-Disclosure Agreement', kind: 'PDF Document', size: '204 KB', modified: 'Apr 24, 2026' },
];

function FilePickerDialog({ open, onCancel, onOpen, files }: FilePickerDialogProps) {
  const pickerFiles = files && files.length > 0 ? files : DEFAULT_PICKER_FILES;
  const [selectedFile, setSelectedFile] = useState(pickerFiles[0].name);

  // Keep the default selection in sync with the active file list (e.g. when the
  // school-specific list is provided) so the first row is preselected.
  useEffect(() => {
    if (open) setSelectedFile(pickerFiles[0].name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, files]);

  if (!open) return null;

  const handleOpen = () => onOpen(selectedFile);

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(19, 0, 50, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1400,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 720,
          maxWidth: '92vw',
          height: 460,
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ECECEC',
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.18)',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Title bar with traffic lights + centered title */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 40,
          padding: '0 14px',
          background: 'linear-gradient(#F6F6F6, #E4E4E4)',
          borderBottom: '1px solid rgba(0,0,0,0.12)',
        }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', border: '0.5px solid rgba(0,0,0,0.12)' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E', border: '0.5px solid rgba(0,0,0,0.12)' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840', border: '0.5px solid rgba(0,0,0,0.12)' }} />
          <span style={{
            position: 'absolute', left: 0, right: 0, textAlign: 'center',
            fontSize: 13, fontWeight: 600, color: '#3D3D3D', pointerEvents: 'none',
          }}>
            Open
          </span>
        </div>

        {/* Location toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 44,
          padding: '0 14px',
          background: 'linear-gradient(#FBFBFB, #F0F0F0)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', gap: 2, color: '#9B9B9B' }}>
            <Icon name="chevron-left" size={16} color="currentColor" />
            <span style={{ color: '#3D3D3D' }}><Icon name="chevron-right" size={16} color="currentColor" /></span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', background: 'white',
            border: '1px solid rgba(0,0,0,0.14)', borderRadius: 6,
            fontSize: 13, color: '#3D3D3D', fontWeight: 500,
          }}>
            <Icon name="folder" size={15} color="#5AACF5" />
            Documents
            <Icon name="chevron-down" size={13} color="#9B9B9B" />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            width: 150, padding: '4px 8px', background: 'white',
            border: '1px solid rgba(0,0,0,0.14)', borderRadius: 6,
            fontSize: 13, color: '#9B9B9B',
          }}>
            <Icon name="search" size={14} color="#9B9B9B" />
            Search
          </div>
        </div>

        {/* Body: sidebar + file list */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Favorites sidebar */}
          <div style={{
            width: 176,
            flexShrink: 0,
            padding: '10px 8px',
            background: 'rgba(230,230,232,0.9)',
            borderRight: '1px solid rgba(0,0,0,0.1)',
            overflowY: 'auto',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#8A8A8A', padding: '2px 8px 6px' }}>
              Favorites
            </div>
            {[
              { label: 'AirDrop', icon: 'download' },
              { label: 'Recents', icon: 'clock' },
              { label: 'Applications', icon: 'grid' },
              { label: 'Desktop', icon: 'desktop' },
              { label: 'Documents', icon: 'folder', active: true },
              { label: 'Downloads', icon: 'download' },
            ].map((item) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 8px', borderRadius: 6, marginBottom: 1,
                fontSize: 13, fontWeight: item.active ? 600 : 400,
                color: item.active ? '#1D1D1F' : '#3D3D3D',
                background: item.active ? 'rgba(0,0,0,0.08)' : 'transparent',
              }}>
                <Icon name={item.icon === 'grid' || item.icon === 'desktop' ? 'folder' : item.icon} size={15} color="#5AACF5" />
                {item.label}
              </div>
            ))}
          </div>

          {/* File list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', minWidth: 0 }}>
            {/* Column headers */}
            <div style={{
              display: 'flex', alignItems: 'center',
              height: 26, padding: '0 12px', flexShrink: 0,
              background: 'linear-gradient(#FCFCFC, #F1F1F1)',
              borderBottom: '1px solid rgba(0,0,0,0.12)',
              fontSize: 11, fontWeight: 600, color: '#6E6E6E',
            }}>
              <span style={{ flex: 1 }}>Name</span>
              <span style={{ width: 150, borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: 10 }}>Date Modified</span>
              <span style={{ width: 70, borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: 10, textAlign: 'right' }}>Size</span>
              <span style={{ width: 110, borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: 10 }}>Kind</span>
            </div>

            {/* Rows */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {pickerFiles.map((file, i) => {
                const isSelected = selectedFile === file.name;
                return (
                  <div
                    key={file.name}
                    onClick={() => setSelectedFile(file.name)}
                    onDoubleClick={handleOpen}
                    style={{
                      display: 'flex', alignItems: 'center',
                      height: 30, padding: '0 12px', cursor: 'default',
                      fontSize: 13,
                      color: isSelected ? 'white' : '#1D1D1F',
                      background: isSelected ? '#3268E6' : (i % 2 === 1 ? '#F4F7FE' : 'white'),
                    }}
                  >
                    <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <Icon name="document" size={16} color={isSelected ? 'white' : '#5AACF5'} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    </span>
                    <span style={{ width: 150, paddingLeft: 10, color: isSelected ? 'rgba(255,255,255,0.85)' : '#8A8A8A' }}>{file.modified}</span>
                    <span style={{ width: 70, paddingLeft: 10, textAlign: 'right', color: isSelected ? 'rgba(255,255,255,0.85)' : '#8A8A8A' }}>{file.size}</span>
                    <span style={{ width: 110, paddingLeft: 10, color: isSelected ? 'rgba(255,255,255,0.85)' : '#8A8A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.kind}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          height: 52,
          padding: '0 16px',
          background: 'linear-gradient(#F4F4F4, #E7E7E7)',
          borderTop: '1px solid rgba(0,0,0,0.12)',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '5px 16px', borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: '1px solid rgba(0,0,0,0.18)', background: 'linear-gradient(#FFFFFF, #F2F2F2)',
              color: '#1D1D1F', cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleOpen}
            style={{
              padding: '5px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600,
              border: '1px solid #2657CE', background: 'linear-gradient(#4C86F0, #2F6BE0)',
              color: 'white', cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   StartNewModal Component
   ═══════════════════════════════════════ */

interface StartNewModalProps {
  open: boolean;
  onClose: () => void;
  onStartBlank: () => void;
  onStartNDA: () => void;
  onStartPurchase: () => void;
  onStartRequest: () => void;
  onSignatureRequest: () => void;
  onPreviewDocument?: (documentName: string) => void;
}

function StartNewModal({ open, onClose, onStartBlank, onStartNDA, onStartPurchase, onStartRequest, onSignatureRequest, onPreviewDocument }: StartNewModalProps) {
  const [search, setSearch] = useState('');
  const [showFilePicker, setShowFilePicker] = useState(false);

  const handleSelectFile = (fileName: string) => {
    setShowFilePicker(false);
    onClose();
    // Open the in-app document preview with the selected document loaded
    // (same preview screen the View CTA opens in an Agreement Space).
    onPreviewDocument?.(fileName);
  };

  // The Simple Use Case version tailors the Start New options for a
  // school/education scenario and drops the "New Request" option.
  const { version } = usePrototypeVersion();
  const agreements = version === 'simple'
    ? [
        { id: 'blank', title: 'Start Blank', description: 'Create a new agreement from scratch.' },
        { id: 'nda', title: 'Permission Slip', description: 'Fill and send a standard permission slip.' },
        { id: 'purchase', title: 'Field Trip', description: 'Includes permission slips, vendor contracts, and waivers.' },
      ]
    : [
        { id: 'blank', title: 'Start Blank', description: 'Create a new agreement from scratch.' },
        { id: 'nda', title: 'Instant NDA', description: 'Instantly generate an NDA and automatically send out for e-signature.' },
        { id: 'purchase', title: 'Purchase Agreement', description: 'Initiate a purchase with a new or existing vendor.' },
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
                  {item.id === 'blank' ? (
                    /* Upload split button — matches the one on Prepare */
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <button
                        onClick={() => setShowFilePicker(true)}
                        style={{
                          background: 'var(--ink-cta-bg-color-secondary-default)',
                          border: '1px solid var(--ink-cta-border-color-secondary-default)',
                          borderRadius: '6px 0 0 6px',
                          height: 32,
                          padding: '0 18px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 500,
                          color: 'var(--ink-cta-font-color-secondary)',
                          fontFamily: 'var(--ink-font-family)',
                        }}
                      >
                        Upload
                      </button>
                      <button
                        aria-label="Upload options"
                        style={{
                          background: 'var(--ink-cta-bg-color-secondary-default)',
                          border: '1px solid var(--ink-cta-border-color-secondary-default)',
                          borderLeft: 'none',
                          borderRadius: '0 6px 6px 0',
                          height: 32,
                          padding: '0 8px',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Icon name="chevron-down" size={14} color="var(--ink-cta-font-color-secondary)" />
                      </button>
                    </div>
                  ) : (
                    <Button 
                      kind="secondary" 
                      size="small"
                      onClick={() => {
                        if (item.id === 'nda') {
                          onClose();
                          onStartNDA();
                        } else if (item.id === 'purchase') {
                          onClose();
                          onStartPurchase();
                        } else if (item.id === 'legal') {
                          onClose();
                          onStartRequest();
                        }
                      }}
                    >Start</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Tasks section */}
        <div>
          <p style={{
            margin: '0 0 12px 0',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--ink-font-family)',
            color: '#130032',
          }}>Other</p>

          <div style={{ display: 'flex', gap: 12 }}>
            {[
              {
                label: 'Signature Request',
                onClick: () => { onClose(); onSignatureRequest(); },
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.41 17.9989L5.41 16.9983H8.24L18.11 7.12285C18.7 6.53252 19 5.76209 19 4.99166C19 4.22123 18.7 3.46081 18.11 2.88049C17.52 2.29016 16.76 2 15.99 2C15.22 2 14.45 2.29016 13.87 2.88049L4 12.756V15.5875L2 17.5887V20H22V17.9989H4.41ZM5.9 13.5364L15.21 4.22123C15.42 4.01112 15.69 3.90106 15.99 3.90106C16.29 3.90106 16.56 4.01112 16.77 4.22123C16.98 4.43135 17.09 4.7015 17.09 5.00167C17.09 5.30183 16.98 5.57198 16.77 5.7821L7.46 15.0973H5.9V13.5364Z" fill="#6B6B80"/>
                  </svg>
                ),
              },
              {
                label: 'Sign a Document',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.5" y="1.5" width="11" height="15" rx="1.5" stroke="#130032" strokeWidth="1.25"/>
                    <path d="M10.5 1.5V5.5H14.5" stroke="#130032" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11.5L13.5 10L15.5 12L14 13.5L12 11.5Z" stroke="#130032" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.5 10L15 8.5L16.5 10L15 11.5" stroke="#130032" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13.5L11 16L13.5 15.5" stroke="#130032" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                label: 'Use a Template',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="1.5" width="15" height="15" rx="1.5" stroke="#130032" strokeWidth="1.25"/>
                    <path d="M1.5 6.5H16.5" stroke="#130032" strokeWidth="1.25"/>
                    <path d="M7 6.5V16.5" stroke="#130032" strokeWidth="1.25"/>
                  </svg>
                ),
              },
              {
                label: 'Create a Form',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.5" y="4.5" width="15" height="9" rx="1.5" stroke="#130032" strokeWidth="1.25"/>
                    <path d="M5 9H13" stroke="#130032" strokeWidth="1.25" strokeLinecap="round"/>
                    <path d="M5 12H9" stroke="#130032" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map((task) => (
              <button
                key={task.label}
                onClick={'onClick' in task ? task.onClick : undefined}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 16px',
                  border: '1px solid var(--ink-neutral-fade-10)',
                  borderRadius: 8,
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: 'var(--ink-font-family)',
                  fontSize: 14,
                  fontWeight: 400,
                  color: '#130032',
                  textAlign: 'left',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-neutral-fade-30)';
                  e.currentTarget.style.background = 'var(--ink-neutral-fade-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ink-neutral-fade-10)';
                  e.currentTarget.style.background = 'white';
                }}
              >
                <span style={{ flexShrink: 0 }}>{task.icon}</span>
                {task.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Fake (prototype) file picker — not the real OS dialog */}
      <FilePickerDialog
        open={showFilePicker}
        onCancel={() => setShowFilePicker(false)}
        onOpen={handleSelectFile}
      />

    </Modal>
  );
}



/* ═══════════════════════════════════════
   AgreementRequestModal Component
   ═══════════════════════════════════════ */

interface AgreementRequestFormData {
  requestType: string;
  impact: string;
  urgency: string;
  category: string;
  description: string;
  purpose: string;
}

interface AgreementRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AgreementRequestFormData) => void;
}

const REQUEST_TYPE_OPTIONS = [
  'New Agreement',
  'Amendment',
  'Renewal',
  'Termination',
  'Review Request',
];

const IMPACT_OPTIONS = [
  '-- None --',
  'Low',
  'Medium',
  'High',
  'Critical',
];

const URGENCY_OPTIONS = [
  '-- None --',
  'Low',
  'Medium',
  'High',
  'Critical',
];

const CATEGORY_OPTIONS = [
  'Software - Video',
  'Software - Productivity',
  'Software - Security',
  'Hardware - Computing',
  'Hardware - Networking',
  'Professional Services',
  'Consulting',
  'Licensing',
  'Other',
];

const PURPOSE_OPTIONS = [
  'New Purchase',
  'Renewal',
  'Upgrade',
  'Replacement',
  'Expansion',
  'Pilot/Trial',
];

function AgreementRequestModal({ open, onClose, onSubmit }: AgreementRequestModalProps) {
  const [requestType, setRequestType] = useState('');
  const [impact, setImpact] = useState('');
  const [urgency, setUrgency] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');

  // Dropdown open states
  const [requestTypeOpen, setRequestTypeOpen] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [purposeOpen, setPurposeOpen] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({
      requestType,
      impact,
      urgency,
      category,
      description,
      purpose,
    });
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: '#130032',
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const requiredStar: React.CSSProperties = {
    color: '#C0392B',
    fontWeight: 600,
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--ink-border-subtle)',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'var(--ink-font-family)',
    color: '#130032',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative' as const,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid var(--ink-border-subtle)',
    borderRadius: 6,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 10,
    maxHeight: 200,
    overflowY: 'auto',
    marginTop: 4,
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: 14,
    cursor: 'pointer',
    color: '#130032',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--ink-border-subtle)',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'var(--ink-font-family)',
    color: '#130032',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: 100,
    resize: 'vertical',
  };

  const renderDropdown = (
    label: string,
    value: string,
    placeholder: string,
    options: string[],
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    onChange: (value: string) => void,
    required: boolean = false
  ) => (
    <div style={{ marginBottom: 20 }}>
      <label style={fieldLabelStyle}>
        {label}
        {required && <span style={requiredStar}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          style={selectStyle}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        >
          <span style={{ color: value ? '#130032' : 'var(--ink-neutral-60)' }}>
            {value || placeholder}
          </span>
          <Icon name="chevron-down" size={16} color="var(--ink-neutral-60)" />
        </button>
        {isOpen && (
          <div style={dropdownStyle}>
            {options.map((option) => (
              <div
                key={option}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: value === option ? 'var(--ink-neutral-fade-5)' : 'transparent',
                }}
                onMouseDown={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ink-neutral-fade-5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = value === option ? 'var(--ink-neutral-fade-5)' : 'transparent';
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} size="full">
      {/* Header bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        borderBottom: '1px solid var(--ink-border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        borderRadius: '16px 16px 0 0',
      }}>
        <Text size="sm" weight="medium" style={{ color: '#130032' }}>New Request</Text>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <Icon name="close" size={20} color="var(--ink-neutral-60)" />
        </button>
      </div>

      {/* Content */}
      <div style={{
        padding: '80px 40px 40px',
        maxWidth: 560,
        margin: '0 auto',
      }}>
        {/* Title */}
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: 28,
          fontWeight: 500,
          fontFamily: 'var(--ink-font-family)',
          color: '#130032',
        }}>New Agreement Request</h2>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: 14,
          color: 'var(--ink-neutral-60)',
          fontFamily: 'var(--ink-font-family)',
        }}>Get help on agreements, from other departments</p>

        {/* Form fields */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {renderDropdown('Request type', requestType, 'Select or type...', REQUEST_TYPE_OPTIONS, requestTypeOpen, setRequestTypeOpen, setRequestType, true)}
          {renderDropdown('Impact', impact, '-- None --', IMPACT_OPTIONS, impactOpen, setImpactOpen, setImpact, true)}
          {renderDropdown('Urgency', urgency, '-- None --', URGENCY_OPTIONS, urgencyOpen, setUrgencyOpen, setUrgency, true)}
          {renderDropdown('Category', category, 'Select or type...', CATEGORY_OPTIONS, categoryOpen, setCategoryOpen, setCategory, true)}

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={fieldLabelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe purchase request"
              style={textareaStyle}
            />
          </div>

          {renderDropdown('Purpose', purpose, 'Select or type...', PURPOSE_OPTIONS, purposeOpen, setPurposeOpen, setPurpose, true)}

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 32,
          }}>
            <Button kind="secondary" size="medium" onClick={onClose}>Back</Button>
            <Button kind="primary" size="medium" onClick={handleSubmit}>Submit</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════
   InstantNDAModal Component
   ═══════════════════════════════════════ */

interface NDAFormData {
  receivingParty: string;
  effectiveDate: string;
  duration: string;
}

interface InstantNDAModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NDAFormData) => void;
  onSendForSignature?: (data: NDAFormData) => void;
  initialData?: NDAFormData | null;
}

function InstantNDAModal({ open, onClose, onSave, onSendForSignature, initialData }: InstantNDAModalProps) {
  // In the Simple Use Case version this flow fills out an actual Permission
  // Slip (instead of an NDA). The three field-data slots are re-purposed:
  //   receivingParty -> Student Name
  //   effectiveDate  -> Activity Date
  //   duration       -> Parent/Guardian Name
  const { version } = usePrototypeVersion();
  const isPermissionSlip = version === 'simple';

  const [receivingParty, setReceivingParty] = useState(initialData?.receivingParty || '');
  const [effectiveDate, setEffectiveDate] = useState(initialData?.effectiveDate || '');
  const [duration, setDuration] = useState(initialData?.duration || (isPermissionSlip ? '' : '12'));
  const highlightData = true;

  // Reset form when initialData changes (opening with new data)
  useEffect(() => {
    if (open) {
      setReceivingParty(initialData?.receivingParty || '');
      setEffectiveDate(initialData?.effectiveDate || '');
      setDuration(initialData?.duration || (isPermissionSlip ? '' : '12'));
    }
  }, [open, initialData, isPermissionSlip]);
  
  const handleSave = () => {
    onSave({
      receivingParty,
      effectiveDate,
      duration,
    });
  };

  if (!open) return null;

  const renderFieldValue = (value: string, placeholder: string, isNumber = false) => {
    if (value) {
      return (
        <span style={{
          color: isNumber ? 'var(--ink-gold-100)' : 'var(--ink-purple-100)',
          fontWeight: 500,
          backgroundColor: highlightData ? (isNumber ? 'var(--ink-gold-fade-10)' : 'var(--ink-purple-fade-10)') : 'transparent',
          padding: highlightData ? '2px 4px' : 0,
          borderRadius: 4,
        }}>{value}</span>
      );
    }
    return (
      <span style={{
        color: 'var(--ink-neutral-60)',
        backgroundColor: highlightData ? 'var(--ink-neutral-fade-10)' : 'transparent',
        padding: highlightData ? '2px 4px' : 0,
        borderRadius: 4,
      }}>[{placeholder}]</span>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--ink-bg-color-default)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#130032',
        color: 'white',
        gap: 16,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <Icon name="close" size={20} color="white" />
        </button>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.3)' }} />
        <Text size="sm" weight="medium" style={{ color: 'white' }}>New Agreement</Text>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left panel - Form fields */}
        <div style={{
          width: 400,
          borderRight: '1px solid var(--ink-border-subtle)',
          padding: '32px 28px',
          overflow: 'auto',
          background: 'var(--ink-bg-color-default)',
        }}>
          <Text size="xl" weight="medium" style={{ marginBottom: 24, display: 'block' }}>Add field data</Text>

          {/* Sender Field Data section */}
          <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, display: 'block' }}>Sender Field Data</Text>

          {/* Field 1 — Receiving Party / Student Name */}
          <div style={{ marginBottom: 20 }}>
            <Text size="sm" weight="medium" style={{ marginBottom: 4, display: 'block' }}>{isPermissionSlip ? 'Student Name' : 'Receiving Party'}</Text>
            <Text size="xs" color="secondary" style={{ marginBottom: 8, display: 'block' }}>{isPermissionSlip ? 'The student participating in the activity.' : 'The party receiving confidential information.'}</Text>
            <Input
              value={receivingParty}
              onChange={(e) => setReceivingParty(e.target.value)}
              placeholder=""
              style={{ width: '100%' }}
            />
          </div>

          {/* Field 2 — Effective Date / Activity Date */}
          <div style={{ marginBottom: 20 }}>
            <Text size="sm" weight="medium" style={{ marginBottom: 4, display: 'block' }}>{isPermissionSlip ? 'Activity Date' : 'Effective Date'}</Text>
            <Input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              placeholder="mm/dd/yyyy"
              style={{ width: '100%' }}
            />
          </div>

          {/* Field 3 — Duration / Parent/Guardian Name */}
          <div style={{ marginBottom: 20 }}>
            <Text size="sm" weight="medium" style={{ marginBottom: 4, display: 'block' }}>{isPermissionSlip ? 'Parent/Guardian Name' : 'Duration (months)'}</Text>
            <Input
              type={isPermissionSlip ? 'text' : 'number'}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder=""
              style={{ width: '100%' }}
            />
          </div>

        </div>

        {/* Right panel - Document preview */}
        <div style={{
          flex: 1,
          padding: 40,
          overflow: 'auto',
          background: 'var(--ink-bg-color-secondary)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Document */}
          <div style={{
            flex: 1,
            background: 'white',
            border: '1px solid var(--ink-border-subtle)',
            borderRadius: 4,
            padding: '48px 56px',
            maxWidth: 900,
            marginBottom: 24,
          }}>
            <h1 style={{
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 600,
              marginBottom: 8,
              color: '#130032',
            }}>{isPermissionSlip ? 'Permission Slip' : 'Non-Disclosure Agreement'}</h1>

            {/* Title metadata */}
            <div style={{ textAlign: 'center', fontSize: 14, lineHeight: 1.6, color: '#6B6B7B', marginBottom: 32 }}>
              {isPermissionSlip ? (
                <>
                  <div>Riverside Unified School District</div>
                  <div>Student Activity Authorization</div>
                </>
              ) : (
                <>
                  <div>Acme Corporation & Receiving Party</div>
                  <div>Effective Date: January 15, 2026</div>
                </>
              )}
            </div>

            {/* Field values header */}
            <div style={{
              fontSize: 14,
              lineHeight: 1.8,
              marginBottom: 32,
              color: '#130032',
            }}>
              {isPermissionSlip ? (
                <>
                  <span>Student Name: {renderFieldValue(receivingParty, 'Student Name')}</span>
                  <span style={{ margin: '0 16px' }}>Activity Date: {renderFieldValue(effectiveDate, 'Activity Date')}</span>
                  <span style={{ margin: '0 16px' }}>Parent/Guardian: {renderFieldValue(duration, 'Parent/Guardian Name')}</span>
                </>
              ) : (
                <>
                  <span>Receiving Party: {renderFieldValue(receivingParty, 'Receiving Party')}</span>
                  <span style={{ margin: '0 16px' }}>Effective Date: {renderFieldValue(effectiveDate, 'Effective Date')}</span>
                  <span style={{ margin: '0 16px' }}>Duration (months): {renderFieldValue(duration, 'Duration', true)}</span>
                </>
              )}
            </div>

            {isPermissionSlip ? (
              <>
                {/* Section 1 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#130032' }}>1. Activity Details</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>
                    The student named above has been invited to participate in a school-sponsored activity. This activity will take place on the date indicated and will be supervised by school staff. Transportation, where applicable, will be arranged by the school.
                  </p>
                </div>

                {/* Section 2 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#130032' }}>2. Parental Consent</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>
                    I, the parent or legal guardian of the student named above, give my permission for my child to participate in this activity. I understand the nature of the activity and accept the terms of participation.
                  </p>
                </div>

                {/* Section 3 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#130032' }}>3. Emergency & Medical Authorization</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>
                    In the event of an emergency, I authorize school staff to secure necessary medical treatment for my child. I confirm the emergency contact information on file with the school is current.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Section 1 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#130032' }}>1. Definition of Confidential Information</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>
                    For purposes of this Agreement, "Confidential Information" shall include all information or data that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.
                  </p>
                </div>

                {/* Section 2 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#130032' }}>2. Obligations of Receiving Party</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>
                    Receiving Party agrees to: (a) hold the Confidential Information in strict confidence; (b) not to use the Confidential Information for any purpose other than evaluating a potential business relationship; (c) not to disclose Confidential Information to any third parties.
                  </p>
                </div>

                {/* Section 3 */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#130032' }}>3. Term</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>
                    This Agreement shall remain in effect for the duration specified above from the Effective Date, unless terminated earlier by either party with 30 days written notice.
                  </p>
                </div>
              </>
            )}

            {/* Signature lines */}
            <div style={{ borderTop: '1px solid #E5E1EC', marginTop: 40, paddingTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#130032', marginBottom: 40 }}>{isPermissionSlip ? 'Parent/Guardian' : 'Acme Corporation'}</div>
                <div style={{ borderBottom: '1px solid #130032', marginBottom: 8 }} />
                <div style={{ fontSize: 14, color: '#6B6B7B' }}>{isPermissionSlip ? 'Parent/Guardian Signature' : 'Authorized Signature'}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#130032', marginBottom: 40 }}>{isPermissionSlip ? 'School Representative' : 'Receiving Party'}</div>
                <div style={{ borderBottom: '1px solid #130032', marginBottom: 8 }} />
                <div style={{ fontSize: 14, color: '#6B6B7B' }}>{isPermissionSlip ? 'Staff Signature' : 'Authorized Signature'}</div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button kind="secondary" size="medium" onClick={handleSave}>Save</Button>
            <Button 
              kind="primary" 
              size="medium" 
              onClick={() => {
                const formData = {
                  receivingParty,
                  effectiveDate,
                  duration,
                };
                if (onSendForSignature) {
                  onSendForSignature(formData);
                }
              }}
            >
              Send for Signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════��═══════════════════════════════
   PurchaseRequestModal Component
   ═══════════════════════════════════════ */

interface PurchaseFormData {
  title: string;
  vendor: string;
  collaborators: string[];
  description: string;
  documentSource: '1st-party' | '3rd-party' | '';
  additionalRequirements: {
    warranty: boolean;
    compliance: boolean;
    specifications: boolean;
  };
}

interface PurchaseRequestModalProps {
  open: boolean;
  onClose: () => void;
  onNext: (data: PurchaseFormData) => void;
}

const VENDOR_OPTIONS = [
  'Globex Industries',
  'Apex Manufacturing Co.',
  'DataVault Technologies',
  'NovaSoft Solutions',
  'Horizon Analytics',
  'TerraScale Inc.',
];

// Field-trip destinations/vendors used by the Simple Use Case version.
const FIELD_TRIP_VENDOR_OPTIONS = [
  'City Science Museum',
  'State Natural History Museum',
  'Sunrise Charter Buses',
  'Riverside Zoo & Aquarium',
  'Regional Art Gallery',
  'Coastal Marine Center',
];

function PurchaseRequestModal({ open, onClose, onNext }: PurchaseRequestModalProps) {
  // In the Simple Use Case version this flow sets up a Field Trip package
  // (instead of a vendor Purchase Agreement).
  const { version } = usePrototypeVersion();
  const isFieldTrip = version === 'simple';

  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('');
  const [vendorOpen, setVendorOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [documentSource, setDocumentSource] = useState<'1st-party' | '3rd-party' | ''>('');
  const [requirements, setRequirements] = useState({
    warranty: false,
    compliance: false,
    specifications: false,
  });

  if (!open) return null;

  const vendorOptions = isFieldTrip ? FIELD_TRIP_VENDOR_OPTIONS : VENDOR_OPTIONS;
  const filteredVendors = vendorOptions.filter(v =>
    v.toLowerCase().includes(vendor.toLowerCase())
  );

  const handleNext = () => {
    onNext({
      title,
      vendor,
      collaborators: ['Carlton Banks'],
      description,
      documentSource,
      additionalRequirements: requirements,
    });
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: '#130032',
    marginBottom: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const requiredStar: React.CSSProperties = {
    color: '#C0392B',
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--ink-border-subtle)',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'var(--ink-font-family)',
    color: '#130032',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--ink-bg-color-default)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--ink-border-subtle)',
        background: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ink-text-secondary)' }}>
          <span
            style={{ cursor: 'pointer', color: 'var(--ink-text-secondary)' }}
            onClick={onClose}
          >Start New</span>
          <Icon name="chevron-right" size={14} color="var(--ink-text-secondary)" />
          <span style={{ color: '#130032', fontWeight: 500 }}>{isFieldTrip ? 'Field Trip' : 'Purchase Agreement'}</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}
          aria-label="Close"
        >
          <Icon name="close" size={20} color="var(--ink-text-secondary)" />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          {/* Title */}
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#130032', margin: '0 0 8px 0' }}>{isFieldTrip ? 'Field Trip' : 'Purchase Agreement'}</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-text-secondary)', margin: '0 0 40px 0' }}>{isFieldTrip ? 'Set up a field trip agreement package' : 'Initiate a procurement workflow'}</p>

          {/* Title field */}
          <div style={{ marginBottom: 28 }}>
            <label style={fieldLabelStyle}>
              {isFieldTrip ? 'Trip Name' : 'Title'} <span style={requiredStar}>*</span>
            </label>
            <input
              style={inputStyle}
              placeholder={isFieldTrip ? 'Name of the field trip' : 'Name of purchase request'}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Vendors field */}
          <div style={{ marginBottom: 28, position: 'relative' }}>
            <label style={fieldLabelStyle}>
              {isFieldTrip ? 'Destination / Vendor' : 'Vendors'} <span style={requiredStar}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingRight: 36 }}
                placeholder="Select or type"
                value={vendor}
                onChange={e => { setVendor(e.target.value); setVendorOpen(true); }}
                onFocus={() => setVendorOpen(true)}
                onBlur={() => setTimeout(() => setVendorOpen(false), 150)}
              />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon name="chevron-down" size={16} color="var(--ink-text-secondary)" />
              </div>
            </div>
            {vendorOpen && filteredVendors.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid var(--ink-border-subtle)',
                borderRadius: 6,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                zIndex: 10,
                marginTop: 4,
              }}>
                {filteredVendors.map(v => (
                  <div
                    key={v}
                    onMouseDown={() => { setVendor(v); setVendorOpen(false); }}
                    style={{
                      padding: '10px 14px',
                      fontSize: 14,
                      cursor: 'pointer',
                      color: '#130032',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink-neutral-fade-5)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{v}</div>
                ))}
              </div>
            )}
          </div>

          {/* Collaborators field */}
          <div style={{ marginBottom: 28 }}>
            <label style={fieldLabelStyle}>
              Collaborators <span style={requiredStar}>*</span>
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 14px',
              border: '1px solid var(--ink-border-subtle)',
              borderRadius: 6,
              background: 'white',
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--ink-purple-fade-10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--ink-purple-100)',
                flexShrink: 0,
              }}>CB</div>
              <span style={{ fontSize: 14, color: '#130032' }}>Carlton Banks</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 28 }}>
            <label style={fieldLabelStyle}>{isFieldTrip ? 'Trip Description' : 'Purchase Description'}</label>
            <textarea
              style={{
                ...inputStyle,
                height: 100,
                resize: 'vertical',
              } as React.CSSProperties}
              placeholder={isFieldTrip ? 'Briefly describe the field trip' : 'Briefly describe purchase request'}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Document Source */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ ...fieldLabelStyle, marginBottom: 12 }}>Document Source</label>
            {(['1st-party', '3rd-party'] as const).map(opt => (
              <label
                key={opt}
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', fontSize: 14, color: '#130032' }}
              >
                <div
                  onClick={() => setDocumentSource(opt)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `2px solid ${documentSource === opt ? 'var(--ink-purple-100)' : 'var(--ink-neutral-40)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                >
                  {documentSource === opt && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ink-purple-100)' }} />
                  )}
                </div>
                <span onClick={() => setDocumentSource(opt)}>
                  {isFieldTrip
                    ? (opt === '1st-party' ? 'School-provided documents' : 'Documents from vendor')
                    : (opt === '1st-party' ? '1st party (Fontara)' : '3rd party (from vendor)')}
                </span>
              </label>
            ))}
          </div>

          {/* Additional Requirements */}
          <div style={{ marginBottom: 40 }}>
            <label style={{ ...fieldLabelStyle, marginBottom: 12 }}>{isFieldTrip ? 'Include in this package' : 'Additional Purchase Requirements'}</label>
            {(isFieldTrip ? ([
              { key: 'warranty', label: 'Permission slips' },
              { key: 'compliance', label: 'Vendor contracts' },
              { key: 'specifications', label: 'Liability waivers' },
            ] as const) : ([
              { key: 'warranty', label: 'Warranty or support' },
              { key: 'compliance', label: 'Compliance certifications' },
              { key: 'specifications', label: 'Detailed specifications or project milestones' },
            ] as const)).map(({ key, label }) => (
              <label
                key={key}
                style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', fontSize: 14, color: '#130032' }}
              >
                <div
                  onClick={() => setRequirements(prev => ({ ...prev, [key]: !prev[key] }))}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: `2px solid ${requirements[key] ? 'var(--ink-purple-100)' : 'var(--ink-neutral-40)'}`,
                    background: requirements[key] ? 'var(--ink-purple-100)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                  }}
                >
                  {requirements[key] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span onClick={() => setRequirements(prev => ({ ...prev, [key]: !prev[key] }))}>{label}</span>
              </label>
            ))}
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button kind="secondary" size="medium" onClick={onClose}>Back</Button>
            <Button kind="primary" size="medium" onClick={handleNext} disabled={!title || !vendor}>Next</Button>
          </div>
        </div>
      </div>
    </div>
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

/* ═══════════════════════������������������������������������������������������������������������══════════════
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

/* ═������══�����������═════════════════════════════
   Types
   ═══════════════════════════════════════ */

type TabId = 'home' | 'agreements' | 'templates' | 'insights' | 'admin';
type SidebarView = 'all-agreements' | 'drafts' | 'in-progress' | 'completed' | 'deleted' | 'parties' | 'requests' | 'folders';
type TemplatesSidebarView = 'my-templates' | 'shared-with-me' | 'favorites' | 'all-templates';
type InsightsSidebarView = 'overview' | 'dashboards' | 'reports';

/* �����══════════���═══════������������������══════════════════
   Agreement Workspace Data (Sales Use Case)
   An Agreement Workspace is a dynamic package of 
   documents, data, and tasks required to execute 
   a specific transaction between parties.
   ════���═══════════════════�����══════════════ */

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
  // Names of the documents contained in this Agreement Space. Shown as subtext
  // in the All Agreements table.
  documentNames?: string[];
  // Names of external participants (e.g. an NDA receiving party or the
  // recipients of a signature request). Listed in the Parties column with a
  // "+ N" overflow affordance when there are more than fit.
  externalParticipants?: string[];
  // Explicit classification for the Type filter. When set, it overrides the
  // documentsCount heuristic. Workspaces created via "Start New" are always
  // Agreement Spaces so they appear under the default "Agreement Spaces" view.
  entityKind?: 'space' | 'document';
  // Identifies special workspaces (NDA / blank-document) whose content is
  // resolved by kind rather than by a fixed id, so multiple can coexist in a
  // single session without overwriting one another.
  workspaceKind?: 'nda' | 'uploaded' | 'permission-slip';
}

const AGREEMENTS_DATA: Agreement[] = [
  // ═══ COMPLEX DEALS — Multiple documents, many stakeholders, various task types ═══
  
  { id: '1', name: 'Globex Enterprise Platform', party: 'Globex Industries', partyLogo: 'GI', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Legal Review', dealValue: '$2.8M', agreementType: 'Enterprise License', termLength: '36 months', closeDate: 'Jun 30, 2026', date: '24/4/2026', time: '14:30', action: 'Edit', documentsCount: 6, tasksCount: 14, tasksPending: 5 },
  
  { id: '2', name: 'Apex Manufacturing Supply Agreement', party: 'Apex Manufacturing Co.', partyLogo: 'AM', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Procurement Review', dealValue: '$1.6M', agreementType: 'Supply Agreement', termLength: '24 months', closeDate: 'May 20, 2026', date: '23/4/2026', time: '11:20', action: 'Edit', documentsCount: 5, tasksCount: 11, tasksPending: 4 },
  
  { id: '3', name: 'DataVault Cloud Services MSA', party: 'DataVault Technologies', partyLogo: 'DV', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: '2 of 4 signed', dealValue: '$920K', agreementType: 'SaaS License', termLength: '36 months', closeDate: 'May 5, 2026', date: '22/4/2026', time: '16:45', action: 'Edit', documentsCount: 4, tasksCount: 9, tasksPending: 2 },
  
  { id: '4', name: 'Pinnacle Consulting SOW', party: 'Pinnacle Advisory Group', partyLogo: 'PA', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Rate Negotiation', dealValue: '$340K', agreementType: 'Statement of Work', termLength: '6 months', closeDate: 'May 15, 2026', date: '21/4/2026', time: '09:15', action: 'Edit', documentsCount: 2, tasksCount: 5, tasksPending: 2 },
  
  { id: '5', name: 'Horizon Analytics Renewal', party: 'Horizon Analytics', partyLogo: 'HA', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Finance Approval', dealValue: '$185K', agreementType: 'License Renewal', termLength: '12 months', closeDate: 'May 10, 2026', date: '20/4/2026', time: '13:00', action: 'Edit', documentsCount: 2, tasksCount: 4, tasksPending: 1 },
  
  { id: '6', name: 'Sterling Industries NDA', party: 'Sterling Industries', partyLogo: 'SI', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Awaiting Signature', dealValue: '—', agreementType: 'NDA', termLength: '24 months', closeDate: 'Apr 28, 2026', date: '19/4/2026', time: '15:30', action: 'Edit', documentsCount: 1, tasksCount: 1, tasksPending: 1 },
  
  { id: '7', name: 'OfficePro Supply Order', party: 'OfficePro Supplies', partyLogo: 'OP', status: 'In Progress', statusIcon: 'clock', statusKind: 'info', statusSub: 'Preparing', dealValue: '$12K', agreementType: 'Purchase Order', termLength: 'One-time', closeDate: 'Apr 30, 2026', date: '18/4/2026', time: '10:00', action: 'Edit', documentsCount: 1, tasksCount: 2, tasksPending: 2 },
  
  { id: '8', name: 'Quantum Systems Integration', party: 'Quantum Systems Inc.', partyLogo: 'QS', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '$3.2M', agreementType: 'Enterprise License', termLength: '36 months', date: '15/4/2026', time: '10:30', action: 'Download', documentsCount: 7, tasksCount: 16, tasksPending: 0 },
  
  { id: '9', name: 'Velocity Logistics Partnership', party: 'Velocity Logistics', partyLogo: 'VL', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '$480K', agreementType: 'Partnership Agreement', termLength: '24 months', date: '10/4/2026', time: '14:15', action: 'Download', documentsCount: 3, tasksCount: 6, tasksPending: 0 },
  
  { id: '10', name: 'TechBridge Solutions NDA', party: 'TechBridge Solutions', partyLogo: 'TB', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Active', dealValue: '—', agreementType: 'NDA', termLength: '12 months', date: '5/4/2026', time: '09:45', action: 'Download', documentsCount: 1, tasksCount: 2, tasksPending: 0 },
  
  { id: '11', name: 'Legacy Vendor NDA', party: 'Legacy Vendor Corp.', partyLogo: 'LV', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'Term Ended', dealValue: '—', agreementType: 'NDA', termLength: '12 months', date: '1/3/2026', time: '12:00', action: 'Copy', documentsCount: 1, tasksCount: 2, tasksPending: 0 },
  { id: '12', name: 'Cancelled RFP Response', party: 'Metro Government', partyLogo: 'MG', status: 'Completed', statusIcon: 'status-check', statusKind: 'success', statusSub: 'RFP Withdrawn', dealValue: '$750K', agreementType: 'RFP Response', termLength: '—', date: '15/2/2026', time: '16:20', action: 'Copy', documentsCount: 2, tasksCount: 4, tasksPending: 0 },
];

// Per-agreement data for workspace views
const AGREEMENT_WORKSPACE_DATA: Record<string, {
  tasks: DealTask[];
  documents: DealDocument[];
  supplementalDocs: DealDocument[];
  attentionItems: { id: string; item: string; description: string; riskLevel: 'High' | 'Medium'; alertMessage?: string }[];
  activity: { id: string; icon: IconName; user: string; action: string; time: string; isAI?: boolean }[];
}> = {
  // ���══ COMPLEX: Globex Enterprise Platform (id: 1) ═══
  '1': {
    tasks: [
      { id: '1', title: 'Legal Review of MSA Terms', type: 'Approval', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'In progress', dueDate: '4/28/26' },
      { id: '2', title: 'Finance Deal Approval', type: 'Approval', team: 'Finance', assignee: 'Marcus Webb', assigneeInitials: 'MW', status: 'Not started', dueDate: '5/2/26' },
      { id: '3', title: 'Security Assessment Review', type: 'Approval', team: 'Security', assignee: 'Priya Sharma', assigneeInitials: 'PS', status: 'In progress', dueDate: '4/30/26' },
      { id: '4', title: 'Upload Insurance Certificate', type: 'Upload', team: 'Procurement', assignee: 'David Kim', assigneeInitials: 'DK', status: 'Not started', dueDate: '5/5/26' },
      { id: '5', title: 'Complete Vendor Profile', type: 'Form', team: 'Procurement', assignee: 'Globex Industries', assigneeInitials: 'GI', status: 'In progress', dueDate: '4/29/26' },
      { id: '6', title: 'Sign Master Service Agreement', type: 'Sign', team: 'Executive', assignee: 'Jennifer Mills', assigneeInitials: 'JM', status: 'Not started', dueDate: '5/10/26' },
      { id: '7', title: 'Resolve DPA Comments', type: 'Resolve', team: 'Legal', assignee: 'Laura Chen', assigneeInitials: 'LC', status: 'In progress', dueDate: '4/27/26', isDueSoon: true },
      { id: '8', title: 'Sign Data Processing Agreement', type: 'Sign', team: 'External', assignee: 'Globex Industries', assigneeInitials: 'GI', status: 'Not started', dueDate: '5/12/26' },
    ],
    documents: [
    { id: '1', name: 'Master Service Agreement (MSA)', commentCount: 5, status: 'In Review', value: '$2.4M', dateModified: '4/24/2026' },
    { id: '2', name: 'Data Processing Agreement (DPA)', commentCount: 8, status: 'In Review', dateModified: '4/23/2026' },
    { id: '3', name: 'Security & Compliance Addendum', commentCount: 2, status: 'In Review', dateModified: '4/22/2026' },
    { id: '4', name: 'Service Level Agreement (SLA)', status: 'In Review', value: '$480K', dateModified: '4/20/2026' },
      { id: '5', name: 'Non-Disclosure Agreement', status: 'Executed', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '3/10/2026' },
    ],
    supplementalDocs: [
      { id: '6', name: 'Globex Company Profile', owner: 'Globex Industries', ownerInitials: 'GI', dateModified: '4/15/2026' },
      { id: '7', name: 'Insurance Certificate (COI)', owner: 'Globex Industries', ownerInitials: 'GI', dateModified: '4/12/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'DPA Comments Outstanding', description: '8 comments need resolution before signing', riskLevel: 'High', alertMessage: 'Resolve DPA Comments is due today. Would you like to send Laura Chen a reminder?' },
      { id: '2', item: 'Liability Cap Negotiation', description: 'Globex requesting 3x annual contract value', riskLevel: 'High' },
      { id: '3', item: 'Vendor Profile Incomplete', description: 'Insurance documentation missing', riskLevel: 'Medium' },
    ],
    activity: [
      { id: '1', icon: 'ai-spark-filled', user: 'AI Agent', action: 'Analyzing contract terms against playbook', time: 'Running...', isAI: true },
      { id: '2', icon: 'comment', user: 'Laura Chen', action: 'Added 3 comments on DPA Section 4.2', time: '2 hours ago' },
      { id: '3', icon: 'upload', user: 'David Kim', action: 'Uploaded revised SLA document', time: '4 hours ago' },
      { id: '4', icon: 'status-check', user: 'Priya Sharma', action: 'Completed initial security review', time: '1 day ago' },
    ],
  },

  // ═══ SIMPLE: Student/Parent Handbook Sign-Off (id: w1) ═══
  'w1': {
    tasks: [
      { id: '1', title: 'Review Student/Parent Handbook', type: 'Approval', team: 'Family', assignee: 'Jordan Rivera', assigneeInitials: 'JR', status: 'Completed', dueDate: '9/3/26' },
      { id: '2', title: 'Parent/Guardian Signature', type: 'Sign', team: 'Family', assignee: 'Maria Rivera', assigneeInitials: 'MR', status: 'Completed', dueDate: '9/5/26' },
      { id: '3', title: 'Student Signature', type: 'Sign', team: 'Family', assignee: 'Jordan Rivera', assigneeInitials: 'JR', status: 'Completed', dueDate: '9/5/26' },
    ],
    documents: [
      { id: '1', name: 'Student/Parent Handbook Acknowledgment', commentCount: 0, status: 'Completed', dateModified: '8/28/2026' },
    ],
    supplementalDocs: [
      { id: '2', name: 'Student/Parent Handbook 2025–2026', owner: 'Riverside Unified School District', ownerInitials: 'RU', dateModified: '8/15/2026' },
      { id: '3', name: 'Code of Conduct', owner: 'Riverside Unified School District', ownerInitials: 'RU', dateModified: '8/15/2026' },
      { id: '4', name: 'Technology Acceptable Use Policy', owner: 'Riverside Unified School District', ownerInitials: 'RU', dateModified: '8/15/2026' },
    ],
    attentionItems: [],
    activity: [
      { id: '1', icon: 'status-check', user: 'Maria Rivera', action: 'Signed the handbook acknowledgment', time: '2 hours ago' },
      { id: '4', icon: 'send', user: 'Riverside Unified School District', action: 'Sent handbook acknowledgment for signature', time: '2 hours ago' },
      { id: '2', icon: 'upload', user: 'Front Office', action: 'Attached Student/Parent Handbook 2025–2026', time: '1 day ago' },
      { id: '3', icon: 'edit', user: 'Front Office', action: 'Created the acknowledgment sign-off', time: '1 day ago' },
    ],
  },

  // ═══ COMPLEX: Apex Manufacturing Supply Agreement (id: 2) ═══
  '2': {
    tasks: [
      { id: '1', title: 'Review Supply Agreement Terms', type: 'Approval', team: 'Procurement', assignee: 'Sarah Martinez', assigneeInitials: 'SM', status: 'In progress', dueDate: '4/28/26' },
      { id: '2', title: 'Quality Standards Approval', type: 'Approval', team: 'Quality', assignee: 'Robert Yang', assigneeInitials: 'RY', status: 'Not started', dueDate: '5/1/26' },
      { id: '3', title: 'Upload Supplier Certification', type: 'Upload', team: 'External', assignee: 'Apex Manufacturing', assigneeInitials: 'AM', status: 'Not started', dueDate: '5/3/26' },
      { id: '4', title: 'Complete Supplier Questionnaire', type: 'Form', team: 'External', assignee: 'Apex Manufacturing', assigneeInitials: 'AM', status: 'In progress', dueDate: '4/30/26' },
      { id: '5', title: 'Finance Budget Approval', type: 'Approval', team: 'Finance', assignee: 'Marcus Webb', assigneeInitials: 'MW', status: 'In progress', dueDate: '4/29/26', isDueSoon: true },
      { id: '6', title: 'Sign Supply Agreement', type: 'Sign', team: 'Procurement', assignee: 'Sarah Martinez', assigneeInitials: 'SM', status: 'Not started', dueDate: '5/8/26' },
    ],
    documents: [
    { id: '1', name: 'Supply Agreement', commentCount: 4, status: 'In Review', dateModified: '4/23/2026' },
    { id: '2', name: 'Quality Standards Exhibit', commentCount: 1, status: 'In Review', dateModified: '4/22/2026' },
    { id: '3', name: 'Pricing Schedule', status: 'In Review', dateModified: '4/21/2026' },
      { id: '4', name: 'Non-Disclosure Agreement', status: 'Executed', owner: 'Sarah Martinez', ownerInitials: 'SM', dateModified: '3/15/2026' },
    ],
    supplementalDocs: [
      { id: '5', name: 'Supplier Capability Assessment', owner: 'Robert Yang', ownerInitials: 'RY', dateModified: '4/10/2026' },
      { id: '6', name: 'ISO 9001 Certification', owner: 'Apex Manufacturing', ownerInitials: 'AM', dateModified: '1/15/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Budget Approval Pending', description: 'Finance review required for $1.6M commitment', riskLevel: 'High', alertMessage: 'Finance Budget Approval is due tomorrow. Would you like to send Marcus Webb a reminder?' },
      { id: '2', item: 'Supplier Certifications', description: 'ISO 9001 certification expires in 60 days', riskLevel: 'Medium' },
    ],
    activity: [
      { id: '1', icon: 'ai-spark-filled', user: 'AI Agent', action: 'Comparing pricing against market rates', time: 'Running...', isAI: true },
      { id: '2', icon: 'edit', user: 'Sarah Martinez', action: 'Updated pricing schedule terms', time: '3 hours ago' },
      { id: '3', icon: 'comment', user: 'Robert Yang', action: 'Requested quality spec clarification', time: '6 hours ago' },
    ],
  },
  
  // ═══ COMPLEX: DataVault Cloud Services MSA (id: 3) ═══
  '3': {
    tasks: [
      { id: '1', title: 'Sign Master Service Agreement', type: 'Sign', team: 'Executive', assignee: 'Jennifer Mills', assigneeInitials: 'JM', status: 'Complete', dueDate: '4/20/26' },
      { id: '2', title: 'Sign Data Processing Agreement', type: 'Sign', team: 'External', assignee: 'DataVault Technologies', assigneeInitials: 'DV', status: 'Complete', dueDate: '4/22/26' },
      { id: '3', title: 'Security Team Sign-off', type: 'Sign', team: 'Security', assignee: 'Priya Sharma', assigneeInitials: 'PS', status: 'In progress', dueDate: '4/25/26', isDueSoon: true },
      { id: '4', title: 'Vendor Counter-signature', type: 'Sign', team: 'External', assignee: 'DataVault Technologies', assigneeInitials: 'DV', status: 'Not started', dueDate: '4/28/26' },
    ],
    documents: [
    { id: '1', name: 'Master Service Agreement', status: 'Executed', dateModified: '4/20/2026' },
    { id: '2', name: 'Data Processing Agreement', status: 'Executed', dateModified: '4/22/2026' },
    { id: '3', name: 'Security Addendum', commentCount: 1, status: 'Pending Signature', dateModified: '4/24/2026', signatureProgress: { signed: 2, total: 4, waitingFor: 'Bruce Wallach' }, envelopeId: 'env-001' },
    { id: '4', name: 'AI Terms Addendum', status: 'Pending Signature', dateModified: '4/24/2026', signatureProgress: { signed: 2, total: 4, waitingFor: 'Bruce Wallach' }, envelopeId: 'env-001' },
    ],
    supplementalDocs: [
      { id: '4', name: 'SOC 2 Type II Report', owner: 'DataVault Technologies', ownerInitials: 'DV', dateModified: '4/1/2026' },
      { id: '5', name: 'Data Center Locations & Compliance', owner: 'DataVault Technologies', ownerInitials: 'DV', dateModified: '3/28/2026' },
    ],
    attentionItems: [
      { id: '1', item: 'Security Sign-off Pending', description: 'Final security review needed before vendor counter-sign', riskLevel: 'Medium' },
    ],
    activity: [
      { id: '1', icon: 'status-check', user: 'Jennifer Mills', action: 'Signed Master Service Agreement', time: '2 days ago' },
      { id: '2', icon: 'status-check', user: 'DataVault Technologies', action: 'Signed Data Processing Agreement', time: '1 day ago' },
      { id: '3', icon: 'clock', user: 'Priya Sharma', action: 'Security review in progress', time: '4 hours ago' },
    ],
  },
  
  // ���══ MEDIUM: Pinnacle Consulting SOW (id: 4) ═══
  '4': {
    tasks: [
      { id: '1', title: 'Approve Rate Card', type: 'Approval', team: 'Finance', assignee: 'Marcus Webb', assigneeInitials: 'MW', status: 'In progress', dueDate: '4/26/26', isDueSoon: true },
      { id: '2', title: 'Sign Statement of Work', type: 'Sign', team: 'Procurement', assignee: 'David Kim', assigneeInitials: 'DK', status: 'Not started', dueDate: '5/1/26' },
    ],
    documents: [
    { id: '1', name: 'Statement of Work', commentCount: 2, status: 'In Review', dateModified: '4/21/2026' },
    { id: '2', name: 'Rate Card & Fee Schedule', status: 'In Review', dateModified: '4/20/2026' },
    ],
    supplementalDocs: [],
    attentionItems: [
      { id: '1', item: 'Rate Negotiation', description: 'Blended rate 15% above budget target', riskLevel: 'Medium' },
    ],
    activity: [
      { id: '1', icon: 'comment', user: 'Marcus Webb', action: 'Requested rate reduction', time: '5 hours ago' },
      { id: '2', icon: 'edit', user: 'David Kim', action: 'Updated deliverables timeline', time: '1 day ago' },
    ],
  },
  
  // ═���═ MEDIUM: Horizon Analytics Renewal (id: 5) ═══
  '5': {
    tasks: [
      { id: '1', title: 'Finance Renewal Approval', type: 'Approval', team: 'Finance', assignee: 'Marcus Webb', assigneeInitials: 'MW', status: 'In progress', dueDate: '4/28/26' },
      { id: '2', title: 'Sign License Renewal', type: 'Sign', team: 'IT', assignee: 'Kevin Park', assigneeInitials: 'KP', status: 'Not started', dueDate: '5/5/26' },
    ],
    documents: [
    { id: '1', name: 'License Renewal Agreement', status: 'In Review', dateModified: '4/20/2026' },
    { id: '2', name: 'Updated Pricing Schedule', status: 'In Review', dateModified: '4/19/2026' },
    ],
    supplementalDocs: [
      { id: '3', name: 'Original License Agreement (Reference)', owner: 'Kevin Park', ownerInitials: 'KP', dateModified: '5/10/2025' },
      { id: '4', name: 'Product Roadmap 2026', owner: 'Horizon Analytics', ownerInitials: 'HA', dateModified: '4/5/2026' },
    ],
    attentionItems: [],
    activity: [
      { id: '1', icon: 'ai-spark-filled', user: 'AI Agent', action: 'Comparing renewal terms to original', time: 'Completed', isAI: true },
      { id: '2', icon: 'upload', user: 'Kevin Park', action: 'Uploaded renewal documentation', time: '2 days ago' },
    ],
  },
  
  // ═══ SIMPLE: Sterling Industries NDA (id: 6) ═══
  '6': {
    tasks: [
      { id: '1', title: 'Sign Non-Disclosure Agreement', type: 'Sign', team: 'External', assignee: 'Sterling Industries', assigneeInitials: 'SI', status: 'In progress', dueDate: '4/28/26' },
    ],
    documents: [
      { id: '1', name: 'Mutual Non-Disclosure Agreement', status: 'In Review', owner: 'Laura Chen', ownerInitials: 'LC', dateModified: '4/19/2026' },
    ],
    supplementalDocs: [],
    attentionItems: [],
    activity: [
      { id: '1', icon: 'send', user: 'Laura Chen', action: 'Sent NDA for signature', time: '3 days ago' },
    ],
  },
  
  // ═══ SIMPLE: OfficePro Supply Order (id: 7) ═══
  '7': {
    tasks: [
      { id: '1', title: 'Approve Purchase Order', type: 'Approval', team: 'Procurement', assignee: 'David Kim', assigneeInitials: 'DK', status: 'Not started', dueDate: '4/29/26' },
      { id: '2', title: 'Submit Purchase Order', type: 'Form', team: 'Procurement', assignee: 'David Kim', assigneeInitials: 'DK', status: 'Not started', dueDate: '4/30/26' },
    ],
    documents: [
      { id: '1', name: 'Purchase Order #PO-2026-0892', status: 'In Review', owner: 'David Kim', ownerInitials: 'DK', dateModified: '4/18/2026' },
    ],
    supplementalDocs: [],
    attentionItems: [],
    activity: [
      { id: '1', icon: 'edit', user: 'David Kim', action: 'Created purchase order', time: '1 day ago' },
    ],
  },
  
  // ═══ INSTANT NDA DRAFT (id: nda-draft) ═══
  'nda-draft': {
    tasks: [
      { id: '1', title: 'Send NDA for Signature', type: 'Sign', team: 'Legal', assignee: 'You', assigneeInitials: 'ME', status: 'Not started', dueDate: '—' },
    ],
    documents: [
      { id: '1', name: 'Non-Disclosure Agreement', status: 'Draft', dateModified: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) },
    ],
    supplementalDocs: [],
    attentionItems: [],
    activity: [
      { id: '1', icon: 'edit', user: 'You', action: 'Created NDA draft', time: 'Just now' },
    ],
  },
};

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

// Shows the document names contained in an Agreement Space as compact subtext.
// Only the first couple of names are shown (each individually truncated so a
// single long name can't widen the column); any remainder collapses into a
// "+ N more" affordance that reveals the full list on hover.
function DocumentNamesSubtext({ names }: { names: string[] }) {
  const maxVisible = 2;
  const visible = names.slice(0, maxVisible);
  const remaining = names.length - visible.length;

  return (
    <div style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', overflow: 'hidden' }}>
      {/* Hovering the document names reveals the full list of every document in
          the space (not just the truncated/visible ones). */}
      <Tooltip text={names.join(', ')} location="below" alignment="start">
        <span style={{ display: 'inline-flex', alignItems: 'center', maxWidth: '100%', minWidth: 0, overflow: 'hidden', cursor: 'default' }}>
          {visible.map((name, i) => {
            const showComma = i < visible.length - 1 || remaining > 0;
            return (
              <span key={i} style={{ display: 'inline-flex', minWidth: 0, marginRight: showComma ? 4 : 0 }}>
                <span
                  style={{
                    fontSize: 'var(--ink-font-size-xs)',
                    color: 'var(--ink-font-color-tertiary)',
                    fontFamily: 'var(--ink-font-family)',
                    maxWidth: 130,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexShrink: 1,
                    minWidth: 0,
                  }}
                >
                  {name}
                </span>
                {showComma && (
                  <span
                    style={{
                      fontSize: 'var(--ink-font-size-xs)',
                      color: 'var(--ink-font-color-tertiary)',
                      fontFamily: 'var(--ink-font-family)',
                      flexShrink: 0,
                    }}
                  >
                    ,
                  </span>
                )}
              </span>
            );
          })}
        </span>
      </Tooltip>
      {remaining > 0 && (
        <Tooltip text={names.join(', ')} location="below" alignment="start">
          <span
            style={{
              fontSize: 'var(--ink-font-size-xs)',
              color: 'var(--ink-font-color-tertiary)',
              fontFamily: 'var(--ink-font-family)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'default',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textUnderlineOffset: 2,
            }}
          >
            + {remaining} more
          </span>
        </Tooltip>
      )}
    </div>
  );
}

// Lists external participants in the Parties column. Shows the first name
// (truncated so it can't widen the narrow column) followed by a "+ N" overflow
// badge that reveals the full list on hover.
function ParticipantNames({ names }: { names: string[] }) {
  if (names.length === 0) {
    return <Text size="sm" style={{ fontSize: 14, color: '#3d3a4e' }}>—</Text>;
  }
  const [first, ...rest] = names;
  return (
    <Inline gap="small" align="center" justify="start" style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <span
        style={{
          fontSize: 14,
          color: '#3d3a4e',
          fontFamily: 'var(--ink-font-family)',
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
        title={first}
      >
        {first}
      </span>
      {rest.length > 0 && (
        <Tooltip text={names.join(', ')} location="below" alignment="start">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              fontSize: 'var(--ink-font-size-xs)',
              fontWeight: 500,
              color: 'var(--ink-cobalt-80)',
              fontFamily: 'var(--ink-font-family)',
              background: 'var(--ink-cobalt-10)',
              borderRadius: 10,
              padding: '1px 8px',
              cursor: 'default',
              whiteSpace: 'nowrap',
            }}
          >
            + {rest.length}
          </span>
        </Tooltip>
      )}
    </Inline>
  );
}

// Controls for renaming an Agreement Space directly from its table row.
interface AgreementRenameControls {
  renamingId: string | null;
  renameDraft: string;
  onRenameDraftChange: (value: string) => void;
  onStartRename: (row: Agreement) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
}

// Inline text field shown in the name cell while a row is being renamed.
function RowRenameInput({ value, onChange, onCommit, onCancel }: {
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onBlur={onCommit}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (e.key === 'Enter') onCommit();
        else if (e.key === 'Escape') onCancel();
      }}
      aria-label="Agreement Space name"
      style={{
        fontSize: 'var(--ink-font-size-sm)',
        fontWeight: 500,
        fontFamily: 'var(--ink-font-family)',
        color: 'var(--ink-font-color-default)',
        border: '2px solid var(--ink-cobalt-80)',
        borderRadius: 6,
        padding: '2px 8px',
        outline: 'none',
        background: 'var(--ink-bg-color-default)',
        width: '100%',
        maxWidth: 280,
      }}
    />
  );
}

function createAgreementColumns(rename: AgreementRenameControls, hideParties = false) {
  const columns = [
  {
    key: 'name',
    header: 'Agreement Space',
    sortable: true,
    width: '30%',
    cell: (row: Agreement) => (
      <Stack gap="none" style={{ gap: 2 }}>
        {rename.renamingId === row.id ? (
          <RowRenameInput
            value={rename.renameDraft}
            onChange={rename.onRenameDraftChange}
            onCommit={rename.onCommitRename}
            onCancel={rename.onCancelRename}
          />
        ) : (
          <Text size="sm" weight="medium">{row.name}</Text>
        )}
        {row.documentNames && row.documentNames.length > 0 ? (
          <DocumentNamesSubtext names={row.documentNames} />
        ) : (
          <Text size="xs" color="secondary">{row.agreementType} · {row.dealValue}</Text>
        )}
      </Stack>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    width: '15%',
    cell: (row: Agreement) => (
      <StatusLight
        noFill
        className={/^in (progress|review)$/i.test(row.status) ? 'status-black' : undefined}
        kind={row.statusKind === 'success' ? 'success' : row.statusKind === 'warning' ? 'warning' : row.statusKind === 'neutral' ? 'neutral' : 'emphasis'}
        text={row.status}
      />
    ),
  },
  {
    key: 'value',
    header: 'Value',
    alignment: 'start',
    width: '10%',
    cell: (row: Agreement) => {
      const hasValue = row.dealValue && row.dealValue !== '—';
      return (
        <Text size="sm" style={{ fontSize: 14, color: '#3d3a4e' }}>{hasValue ? row.dealValue : 'NA'}</Text>
      );
    },
  },
  {
    key: 'parties',
    header: 'Parties',
    alignment: 'start',
    width: '15%',
    cell: (row: Agreement) => (
      <ParticipantNames names={row.externalParticipants ?? (row.party && row.party !== '—' ? [row.party] : [])} />
    ),
  },
  {
    key: 'date',
    header: 'Updated',
    sortable: true,
    width: '15%',
    cell: (row: Agreement) => (
      <Text size="sm" style={{ fontSize: 14, color: '#3d3a4e' }}>{relativeDate(row.date)}</Text>
    ),
  },
  {
    key: 'action',
    header: '',
    alignment: 'end',
    width: 'auto',
    cell: (row: Agreement) => (
      <Inline gap="small" align="center" justify="end" style={{ marginLeft: 'auto' }}>
        <Button kind="secondary" size="small">View</Button>
        <Dropdown
          position="bottom"
          align="end"
          items={[
            {
              label: 'Rename',
              icon: <Icon name="pencil" size="small" />,
              onClick: () => rename.onStartRename(row),
            },
          ]}
        >
          <IconButton icon="overflow-vertical" variant="tertiary" size="small" aria-label="More actions" />
        </Dropdown>
      </Inline>
    ),
  },
  ];
  // In the Simple Use Case the Parties column is hidden from the All Agreements table.
  return hideParties ? columns.filter(col => col.key !== 'parties') : columns;
}

/* ═══════════════════════════════════════
   Documents Data — individual documents (Type = Documents view)
   ═════════════════════════���═════════════ */

interface ProcurementDocument {
  id: string;
  name: string;
  parties: string[];
  type: string;       // MSA, SLA, SOW, etc.
  effective: string;
  expires: string;
}

const DOCUMENTS_DATA: ProcurementDocument[] = [
  { id: 'd1', name: 'MSA - Globex Industries.docx', parties: ['Globex Industries', 'Acme Corporation'], type: 'MSA', effective: 'Apr 26, 2022', expires: 'Apr 26, 2025' },
  { id: 'd2', name: 'SLA - Cloud Hosting Services.pdf', parties: ['Initech LLC', 'Acme Corporation'], type: 'SLA', effective: 'May 1, 2024', expires: 'May 1, 2027' },
  { id: 'd3', name: 'Stark-ScopeOfWork.pdf', parties: ['Stark Manufacturing'], type: 'SOW', effective: 'Apr 1, 2024', expires: 'May 1, 2025' },
  { id: 'd4', name: 'Statement of Work - April 2025.pdf', parties: ['Soylent Corp', 'Acme Corporation'], type: 'SOW', effective: 'Apr 4, 2025', expires: 'May 4, 2026' },
  { id: 'd5', name: 'Data Processing Addendum.pdf', parties: ['Globex Industries', 'Acme Corporation'], type: 'DPA', effective: 'Apr 26, 2022', expires: 'Apr 26, 2025' },
  { id: 'd6', name: 'Master Supply Agreement.pdf', parties: ['Soylent Corp'], type: 'Supply', effective: 'Mar 2, 2024', expires: 'Mar 2, 2027' },
  { id: 'd7', name: 'Purchase Agreement - Wonka.pdf', parties: ['Wonka Ingredients', 'Acme Corporation'], type: 'PO', effective: 'Apr 15, 2024', expires: 'Apr 15, 2025' },
  { id: 'd8', name: 'Hooli Cloud Services - MSA.pdf', parties: ['Hooli, Inc.', 'Acme Corporation'], type: 'MSA', effective: 'Jan 10, 2023', expires: 'Jan 10, 2026' },
  { id: 'd9', name: 'Umbrella Logistics - NDA.pdf', parties: ['Umbrella Logistics', 'Acme Corporation'], type: 'NDA', effective: 'Feb 8, 2024', expires: 'Feb 8, 2026' },
];

const documentColumns: any[] = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    width: '32%',
    cell: (row: ProcurementDocument) => (
      <div className={dataTableStyles.cellContent} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <span className={dataTableStyles.aiSparkle}>
          <AIIcon name="ai-spark-filled" size={14} />
        </span>
        <a href="#" className={dataTableStyles.cellPrimary} style={{ textDecoration: 'none', color: 'inherit' }}>
          {row.name}
        </a>
      </div>
    ),
  },
  {
    key: 'parties',
    header: 'Party Name',
    sortable: true,
    width: '22%',
    cell: (row: ProcurementDocument) => (
      <div className={dataTableStyles.cellContent}>
        {row.parties.map((party, i) => (
          <span key={i} className={dataTableStyles.partyChip}>
            <a href="#" className={dataTableStyles.partyLink}>{party}</a>
          </span>
        ))}
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    width: '12%',
    cell: (row: ProcurementDocument) => <Text size="sm">{row.type}</Text>,
  },
  {
    key: 'effective',
    header: 'Effective',
    sortable: true,
    width: '16%',
    cell: (row: ProcurementDocument) => <Text size="sm">{row.effective}</Text>,
  },
  {
    key: 'expires',
    header: 'Expires',
    sortable: true,
    width: '18%',
    cell: (row: ProcurementDocument) => (
      <a href="#" className={dataTableStyles.partyLink}>{row.expires}</a>
    ),
  },
];

/* ══���══════════════════════════════���═════
   Folders Data — hierarchical folder/document tree
   ═════════════════════���═════════════════ */

interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  lastChange: string;
  status?: 'Voided' | 'Completed' | 'Draft';
  statusSub?: string;
  recipient?: string;
  children?: FolderNode[];
}

interface FolderRow extends FolderNode {
  depth: number;
  hasChildren: boolean;
}

const FOLDERS_TREE: FolderNode[] = [
  {
    id: 'active-sourcing', name: 'Active Sourcing', type: 'folder', lastChange: '5/12/2026',
    children: [
      {
        id: 'space-globex', name: 'Globex Industries — MSA', type: 'folder', lastChange: '5/12/2026',
        children: [
          { id: 'globex-msa', name: 'New Vendor MSA', type: 'document', lastChange: '5/12/2026', status: 'Draft', recipient: 'Supplier: Globex Industries' },
          { id: 'globex-dpa', name: 'Data Processing Addendum', type: 'document', lastChange: '5/10/2026', status: 'Draft', recipient: 'Supplier: Globex Industries' },
          { id: 'globex-sca', name: 'Security & Compliance Addendum', type: 'document', lastChange: '5/9/2026', status: 'Completed', recipient: 'Supplier: Globex Industries' },
        ],
      },
      {
        id: 'space-initech', name: 'Initech ��� SaaS Subscription', type: 'folder', lastChange: '5/8/2026',
        children: [
          { id: 'initech-osa', name: 'Order & Subscription Agreement', type: 'document', lastChange: '5/8/2026', status: 'Completed', recipient: 'Supplier: Initech LLC' },
          { id: 'initech-sla', name: 'Service Level Agreement', type: 'document', lastChange: '5/6/2026', status: 'Completed', recipient: 'Supplier: Initech LLC' },
        ],
      },
    ],
  },
  {
    id: 'renewals', name: 'Renewals & Amendments', type: 'folder', lastChange: '5/10/2026',
    children: [
      {
        id: 'space-soylent', name: 'Soylent Corp — Supply Agreement', type: 'folder', lastChange: '5/10/2026',
        children: [
          { id: 'soylent-amend', name: 'Amendment No. 2 — Pricing', type: 'document', lastChange: '5/10/2026', status: 'Draft', recipient: 'Supplier: Soylent Corp' },
          { id: 'soylent-msa', name: 'Master Supply Agreement', type: 'document', lastChange: '3/2/2026', status: 'Completed', recipient: 'Supplier: Soylent Corp' },
        ],
      },
      { id: 'renewal-umbrella', name: 'Umbrella Logistics — Renewal Notice', type: 'document', lastChange: '4/28/2026', status: 'Completed', recipient: 'Supplier: Umbrella Logistics' },
    ],
  },
  {
    id: 'executed', name: 'Executed Agreements', type: 'folder', lastChange: '5/4/2026',
    children: [
      {
        id: 'space-stark', name: 'Stark Manufacturing — MSA', type: 'folder', lastChange: '5/4/2026',
        children: [
          { id: 'stark-msa', name: 'Master Services Agreement', type: 'document', lastChange: '5/4/2026', status: 'Completed', recipient: 'Supplier: Stark Manufacturing' },
          { id: 'stark-sow', name: 'Statement of Work #1', type: 'document', lastChange: '5/4/2026', status: 'Completed', recipient: 'Supplier: Stark Manufacturing' },
        ],
      },
      { id: 'executed-wonka', name: 'Wonka Ingredients — Purchase Agreement', type: 'document', lastChange: '4/15/2026', status: 'Completed', recipient: 'Supplier: Wonka Ingredients' },
    ],
  },
  {
    id: 'archived', name: 'Archived — FY25', type: 'folder', lastChange: '1/14/2026',
    children: [
      { id: 'arch-hooli', name: 'Hooli Cloud Services — MSA', type: 'document', lastChange: '12/20/2025', status: 'Completed', recipient: 'Supplier: Hooli, Inc.' },
      { id: 'arch-acme', name: 'Acme Logistics — Voided NDA', type: 'document', lastChange: '12/2/2025', status: 'Voided', statusSub: 'Superseded', recipient: 'Supplier: Acme Logistics' },
    ],
  },
];

function findFolderNode(nodes: FolderNode[], id: string): FolderNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findFolderNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

/* ══════════════════════════════���═══��═���══
   FilterMenu — multi-select dropdown for the agreements filter bar
   ═══════════════════════════════════════ */

interface FilterMenuProps {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  onClear: () => void;
  /** When true, options are single-select and rendered as radios. */
  radio?: boolean;
  /** When true, shows a search box to filter the options list. */
  searchable?: boolean;
}

function FilterMenu({ label, options, selected, onToggle, onClear, radio = false, searchable = false }: FilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const count = selected.size;

  const visibleOptions = searchable && query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const content = (
    <div style={{ minWidth: 220, maxWidth: 280, padding: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 8px' }}>
        <Text size="xs" color="secondary" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</Text>
        {!radio && count > 0 && (
          <button
            onClick={onClear}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: 'var(--ink-cobalt-80, #4C00FF)', fontSize: 12, fontFamily: 'var(--ink-font-family)' }}
          >
            Clear
          </button>
        )}
      </div>
      {searchable && (
        <div style={{ padding: '0 8px 8px' }}>
          <SearchInput size="small" value={query} onChange={setQuery} placeholder={`Search ${label}`} />
        </div>
      )}
      <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {visibleOptions.length === 0 ? (
          <div style={{ padding: '8px 10px' }}><Text size="sm" color="secondary">{searchable && query ? 'No matches' : 'No options'}</Text></div>
        ) : visibleOptions.map((opt) => (
          <label
            key={opt}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, cursor: 'pointer' }}
          >
            {radio ? (
              <Radio
                name={`filter-${label}`}
                label={opt}
                checked={selected.has(opt)}
                onChange={() => onToggle(opt)}
              />
            ) : (
              <Checkbox
                label={opt}
                checked={selected.has(opt)}
                onChange={() => onToggle(opt)}
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <Popover content={content} position="bottom" align="start" showArrow={false} open={open} onOpenChange={setOpen}>
      <Button kind="secondary" size="small" menuTrigger>
        {!radio && count > 0 ? `${label} (${count})` : label}
      </Button>
    </Popover>
  );
}

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
  { id: '1', fileName: '01_people_ai_guidebook.pdf', fileStatus: 'uploaded', fileStatusDetail: 'View Job', parties: [], status: 'inactive', agreementType: 'Handbook', isAIAssisted: true },
  { id: '2', fileName: 'Restricted Access Request Form 1726...', fileStatus: 'completed', fileStatusDetail: 'Please DocuSign this...', parties: ['Akshat Mishra', '+2 More'], status: 'active', agreementType: 'Form', effectiveDate: '5/20/2025', isAIAssisted: true },
  { id: '3', fileName: 'Offer Letter 1.pdf', fileStatus: 'uploaded', fileStatusDetail: 'View Job', parties: ['KENNETH L. HARRIS', 'UNIVERSAL BIOENERGY INC'], status: 'inactive', statusDate: 'Expired 3/31/2016', agreementType: 'Offer Letter', contractValue: '$27,600.00 USD', effectiveDate: '3/26/2015', expirationDate: '3/31/2016', isAIAssisted: false },
  { id: '4', fileName: '1100.L0005-US01 - Inventor-approved...', fileStatus: 'completed', fileStatusDetail: '[SIGNATURE REQUIRE...', parties: [], status: 'inactive', agreementType: 'Miscellaneous', isAIAssisted: true },
  { id: '5', fileName: '1100.L0005-US01 - Inventor-approved...', fileStatus: 'completed', fileStatusDetail: '[SIGNATURE REQUIRE...', parties: [], status: 'inactive', agreementType: 'Form', isAIAssisted: true },
  { id: '6', fileName: '1100.L0005-US01 Combined Declaration...', fileStatus: 'completed', fileStatusDetail: '[SIGNATURE REQUIRE...', parties: ['INVENTOR', 'Docusign, Inc.'], status: 'active', agreementType: 'Miscellaneous', effectiveDate: '2/4/2025', isAIAssisted: false },
  { id: '7', fileName: 'reseller6.pdf', fileStatus: 'uploaded', fileStatusDetail: 'View Job', parties: ['[INSERT FULL NAME OF RES...', 'Voyager Worldwide'], status: 'inactive', agreementType: 'C_Mariya_27s...', isAIAssisted: true },
  { id: '8', fileName: 'reseller8.pdf', fileStatus: 'uploaded', fileStatusDetail: 'View Job', parties: ['MiniQ, Inc.'], status: 'active', agreementType: 'C_Mariya_27s...', effectiveDate: '11/19/2024', isAIAssisted: false },
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
    cell: (row: NavigatorAgreement) => row.expirationDate || '���',
  },
];

/* ══════════════════════════════════���������������������════
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
  { id: '1', name: 'DocuSign, Inc.', role: 'Other', activeAgreements: 1009, existingAgreements: 16, starred: false },
  { id: '2', name: 'Docusign', role: 'Other', activeAgreements: 192, existingAgreements: 6, starred: false },
  { id: '3', name: 'DocuSign Inc.', role: 'Other', activeAgreements: 95, existingAgreements: 3, starred: false },
  { id: '4', name: 'Bio-Logistics Solutions LLC', role: 'Seller', activeAgreements: 19, existingAgreements: 2, starred: false },
  { id: '5', name: 'Docusign Inc', role: 'Other', activeAgreements: 55, existingAgreements: 2, starred: false },
  { id: '6', name: 'Grant Thornton Advisors LLC', role: 'Other', activeAgreements: 2, existingAgreements: 3, starred: false },
  { id: '7', name: 'FinLogic LLC', role: 'Other', activeAgreements: 2, existingAgreements: 3, starred: false },
  { id: '8', name: 'Docusign, Inc', role: 'Other', activeAgreements: 90, existingAgreements: 3, starred: false },
  { id: '9', name: 'Umbrella Corporation', role: 'Buyer', activeAgreements: 19, existingAgreements: 3, starred: false },
  { id: '10', name: 'DocuSign France', role: 'Other', activeAgreements: 3, existingAgreements: 3, starred: false },
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

/* ══�����������������═���������������═���═�������������════��══════════════��═════════
   Requests Data (matches real DocuSign)
   ═══════════�����═══════════════������══════════ */

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

/* ═���������═════��═����═══════════���═══════════════
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
  { id: '1', name: 'quick send', description: 'Default template for quick envelope sending', owner: 'Lisa Jones', lastModified: '03/13/2026', shared: false, uses: 24, favorited: true },
  { id: '2', name: 'shared template info', description: 'Shared informational template', owner: 'Lisa Jones', lastModified: '08/12/2025', shared: true, uses: 12, favorited: true },
  { id: '3', name: 'Non-Disclosure Agreement', description: 'Standard NDA for external partners', owner: 'Legal Team', lastModified: '02/28/2026', shared: true, uses: 156, favorited: false },
  { id: '4', name: 'Service Agreement', description: 'Master service agreement template', owner: 'Legal Team', lastModified: '01/15/2026', shared: true, uses: 89, favorited: false },
  { id: '5', name: 'Offer Letter', description: 'Standard offer letter for new hires', owner: 'HR Department', lastModified: '03/05/2026', shared: true, uses: 203, favorited: false },
  { id: '6', name: 'Consulting Agreement', description: 'Independent contractor consulting agreement', owner: 'Lisa Jones', lastModified: '02/10/2026', shared: false, uses: 7, favorited: false },
  { id: '7', name: 'Sales Contract', description: 'Standard sales contract with payment terms', owner: 'Sales Ops', lastModified: '03/20/2026', shared: true, uses: 342, favorited: false },
  { id: '8', name: 'Vendor Onboarding', description: 'New vendor setup and compliance form', owner: 'Procurement', lastModified: '12/08/2025', shared: true, uses: 45, favorited: false },
  { id: '9', name: 'Employment Agreement', description: 'Full-time employment agreement', owner: 'HR Department', lastModified: '03/01/2026', shared: true, uses: 178, favorited: false },
  { id: '10', name: 'Change Order', description: 'Amendment to existing SOW or contract', owner: 'Lisa Jones', lastModified: '03/22/2026', shared: false, uses: 3, favorited: false },
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

/* ═══════════════���═══════════════════════
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
  { id: '6', name: 'Envelope Velocity Report', type: 'dashboard', owner: 'Lisa Jones', lastViewed: '03/25/2026', shared: false },
  { id: '7', name: 'Agreement Trends', type: 'dashboard', owner: 'Lisa Jones', lastViewed: '03/20/2026', shared: false },
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

/* ═��══════���═����════════════════════════════
   Home Page
   ═══════════════════════���═══���═��═════════ */

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
            { icon: 'plus' as const,      label: 'Start',            onClick: () => { setRootPreparePreselectedDocs([]); setShowRootPrepare(false); setShowStartModal(true); } },
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

/* ═════���════════════════════��════════════
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
   ═══════�������������������������═══════════════════════════════ */

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

/* ═══════════════════════�������═══════════════
   Footer
   ════��═══�������������������════════════════════════════ */

function Footer() {
  const links = ['Contact Us', 'Terms of Use', 'Privacy', 'Intellectual Property', 'Trust'];
  // In the Simple Use Case version the footer sticks to the bottom of the
  // viewport (rather than sitting directly beneath a short table).
  const { version } = usePrototypeVersion();
  const isSticky = version === 'simple';
  return (
    <footer style={{
      borderTop: '1px solid var(--ink-border-subtle)',
      padding: 'var(--ink-spacing-200) var(--ink-spacing-300)',
      marginTop: 'auto',
      ...(isSticky ? {
        position: 'sticky',
        bottom: 0,
        background: 'var(--ink-white-100)',
        zIndex: 10,
      } : {}),
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
   ═════════════════════════════════��═════ */

const VALID_TABS: TabId[] = ['home', 'agreements', 'templates', 'insights', 'admin'];

/* ════════════════════════════��══════════
   Agreement Detail View (Navigator Viewer)
   Full-screen dialog with PDF viewer + detail sidebar
   ���═══���════════════════��═════════════════ */

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

/* ═════════════════════════��═══����════════��
   Deal Workspace View (Draft / In Progress)
   ══════════════════════════════����═══════�� */

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
  status: 'In Review' | 'Executed' | 'Pending Signature' | 'Draft';
  owner?: string;
  ownerInitials?: string;
  value?: string;
  dateModified: string;
  isParent?: boolean;
  parentId?: string;
  signatureProgress?: {
    signed: number;
    total: number;
    waitingFor: string;
  };
  envelopeId?: string;
}

const DEAL_TASKS: DealTask[] = [
  { id: '1', title: 'Review DPA Terms', type: 'View', team: 'Legal', assignee: 'Leona Legal', assigneeInitials: 'LL', status: 'In progress', dueDate: '3/20/24' },
  { id: '2', title: 'Finance Approval', type: 'Approval', team: 'Finance', assignee: 'Frank Finance', assigneeInitials: 'FF', status: 'In progress', dueDate: 'Tomorrow', isDueSoon: true },
  { id: '3', title: 'Security Assessment', type: 'Approval', team: 'Security', assignee: 'Sam Sales', assigneeInitials: 'SS', status: 'Not started', dueDate: '3/22/24' },
  { id: '4', title: 'AI Addendum Upload', type: 'Upload', team: 'Product', assignee: 'Patricia Procurement', assigneeInitials: 'PP', status: 'In progress', dueDate: '3/26/24' },
  { id: '5', title: 'SLA Comparison', type: 'View', team: 'Legal', assignee: 'Leona Legal', assigneeInitials: 'LL', status: 'In progress', dueDate: '3/25/24' },
  { id: '6', title: 'Compliance Check', type: 'Approval', team: 'Finance', assignee: 'Frank Finance', assigneeInitials: 'FF', status: 'Complete', dueDate: '3/27/24' },
];

const DEAL_DOCUMENTS: DealDocument[] = [
    { id: '1', name: 'Master Service Agreement (MSA)', commentCount: 3, status: 'In Review', value: '$2.4M', dateModified: '3/15/2026' },
    { id: '2', name: 'Data Processing Agreement (DPA)', commentCount: 2, status: 'In Review', dateModified: '3/20/2026' },
    { id: '3', name: 'Security Terms', status: 'In Review', dateModified: '3/22/2026' },
    { id: '4', name: 'AI Addendum', commentCount: 5, status: 'In Review', dateModified: '3/23/2026' },
];

const SUPPLEMENTAL_DOCUMENTS: DealDocument[] = [
  { id: '5', name: 'Request for Proposal (RFP)', status: 'Executed', owner: 'Frank Finance', ownerInitials: 'FF', dateModified: '6/15/2025' },
  { id: '6', name: 'Non-Disclosure Agreement (NDA)', status: 'Executed', owner: 'Leona Legal', ownerInitials: 'LL', dateModified: '5/22/2025' },
];

const ATTENTION_ITEMS = [
  { id: '1', item: 'Finance Approval', description: 'Finance approval pending since 3/24', riskLevel: 'High' as const },
  { id: '2', item: 'Liability Cap Modification', description: 'Unlimited liability requested for data breaches', riskLevel: 'High' as const },
  { id: '3', item: 'Custom Termination Terms', description: '90-day notice period instead of standard 30-day', riskLevel: 'Medium' as const },
  { id: '4', item: 'IP Assignment Clause', description: 'Broader IP rights requested than standard template', riskLevel: 'Medium' as const },
];

const ACTIVITY_ITEMS = [
  { id: '1', icon: 'clock' as const, user: 'AI Agent', action: 'Analyzing party history', time: 'Running...', isAI: true },
  { id: '2', icon: 'clock' as const, user: 'AI Agent', action: 'Extracting prevailing terms', time: 'Running...', isAI: true },
  { id: '3', icon: 'upload' as const, user: 'Leona Legal', action: 'Uploaded DPA_Final.pdf', time: '2 hours ago' },
  { id: '4', icon: 'status-check' as const, user: 'Shawn Security', action: 'Approved Security Terms', time: '4 hours ago' },
  { id: '5', icon: 'comment' as const, user: 'Patricia Procurement', action: 'Added comment on AI Addendum', time: '6 hours ago' },
  { id: '6', icon: 'status-check' as const, user: 'Sam Sales', action: 'Updated status to Approved', time: '1 day ago' },
];

const TEAM_PROGRESS = [
  { team: 'Legal', completed: 1, total: 3, color: 'var(--ink-cobalt-80)' },
  { team: 'Finance', completed: 0, total: 2, color: 'var(--ink-neutral-60)' },
  { team: 'Security', completed: 3, total: 3, color: 'var(--ink-green-80)' },
  { team: 'Product', completed: 1, total: 4, color: 'var(--ink-cobalt-80)' },
];

/* ═══════════════════════════════════════
   DocumentPreview Component (merged in-app document editor)
   Replaces the external v0-doc-preview prototype. Renders any
   document by name in an editor-style chrome with tracked changes
   and an AI-Assisted panel. Fully self-contained / controllable.
   ═════════════════════════���������═════════════ */

type DocRunKind = 'del' | 'ins' | 'mark';
interface DocRun { text: string; kind?: DocRunKind; }
type DocStatus = 'approved' | 'redlined' | 'pending';
interface DocClause { num: string; heading: string; status: DocStatus; runs: DocRun[] }
type PlaybookStatus = 'passed' | 'needs_review';
interface PlaybookRule { name: string; section: string; status: PlaybookStatus; description: string; details: string }
interface KeyTerm { label: string; value: string }
interface DocData {
  fileName: string;
  title: string;
  parties: string;
  effectiveDate: string;
  pages: number;
  summary: string;
  clauses: DocClause[];
  keyTerms?: KeyTerm[];
  playbook?: PlaybookRule[];
  hideClauseStatus?: boolean;
  hideEditToolbar?: boolean;
}

const t = (text: string): DocRun => ({ text });

const DOC_LIBRARY: Record<string, DocData> = {
  msa: {
    fileName: 'New Vendor MSA.docx',
    hideClauseStatus: true,
    title: 'MASTER SERVICES AGREEMENT',
    parties: 'Acme Corporation & Globex Industries',
    effectiveDate: 'January 15, 2026',
    pages: 24,
    summary: 'This Master Services Agreement (MSA), effective as of January 15, 2026, is between Acme Corporation (Buyer) and Globex Industries (Supplier). It governs the procurement of cloud infrastructure, custom software development, and technical consulting services, including payment terms, IP ownership, confidentiality, and data protection.',
    clauses: [
      { num: '1', heading: 'Definitions', status: 'approved', runs: [
        t('This Master Services Agreement ("Agreement") is entered into as of January 15, 2026 ("Effective Date") by and between Acme Corporation, a Delaware corporation ("Buyer"), and Globex Industries, a California corporation ("Supplier"). "Services" shall mean the cloud infrastructure, software development, and technical consulting services described in Exhibit A. "Confidential Information" means any information disclosed by either party that is marked as confidential or would reasonably be considered confidential.'),
      ]},
      { num: '2', heading: 'Scope of Services', status: 'approved', runs: [
        t('Supplier shall provide the Services as described in Exhibit A, attached hereto and incorporated by reference. The Services shall include: (a) Cloud infrastructure provisioning and management; (b) Custom software development per specifications in Exhibit B; (c) Technical consulting and advisory services; (d) 24/7 monitoring and incident response. Supplier shall assign dedicated full-time resources with minimum 3 years experience to perform the Services and shall not subcontract any material portion exceeding 20% without prior written consent of Buyer.'),
      ]},
      { num: '3', heading: 'Term and Termination', status: 'pending', runs: [
        t('This Agreement shall commence on the Effective Date and continue for an initial term of three (3) years, automatically renewing for successive one-year terms unless either party provides ninety (90) days written notice of non-renewal. Either party may terminate this Agreement for material breach upon thirty (30) days written notice if such breach remains uncured. Upon termination, Supplier shall promptly return or destroy all Buyer materials and provide reasonable transition assistance.'),
      ]},
      { num: '4', heading: 'Compensation and Payment', status: 'approved', runs: [
        t('Buyer shall pay Supplier the fees set forth in Exhibit C. Total committed spend for the initial term shall not exceed $960,000 USD. Undisputed invoices are payable net forty-five (45) days from receipt. Late payments accrue interest at one and one-half percent (1.5%) per month or the maximum rate permitted by law. Pricing shall remain firm for the initial term.'),
      ]},
      { num: '5', heading: 'Intellectual Property', status: 'approved', runs: [
        t('Each party retains all right, title, and interest in its pre-existing intellectual property. Deliverables created specifically for Buyer under a Statement of Work shall be deemed "work made for hire" and assigned to Buyer upon full payment. Supplier retains ownership of its underlying tools, libraries, and know-how, and grants Buyer a perpetual, non-exclusive license to use such materials as embedded in the Deliverables.'),
      ]},
      { num: '6', heading: 'Confidentiality', status: 'approved', runs: [
        t("Each party agrees to hold the other party's Confidential Information in strict confidence and not to disclose it to any third party without prior written consent. The receiving party shall protect Confidential Information using the same degree of care it uses to protect its own confidential information, but no less than reasonable care. This obligation shall survive termination of this Agreement for a period of five (5) years."),
      ]},
      { num: '7', heading: 'Limitation of Liability', status: 'approved', runs: [
        t('EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INTELLECTUAL PROPERTY OBLIGATIONS, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. THE TOTAL AGGREGATE LIABILITY OF EITHER PARTY SHALL NOT EXCEED TWO TIMES (2X) THE TOTAL FEES PAID OR PAYABLE UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE CLAIM. This limitation shall apply regardless of the form of action or theory of liability.'),
      ]},
      { num: '8', heading: 'Indemnification', status: 'pending', runs: [
        t("Supplier shall indemnify, defend, and hold harmless Buyer from any third-party claims arising from: (a) Supplier's negligence or willful misconduct; (b) infringement of intellectual property rights; (c) breach of confidentiality obligations; or (d) violation of applicable laws. Buyer shall indemnify Supplier from claims arising from Buyer's use of the Services in violation of this Agreement. The indemnified party shall provide prompt notice and reasonable cooperation."),
      ]},
      { num: '9', heading: 'Data Protection', status: 'approved', runs: [
        t('Supplier shall comply with all applicable data protection laws including GDPR, CCPA, and any successor legislation. Supplier shall implement appropriate technical and organizational measures to protect personal data. In the event of a data breach, Supplier shall notify Buyer within seventy-two (72) hours. Supplier shall process personal data only as instructed by Buyer and shall enter into a separate Data Processing Agreement as set forth in Exhibit D.'),
      ]},
      { num: '10', heading: 'Governing Law and Dispute Resolution', status: 'approved', runs: [
        t('This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws provisions. Any dispute arising under this Agreement shall first be submitted to good-faith mediation. If mediation fails within sixty (60) days, either party may submit the dispute to binding arbitration in Wilmington, Delaware under the rules of the American Arbitration Association.'),
      ]},
    ],
    keyTerms: [
      { label: 'Agreement Type', value: 'Master Services Agreement' },
      { label: 'Effective Date', value: 'January 15, 2026' },
      { label: 'Buyer', value: 'Acme Corporation' },
      { label: 'Supplier', value: 'Globex Industries' },
      { label: 'Initial Term', value: '36 months' },
      { label: 'Total Value', value: '$2,400,000 USD' },
      { label: 'Monthly Payment', value: '$66,667' },
      { label: 'Payment Terms', value: 'Net 30' },
      { label: 'Governing Law', value: 'State of Delaware' },
      { label: 'Renewal', value: 'Auto-renew (12 mo.)' },
    ],
    playbook: [
      { name: 'Liability Cap Compliance', section: '7. Limitation of Liability', status: 'needs_review', description: 'Liability cap must not exceed total contract value', details: 'Current cap references 12-month fees. Company standard requires cap at total contract value ($2.4M) for deals over $1M.' },
      { name: 'Payment Terms', section: '4. Compensation and Payment', status: 'passed', description: 'Net payment terms within 30-45 day range', details: 'Payment terms set at Net 30, which falls within acceptable range.' },
      { name: 'Auto-Renewal Notice Period', section: '3. Term and Termination', status: 'passed', description: 'Minimum 90-day notice for non-renewal', details: 'Non-renewal notice period is 90 days, meeting minimum threshold.' },
      { name: 'IP Assignment Clause', section: '5. Intellectual Property', status: 'passed', description: 'Work product must be assigned to Buyer with proper carve-outs', details: 'IP assignment includes work-for-hire designation and full assignment of rights.' },
      { name: 'Data Breach Notification', section: '9. Data Protection', status: 'passed', description: 'Notification window must not exceed 72 hours', details: 'Notification window set at 72 hours, meeting compliance requirement.' },
      { name: 'Indemnification Scope', section: '8. Indemnification', status: 'needs_review', description: 'Must include IP infringement and data breach indemnification', details: 'Indemnification covers IP infringement but lacks explicit data breach indemnification clause.' },
      { name: 'Governing Law', section: '10. Governing Law', status: 'passed', description: 'Must specify Delaware or New York law', details: 'Governing law set to Delaware, consistent with company policy.' },
      { name: 'Fee Escalation Cap', section: '4. Compensation and Payment', status: 'needs_review', description: 'Annual fee increases must not exceed 5%', details: 'Current language permits 5% increase. Company standard limits to CPI or 3%, whichever is lower.' },
      { name: 'Confidentiality Survival', section: '6. Confidentiality', status: 'passed', description: 'Survival period minimum 3 years post-termination', details: 'Survival period is 5 years, exceeding the 3-year minimum.' },
      { name: 'Subcontracting Restrictions', section: '2. Scope of Services', status: 'passed', description: 'Subcontracting requires prior written consent', details: 'Clause requires prior written consent for any subcontracting.' },
    ],
  },
  nda: {
    fileName: 'Non-Disclosure Agreement.docx',
    title: 'NON-DISCLOSURE AGREEMENT',
    hideClauseStatus: true,
    hideEditToolbar: true,
    parties: 'Acme Corporation & Receiving Party',
    effectiveDate: 'January 15, 2026',
    pages: 3,
    summary: 'This Non-Disclosure Agreement governs the confidential exchange of information between the Disclosing Party and the Receiving Party for the purpose of evaluating a potential business relationship, including confidentiality obligations and the term of the agreement.',
    clauses: [
      { num: '1', heading: 'Definition of Confidential Information', status: 'approved', runs: [
        t('For purposes of this Agreement, "Confidential Information" shall include all information or data that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.'),
      ]},
      { num: '2', heading: 'Obligations of Receiving Party', status: 'approved', runs: [
        t('Receiving Party agrees to: (a) hold the Confidential Information in strict confidence; (b) not to use the Confidential Information for any purpose other than evaluating a potential business relationship; (c) not to disclose Confidential Information to any third parties.'),
      ]},
      { num: '3', heading: 'Term', status: 'approved', runs: [
        t('This Agreement shall remain in effect for the duration specified above from the Effective Date, unless terminated earlier by either party with 30 days written notice.'),
      ]},
    ],
    keyTerms: [
      { label: 'Agreement Type', value: 'Non-Disclosure Agreement' },
      { label: 'Effective Date', value: 'January 15, 2026' },
      { label: 'Disclosing Party', value: 'Acme Corporation' },
      { label: 'Duration', value: '16 months' },
      { label: 'Governing Law', value: 'State of Delaware' },
    ],
  },
  dpa: {
    fileName: 'Data Processing Agreement.docx',
    hideClauseStatus: true,
    title: 'DATA PROCESSING AGREEMENT',
    parties: 'Acme Corporation & Globex Industries',
    effectiveDate: 'January 15, 2026',
    pages: 12,
    summary: 'This Data Processing Agreement (DPA) governs the processing of personal data by Globex Industries (Data Processor) on behalf of Acme Corporation (Data Controller), covering security measures, sub-processors, data subject rights, and international transfers.',
    clauses: [
      { num: '1', heading: 'Processing of Personal Data', status: 'approved', runs: [
        t("Data Processor shall process Personal Data only in accordance with Data Controller's documented instructions. The categories of Personal Data processed include: contact information, account credentials, usage data, and transaction records. Processing shall be limited to the purposes necessary to provide the Services."),
      ]},
      { num: '2', heading: 'Security Measures', status: 'approved', runs: [
        t('Data Processor shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including: encryption of Personal Data, regular security assessments, access controls, and employee training on data protection.'),
      ]},
      { num: '3', heading: 'Sub-processors', status: 'approved', runs: [
        t('Data Processor shall not engage any sub-processor without prior specific written authorization from Data Controller. Data Processor shall maintain a list of approved sub-processors and notify Data Controller of any intended changes.'),
      ]},
      { num: '4', heading: 'Data Subject Rights', status: 'approved', runs: [
        t('Data Processor shall assist Data Controller in responding to requests from Data Subjects exercising their rights under applicable data protection law, including rights of access, rectification, erasure, and data portability.'),
      ]},
      { num: '5', heading: 'International Data Transfers', status: 'pending', runs: [
        t('Data Processor shall not transfer Personal Data to any country outside the European Economic Area without appropriate safeguards, such as Standard Contractual Clauses or binding corporate rules approved by a supervisory authority.'),
      ]},
    ],
  },
  addendum: {
    fileName: 'Security & Compliance Addendum.docx',
    hideClauseStatus: true,
    title: 'SECURITY & COMPLIANCE ADDENDUM',
    parties: 'Acme Corporation & Globex Industries',
    effectiveDate: 'January 15, 2026',
    pages: 8,
    summary: 'This Security & Compliance Addendum sets out the security standards, data privacy commitments, incident response obligations, and audit rights applicable to Globex Industries as a supplier to Acme Corporation.',
    clauses: [
      { num: '1', heading: 'Security Standards', status: 'approved', runs: [
        t('Supplier shall maintain SOC 2 Type II certification at all times during the term of this Agreement. All data shall be encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Supplier shall conduct annual security audits by independent third parties and provide audit reports to Buyer upon request. Multi-factor authentication shall be required for all administrative access to systems containing Buyer data.'),
      ]},
      { num: '2', heading: 'Data Privacy', status: 'approved', runs: [
        t("Supplier shall comply with all applicable data protection laws including GDPR, CCPA, and any other relevant privacy regulations. Personal data shall only be processed for the purposes specified in the Agreement and in accordance with Buyer's documented instructions. Data subjects shall have the right to access, rectify, and delete their personal data upon request."),
      ]},
      { num: '3', heading: 'Incident Response', status: 'approved', runs: [
        t('Supplier shall maintain a comprehensive incident response plan and notify Buyer within 12 hours of discovering any security breach or unauthorized access to Buyer data. Supplier shall cooperate fully with any investigation and implement appropriate remediation measures at Supplier\u2019s expense.'),
      ]},
      { num: '4', heading: 'Compliance & Audit Rights', status: 'pending', runs: [
        t('Buyer shall have the right to audit Supplier\u2019s security practices and compliance with this Addendum upon reasonable notice. Supplier shall maintain detailed logs of all access to Buyer data and retain such logs for a minimum of two (2) years.'),
      ]},
    ],
  },
  waiver: {
    fileName: 'Field Trip Liability Waiver.docx',
    hideClauseStatus: true,
    hideEditToolbar: true,
    title: 'FIELD TRIP LIABILITY WAIVER & RELEASE',
    parties: 'Riverside Unified School District & Parent/Guardian',
    effectiveDate: 'September 5, 2026',
    pages: 2,
    summary: 'This Liability Waiver and Release governs a student\u2019s participation in a school-sponsored field trip. The parent or legal guardian acknowledges the nature of the activity, assumes the associated risks, authorizes emergency medical care, and releases Riverside Unified School District and its staff from liability to the extent permitted by law.',
    clauses: [
      { num: '1', heading: 'Activity & Participation', status: 'approved', runs: [
        t('The student named on the accompanying permission slip has been invited to participate in a school-sponsored field trip organized and supervised by Riverside Unified School District staff. Participation is voluntary. This waiver applies to all transportation to and from the destination and to all activities that take place during the trip.'),
      ]},
      { num: '2', heading: 'Assumption of Risk', status: 'approved', runs: [
        t('The parent or legal guardian understands that field trips involve inherent risks, including but not limited to travel by bus or other vehicle, walking tours, and participation in on-site activities. The parent/guardian knowingly and voluntarily assumes all such risks on behalf of the student and themselves.'),
      ]},
      { num: '3', heading: 'Emergency Medical Authorization', status: 'approved', runs: [
        t('In the event of illness or injury during the field trip, the parent/guardian authorizes school staff to secure necessary first aid and emergency medical treatment for the student. The parent/guardian agrees to be responsible for any resulting medical costs and confirms that the emergency contact and health information on file with the school is accurate and current.'),
      ]},
      { num: '4', heading: 'Release of Liability', status: 'approved', runs: [
        t('To the fullest extent permitted by law, the parent/guardian releases and holds harmless Riverside Unified School District, its board, employees, and chaperones from any and all claims, demands, or causes of action arising out of the student\u2019s participation in the field trip, except those resulting from gross negligence or willful misconduct.'),
      ]},
      { num: '5', heading: 'Code of Conduct', status: 'approved', runs: [
        t('The student is expected to follow the school Code of Conduct and all instructions from supervising staff throughout the field trip. The parent/guardian understands that failure to comply may result in the student being sent home at the parent/guardian\u2019s expense.'),
      ]},
    ],
    keyTerms: [
      { label: 'Document Type', value: 'Liability Waiver & Release' },
      { label: 'Activity Date', value: 'September 5, 2026' },
      { label: 'School District', value: 'Riverside Unified' },
      { label: 'Destination', value: 'City Science Museum' },
      { label: 'Signature Required', value: 'Parent/Guardian' },
    ],
  },
};

function resolveDoc(name: string): DocData {
  const key = (name || '').toLowerCase();
  if (key.includes('waiver') || key.includes('release of liability') || key.includes('liability release')) return DOC_LIBRARY.waiver;
  if (key.includes('nda') || key.includes('non-disclosure') || key.includes('non disclosure') || key.includes('nondisclosure')) return DOC_LIBRARY.nda;
  if (key.includes('data processing') || key.includes('dpa')) return DOC_LIBRARY.dpa;
  if (key.includes('security') || key.includes('compliance') || key.includes('addendum')) return DOC_LIBRARY.addendum;
  if (key.includes('msa') || key.includes('master service') || key.includes('vendor') || key.includes('contract') || key.includes('purchase') || key.includes('procurement')) return DOC_LIBRARY.msa;
  // Fallback: render the MSA but relabel it to the requested name.
  return { ...DOC_LIBRARY.msa, fileName: `${name}.docx` };
}

const STATUS_META: Record<DocStatus, { label: string; color: string; bg: string }> = {
  approved: { label: 'Approved', color: 'var(--ink-green-80, #1F7A33)', bg: 'rgba(31, 122, 51, 0.12)' },
  redlined: { label: 'Redlined', color: '#8A5A00', bg: '#FFF4E5' },
  pending:  { label: 'Pending Review', color: 'var(--ink-text-color-secondary, #6B6580)', bg: 'var(--ink-neutral-fade-10, #EEE)' },
};

interface ChatMessage { role: 'user' | 'ai'; text: string }

const AI_SHORTCUTS = ['Suggest changes against Playbook', 'Insert Clause', 'Automatically route approvals', 'Compare Documents'];

interface CollabComment {
  id: string;
  initials: string;
  name: string;
  time: string;
  body: React.ReactNode;
  clause: string;
  redline?: boolean;
  resolved?: boolean;
}

// @mention helper — renders mentions in cobalt.
function withMentions(text: string): React.ReactNode {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@')
      ? <span key={i} style={{ color: 'var(--ink-cobalt-80, #4C00FF)', fontWeight: 500 }}>{part}</span>
      : <span key={i}>{part}</span>
  );
}

  const COLLAB_COMMENTS: CollabComment[] = [];

// The signed-in user who authors new comments.
const CURRENT_USER = { name: 'Leona Legal', initials: 'LL' };

// Derive initials + a stable avatar color from a person's name.
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}
const AVATAR_COLORS = [
  { bg: '#CFE9E5', fg: '#0F6B5F' },
  { bg: '#ECE6FF', fg: '#4C00FF' },
  { bg: '#FCE3EC', fg: '#B4234A' },
  { bg: '#FFF0D6', fg: '#8A5A00' },
  { bg: '#DCEBFB', fg: '#1F5FA8' },
];
function avatarColor(seed: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

interface MentionPerson { name: string; email: string; }
const MENTION_PEOPLE: MentionPerson[] = [
  { name: 'Francis Finance', email: 'francis.finance@email.com' },
  { name: 'Frank Finance', email: 'frank.finance@email.com' },
  { name: 'Freya Finance', email: 'freya.finance@email.com' },
  { name: 'Frida Finance', email: 'frida.finance@email.com' },
  { name: 'Leona Legal', email: 'leona.legal@email.com' },
  { name: 'Liam Legal', email: 'liam.legal@email.com' },
  { name: 'Priya Product', email: 'priya.product@email.com' },
  { name: 'Sam Security', email: 'sam.security@email.com' },
];

// Renders a posted comment body, bolding any @FullName mentions.
function renderMentionBody(text: string, names: string[]): React.ReactNode {
  if (!names.length) return text;
  const escaped = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(@(?:' + escaped.join('|') + '))', 'g');
  return text.split(re).map((part, i) =>
    names.some((n) => part === '@' + n)
      ? <strong key={i} style={{ fontWeight: 700, color: '#130032' }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}

const commentComposerStyles = `
@keyframes inkSpin { to { transform: rotate(360deg); } }
.ink-comment-input:empty:before {
  content: attr(data-placeholder);
  color: #8A85A0;
  pointer-events: none;
}
.ink-comment-input:focus { outline: none; }
.ink-comment-box:focus-within { border-color: var(--ink-cobalt-80, #4C00FF); }
`;

function aiRespond(prompt: string, doc: DocData): string {
  const p = prompt.toLowerCase();
  if (p.includes('playbook') || p.includes('suggest changes')) {
    const flagged = (doc.playbook ?? []).filter(r => r.status === 'needs_review');
    return `I reviewed this agreement against your Playbook. ${(doc.playbook ?? []).length - flagged.length} of ${(doc.playbook ?? []).length} rules passed. ${flagged.length} need review: ${flagged.map(r => r.name).join(', ')}. Would you like me to draft redlines for these?`;
  }
  if (p.includes('insert') || p.includes('clause')) {
    return "I found 8 clauses in your library that are relevant to this MSA. The most commonly needed are the Standard Limitation of Liability and Fallback Indemnification clauses. Would you like me to insert one?";
  }
  if (p.includes('approval') || p.includes('route')) {
    return 'Setting up approval workflow. Which section needs approval assignment?';
  }
  if (p.includes('compare')) {
    return 'Comparing against version 3.0: 9 changes detected across Scope, Compensation, and Limitation of Liability. The liability cap increased from 1x to 2x fees, and payment terms moved from Net 30 to Net 45. Want a side-by-side view?';
  }
  if (p.includes('summary') || p.includes('summarize')) {
    return doc.summary;
  }
  return "I've reviewed the New Vendor MSA v4.0. This is a $2.4M, 36-month Master Services Agreement between Acme (Buyer) and Globex (Supplier). There are 9 active redlines across 4 sections, with Compensation and Liability being the most contested. Would you like me to run a specific analysis or take an action?";
}

interface DocumentPreviewProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  onSendForApproval?: (documentName: string) => void;
  onSendForSignature?: (documentName: string) => void;
  onApprovalCreated?: (task: DealTask) => void;
  documentName: string;
}

interface SendForApprovalModalProps {
  open: boolean;
  documentName: string;
  onClose: () => void;
  onComplete: (task: DealTask) => void;
}

function SendForApprovalModal({ open, documentName, onClose, onComplete }: SendForApprovalModalProps) {
  const [approvers, setApprovers] = useState<MentionPerson[]>([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [requireAll, setRequireAll] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      setApprovers([]);
      setQuery('');
      setMessage('');
      setRequireAll(false);
      setSending(false);
    }
  }, [open]);

  if (!open) return null;

  const iconBtn: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: 6, border: 'none',
    background: 'transparent', cursor: 'pointer', color: '#130032',
  };

  const matches = query.trim()
    ? MENTION_PEOPLE.filter((p) =>
        !approvers.some((a) => a.email === p.email) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) || p.email.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const addApprover = (p: MentionPerson) => {
    setApprovers((prev) => prev.some((a) => a.email === p.email) ? prev : [...prev, p]);
    setQuery('');
  };
  const removeApprover = (email: string) => setApprovers((prev) => prev.filter((a) => a.email !== email));

  const handleSend = () => {
    if (approvers.length === 0 || sending) return;
    setSending(true);
    const first = approvers[0];
    const task: DealTask = {
      id: 'approval-' + Date.now(),
      title: `Approve ${documentName}`,
      type: 'Approval',
      team: '',
      assignee: first ? first.name : 'Approvers',
      assigneeInitials: first ? initialsOf(first.name) : 'AP',
      status: 'In progress',
      dueDate: '--',
    };
    // brief spinner for realism, then complete
    setTimeout(() => {
      onComplete(task);
    }, 450);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send for approval"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'white', display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden', fontFamily: 'var(--ink-font-family)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 24px', borderBottom: '1px solid #E8E6ED', flexShrink: 0 }}>
          <div style={{ width: '100%', maxWidth: 640, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#130032' }}>Send for approval</div>
              <div style={{ fontSize: 13, color: '#8A85A0', marginTop: 4, lineHeight: 1.4 }}>Choose who needs to approve this document before it moves forward.</div>
            </div>
            <button onClick={onClose} style={iconBtn} aria-label="Close"><Icon name="close" size={18} /></button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '32px 24px' }}>
          <div style={{ width: '100%', maxWidth: 640 }}>
          {/* Document chip */}
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#130032', marginBottom: 8 }}>Document</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, border: '1px solid #DDD9E3', background: '#F7F6F9', marginBottom: 24 }}>
            <Icon name="document" size={18} color="var(--ink-cobalt-80)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#130032', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{documentName}</span>
          </div>

          {/* Approvers */}
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#130032', marginBottom: 8 }}>
            Add approvers <span style={{ color: '#C0362C' }}>*</span>
          </label>
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type name or email"
              style={{ width: '100%', height: 48, borderRadius: 10, border: '1px solid #DDD9E3', background: '#F7F6F9', padding: '0 14px', fontSize: 14, fontFamily: 'var(--ink-font-family)', color: '#130032', boxSizing: 'border-box' }}
            />
            {matches.length > 0 && (
              <div style={{ position: 'absolute', top: 52, left: 0, right: 0, zIndex: 5, background: 'white', borderRadius: 12, border: '1px solid #EAE7F0', boxShadow: '0 12px 28px rgba(19,0,50,0.16)', padding: '6px 4px' }}>
                {matches.map((p) => (
                  <button
                    key={p.email}
                    onClick={() => addApprover(p)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 14px', borderRadius: 8, fontFamily: 'var(--ink-font-family)' }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: '#8A85A0' }}>{p.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {approvers.map((p) => {
            const col = avatarColor(p.name);
            return (
              <div key={p.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: col.bg, color: col.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{initialsOf(p.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: '#8A85A0' }}>{p.email}</div>
                </div>
                <button style={iconBtn} aria-label={`Remove ${p.name}`} onClick={() => removeApprover(p.email)}><Icon name="close" size={16} /></button>
              </div>
            );
          })}

          {/* Message */}
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#130032', margin: '16px 0 8px' }}>Message (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a note for your approvers"
            style={{ width: '100%', minHeight: 80, resize: 'vertical', borderRadius: 10, border: '1px solid #DDD9E3', background: '#F7F6F9', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, fontFamily: 'var(--ink-font-family)', color: '#130032', marginBottom: 24, boxSizing: 'border-box' }}
          />

          {/* Require all toggle */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#130032' }}>Require all to approve</div>
              <div style={{ fontSize: 13, color: '#8A85A0', lineHeight: 1.4, marginTop: 2, maxWidth: 320 }}>When on, every approver must approve before the document is cleared.</div>
            </div>
            <button
              role="switch"
              aria-checked={requireAll}
              aria-label="Require all to approve"
              onClick={() => setRequireAll((v) => !v)}
              style={{ flexShrink: 0, width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', padding: 2, background: requireAll ? 'var(--ink-cobalt-80, #4C00FF)' : '#C7C3D0', display: 'flex', justifyContent: requireAll ? 'flex-end' : 'flex-start', transition: 'background 0.15s' }}
            >
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
            </button>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 24px', borderTop: '1px solid #E8E6ED', flexShrink: 0 }}>
          <div style={{ width: '100%', maxWidth: 640, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={onClose}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#F1EFF4', color: '#130032', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)' }}
          >Cancel</button>
          <button
            onClick={handleSend}
            disabled={approvers.length === 0 || sending}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px', borderRadius: 8, border: 'none',
              background: 'var(--ink-cobalt-80, #4C00FF)', color: 'white',
              cursor: (approvers.length === 0 || sending) ? 'default' : 'pointer',
              opacity: (approvers.length === 0 && !sending) ? 0.5 : 1,
              fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)',
            }}
          >
            {sending && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'inkSpin 0.7s linear infinite' }}>
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <path d="M8 2 A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            Send for approval
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentPreview({ open, onClose, onSave, onSendForApproval, onSendForSignature, onApprovalCreated, documentName }: DocumentPreviewProps) {
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsTab, setCommentsTab] = useState<'open' | 'resolved'>('open');
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [leftPanel, setLeftPanel] = useState<'clauses' | 'playbook' | 'approvals' | 'addApproval' | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [zoom, setZoom] = useState(100);
  const [editing, setEditing] = useState(true);
  const [selMenu, setSelMenu] = useState<{ x: number; y: number } | null>(null);
  const [composer, setComposer] = useState<{ y: number; anchor: string } | null>(null);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [pinnedComments, setPinnedComments] = useState<{ id: string; y: number; text: string; mentions: string[]; time: string; anchor: string }[]>([]);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [approvalDraft, setApprovalDraft] = useState<{ anchor: string; description: string; requireAll: boolean; approvers: MentionPerson[] } | null>(null);
  const [approverQuery, setApproverQuery] = useState('');
  const [creatingApproval, setCreatingApproval] = useState(false);
  const [approvals, setApprovals] = useState<{ id: string; anchor: string; description: string; approvers: MentionPerson[]; status: string }[]>([]);
  // Width of the scrollable document canvas, tracked so we can reserve a
  // right-hand comment rail and dock comment cards 16px past the page edge.
  const [containerWidth, setContainerWidth] = useState(0);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);

  const doc = useMemo(() => resolveDoc(documentName), [documentName]);
  // The header filename and the in-document heading must reflect the SAME
  // document the user opened. Derive both from the incoming documentName so
  // they always match (previously the header showed the library's canned
  // fileName while the body showed a generic library title).
  const baseDocName = (documentName || '').replace(/\.docx$/i, '').trim() || 'Untitled Document';
  const headerFileName = `${baseDocName}.docx`;

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep the measured canvas width in sync so the comment rail math is correct
  // across viewport/panel resizes.
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  if (!open) return null;

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    window.setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: aiRespond(trimmed, doc) }]);
    }, 450);
  };

  const scrollToSection = (num: string) => {
    setActiveSection(num);
    const el = sectionRefs.current[num];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const exec = (cmd: string, value?: string) => {
    canvasRef.current?.focus();
    try { document.execCommand(cmd, false, value); } catch { /* noop */ }
  };

  const handleCanvasMouseUp = () => {
    // Defer so the browser finalizes the selection before we read it.
    window.setTimeout(() => {
      const sel = window.getSelection();
      const container = scrollRef.current;
      if (!sel || sel.isCollapsed || !sel.toString().trim() || !container) {
        setSelMenu(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) { setSelMenu(null); return; }
      const cRect = container.getBoundingClientRect();
      setSelMenu({
        x: rect.right - cRect.left + container.scrollLeft,
        y: rect.bottom - cRect.top + container.scrollTop + 8,
      });
    }, 0);
  };

  const closeSelMenu = () => {
    setSelMenu(null);
    window.getSelection()?.removeAllRanges();
  };

  // Open the comment composer anchored to the current selection, and
  // highlight the selected text as the comment anchor.
  const openComposer = () => {
    const sel = window.getSelection();
    const container = scrollRef.current;
    let y = 60;
    let anchor = '';
    if (sel && container && sel.rangeCount && !sel.isCollapsed) {
      anchor = sel.toString().trim();
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      y = rect.top - cRect.top + container.scrollTop;
      try {
        document.execCommand('backColor', false, '#FCE9A6');
        document.execCommand('underline');
      } catch { /* noop */ }
    }
    setSelMenu(null);
    window.getSelection()?.removeAllRanges();
    setPosting(false);
    setMentionQuery(null);
    setComposer({ y, anchor });
    window.setTimeout(() => composerRef.current?.focus(), 0);
  };

  // Open the Add Approval panel, capturing + highlighting the selected text.
  const openApproval = () => {
    const sel = window.getSelection();
    let anchor = '';
    if (sel && sel.rangeCount && !sel.isCollapsed) {
      anchor = sel.toString().trim();
      try {
        document.execCommand('backColor', false, '#FCE9A6');
        document.execCommand('underline');
      } catch { /* noop */ }
    }
    setSelMenu(null);
    window.getSelection()?.removeAllRanges();
    setApprovalDraft({ anchor, description: '', requireAll: false, approvers: [] });
    setApproverQuery('');
    setCreatingApproval(false);
    setLeftPanel('addApproval');
  };

  const addApprover = (p: MentionPerson) => {
    setApprovalDraft((d) => (!d || d.approvers.some((a) => a.email === p.email)) ? d : { ...d, approvers: [...d.approvers, p] });
    setApproverQuery('');
  };
  const removeApprover = (email: string) =>
    setApprovalDraft((d) => d ? { ...d, approvers: d.approvers.filter((a) => a.email !== email) } : d);
  const resetApproval = () =>
    setApprovalDraft((d) => d ? { ...d, description: '', approvers: [], requireAll: false } : d);

  const createApproval = () => {
    const d = approvalDraft;
    if (!d || !d.description.trim() || d.approvers.length === 0) return;
    setCreatingApproval(true);
    window.setTimeout(() => {
      const id = 'ap-' + Date.now();
      setApprovals((prev) => [...prev, { id, anchor: d.anchor, description: d.description.trim(), approvers: d.approvers, status: 'Pending' }]);
      const first = d.approvers[0];
      onApprovalCreated?.({
        id: 'task-' + id,
        title: `Approve content in ${baseDocName}`,
        type: 'Approval',
        team: '',
        assignee: first ? first.name : 'Approvers',
        assigneeInitials: first ? initialsOf(first.name) : 'AP',
        status: 'In progress',
        dueDate: '--',
      });
      setCreatingApproval(false);
      setApprovalDraft(null);
      setApproverQuery('');
      setLeftPanel('approvals');
    }, 1100);
  };

  const approverMatches = approverQuery.trim()
    ? MENTION_PEOPLE.filter((p) =>
        (p.name.toLowerCase().includes(approverQuery.toLowerCase()) || p.email.toLowerCase().includes(approverQuery.toLowerCase()))
        && !approvalDraft?.approvers.some((a) => a.email === p.email)
      ).slice(0, 5)
    : [];

  // Detect a trailing "@query" at the caret to drive the mention dropdown.
  const handleComposerInput = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) { setMentionQuery(null); return; }
    const range = sel.getRangeAt(0);
    const text = (range.startContainer.textContent || '').slice(0, range.startOffset);
    const m = text.match(/@(\w*)$/);
    setMentionQuery(m ? m[1] : null);
  };

  // Replace the "@query" being typed with a bold, non-editable mention chip.
  const pickMention = (person: MentionPerson) => {
    const el = composerRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const back = (mentionQuery ?? '').length + 1; // "@" + query
    for (let i = 0; i < back; i++) sel.modify('extend', 'backward', 'character');
    document.execCommand(
      'insertHTML',
      false,
      `<strong contenteditable="false" data-mention="${person.name}" style="font-weight:700;color:#130032;">@${person.name}</strong>&nbsp;`
    );
    setMentionQuery(null);
  };

  // Insert an "@" and open the mention picker from the footer button.
  const triggerMention = () => {
    const el = composerRef.current;
    if (!el) return;
    el.focus();
    document.execCommand('insertText', false, '@');
    setMentionQuery('');
  };

  const cancelComposer = () => {
    setComposer(null);
    setMentionQuery(null);
    setPosting(false);
  };

  const postComment = () => {
    const el = composerRef.current;
    const active = composer;
    if (!el || !active) return;
    const text = (el.innerText || '').replace(/\u00A0/g, ' ').trim();
    if (!text) return;
    const mentions = Array.from(el.querySelectorAll('[data-mention]'))
      .map((n) => (n as HTMLElement).dataset.mention || '')
      .filter(Boolean);
    setPosting(true);
    window.setTimeout(() => {
      const time = new Date().toLocaleString('en-US', {
        month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
      });
      const newId = 'pc-' + Date.now();
      setPinnedComments((prev) => [...prev, { id: newId, y: active.y, text, mentions, time, anchor: active.anchor }]);
      setOpenCardId(newId);
      setPosting(false);
      setComposer(null);
      setMentionQuery(null);
    }, 1100);
  };

  const filteredPeople = mentionQuery === null
    ? []
    : MENTION_PEOPLE.filter((p) => p.name.toLowerCase().includes(mentionQuery.toLowerCase())).slice(0, 5);

  // Convert user-posted comments into the panel's comment shape (newest first).
  const postedComments: CollabComment[] = [...pinnedComments].reverse().map((c) => ({
    id: c.id,
    initials: CURRENT_USER.initials,
    name: CURRENT_USER.name,
    time: c.time,
    body: renderMentionBody(c.text, c.mentions),
    clause: c.anchor ? (c.anchor.length > 42 ? c.anchor.slice(0, 42) + '…' : c.anchor) : 'Comment',
  }));

  const openComments = [...postedComments, ...COLLAB_COMMENTS.filter((c) => !c.resolved)];
  const resolvedComments = COLLAB_COMMENTS.filter((c) => c.resolved);
  const visibleComments = commentsTab === 'open' ? openComments : resolvedComments;

  const iconBtn: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32, borderRadius: 6, border: 'none',
    background: 'transparent', cursor: 'pointer', color: '#130032',
  };
  const railBtn = (active: boolean): CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'var(--ink-cobalt-10, #ECE6FF)' : 'transparent',
    color: active ? 'var(--ink-cobalt-80, #4C00FF)' : '#5B5670',
  });
  const toolbarBtn: CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6, height: 30,
    padding: '0 10px', borderRadius: 6, border: '1px solid #DDD9E3',
    background: 'white', cursor: 'pointer', fontSize: 13, color: '#130032',
    fontFamily: 'var(--ink-font-family)', whiteSpace: 'nowrap',
  };
  const divider = <span style={{ width: 1, height: 22, background: '#DDD9E3' }} />;

  const renderRun = (run: DocRun, i: number) => {
    if (run.kind === 'del') return <span key={i} style={{ textDecoration: 'line-through', color: '#C0362C', background: 'rgba(192,54,44,0.08)' }}>{run.text}</span>;
    if (run.kind === 'ins') return <span key={i} style={{ color: '#1F7A33', background: 'rgba(31,122,51,0.10)', textDecoration: 'underline' }}>{run.text}</span>;
    if (run.kind === 'mark') return <span key={i} style={{ background: '#FFF1A8', borderRadius: 2 }}>{run.text}</span>;
    return <span key={i}>{run.text}</span>;
  };

  const statusDot = (s: DocStatus) => {
    const c = s === 'approved' ? '#1F7A33' : s === 'redlined' ? '#C0362C' : '#B0883A';
    return <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />;
  };

  const hasChat = messages.length > 0;

  // ── Comment-rail layout ──
  // When a comment card or composer is open we shift the page left and dock the
  // card 16px past the page's right edge (Google-Docs style). Because a full
  // 800px page + 16px gap + 340px card can exceed the canvas width, the page is
  // narrowed just enough to guarantee the card fits without clipping.
  const RAIL_W = 340;
  const RAIL_GAP = 16;
  const CANVAS_PAD = 24;
  const commentOpen = !!(composer || openCardId);
  const naturalDocW = (zoom / 100) * 800;
  const maxDocW = containerWidth > 0 ? containerWidth - CANVAS_PAD * 2 - RAIL_GAP - RAIL_W : naturalDocW;
  const docW = commentOpen && containerWidth > 0
    ? Math.max(360, Math.min(naturalDocW, maxDocW))
    : naturalDocW;
  // When a comment is open, treat the page + gap + comment rail as one group and
  // center that whole group in the canvas. Otherwise just center the page.
  const groupW = docW + RAIL_GAP + RAIL_W;
  const docLeftOffset = containerWidth > 0
    ? Math.max(CANVAS_PAD, (containerWidth - (commentOpen ? groupW : docW)) / 2)
    : CANVAS_PAD;
  const railLeft = docLeftOffset + docW + RAIL_GAP;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100, background: '#F4F3F6',
      display: 'flex', flexDirection: 'column', fontFamily: 'var(--ink-font-family)',
    }}>
      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, padding: '0 16px', background: 'white',
        borderBottom: '1px solid #E8E6ED', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <button onClick={() => (onSave ?? onClose)()} style={iconBtn} aria-label="Back"><Icon name="arrow-left" size={20} /></button>
          <Icon name="document" size={18} color="var(--ink-cobalt-80)" />
          <span style={{ fontSize: 15, fontWeight: 600, color: '#130032', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{headerFileName}</span>
          <button style={{ ...toolbarBtn, height: 26 }}>version 4.0 <Icon name="chevron-down" size={14} /></button>
          <span style={{ padding: '3px 10px', borderRadius: 12, background: '#FFF4E5', color: '#8A5A00', fontSize: 12, fontWeight: 600 }}>In Review</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button style={iconBtn} aria-label="More options"><Icon name="overflow-horizontal" size={18} /></button>
          <button
            style={{ ...iconBtn, background: showComments ? 'var(--ink-cobalt-10, #ECE6FF)' : 'transparent' }}
            aria-label="Comments"
            onClick={() => setShowComments(v => { const next = !v; if (next) setShowAiPanel(false); return next; })}
          >
            <Icon name="comment" size={18} color={showComments ? 'var(--ink-cobalt-80)' : undefined} />
          </button>
          <button style={{ ...iconBtn, background: showAiPanel ? 'var(--ink-cobalt-10, #ECE6FF)' : 'transparent' }} aria-label="Toggle AI panel" onClick={() => setShowAiPanel(v => { const next = !v; if (next) setShowComments(false); return next; })}>
            <Icon name="ai-spark-filled" size={18} color="var(--ink-cobalt-80)" />
          </button>
                <Button kind="tertiary" size="small" onClick={() => (onSave ?? onClose)()}>Save</Button>
                <Button kind="secondary" size="small" onClick={() => (onSendForApproval ? onSendForApproval(headerFileName) : (onSave ?? onClose)())}>Send for Approval</Button>
          <Button kind="primary" size="small" onClick={() => (onSendForSignature ? onSendForSignature(baseDocName) : (onSave ?? onClose)())}>Send for Signature</Button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      {!doc.hideEditToolbar && (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 16px',
        background: 'white', borderBottom: '1px solid #E8E6ED', flexShrink: 0, overflowX: 'auto',
      }}>
        <button style={{ ...toolbarBtn, background: editing ? 'var(--ink-cobalt-10, #ECE6FF)' : 'white', color: editing ? 'var(--ink-cobalt-80, #4C00FF)' : '#130032' }} onClick={() => setEditing(v => !v)}>
          <Icon name="pencil" size={14} /> {editing ? 'Editing' : 'Viewing'} <Icon name="chevron-down" size={14} />
        </button>
        {divider}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#5B5670' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 34, height: 28, border: '1px solid #DDD9E3', borderRadius: 6, color: '#130032' }}>1</span>
          <span>/ {doc.pages}</span>
        </div>
        {divider}
        <button style={toolbarBtn}>Body Text <Icon name="chevron-down" size={14} /></button>
        <button style={toolbarBtn}>Arial <Icon name="chevron-down" size={14} /></button>
        <button style={toolbarBtn}>12 <Icon name="chevron-down" size={14} /></button>
        {divider}
        <button style={iconBtn} aria-label="Bold" onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}><Icon name="bold" size={16} /></button>
        <button style={iconBtn} aria-label="Italic" onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}><Icon name="italics" size={16} /></button>
        <button style={iconBtn} aria-label="Underline" onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}><Icon name="underline" size={16} /></button>
        <button style={iconBtn} aria-label="Highlight" onMouseDown={(e) => { e.preventDefault(); exec('hiliteColor', '#FFF1A8'); }}><Icon name="text-color" size={16} /></button>
        <button style={iconBtn} aria-label="Link" onMouseDown={(e) => { e.preventDefault(); const u = window.prompt('Link URL'); if (u) exec('createLink', u); }}><Icon name="link" size={16} /></button>
        {divider}
        <button style={iconBtn} aria-label="Align left" onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }}><Icon name="text-align-start" size={16} /></button>
        <button style={iconBtn} aria-label="Bulleted list" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }}><Icon name="bulleted-list" size={16} /></button>
        <button style={iconBtn} aria-label="Numbered list" onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }}><Icon name="numbered-list" size={16} /></button>
      </div>
      )}

      {/* ── Body: left rail + flyout + canvas + AI panel ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* Left icon rail */}
        <div style={{
          width: 56, flexShrink: 0, background: 'white', borderRight: '1px solid #E8E6ED',
          display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <button
              style={railBtn(leftPanel === 'approvals' || leftPanel === 'addApproval')}
              aria-label="Approvals"
              title="Approvals"
              onClick={() => setLeftPanel((p) => (p === 'approvals' || p === 'addApproval') ? null : 'approvals')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M16 11H13V8.98C14.21 8.07 15 6.63 15 5C15 2.24 12.76 0 10 0C7.24 0 5 2.24 5 5C5 6.63 5.79 8.06 7 8.98V11H4C2.9 11 2 11.9 2 13V16C2 17.1 2.9 18 4 18V20H16V18C17.1 18 18 17.1 18 16V13C18 11.9 17.1 11 16 11ZM8.21 7.51C7.44 6.93 6.88 5.94 6.88 5C6.88 3.35 8.35 1.88 10 1.88C11.65 1.88 13.12 3.35 13.12 5C13.12 5.93 12.56 6.93 11.79 7.51L11 8.11V11H9V8.11L8.21 7.51ZM16 16H4V13H16V16Z" fill="currentColor" />
              </svg>
            </button>
            <button style={railBtn(leftPanel === 'clauses')} aria-label="Clauses" title="Clauses" onClick={() => setLeftPanel(p => p === 'clauses' ? null : 'clauses')}>
              <Icon name="bulleted-list" size={20} color="currentColor" />
            </button>
            <button style={railBtn(leftPanel === 'playbook')} aria-label="Playbooks" title="Playbooks" onClick={() => setLeftPanel(p => p === 'playbook' ? null : 'playbook')}>
              <Icon name="shield" size={20} color="currentColor" />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button style={iconBtn} aria-label="Zoom out" onClick={() => setZoom(z => Math.max(50, z - 10))}><Icon name="zoom-out" size={18} /></button>
            <span style={{ fontSize: 11, color: '#5B5670' }}>{zoom}%</span>
            <button style={iconBtn} aria-label="Zoom in" onClick={() => setZoom(z => Math.min(200, z + 10))}><Icon name="zoom-in" size={18} /></button>
          </div>
        </div>

        {/* Flyout panel */}
        {(leftPanel === 'clauses' || leftPanel === 'playbook') && (
          <div style={{ width: 280, flexShrink: 0, background: 'white', borderRight: '1px solid #E8E6ED', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, padding: '0 16px', borderBottom: '1px solid #E8E6ED' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#130032' }}>{leftPanel === 'clauses' ? 'Clauses' : 'Playbook'}</span>
              <button style={iconBtn} aria-label="Close panel" onClick={() => setLeftPanel(null)}><Icon name="close" size={18} /></button>
            </div>

            {leftPanel === 'clauses' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                {doc.clauses.map((c) => (
                  <button key={c.num} onClick={() => scrollToSection(c.num)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                    padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: activeSection === c.num ? 'var(--ink-cobalt-10, #ECE6FF)' : 'transparent',
                    fontFamily: 'var(--ink-font-family)', marginBottom: 2,
                  }}>
                    {!doc.hideClauseStatus && statusDot(c.status)}
                    <span style={{ fontSize: 13, color: '#130032', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.num}. {c.heading}</span>
                  </button>
                ))}
              </div>
            )}

            {leftPanel === 'playbook' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#5B5670', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>Key Terms</div>
                <div style={{ border: '1px solid #E8E6ED', borderRadius: 10, padding: '4px 12px', marginBottom: 20 }}>
                  {(doc.keyTerms ?? []).map((k, i, arr) => (
                    <div key={k.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #F0EEF4' : 'none' }}>
                      <span style={{ fontSize: 12, color: '#5B5670' }}>{k.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#130032', textAlign: 'right' }}>{k.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#5B5670', textTransform: 'uppercase', letterSpacing: 0.4 }}>Playbook Rules</span>
                  <span style={{ fontSize: 11, color: '#5B5670' }}>{(doc.playbook ?? []).filter(r => r.status === 'passed').length}/{(doc.playbook ?? []).length} passed</span>
                </div>
                {(doc.playbook ?? []).map((r) => {
                  const passed = r.status === 'passed';
                  const exp = expandedRule === r.name;
                  return (
                    <div key={r.name} style={{ border: '1px solid #E8E6ED', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
                      <button onClick={() => setExpandedRule(exp ? null : r.name)} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8, width: '100%', textAlign: 'left',
                        padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--ink-font-family)',
                      }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: passed ? 'rgba(31,122,51,0.12)' : '#FFF4E5' }}>
                          <Icon name={passed ? 'check' : 'overflow-horizontal'} size={12} color={passed ? '#1F7A33' : '#8A5A00'} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#130032' }}>{r.name}</span>
                          <span style={{ display: 'block', fontSize: 11, color: '#5B5670' }}>{r.section}</span>
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 8, whiteSpace: 'nowrap', color: passed ? '#1F7A33' : '#8A5A00', background: passed ? 'rgba(31,122,51,0.12)' : '#FFF4E5' }}>
                          {passed ? 'Passed' : 'Review'}
                        </span>
                      </button>
                      {exp && (
                        <div style={{ padding: '0 12px 12px 38px', fontSize: 12, lineHeight: 1.5, color: '#5B5670' }}>{r.details}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add Approval panel */}
        {leftPanel === 'addApproval' && approvalDraft && (
          <div style={{ width: 420, flexShrink: 0, background: 'white', borderRight: '1px solid #E8E6ED', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 20px', borderBottom: '1px solid #E8E6ED', flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#130032' }}>Add Approval</span>
              <button style={iconBtn} aria-label="Close approval panel" onClick={() => { setLeftPanel(null); setApprovalDraft(null); }}><Icon name="close" size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {approvalDraft.anchor && (
                <div style={{ background: '#FCF4D6', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 14, lineHeight: 1.5, color: '#130032' }}>
                  <strong style={{ fontWeight: 700 }}>Selected: </strong>{'\u201C'}{approvalDraft.anchor}{'\u201D'}
                </div>
              )}

              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#130032', marginBottom: 8 }}>
                Description <span style={{ color: '#C0362C' }}>*</span>
              </label>
              <textarea
                value={approvalDraft.description}
                onChange={(e) => setApprovalDraft((d) => d ? { ...d, description: e.target.value } : d)}
                placeholder="Add a description"
                style={{ width: '100%', minHeight: 88, resize: 'vertical', borderRadius: 10, border: '1px solid #DDD9E3', background: '#F7F6F9', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, fontFamily: 'var(--ink-font-family)', color: '#130032', marginBottom: 24, boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#130032' }}>Require all to approve</div>
                  <div style={{ fontSize: 13, color: '#8A85A0', lineHeight: 1.4, marginTop: 2, maxWidth: 300 }}>You cannot require all to approve if a group has been added as an approver</div>
                </div>
                <button
                  role="switch"
                  aria-checked={approvalDraft.requireAll}
                  aria-label="Require all to approve"
                  onClick={() => setApprovalDraft((d) => d ? { ...d, requireAll: !d.requireAll } : d)}
                  style={{
                    flexShrink: 0, width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', padding: 2,
                    background: approvalDraft.requireAll ? 'var(--ink-cobalt-80, #4C00FF)' : '#C7C3D0',
                    display: 'flex', justifyContent: approvalDraft.requireAll ? 'flex-end' : 'flex-start', transition: 'background 0.15s',
                  }}
                >
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
                </button>
              </div>

              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#130032', marginBottom: 8 }}>
                Add approvers <span style={{ color: '#C0362C' }}>*</span>
              </label>
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <input
                  value={approverQuery}
                  onChange={(e) => setApproverQuery(e.target.value)}
                  placeholder="Type name or email"
                  style={{ width: '100%', height: 48, borderRadius: 10, border: '1px solid #DDD9E3', background: '#F7F6F9', padding: '0 14px', fontSize: 14, fontFamily: 'var(--ink-font-family)', color: '#130032', boxSizing: 'border-box' }}
                />
                {approverMatches.length > 0 && (
                  <div style={{ position: 'absolute', top: 52, left: 0, right: 0, zIndex: 5, background: 'white', borderRadius: 12, border: '1px solid #EAE7F0', boxShadow: '0 12px 28px rgba(19,0,50,0.16)', padding: '6px 4px' }}>
                    {approverMatches.map((p) => (
                      <button
                        key={p.email}
                        onClick={() => addApprover(p)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FB'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '8px 14px', borderRadius: 8, fontFamily: 'var(--ink-font-family)' }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: '#8A85A0' }}>{p.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {approvalDraft.approvers.map((p) => {
                const col = avatarColor(p.name);
                return (
                  <div key={p.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                    <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: col.bg, color: col.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{initialsOf(p.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: '#8A85A0' }}>{p.email}</div>
                    </div>
                    <button style={iconBtn} aria-label={`Remove ${p.name}`} onClick={() => removeApprover(p.email)}><Icon name="close" size={16} /></button>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: 16, borderTop: '1px solid #E8E6ED', flexShrink: 0 }}>
              <button
                onClick={resetApproval}
                style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#F1EFF4', color: '#130032', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)' }}
              >Reset</button>
              <button
                onClick={createApproval}
                disabled={creatingApproval || !approvalDraft.description.trim() || approvalDraft.approvers.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 24px', borderRadius: 8, border: 'none',
                  background: 'var(--ink-cobalt-80, #4C00FF)', color: 'white',
                  cursor: (creatingApproval || !approvalDraft.description.trim() || approvalDraft.approvers.length === 0) ? 'default' : 'pointer',
                  opacity: (!creatingApproval && (!approvalDraft.description.trim() || approvalDraft.approvers.length === 0)) ? 0.5 : 1,
                  fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)',
                }}
              >
                {creatingApproval && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'inkSpin 0.7s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                    <path d="M8 2 A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                Create Approval
              </button>
            </div>
          </div>
        )}

        {/* Approvals list panel */}
        {leftPanel === 'approvals' && (
          <div style={{ width: 420, flexShrink: 0, background: 'white', borderRight: '1px solid #E8E6ED', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 20px', borderBottom: '1px solid #E8E6ED', flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#130032' }}>Approvals</span>
              <button style={iconBtn} aria-label="Close approvals panel" onClick={() => setLeftPanel(null)}><Icon name="close" size={18} /></button>
            </div>

            <div style={{ display: 'flex', gap: 8, padding: '16px 20px 8px', flexShrink: 0 }}>
              {['All types', 'All assignees'].map((f) => (
                <button key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 14px',
                  borderRadius: 8, border: '1px solid #DDD9E3', background: 'white', cursor: 'pointer',
                  fontFamily: 'var(--ink-font-family)', fontSize: 14, fontWeight: 500, color: '#130032',
                }}>
                  {f}<Icon name="chevron-down" size={14} />
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 20px' }}>
              {approvals.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: '#F1EFF4', marginBottom: 16 }}>
                    <Icon name="shield" size={22} color="#8A85A0" />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#130032', marginBottom: 6 }}>No approvals yet</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: '#8A85A0', maxWidth: 260 }}>
                    Route this document for review to start tracking approvals here.
                  </div>
                </div>
              ) : approvals.map((a) => {
                const stack = [CURRENT_USER.name, ...a.approvers.map((p) => p.name)];
                return (
                  <div key={a.id} style={{ padding: '16px 0', borderBottom: '1px solid #EFEDF3' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div style={{ display: 'flex' }}>
                        {stack.map((name, i) => {
                          const col = avatarColor(name);
                          return (
                            <div key={name + i} style={{
                              width: 28, height: 28, borderRadius: '50%', background: col.bg, color: col.fg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 600, border: '2px solid white', marginLeft: i === 0 ? 0 : -8,
                            }}>{initialsOf(name)}</div>
                          );
                        })}
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: 8, background: '#F1EFF4', color: '#5B5670', fontSize: 13, fontWeight: 500 }}>{a.status}</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, color: '#130032' }}>{a.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Document canvas */}
        <div
          ref={scrollRef}
          onMouseUp={handleCanvasMouseUp}
          onMouseDown={() => { if (openCardId) setOpenCardId(null); }}
          onScroll={() => { if (selMenu) setSelMenu(null); }}
          style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '32px 24px', background: '#F4F3F6' }}
        >
          <div
            ref={canvasRef}
            contentEditable={editing}
            suppressContentEditableWarning
            spellCheck={false}
            style={{
              maxWidth: 800,
              marginTop: 0, marginBottom: 0,
              marginLeft: commentOpen && containerWidth > 0 ? Math.max(0, docLeftOffset - CANVAS_PAD) : 'auto',
              marginRight: 'auto',
              background: 'white', borderRadius: 4,
              boxShadow: '0 1px 8px rgba(19,0,50,0.10)', padding: '64px 72px', outline: 'none',
              width: `${docW}px`, transformOrigin: 'top center',
              transition: 'width 0.18s ease, margin-left 0.18s ease',
            }}
          >
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 0.5, textAlign: 'center', color: '#130032', margin: '0 0 8px 0', textTransform: 'uppercase' }}>{baseDocName}</h1>
            <p style={{ textAlign: 'center', color: '#5B5670', margin: '0 0 2px 0', fontSize: 14 }}>{doc.parties}</p>
            <p style={{ textAlign: 'center', color: '#5B5670', margin: '0 0 40px 0', fontSize: 13 }}>Effective Date: {doc.effectiveDate}</p>

            {doc.clauses.map((c) => {
              const meta = STATUS_META[c.status];
              return (
                <div key={c.num} ref={(el) => { sectionRefs.current[c.num] = el; }} style={{ marginBottom: 26, scrollMarginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 8px 0' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#130032', margin: 0 }}>{c.num}. {c.heading}</h2>
                    {!doc.hideClauseStatus && (
                      <span contentEditable={false} style={{ padding: '2px 8px', borderRadius: 10, background: meta.bg, color: meta.color, fontSize: 11, fontWeight: 600 }}>{meta.label}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#130032', margin: 0 }}>{c.runs.map(renderRun)}</p>
                </div>
              );
            })}

            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E8E6ED', display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {doc.parties.split(' & ').map((party) => (
                <div key={party} style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#130032', marginBottom: 28 }}>{party}</div>
                  <div style={{ borderBottom: '1px solid #5B5670', marginBottom: 6 }} />
                  <div style={{ fontSize: 12, color: '#5B5670' }}>Authorized Signature</div>
                </div>
              ))}
            </div>
          </div>

          {/* Text-selection context menu */}
          {selMenu && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              style={{
                position: 'absolute', left: selMenu.x, top: selMenu.y, zIndex: 30,
                minWidth: 240, background: 'white', borderRadius: 12, padding: 8,
                border: '1px solid #EAE7F0', boxShadow: '0 12px 32px rgba(19,0,50,0.18)',
                fontFamily: 'var(--ink-font-family)',
              }}
            >
              {[
                { label: 'Add comment', path: 'M18 8V16.01H5.38L2 19H0V2H12V4H2V16.33L4.62 14.01H16V8.01H18V8ZM14 6H4V8H14V6ZM11 10H4V12H11V10ZM20 2H18V0H16V2H14V4H16V6H18V4H20V2Z', onClick: openComposer },
                { label: 'Add approval', path: 'M16 11H13V8.98C14.21 8.07 15 6.63 15 5C15 2.24 12.76 0 10 0C7.24 0 5 2.24 5 5C5 6.63 5.79 8.06 7 8.98V11H4C2.9 11 2 11.9 2 13V16C2 17.1 2.9 18 4 18V20H16V18C17.1 18 18 17.1 18 16V13C18 11.9 17.1 11 16 11ZM8.21 7.51C7.44 6.93 6.88 5.94 6.88 5C6.88 3.35 8.35 1.88 10 1.88C11.65 1.88 13.12 3.35 13.12 5C13.12 5.93 12.56 6.93 11.79 7.51L11 8.11V11H9V8.11L8.21 7.51ZM16 16H4V13H16V16Z', onClick: openApproval },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, width: '100%',
                    padding: '10px 14px', border: 'none', borderRadius: 8, background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--ink-font-family)',
                    fontSize: 16, color: '#130032',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                    <path d={item.path} fill="#130032" fillOpacity="0.9" />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <style>{commentComposerStyles}</style>

          {/* Posted comment card (only the open one shows on the canvas; all remain in the Comments panel) */}
          {pinnedComments.filter((c) => c.id === openCardId).map((c) => (
            <div
              key={c.id}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', left: railLeft, top: c.y, zIndex: 29, width: RAIL_W,
                background: 'white', borderRadius: 12, padding: 16,
                border: '1px solid #EAE7F0', boxShadow: '0 8px 24px rgba(19,0,50,0.12)',
                fontFamily: 'var(--ink-font-family)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                  background: '#CFE9E5', color: '#0F6B5F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                }}>{CURRENT_USER.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{CURRENT_USER.name}</div>
                  <div style={{ fontSize: 13, color: '#8A85A0' }}>{c.time}</div>
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button style={iconBtn} aria-label="Resolve comment" onClick={() => setPinnedComments((prev) => prev.filter((x) => x.id !== c.id))}><Icon name="check" size={16} /></button>
                  <button style={iconBtn} aria-label="More options"><Icon name="overflow-vertical" size={16} /></button>
                </div>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: '#130032', marginTop: 12 }}>
                {renderMentionBody(c.text, c.mentions)}
              </div>
            </div>
          ))}

          {/* Comment composer */}
          {composer && (
            <div
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', left: railLeft, top: composer.y, zIndex: 32, width: RAIL_W,
                background: 'white', borderRadius: 16, padding: 16,
                border: '1px solid #EAE7F0', boxShadow: '0 16px 40px rgba(19,0,50,0.20)',
                fontFamily: 'var(--ink-font-family)',
              }}
            >
              <div
                className="ink-comment-box"
                style={{ border: '1px solid #DDD9E3', borderRadius: 10, padding: 12, transition: 'border-color 0.15s' }}
              >
                <div
                  ref={composerRef}
                  className="ink-comment-input"
                  contentEditable={!posting}
                  suppressContentEditableWarning
                  data-placeholder="Comment or type @ to mention someone"
                  onInput={handleComposerInput}
                  style={{
                    minHeight: 48, fontSize: 14, lineHeight: 1.5,
                    color: posting ? '#8A85A0' : '#130032', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}
                />
              </div>

              {/* Mention dropdown */}
              {mentionQuery !== null && filteredPeople.length > 0 && (
                <div style={{
                  marginTop: 8, background: 'white', borderRadius: 12, padding: '10px 4px',
                  border: '1px solid #EAE7F0', boxShadow: '0 12px 28px rgba(19,0,50,0.16)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#8A85A0', padding: '2px 14px 8px' }}>Select who to notify</div>
                  {filteredPeople.map((p) => (
                    <button
                      key={p.email}
                      onMouseDown={(e) => { e.preventDefault(); pickMention(p); }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F3FB'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', border: 'none',
                        background: 'transparent', cursor: 'pointer', padding: '8px 14px', borderRadius: 8,
                        fontFamily: 'var(--ink-font-family)',
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: '#8A85A0' }}>{p.email}</div>
                    </button>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <button style={iconBtn} aria-label="Mention someone" onMouseDown={(e) => { e.preventDefault(); triggerMention(); }}>
                  <Icon name="at" size={18} />
                </button>
                <div style={{ flex: 1 }} />
                <button
                  onClick={cancelComposer}
                  style={{
                    height: 36, padding: '0 16px', borderRadius: 8, border: 'none',
                    background: '#F1EFF4', color: '#130032', cursor: 'pointer',
                    fontFamily: 'var(--ink-font-family)', fontSize: 14, fontWeight: 600,
                  }}
                >Cancel</button>
                <button
                  onClick={postComment}
                  disabled={posting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    height: 36, padding: '0 18px', borderRadius: 8, border: 'none',
                    background: 'var(--ink-cobalt-80, #4C00FF)', color: 'white',
                    cursor: posting ? 'default' : 'pointer', opacity: posting ? 0.9 : 1,
                    fontFamily: 'var(--ink-font-family)', fontSize: 14, fontWeight: 600,
                  }}
                >
                  {posting && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'inkSpin 0.7s linear infinite' }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      <path d="M8 2 A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI-Assisted panel */}
        {showAiPanel && (
          <div style={{ width: 360, flexShrink: 0, borderLeft: '1px solid #E8E6ED', background: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 16px', borderBottom: '1px solid #E8E6ED' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="ai-spark-filled" size={18} color="var(--ink-cobalt-80)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#130032' }}>AI-Assisted</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {hasChat && <button style={iconBtn} aria-label="New chat" onClick={() => setMessages([])}><Icon name="plus" size={16} /></button>}
                <button style={iconBtn} aria-label="Close AI panel" onClick={() => setShowAiPanel(false)}><Icon name="close" size={18} /></button>
              </div>
            </div>

            <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
              {!hasChat ? (
                <>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#130032', marginBottom: 4 }}>Hello, Lisa</div>
                  <div style={{ fontSize: 15, color: '#5B5670', marginBottom: 20 }}>What would you like to know?</div>
                  <div style={{ border: '1px solid #E8E6ED', borderRadius: 12, padding: 16, marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#130032', marginBottom: 8 }}>Agreement summary</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: '#5B5670', maxHeight: summaryExpanded ? 'none' : 66, overflow: 'hidden' }}>{doc.summary}</div>
                    <button onClick={() => setSummaryExpanded(v => !v)} style={{ ...iconBtn, width: '100%', height: 24, marginTop: 4 }} aria-label="Toggle summary">
                      <Icon name={summaryExpanded ? 'chevron-up' : 'chevron-down'} size={16} />
                    </button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#5B5670', marginBottom: 12 }}>My shortcuts</div>
                  {AI_SHORTCUTS.map((s) => (
                    <button key={s} onClick={() => send(s)} style={{
                      display: 'block', width: '100%', textAlign: 'left', marginBottom: 8,
                      padding: '12px 14px', borderRadius: 999, border: '1px solid #DDD9E3',
                      background: 'white', cursor: 'pointer', fontSize: 13, color: '#130032', fontFamily: 'var(--ink-font-family)',
                    }}>{s}</button>
                  ))}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                      <div style={{
                        padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.55,
                        background: m.role === 'user' ? 'var(--ink-cobalt-80, #4C00FF)' : '#F4F3F6',
                        color: m.role === 'user' ? 'white' : '#130032',
                        borderTopRightRadius: m.role === 'user' ? 4 : 14,
                        borderTopLeftRadius: m.role === 'user' ? 14 : 4,
                      }}>{m.text}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid #E8E6ED' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px 8px 14px', borderRadius: 999, border: '1px solid #DDD9E3' }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(input); } }}
                  placeholder="Ask anything about this document..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#130032', background: 'transparent', fontFamily: 'var(--ink-font-family)' }}
                />
                <button
                  onClick={() => send(input)}
                  aria-label="Send"
                  disabled={!input.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
                    borderRadius: '50%', border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    background: input.trim() ? 'var(--ink-cobalt-80, #4C00FF)' : '#E8E6ED',
                  }}
                >
                  <Icon name="send" size={16} color="white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collaborate panel */}
        {showComments && (
          <div style={{ width: 400, flexShrink: 0, borderLeft: '1px solid #E8E6ED', background: 'white', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 20px', borderBottom: '1px solid #E8E6ED', flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#130032' }}>Comments</span>
              <button style={iconBtn} aria-label="Close comments" onClick={() => setShowComments(false)}><Icon name="close" size={18} /></button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, padding: '12px 16px', flexShrink: 0 }}>
              {([['open', 'Open', openComments.length], ['resolved', 'Resolved', resolvedComments.length]] as const).map(([key, label, count]) => {
                const active = commentsTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCommentsTab(key)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      height: 40, borderRadius: 10, cursor: 'pointer',
                      border: active ? '1px solid #DDD9E3' : '1px solid transparent',
                      background: active ? 'white' : 'transparent',
                      boxShadow: active ? '0 1px 3px rgba(19,0,50,0.08)' : 'none',
                      fontFamily: 'var(--ink-font-family)', fontSize: 14, fontWeight: 600,
                      color: active ? '#130032' : '#5B5670',
                    }}
                  >
                    {label}
                    <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#5B5670' : '#8A85A0' }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', flexShrink: 0 }}>
              {['Type: All', 'Assignee: All'].map((f) => (
                <button key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 12px',
                  borderRadius: 8, border: '1px solid #DDD9E3', background: 'white', cursor: 'pointer',
                  fontFamily: 'var(--ink-font-family)', fontSize: 13, fontWeight: 500, color: '#130032',
                }}>
                  {f}<Icon name="chevron-down" size={14} />
                </button>
              ))}
            </div>

            {/* Comment list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 20px' }}>
              {visibleComments.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '50%', background: '#F1EFF4', marginBottom: 16 }}>
                    <Icon name="comment" size={22} color="#8A85A0" />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#130032', marginBottom: 6 }}>
                    {commentsTab === 'resolved' ? 'No resolved comments' : 'No comments yet'}
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: '#8A85A0', maxWidth: 260 }}>
                    {commentsTab === 'resolved'
                      ? 'Comments you resolve will be collected here for reference.'
                      : 'Start the conversation by adding a comment or approval to any clause.'}
                  </div>
                </div>
              ) : visibleComments.map((c) => {
                const selected = c.id === visibleComments[0].id;
                const isPosted = pinnedComments.some((p) => p.id === c.id);
                return (
                  <div
                    key={c.id}
                    onClick={isPosted ? () => {
                      const pinned = pinnedComments.find((p) => p.id === c.id);
                      setOpenCardId(c.id);
                      if (pinned) scrollRef.current?.scrollTo({ top: Math.max(0, pinned.y - 40), behavior: 'smooth' });
                    } : undefined}
                    style={{
                      position: 'relative', padding: '16px 12px', borderRadius: 12, marginBottom: 4,
                      background: selected ? '#F5F3FB' : 'transparent',
                      cursor: isPosted ? 'pointer' : 'default',
                    }}
                  >
                    {selected && (
                      <div style={{ position: 'absolute', top: 12, right: 8, display: 'flex', gap: 2, background: 'white', borderRadius: 8, border: '1px solid #EAE7F0', boxShadow: '0 2px 6px rgba(19,0,50,0.08)' }}>
                        <button style={iconBtn} aria-label="Resolve comment"><Icon name="check" size={16} /></button>
                        <button style={iconBtn} aria-label="More options"><Icon name="overflow-horizontal" size={16} /></button>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--ink-cobalt-10, #ECE6FF)', color: 'var(--ink-cobalt-80, #4C00FF)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600,
                      }}>{c.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: '#130032' }}>{c.name}</span>
                          {c.redline && (
                            <span style={{ padding: '1px 8px', borderRadius: 10, background: '#FCE8EC', color: '#B4234A', fontSize: 12, fontWeight: 600 }}>Redline</span>
                          )}
                          <span style={{ fontSize: 13, color: '#8A85A0' }}>{c.time}</span>
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.5, color: '#3D3852', marginBottom: 10 }}>{c.body}</div>
                        <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'var(--ink-neutral-fade-6, #F1EFF4)', fontSize: 13, color: '#5B5670' }}>{c.clause}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface WorkspaceViewProps {
  agreement: Agreement;
  onClose: () => void;
  onRename?: (name: string) => void;
  onEditNDA?: () => void;
  savedNDAData?: NDAFormData | null;
  ndaSentForSignature?: boolean;
  ndaRecipientName?: string;
  uploadedDocAgreement?: { documents: string[], recipientName: string, isDraft?: boolean } | null;
  // Documents added to this space via Add Document → Upload, persisted in the
  // parent (keyed by agreement id) so they survive navigating away and back.
  persistedAddedDocs?: string[];
  onAddDocument?: (documentName: string) => void;
  onPreviewDocument?: (documentName: string) => void;
  injectedTasks?: DealTask[];
  // Documents sent for signature from outside this component (e.g. the global
  // document-preview header CTA). Their status is shown as Pending Signature
  // without replacing the workspace or removing the document.
  injectedSignatureDocs?: { name: string; recipient: string }[];
  // Documents sent for signature from within this workspace, persisted in the
  // parent (keyed by agreement id) so their Pending Signature status survives
  // navigating away from the workspace and back.
  persistedSignedDocs?: { name: string; recipient: string }[];
  onSignDocs?: (docs: { name: string; recipient: string }[]) => void;
  // Deep-link entry points: auto-open an overlay when the workspace mounts from
  // a scenario URL, prefilled with the provided data.
  initialOverlay?: 'upload-request' | 'vendor-onboarding' | null;
  uploadRequestPrefill?: Partial<UploadRequestData> | null;
  vendorOnboardingPrefill?: Partial<VendorOnboardingData> | null;
}

/* ═══════════════════════════════════════
   PrepareScreen Component (Signature Request Flow)
   ═══════════════════════════════════════ */

interface DocumentUploadProps {
  open: boolean;
  onClose: () => void;
  onContinue?: (documents: string[]) => void;
}

function DocumentUpload({ open, onClose, onContinue }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<string[]>([]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'white',
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--ink-border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close"
          >
            <Icon name="close" size={20} color="var(--ink-text-default)" />
          </button>
          <span style={{ width: 1, height: 20, background: 'var(--ink-border-subtle)' }} />
          <Text size="sm" weight="medium">Document Upload</Text>
        </div>
        <Button
          kind="primary"
          size="small"
          disabled={documents.length === 0}
          onClick={() => onContinue?.(documents)}
        >
          Continue
        </Button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 500,
            fontFamily: 'var(--ink-font-family)',
            color: '#130032',
            margin: '0 0 24px 0',
          }}>Document Upload</h1>

          {documents.length === 0 ? (
            /* Empty state — full-width dropzone */
            <div style={{
              width: '100%',
              padding: '48px 24px',
              background: 'var(--ink-bg-color-secondary)',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              cursor: 'pointer',
            }}>
              {/* Upload icon in rounded pill */}
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: '#D5D3DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6.5V16H11V6.5L7.5 10L6.09 8.59L12 2.68L17.91 8.59L16.5 10L13 6.5ZM4 18H20V20H4V18Z" fill="#130032"/>
                </svg>
              </div>
              <Text size="sm" weight="medium" style={{ color: '#130032' }}>Drop your files here or</Text>
              {/* Upload button with chevron */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button style={{
                  background: 'var(--ink-cobalt-80)',
                  border: 'none',
                  borderRadius: '6px 0 0 6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  fontFamily: 'var(--ink-font-family)',
                }}
                onClick={() => setDocuments([...documents, 'New Vendor Contract'])}
                >
                  Upload
                </button>
                <button style={{
                  background: 'var(--ink-cobalt-80)',
                  border: 'none',
                  borderLeft: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '0 6px 6px 0',
                  padding: '10px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <Icon name="chevron-down" size={14} color="white" />
                </button>
              </div>
            </div>
          ) : (
            /* Has documents — card grid + small add tile */
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {documents.map((docName, idx) => (
                <div key={idx} style={{
                  width: 220,
                  border: '1px solid var(--ink-border-subtle)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: 'white',
                }}>
                  <div style={{
                    height: 160,
                    background: '#fafafa',
                    borderRadius: '12px 12px 0 0',
                    borderBottom: '1px solid var(--ink-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                  }}>
                    {/* Document page mockup */}
                    <div style={{
                      width: 90,
                      height: 120,
                      background: 'white',
                      borderRadius: 4,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}>
                      {/* Title line */}
                      <div style={{ height: 5, background: '#c8c6d0', borderRadius: 3, width: '70%' }} />
                      {/* Text lines */}
                      {[100, 85, 90, 75, 80, 65, 90, 70].map((w, i) => (
                        <div key={i} style={{ height: 3, background: '#e2e0e8', borderRadius: 2, width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <Text size="sm" weight="medium" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docName}</Text>
                    <button
                      onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
                      aria-label={`Remove ${docName}`}
                    >
                      <Icon name="trash" size={16} color="var(--ink-text-secondary)" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Small add tile */}
              <button
                onClick={() => setDocuments([...documents, 'Untitled Document'])}
                style={{
                  width: 220,
                  height: 210,
                  border: '1px dashed var(--ink-border-subtle)',
                  borderRadius: 12,
                  background: 'var(--ink-bg-color-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
                aria-label="Add another document"
              >
                <Icon name="plus" size={24} color="var(--ink-text-secondary)" />
                <Text size="sm" weight="medium" style={{ color: 'var(--ink-text-secondary)' }}>Add document</Text>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PrepareScreenProps {
  open: boolean;
  onClose: () => void;
  preselectedDocs?: string[];
  onSend?: (documents: string[], recipients: Recipient[]) => void;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'signer' | 'viewer' | 'approver';
}

function PrepareScreen({ open, onClose, preselectedDocs = [], onSend }: PrepareScreenProps) {
  const [docsExpanded, setDocsExpanded] = useState(true);
  const [recipientsExpanded, setRecipientsExpanded] = useState(true);
  const [messageExpanded, setMessageExpanded] = useState(true);
  
  const [documents, setDocuments] = useState<string[]>(preselectedDocs);
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: '', email: '', role: 'signer' }
  ]);
  const [signingOrder, setSigningOrder] = useState(false);
  const [customMessage, setCustomMessage] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [reminderDays, setReminderDays] = useState('2');

  // Update documents when preselectedDocs changes
  useEffect(() => {
    setDocuments(preselectedDocs);
  }, [preselectedDocs]);

  if (!open) return null;

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    paddingBottom: 16,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 500,
    fontFamily: 'var(--ink-font-family)',
    color: '#130032',
    margin: 0,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--ink-border-subtle)',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'var(--ink-font-family)',
    color: '#130032',
    background: 'white',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const addRecipient = () => {
    setRecipients([...recipients, {
      id: String(Date.now()),
      name: '',
      email: '',
      role: 'signer',
    }]);
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(recipients.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'white',
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid var(--ink-border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close"
          >
            <Icon name="close" size={20} color="var(--ink-text-default)" />
          </button>
          <span style={{ width: 1, height: 20, background: 'var(--ink-border-subtle)' }} />
          <Text size="sm" weight="medium" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 600 }}>
            Signature Request: {documents.length > 0 ? documents.join(', ') : 'Your Envelope Name Here'}
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button kind="tertiary" size="small">Advanced Options</Button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Help"
          >
            <Icon name="help" size={20} color="var(--ink-text-secondary)" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          {/* Add documents section */}
          <section style={{ marginBottom: 40 }}>
            <div style={sectionHeaderStyle} onClick={() => setDocsExpanded(!docsExpanded)}>
              <h2 style={sectionTitleStyle}>Add documents</h2>
              <Icon name={docsExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="var(--ink-text-secondary)" />
            </div>
            {docsExpanded && (
              documents.length === 0 ? (
                /* Empty state — full-width dropzone */
                <div style={{
                  width: '100%',
                  padding: '48px 24px',
                  background: 'var(--ink-bg-color-secondary)',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  cursor: 'pointer',
                }}>
                  {/* Upload icon in rounded pill */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: '#D5D3DC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 6.5V16H11V6.5L7.5 10L6.09 8.59L12 2.68L17.91 8.59L16.5 10L13 6.5ZM4 18H20V20H4V18Z" fill="#130032"/>
                    </svg>
                  </div>
                  <Text size="sm" weight="medium" style={{ color: '#130032' }}>Drop your files here or</Text>
                  {/* Upload button with chevron */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button style={{
                      background: 'var(--ink-cobalt-80)',
                      border: 'none',
                      borderRadius: '6px 0 0 6px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'white',
                      fontFamily: 'var(--ink-font-family)',
                    }}
                    onClick={() => setDocuments([...documents, 'Non-Disclosure Agreement'])}
                    >
                      Upload
                    </button>
                    <button style={{
                      background: 'var(--ink-cobalt-80)',
                      border: 'none',
                      borderLeft: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '0 6px 6px 0',
                      padding: '10px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <Icon name="chevron-down" size={14} color="white" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Has documents — card grid + small add tile */
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {documents.map((docName, idx) => (
                    <div key={idx} style={{
                      width: 220,
                      border: '1px solid var(--ink-border-subtle)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: 'white',
                    }}>
                      <div style={{
                        height: 160,
                        background: '#fafafa',
                        borderRadius: '12px 12px 0 0',
                        borderBottom: '1px solid var(--ink-border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                      }}>
                        {/* Document page mockup */}
                        <div style={{
                          width: 90,
                          height: 120,
                          background: 'white',
                          borderRadius: 4,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                          padding: '12px 10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}>
                          {/* Title line */}
                          <div style={{ height: 5, background: '#c8c6d0', borderRadius: 3, width: '70%' }} />
                          {/* Text lines */}
                          {[100, 85, 90, 75, 80, 65, 90, 70].map((w, i) => (
                            <div key={i} style={{ height: 3, background: '#e2e0e8', borderRadius: 2, width: `${w}%` }} />
                          ))}
                        </div>
                      </div>
                      <div style={{ padding: '16px 20px' }}>
                        <Text size="sm" weight="medium" style={{ display: 'block', marginBottom: 4, color: '#130032' }}>{docName}</Text>
                        <Text size="xs" color="secondary">1 page</Text>
                      </div>
                    </div>
                  ))}

                  {/* Small add tile */}
                  <div style={{
                    width: 220,
                    minHeight: 220,
                    border: '2px dashed var(--ink-border-subtle)',
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    padding: 24,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ink-cobalt-60)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--ink-border-subtle)'}
                  >
                    <Icon name="plus" size={24} color="var(--ink-text-secondary)" />
                    <Text size="sm" color="secondary" style={{ textAlign: 'center' }}>Drag documents here or</Text>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button style={{
                        background: 'var(--ink-cobalt-80)',
                        border: 'none',
                        borderRadius: '6px 0 0 6px',
                        padding: '7px 14px',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'white',
                        fontFamily: 'var(--ink-font-family)',
                      }}
                      onClick={() => setDocuments([...documents, 'Non-Disclosure Agreement'])}
                      >Upload</button>
                      <button style={{
                        background: 'var(--ink-cobalt-80)',
                        border: 'none',
                        borderLeft: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '0 6px 6px 0',
                        padding: '7px 8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <Icon name="chevron-down" size={14} color="white" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </section>

          <div style={{ height: 1, background: 'var(--ink-border-subtle)', marginBottom: 40 }} />

          {/* Add recipients section */}
          <section style={{ marginBottom: 40 }}>
            <div style={sectionHeaderStyle} onClick={() => setRecipientsExpanded(!recipientsExpanded)}>
              <h2 style={sectionTitleStyle}>Add recipients</h2>
              <Icon name={recipientsExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="var(--ink-text-secondary)" />
            </div>
            {recipientsExpanded && (
              <>
                {/* Options row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={signingOrder}
                      onChange={(e) => setSigningOrder(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--ink-cobalt-80)' }}
                    />
                    <Text size="sm">Set signing order</Text>
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 14, color: 'var(--ink-cobalt-80)', textDecoration: 'none' }}>View</a>
                  <span style={{ width: 1, height: 16, background: 'var(--ink-border-subtle)' }} />
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 14, color: 'var(--ink-cobalt-80)', textDecoration: 'none' }}>Import bulk list</a>
                </div>

                {/* Recipients list */}
                {recipients.map((recipient) => (
                  <div key={recipient.id} style={{
                    borderLeft: '3px solid var(--ink-orange-60)',
                    background: 'var(--ink-bg-color-default)',
                    padding: '16px 20px',
                    marginBottom: 16,
                    borderRadius: '0 8px 8px 0',
                  }}>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#130032' }}>Name</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={recipient.name}
                            onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                            style={inputStyle}
                          />
                          <button style={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 4,
                          }}>
                            <Icon name="contacts" size={16} color="var(--ink-text-secondary)" />
                          </button>
                        </div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, marginTop: 12, color: '#130032' }}>Email</label>
                        <input
                          type="email"
                          value={recipient.email}
                          onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingTop: 28 }}>
                        <Button kind="tertiary" size="small" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Icon name="edit" size={14} />
                          Needs to Sign
                          <Icon name="chevron-down" size={14} />
                        </Button>
                        <Button kind="tertiary" size="small" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          Customize
                          <Icon name="chevron-down" size={14} />
                        </Button>
                        <IconButton
                          icon="delete"
                          variant="tertiary"
                          size="small"
                          aria-label="Remove recipient"
                          onClick={() => removeRecipient(recipient.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add recipient button */}
                <Button kind="secondary" size="small" onClick={addRecipient} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="user-add" size={16} />
                  Add Recipient
                  <Icon name="chevron-down" size={14} />
                </Button>
              </>
            )}
          </section>

          <div style={{ height: 1, background: 'var(--ink-border-subtle)', marginBottom: 40 }} />

          {/* Add message section */}
          <section style={{ marginBottom: 40 }}>
            <div style={sectionHeaderStyle} onClick={() => setMessageExpanded(!messageExpanded)}>
              <h2 style={sectionTitleStyle}>Add message</h2>
              <Icon name={messageExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="var(--ink-text-secondary)" />
            </div>
            {messageExpanded && (
              <>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 20 }}>
                  <input
                    type="checkbox"
                    checked={customMessage}
                    onChange={(e) => setCustomMessage(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--ink-cobalt-80)' }}
                  />
                  <Text size="sm">Custom email and language for each recipient</Text>
                </label>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#130032' }}>
                    Email Subject <span style={{ color: '#C0392B' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    style={inputStyle}
                  />
                  <Text size="xs" color="secondary" style={{ marginTop: 4 }}>Characters remaining: {100 - emailSubject.length}</Text>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: '#130032' }}>Email Message</label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    style={{
                      ...inputStyle,
                      minHeight: 120,
                      resize: 'vertical',
                    }}
                  />
                  <Text size="xs" color="secondary" style={{ marginTop: 4 }}>Characters remaining: {1000 - emailMessage.length}</Text>
                </div>

                <div style={{ height: 1, background: 'var(--ink-border-subtle)', marginBottom: 20 }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Text size="sm" weight="semibold">Send a reminder every</Text>
                  <select
                    value={reminderDays}
                    onChange={(e) => setReminderDays(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid var(--ink-border-subtle)',
                      borderRadius: 6,
                      fontSize: 14,
                      fontFamily: 'var(--ink-font-family)',
                      background: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                  </select>
                </div>
              </>
            )}
          </section>

        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        padding: '16px 24px',
        borderTop: '1px solid var(--ink-border-subtle)',
        background: 'white',
        flexShrink: 0,
      }}>
        <Button kind="secondary" size="medium">Save</Button>
        <Button kind="primary" size="medium" onClick={() => {
          if (onSend) {
            onSend(documents, recipients);
          }
          onClose();
        }}>Next</Button>
      </div>
    </div>
  );
}

// Full-screen overlay for the "Upload request" task in an Agreement Space.
interface UploadRequestData {
  title: string;
  description: string;
  dueDate: string;
  firstName: string;
  lastName: string;
  email: string;
}
function UploadRequestScreen({ open, onClose, onSend, initialData }: { open: boolean; onClose: () => void; onSend?: (data: UploadRequestData) => void; initialData?: Partial<UploadRequestData> | null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Prefill the form when the overlay opens from a deep link (e.g. the
  // "request a COI from Marco" scenario URL).
  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title ?? '');
      setDescription(initialData.description ?? '');
      setDueDate(initialData.dueDate ?? '');
      setFirstName(initialData.firstName ?? '');
      setLastName(initialData.lastName ?? '');
      setEmail(initialData.email ?? '');
    }
  }, [open, initialData]);

  if (!open) return null;

  const canSend = title.trim() && firstName.trim() && lastName.trim() && email.trim();
  const handleSend = () => {
    if (!canSend) return;
    onSend?.({ title: title.trim(), description: description.trim(), dueDate, firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    setTitle(''); setDescription(''); setDueDate(''); setFirstName(''); setLastName(''); setEmail('');
    onClose();
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 15, color: '#130032', marginBottom: 8,
    fontFamily: 'var(--ink-font-family)',
  };
  const req = <span style={{ color: '#CC1B5B', marginLeft: 2 }}>*</span>;
  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, borderRadius: 4, border: '1px solid #8B8699',
    padding: '0 12px', fontSize: 15, color: '#130032',
    fontFamily: 'var(--ink-font-family)', boxSizing: 'border-box', background: 'white',
  };
  const sectionHeading: React.CSSProperties = {
    fontSize: 22, fontWeight: 400, color: '#130032', margin: '0 0 24px',
    fontFamily: 'var(--ink-font-family)',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 80, padding: '0 32px', borderBottom: '1px solid var(--ink-border-subtle, #E4E2E9)', flexShrink: 0 }}>
        <button
          onClick={onClose}
          aria-label="Close upload request"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: '#130032', borderRadius: 4 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#130032', fontFamily: 'var(--ink-font-family)' }}>Upload request</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 780, padding: '48px 32px 64px', marginLeft: 268 }}>
          {/* Details */}
          <h2 style={sectionHeading}>Details</h2>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Title{req}</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              maxLength={1000}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, height: 96, padding: '10px 12px', resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
          <div style={{ fontSize: 13, color: '#6B6777', marginBottom: 24, fontFamily: 'var(--ink-font-family)' }}>
            Characters remaining: {1000 - description.length}
          </div>

          <div style={{ marginBottom: 48 }}>
            <label style={labelStyle}>Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ ...inputStyle, width: 224 }} />
          </div>

          {/* Assignee */}
          <h2 style={sectionHeading}>Assignee</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={labelStyle}>First name{req}</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={labelStyle}>Last name{req}</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={labelStyle}>Email address{req}</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, height: 76, padding: '0 32px', borderTop: '1px solid var(--ink-border-subtle, #E4E2E9)', flexShrink: 0, background: 'white' }}>
        <button
          onClick={onClose}
          style={{ height: 44, padding: '0 24px', borderRadius: 4, border: '1px solid #8B8699', background: 'white', color: '#130032', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)' }}
        >Cancel</button>
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{ height: 44, padding: '0 28px', borderRadius: 4, border: 'none', background: 'var(--ink-cobalt-80, #4C00FF)', color: 'white', cursor: canSend ? 'pointer' : 'default', opacity: canSend ? 1 : 0.5, fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)' }}
        >Send</button>
      </div>
    </div>
  );
}

interface VendorOnboardingData {
  vendorName: string;
  contactEmail: string;
  dueDate: string;
  assigneeFirst: string;
  assigneeLast: string;
}

function VendorOnboardingScreen({ open, onClose, onCreate, initialData }: { open: boolean; onClose: () => void; onCreate?: (data: VendorOnboardingData) => void; initialData?: Partial<VendorOnboardingData> | null }) {
  const [vendorName, setVendorName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeFirst, setAssigneeFirst] = useState('');
  const [assigneeLast, setAssigneeLast] = useState('');

  // Prefill when opened from the vendor-onboarding deep link.
  useEffect(() => {
    if (open && initialData) {
      setVendorName(initialData.vendorName ?? '');
      setContactEmail(initialData.contactEmail ?? '');
      setDueDate(initialData.dueDate ?? '');
      setAssigneeFirst(initialData.assigneeFirst ?? '');
      setAssigneeLast(initialData.assigneeLast ?? '');
    }
  }, [open, initialData]);

  if (!open) return null;

  const canCreate = vendorName.trim() && assigneeFirst.trim() && assigneeLast.trim();
  const handleCreate = () => {
    if (!canCreate) return;
    onCreate?.({
      vendorName: vendorName.trim(),
      contactEmail: contactEmail.trim(),
      dueDate,
      assigneeFirst: assigneeFirst.trim(),
      assigneeLast: assigneeLast.trim(),
    });
    setVendorName(''); setContactEmail(''); setDueDate(''); setAssigneeFirst(''); setAssigneeLast('');
    onClose();
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 15, color: '#130032', marginBottom: 8, fontFamily: 'var(--ink-font-family)',
  };
  const req = <span style={{ color: '#CC1B5B', marginLeft: 2 }}>*</span>;
  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, borderRadius: 4, border: '1px solid #8B8699',
    padding: '0 12px', fontSize: 15, color: '#130032',
    fontFamily: 'var(--ink-font-family)', boxSizing: 'border-box', background: 'white',
  };
  const sectionHeading: React.CSSProperties = {
    fontSize: 22, fontWeight: 400, color: '#130032', margin: '0 0 8px', fontFamily: 'var(--ink-font-family)',
  };
  const sectionSub: React.CSSProperties = {
    fontSize: 14, color: '#6B6777', margin: '0 0 24px', fontFamily: 'var(--ink-font-family)', lineHeight: 1.5,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 80, padding: '0 32px', borderBottom: '1px solid var(--ink-border-subtle, #E4E2E9)', flexShrink: 0 }}>
        <button
          onClick={onClose}
          aria-label="Close vendor onboarding"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: 'none', background: 'transparent', cursor: 'pointer', color: '#130032', borderRadius: 4 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#130032', fontFamily: 'var(--ink-font-family)' }}>New vendor onboarding</span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 780, padding: '48px 32px 64px', marginLeft: 268 }}>
          {/* Vendor */}
          <h2 style={sectionHeading}>Vendor</h2>
          <p style={sectionSub}>Set up onboarding for this vendor before the task is created.</p>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Vendor name{req}</label>
            <input value={vendorName} onChange={(e) => setVendorName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: 48 }}>
            <label style={labelStyle}>Contact email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={{ ...inputStyle, width: 360 }} />
          </div>

          <div style={{ marginBottom: 48 }}>
            <label style={labelStyle}>Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ ...inputStyle, width: 224 }} />
          </div>

          {/* Assignee */}
          <h2 style={sectionHeading}>Assignee</h2>
          <p style={sectionSub}>Who owns this onboarding workflow?</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={labelStyle}>First name{req}</label>
              <input value={assigneeFirst} onChange={(e) => setAssigneeFirst(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={labelStyle}>Last name{req}</label>
              <input value={assigneeLast} onChange={(e) => setAssigneeLast(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, height: 76, padding: '0 32px', borderTop: '1px solid var(--ink-border-subtle, #E4E2E9)', flexShrink: 0, background: 'white' }}>
        <button
          onClick={onClose}
          style={{ height: 44, padding: '0 24px', borderRadius: 4, border: '1px solid #8B8699', background: 'white', color: '#130032', cursor: 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)' }}
        >Cancel</button>
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          style={{ height: 44, padding: '0 28px', borderRadius: 4, border: 'none', background: 'var(--ink-cobalt-80, #4C00FF)', color: 'white', cursor: canCreate ? 'pointer' : 'default', opacity: canCreate ? 1 : 0.5, fontSize: 15, fontWeight: 600, fontFamily: 'var(--ink-font-family)' }}
        >Create task</button>
      </div>
    </div>
  );
}

interface AddMenuProps {
  onSignatureRequest?: () => void;
  onAddWireTransfer?: () => void;
  onUploadRequest?: () => void;
  onNewVendorOnboarding?: () => void;
  onDocument?: () => void;
}

function AddMenu({ onSignatureRequest, onAddWireTransfer, onUploadRequest, onNewVendorOnboarding, onDocument }: AddMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Button kind="secondary" size="small" startElement={<Icon name="plus" size={16} />} onClick={() => { setOpen(o => !o); }}>Other</Button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: 'white',
          border: '1px solid var(--ink-border-subtle)',
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          zIndex: 200,
          minWidth: 264,
          padding: 4,
        }}>
          {/* Signature Request */}
          <MenuRow
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.41 17.9989L5.41 16.9983H8.24L18.11 7.12285C18.7 6.53252 19 5.76209 19 4.99166C19 4.22123 18.7 3.46081 18.11 2.88049C17.52 2.29016 16.76 2 15.99 2C15.22 2 14.45 2.29016 13.87 2.88049L4 12.756V15.5875L2 17.5887V20H22V17.9989H4.41ZM5.9 13.5364L15.21 4.22123C15.42 4.01112 15.69 3.90106 15.99 3.90106C16.29 3.90106 16.56 4.01112 16.77 4.22123C16.98 4.43135 17.09 4.7015 17.09 5.00167C17.09 5.30183 16.98 5.57198 16.77 5.7821L7.46 15.0973H5.9V13.5364Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Signature Request"
            onClick={() => { setOpen(false); onSignatureRequest?.(); }}
          />

          {/* Form */}
          <MenuRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 9V15H6V9H18ZM20 7H4V17H20V7ZM19 3H5V5H19V3ZM14 19H5V21H14V19ZM10 11H8V13H10V11ZM13 11H11V13H13V11ZM16 11H14V13H16V11Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Form"
            onClick={() => { setOpen(false); }}
          />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--ink-border-subtle)', margin: '4px 8px' }} />

          {/* Flattened task items (formerly "Other Tasks" submenu) */}
          <MenuRow
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.65 12L11 9.34V18H9V9.34L6.35 12L5 10.65L9.43 6.23C9.59 6.07 9.8 6 10 6C10.2 6 10.41 6.07 10.57 6.23L15 10.65L13.65 12ZM16 2H4V4H16V2Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Upload request"
            onClick={() => { setOpen(false); onUploadRequest?.(); }}
          />
          <MenuRow
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6V18H4V6H20ZM21 4H3C2.45 4 2 4.45 2 5V19C2 19.55 2.45 20 3 20H21C21.55 20 22 19.55 22 19V5C22 4.45 21.55 4 21 4ZM13 15C13 13.35 11.65 12 10 12H8C6.35 12 5 13.35 5 15V16H7V15C7 14.45 7.45 14 8 14H10C10.55 14 11 14.45 11 15V16H13V15ZM11 9C11 7.9 10.1 7 9 7C7.9 7 7 7.9 7 9C7 10.1 7.9 11 9 11C10.1 11 11 10.1 11 9ZM19 8H14V10H19V8ZM19 12H14V14H19V12Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Identity verification"
            onClick={() => { setOpen(false); }}
          />

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--ink-border-subtle)', margin: '4px 8px' }} />

          <MenuRow
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V11H18V13H12V18H18V20H11C10.45 20 10 19.55 10 19V13H2V11H10V5C10 4.45 10.45 4 11 4H18V6H12ZM22 4H20V6H22V4ZM22 11H20V13H22V11ZM22 18H20V20H22V18Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Wire Transfer Request"
            onClick={() => { setOpen(false); onAddWireTransfer?.(); }}
          />
          <MenuRow
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V11H18V13H12V18H18V20H11C10.45 20 10 19.55 10 19V13H2V11H10V5C10 4.45 10.45 4 11 4H18V6H12ZM22 4H20V6H22V4ZM22 11H20V13H22V11ZM22 18H20V20H22V18Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="New Vendor Onboarding"
            onClick={() => { setOpen(false); onNewVendorOnboarding?.(); }}
          />
        </div>
      )}
    </div>
  );
}

function AddDocumentMenu({ onUpload, onUseTemplate }: { onUpload?: () => void; onUseTemplate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Button kind="primary" size="small" startElement={<Icon name="plus" size={16} />} onClick={() => { setOpen(o => !o); }}>Add Document</Button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: 'white',
          border: '1px solid var(--ink-border-subtle)',
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          zIndex: 200,
          minWidth: 220,
          padding: 4,
        }}>
          <MenuRow
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.65 12L11 9.34V18H9V9.34L6.35 12L5 10.65L9.43 6.23C9.59 6.07 9.8 6 10 6C10.2 6 10.41 6.07 10.57 6.23L15 10.65L13.65 12ZM16 2H4V4H16V2Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Upload"
            onClick={() => { setOpen(false); onUpload?.(); }}
          />
          <MenuRow
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 9V15H6V9H18ZM20 7H4V17H20V7ZM19 3H5V5H19V3ZM14 19H5V21H14V19ZM10 11H8V13H10V11ZM13 11H11V13H13V11ZM16 11H14V13H16V11Z" fill="#130032" fillOpacity="0.9"/>
              </svg>
            }
            label="Use a template"
            onClick={() => { setOpen(false); onUseTemplate?.(); }}
          />
        </div>
      )}
    </div>
  );
}

function MenuRow({ icon, label, onClick, chevron, crown }: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  chevron?: boolean;
  crown?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: '9px 14px',
        fontSize: 14,
        color: '#130032',
        cursor: 'pointer',
        background: hovered ? 'var(--ink-neutral-fade-5)' : 'transparent',
        transition: 'background 0.15s',
        borderRadius: 6,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
        <span>{label}</span>
      </div>
      {chevron && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: 8, flexShrink: 0 }}>
          <path d="M5 3l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {crown && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8, flexShrink: 0 }} aria-label="Feature gated" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.29 11.36L17.51 10.07L16.46 16H7.54L6.49 10.07L9.71 11.36L12 7.76M12 4L9 9L4 7L6 18H18L20 7L15 9L12 4Z" fill="#4C00FB"/>
        </svg>
      )}
    </div>
  );
}

// Click-to-edit Agreement Space title shown in the workspace header. Clicking
// the name turns it into an inline text field (Google Docs style); Enter or
// blur commits, Escape cancels.
function EditableSpaceName({ name, onRename }: { name: string; onRename?: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(name); }, [name]);
  useEffect(() => {
    if (editing) { inputRef.current?.focus(); inputRef.current?.select(); }
  }, [editing]);

  const titleFontStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 600,
    fontFamily: 'var(--ink-font-family)',
    color: 'var(--ink-font-color-default)',
    lineHeight: 1.3,
  };

  if (!onRename) return <Heading level={3} style={{ margin: 0 }}>{name}</Heading>;

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== name) onRename(trimmed);
    else setDraft(name);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === 'Enter') commit();
          else if (e.key === 'Escape') { setDraft(name); setEditing(false); }
        }}
        aria-label="Agreement Space name"
        style={{
          ...titleFontStyle,
          border: '2px solid var(--ink-cobalt-80)',
          borderRadius: 6,
          padding: '2px 8px',
          margin: 0,
          outline: 'none',
          background: 'var(--ink-bg-color-default)',
          minWidth: 320,
        }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to rename"
      style={{
        ...titleFontStyle,
        background: 'none',
        border: '1px solid transparent',
        borderRadius: 6,
        padding: '2px 8px',
        margin: '0 -8px',
        cursor: 'text',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-border-subtle)'; e.currentTarget.style.background = 'var(--ink-bg-color-secondary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }}
    >
      {name}
    </button>
  );
}

function WorkspaceView({ agreement, onClose, onRename, onEditNDA, savedNDAData, ndaSentForSignature, ndaRecipientName, uploadedDocAgreement, persistedAddedDocs, onAddDocument, onPreviewDocument, injectedTasks, injectedSignatureDocs, persistedSignedDocs, onSignDocs, initialOverlay, uploadRequestPrefill, vendorOnboardingPrefill }: WorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');
  const [sidebarTab, setSidebarTab] = useState<'activity' | 'details'>('activity');
  const [taskSearch, setTaskSearch] = useState('');
  const fadeIn = useFadeIn(0, 250);
  const [docSubTab, setDocSubTab] = useState<'negotiating' | 'supplemental'>('negotiating');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [showPrepare, setShowPrepare] = useState(false);
  const [showUploadRequest, setShowUploadRequest] = useState(false);
  const [showVendorOnboarding, setShowVendorOnboarding] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  // Deep-link entry point: open the requested overlay (prefilled) whenever the
  // scenario URL sets initialOverlay. Keyed on initialOverlay (not just mount)
  // so it fires reliably regardless of the order in which the workspace mounts
  // and the prop settles — this avoids a race where the overlay silently
  // never opens.
  useEffect(() => {
    if (initialOverlay === 'upload-request') setShowUploadRequest(true);
    else if (initialOverlay === 'vendor-onboarding') setShowVendorOnboarding(true);
  }, [initialOverlay]);

  const [pendingPreviewDoc, setPendingPreviewDoc] = useState<string | null>(null);
  // Seed from the parent-persisted list so documents added earlier still show
  // after navigating away from this space and back.
  const [addedDocuments, setAddedDocuments] = useState<string[]>(persistedAddedDocs ?? []);
  const [preparePreselectedDocs, setPreparePreselectedDocs] = useState<string[]>([]);
  const [sentEnvelopes, setSentEnvelopes] = useState<{ envelopeId: string; documents: string[]; recipients: string[]; sentAt: string }[]>([]);
  const [sentTasks, setSentTasks] = useState<DealTask[]>([]);
  const [approvalModalDoc, setApprovalModalDoc] = useState<string | null>(null);
  const [sentActivity, setSentActivity] = useState<{ id: string; icon: IconName; user: string; action: string; time: string }[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  };
  const [showPartyHistory, setShowPartyHistory] = useState(false);
  const [partyHistoryTab, setPartyHistoryTab] = useState<'overview' | 'agreements' | 'obligations' | 'details'>('overview');

  // Handler for when documents are sent for signature
  // Documents sent for signature from within this workspace (batch action or
  // the local doc preview). We keep each document in place and only change its
  // status to Pending Signature — the workspace name, other documents, and
  // needs-attention sections are left untouched.
  // Seed from the parent-persisted list so a document's Pending Signature status
  // survives navigating away from this space and back.
  const [signedDocs, setSignedDocs] = useState<{ name: string; recipient: string }[]>(persistedSignedDocs ?? []);
  const allSignedDocs = useMemo(
    () => [...(injectedSignatureDocs ?? []), ...signedDocs],
    [injectedSignatureDocs, signedDocs],
  );

  const handleSendForSignature = (documentNames: string[], recipients: { name: string }[]) => {
    const recipientNames = recipients.map(r => r.name);
    const recipient = recipientNames[0] || 'Recipient';
    // Mark each sent document as Pending Signature (status change only).
    const newlySigned = documentNames.map(name => ({ name, recipient }));
    setSignedDocs(prev => [
      ...prev,
      ...documentNames.filter(name => !prev.some(d => d.name === name)).map(name => ({ name, recipient })),
    ]);
    // Persist to the parent so the status survives leaving and re-entering.
    onSignDocs?.(newlySigned);
    // Add a Sign task for the sent documents.
    const newTask: DealTask = {
      id: `task-sign-${Date.now()}`,
      title: `Sign ${documentNames.join(', ')}`,
      type: 'Sign',
      team: 'External',
      assignee: recipient,
      assigneeInitials: recipient.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: 'Not started',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      isDueSoon: false,
    };
    setSentTasks(prev => [...prev, newTask]);
    // Clear selection after sending
    setSelectedDocs(new Set());
  };

  // Determine if this is an NDA draft (matched by kind so multiple NDAs, each
  // with a unique id, all resolve their NDA-specific content).
  const isNDADraft = agreement.workspaceKind === 'nda' || agreement.id === 'nda-draft';

  // In the Simple Use Case the "NDA" modal is actually the Permission Slip flow,
  // so an NDA-draft workspace here really holds a Permission Slip document. Used
  // to relabel the document shown inside the space.
  const { version } = usePrototypeVersion();
  const isPermissionSlipDraft = version === 'simple' && isNDADraft;
  // The Permission Slip agreement space, covering both the saved-draft (nda) and
  // sent (permission-slip) variants. Used to tailor the Add Document → Upload
  // file picker to a school administrator/teacher context.
  const isPermissionSlipSpace = version === 'simple' && (isPermissionSlipDraft || agreement.workspaceKind === 'permission-slip');
  // School-relevant file picker list, with a Field Trip Liability Waiver first.
  const permissionSlipPickerFiles: PickerFile[] = [
    { name: 'Field Trip Liability Waiver', kind: 'PDF Document', size: '186 KB', modified: 'Today, 8:52 AM' },
    { name: 'Parent Permission Slip', kind: 'Word Document', size: '124 KB', modified: 'Yesterday, 3:20 PM' },
    { name: 'Student Emergency Contact Form', kind: 'PDF Document', size: '98 KB', modified: 'May 9, 2026' },
    { name: 'Medical Authorization Form', kind: 'PDF Document', size: '142 KB', modified: 'May 6, 2026' },
    { name: 'Chaperone Volunteer Agreement', kind: 'Word Document', size: '110 KB', modified: 'May 2, 2026' },
    { name: 'Student Code of Conduct', kind: 'PDF Document', size: '156 KB', modified: 'Apr 27, 2026' },
  ];

  // Student/Parent Handbook Sign-Off space (Simple Use Case). Used to trim the
  // workspace UI (no Value column, no Team column) for this simple scenario.
  const isHandbookSpace = agreement.id === 'w1';

  // Get workspace data for the agreement. NDA workspaces fall back to the shared
  // NDA template when they have a unique (non-seeded) id.
  const workspaceData = AGREEMENT_WORKSPACE_DATA[agreement.id]
    || (isNDADraft ? AGREEMENT_WORKSPACE_DATA['nda-draft'] : undefined)
    || AGREEMENT_WORKSPACE_DATA['1'];
  
  // Check if this is an uploaded/blank document agreement.
  const isUploadedDocAgreement = agreement.workspaceKind === 'uploaded' || agreement.workspaceKind === 'permission-slip' || agreement.id === 'uploaded-doc';

  // Update NDA document status if sent for signature
  const modifiedDocuments = useMemo(() => {
    // Documents added to this space via the Add menu → Document flow (saved from Doc Preview).
    const addedDocs = addedDocuments.map((docName, idx) => ({
      id: `added-${idx}`,
      name: docName,
      status: 'Draft' as const,
      dateModified: new Date().toLocaleDateString('en-US'),
    }));

    let baseDocs;
    if (isNDADraft && ndaSentForSignature) {
      baseDocs = workspaceData.documents.map(doc => ({
        ...doc,
        status: 'Pending Signature' as const,
        signatureProgress: { 
          signed: 0, 
          total: 1, 
          waitingFor: ndaRecipientName || savedNDAData?.receivingParty || 'Recipient' 
        },
      }));
    } else if (isUploadedDocAgreement && uploadedDocAgreement) {
      // For uploaded document agreements, create documents with sent status
      // A saved-blank draft has not been sent for signature - show it as a Draft.
      if (uploadedDocAgreement.isDraft) {
        baseDocs = uploadedDocAgreement.documents.map((docName, idx) => ({
          id: `uploaded-${idx}`,
          name: docName,
          status: 'Draft' as const,
          dateModified: new Date().toLocaleDateString('en-US'),
        }));
      } else {
        baseDocs = uploadedDocAgreement.documents.map((docName, idx) => ({
          id: `uploaded-${idx}`,
          name: docName,
          status: 'Pending Signature' as const,
          lastModified: new Date().toLocaleDateString('en-US'),
          signatureProgress: {
            signed: 0,
            total: 1,
            waitingFor: uploadedDocAgreement.recipientName || 'Recipient'
          },
        }));
      }
    } else {
      baseDocs = workspaceData.documents;
    }

    // Show the most recently added documents first: addedDocuments is appended
    // newest-last, so reverse it and place it ahead of the base documents.
    let combined = [...[...addedDocs].reverse(), ...baseDocs] as DealDocument[];
    // In the Simple Use Case, an NDA-draft space is really a Permission Slip, so
    // relabel the templated "Non-Disclosure Agreement" document accordingly.
    if (isPermissionSlipDraft) {
      combined = combined.map(doc =>
        doc.name === 'Non-Disclosure Agreement' ? { ...doc, name: 'Permission Slip' } : doc
      );
    }
    // Apply Pending Signature status to any document sent for signature,
    // keeping the document in its place in the list.
    if (allSignedDocs.length === 0) return combined;
    return combined.map(doc => {
      const sent = allSignedDocs.find(s => s.name === doc.name);
      if (!sent) return doc;
      return {
        ...doc,
        status: 'Pending Signature' as const,
        signatureProgress: { signed: 0, total: 1, waitingFor: sent.recipient },
      };
    }) as DealDocument[];
  }, [workspaceData.documents, isNDADraft, isPermissionSlipDraft, ndaSentForSignature, ndaRecipientName, savedNDAData, isUploadedDocAgreement, uploadedDocAgreement, addedDocuments, allSignedDocs]);
  
  const currentDocuments = docSubTab === 'negotiating' ? modifiedDocuments : workspaceData.supplementalDocs;
  const currentAttentionItems = workspaceData.attentionItems;
  // The Permission Slip space (Simple Use Case) shows a real activity feed based
  // on the steps actually taken — created, and sent for signature when applicable
  // — rather than the placeholder sample feed. Ordered newest-first to match the
  // live `sentActivity` events that get prepended above it.
  const permissionSlipActivity = (() => {
    const wasSent = agreement.workspaceKind === 'permission-slip' || (isNDADraft && ndaSentForSignature);
    const studentName = savedNDAData?.receivingParty?.trim();
    const recipient = (ndaRecipientName || uploadedDocAgreement?.recipientName || '').trim();
    const events: { id: string; icon: IconName; user: string; action: string; time: string }[] = [];
    if (wasSent) {
      events.push({ id: 'ps-sent', icon: 'send', user: 'You', action: `Sent the Permission Slip to ${recipient || 'the parent/guardian'} for signature`, time: 'Just now' });
    }
    events.push({ id: 'ps-created', icon: 'edit', user: 'You', action: `Created the Permission Slip${studentName ? ` for ${studentName}` : ''}`, time: wasSent ? 'Moments ago' : 'Just now' });
    return events;
  })();

  // A saved-blank draft has only just been created, so its activity feed should
  // reflect that single real event rather than the default rich sample feed.
  const currentActivity = [
    ...sentActivity,
    ...(isPermissionSlipSpace
      ? permissionSlipActivity
      : (isUploadedDocAgreement && uploadedDocAgreement?.isDraft)
        ? [
            { id: 'draft-create', icon: 'document' as IconName, user: 'You', action: `Created ${uploadedDocAgreement.documents[0] || 'draft document'}`, time: 'Just now' },
          ]
        : workspaceData.activity),
  ];
  const currentTasks = useMemo(() => {
    // Reverse so the most recently added approval task appears at the top,
    // matching the sentTasks ordering used in each branch below.
    const injected = [...(injectedTasks ?? [])].reverse();
    const base = (() => {
    // For NDA agreements sent for signature, create Sign NDA task
    if (isNDADraft && ndaSentForSignature) {
      const ndaRecipientInitials = ndaRecipientName 
        ? ndaRecipientName.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'RP';
      const signNdaTask = {
        id: 'sign-nda',
        title: 'Sign NDA',
        type: 'Sign' as const,
        team: '',
        assignee: ndaRecipientName || 'Recipient',
        assigneeInitials: ndaRecipientInitials,
        status: 'In progress',
        dueDate: '--',
        isDueSoon: false,
      };
      return [signNdaTask, ...[...sentTasks].reverse()];
    }
    
    // A saved-blank draft has no signature task yet - just show any added tasks.
    if (isUploadedDocAgreement && uploadedDocAgreement?.isDraft) {
      return [...sentTasks].reverse();
    }
    // For uploaded document agreements (e.g., NDA from Signature Request flow), show only Sign task
    if (isUploadedDocAgreement && uploadedDocAgreement) {
      const docName = uploadedDocAgreement.documents[0] || 'Non-Disclosure Agreement';
      const taskName = docName.toLowerCase().includes('lease') ? 'Sign Lease' : `Sign ${docName}`;
      const recipientInitials = uploadedDocAgreement.recipientName 
        ? uploadedDocAgreement.recipientName.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'RC';
      const signTask = {
        id: 'sign-uploaded',
        title: taskName,
        type: 'Sign' as const,
        team: '',
        assignee: uploadedDocAgreement.recipientName || 'Recipient',
        assigneeInitials: recipientInitials,
        status: 'In progress',
        dueDate: '--',
        isDueSoon: false,
      };
      // Include any additional tasks added via Add menu (like Wire Transfer)
      return [signTask, ...[...sentTasks].reverse()];
    }
    return [...[...sentTasks].reverse(), ...workspaceData.tasks];
    })();
    return [...injected, ...base];
  }, [workspaceData.tasks, sentTasks, isNDADraft, ndaSentForSignature, isUploadedDocAgreement, uploadedDocAgreement, injectedTasks]);

  // Group documents by envelope - documents with same envelopeId become a single envelope row
  // Also handle newly sent envelopes from user actions
  const processedDocuments = useMemo(() => {
    const envelopeMap = new Map<string, DealDocument[]>();
    const standalone: DealDocument[] = [];
    
    // Get all document names that have been sent in envelopes
    const sentDocNames = new Set(sentEnvelopes.flatMap(env => env.documents));
    
    currentDocuments.forEach(doc => {
      // Skip documents that have been sent
      if (sentDocNames.has(doc.name)) {
        return;
      }
      
      if (doc.envelopeId) {
        const existing = envelopeMap.get(doc.envelopeId) || [];
        existing.push(doc);
        envelopeMap.set(doc.envelopeId, existing);
      } else {
        standalone.push(doc);
      }
    });
    
    // Convert existing envelopes to envelope rows
    type EnvelopeRow = { isEnvelope: true; envelopeId: string; documents: DealDocument[]; signatureProgress: DealDocument['signatureProgress']; documentNames?: string[]; waitingFor?: string };
    const envelopeRows: (DealDocument | EnvelopeRow)[] = [];
    
    envelopeMap.forEach((docs, envId) => {
      envelopeRows.push({
        isEnvelope: true,
        envelopeId: envId,
        documents: docs,
        signatureProgress: docs[0]?.signatureProgress,
      });
    });
    
    // Add newly sent envelopes as envelope rows
    sentEnvelopes.forEach(sent => {
      envelopeRows.push({
        isEnvelope: true,
        envelopeId: sent.envelopeId,
        documents: [],
        documentNames: sent.documents,
        signatureProgress: {
          signed: 0,
          total: sent.recipients.length,
          waitingFor: sent.recipients[0] || 'recipient',
        },
        waitingFor: sent.recipients[0],
      });
    });
    
    return [...standalone, ...envelopeRows];
  }, [currentDocuments, sentEnvelopes]);

  const currentSupplementalDocs = workspaceData.supplementalDocs;
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

  // Maps a document/task status string to a StatusLight kind so statuses render
  // as a colored dot + text (no background pill).
  const getStatusLightKind = (status: string): 'neutral' | 'success' | 'warning' | 'alert' | 'emphasis' => {
    switch (status) {
      case 'Complete':
      case 'Executed':
        return 'success';
      case 'Pending Signature':
        return 'warning';
      case 'In progress':
      case 'In Review':
        return 'emphasis';
      case 'Not started':
      case 'Draft':
      default:
        return 'neutral';
    }
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
        {/* Header row — back arrow + title on left, actions on right */}
        <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--ink-spacing-150) var(--ink-spacing-200)', gap: 12 }}>
          <button onClick={onClose} aria-label="Back" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, flexShrink: 0 }}>
            <Icon name="arrow-left" size={20} />
          </button>
          <Inline gap="medium" align="center">
            <EditableSpaceName name={agreement.name} onRename={onRename} />
            {(() => {
              // Permission Slip spaces (Simple Use Case) don't show a party tag.
              // Covers both the saved-draft (nda) and sent (permission-slip) variants.
              if (isPermissionSlipSpace) return null;
              const partyName = agreement.externalParticipants?.[0] ?? (agreement.party && agreement.party !== '—' ? agreement.party : null);
              if (!partyName) return null;
              return (
                <button
                  type="button"
                  onClick={() => setShowPartyHistory(true)}
                  aria-label={`View history for ${partyName}`}
                  title={`View history for ${partyName}`}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ink-cobalt-20)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ink-cobalt-10)'; }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'var(--ink-cobalt-10)',
                    color: 'var(--ink-cobalt-90)',
                    fontFamily: 'var(--ink-font-family)',
                    fontSize: 'var(--ink-font-size-sm)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M8 12H6V10H8V12ZM8 14H6V16H8V14ZM8 6H6V8H8V6ZM8 18H4V4.49L10 2.69V7L12 6V0L2 3V18H1V20H8V18ZM15 7.9C14.39 7.9 13.9 8.39 13.9 9C13.9 9.61 14.39 10.1 15 10.1C15.61 10.1 16.1 9.61 16.1 9C16.1 8.39 15.61 7.9 15 7.9ZM15 6C16.66 6 18 7.34 18 9C18 10.66 16.66 12 15 12C13.34 12 12 10.66 12 9C12 7.34 13.34 6 15 6ZM20 17C20 14.79 18.21 13 16 13H14C11.79 13 10 14.79 10 17V20H12V16.88C12 15.78 12.77 15 13.88 15H16.13C17.23 15 18.01 15.77 18.01 16.88V20H20.01V17H20Z" fill="currentColor" />
                  </svg>
                  {partyName}
                </button>
              );
            })()}
            <StatusLight
              noFill
              className={/^in (progress|review)$/i.test(agreement.status) ? 'status-black' : undefined}
              kind={agreement.statusKind === 'success' ? 'success' : agreement.statusKind === 'warning' ? 'warning' : agreement.statusKind === 'neutral' ? 'neutral' : 'emphasis'}
              text={agreement.status}
            />
          </Inline>
          <div style={{ flex: 1 }} />
          <Inline gap="small" align="center">
            <div style={{ display: 'flex' }}>
              <Avatar initials="SS" size="small" style={{ border: '2px solid white', marginRight: -8 }} />
              <Avatar initials="JL" size="small" style={{ border: '2px solid white', marginRight: -8 }} />
              <Avatar initials="NK" size="small" style={{ border: '2px solid white' }} />
            </div>
            <IconButton icon="comment" variant="tertiary" size="small" aria-label="Comments" />
              <AddDocumentMenu
                onUpload={() => setShowFilePicker(true)}
                onUseTemplate={() => setShowFilePicker(true)}
              />
              <AddMenu
                onSignatureRequest={() => { setPreparePreselectedDocs([]); setShowPrepare(true); }}
                onUploadRequest={() => setShowUploadRequest(true)}
              onAddWireTransfer={() => {
                const recipientName = uploadedDocAgreement?.recipientName || 'Recipient';
                const recipientInitials = recipientName.split(' ').map(n => n[0]).join('').toUpperCase();
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 7);
                const formattedDueDate = `${dueDate.getMonth() + 1}/${dueDate.getDate()}/${dueDate.getFullYear().toString().slice(-2)}`;
                setSentTasks(prev => [...prev, {
                  id: `wire-transfer-${Date.now()}`,
                  title: 'Wire Transfer',
                  type: 'Upload' as const,
                  team: '',
                  assignee: recipientName,
                  assigneeInitials: recipientInitials,
                  status: 'In progress',
                  dueDate: formattedDueDate,
                  isDueSoon: false,
                }]);
              }}
              onNewVendorOnboarding={() => setShowVendorOnboarding(true)}
            />
          </Inline>
        </div>

        {/* Tabs — constrained, no top border */}
        <div style={{ ...innerStyle, alignItems: 'stretch', gap: 0, paddingTop: 'var(--ink-spacing-100)' }}>
          <button onClick={() => setActiveTab('overview')} style={tabStyle(activeTab === 'overview')}>Overview</button>
          <button onClick={() => setActiveTab('tasks')} style={tabStyle(activeTab === 'tasks')}>Tasks</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', background: 'var(--ink-bg-color-secondary)' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: '100%', maxWidth: 1440, minWidth: 1280, margin: '0 auto' }}>
            {/* Main content */}
            <div style={{ padding: 'var(--ink-spacing-300)', background: 'var(--ink-bg-color-default)' }}>

              {/* Needs Attention section */}
              {currentAttentionItems.length > 0 && !isNDADraft && !isUploadedDocAgreement && (
                <div style={{ marginBottom: 'var(--ink-spacing-400)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--ink-spacing-200)' }}>
                    <Text size="sm" weight="semibold" style={{ fontSize: 'var(--ink-font-heading-xxs-size)', fontWeight: 600 }}>Needs Attention</Text>
                    <Button kind="tertiary" size="small">View all</Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(currentAttentionItems.length, 3)}, 1fr)`, gap: 'var(--ink-spacing-200)' }}>
                    {currentAttentionItems.slice(0, 3).map((item) => (
                      <div key={item.id} style={{
                        background: 'var(--ink-white-100)',
                        border: '1px solid var(--ink-border-subtle)',
                        borderRadius: 8,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {item.alertMessage ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                                <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="#7C3AED"/>
                              </svg>
                            ) : item.riskLevel === 'High' ? (
                              <Icon name="alert" size={16} color="var(--ink-red-80)" />
                            ) : (
                              <Icon name="comment" size={16} color="var(--ink-neutral-80)" />
                            )}
                            {item.alertMessage && (
                              <span style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'var(--ink-orange-100)',
                                background: 'var(--ink-orange-10)',
                                border: '1px solid var(--ink-orange-30)',
                                borderRadius: 4,
                                padding: '2px 6px',
                              }}>Due today</span>
                            )}
                          </div>
                          <IconButton icon="dots-vertical" variant="tertiary" size="small" aria-label="More options" />
                        </div>
                        <Text size="sm" weight="semibold">{item.item}</Text>
                        <Text size="xs" color="secondary">{item.description}</Text>
                        {item.alertMessage && (
                          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 'var(--ink-font-size-xs)', color: 'var(--ink-cobalt-80)', textDecoration: 'none', fontWeight: 500 }}>Send a reminder</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents section with Primary / Supplemental sub-tabs */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--ink-spacing-200)' }}>
                  <Text size="sm" weight="semibold" style={{ fontSize: 'var(--ink-font-heading-xxs-size)', fontWeight: 600 }}>Documents</Text>
                </div>

                {/* Bulk actions bar - shown when documents are selected */}
                {selectedDocs.size > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    background: 'var(--ink-cobalt-10)',
                    border: '1px solid var(--ink-cobalt-30)',
                    borderRadius: 8,
                    marginBottom: 'var(--ink-spacing-200)',
                  }}>
                    <Text size="sm" weight="semibold" style={{ color: 'var(--ink-cobalt-100)' }}>
                      {selectedDocs.size} selected
                    </Text>
                    <div style={{ flex: 1 }} />
                    <Button kind="secondary" size="small" onClick={() => setSelectedDocs(new Set())}>
                      Clear
                    </Button>
                    <Button kind="secondary" size="small" onClick={() => {
                      // Open the same Send for Approval overlay as the doc preview
                      // header CTA, seeded with the selected document names.
                      const selectedDocNames = currentDocuments
                        .filter(doc => selectedDocs.has(doc.id))
                        .map(doc => doc.name);
                      if (selectedDocNames.length === 0) return;
                      setApprovalModalDoc(selectedDocNames.join(', '));
                      setSelectedDocs(new Set());
                    }}>
                      Send for Approval
                    </Button>
                    <Button kind="primary" size="small" onClick={() => {
                      // Get the names of selected documents
                      const selectedDocNames = currentDocuments
                        .filter(doc => selectedDocs.has(doc.id))
                        .map(doc => doc.name);
                      setPreparePreselectedDocs(selectedDocNames);
                      setShowPrepare(true);
                    }}>
                      Send for Signature
                    </Button>
                  </div>
                )}

                {/* Primary documents table */}
                {docSubTab === 'negotiating' && (
                  <div style={{ border: '1px solid var(--ink-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <thead>
                        <tr style={{ background: 'var(--ink-bg-color-secondary)' }}>
                          <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', width: '5%' }}>
                            <input
                              type="checkbox"
                              checked={currentDocuments.length > 0 && currentDocuments.every(doc => selectedDocs.has(doc.id))}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocs(new Set(currentDocuments.map(doc => doc.id)));
                                } else {
                                  setSelectedDocs(new Set());
                                }
                              }}
                              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--ink-cobalt-80)' }}
                            />
                          </th>
                          <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '38%' }}>
                            <Inline gap="xsmall" align="center">Title <Icon name="sort" size={12} color="var(--ink-text-secondary)" /></Inline>
                          </th>
                          <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '16%' }}>Status</th>
                          {!isHandbookSpace && (
                            <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '12%' }}>Value</th>
                          )}
                          <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '20%' }}>
                            <Inline gap="xsmall" align="center">Last modified <Icon name="sort" size={12} color="var(--ink-text-secondary)" /></Inline>
                          </th>
                          <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '14%' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedDocuments.map((item, idx) => {
                          // Handle envelope rows
                          if ('isEnvelope' in item && item.isEnvelope) {
                            const envelope = item;
                            const envelopeDocNames = envelope.documentNames || envelope.documents.map(d => d.name);
                            return (
                              <React.Fragment key={`env-${envelope.envelopeId}`}>
                                {/* Envelope parent row */}
                                <tr style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                                  <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                    <input
                                      type="checkbox"
                                      style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--ink-cobalt-80)' }}
                                    />
                                  </td>
                                  <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                    <Inline gap="small" align="center">
                                      <Icon name="envelope" size={16} color="var(--ink-text-secondary)" />
                                      <div>
                                        <Tooltip text={envelopeDocNames.join(', ')} location="below">
                                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                                            <Text size="sm" weight="medium">
                                              Document Packet
                                            </Text>
                                          </div>
                                        </Tooltip>
                                        <Text size="xs" color="secondary">Sent to: {envelope.waitingFor || envelope.signatureProgress?.waitingFor || 'recipient'}</Text>
                                      </div>
                                    </Inline>
                                  </td>
                                  <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                    {envelope.signatureProgress && (
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                          <div style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: 'var(--ink-cobalt-80)',
                                            flexShrink: 0,
                                          }} />
                                          <div style={{
                                            flex: 1,
                                            height: 2,
                                            background: 'var(--ink-border-subtle)',
                                            position: 'relative',
                                          }}>
                                            <div style={{
                                              position: 'absolute',
                                              left: 0,
                                              top: 0,
                                              height: '100%',
                                              width: `${(envelope.signatureProgress.signed / envelope.signatureProgress.total) * 100}%`,
                                              background: 'var(--ink-cobalt-80)',
                                            }} />
                                          </div>
                                        </div>
                                        <Text size="xs" style={{ color: '#130032' }}>
                                          Waiting for {envelope.signatureProgress.waitingFor}
                                        </Text>
                                      </div>
                                    )}
                                  </td>
                                  {!isHandbookSpace && (
                                    <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                      <Text size="sm" style={{ fontSize: 14, color: '#3d3a4e' }}>NA</Text>
                                    </td>
                                  )}
                                  <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)', color: 'var(--ink-text-default)' }}>
                                    {envelope.documents[0]?.dateModified}
                                  </td>
                                  <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                    <Inline gap="small" align="center" style={{ justifyContent: 'flex-end' }}>
                                    <Button kind="secondary" size="small" onClick={() => {
                                      if (isNDADraft && !ndaSentForSignature && onEditNDA) {
                                        onEditNDA();
                                      } else {
                                        onPreviewDocument?.(doc.name);
                                      }
                                    }}>{isNDADraft && !ndaSentForSignature ? 'Edit' : 'View'}</Button>
                                      <IconButton icon="dots-vertical" variant="tertiary" size="small" aria-label="More options" />
                                    </Inline>
                                  </td>
                                </tr>
                                {/* Nested document rows */}
                                {envelopeDocNames.map((docName, docIdx) => (
                                  <tr key={`env-${envelope.envelopeId}-doc-${docIdx}`} style={{ background: 'var(--ink-bg-color-secondary)' }}>
                                    <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                      {/* Empty checkbox cell for alignment */}
                                    </td>
                                    <td style={{ padding: 'var(--ink-spacing-150)', paddingLeft: 'var(--ink-spacing-400)' }}>
                                      <Inline gap="small" align="center">
                                        <Icon name="file" size={14} color="var(--ink-text-secondary)" />
                                        <Text size="sm" color="secondary">{docName}</Text>
                                      </Inline>
                                    </td>
                                    <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                      {/* Status inherited from envelope */}
                                    </td>
                                    {!isHandbookSpace && (
                                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                        {/* Value inherited from envelope */}
                                      </td>
                                    )}
                                    <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                      {/* Date inherited from envelope */}
                                    </td>
                                    <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                      {/* No actions for nested docs */}
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          }
                          
                          // Handle regular document rows
                          const doc = item as DealDocument;
                          const isSelected = selectedDocs.has(doc.id);
                          return (
                            <tr key={doc.id} style={{ borderTop: '1px solid var(--ink-border-subtle)', background: isSelected ? 'var(--ink-cobalt-fade-5)' : 'transparent' }}>
                              <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const newSelected = new Set(selectedDocs);
                                    if (e.target.checked) {
                                      newSelected.add(doc.id);
                                    } else {
                                      newSelected.delete(doc.id);
                                    }
                                    setSelectedDocs(newSelected);
                                  }}
                                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--ink-cobalt-80)' }}
                                />
                              </td>
                              <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                <Inline gap="small" align="center">
                                  <Text size="sm">{doc.name}</Text>
                                  {doc.commentCount && (
                                    <AlertBadge value={doc.commentCount} kind="emphasis" />
                                  )}
                                </Inline>
                              </td>
                              <td style={{ padding: 'var(--ink-spacing-150)', maxWidth: 0 }}>
                                {doc.signatureProgress ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {/* Progress bar */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                                      <div style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: 'var(--ink-cobalt-80)',
                                        flexShrink: 0,
                                      }} />
                                      <div style={{
                                        flex: 1,
                                        height: 2,
                                        background: 'var(--ink-border-subtle)',
                                        position: 'relative',
                                      }}>
                                        <div style={{
                                          position: 'absolute',
                                          left: 0,
                                          top: 0,
                                          height: '100%',
                                          width: `${(doc.signatureProgress.signed / doc.signatureProgress.total) * 100}%`,
                                          background: 'var(--ink-cobalt-80)',
                                        }} />
                                      </div>
                                    </div>
                                    {/* Waiting text */}
                                    <Text size="xs" style={{ color: '#130032', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      Waiting for {doc.signatureProgress.waitingFor}
                                    </Text>
                                  </div>
                                ) : (
                                  <StatusLight noFill className={/^in (progress|review)$/i.test(doc.status) ? 'status-black' : undefined} kind={getStatusLightKind(doc.status)} text={doc.status} />
                                )}
                              </td>
                              {!isHandbookSpace && (
                                <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                  <Text size="sm" style={{ fontSize: 14, color: '#3d3a4e' }}>{doc.value || 'NA'}</Text>
                                </td>
                              )}
                              <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)', color: 'var(--ink-text-default)' }}>{doc.lastModified || doc.dateModified}</td>
                              <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                <Inline gap="small" align="center" style={{ justifyContent: 'flex-end' }}>
                                  <Button
                                    kind="secondary"
                                    size="small"
                                    onClick={() => {
                                      if (doc.id.startsWith('added-')) {
                                        // Documents added via the Add → Document flow open in the local Doc Preview.
                                        setPendingPreviewDoc(doc.name);
                                      } else if (isNDADraft && !ndaSentForSignature && onEditNDA) {
                                        onEditNDA();
                                      } else {
                                        onPreviewDocument?.(doc.name);
                                      }
                                    }}
                                  >
                                    {doc.id.startsWith('added-') || (isNDADraft && !ndaSentForSignature) ? 'Edit' : 'View'}
                                  </Button>
                                  <IconButton icon="dots-vertical" variant="tertiary" size="small" aria-label="More options" />
                                </Inline>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Supplemental documents table */}
                {docSubTab === 'supplemental' && (
                  <div style={{ border: '1px solid var(--ink-border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                    {currentSupplementalDocs.length === 0 ? (
                      <div style={{ padding: 'var(--ink-spacing-400)', textAlign: 'center' }}>
                        <Text size="sm" color="secondary">No supplemental documents</Text>
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                          <tr style={{ background: 'var(--ink-bg-color-secondary)' }}>
                            <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '40%' }}>Document</th>
                            <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '24%' }}>Provided By</th>
                            <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)', width: '24%' }}>Date Added</th>
                            <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', width: '12%' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSupplementalDocs.map((doc) => (
                            <tr key={doc.id} style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                              <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{doc.name}</td>
                              <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                <Inline gap="small" align="center">
                                  <Avatar initials={doc.ownerInitials} size="small" />
                                  <Text size="sm">{doc.owner}</Text>
                                </Inline>
                              </td>
                              <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{doc.dateModified}</td>
                              <td style={{ padding: 'var(--ink-spacing-150)' }}>
                                <Inline gap="small" align="center">
                                  <Button kind="secondary" size="small" onClick={() => {
                                    if (isNDADraft && !ndaSentForSignature && onEditNDA) {
                                      onEditNDA();
                                    } else {
                                      onPreviewDocument?.(doc.name);
                                    }
                                  }}>{isNDADraft && !ndaSentForSignature ? 'Edit' : 'View'}</Button>
                                  <IconButton icon="dots-vertical" variant="tertiary" size="small" aria-label="More options" />
                                </Inline>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ borderLeft: '1px solid var(--ink-border-subtle)', background: 'var(--ink-bg-color-default)', display: 'flex', flexDirection: 'column' }}>
              {/* Sidebar tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--ink-border-subtle)', padding: '0 var(--ink-spacing-300)' }}>
                {(['activity', 'details'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSidebarTab(tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '14px 4px 12px 4px',
                      marginRight: 24,
                      fontSize: 'var(--ink-font-size-sm)',
                      fontWeight: sidebarTab === tab ? 600 : 400,
                      color: sidebarTab === tab ? 'var(--ink-text-default)' : 'var(--ink-text-secondary)',
                      borderBottom: sidebarTab === tab ? '2px solid var(--ink-text-default)' : 'none',
                      transition: 'color 0.15s',
                      position: 'relative',
                    }}
                  >
                    {tab === 'activity' ? 'Activity' : 'Details'}
                  </button>
                ))}
              </div>

              {/* Activity tab content */}
              {sidebarTab === 'activity' && (
                <div style={{ padding: 'var(--ink-spacing-300)', flex: 1, overflowY: 'auto' }}>
                  <Stack gap="medium">
                    {currentActivity.map((item) => (
                      <Inline key={item.id} gap="medium" align="flex-start">
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: item.isAI ? 'var(--ink-cobalt-20)' : 'var(--ink-bg-color-secondary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
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
              )}

              {/* Details tab content */}
              {sidebarTab === 'details' && (
                <div style={{ padding: 'var(--ink-spacing-300)', flex: 1, overflowY: 'auto' }}>
                  <Stack gap="medium">
                    <div>
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Party</Text>
                      <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>{agreement.party}</Text>
                      <Button kind="secondary" size="small" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowPartyHistory(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                          <path d="M14.29 11.36L17.51 10.07L16.46 16H7.54L6.49 10.07L9.71 11.36L12 7.76M12 4L9 9L4 7L6 18H18L20 7L15 9L12 4Z" fill="#4C00FB"/>
                        </svg>
                        View History
                      </Button>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Agreement Type</Text>
                      <Text size="sm">{agreement.agreementType || '—'}</Text>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Deal Value</Text>
                      <Text size="sm">{agreement.dealValue || '—'}</Text>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Term Length</Text>
                      <Text size="sm">{agreement.termLength || '—'}</Text>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Anticipated Close</Text>
                      <Text size="sm">{agreement.closeDate || '��'}</Text>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" color="secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Status</Text>
                      <StatusLight
                        noFill
                        className={/^in (progress|review)$/i.test(agreement.status) ? 'status-black' : undefined}
                        kind={agreement.statusKind === 'success' ? 'success' : agreement.statusKind === 'warning' ? 'warning' : agreement.statusKind === 'neutral' ? 'neutral' : 'emphasis'}
                        text={agreement.status}
                      />
                    </div>
                  </Stack>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div style={{ padding: 'var(--ink-spacing-300)', background: 'var(--ink-bg-color-default)', minHeight: '100%', maxWidth: 1440, minWidth: 1280, margin: '0 auto' }}>
            {/* Alert banner - only show when a task is due soon */}
            {currentTasks.some(task => task.isDueSoon) && (
              <Alert kind="warning" action={{ label: 'Send reminder', onClick: () => {} }} onClose={() => {}} style={{ marginBottom: 'var(--ink-spacing-300)' }}>
                {currentTasks.find(task => task.isDueSoon)?.title} is due soon. Would you like to send {currentTasks.find(task => task.isDueSoon)?.assignee} a reminder?
              </Alert>
            )}

            <div style={{ fontSize: 'var(--ink-font-heading-xxs-size)', lineHeight: 'var(--ink-font-heading-xxs-line-height)', fontWeight: 600, marginBottom: 'var(--ink-spacing-200)' }}>Tasks</div>

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
                    {!isUploadedDocAgreement && !isNDADraft && !isHandbookSpace && (
                      <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Team</th>
                    )}
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Assigned To</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Status</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Due Date</th>
                    <th style={{ padding: 'var(--ink-spacing-100) var(--ink-spacing-150)', textAlign: 'left', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTasks.map((task) => (
                    <tr key={task.id} style={{ borderTop: '1px solid var(--ink-border-subtle)' }}>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Inline gap="small" align="center">
                          {task.type === 'Sign' ? (
                            <img src="/icon-sign.svg" alt="Sign" style={{ width: 16, height: 16, opacity: 1, filter: 'brightness(0.17) sepia(0.5) hue-rotate(275deg) saturate(1.5)' }} />
                          ) : (task.type === 'Upload' && task.title === 'Wire Transfer') || task.title.startsWith('New Vendor Onboarding') ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 6V11H18V13H12V18H18V20H11C10.45 20 10 19.55 10 19V13H2V11H10V5C10 4.45 10.45 4 11 4H18V6H12ZM22 4H20V6H22V4ZM22 11H20V13H22V11ZM22 18H20V20H22V18Z" fill="#130032" fillOpacity="0.9"/>
                            </svg>
                          ) : (
                            <Icon name={task.type === 'View' ? 'eye' : task.type === 'Approval' ? 'status-check' : 'upload'} size={16} color="var(--ink-text-secondary)" />
                          )}
                          <div>
                            <Text size="sm">{task.title}</Text>
                          </div>
                        </Inline>
                      </td>
                      {!isUploadedDocAgreement && !isNDADraft && !isHandbookSpace && (
                        <td style={{ padding: 'var(--ink-spacing-150)', fontSize: 'var(--ink-font-size-sm)' }}>{task.team}</td>
                      )}
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        {task.assignee === '--' ? (
                          <Text size="sm">--</Text>
                        ) : (
                          <Inline gap="small" align="center">
                            <Avatar initials={task.assigneeInitials} size="small" />
                            <Text size="sm">{task.assignee}</Text>
                          </Inline>
                        )}
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                              <StatusLight noFill className={/^in (progress|review)$/i.test(task.status) ? 'status-black' : undefined} kind={getStatusLightKind(task.status)} text={task.status} />
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Text size="sm" color={task.isDueSoon ? 'warning' : undefined} style={task.isDueSoon ? { color: 'var(--ink-yellow-100)' } : {}}>{task.dueDate}</Text>
                      </td>
                      <td style={{ padding: 'var(--ink-spacing-150)' }}>
                        <Button kind="secondary" size="small">
                          {task.id.startsWith('upload-request-') || task.id.startsWith('vendor-onboarding-') ? 'Remind' : task.status === 'In progress' ? 'Remind' : task.isDueSoon ? 'Remind' : 'View'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>

      {/* Prepare Screen for Signature Request flow */}
      <PrepareScreen
        open={showPrepare}
        onClose={() => setShowPrepare(false)}
        preselectedDocs={preparePreselectedDocs}
        onSend={handleSendForSignature}
      />

      {/* Add menu → Document: open the macOS file picker, then the Doc Preview.
          In the Permission Slip space the picker shows school-relevant files. */}
      <FilePickerDialog
        open={showFilePicker}
        files={isPermissionSlipSpace ? permissionSlipPickerFiles : undefined}
        onCancel={() => setShowFilePicker(false)}
        onOpen={(fileName) => {
          setShowFilePicker(false);
          setPendingPreviewDoc(fileName);
        }}
      />

      {/* Doc Preview for the Add → Document flow. Saving adds the doc to this
          space's Documents table and confirms with a toast. */}
      <DocumentPreview
        open={pendingPreviewDoc !== null}
        documentName={pendingPreviewDoc ?? ''}
        onClose={() => setPendingPreviewDoc(null)}
        onSave={() => {
          if (pendingPreviewDoc) {
            setAddedDocuments(prev => prev.includes(pendingPreviewDoc) ? prev : [...prev, pendingPreviewDoc]);
            onAddDocument?.(pendingPreviewDoc);
            // Reflect the newly added document in the Permission Slip space's
            // activity feed as a live event.
            if (isPermissionSlipSpace) {
              const added = pendingPreviewDoc;
              setSentActivity(prev => [
                { id: `activity-doc-${Date.now()}`, icon: 'upload' as IconName, user: 'You', action: `Added ${added} to the space`, time: 'Just now' },
                ...prev,
              ]);
            }
            showToast('Your document was added');
          }
          setPendingPreviewDoc(null);
        }}
        onSendForApproval={(name) => {
          // Also add the document to this space's Documents table (in addition
          // to the approval task) so it persists after the preview closes.
          if (pendingPreviewDoc) { setAddedDocuments(prev => prev.includes(pendingPreviewDoc) ? prev : [...prev, pendingPreviewDoc]); onAddDocument?.(pendingPreviewDoc); }
          setPendingPreviewDoc(null);
          setApprovalModalDoc(name);
        }}
        onSendForSignature={(name) => {
          if (pendingPreviewDoc) { setAddedDocuments(prev => prev.includes(pendingPreviewDoc) ? prev : [...prev, pendingPreviewDoc]); onAddDocument?.(pendingPreviewDoc); }
          setPendingPreviewDoc(null);
          setPreparePreselectedDocs([name]);
          setShowPrepare(true);
        }}
        onApprovalCreated={(task) => { setSentTasks(prev => [...prev, task]); showToast('Approval added to tasks'); }}
      />

      <SendForApprovalModal
        open={approvalModalDoc !== null}
        documentName={approvalModalDoc ?? ''}
        onClose={() => setApprovalModalDoc(null)}
        onComplete={(task) => {
          setSentTasks(prev => [...prev, task]);
          setApprovalModalDoc(null);
          showToast('Sent for approval');
        }}
      />

      {/* Upload Request full-screen overlay */}
      <UploadRequestScreen
        open={showUploadRequest}
        onClose={() => setShowUploadRequest(false)}
        initialData={uploadRequestPrefill}
        onSend={(data) => {
          const assignee = `${data.firstName} ${data.lastName}`.trim();
          const assigneeInitials = ((data.firstName[0] || '') + (data.lastName[0] || '')).toUpperCase();
          let formattedDueDate = '--';
          if (data.dueDate) {
            const d = new Date(data.dueDate + 'T00:00:00');
            formattedDueDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
          }
          setSentTasks(prev => [...prev, {
            id: `upload-request-${Date.now()}`,
            title: data.title,
            type: 'Upload' as const,
            team: '',
            assignee,
            assigneeInitials,
            status: 'Not started',
            dueDate: formattedDueDate,
            isDueSoon: false,
          }]);
          setSentActivity(prev => [
            { id: `activity-upload-${Date.now()}`, icon: 'upload' as IconName, user: 'You', action: `Sent an upload request${data.title ? ` "${data.title}"` : ''}${assignee ? ` to ${assignee}` : ''}`, time: 'Just now' },
            ...prev,
          ]);
          showToast('Upload request sent out');
        }}
      />

      {/* New Vendor Onboarding workflow setup (task created only after setup) */}
      <VendorOnboardingScreen
        open={showVendorOnboarding}
        onClose={() => setShowVendorOnboarding(false)}
        initialData={vendorOnboardingPrefill}
        onCreate={(data) => {
          const assignee = `${data.assigneeFirst} ${data.assigneeLast}`.trim();
          const assigneeInitials = `${data.assigneeFirst[0] ?? ''}${data.assigneeLast[0] ?? ''}`.toUpperCase();
          const due = new Date();
          due.setDate(due.getDate() + 7);
          const formattedDueDate = data.dueDate
            ? (() => { const d = new Date(data.dueDate + 'T00:00:00'); return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`; })()
            : `${due.getMonth() + 1}/${due.getDate()}/${due.getFullYear().toString().slice(-2)}`;
          setSentTasks(prev => [...prev, {
            id: `vendor-onboarding-${Date.now()}`,
            title: `New Vendor Onboarding — ${data.vendorName}`,
            type: 'Other' as const,
            team: '',
            assignee: assignee || 'Vicki Vendor',
            assigneeInitials: assigneeInitials || 'VV',
            status: 'Not started',
            dueDate: formattedDueDate,
            isDueSoon: false,
          }]);
          setSentActivity(prev => [
            { id: `activity-onboarding-${Date.now()}`, icon: 'workflow' as IconName, user: 'You', action: `set up onboarding for ${data.vendorName}`, time: 'Just now' },
            ...prev,
          ]);
          showToast('Vendor onboarding workflow created');
        }}
      />

      {/* Toast (bottom-left) */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 32, left: 32, zIndex: 1300, display: 'flex', alignItems: 'center', gap: 16, minWidth: 360, maxWidth: 520, padding: '18px 20px', borderRadius: 12, background: '#2A1A45', boxShadow: '0 12px 32px rgba(19,0,50,0.28)', fontFamily: 'var(--ink-font-family)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ flex: 1, fontSize: 16, color: 'white' }}>{toast}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', color: 'white', borderRadius: 4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}

      {/* Party History Panel */}
      <Drawer
        open={showPartyHistory}
        onClose={() => setShowPartyHistory(false)}
        position="right"
        customSize="680px"
        zIndex={99999}
        title={
          <div style={{ width: '100%', paddingLeft: 24, paddingTop: 20 }}>
            <Inline gap="medium" align="center" style={{ marginBottom: 12 }}>
              <Heading as="h2" size="sm">{agreement.party}</Heading>
              <Badge kind="primary" size="small" style={{ background: 'linear-gradient(135deg, #4C00FB 0%, #9333EA 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                AI-Assisted
              </Badge>
              <Badge kind="success" size="small">Active</Badge>
            </Inline>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--ink-border-subtle)', marginBottom: 0, paddingLeft: 24, marginLeft: -24 }}>
              {(['overview', 'agreements', 'obligations', 'details'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPartyHistoryTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    fontSize: 'var(--ink-font-size-sm)',
                    fontWeight: partyHistoryTab === tab ? 600 : 400,
                    color: partyHistoryTab === tab ? 'var(--ink-text-default)' : 'var(--ink-text-secondary)',
                    borderBottom: partyHistoryTab === tab ? '2px solid var(--ink-cobalt-80)' : '2px solid transparent',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    marginBottom: '-1px',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        }
      >
          {/* Content */}
          <div style={{ background: 'var(--ink-bg-color-secondary)', padding: 'var(--ink-spacing-300)' }}>
            {partyHistoryTab === 'overview' && (
              <Stack gap="large">
                {/* Negotiation History */}
                <div style={{ background: 'var(--ink-white-100)', border: '1px solid var(--ink-border-subtle)', borderRadius: 'var(--ink-radius-size-s)', padding: 'var(--ink-spacing-300)' }}>
                  <Inline align="center" style={{ justifyContent: 'space-between', marginBottom: 'var(--ink-spacing-100)' }}>
                    <div>
                      <Text size="md" weight="semibold">Negotiation History</Text>
                      <Text size="xs" color="secondary">Previous positions and outcomes with this party</Text>
                    </div>
                    <Inline gap="small">
                      <Button kind="secondary" size="small">View all</Button>
                      <IconButton icon="chevron-left" variant="tertiary" size="small" aria-label="Previous" />
                      <IconButton icon="chevron-right" variant="tertiary" size="small" aria-label="Next" />
                    </Inline>
                  </Inline>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--ink-spacing-200)' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--ink-border-subtle)' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Term</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Previous Position</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Agreed Position</th>
                        <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 'var(--ink-font-size-xs)', fontWeight: 500, color: 'var(--ink-text-secondary)' }}>Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { term: 'Liability cap', count: 4, prev: '2x annual contract value', agreed: '3x annual contract value', outcome: 'Accepted with CFO approval' },
                        { term: 'Data retention', count: 3, prev: '90 days', agreed: '180 days', outcome: 'Accepted with DPA amendm...' },
                        { term: 'Indemnification', count: 2, prev: 'Mutual', agreed: 'Enhanced vendor indemnification', outcome: 'Accepted' },
                        { term: 'Payment Terms', count: 1, prev: 'Net 30', agreed: 'Net 60', outcome: 'Accepted' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--ink-border-subtle)' }}>
                          <td style={{ padding: '12px', fontSize: 'var(--ink-font-size-sm)' }}>
                            <Inline gap="xsmall" align="center">
                              {row.term}
                              <span style={{ background: 'var(--ink-cobalt-80)', color: 'white', borderRadius: '50%', width: 18, height: 18, minWidth: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, marginLeft: 4, flexShrink: 0 }}>{row.count}</span>
                            </Inline>
                          </td>
                          <td style={{ padding: '12px', fontSize: 'var(--ink-font-size-sm)', color: 'var(--ink-text-secondary)' }}>{row.prev}</td>
                          <td style={{ padding: '12px', fontSize: 'var(--ink-font-size-sm)', color: 'var(--ink-text-secondary)' }}>{row.agreed}</td>
                          <td style={{ padding: '12px', fontSize: 'var(--ink-font-size-sm)' }}>
                            <Inline gap="xsmall" align="center">
                              <Icon name="status-check" size={16} color="var(--ink-green-80)" />
                              <span style={{ color: 'var(--ink-text-secondary)' }}>{row.outcome}</span>
                            </Inline>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Two-column grid */}
                <Grid columns={2} gap="medium">
                  {/* Non-standard Terms */}
                  <div style={{ background: 'var(--ink-white-100)', border: '1px solid var(--ink-border-subtle)', borderRadius: 'var(--ink-radius-size-s)', padding: 'var(--ink-spacing-300)' }}>
                    <Inline align="center" style={{ justifyContent: 'space-between', marginBottom: 'var(--ink-spacing-200)' }}>
                      <Text size="md" weight="semibold">Non-standard Terms</Text>
                      <IconButton icon="dots-horizontal" variant="tertiary" size="small" aria-label="More" />
                    </Inline>
                    <Stack gap="medium">
                      <div>
                        <Inline align="center" style={{ justifyContent: 'space-between' }}>
                          <Text size="sm" weight="medium">Net 60 day payment terms</Text>
                          <Badge kind="alert" size="small">High risk</Badge>
                        </Inline>
                        <Text size="xs" color="secondary">Standard is net 30</Text>
                      </div>
                      <div>
                        <Inline align="center" style={{ justifyContent: 'space-between' }}>
                          <Text size="sm" weight="medium">Unlimited liability for data breach</Text>
                          <Badge kind="alert" size="small">High risk</Badge>
                        </Inline>
                        <Text size="xs" color="secondary">Standard cap is 2x ACV</Text>
                      </div>
                    </Stack>
                  </div>

                  {/* Renewing Agreements */}
                  <div style={{ background: 'var(--ink-white-100)', border: '1px solid var(--ink-border-subtle)', borderRadius: 'var(--ink-radius-size-s)', padding: 'var(--ink-spacing-300)' }}>
                    <Inline align="center" style={{ justifyContent: 'space-between', marginBottom: 'var(--ink-spacing-200)' }}>
                      <Text size="md" weight="semibold">Renewing Agreements</Text>
                      <IconButton icon="dots-horizontal" variant="tertiary" size="small" aria-label="More" />
                    </Inline>
                    <Inline gap="large" style={{ marginBottom: 'var(--ink-spacing-150)' }}>
                      <div>
                        <Text size="xs" color="secondary">Renewing Agreements</Text>
                        <Text size="xl" weight="semibold">1</Text>
                        <Text size="xs" color="secondary">in the next year</Text>
                      </div>
                      <div>
                        <Text size="xs" color="secondary">Total Value</Text>
                        <Text size="xl" weight="semibold">—</Text>
                      </div>
                    </Inline>
                    <div>
                      <Inline align="center" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text size="xs">NDA</Text>
                        <Text size="xs" color="secondary">Auto-renew</Text>
                      </Inline>
                      <div style={{ height: 6, background: 'var(--ink-cobalt-20)', borderRadius: 3, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '95%', background: 'var(--ink-cobalt-80)', borderRadius: 3 }} />
                        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, background: 'var(--ink-cobalt-80)', borderRadius: '50%', border: '2px solid white' }} />
                      </div>
                    </div>
                  </div>
                </Grid>

                {/* Bottom two-column grid */}
                <Grid columns={2} gap="medium">
                  {/* Obligations */}
                  <div style={{ background: 'var(--ink-white-100)', border: '1px solid var(--ink-border-subtle)', borderRadius: 'var(--ink-radius-size-s)', padding: 'var(--ink-spacing-300)' }}>
                    <Inline align="center" style={{ justifyContent: 'space-between', marginBottom: 'var(--ink-spacing-200)' }}>
                      <Text size="md" weight="semibold">Obligations</Text>
                      <IconButton icon="dots-horizontal" variant="tertiary" size="small" aria-label="More" />
                    </Inline>
                    <div>
                      <Text size="xs" color="secondary">Payments due</Text>
                      <Text size="xs" color="secondary">Total Value</Text>
                    </div>
                    <Text size="xl" weight="semibold" style={{ margin: 'var(--ink-spacing-100) 0' }}>0</Text>
                    <Text size="xl" weight="semibold">—</Text>
                    <Text size="xs" color="secondary" style={{ marginTop: 'var(--ink-spacing-150)' }}>in the next 60 days</Text>
                  </div>

                  {/* Latest Activity */}
                  <div style={{ background: 'var(--ink-white-100)', border: '1px solid var(--ink-border-subtle)', borderRadius: 'var(--ink-radius-size-s)', padding: 'var(--ink-spacing-300)' }}>
                    <Inline align="center" style={{ justifyContent: 'space-between', marginBottom: 'var(--ink-spacing-200)' }}>
                      <Text size="md" weight="semibold">Latest Activity</Text>
                      <IconButton icon="dots-horizontal" variant="tertiary" size="small" aria-label="More" />
                    </Inline>
                    <Stack gap="small">
                      {[
                        { icon: 'upload', text: 'Momentum Driver MSA redlines.docx', action: 'uploaded', date: 'May 11, 2026' },
                        { icon: 'file', text: 'Momentum Driver MSA.docx', action: 'was created', date: 'May 1, 2026' },
                        { icon: 'status-check', text: 'Request for Proposal.docx', action: 'was completed', date: 'Apr 23, 2026' },
                        { icon: 'status-check', text: 'NDA.docx', action: 'was completed', date: 'Jan 1, 2026' },
                      ].map((item, i) => (
                        <Inline key={i} gap="small" align="start">
                          <Icon name={item.icon as 'upload' | 'file' | 'status-check'} size={16} color="var(--ink-text-secondary)" style={{ marginTop: 2 }} />
                          <div style={{ flex: 1 }}>
                            <Text size="sm">
                              <span style={{ color: 'var(--ink-cobalt-80)', textDecoration: 'underline', cursor: 'pointer' }}>{item.text}</span>
                              {' '}{item.action}
                            </Text>
                          </div>
                          <Text size="xs" color="secondary">{item.date}</Text>
                        </Inline>
                      ))}
                    </Stack>
                  </div>
                </Grid>
              </Stack>
            )}

            {partyHistoryTab !== 'overview' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <Text size="sm" color="secondary">Content for {partyHistoryTab} tab coming soon</Text>
              </div>
            )}
          </div>
      </Drawer>
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

        {/* Detail panel �� LEFT side, toggled by sidebar icons, no tab bar */}
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
            <DocumentViewerContent />
          </div>
        </div>
      </div>
    </div>
  );
}


function DocumentViewerContent() {
  const [documentName, setDocumentName] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const doc = params.get('document');
    setDocumentName(doc || '');
  }, []);

  // Document content mapping
  const documentContent: { [key: string]: JSX.Element } = {
    'Security & Compliance Addendum': (
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
          <Heading level={3}>Security & Compliance Addendum</Heading>
          <Text size="sm">
            This Security & Compliance Addendum (&quot;Addendum&quot;) supplements and forms part of the Master Services Agreement executed between the parties.
          </Text>
          <Heading level={4}>1. Security Standards</Heading>
          <Text size="sm">Provider shall maintain security standards consistent with industry best practices, including but not limited to:</Text>
          <Text size="sm">• SOC 2 Type II certification maintained at all times</Text>
          <Text size="sm">• Encryption of data in transit and at rest using AES-256</Text>
          <Text size="sm">• Annual security audits by independent third parties</Text>
          <Heading level={4}>2. Data Privacy</Heading>
          <Text size="sm">Provider shall comply with all applicable data protection laws including GDPR, CCPA, and industry-specific regulations.</Text>
          <Heading level={4}>3. Incident Response</Heading>
          <Text size="sm">Provider shall notify Client of any security incidents within 24 hours of discovery and provide a detailed incident report within 5 business days.</Text>
        </Stack>
      </div>
    ),
    'NDA': (
      <div style={{
        width: 680, maxWidth: '100%', background: 'white', borderRadius: 'var(--ink-radius-size-m)',
        boxShadow: 'var(--ink-shadow-elevation-2)',
        padding: 'var(--ink-spacing-400) var(--ink-spacing-500)',
        minHeight: 900,
      }}>
        <Stack gap="medium">
          <Text size="xs" color="secondary" style={{ textAlign: 'right' }}>2135C Central Parkway Cincinnati, OH 45214</Text>
          <Heading level={2} style={{ textAlign: 'center', fontFamily: 'serif' }}>Confidentiality Agreement</Heading>
          <Text size="xs" color="secondary" style={{ textAlign: 'center' }}>Non-Disclosure Agreement</Text>
          <Heading level={3}>MUTUAL NON-DISCLOSURE AGREEMENT</Heading>
          <Text size="sm">
            This Mutual Non-Disclosure Agreement (&quot;Agreement&quot;) is entered into as of the date last signed below, between the undersigned parties (&quot;Parties&quot;).
          </Text>
          <Heading level={4}>1. Confidential Information</Heading>
          <Text size="sm">Each Party agrees to protect all Confidential Information disclosed by the other Party with the same degree of care it uses to protect its own confidential information, but not less than reasonable care.</Text>
          <Heading level={4}>2. Permitted Use</Heading>
          <Text size="sm">Confidential Information may be used solely for the purpose of evaluating the potential business opportunity between the Parties.</Text>
          <Heading level={4}>3. Term</Heading>
          <Text size="sm">This Agreement shall remain in effect for a period of three (3) years from the date of disclosure.</Text>
        </Stack>
      </div>
    ),
  };

  const defaultDocument = (
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
  );

  const currentDocument = documentContent[documentName] || defaultDocument;

  return currentDocument;
}

function getTabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '');
  return VALID_TABS.includes(hash as TabId) ? (hash as TabId) : 'home';
}

/* ── Predictable scenario deep links ─���
   Each ?flow= value opens a specific step's entry point, prefilled with the
   Tally Inc vendor scenario data. Steps 2-4 share one Tally Inc workspace. */
const SCENARIO_VENDOR = {
  company: 'Tally Inc',
  contactFirst: 'Marco',
  contactLast: 'Corcoran',
  contactName: 'Marco Corcoran',
  contactEmail: 'marco.corcoran@dsxtr.com',
};
const SCENARIO_WORKSPACE_ID = 'vendor-tally-inc';
const SCENARIO_MSA_DOC = 'Master Service Agreement (MSA)';

function buildScenarioAgreement(): Agreement {
  return {
    id: SCENARIO_WORKSPACE_ID,
    entityKind: 'space',
    workspaceKind: 'uploaded',
    name: `${SCENARIO_VENDOR.company} — Vendor Agreement`,
    party: SCENARIO_VENDOR.company,
    partyLogo: SCENARIO_VENDOR.company.substring(0, 2).toUpperCase(),
    status: 'In Progress',
    statusIcon: 'clock',
    statusKind: 'info',
    statusSub: 'In Progress',
    dealValue: '—',
    agreementType: 'Master Services Agreement',
    termLength: '12 months',
    closeDate: '—',
    date: new Date().toLocaleDateString('en-GB'),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    action: 'View',
    documentsCount: 1,
    tasksCount: 0,
    tasksPending: 0,
  };
}

/* ───────────────────────────────────────────────────────��──────────────────
   Prototype version switcher
   ---------------------------------------------------------------------------
   All versions render the SAME component tree from this single codebase, so
   any change made to the prototype automatically applies to every version.
   The active version is exposed via context purely as a flag, so that future
   work can branch behaviour per-version (e.g. `if (version === 'simple')`)
   without forking the code. For now every version behaves identically.
   ───────────────────────────��──────────────────���─────────────────────────── */
export type PrototypeVersion = 'standard' | 'simple';

export const PROTOTYPE_VERSIONS: { id: PrototypeVersion; label: string; description: string }[] = [
  { id: 'standard', label: 'Standard', description: 'The full-featured experience' },
  { id: 'simple', label: 'Simple Use Case', description: 'Streamlined for simple use cases' },
];

interface PrototypeVersionContextValue {
  version: PrototypeVersion;
  setVersion: (v: PrototypeVersion) => void;
}

const PrototypeVersionContext = createContext<PrototypeVersionContextValue>({
  version: 'standard',
  setVersion: () => {},
});

/** Read (and set) the active prototype version from anywhere in the tree. */
export function usePrototypeVersion() {
  return useContext(PrototypeVersionContext);
}

/**
 * Dropdown anchored under the global-header avatar. Lets the user switch
 * between prototype versions. Rendered at the App level so it can position
 * itself over the shared GlobalNav without modifying that design-system component.
 */
function UserMenu({
  open,
  onClose,
  userName,
  version,
  onSelectVersion,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  version: PrototypeVersion;
  onSelectVersion: (v: PrototypeVersion) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      // Ignore clicks on the avatar button itself (it toggles the menu).
      const target = e.target as HTMLElement;
      if (target.closest('[data-ink-component="GlobalNav"] [aria-label="User menu"]')) return;
      if (ref.current && !ref.current.contains(target)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Account and prototype version"
      style={{
        position: 'fixed',
        top: 56,
        right: 16,
        zIndex: 2500,
        minWidth: 268,
        background: 'var(--ink-white-100)',
        border: '1px solid var(--ink-border-subtle)',
        borderRadius: 10,
        boxShadow: '0 12px 32px rgba(19,0,50,0.18)',
        padding: 6,
        fontFamily: 'var(--ink-font-family)',
      }}
    >
      {/* Signed-in user */}
      <div style={{ padding: '8px 12px 10px' }}>
        <Text size="sm" weight="semibold" style={{ display: 'block' }}>{userName}</Text>
        <Text size="xs" color="secondary">Signed in</Text>
      </div>

      <div style={{ height: 1, background: 'var(--ink-border-subtle)', margin: '2px 6px 6px' }} />

      {/* Prototype version switcher */}
      <div style={{ padding: '4px 12px 6px' }}>
        <Text size="xs" color="secondary" weight="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Prototype version
        </Text>
      </div>
      {PROTOTYPE_VERSIONS.map(({ id, label, description }) => {
        const isActive = id === version;
        return (
          <button
            key={id}
            role="menuitemradio"
            aria-checked={isActive}
            onClick={() => { onSelectVersion(id); onClose(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              border: 'none',
              borderRadius: 8,
              background: isActive ? 'var(--ink-cobalt-10)' : 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--ink-font-family)',
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--ink-neutral-10)'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ width: 16, flexShrink: 0, display: 'inline-flex', justifyContent: 'center' }}>
              {isActive && <Icon name="check" size={16} color="var(--ink-cobalt-90)" />}
            </span>
            <span style={{ minWidth: 0 }}>
              <Text size="sm" weight={isActive ? 'semibold' : 'regular'} style={{ display: 'block', color: isActive ? 'var(--ink-cobalt-90)' : 'var(--ink-font-color-default)' }}>
                {label}
              </Text>
              <Text size="xs" color="secondary">{description}</Text>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(getTabFromHash);
  // Active prototype version + avatar menu open state. Both versions render
  // the same tree; `protoVersion` is a shared flag for future per-version tweaks.
  const [protoVersion, setProtoVersion] = useState<PrototypeVersion>('standard');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>('all-agreements');
  // Folders view: breadcrumb path of folders the user has navigated into, and the
  // set of folders currently expanded inline within the table.
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  // Agreements list filter selections (multi-select per facet).
  const [filterParty, setFilterParty] = useState<Set<string>>(new Set());
  // This list defaults to Agreement Spaces, so pre-select it in the Type menu.
  const [filterType, setFilterType] = useState<Set<string>>(new Set(['Agreement Spaces']));
  const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set());
  const [filterOwner, setFilterOwner] = useState<Set<string>>(new Set());
  const [templatesSidebarView, setTemplatesSidebarView] = useState<TemplatesSidebarView>('my-templates');
  const [insightsSidebarView, setInsightsSidebarView] = useState<InsightsSidebarView>('overview');
  // Callout shown when clicking a nav tab that isn't available in the prototype.
  const [unavailableCallout, setUnavailableCallout] = useState<{ left: number; top: number } | null>(null);
  const [search, setSearch] = useState('');
  const [showAgreementDetail, setShowAgreementDetail] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [showDealWorkspace, setShowDealWorkspace] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [agreementsList, setAgreementsList] = useState<Agreement[]>(() =>
    // Attach the contained document names (shown as subtext in the All
    // Agreements table) by deriving them from each space's workspace data.
    AGREEMENTS_DATA.map(a => {
      const ws = AGREEMENT_WORKSPACE_DATA[a.id];
      const docNames = ws?.documents?.map(d => d.name) ?? [];
      // External participants: the counterparty plus anyone assigned a signing
      // task, excluding the current user. This mirrors how new spaces capture
      // their receiving party / signature recipients.
      const signerNames = (ws?.tasks ?? [])
        .filter(t => t.type === 'Sign')
        .map(t => t.assignee)
        .filter(name => name && name !== 'You' && name !== 'Me');
      const participants = Array.from(new Set([
        ...(a.party && a.party !== '—' ? [a.party] : []),
        ...signerNames,
      ]));
      return {
        ...a,
        ...(docNames.length ? { documentNames: docNames } : {}),
        ...(participants.length ? { externalParticipants: participants } : {}),
      };
    })
  );

  const addNewAgreement = (agreement: Agreement) => {
    setAgreementsList(prev => [agreement, ...prev.filter(a => a.id !== agreement.id)]);
  };

  // Rename an Agreement Space in place (from the workspace's editable title).
  const handleRenameAgreement = useCallback((id: string, name: string) => {
    const trimmed = name.trim() || 'Untitled Agreement Space';
    setAgreementsList(prev => prev.map(a => (a.id === id ? { ...a, name: trimmed } : a)));
    setSelectedAgreement(prev => (prev && prev.id === id ? { ...prev, name: trimmed } : prev));
  }, []);

  // Inline rename from the All Agreements row overflow menu. The draft is
  // mirrored into a ref so a commit always reads the latest value regardless of
  // render timing.
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const renameDraftRef = useRef('');
  const setRenameDraftValue = useCallback((value: string) => {
    renameDraftRef.current = value;
    setRenameDraft(value);
  }, []);
  const startRename = useCallback((row: Agreement) => {
    renameDraftRef.current = row.name;
    setRenameDraft(row.name);
    setRenamingId(row.id);
  }, []);
  const commitRename = useCallback(() => {
    setRenamingId(current => {
      if (current) handleRenameAgreement(current, renameDraftRef.current);
      return null;
    });
  }, [handleRenameAgreement]);
  const cancelRename = useCallback(() => setRenamingId(null), []);

  const agreementColumns = useMemo(
    () => createAgreementColumns({
      renamingId,
      renameDraft,
      onRenameDraftChange: setRenameDraftValue,
      onStartRename: startRename,
      onCommitRename: commitRename,
      onCancelRename: cancelRename,
    }, protoVersion === 'simple'),
    [renamingId, renameDraft, setRenameDraftValue, startRename, commitRename, cancelRename, protoVersion],
  );
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [savedNDAData, setSavedNDAData] = useState<NDAFormData | null>(null);
  const [ndaAgreementId, setNdaAgreementId] = useState<string | null>(null);
  // Per-agreement session content keyed by unique agreement id, so every NDA and
  // blank-document workspace created via Start New keeps its own content instead
  // of overwriting a shared fixed-id entry.
  const [ndaDataById, setNdaDataById] = useState<Record<string, { data: NDAFormData | null; sentForSignature: boolean; recipientName: string }>>({});
  const [uploadedDocById, setUploadedDocById] = useState<Record<string, { documents: string[]; recipientName: string; isDraft?: boolean }>>({});
  // Documents added to a space via Add Document → Upload, persisted per agreement
  // id so they survive navigating away from the workspace and back.
  const [addedDocsById, setAddedDocsById] = useState<Record<string, string[]>>({});
  // Documents sent for signature from within a space, persisted per agreement id
  // so their Pending Signature status survives leaving and re-entering the space.
  const [signedDocsById, setSignedDocsById] = useState<Record<string, { name: string; recipient: string }[]>>({});
  const [ndaSentForSignature, setNdaSentForSignature] = useState(false);
  const [ndaRecipientName, setNdaRecipientName] = useState<string>('');
  const [rootPreparePreselectedDocs, setRootPreparePreselectedDocs] = useState<string[]>([]);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [uploadedDocAgreement, setUploadedDocAgreement] = useState<{ documents: string[], recipientName: string, isDraft?: boolean } | null>(null);
const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAgreementRequestModal, setShowAgreementRequestModal] = useState(false);
  const [showRootPrepare, setShowRootPrepare] = useState(false);
  const [previewDocName, setPreviewDocName] = useState<string | null>(null);
  // Tracks where the preview was opened from: 'agreement' = existing Agreement Space
  // (Save returns there), 'new' = a brand-new document (Save creates a new space).
  const [previewOrigin, setPreviewOrigin] = useState<'agreement' | 'new'>('agreement');
  // Approval flow triggered from a document preview's "Send for Approval" action.
  const [pendingApprovalDoc, setPendingApprovalDoc] = useState<string | null>(null);
  const [workspaceApprovalTasks, setWorkspaceApprovalTasks] = useState<DealTask[]>([]);
  // Signature sent from the global doc-preview header while a workspace is open.
  // pendingSignatureDoc marks that the Prepare flow should update the mounted
  // workspace (status + task) instead of creating a brand-new agreement space.
  const [pendingSignatureDoc, setPendingSignatureDoc] = useState<string | null>(null);
  const [workspaceSignatureDocs, setWorkspaceSignatureDocs] = useState<{ name: string; recipient: string }[]>([]);
  // Deep-link scenario: which overlay (if any) the Tally Inc workspace should
  // auto-open when it mounts, and the prefill data for those overlays.
  const [wsInitialOverlay, setWsInitialOverlay] = useState<'upload-request' | 'vendor-onboarding' | null>(null);

  /* ── Predictable scenario deep links (?flow=…) ── */
  useEffect(() => {
    const flow = new URLSearchParams(window.location.search).get('flow');
    if (!flow) return;
    // All scenario steps live under the Agreements tab.
    setActiveTab('agreements');

    // Step 1: Send an NDA to Tally Inc — open the NDA modal prefilled.
    if (flow === 'send-nda') {
      setNdaAgreementId(null);
      setSavedNDAData({ receivingParty: SCENARIO_VENDOR.company, effectiveDate: '', duration: '12' });
      setShowNDAModal(true);
      return;
    }

    // Steps 2-4 operate inside one shared Tally Inc vendor workspace seeded with
    // the MSA document.
    const openScenarioWorkspace = () => {
      setUploadedDocById(prev => ({
        ...prev,
        [SCENARIO_WORKSPACE_ID]: { documents: [SCENARIO_MSA_DOC], recipientName: SCENARIO_VENDOR.contactName },
      }));
      const ws = buildScenarioAgreement();
      addNewAgreement(ws);
      setSelectedAgreement(ws);
      setShowDealWorkspace(true);
    };

    if (flow === 'review-msa') {
      // Step 2: open the uploaded MSA in the document preview to highlight,
      // tag Francis Finance, and send to Liam Legal for approval.
      openScenarioWorkspace();
      setPreviewOrigin('agreement');
      setPreviewDocName(SCENARIO_MSA_DOC);
    } else if (flow === 'request-coi') {
      // Step 3: open the upload-request overlay prefilled for a COI from Marco.
      setWsInitialOverlay('upload-request');
      openScenarioWorkspace();
    } else if (flow === 'vendor-onboarding') {
      // Step 4: open the New Vendor Onboarding overlay prefilled for Tally Inc.
      setWsInitialOverlay('vendor-onboarding');
      openScenarioWorkspace();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ���� Sync hash ↔ state ── */
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

  // Tabs that are intentionally not navigable in the prototype. Clicking one
  // surfaces a small callout anchored beneath the tab instead of navigating.
  const handleUnavailableTabClick = useCallback((tabId: string) => {
    const el = document.querySelector<HTMLElement>(`[data-nav-id="${tabId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setUnavailableCallout({ left: rect.left + rect.width / 2, top: rect.bottom });
    }
  }, []);

  // Dismiss the callout on any outside click or on Escape.
  useEffect(() => {
    if (!unavailableCallout) return;
    const dismiss = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-unavailable-callout]') || target.closest('[data-nav-id]')) return;
      setUnavailableCallout(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setUnavailableCallout(null); };
    document.addEventListener('mousedown', dismiss);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', dismiss);
      document.removeEventListener('keydown', onKey);
    };
  }, [unavailableCallout]);

  /* ── GlobalNav — matches production DocuSign comp ─��� */
  const globalNavConfig = {
    logo: <img src="/docusign-logo.svg" alt="DocuSign" />,
    showAppSwitcher: false,
    onAppSwitcherClick: () => {},
    navItems: [
      { id: 'home',       label: 'Home',        active: activeTab === 'home',       onClick: () => handleTabClick('home') },
      { id: 'agreements', label: 'Agreements',   active: activeTab === 'agreements', onClick: () => handleTabClick('agreements') },
      { id: 'templates',  label: 'Templates',    active: false, onClick: () => handleUnavailableTabClick('templates') },
      { id: 'insights',   label: 'Insights',     active: false, onClick: () => handleUnavailableTabClick('insights') },
      { id: 'admin',      label: 'Admin',        active: false, onClick: () => handleUnavailableTabClick('admin') },
    ],
    showSettings: true,
    settingsIcon: 'sliders-horizontal' as const,
    user: { name: 'Lisa Jones' },
    onUserMenuClick: () => setUserMenuOpen(o => !o),
  };

  /* ── LocalNav — Agreements tab ── */
  const agreementsSidebar = {
    headerLabel: 'Start',
    headerIcon: 'plus' as const,
    onHeaderClick: () => { setRootPreparePreselectedDocs([]); setShowRootPrepare(false); setShowStartModal(true); },
    activeItemId: sidebarView,
    sections: [
      {
        id: 'agreements',
        items: [
          { id: 'all-agreements', label: 'All Agreements', icon: 'envelope' as const, onClick: () => setSidebarView('all-agreements') },
          { id: 'in-progress', label: 'In Progress', nested: true, onClick: () => setSidebarView('in-progress') },
          { id: 'completed', label: 'Completed', nested: true, onClick: () => setSidebarView('completed') },
        ],
      },
      { id: 'folders-divider', hasDivider: true, items: [
        { id: 'folders', label: 'Folders', icon: 'folder' as const, onClick: () => { setSidebarView('folders'); setFolderPath([]); setSearch(''); } },
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

  /* ���─ View-filtered data (Sales Agreement Workspaces) ── */
  const viewAgreements = useMemo(() => {
    // In the Simple Use Case version the All Agreements list starts as a single
    // seeded Agreement Space (the Handbook Sign-Off). Newly created agreements
    // (Permission Slip, Start Blank, Field Trip, etc.) must still appear here,
    // matching the Standard behavior — so we append any runtime-created rows.
    // Runtime-created rows are those in `agreementsList` whose id isn't part of
    // the original static seed data.
    const handbookSeed: Agreement = {
      id: 'w1',
      name: 'Student/Parent Handbook Sign-Off',
      party: 'Riverside Unified School District',
      partyLogo: 'RU',
      status: 'Completed',
      statusIcon: 'status-check',
      statusKind: 'success',
      statusSub: 'Fully Signed',
      dealValue: '—',
      agreementType: 'Acknowledgment',
      entityKind: 'space',
      termLength: '2025–2026 School Year',
      closeDate: 'Sep 5, 2026',
      date: '28/7/2026',
      time: '09:00',
      action: 'Edit',
      documentsCount: 1,
      tasksCount: 1,
      tasksPending: 1,
    };
    const seedIds = new Set(AGREEMENTS_DATA.map(a => a.id));
    const createdAgreements = agreementsList.filter(a => !seedIds.has(a.id));
    const sourceList: Agreement[] = protoVersion === 'simple'
      ? [...createdAgreements, handbookSeed]
      : agreementsList;

    let list: Agreement[];
    switch (sidebarView) {
      case 'drafts':
        list = sourceList.filter(a => a.status === 'Draft');
        break;
      case 'in-progress':
        list = sourceList.filter(a => a.status === 'In Progress');
        break;
      case 'completed':
        list = sourceList.filter(a => a.status === 'Completed');
        break;
      case 'deleted':
        list = sourceList.filter(a => ['Expired', 'Voided'].includes(a.status));
        break;
      default:
        list = sourceList;
    }
    // Sort by most recent first, using the item's date (D/M/YYYY) + time (HH:MM).
    const toTimestamp = (a: Agreement) => {
      const [d, m, y] = (a.date || '').split('/').map(Number);
      if (!y || !m || !d) return 0;
      const [hh, mm] = (a.time || '00:00').split(':').map(Number);
      return new Date(y, m - 1, d, hh || 0, mm || 0).getTime();
    };
    return [...list].sort((a, b) => toTimestamp(b) - toTimestamp(a));
  }, [sidebarView, agreementsList, protoVersion]);

  // In this demo all listed agreements are owned by the current user.
  const ownerOf = useCallback((_a: Agreement) => 'Lisa Jones (You)', []);

  // Facet options derived from the agreements in the current view.
  const partyOptions = useMemo(() => Array.from(new Set(viewAgreements.map(a => a.party).filter(Boolean))).sort(), [viewAgreements]);
  const typeOptions = useMemo(() => ['Agreement Spaces', 'Documents'], []);
  const statusOptions = useMemo(() => Array.from(new Set(viewAgreements.map(a => a.status).filter(Boolean))).sort(), [viewAgreements]);
  // Owner filter lists the current user plus the procurement specialist's collaborators.
  const ownerOptions = useMemo(() => [
    'Lisa Jones (You)',
    'David Kim',
    'Sarah Martinez',
    'Robert Yang',
    'Laura Chen',
    'Kevin Park',
    'Priya Nair',
  ], []);

  const toggleInSet = useCallback((setFn: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setFn(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }, []);

  const filteredAgreements = useMemo(() => {
    const q = search.toLowerCase();
    return viewAgreements
      .filter((a) => {
        if (q && !(a.name.toLowerCase().includes(q) || a.party.toLowerCase().includes(q))) return false;
        if (filterParty.size > 0 && !filterParty.has(a.party)) return false;
        if (filterType.size > 0) {
          // Prefer the explicit entityKind flag; fall back to the documentsCount
          // heuristic (multi-document agreements are "Agreement Spaces").
          const kind = a.entityKind
            ? (a.entityKind === 'space' ? 'Agreement Spaces' : 'Documents')
            : ((a.documentsCount ?? 1) > 1 ? 'Agreement Spaces' : 'Documents');
          if (!filterType.has(kind)) return false;
        }
        if (filterStatus.size > 0 && !filterStatus.has(a.status)) return false;
        if (filterOwner.size > 0 && !filterOwner.has(ownerOf(a))) return false;
        return true;
      })
      // Reflect documents added to a space (via Add Document → Upload) in the
      // row's document subtitle, so e.g. the waiver appears after being added.
      .map((a) => {
        const added = addedDocsById[a.id];
        if (!added || added.length === 0) return a;
        const base = a.documentNames ?? [];
        const merged = [...base];
        added.forEach((name) => { if (!merged.includes(name)) merged.push(name); });
        return { ...a, documentNames: merged, documentsCount: merged.length };
      });
  }, [search, viewAgreements, filterParty, filterType, filterStatus, filterOwner, ownerOf, addedDocsById]);

  // When "Documents" is chosen in the Type filter, the list shows individual
  // documents with document-specific columns instead of agreements.
  const isDocumentsView = filterType.has('Documents');

  // Flatten every document that lives inside an agreement space into an
  // individual document row, so they appear alongside the standalone document
  // repository when filtering by Type: Documents.
  const spaceDocuments = useMemo<ProcurementDocument[]>(() => {
    const rows: ProcurementDocument[] = [];
    viewAgreements.forEach((a) => {
      const isSpace = a.entityKind ? a.entityKind === 'space' : (a.documentsCount ?? 1) > 1;
      if (!isSpace) return;
      const parties = a.party && a.party !== '—' ? [a.party] : [];
      const type = a.agreementType || 'Document';
      const workspace = AGREEMENT_WORKSPACE_DATA[a.id];
      if (workspace) {
        [...workspace.documents, ...workspace.supplementalDocs].forEach((doc) => {
          rows.push({ id: `${a.id}-${doc.id}`, name: doc.name, parties, type, effective: doc.dateModified || '—', expires: a.closeDate || '—' });
        });
      } else if (a.workspaceKind === 'uploaded' && uploadedDocById[a.id]) {
        // Newly created single-document space: list each of its uploaded docs.
        uploadedDocById[a.id].documents.forEach((name, i) => {
          rows.push({ id: `${a.id}-${i}`, name, parties, type, effective: a.date, expires: a.closeDate || '—' });
        });
      } else {
        // Created space without seeded workspace data — represent its document.
        rows.push({ id: `${a.id}-doc`, name: a.name, parties, type, effective: a.date, expires: a.closeDate || '—' });
      }
    });
    return rows;
  }, [viewAgreements, uploadedDocById]);

  const filteredDocuments = useMemo(() => {
    const q = search.toLowerCase();
    return [...spaceDocuments, ...DOCUMENTS_DATA].filter((d) => {
      if (q && !(d.name.toLowerCase().includes(q) || d.parties.some((p) => p.toLowerCase().includes(q)))) return false;
      if (filterParty.size > 0 && !d.parties.some((p) => filterParty.has(p))) return false;
      return true;
    });
  }, [search, filterParty, spaceDocuments]);

  const filteredParties = useMemo(() => {
    if (!search) return PARTIES_DATA;
    const q = search.toLowerCase();
    return PARTIES_DATA.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
  }, [search]);

  const VIEW_LABELS: Record<SidebarView, string> = {
    'all-agreements': 'All Agreements', drafts: 'Drafts', 'in-progress': 'In Progress',
    completed: 'Completed', deleted: 'Expired / Voided', parties: 'Parties', requests: 'Requests',
    folders: 'Folders',
  };

  const isPartiesView = sidebarView === 'parties';
  const isNavigatorView = sidebarView === 'completed';
  const isRequestsView = sidebarView === 'requests';
  const isFoldersView = sidebarView === 'folders';

  /* ─�� Folders view: navigation + inline expansion ── */
  const toggleFolderExpand = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const enterFolder = useCallback((row: FolderNode) => {
    setFolderPath((prev) => [...prev, { id: row.id, name: row.name }]);
    setSearch('');
  }, []);

  const navigateToCrumb = useCallback((index: number) => {
    // index 0 = "Folders" root; index k maps to folderPath[0..k-1]
    setFolderPath((prev) => prev.slice(0, index));
    setSearch('');
  }, []);

  // Direct children of the folder the user is currently inside.
  const currentFolderChildren = useMemo(() => {
    if (folderPath.length === 0) return FOLDERS_TREE;
    const node = findFolderNode(FOLDERS_TREE, folderPath[folderPath.length - 1].id);
    return node?.children ?? [];
  }, [folderPath]);

  // Rows to render: flatten the current level, expanding any opened subfolders.
  // When searching, show a flat list of all matching descendants instead.
  const folderRows = useMemo<FolderRow[]>(() => {
    const acc: FolderRow[] = [];
    if (search) {
      const q = search.toLowerCase();
      const walkAll = (nodes: FolderNode[]) => {
        for (const n of nodes) {
          if (n.name.toLowerCase().includes(q)) acc.push({ ...n, depth: 0, hasChildren: false });
          if (n.children) walkAll(n.children);
        }
      };
      walkAll(currentFolderChildren);
      return acc;
    }
    const walk = (nodes: FolderNode[], depth: number) => {
      for (const n of nodes) {
        const hasChildren = n.type === 'folder' && (n.children?.length ?? 0) > 0;
        acc.push({ ...n, depth, hasChildren });
        if (hasChildren && expandedFolders.has(n.id)) walk(n.children!, depth + 1);
      }
    };
    walk(currentFolderChildren, 0);
    return acc;
  }, [currentFolderChildren, expandedFolders, search]);

  const foldersTitle = folderPath.length === 0 ? 'Folders' : folderPath[folderPath.length - 1].name;
  const folderBreadcrumbItems = useMemo(
    () => [{ label: 'Folders', href: '#' }, ...folderPath.map((p) => ({ label: p.name, href: '#' }))],
    [folderPath]
  );

  const folderColumns = useMemo(() => [
    {
      key: 'name', header: 'Name', sortable: true, width: '52%',
      cell: (row: FolderRow) => (
        <Inline gap="small" align="center" style={{ paddingLeft: row.depth * 24 }}>
          {row.type === 'folder' && row.hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleFolderExpand(row.id); }}
              aria-label={expandedFolders.has(row.id) ? 'Collapse folder' : 'Expand folder'}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0, padding: 0, color: 'var(--ink-text-color, #130032)' }}
            >
              <Icon name={expandedFolders.has(row.id) ? 'chevron-down' : 'chevron-right'} size={16} />
            </button>
          ) : (
            <span style={{ width: 24, flexShrink: 0 }} />
          )}
          <Icon name={row.type === 'folder' ? 'folder' : 'envelope'} size={18} color={row.type === 'folder' ? 'var(--ink-cobalt-60, #7B61FF)' : 'var(--ink-text-color-secondary, #5B5670)'} />
          <Stack gap="none" style={{ gap: 2, minWidth: 0 }}>
            {row.type === 'folder' ? (
              <button
                onClick={(e) => { e.stopPropagation(); enterFolder(row); }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, textAlign: 'left' }}
              >
                <Text size="sm" weight="medium">{row.name}</Text>
              </button>
            ) : (
              <Text size="sm" weight="medium">{row.name}</Text>
            )}
            {row.recipient && <Text size="xs" color="secondary">{row.recipient}</Text>}
          </Stack>
        </Inline>
      ),
    },
    {
      key: 'status', header: 'Status', width: '20%',
      cell: (row: FolderRow) => row.status ? (
        <Stack gap="none" style={{ gap: 2 }}>
          <Inline gap="small" align="center">
            <Icon
              name={row.status === 'Voided' ? 'status-void' : row.status === 'Completed' ? 'status-check' : 'clock'}
              size={16}
              color={row.status === 'Voided' ? 'var(--ink-text-color-secondary, #5B5670)' : row.status === 'Completed' ? 'var(--ink-green-80, #1B7A3D)' : 'var(--ink-cobalt-80)'}
            />
            <Text size="sm" color={row.status === 'Voided' ? 'secondary' : undefined}>{row.status}</Text>
          </Inline>
          {row.statusSub && <Text size="xs" color="secondary">{row.statusSub}</Text>}
        </Stack>
      ) : null,
    },
    {
      key: 'lastChange', header: 'Last Change', sortable: true, width: '18%',
      cell: (row: FolderRow) => <Text size="sm" color="secondary">{row.lastChange}</Text>,
    },
    {
      key: 'action', header: '', alignment: 'end', width: 'auto',
      cell: (row: FolderRow) => (
        <Inline gap="small" align="center" justify="end" style={{ marginLeft: 'auto' }}>
          {row.type === 'document' && <Button kind="secondary" size="small">Copy</Button>}
          <IconButton icon="overflow-vertical" variant="tertiary" size="small" aria-label="More actions" />
        </Inline>
      ),
    },
  ], [expandedFolders, toggleFolderExpand, enterFolder]);

  /* ─��� Navigator filtered data ── */
  const filteredNavigator = useMemo(() => {
    if (!search) return NAVIGATOR_DATA;
    const q = search.toLowerCase();
    return NAVIGATOR_DATA.filter(a => a.fileName.toLowerCase().includes(q) || a.parties.some(p => p.toLowerCase().includes(q)));
  }, [search]);

  /* ── Requests filtered data ���─ */
  const filteredRequests = useMemo(() => {
    if (!search) return REQUESTS_DATA;
    const q = search.toLowerCase();
    return REQUESTS_DATA.filter(r => r.title.toLowerCase().includes(q) || r.requestId.toLowerCase().includes(q));
  }, [search]);

  /* ── Templates filtered data ── */
  const viewTemplates = useMemo(() => {
    switch (templatesSidebarView) {
      case 'my-templates':
        return TEMPLATES_DATA.filter(t => t.owner === 'Lisa Jones');
      case 'shared-with-me':
        return TEMPLATES_DATA.filter(t => t.shared && t.owner !== 'Lisa Jones');
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

  /* ��─ Templates content ── */
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
              <FilterMenu label="Party" searchable options={partyOptions} selected={filterParty} onToggle={(v) => toggleInSet(setFilterParty, v)} onClear={() => setFilterParty(new Set())} />
              <FilterMenu label="Type" radio options={typeOptions} selected={filterType} onToggle={(v) => setFilterType(prev => prev.has(v) ? new Set() : new Set([v]))} onClear={() => setFilterType(new Set())} />
              <FilterMenu label="Status" options={statusOptions} selected={filterStatus} onToggle={(v) => toggleInSet(setFilterStatus, v)} onClear={() => setFilterStatus(new Set())} />
              <FilterMenu label="Owner" options={ownerOptions} selected={filterOwner} onToggle={(v) => toggleInSet(setFilterOwner, v)} onClear={() => setFilterOwner(new Set())} />
              <Button kind="secondary" size="small" aria-label="All Filters" style={{ minWidth: 'auto', padding: '0 8px' }}>
                <Icon name="filter" size={16} />
              </Button>
            </Inline>
          )}
        />
      }
    >
      {isPartiesView ? (
        <DataTable key="table-parties" columns={partyColumns} data={filteredParties} getRowKey={(row) => row.id} stickyHeader showColumnControl emptyMessage="No parties match your search" pagination={{ page: 1, pageSize: 25, totalItems: 1334, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      ) : isDocumentsView ? (
        <DataTable key="table-documents" columns={documentColumns} data={filteredDocuments} getRowKey={(row: ProcurementDocument) => row.id} selectable stickyHeader showColumnControl rowHeight="tall" emptyMessage="No documents match your search" pagination={{ page: 1, pageSize: 25, totalItems: filteredDocuments.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      ) : isRequestsView ? (
        <DataTable key="table-requests" columns={requestColumns} data={filteredRequests} getRowKey={(row) => row.id} stickyHeader showColumnControl rowHeight="tall" emptyMessage="No requests found" pagination={{ page: 1, pageSize: 10, totalItems: filteredRequests.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      ) : (
        <DataTable key="table-agreements" columns={agreementColumns} data={filteredAgreements} getRowKey={(row) => row.id} selectable stickyHeader showColumnControl rowHeight="tall" emptyMessage={
          sidebarView === 'drafts' ? 'No draft agreements' :
          sidebarView === 'in-progress' ? 'No agreements in progress' :
          sidebarView === 'completed' ? 'No completed agreements' :
          'No agreements match your search'
        } onRowClick={(row: Agreement) => {
          setSelectedAgreement(row);
          setShowDealWorkspace(true);
        }} pagination={protoVersion === 'simple' ? undefined : { page: 1, pageSize: 25, totalItems: filteredAgreements.length, onPageChange: () => {}, onPageSizeChange: () => {}, showInfo: true }} />
      )}
    </AgreementTableView>
  );

  /* ── Folders content ── */
  const foldersContent = (
    <AgreementTableView
      pageHeader={
        <div>
          <PageHeader title={foldersTitle} />
          {folderPath.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <Breadcrumb
                items={folderBreadcrumbItems}
                onItemClick={(_item, index) => navigateToCrumb(index)}
              />
            </div>
          )}
        </div>
      }
      filterBar={
        <FilterBar
          search={{ value: search, onChange: setSearch, placeholder: 'Search Folders' }}
          showSearchIndicator={false}
          filters={
            <Button kind="secondary" size="small" startElement={<Icon name="filter" size={16} />}>All Filters</Button>
          }
        />
      }
    >
      <DataTable
        columns={folderColumns}
        data={folderRows}
        getRowKey={(row: FolderRow) => row.id}
        selectable
        stickyHeader
        rowHeight="tall"
        emptyMessage={search ? 'No folders or documents match your search' : 'This folder is empty'}
      />
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
    agreements: isFoldersView ? foldersContent : agreementsContent,
    templates: templatesContent,
    insights: insightsContent,
    admin: <AdminPage />,
  };

  /* ── Transition key — changes on tab OR sidebar view to trigger animation ── */
  const transitionKey = `${activeTab}-${sidebarView}-${templatesSidebarView}-${insightsSidebarView}`;

  return (
    <PrototypeVersionContext.Provider value={{ version: protoVersion, setVersion: setProtoVersion }}>
    <style>{tableRowStaggerStyles}</style>
    <UserMenu
      open={userMenuOpen}
      onClose={() => setUserMenuOpen(false)}
      userName={globalNavConfig.user.name}
      version={protoVersion}
      onSelectVersion={(v) => {
        setProtoVersion(v);
        // Switching into the Simple Use Case lands on the Agreements page
        // (rather than Home) since the single Waiver space is the focus.
        if (v === 'simple') {
          handleTabClick('agreements');
        }
      }}
    />
    <DocuSignShell
      globalNav={globalNavConfig}
      localNav={sidebarMap[activeTab]}
    >
      {/* In the Simple Use Case version, fill the content column so the footer
          sticks to the bottom of the viewport instead of the bottom of the table. */}
      {protoVersion === 'simple' ? (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <FadeIn keyProp={transitionKey} key={transitionKey}>
              <div className="page-transition" style={{ flex: 1 }}>
                {contentMap[activeTab]}
              </div>
            </FadeIn>
          </div>
          <Footer />
        </div>
      ) : (
        <>
          <FadeIn keyProp={transitionKey} key={transitionKey}>
            <div className="page-transition" style={{ flex: 1 }}>
              {contentMap[activeTab]}
            </div>
          </FadeIn>
          <Footer />
        </>
      )}
    </DocuSignShell>
    {unavailableCallout && (
      <div
        data-unavailable-callout
        role="status"
        style={{
          position: 'fixed',
          left: unavailableCallout.left,
          top: unavailableCallout.top + 8,
          transform: 'translateX(-50%)',
          zIndex: 2000,
          maxWidth: 240,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'var(--ink-font-color-default)',
          color: 'var(--ink-white-100)',
          fontFamily: 'var(--ink-font-family)',
          fontSize: 'var(--ink-font-size-sm)',
          lineHeight: 1.4,
          boxShadow: '0 8px 24px rgba(19,0,50,0.24)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 10,
            height: 10,
            background: 'var(--ink-font-color-default)',
          }}
        />
        This page isn&apos;t available in the prototype
      </div>
    )}
    {showAgreementDetail && (
      <AgreementDetailView onClose={() => setShowAgreementDetail(false)} />
    )}
    {showDealWorkspace && selectedAgreement && (
      <WorkspaceView 
        agreement={selectedAgreement} 
        onRename={(name) => handleRenameAgreement(selectedAgreement.id, name)}
        onClose={() => {
          setShowDealWorkspace(false);
          setSelectedAgreement(null);
          setWorkspaceApprovalTasks([]);
          setWorkspaceSignatureDocs([]);
          setWsInitialOverlay(null);
        }}
        onEditNDA={() => {
          // Edit the NDA that owns this workspace (reuse its id + data).
          setNdaAgreementId(selectedAgreement.id);
          setSavedNDAData(ndaDataById[selectedAgreement.id]?.data ?? null);
          setShowNDAModal(true);
        }}
        savedNDAData={ndaDataById[selectedAgreement.id]?.data ?? null}
        ndaSentForSignature={ndaDataById[selectedAgreement.id]?.sentForSignature ?? false}
        ndaRecipientName={ndaDataById[selectedAgreement.id]?.recipientName ?? ''}
        uploadedDocAgreement={uploadedDocById[selectedAgreement.id] ?? null}
        persistedAddedDocs={addedDocsById[selectedAgreement.id] ?? []}
        onAddDocument={(name) => {
          const id = selectedAgreement.id;
          setAddedDocsById(prev => {
            const existing = prev[id] ?? [];
            if (existing.includes(name)) return prev;
            return { ...prev, [id]: [...existing, name] };
          });
        }}
        onPreviewDocument={(name) => { setPreviewOrigin('agreement'); setPreviewDocName(name); }}
        injectedTasks={workspaceApprovalTasks}
        injectedSignatureDocs={workspaceSignatureDocs}
        persistedSignedDocs={signedDocsById[selectedAgreement.id] ?? []}
        onSignDocs={(docs) => {
          const id = selectedAgreement.id;
          setSignedDocsById(prev => {
            const existing = prev[id] ?? [];
            const merged = [...existing];
            docs.forEach(d => { if (!merged.some(m => m.name === d.name)) merged.push(d); });
            return { ...prev, [id]: merged };
          });
        }}
        initialOverlay={selectedAgreement.id === SCENARIO_WORKSPACE_ID ? wsInitialOverlay : null}
        uploadRequestPrefill={{
          title: 'Certificate of Insurance',
          description: `Please upload ${SCENARIO_VENDOR.company}'s current Certificate of Insurance (COI).`,
          firstName: SCENARIO_VENDOR.contactFirst,
          lastName: SCENARIO_VENDOR.contactLast,
          email: SCENARIO_VENDOR.contactEmail,
        }}
        vendorOnboardingPrefill={{
          vendorName: SCENARIO_VENDOR.company,
          contactEmail: SCENARIO_VENDOR.contactEmail,
        }}
      />
    )}
    <StartNewModal open={showStartModal} onClose={() => setShowStartModal(false)} onStartBlank={() => setShowDocumentUpload(true)} onStartNDA={() => { setNdaAgreementId(null); setSavedNDAData(null); setShowNDAModal(true); }} onStartPurchase={() => setShowPurchaseModal(true)} onStartRequest={() => setShowAgreementRequestModal(true)} onSignatureRequest={() => { setRootPreparePreselectedDocs([]); setShowRootPrepare(true); }} onPreviewDocument={(name) => { setPreviewOrigin('new'); setPreviewDocName(name); }} />

    <DocumentPreview
      open={previewDocName !== null}
      documentName={previewDocName ?? ''}
      onClose={() => setPreviewDocName(null)}
      onSave={() => {
        if (previewOrigin === 'new') {
          // New document: create a new Agreement Space containing just this document.
          const docName = previewDocName ?? 'Untitled Document';
          const newId = `uploaded-${Date.now()}`;
          setUploadedDocById(prev => ({ ...prev, [newId]: { documents: [docName], recipientName: '', isDraft: true } }));
          const newAgreement: Agreement = {
            id: newId,
            entityKind: 'space',
            workspaceKind: 'uploaded',
            name: 'Untitled Agreement Space',
            documentNames: [docName],
            party: '—',
            partyLogo: 'UA',
            status: 'Draft',
            statusIcon: 'clock',
            statusKind: 'neutral',
            statusSub: 'Draft',
            dealValue: '—',
            agreementType: 'Master Services Agreement',
            termLength: '—',
            closeDate: '—',
            date: new Date().toLocaleDateString('en-GB'),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            action: 'View',
            documentsCount: 1,
            tasksCount: 0,
            tasksPending: 0,
          };
          addNewAgreement(newAgreement);
          setSelectedAgreement(newAgreement);
          setShowDealWorkspace(true);
        }
        // For 'agreement' origin the space is already mounted behind the preview,
        // so closing returns the user there.
        setPreviewDocName(null);
      }}
      onSendForApproval={(name) => { setPreviewDocName(null); setPendingApprovalDoc(name); }}
      onSendForSignature={(name) => {
        setPreviewDocName(null);
        // When the document was opened from within an agreement workspace, keep
        // that workspace intact and just send the doc; otherwise fall back to the
        // new-agreement Signature Request flow.
        if (previewOrigin === 'agreement') setPendingSignatureDoc(name);
        setRootPreparePreselectedDocs([name]);
        setShowRootPrepare(true);
      }}
      onApprovalCreated={(task) => { setWorkspaceApprovalTasks(prev => [...prev, task]); }}
    />

    <SendForApprovalModal
      open={pendingApprovalDoc !== null}
      documentName={pendingApprovalDoc ?? ''}
      onClose={() => setPendingApprovalDoc(null)}
      onComplete={(task) => {
        setWorkspaceApprovalTasks(prev => [...prev, task]);
        setPendingApprovalDoc(null);
      }}
    />

    <DocumentUpload
      open={showDocumentUpload}
      onClose={() => setShowDocumentUpload(false)}
      onContinue={(docs) => {
        setShowDocumentUpload(false);
        setRootPreparePreselectedDocs(docs);
        setShowRootPrepare(true);
      }}
    />
    <PurchaseRequestModal
      open={showPurchaseModal}
      onClose={() => setShowPurchaseModal(false)}
      onNext={(data) => {
        setShowPurchaseModal(false);
        const purchaseAgreement: Agreement = {
          id: `purchase-${Date.now()}`,
          entityKind: 'space',
          name: data.title || 'Purchase Agreement (Draft)',
          party: data.vendor || 'Vendor',
          partyLogo: data.vendor ? data.vendor.substring(0, 2).toUpperCase() : 'PA',
          status: 'In Progress',
          statusIcon: 'clock',
          statusKind: 'info',
          statusSub: 'In Progress',
          dealValue: '—',
          agreementType: 'Purchase Agreement',
          termLength: '—',
          closeDate: '—',
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          action: 'Edit',
          documentsCount: data.documentSource === '3rd-party' ? 0 : 1,
          tasksCount: 2,
          tasksPending: 2,
        };
        setSelectedAgreement(purchaseAgreement);
        setShowDealWorkspace(true);
        addNewAgreement(purchaseAgreement);
      }}
    />
    <InstantNDAModal 
      open={showNDAModal} 
      onClose={() => setShowNDAModal(false)} 
      initialData={savedNDAData}
      onSave={(data) => {
        // Save the NDA data
        setSavedNDAData(data);
        
        // Reuse the id when editing an existing NDA; otherwise mint a new unique
        // id so this NDA does not overwrite a previously created one.
        const ndaId = ndaAgreementId ?? `nda-${Date.now()}`;
        setNdaAgreementId(ndaId);
        setNdaDataById(prev => ({ ...prev, [ndaId]: { data, sentForSignature: prev[ndaId]?.sentForSignature ?? false, recipientName: prev[ndaId]?.recipientName ?? '' } }));
        
        // Create a draft NDA agreement object. In the Simple Use Case this modal
        // is the Permission Slip flow, so the space is always titled the same way
        // whether it was sent or just saved as a draft.
        const ndaAgreement: Agreement = {
          id: ndaId,
          entityKind: 'space',
          workspaceKind: 'nda',
          name: protoVersion === 'simple' ? 'Permission for Museum' : 'Untitled Agreement Space',
          documentNames: protoVersion === 'simple' ? ['Permission Slip'] : ['Non-Disclosure Agreement'],
          party: data.receivingParty || 'Receiving Party',
          partyLogo: data.receivingParty ? data.receivingParty.substring(0, 2).toUpperCase() : 'NDA',
          externalParticipants: data.receivingParty ? [data.receivingParty] : [],
          status: 'In Progress',
          statusIcon: 'clock',
          statusKind: 'info',
          statusSub: 'In Progress',
          dealValue: '—',
          agreementType: 'NDA',
          termLength: `${data.duration} months`,
          closeDate: data.effectiveDate || '—',
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          action: 'Edit',
          documentsCount: 1,
          tasksCount: 1,
          tasksPending: 1,
        };
        
        // Close the NDA modal and open the workspace
        setShowNDAModal(false);
        setSelectedAgreement(ndaAgreement);
        setShowDealWorkspace(true);
        addNewAgreement(ndaAgreement);
      }}
      onSendForSignature={(data) => {
        // Save the NDA data
        setSavedNDAData(data);
        
        // Reuse the id when editing; otherwise mint a unique id for this NDA.
        const ndaId = ndaAgreementId ?? `nda-${Date.now()}`;
        setNdaAgreementId(ndaId);
        setNdaDataById(prev => ({ ...prev, [ndaId]: { data, sentForSignature: false, recipientName: prev[ndaId]?.recipientName ?? '' } }));
        
        const ndaAgreement: Agreement = {
          id: ndaId,
          entityKind: 'space',
          workspaceKind: 'nda',
          name: data.receivingParty ? `NDA - ${data.receivingParty}` : 'Non-Disclosure Agreement (Draft)',
          party: data.receivingParty || 'Receiving Party',
          partyLogo: data.receivingParty ? data.receivingParty.substring(0, 2).toUpperCase() : 'NDA',
          externalParticipants: data.receivingParty ? [data.receivingParty] : [],
          status: 'In Progress',
          statusIcon: 'clock',
          statusKind: 'info',
          statusSub: 'In Progress',
          dealValue: '—',
          agreementType: 'NDA',
          termLength: `${data.duration} months`,
          closeDate: data.effectiveDate || '—',
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          action: 'Edit',
          documentsCount: 1,
          tasksCount: 1,
          tasksPending: 1,
        };
        
        // Close the NDA modal and open Prepare screen with the document.
        // In the Simple Use Case this flow is a Permission Slip, so the Prepare
        // thumbnail must reflect that instead of "Non-Disclosure Agreement".
        setShowNDAModal(false);
        setRootPreparePreselectedDocs([protoVersion === 'simple' ? 'Permission Slip' : 'Non-Disclosure Agreement']);
        setShowRootPrepare(true);
      }}
    />
    <AgreementRequestModal
      open={showAgreementRequestModal}
      onClose={() => setShowAgreementRequestModal(false)}
      onSubmit={(data) => {
        const requestName = data.category && data.category !== '-- None --'
          ? `${data.requestType} - ${data.category}`
          : (data.requestType || 'Agreement Request');
        const requestAgreement: Agreement = {
          id: `request-${Date.now()}`,
          entityKind: 'space',
          name: requestName,
          party: '—',
          partyLogo: (data.category || data.requestType || 'RQ').substring(0, 2).toUpperCase(),
          status: 'In Progress',
          statusIcon: 'clock',
          statusKind: 'info',
          statusSub: 'In Progress',
          dealValue: '—',
          agreementType: data.requestType || 'Request',
          termLength: '—',
          closeDate: '—',
          date: new Date().toLocaleDateString('en-GB'),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          action: 'Edit',
          documentsCount: 1,
          tasksCount: 1,
          tasksPending: 1,
        };
        setShowAgreementRequestModal(false);
        setSelectedAgreement(requestAgreement);
        setShowDealWorkspace(true);
        addNewAgreement(requestAgreement);
      }}
    />
    <PrepareScreen
      open={showRootPrepare}
      onClose={() => {
        setShowRootPrepare(false);
        setRootPreparePreselectedDocs([]);
        setPendingSignatureDoc(null);
      }}
      preselectedDocs={rootPreparePreselectedDocs}
      onSend={(documents, recipients) => {
        const recipientName = recipients && recipients.length > 0 ? recipients[0].name : '';
        const recipientNames = (recipients ?? []).map(r => r.name).filter(Boolean);

        // Signature sent from the global doc-preview header while an agreement
        // workspace is open: keep the workspace (name, documents, needs
        // attention) intact — only change the sent document's status and add a
        // Sign task. Do NOT create a new agreement space.
        if (pendingSignatureDoc) {
          const recipient = recipientName || 'Recipient';
          setWorkspaceSignatureDocs(prev => [...prev, { name: pendingSignatureDoc, recipient }]);
          setWorkspaceApprovalTasks(prev => [...prev, {
            id: `task-sign-${Date.now()}`,
            title: `Sign ${pendingSignatureDoc}`,
            type: 'Sign',
            team: 'External',
            assignee: recipient,
            assigneeInitials: recipient.split(' ').map(n => n[0]).join('').toUpperCase(),
            status: 'Not started',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
            isDueSoon: false,
          }]);
          setPendingSignatureDoc(null);
          setShowRootPrepare(false);
          setRootPreparePreselectedDocs([]);
          return;
        }

        // Check if this is an NDA flow (preselected docs contain NDA)
        const isNDAFlow = rootPreparePreselectedDocs.some(doc => doc.toLowerCase().includes('nda') || doc.toLowerCase().includes('non-disclosure'));
        
        if (isNDAFlow) {
          // NDA flow - mark as sent and add to agreements list. Reuse the id
          // minted in the NDA modal so we update that NDA rather than a shared one.
          setNdaRecipientName(recipientName);
          setNdaSentForSignature(true);
          const ndaId = ndaAgreementId ?? `nda-${Date.now()}`;
          setNdaDataById(prev => ({ ...prev, [ndaId]: { data: prev[ndaId]?.data ?? savedNDAData, sentForSignature: true, recipientName } }));
          const sentNdaAgreement: Agreement = {
            id: ndaId,
            entityKind: 'space',
            workspaceKind: 'nda',
            name: 'Untitled Agreement Space',
            documentNames: ['Non-Disclosure Agreement'],
            party: savedNDAData?.receivingParty || recipientName || 'Receiving Party',
            partyLogo: (savedNDAData?.receivingParty || recipientName || 'ND').substring(0, 2).toUpperCase(),
            externalParticipants: Array.from(new Set([
              ...(savedNDAData?.receivingParty ? [savedNDAData.receivingParty] : []),
              ...recipientNames,
            ])),
            status: 'In Progress',
            statusIcon: 'clock',
            statusKind: 'info',
            statusSub: 'Awaiting signature',
            dealValue: '—',
            agreementType: 'NDA',
            termLength: savedNDAData?.duration ? `${savedNDAData.duration} months` : '—',
            closeDate: savedNDAData?.effectiveDate || '—',
            date: new Date().toLocaleDateString('en-GB'),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            action: 'View',
            documentsCount: 1,
            tasksCount: 1,
            tasksPending: 1,
          };
          addNewAgreement(sentNdaAgreement);
          setSelectedAgreement(sentNdaAgreement);
          setShowDealWorkspace(true);
        } else {
          // Uploaded document flow - create a new agreement space
          const docName = documents && documents.length > 0 ? documents[0] : 'Non-Disclosure Agreement';

          // Simple Use Case: sending a Permission Slip creates a purpose-named
          // agreement space and drops the recipient party tag.
          const isPermissionSlipFlow = rootPreparePreselectedDocs.some(doc => doc === 'Permission Slip');

          // Store the uploaded document info under a unique id so each uploaded
          // document workspace persists independently.
          const newId = `uploaded-${Date.now()}`;
          setUploadedDocById(prev => ({ ...prev, [newId]: { documents: documents || [], recipientName } }));
          
          // Create a new agreement for the uploaded document
          const uploadedAgreement: Agreement = {
            id: newId,
            entityKind: 'space',
            workspaceKind: isPermissionSlipFlow ? 'permission-slip' : 'uploaded',
            name: isPermissionSlipFlow ? 'Permission for Museum' : 'Untitled Agreement Space',
            documentNames: documents && documents.length > 0 ? documents : [docName],
            party: recipientName || 'Recipient',
            partyLogo: recipientName ? recipientName.substring(0, 2).toUpperCase() : 'RC',
            externalParticipants: recipientNames,
            status: 'In Progress',
            statusIcon: 'clock',
            statusKind: 'info',
            statusSub: 'Awaiting signature',
            dealValue: '—',
            agreementType: 'Service Agreement',
            termLength: '12 months',
            closeDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            date: new Date().toLocaleDateString('en-GB'),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            action: 'View',
            documentsCount: documents?.length || 1,
            tasksCount: 1,
            tasksPending: 1,
          };
          
          setSelectedAgreement(uploadedAgreement);
          setShowDealWorkspace(true);
          addNewAgreement(uploadedAgreement);
        }
        
        setShowRootPrepare(false);
        setRootPreparePreselectedDocs([]);
      }}
    />
    </PrototypeVersionContext.Provider>
  );
}
