import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RegistrationData } from "@/types/registration";
import { Hash, User, X, Zap } from "lucide-react";
import { useState } from "react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationData) => void;
  matchId: number;
  gameMode: string;
  entryFee: number;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  matchId,
  gameMode,
  entryFee,
}: RegistrationModalProps) {
  const [inGameName, setInGameName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};
    if (!inGameName.trim()) newErrors.inGameName = "In-Game Name is required";
    if (!playerId.trim()) newErrors.playerId = "Player ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ inGameName: inGameName.trim(), playerId: playerId.trim() });
  };

  const handleClose = () => {
    setInGameName("");
    setPlayerId("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-md w-full p-0 overflow-hidden border-0 bg-transparent shadow-none"
        style={{ boxShadow: "none" }}
      >
        <div
          className="relative bg-card-bg rounded-lg overflow-hidden"
          style={{
            border: "1px solid oklch(0.55 0.22 25 / 0.7)",
            boxShadow:
              "0 0 12px oklch(0.55 0.22 25 / 0.4), 0 0 40px oklch(0.55 0.22 25 / 0.15), inset 0 0 8px oklch(0.55 0.22 25 / 0.05)",
          }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-red to-transparent" />

          {/* Header */}
          <div className="px-6 pt-5 pb-4 flex items-start justify-between">
            <div>
              <DialogHeader>
                <DialogTitle asChild>
                  <h2 className="font-orbitron font-bold text-lg uppercase tracking-widest text-foreground neon-text">
                    Register for Match
                  </h2>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className="font-rajdhani text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                    Free Fire {gameMode} · Match #{matchId} · Entry: ₹{entryFee}
                  </p>
                </DialogDescription>
              </DialogHeader>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors duration-200 ml-4 mt-0.5 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-neon-red/20 to-transparent" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* In-Game Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="inGameName"
                className="flex items-center gap-1.5 font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground"
              >
                <User className="w-3.5 h-3.5 text-neon-red/70" />
                In-Game Name
              </label>
              <input
                id="inGameName"
                type="text"
                value={inGameName}
                onChange={(e) => {
                  setInGameName(e.target.value);
                  if (errors.inGameName)
                    setErrors((p) => ({ ...p, inGameName: undefined }));
                }}
                placeholder="Your in-game name"
                className={`w-full bg-dark-bg font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 px-3 py-2.5 rounded-md outline-none transition-all duration-200 ${
                  errors.inGameName
                    ? "border border-red-500/70 focus:border-red-500"
                    : "border border-neon-red/20 focus:border-neon-red/60 focus:shadow-neon-sm"
                }`}
                style={!errors.inGameName ? { boxShadow: "none" } : undefined}
                autoComplete="off"
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
                className="flex items-center gap-1.5 font-rajdhani font-semibold text-xs uppercase tracking-widest text-muted-foreground"
              >
                <Hash className="w-3.5 h-3.5 text-neon-red/70" />
                Player ID
              </label>
              <input
                id="playerId"
                type="text"
                value={playerId}
                onChange={(e) => {
                  setPlayerId(e.target.value);
                  if (errors.playerId)
                    setErrors((p) => ({ ...p, playerId: undefined }));
                }}
                placeholder="Your unique player ID"
                className={`w-full bg-dark-bg font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 px-3 py-2.5 rounded-md outline-none transition-all duration-200 ${
                  errors.playerId
                    ? "border border-red-500/70 focus:border-red-500"
                    : "border border-neon-red/20 focus:border-neon-red/60 focus:shadow-neon-sm"
                }`}
                autoComplete="off"
              />
              {errors.playerId && (
                <p className="font-rajdhani text-xs text-red-400 tracking-wide">
                  {errors.playerId}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" fill="currentColor" />
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
