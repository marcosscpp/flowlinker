import { useState, useCallback } from "react";

/**
 * Hook para gerenciar estado de modais de forma padronizada.
 *
 * @example
 * // Modal simples (boolean)
 * const confirmModal = useModal();
 * <button onClick={confirmModal.open}>Abrir</button>
 * <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.close} />
 *
 * @example
 * // Modal com dados (ex: item para deletar/editar)
 * const deleteModal = useModal<User>();
 * <button onClick={() => deleteModal.openWith(user)}>Deletar</button>
 * <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close}>
 *   Deletar {deleteModal.data?.name}?
 * </Modal>
 */
export function useModal<T = undefined>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const openWith = useCallback((item: T) => {
    setData(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setData(null);
      }
      return !prev;
    });
  }, []);

  return {
    /** Se o modal está aberto */
    isOpen,
    /** Dados associados ao modal (ex: item sendo editado/deletado) */
    data,
    /** Abre o modal */
    open,
    /** Abre o modal com dados associados */
    openWith,
    /** Fecha o modal e limpa os dados */
    close,
    /** Alterna o estado do modal */
    toggle,
  };
}

export type UseModalReturn<T = undefined> = ReturnType<typeof useModal<T>>;
