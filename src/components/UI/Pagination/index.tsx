import clsx from "clsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = () => {
    if (canGoPrevious && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  // Gera os números das páginas a serem exibidos
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Mostra todas as páginas se houver poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostra a primeira página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Páginas ao redor da atual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Sempre mostra a última página
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={clsx(styles.pagination, className)} aria-label="Paginação">
      <button
        type="button"
        className={clsx(styles.navButton, styles.previous)}
        onClick={handlePrevious}
        disabled={!canGoPrevious || disabled}
        aria-label="Página anterior"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size="1.25rem" />
        <span className={styles.navText}>Anterior</span>
      </button>

      <div className={styles.pageNumbers}>
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={clsx(styles.pageButton, {
                [styles.active]: page === currentPage,
              })}
              onClick={() => handlePageClick(page)}
              disabled={disabled}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className={clsx(styles.navButton, styles.next)}
        onClick={handleNext}
        disabled={!canGoNext || disabled}
        aria-label="Próxima página"
      >
        <span className={styles.navText}>Próxima</span>
        <HugeiconsIcon icon={ArrowRight01Icon} size="1.25rem" />
      </button>
    </nav>
  );
};

export default Pagination;
