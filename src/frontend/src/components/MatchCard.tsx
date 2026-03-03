import { useDeductEntryFee, useWalletBalance } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Hash,
  Loader2,
  Trophy,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface MatchCardProps {
  matchId: number;
  gameMode: string;
  entryFee: number;
  prizePool: number;
  status: string;
  animationDelay?: number;
}

type ModalState = "none" | "insufficient" | "success";

export default function MatchCard({
  matchId,
  gameMode,
  entryFee,
  prizePool,
  status,
  animationDelay = 0,
}: MatchCardProps) {
  const isOpen = status === "Open";
  const isSolo = gameMode.toLowerCase().includes("solo");
  const navigate = useNavigate();
  const { data: balance, refetch: refetchBalance } = useWalletBalance();
  const { mutateAsync: deductEntryFee } = useDeductEntryFee();

  const [isChecking, setIsChecking] = useState(false);
  const [modalState, setModalState] = useState<ModalState>("none");
  const [currentBalance, setCurrentBalance] = useState<bigint>(BigInt(0));

  // Success / Registration form state
  const [inGameName, setInGameName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [formError, setFormError] = useState("");

  const handleJoinNow = async () => {
    setIsChecking(true);
    try {
      const result = await refetchBalance();
      const latestBalance = result.data ?? balance ?? BigInt(0);
      setCurrentBalance(latestBalance);

      if (latestBalance >= BigInt(entryFee)) {
        // Sufficient — deduct fee
        const deductResult = await deductEntryFee({
          matchId: BigInt(matchId),
          amount: BigInt(entryFee),
        });
        if (deductResult.ok) {
          // Refresh balance in state for modal display
          setCurrentBalance(deductResult.newBalance);
          setModalState("success");
        } else {
          // Deduction failed (e.g. race condition)
          setModalState("insufficient");
        }
      } else {
        // Insufficient balance
        setModalState("insufficient");
      }
    } catch {
      setModalState("insufficient");
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmRegistration = () => {
    if (!inGameName.trim()) {
      setFormError("Please enter your In-Game Name.");
      return;
    }
    if (!playerId.trim()) {
      setFormError("Please enter your Player ID.");
      return;
    }
    // Successfully registered — close modal and reset
    setModalState("none");
    setInGameName("");
    setPlayerId("");
    setFormError("");
  };

  const handleCloseModal = () => {
    setModalState("none");
    setInGameName("");
    setPlayerId("");
    setFormError("");
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.88, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 340, damping: 28 },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      y: 16,
      transition: { duration: 0.18, ease: "easeIn" as const },
    },
  };

  return (
    <>
      <article
        className="relative bg-card-bg rounded-lg overflow-hidden neon-border hover:shadow-neon transition-all duration-300 group slide-in"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />

        {/* Card Header */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-neon-red">
              {isSolo ? (
                <User className="w-4 h-4" />
              ) : (
                <Users className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm sm:text-base uppercase tracking-wider text-foreground group-hover:text-neon-red-bright transition-colors duration-200">
                Free Fire {gameMode}
              </h3>
              <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-widest">
                Match #{matchId}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-xs font-orbitron font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase ${
              isOpen
                ? "bg-neon-red/15 text-neon-red border border-neon-red/40"
                : "bg-foreground/5 text-muted-foreground border border-foreground/10"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-neon-red/20 to-transparent" />

        {/* Stats */}
        <div className="px-4 py-3 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-foreground/5 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-neon-red/70" />
            </div>
            <div>
              <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider leading-none">
                Entry Fee
              </p>
              <p className="font-orbitron font-bold text-sm text-foreground leading-tight">
                ₹{entryFee}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-neon-red/10 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-neon-red" />
            </div>
            <div>
              <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider leading-none">
                Prize Pool
              </p>
              <p className="font-orbitron font-bold text-sm text-neon-red-bright leading-tight neon-text">
                ₹{prizePool}
              </p>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={!isOpen || isChecking}
            onClick={isOpen && !isChecking ? handleJoinNow : undefined}
            className={`w-full py-2.5 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
              isOpen
                ? "bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                : "bg-foreground/5 text-muted-foreground cursor-not-allowed border border-foreground/10"
            }`}
            aria-label={
              isOpen ? `Join Free Fire ${gameMode} match` : "Match closed"
            }
            data-ocid={`match_card.join_button.${matchId}`}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : isOpen ? (
              <>
                <Zap className="w-4 h-4" fill="currentColor" />
                Join Now
              </>
            ) : (
              "Closed"
            )}
          </button>
        </div>
      </article>

      {/* ─── Modals (rendered in portal-like fashion via AnimatePresence) ─── */}
      <AnimatePresence>
        {/* ── Insufficient Balance Modal ── */}
        {modalState === "insufficient" && (
          <motion.div
            key="insufficient-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
            data-ocid="match_card.insufficient_modal"
            aria-labelledby="insufficient-modal-title"
          >
            <motion.div
              key="insufficient-card"
              className="relative w-full max-w-sm bg-card-bg rounded-xl overflow-hidden"
              style={{
                border: "1px solid oklch(0.55 0.22 25 / 0.7)",
                boxShadow:
                  "0 0 40px oklch(0.55 0.22 25 / 0.25), 0 20px 60px rgba(0,0,0,0.6)",
              }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Top neon-red accent line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />

              {/* Close button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-3 right-3 w-7 h-7 rounded-md bg-foreground/5 hover:bg-neon-red/15 flex items-center justify-center text-muted-foreground hover:text-neon-red transition-colors duration-150"
                aria-label="Close modal"
                data-ocid="match_card.insufficient_cancel_button"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center gap-4">
                {/* Warning icon */}
                <div className="w-14 h-14 rounded-full bg-neon-red/10 border border-neon-red/30 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-neon-red" />
                </div>

                {/* Title */}
                <div>
                  <h2
                    id="insufficient-modal-title"
                    className="font-orbitron font-bold text-lg uppercase tracking-wider text-foreground"
                  >
                    Insufficient Balance
                  </h2>
                  <p className="font-rajdhani text-sm text-muted-foreground mt-1 leading-relaxed">
                    Recharge your wallet to join this match.
                  </p>
                </div>

                {/* Balance context */}
                <div className="w-full rounded-lg bg-foreground/5 border border-foreground/10 px-4 py-3 grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                      Your Balance
                    </p>
                    <p className="font-orbitron font-bold text-sm text-foreground mt-0.5">
                      ₹{Number(currentBalance)}
                    </p>
                  </div>
                  <div className="text-center border-l border-foreground/10">
                    <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                      Entry Fee
                    </p>
                    <p className="font-orbitron font-bold text-sm text-neon-red mt-0.5">
                      ₹{entryFee}
                    </p>
                  </div>
                </div>

                {/* Shortfall callout */}
                <p className="font-rajdhani text-xs text-neon-red/80 bg-neon-red/8 border border-neon-red/20 rounded-md px-3 py-2 w-full">
                  You need ₹{Math.max(0, entryFee - Number(currentBalance))}{" "}
                  more to join this match.
                </p>

                {/* Actions */}
                <div className="flex gap-3 w-full pt-1">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-2.5 rounded-md font-orbitron font-bold text-xs uppercase tracking-widest border border-foreground/20 text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-150"
                    data-ocid="match_card.insufficient_cancel_button"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseModal();
                      navigate({ to: "/wallet" });
                    }}
                    className="flex-1 py-2.5 rounded-md font-orbitron font-bold text-xs uppercase tracking-widest bg-neon-red text-white neon-glow hover:bg-neon-red-bright active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5"
                    data-ocid="match_card.go_to_wallet_button"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    Go to Wallet
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Success / Registration Modal ── */}
        {modalState === "success" && (
          <motion.div
            key="success-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.22 }}
            style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
            data-ocid="match_card.success_modal"
            aria-labelledby="success-modal-title"
          >
            <motion.div
              key="success-card"
              className="relative w-full max-w-sm bg-card-bg rounded-xl overflow-hidden"
              style={{
                border: "1px solid rgba(34,197,94,0.25)",
                boxShadow:
                  "0 0 40px rgba(34,197,94,0.12), 0 20px 60px rgba(0,0,0,0.6)",
              }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Top green accent line */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-green-500 to-transparent" />

              {/* Close button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-3 right-3 w-7 h-7 rounded-md bg-foreground/5 hover:bg-green-500/15 flex items-center justify-center text-muted-foreground hover:text-green-400 transition-colors duration-150"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="px-6 pt-6 pb-5 flex flex-col items-center gap-4">
                {/* Check icon */}
                <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>

                {/* Title */}
                <div className="text-center">
                  <h2
                    id="success-modal-title"
                    className="font-orbitron font-bold text-lg uppercase tracking-wider text-foreground"
                  >
                    Joined Successfully!
                  </h2>
                  <p className="font-rajdhani text-sm text-green-400/80 mt-1">
                    Entry fee of ₹{entryFee} deducted from your wallet.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

                {/* Registration form */}
                <div className="w-full flex flex-col gap-3">
                  <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-widest text-center">
                    Enter your details to complete registration
                  </p>

                  {/* In-Game Name */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="In-Game Name"
                      value={inGameName}
                      onChange={(e) => {
                        setInGameName(e.target.value);
                        setFormError("");
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-foreground/5 border border-foreground/15 rounded-md font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition-colors duration-150"
                      data-ocid="match_card.ingame_name_input"
                      aria-label="In-Game Name"
                      autoComplete="off"
                    />
                  </div>

                  {/* Player ID */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Player ID"
                      value={playerId}
                      onChange={(e) => {
                        setPlayerId(e.target.value);
                        setFormError("");
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-foreground/5 border border-foreground/15 rounded-md font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/30 transition-colors duration-150"
                      data-ocid="match_card.player_id_input"
                      aria-label="Player ID"
                      autoComplete="off"
                    />
                  </div>

                  {/* Inline form error */}
                  {formError && (
                    <p
                      className="font-rajdhani text-xs text-neon-red text-center"
                      data-ocid="match_card.form_error_state"
                      role="alert"
                    >
                      {formError}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="w-full flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmRegistration}
                    className="w-full py-2.5 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest bg-neon-red text-white neon-glow hover:bg-neon-red-bright active:scale-95 transition-all duration-150"
                    data-ocid="match_card.confirm_button"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-1.5 font-rajdhani text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-2"
                    data-ocid="match_card.skip_link"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
