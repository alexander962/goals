'use client';

import styles from './SegmentedControl.module.scss';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  tone?: 'calm' | 'sport' | 'focus';
};

export function SegmentedControl<T extends string>({ value, options, onChange, tone = 'calm' }: Props<T>) {
  return (
    <div className={`${styles.control} ${styles[tone]}`}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={`${styles.option} ${value === option.value ? styles.active : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
