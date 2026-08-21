import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './SegmentedControl.module.css';

export interface SegmentedControlOption {
  /** Unique value for the segment */
  value: string;
  /** Visible label. Optional when using an icon-only segment. */
  label?: string;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Accessible name — required when the segment is icon-only */
  accessibilityText?: string;
  /** Whether this segment is disabled */
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** The available segments */
  options: SegmentedControlOption[];
  /** The currently selected value (controlled) */
  value: string;
  /** Called when the selection changes */
  onChange: (value: string) => void;
  /** Required accessible name for the group */
  accessibilityText: string;
  /** Stretch the control to fill its container, with segments sharing width equally */
  fullWidth?: boolean;
  /** Additional className applied to the track */
  className?: string;
}

/**
 * Segmented Control — allows selecting a single option from two or more,
 * typically used to switch between views of the same content (e.g. Activity /
 * Details). Uses radiogroup semantics with roving-tabindex keyboard support.
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  accessibilityText,
  fullWidth = false,
  className,
}) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusable = options
    .map((o, i) => (o.disabled ? -1 : i))
    .filter((i) => i !== -1);

  const moveSelection = (fromIndex: number, dir: 1 | -1) => {
    if (focusable.length === 0) return;
    const pos = focusable.indexOf(fromIndex);
    const nextPos = (pos + dir + focusable.length) % focusable.length;
    const nextIndex = focusable[nextPos];
    refs.current[nextIndex]?.focus();
    onChange(options[nextIndex].value);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelection(index, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelection(index, -1);
    }
  };

  return (
    <div
      data-ink-component="SegmentedControl"
      role="radiogroup"
      aria-label={accessibilityText}
      className={cn(styles.track, fullWidth && styles.fullWidth, className)}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const iconOnly = !option.label && !!option.icon;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={iconOnly ? option.accessibilityText : undefined}
            disabled={option.disabled}
            tabIndex={isSelected || (!options.some((o) => o.value === value) && index === 0) ? 0 : -1}
            className={cn(
              styles.segment,
              isSelected && styles.selected,
              option.disabled && styles.disabled
            )}
            onClick={() => !option.disabled && onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = 'SegmentedControl';
