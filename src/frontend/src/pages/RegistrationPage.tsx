import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Hash,
  Loader2,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useDeductEntryFee } from "../hooks/useQueries";

interface MatchContext {
  gameMode?: string;
  entryFee?: number;
  prizePool?: number;
  matchId?: number;
}

export default function RegistrationPage() {
  const navigate = useNavigate();
  const deductEntryFee = useDeductEntryFee();

  // Read match context from sessionStorage (set by MatchCard before navigating)
  const storedContext = (() => {
    try {
      const raw = sessionStorage.getItem("registrationMatchContext");
      return raw ? (JSON.parse(raw) as MatchContext) : {};
    } catch {
      return {};
    }
  })();

  const {
    gameMode = "Solo",
    entryFee = 0,
    prizePool = 0,
    matchId,
  } = storedContext;

  const [inGameName, setInGameName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [errors, setErrors] = useState<{
    inGameName?: string;
    playerId?: string;
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const validate = () => {
    const newErrors: { inGameName?: string; playerId?: string } = {};
    if (!inGameName.trim()) newErrors.inGameName = "In-Game Name is required.";
    if (!playerId.trim()) newErrors.playerId = "Player ID is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = async () => {
    if (!validate()) return;
    setInsufficientBalance(false);

    try {
      const result = await deductEntryFee.mutateAsync({
        matchId: BigInt(matchId ?? 0),
        amount: BigInt(entryFee),
      });

      if (result.ok) {
        setIsSuccess(true);
      } else {
        // Insufficient balance — redirect to add money
        sessionStorage.setItem(
          "addMoneyContext",
          JSON.stringify({
            requiredAmount: entryFee,
            currentBalance: Number(result.newBalance),
          }),
        );
        setInsufficientBalance(true);
        setTimeout(() => {
          navigate({ to: "/add-money" });
        }, 1200);
      }
    } catch {
      setInsufficientBalance(true);
    }
  };

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const isFormValid =
    inGameName.trim().length > 0 && playerId.trim().length > 0;
  const isPending = deductEntryFee.isPending;

  // Success screen
  if (isSuccess) {
    return (
      <main className="pt-16 min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-8 w-full">
          <div className="relative bg-card-bg rounded-2xl overflow-hidden neon-border shadow-neon text-center px-6 py-10">
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent absolute top-0 left-0" />
            <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9 text-green-400" />
            </div>
            <h2 className="font-orbitron font-bold text-xl uppercase tracking-widest text-foreground mb-2">
              Registration Successful!
            </h2>
            <p className="font-rajdhani text-sm text-muted-foreground mb-6">
              You have been registered for Free Fire {gameMode}. Entry fee of ₹
              {entryFee} has been deducted from your wallet.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              <div className="bg-dark-bg rounded-lg px-3 py-2.5 border border-neon-red/10">
                <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                  In-Game Name
                </p>
                <p className="font-orbitron font-bold text-sm text-foreground mt-0.5">
                  {inGameName}
                </p>
              </div>
              <div className="bg-dark-bg rounded-lg px-3 py-2.5 border border-neon-red/10">
                <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                  Player ID
                </p>
                <p className="font-orbitron font-bold text-sm text-foreground mt-0.5">
                  {playerId}
                </p>
              </div>
              <div className="bg-dark-bg rounded-lg px-3 py-2.5 border border-neon-red/10">
                <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                  Entry Fee
                </p>
                <p className="font-orbitron font-bold text-sm text-foreground mt-0.5">
                  ₹{entryFee}
                </p>
              </div>
              <div className="bg-dark-bg rounded-lg px-3 py-2.5 border border-neon-red/10">
                <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider">
                  Prize Pool
                </p>
                <p className="font-orbitron font-bold text-sm text-neon-red-bright neon-text mt-0.5">
                  ₹{prizePool}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 transition-all duration-200"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16 min-h-screen bg-dark-bg">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-neon-red transition-colors duration-200 mb-6 group"
          aria-label="Back to matches"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-rajdhani text-sm uppercase tracking-wider font-semibold">
            Back to Matches
          </span>
        </button>

        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-7 bg-neon-red rounded-full neon-glow-sm" />
            <h1 className="font-orbitron font-bold text-xl sm:text-2xl uppercase tracking-widest text-foreground">
              Registration
            </h1>
          </div>
          <p className="font-rajdhani text-sm text-muted-foreground ml-3 uppercase tracking-wider">
            Complete your details to join the match
          </p>
        </div>

        {/* Match Context Card */}
        <div className="relative bg-card-bg rounded-lg overflow-hidden neon-border mb-6">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-neon-red" fill="currentColor" />
              <span className="font-orbitron font-bold text-sm uppercase tracking-wider text-foreground">
                Free Fire {gameMode}
              </span>
              {matchId && (
                <span className="ml-auto font-rajdhani text-xs text-muted-foreground uppercase tracking-widest">
                  Match #{matchId}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        </div>

        {/* Insufficient balance warning */}
        {insufficientBalance && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-neon-red/10 border border-neon-red/40 flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-red flex-shrink-0" />
            <p className="font-rajdhani text-sm text-neon-red font-semibold">
              Insufficient wallet balance. Redirecting to Add Money…
            </p>
          </div>
        )}

        {/* Registration Form */}
        <div className="relative bg-card-bg rounded-lg overflow-hidden neon-border">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />
          <div className="px-5 py-6 space-y-5">
            {/* In-Game Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="inGameName"
                className="flex items-center gap-1.5 font-rajdhani text-sm font-semibold uppercase tracking-wider text-foreground"
              >
                <User className="w-3.5 h-3.5 text-neon-red" />
                In-Game Name
                <span className="text-neon-red ml-0.5">*</span>
              </label>
              <input
                id="inGameName"
                type="text"
                value={inGameName}
                onChange={(e) => {
                  setInGameName(e.target.value);
                  if (errors.inGameName)
                    setErrors((prev) => ({ ...prev, inGameName: undefined }));
                }}
                placeholder="Enter your in-game name"
                className={`w-full bg-dark-bg border rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 ${
                  errors.inGameName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                    : "border-neon-red/20 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40"
                }`}
                autoComplete="off"
                disabled={isPending}
              />
              {errors.inGameName && (
                <p className="font-rajdhani text-xs text-red-400 tracking-wide">
                  {errors.inGameName}
                </p>
              )}
            </div>

            {/* Player ID */}
            <div className="space-y-1.5">
              <label
                htmlFor="playerId"
                className="flex items-center gap-1.5 font-rajdhani text-sm font-semibold uppercase tracking-wider text-foreground"
              >
                <Hash className="w-3.5 h-3.5 text-neon-red" />
                Player ID
                <span className="text-neon-red ml-0.5">*</span>
              </label>
              <input
                id="playerId"
                type="text"
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value);
                  if (errors.playerId)
                    setErrors((prev) => ({ ...prev, playerId: undefined }));
                }}
                placeholder="Enter your player ID"
                className={`w-full bg-dark-bg border rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 ${
                  errors.playerId
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                    : "border-neon-red/20 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40"
                }`}
                autoComplete="off"
                disabled={isPending}
              />
              {errors.playerId && (
                <p className="font-rajdhani text-xs text-red-400 tracking-wide">
                  {errors.playerId}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-neon-red/20 to-transparent" />

            {/* Proceed to Payment Button */}
            <button
              type="button"
              onClick={handleProceed}
              disabled={!isFormValid || isPending}
              className={`w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                isFormValid && !isPending
                  ? "bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 cursor-pointer"
                  : "bg-foreground/5 text-muted-foreground cursor-not-allowed border border-foreground/10"
              }`}
              aria-label="Proceed to Payment"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap
                    className="w-4 h-4"
                    fill={isFormValid ? "currentColor" : "none"}
                  />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
