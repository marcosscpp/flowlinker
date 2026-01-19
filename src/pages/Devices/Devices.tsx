import { useMemo, useState } from "react";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/hooks";
import styles from "./Devices.module.scss";
import {
  PageHeader,
  Badge,
  Toggler,
  Modal,
  ModalGhostButton,
  Button,
  Field,
  QueryState,
  SkeletonDevices,
} from "@/components";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import {
  devicesService,
  type DeviceResponse,
  type DeviceStatus,
  type DeviceConnectionStatus,
} from "@/services";
import { QUERY_KEYS } from "@/constants";

const statusDotClassMap: Record<
  Exclude<DeviceConnectionStatus, undefined>,
  string
> = {
  ONLINE: styles.statusOnline,
  IDLE: styles.statusIdle,
  OFFLINE: styles.statusOffline,
};

const fallbackStatus = (status: DeviceStatus): DeviceConnectionStatus =>
  status === "ACTIVE" ? "ONLINE" : "OFFLINE";

const connectionStatusLabels: Record<DeviceConnectionStatus, string> = {
  ONLINE: "online",
  IDLE: "ocioso",
  OFFLINE: "offline",
};

const statusLabels: Record<DeviceStatus, string> = {
  ACTIVE: "ativo",
  INACTIVE: "inativo",
};

const formatLastActivity = (timestamp?: string) => {
  if (!timestamp) {
    return "Não há registros de atividade";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Não há registros de atividade";
  }

  return formatDistanceToNow(date, {
    locale: ptBR,
    addSuffix: true,
  });
};

const buildDeviceTitle = (device: DeviceResponse) => {
  const baseName = device.hostName || device.name || "Dispositivo sem nome";
  const extras: string[] = [];

  if (device.osName) {
    extras.push(device.osName);
  }

  if (device.name && device.name !== baseName) {
    extras.push(device.name);
  }

  return extras.length ? `${baseName} • ${extras.join(" • ")}` : baseName;
};

const buildDeviceInfo = (device: DeviceResponse) => {
  const info: string[] = [];

  if (device.osName) {
    const os = device.osVersion
      ? `${device.osName} ${device.osVersion}`
      : device.osName;
    info.push(os);
  }

  if (device.appVersion) {
    info.push(`App ${device.appVersion}`);
  }

  if (device.deviceId) {
    info.push(`Host ${device.deviceId}`);
  } else if (device.fingerprint) {
    info.push(`Fingerprint ${device.fingerprint.slice(0, 6)}…`);
  }

  return info.join(" • ");
};

const Devices = () => {
  const queryClient = useQueryClient();
  const [pendingToggleId, setPendingToggleId] = useState<number | null>(null);
  const renameModal = useModal<DeviceResponse>();
  const [newDeviceName, setNewDeviceName] = useState("");

  const {
    data: devicesData,
    isLoading: loadingDevices,
    error: devicesError,
  } = useQuery({
    queryKey: [QUERY_KEYS.devices.list],
    queryFn: () => devicesService.list(),
    staleTime: 1000 * 60,
  });

  const {
    data: devicesCounts,
    isLoading: loadingCounts,
    error: countsError,
  } = useQuery({
    queryKey: [QUERY_KEYS.devices.counts],
    queryFn: () => devicesService.getCounts(),
    staleTime: 1000 * 60 * 5,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: DeviceStatus }) =>
      devicesService.updateStatus(id, { status }),
    onMutate: async (variables) => {
      setPendingToggleId(variables.id);
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.devices.list] });
      const previousDevices =
        queryClient.getQueryData<DeviceResponse[]>([QUERY_KEYS.devices.list]);

      queryClient.setQueryData<DeviceResponse[]>(
        [QUERY_KEYS.devices.list],
        (current = []) =>
          current.map((device) =>
            device.id === variables.id
              ? { ...device, status: variables.status }
              : device
          )
      );

      return { previousDevices };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDevices) {
        queryClient.setQueryData([QUERY_KEYS.devices.list], context.previousDevices);
      }
    },
    onSettled: () => {
      setPendingToggleId(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.devices.list] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.devices.counts] });
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      devicesService.updateName(id, { name }),
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData<DeviceResponse[]>(
        [QUERY_KEYS.devices.list],
        (current = []) =>
          current.map((device) =>
            device.id === updatedDevice.id ? updatedDevice : device
          )
      );
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.devices.list] });
      renameModal.close();
      setNewDeviceName("");
    },
  });

  const openRenameModal = (device: DeviceResponse) => {
    renameModal.openWith(device);
    setNewDeviceName(device.name || "");
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModal.data || !newDeviceName.trim()) return;
    updateNameMutation.mutate({
      id: renameModal.data.id,
      name: newDeviceName.trim(),
    });
  };

  const devices = devicesData ?? [];

  const badgeText = useMemo(() => {
    if (loadingCounts) {
      return "Carregando dispositivos...";
    }
    if (countsError) {
      return "Não foi possível carregar os dispositivos";
    }

    if (devicesCounts) {
      const active = devicesCounts.active;
      const allowed = devicesCounts.allowed || devicesCounts.total;
      return `${active}/${allowed} dispositivos conectados`;
    }

    return `${devices.length} dispositivo${
      devices.length === 1 ? "" : "s"
    } encontrado${devices.length === 1 ? "" : "s"}`;
  }, [devicesCounts, countsError, devices.length, loadingCounts]);

  return (
    <section className={styles.container}>
      <PageHeader
        title="Gerenciador de Dispositivos"
        subtitle="Este painel mostra os dispositivos com o Flowlinker instalado."
      />

      <Badge className={styles.counterBadge}>{badgeText}</Badge>

      <div className={styles.devicesList} data-tourid="devices-list">
        <QueryState
          isLoading={loadingDevices}
          error={devicesError}
          hasData={devices.length > 0}
          skeleton={<SkeletonDevices count={3} />}
          errorText="Não foi possível carregar os dispositivos. Tente novamente em instantes."
          emptyState="Nenhum dispositivo vinculado. Adicione um dispositivo para começar."
        >
          {devices.map((device) => {
          const rawConnectionStatus =
            device.connectionStatus || fallbackStatus(device.status);
          const statusLabel = device.connectionStatus
            ? connectionStatusLabels[rawConnectionStatus]
            : statusLabels[device.status];
          const isActive = device.status === "ACTIVE";
          const isUpdating = pendingToggleId === device.id;
          const deviceInfo = buildDeviceInfo(device);

          const isLimitReached =
            devicesCounts &&
            devicesCounts.active >= devicesCounts.allowed &&
            !isActive;

          const isTogglerDisabled = isUpdating || isLimitReached;

          return (
            <article key={device.id} className={styles.deviceCard}>
              <div className={styles.deviceStatus}>
                <span
                  className={clsx(
                    styles.statusDot,
                    statusDotClassMap[rawConnectionStatus]
                  )}
                  aria-label={`Status: ${statusLabel}`}
                />
                <div className={styles.statusTexts}>
                  <p className={clsx("body-lg-semibold", styles.deviceTitle)}>
                    {buildDeviceTitle(device)}
                  </p>
                  {deviceInfo ? (
                    <p className={clsx("body-sm", styles.deviceMeta)}>
                      {deviceInfo}
                    </p>
                  ) : null}
                  <p className={clsx("body-sm", styles.deviceSubtitle)}>
                    Última atividade: {formatLastActivity(device.lastSeenAt)}
                  </p>
                </div>
              </div>

              <div className={styles.deviceActions}>
                <button
                  type="button"
                  className={styles.actionButton}
                  aria-label={`Renomear ${device.name}`}
                  onClick={() => openRenameModal(device)}
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} size="2rem" />
                </button>
                <Toggler
                  checked={isActive}
                  disabled={isTogglerDisabled}
                  onChange={() => {
                    if (isLimitReached) return;

                    const nextStatus: DeviceStatus = isActive
                      ? "INACTIVE"
                      : "ACTIVE";
                    updateStatusMutation.mutate({
                      id: device.id,
                      status: nextStatus,
                    });
                  }}
                />
              </div>
            </article>
          );
        })}
        </QueryState>
      </div>

      <Modal
        isOpen={renameModal.isOpen}
        onClose={renameModal.close}
        title="Renomear dispositivo"
        footer={
          <>
            <ModalGhostButton
              onClick={renameModal.close}
              disabled={updateNameMutation.isPending}
            >
              Cancelar
            </ModalGhostButton>
            <Button
              type="submit"
              form="rename-device-form"
              isLoading={updateNameMutation.isPending}
              disabled={updateNameMutation.isPending}
            >
              Salvar
            </Button>
          </>
        }
      >
        <form
          id="rename-device-form"
          onSubmit={handleRenameSubmit}
          className={styles.modalForm}
        >
          <Field
            label="Nome do dispositivo"
            name="name"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            placeholder="Ex: Notebook Principal"
            required
          />
        </form>
      </Modal>
    </section>
  );
};

export default Devices;
