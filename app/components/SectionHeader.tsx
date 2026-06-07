import type { ReactNode } from 'react';
import styles from './SectionHeader.module.scss';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, children }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </header>
  );
}
