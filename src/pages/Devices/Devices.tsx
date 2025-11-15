import { useMemo, useState } from "react";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Devices.module.scss";
import { PageHeader, Badge, Toggler } from "@/components";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import {
  devicesService,
  type DeviceResponse,
  type DeviceStatus,
  type DeviceConnectionStatus,
} from "@/services";

const DEVICES_QUERY_KEY = ["devices"];
const DEVICE_COUNTS_QUERY_KEY = ["devicesCounts"];

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

  const {
    data: devicesData,
    isLoading: loadingDevices,
    error: devicesError,
  } = useQuery({
    queryKey: DEVICES_QUERY_KEY,
    queryFn: () => devicesService.list(),
    staleTime: 1000 * 60,
  });

  const {
    data: devicesCounts,
    isLoading: loadingCounts,
    error: countsError,
  } = useQuery({
    queryKey: DEVICE_COUNTS_QUERY_KEY,
    queryFn: () => devicesService.getCounts(),
    staleTime: 1000 * 60 * 5,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: DeviceStatus }) =>
      devicesService.updateStatus(id, { status }),
    onMutate: async (variables) => {
      setPendingToggleId(variables.id);
      await queryClient.cancelQueries({ queryKey: DEVICES_QUERY_KEY });
      const previousDevices =
        queryClient.getQueryData<DeviceResponse[]>(DEVICES_QUERY_KEY);

      queryClient.setQueryData<DeviceResponse[]>(
        DEVICES_QUERY_KEY,
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
        queryClient.setQueryData(DEVICES_QUERY_KEY, context.previousDevices);
      }
    },
    onSettled: () => {
      setPendingToggleId(null);
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEVICE_COUNTS_QUERY_KEY });
    },
  });

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

      <div className={styles.devicesList}>
        {loadingDevices && (
          <p className="body-sm">Carregando dispositivos cadastrados...</p>
        )}

        {devicesError && (
          <p className="body-sm">
            Não foi possível carregar os dispositivos. Tente novamente em
            instantes.
          </p>
        )}

        {!loadingDevices && !devicesError && devices.length === 0 && (
          <p className="body-sm">
            Nenhum dispositivo vinculado. Adicione um dispositivo para começar.
          </p>
        )}

        {devices.map((device) => {
          const rawConnectionStatus =
            device.connectionStatus || fallbackStatus(device.status);
          const statusLabel = device.connectionStatus
            ? connectionStatusLabels[rawConnectionStatus]
            : statusLabels[device.status];
          const isActive = device.status === "ACTIVE";
          const isUpdating = pendingToggleId === device.id;
          const deviceInfo = buildDeviceInfo(device);

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
                  aria-label={`Editar ${device.name}`}
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} size="2rem" />
                </button>
                <Toggler
                  checked={isActive}
                  disabled={isUpdating}
                  onChange={() => {
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
      </div>
    </section>
  );
};

export default Devices;
