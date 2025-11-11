import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Loader.module.scss';

export type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  size?: LoaderSize;
}

const Loader = ({ className, size = 'md', ...props }: LoaderProps) => {
  return (
    <span
      aria-label="loading"
      role="status"
      className={clsx(styles.loader, styles[`size-${size}`], className)}
      {...props}
    />
  );
};

export default Loader;
