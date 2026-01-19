import clsx from "clsx";
import styles from "./FilterTabs.module.scss";

export type FilterOption<T extends string = string> = {
  value: T;
  label: string;
};

interface FilterTabsProps<T extends string = string> {
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

const FilterTabs = <T extends string = string>({
  options,
  value,
  onChange,
  className,
}: FilterTabsProps<T>) => {
  return (
    <div className={clsx(styles.container, className)}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={clsx(styles.tab, {
              [styles.active]: isActive,
            })}
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
          >
            {isActive && <span className={styles.indicator} />}
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
