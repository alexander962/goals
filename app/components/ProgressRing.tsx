'use client';

import { motion } from 'framer-motion';
import styles from './ProgressRing.module.scss';

type Props = {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
};

export function ProgressRing({ value, size = 132, stroke = 12, label, color = '#18a999' }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={styles.ring} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <motion.circle
          className={styles.value}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className={styles.content}>
        <strong>{value}%</strong>
        {label ? <span>{label}</span> : null}
      </div>
    </div>
  );
}
