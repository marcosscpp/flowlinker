import type { ReactNode } from "react";
import clsx from "clsx";
import { ListLoader } from "@/components";
import styles from "./QueryState.module.scss";

/**
 * Estado de uma query do React Query
 */
export interface QueryStateProps {
  /** Se está carregando (primeira carga) */
  isLoading: boolean;
  /** Erro da query */
  error: Error | null;
  /** Se tem dados */
  hasData: boolean;
  /** Conteúdo quando tem dados */
  children: ReactNode;
  /** Texto exibido durante loading (ignorado se skeleton for fornecido) */
  loadingText?: string;
  /** Componente skeleton customizado para loading */
  skeleton?: ReactNode;
  /** Texto exibido quando há erro */
  errorText?: string;
  /** Conteúdo/texto exibido quando não há dados */
  emptyState?: ReactNode;
  /** Classe CSS adicional para o container */
  className?: string;
  /** Classe CSS para o empty state */
  emptyClassName?: string;
}

/**
 * Componente que padroniza a exibição de estados de queries (loading, error, empty, success).
 *
 * @example
 * ```tsx
 * <QueryState
 *   isLoading={isLoading}
 *   error={error}
 *   hasData={items.length > 0}
 *   loadingText="Carregando itens"
 *   errorText="Não foi possível carregar os itens"
 *   emptyState="Nenhum item encontrado"
 * >
 *   {items.map(item => <ItemCard key={item.id} item={item} />)}
 * </QueryState>
 * ```
 */
const QueryState = ({
  isLoading,
  error,
  hasData,
  children,
  loadingText = "Carregando",
  skeleton,
  errorText = "Não foi possível carregar os dados. Tente novamente em instantes.",
  emptyState = "Nenhum dado encontrado.",
  className,
  emptyClassName,
}: QueryStateProps) => {
  // Estado de loading - usa skeleton customizado se fornecido
  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return (
      <div className={clsx(styles.stateContainer, className)}>
        <ListLoader text={loadingText} />
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className={clsx(styles.stateContainer, styles.errorState, className)}>
        <p className="body-sm">{errorText}</p>
      </div>
    );
  }

  // Estado vazio
  if (!hasData) {
    return (
      <div className={clsx(styles.stateContainer, styles.emptyState, emptyClassName || className)}>
        {typeof emptyState === "string" ? (
          <p className="body-sm">{emptyState}</p>
        ) : (
          emptyState
        )}
      </div>
    );
  }

  // Estado com dados
  return <>{children}</>;
};

export default QueryState;
