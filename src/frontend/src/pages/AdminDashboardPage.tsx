import {
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  MinusCircle,
  PlusCircle,
  Search,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { DepositRequestStatus } from "../backend";
import {
  useAllDepositRequests,
  useApproveDepositRequest,
} from "../hooks/useQueries";

/* ─── Helpers ─────────────────────────────────────────────── */

function parseScreenshotNote(note: string): {
  txnId: string;
  fileName: string;
} {
  const txnMatch = note.match(/TxnID:\s*([^\s|]+)/);
  const fileMatch = note.match(/File:\s*(.+)$/);
  return {
    txnId: txnMatch ? txnMatch[1] : note,
    fileName: fileMatch ? fileMatch[1].trim() : "",
  };
}

/* ─── Status Badge ─────────────────────────────────────────── */

function StatusBadge({
  status,
  localRejected,
}: {
  status: DepositRequestStatus;
  localRejected: boolean;
}) {
  if (localRejected || status === DepositRequestStatus.rejected) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-orbitron font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
        <XCircle className="w-3 h-3" />
        Rejected
      </span>
    );
  }
  if (status === DepositRequestStatus.approved) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-orbitron font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">
        <CheckCircle className="w-3 h-3" />
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-orbitron font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
}

/* ─── Stat Card ────────────────────────────────────────────── */

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  glowColor: string;
  "data-ocid"?: string;
}

function StatCard({
  label,
  value,
  icon,
  color,
  borderColor,
  glowColor,
  "data-ocid": dataOcid,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-card-bg rounded-2xl border ${borderColor} px-5 py-5 overflow-hidden`}
      style={{
        boxShadow: `0 4px 24px oklch(0 0 0 / 0.5), 0 0 0 1px ${glowColor}`,
      }}
      data-ocid={dataOcid}
    >
      {/* Background glow blob */}
      <div
        className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl ${color}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-rajdhani text-xs uppercase tracking-widest text-muted-foreground mb-1">
            {label}
          </p>
          <p
            className={`font-orbitron font-black text-3xl tracking-tight ${color}`}
          >
            {value}
          </p>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} bg-current/10`}
          style={{ background: `${glowColor}18` }}
        >
          <span className={color}>{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Screenshot Lightbox ──────────────────────────────────── */

function ScreenshotLightbox({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full max-w-full max-h-full m-0 p-0 border-0"
      style={{ background: "rgba(0,0,0,0.85)" }}
      data-ocid="admin.screenshot_modal"
      aria-label="Screenshot preview"
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
        aria-label="Close screenshot"
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={onClose}
        data-ocid="admin.screenshot_modal.close_button"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neon-red/80 hover:bg-neon-red flex items-center justify-center text-white transition-colors z-10"
        aria-label="Close screenshot"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="relative z-10 max-w-3xl max-h-[90vh] px-4">
        <img
          src={url}
          alt="Payment screenshot"
          className="max-w-full max-h-[85vh] object-contain rounded-xl border border-neon-red/30 shadow-neon"
        />
      </div>
    </dialog>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export default function AdminDashboardPage() {
  const requestsQuery = useAllDepositRequests();
  const approveRequest = useApproveDepositRequest();

  // Local state
  const [approvingId, setApprovingId] = useState<bigint | null>(null);
  const [rejectedIds, setRejectedIds] = useState<Set<bigint>>(new Set());
  const [approvedIds, setApprovedIds] = useState<Set<bigint>>(new Set());
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // User management state
  const [userSearch, setUserSearch] = useState("");
  const [balanceAdjustments, setBalanceAdjustments] = useState<
    Map<string, number>
  >(new Map());
  const [adjustInputs, setAdjustInputs] = useState<Map<string, string>>(
    new Map(),
  );

  const requests = requestsQuery.data ?? [];

  /* ── Stats derivations ─── */
  const uniquePlayerNames = useMemo(() => {
    const names = new Set(requests.map((r) => r.playerName).filter(Boolean));
    return names;
  }, [requests]);

  const pendingCount = useMemo(() => {
    return requests.filter(
      (r) =>
        r.status === DepositRequestStatus.pending &&
        !rejectedIds.has(r.id) &&
        !approvedIds.has(r.id),
    ).length;
  }, [requests, rejectedIds, approvedIds]);

  const totalRevenue = useMemo(() => {
    return requests
      .filter(
        (r) =>
          r.status === DepositRequestStatus.approved || approvedIds.has(r.id),
      )
      .reduce((sum, r) => sum + Number(r.amount), 0);
  }, [requests, approvedIds]);

  /* ── Handlers ─── */
  const handleApprove = async (requestId: bigint) => {
    setApprovingId(requestId);
    try {
      await approveRequest.mutateAsync(requestId);
      setApprovedIds((prev) => new Set([...prev, requestId]));
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = (requestId: bigint) => {
    setRejectedIds((prev) => new Set([...prev, requestId]));
  };

  const isLocallyRejected = (id: bigint) => rejectedIds.has(id);
  const isLocallyApproved = (id: bigint) => approvedIds.has(id);

  const isEffectivelyPending = (req: {
    id: bigint;
    status: DepositRequestStatus;
  }) =>
    req.status === DepositRequestStatus.pending &&
    !isLocallyRejected(req.id) &&
    !isLocallyApproved(req.id);

  /* ── User Management ─── */
  const uniquePlayers = useMemo(() => {
    const playerMap = new Map<
      string,
      { name: string; approvedBalance: number }
    >();
    for (const req of requests) {
      if (!req.playerName) continue;
      const existing = playerMap.get(req.playerName) ?? {
        name: req.playerName,
        approvedBalance: 0,
      };
      if (
        req.status === DepositRequestStatus.approved ||
        approvedIds.has(req.id)
      ) {
        existing.approvedBalance += Number(req.amount);
      }
      playerMap.set(req.playerName, existing);
    }
    return Array.from(playerMap.values());
  }, [requests, approvedIds]);

  const filteredPlayers = useMemo(() => {
    if (!userSearch.trim()) return [];
    const q = userSearch.trim().toLowerCase();
    return uniquePlayers.filter((p) => p.name.toLowerCase().includes(q));
  }, [uniquePlayers, userSearch]);

  const getPlayerBalance = (name: string, baseBalance: number) => {
    const adj = balanceAdjustments.get(name) ?? 0;
    return Math.max(0, baseBalance + adj);
  };

  const handleAddBalance = (playerName: string) => {
    const inputVal = Number(adjustInputs.get(playerName) ?? "0");
    if (Number.isNaN(inputVal) || inputVal <= 0) return;
    setBalanceAdjustments((prev) => {
      const next = new Map(prev);
      next.set(playerName, (next.get(playerName) ?? 0) + inputVal);
      return next;
    });
  };

  const handleDeductBalance = (playerName: string, baseBalance: number) => {
    const inputVal = Number(adjustInputs.get(playerName) ?? "0");
    if (Number.isNaN(inputVal) || inputVal <= 0) return;
    setBalanceAdjustments((prev) => {
      const next = new Map(prev);
      const current = next.get(playerName) ?? 0;
      const newAdj = current - inputVal;
      // Clamp so total balance doesn't go below 0
      const totalAfter = baseBalance + newAdj;
      next.set(playerName, totalAfter < 0 ? -baseBalance : newAdj);
      return next;
    });
  };

  /* ── Render ─── */
  return (
    <main className="pt-16 min-h-screen bg-dark-bg" data-ocid="admin.page">
      {/* Screenshot Lightbox */}
      <AnimatePresence>
        {lightboxUrl && (
          <ScreenshotLightbox
            url={lightboxUrl}
            onClose={() => setLightboxUrl(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-1 h-9 bg-neon-red rounded-full"
              style={{ boxShadow: "0 0 8px oklch(0.55 0.22 25 / 0.8)" }}
            />
            <ShieldCheck className="w-7 h-7 text-neon-red" />
            <h1 className="font-orbitron font-black text-2xl sm:text-3xl uppercase tracking-widest text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <p className="font-rajdhani text-sm text-muted-foreground ml-4 uppercase tracking-wider">
            Elite Gaming Hub — Control Panel
          </p>
        </motion.div>

        {/* ── Stats Overview ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <StatCard
            label="Total Users"
            value={uniquePlayerNames.size}
            icon={<Users className="w-5 h-5" />}
            color="text-neon-red"
            borderColor="border-neon-red/25"
            glowColor="oklch(0.55 0.22 25)"
            data-ocid="admin.stat.total_users.card"
          />
          <StatCard
            label="Pending Requests"
            value={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            color="text-amber-400"
            borderColor="border-amber-500/25"
            glowColor="oklch(0.75 0.18 85)"
            data-ocid="admin.stat.pending_requests.card"
          />
          <StatCard
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            icon={<TrendingUp className="w-5 h-5" />}
            color="text-emerald-400"
            borderColor="border-emerald-500/25"
            glowColor="oklch(0.7 0.18 145)"
            data-ocid="admin.stat.total_revenue.card"
          />
          <StatCard
            label="Active Tournaments"
            value={3}
            icon={<Trophy className="w-5 h-5" />}
            color="text-cyan-400"
            borderColor="border-cyan-500/25"
            glowColor="oklch(0.75 0.15 200)"
            data-ocid="admin.stat.active_tournaments.card"
          />
        </motion.div>

        {/* ── Deposit Requests Section ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-0.5 h-5 bg-neon-red rounded-full"
              style={{ boxShadow: "0 0 6px oklch(0.55 0.22 25 / 0.7)" }}
            />
            <FileText className="w-4 h-4 text-neon-red" />
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-widest text-foreground">
              Deposit Requests
            </h2>
            {requestsQuery.isFetching && (
              <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin ml-1" />
            )}
          </div>

          {/* Loading */}
          {requestsQuery.isLoading && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              data-ocid="admin.loading_state"
            >
              <Loader2 className="w-9 h-9 text-neon-red animate-spin" />
              <p className="font-orbitron text-xs uppercase tracking-widest text-muted-foreground">
                Loading Requests…
              </p>
            </div>
          )}

          {/* Error */}
          {requestsQuery.isError && (
            <div
              className="flex flex-col items-center justify-center py-20 gap-3"
              data-ocid="admin.error_state"
            >
              <XCircle className="w-9 h-9 text-neon-red/60" />
              <p className="font-orbitron text-xs uppercase tracking-widest text-muted-foreground">
                Failed to load requests
              </p>
            </div>
          )}

          {/* Empty */}
          {!requestsQuery.isLoading &&
            !requestsQuery.isError &&
            requests.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 gap-4 bg-card-bg rounded-2xl border border-neon-red/15"
                data-ocid="admin.empty_state"
              >
                <div className="w-14 h-14 rounded-full bg-neon-red/10 border border-neon-red/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-neon-red/50" />
                </div>
                <div className="text-center">
                  <p className="font-orbitron font-bold text-sm uppercase tracking-widest text-foreground mb-1">
                    No Requests Yet
                  </p>
                  <p className="font-rajdhani text-sm text-muted-foreground">
                    Deposit requests will appear here once players submit them.
                  </p>
                </div>
              </motion.div>
            )}

          {/* Requests Table */}
          {!requestsQuery.isLoading && requests.length > 0 && (
            <>
              {/* Desktop */}
              <div
                className="hidden md:block bg-card-bg rounded-2xl overflow-hidden border border-neon-red/20"
                data-ocid="admin.requests.table"
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neon-red/15">
                      {[
                        "#",
                        "Player Name",
                        "Amount",
                        "Screenshot Proof",
                        "Status",
                        "Action",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-5 py-4 text-left font-orbitron text-xs uppercase tracking-widest text-muted-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {requests.map((req, index) => {
                        const isApproving = approvingId === req.id;
                        const localRejected = isLocallyRejected(req.id);
                        const localApproved = isLocallyApproved(req.id);
                        const isPending = isEffectivelyPending(req);
                        const rowIndex = index + 1;

                        return (
                          <motion.tr
                            key={String(req.id)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{
                              duration: 0.25,
                              delay: index * 0.04,
                            }}
                            className="border-b border-neon-red/10 last:border-0 hover:bg-neon-red/5 transition-colors duration-150"
                            data-ocid={`admin.requests.item.${rowIndex}`}
                          >
                            {/* # */}
                            <td className="px-5 py-4">
                              <span className="font-orbitron text-xs text-muted-foreground">
                                #{rowIndex}
                              </span>
                            </td>

                            {/* Player Name */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-neon-red/15 border border-neon-red/25 flex items-center justify-center flex-shrink-0">
                                  <span className="font-orbitron font-bold text-xs text-neon-red">
                                    {(req.playerName || "?")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-rajdhani font-semibold text-sm text-foreground">
                                  {req.playerName || "—"}
                                </span>
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="px-5 py-4">
                              <span className="font-orbitron font-bold text-base text-neon-red">
                                ₹{String(req.amount)}
                              </span>
                            </td>

                            {/* Screenshot Proof */}
                            <td className="px-5 py-4">
                              {req.screenshotUrl ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setLightboxUrl(req.screenshotUrl)
                                  }
                                  className="group relative w-14 h-14 rounded-lg overflow-hidden border border-neon-red/30 hover:border-neon-red transition-all duration-200 cursor-pointer"
                                  aria-label="View screenshot"
                                  data-ocid={`admin.screenshot_thumbnail.${rowIndex}`}
                                >
                                  <img
                                    src={req.screenshotUrl}
                                    alt="Payment screenshot"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                    <span className="text-white text-xs font-orbitron uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                      View
                                    </span>
                                  </div>
                                </button>
                              ) : (
                                <span className="font-rajdhani text-xs text-muted-foreground/40">
                                  No file
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-4">
                              <StatusBadge
                                status={
                                  localApproved
                                    ? DepositRequestStatus.approved
                                    : req.status
                                }
                                localRejected={localRejected}
                              />
                            </td>

                            {/* Action */}
                            <td className="px-5 py-4">
                              {isPending ? (
                                <div className="flex items-center gap-2">
                                  {/* Approve */}
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(req.id)}
                                    disabled={
                                      isApproving || approveRequest.isPending
                                    }
                                    data-ocid={`admin.approve_button.${rowIndex}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-orbitron font-bold text-xs uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                      boxShadow:
                                        "0 0 8px oklch(0.6 0.18 145 / 0.4)",
                                    }}
                                  >
                                    {isApproving ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Wait…
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Approve
                                      </>
                                    )}
                                  </button>
                                  {/* Reject */}
                                  <button
                                    type="button"
                                    onClick={() => handleReject(req.id)}
                                    disabled={
                                      isApproving || approveRequest.isPending
                                    }
                                    data-ocid={`admin.reject_button.${rowIndex}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-orbitron font-bold text-xs uppercase tracking-wider bg-red-700/80 text-white hover:bg-red-600 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                      boxShadow:
                                        "0 0 8px oklch(0.5 0.2 25 / 0.35)",
                                    }}
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="font-rajdhani text-xs text-muted-foreground/40 uppercase tracking-wider">
                                  —
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div
                className="md:hidden space-y-3"
                data-ocid="admin.requests.table"
              >
                <AnimatePresence>
                  {requests.map((req, index) => {
                    const isApproving = approvingId === req.id;
                    const localRejected = isLocallyRejected(req.id);
                    const localApproved = isLocallyApproved(req.id);
                    const isPending = isEffectivelyPending(req);
                    const rowIndex = index + 1;
                    const parsed = parseScreenshotNote(req.screenshotNote);

                    return (
                      <motion.div
                        key={String(req.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className="relative bg-card-bg rounded-xl overflow-hidden border border-neon-red/20"
                        data-ocid={`admin.requests.item.${rowIndex}`}
                      >
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />
                        <div className="px-4 py-4 space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-neon-red/15 border border-neon-red/25 flex items-center justify-center flex-shrink-0">
                                <span className="font-orbitron font-bold text-xs text-neon-red">
                                  {(req.playerName || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-rajdhani font-bold text-base text-foreground leading-tight">
                                  {req.playerName || "Unknown"}
                                </p>
                                <p className="font-orbitron text-xs text-muted-foreground">
                                  #{rowIndex}
                                </p>
                              </div>
                            </div>
                            <StatusBadge
                              status={
                                localApproved
                                  ? DepositRequestStatus.approved
                                  : req.status
                              }
                              localRejected={localRejected}
                            />
                          </div>

                          {/* Amount + TxnID */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                Amount
                              </p>
                              <p className="font-orbitron font-bold text-lg text-neon-red">
                                ₹{String(req.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                Txn ID
                              </p>
                              <p className="font-rajdhani text-sm text-foreground truncate">
                                {parsed.txnId || "—"}
                              </p>
                            </div>
                          </div>

                          {/* Screenshot */}
                          {req.screenshotUrl && (
                            <button
                              type="button"
                              onClick={() => setLightboxUrl(req.screenshotUrl)}
                              className="group relative w-full h-28 rounded-lg overflow-hidden border border-neon-red/30 hover:border-neon-red transition-all duration-200 cursor-pointer"
                              aria-label="View screenshot"
                              data-ocid={`admin.screenshot_thumbnail.${rowIndex}`}
                            >
                              <img
                                src={req.screenshotUrl}
                                alt="Payment screenshot"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                                <span className="text-white text-sm font-orbitron uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Full
                                </span>
                              </div>
                            </button>
                          )}

                          {/* Action Buttons */}
                          {isPending && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id)}
                                disabled={
                                  isApproving || approveRequest.isPending
                                }
                                data-ocid={`admin.approve_button.${rowIndex}`}
                                className="flex-1 py-2.5 rounded-md font-orbitron font-bold text-xs uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-500 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                style={{
                                  boxShadow:
                                    "0 0 8px oklch(0.6 0.18 145 / 0.4)",
                                }}
                              >
                                {isApproving ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Wait…
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Approve
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(req.id)}
                                disabled={
                                  isApproving || approveRequest.isPending
                                }
                                data-ocid={`admin.reject_button.${rowIndex}`}
                                className="flex-1 py-2.5 rounded-md font-orbitron font-bold text-xs uppercase tracking-wider bg-red-700/80 text-white hover:bg-red-600 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* ── User Management Section ── */}
        <div data-ocid="admin.user_management.section">
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-0.5 h-5 bg-neon-red rounded-full"
              style={{ boxShadow: "0 0 6px oklch(0.55 0.22 25 / 0.7)" }}
            />
            <Users className="w-4 h-4 text-neon-red" />
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-widest text-foreground">
              User Management
            </h2>
            <div className="flex-1 h-px bg-neon-red/15" />
          </div>

          <p className="font-rajdhani text-sm text-muted-foreground mb-5">
            Search a player by name to view and manually adjust their wallet
            balance.
          </p>

          {/* Search Input */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search player by name…"
              data-ocid="admin.user_management.search_input"
              className="w-full bg-card-bg border border-neon-red/25 rounded-xl pl-10 pr-4 py-3 font-rajdhani text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-red/40 focus:border-neon-red/50 transition-all"
            />
          </div>

          {/* Empty state: no search yet */}
          {!userSearch.trim() && (
            <div
              className="flex flex-col items-center justify-center py-14 gap-3 bg-card-bg rounded-2xl border border-neon-red/10"
              data-ocid="admin.user_management.empty_state"
            >
              <div className="w-12 h-12 rounded-full bg-neon-red/10 border border-neon-red/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-neon-red/40" />
              </div>
              <p className="font-rajdhani text-sm text-muted-foreground">
                Enter a player name to search
              </p>
            </div>
          )}

          {/* No results */}
          {userSearch.trim() && filteredPlayers.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-14 gap-3 bg-card-bg rounded-2xl border border-neon-red/10"
              data-ocid="admin.user_management.empty_state"
            >
              <div className="w-12 h-12 rounded-full bg-neon-red/10 border border-neon-red/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-neon-red/40" />
              </div>
              <p className="font-rajdhani text-sm text-muted-foreground">
                No players found for "
                <span className="text-foreground">{userSearch}</span>"
              </p>
            </div>
          )}

          {/* Player Cards */}
          {filteredPlayers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredPlayers.map((player, index) => {
                  const currentBalance = getPlayerBalance(
                    player.name,
                    player.approvedBalance,
                  );
                  const inputVal = adjustInputs.get(player.name) ?? "";
                  const playerIndex = index + 1;

                  return (
                    <motion.div
                      key={player.name}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2, delay: index * 0.06 }}
                      className="bg-card-bg rounded-2xl border border-neon-red/20 overflow-hidden"
                      data-ocid={`admin.user_management.item.${playerIndex}`}
                    >
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-neon-red/60 to-transparent" />
                      <div className="px-5 py-5 space-y-4">
                        {/* Player Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neon-red/15 border border-neon-red/30 flex items-center justify-center flex-shrink-0">
                            <span className="font-orbitron font-bold text-sm text-neon-red">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p
                              className="font-rajdhani font-bold text-base text-foreground truncate"
                              title={player.name}
                            >
                              {player.name}
                            </p>
                            <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                              Player
                            </p>
                          </div>
                        </div>

                        {/* Balance */}
                        <div className="flex items-center justify-between bg-dark-bg rounded-xl px-4 py-3 border border-neon-red/10">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-neon-red/60" />
                            <span className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                              Balance
                            </span>
                          </div>
                          <span className="font-orbitron font-bold text-lg text-neon-red">
                            ₹{currentBalance.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Manual Adjustment */}
                        <div>
                          <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            Manual Adjustment
                          </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={inputVal}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAdjustInputs((prev) => {
                                  const next = new Map(prev);
                                  next.set(player.name, val);
                                  return next;
                                });
                              }}
                              placeholder="Amount ₹"
                              data-ocid={`admin.user_management.amount_input.${playerIndex}`}
                              className="flex-1 min-w-0 bg-dark-bg border border-neon-red/20 rounded-lg px-3 py-2 font-rajdhani text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-neon-red/40 focus:border-neon-red/40 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddBalance(player.name)}
                              data-ocid={`admin.user_management.add_button.${playerIndex}`}
                              className="w-9 h-9 flex-shrink-0 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/35 hover:border-emerald-500/50 transition-all active:scale-90 flex items-center justify-center"
                              title="Add balance"
                              aria-label="Add balance"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeductBalance(
                                  player.name,
                                  player.approvedBalance,
                                )
                              }
                              data-ocid={`admin.user_management.deduct_button.${playerIndex}`}
                              className="w-9 h-9 flex-shrink-0 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/35 hover:border-red-500/50 transition-all active:scale-90 flex items-center justify-center"
                              title="Deduct balance"
                              aria-label="Deduct balance"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-rajdhani text-xs text-muted-foreground/60 mt-1.5">
                            Enter amount then click + or −
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-neon-red/10 text-center">
          <p className="font-rajdhani text-xs text-muted-foreground/50">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-red/60 hover:text-neon-red transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
