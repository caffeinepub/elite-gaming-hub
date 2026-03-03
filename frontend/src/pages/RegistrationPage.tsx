import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, User, Hash, Zap, Trophy, DollarSign } from 'lucide-react';

interface MatchContext {
  gameMode?: string;
  entryFee?: number;
  prizePool?: number;
  matchId?: number;
}

export default function RegistrationPage() {
  const navigate = useNavigate();

  // Read match context from sessionStorage (set by MatchCard before navigating)
  const storedContext = (() => {
    try {
      const raw = sessionStorage.getItem('registrationMatchContext');
      return raw ? (JSON.parse(raw) as MatchContext) : {};
    } catch {
      return {};
    }
  })();

  const { gameMode = 'Solo', entryFee = 0, prizePool = 0, matchId } = storedContext;

  const [inGameName, setInGameName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [errors, setErrors] = useState<{ inGameName?: string; playerId?: string }>({});

  const validate = () => {
    const newErrors: { inGameName?: string; playerId?: string } = {};
    if (!inGameName.trim()) newErrors.inGameName = 'In-Game Name is required.';
    if (!playerId.trim()) newErrors.playerId = 'Player ID is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validate()) {
      // Placeholder: proceed to payment step
    }
  };

  const handleBack = () => {
    navigate({ to: '/' });
  };

  const isFormValid = inGameName.trim().length > 0 && playerId.trim().length > 0;

  return (
    <main className="pt-16 min-h-screen bg-dark-bg">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Back Navigation */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-neon-red transition-colors duration-200 mb-6 group"
          aria-label="Back to matches"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-rajdhani text-sm uppercase tracking-wider font-semibold">Back to Matches</span>
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
                  <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider leading-none">Entry Fee</p>
                  <p className="font-orbitron font-bold text-sm text-foreground leading-tight">₹{entryFee}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-neon-red/10 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-neon-red" />
                </div>
                <div>
                  <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider leading-none">Prize Pool</p>
                  <p className="font-orbitron font-bold text-sm text-neon-red-bright leading-tight neon-text">₹{prizePool}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  if (errors.inGameName) setErrors((prev) => ({ ...prev, inGameName: undefined }));
                }}
                placeholder="Enter your in-game name"
                className={`w-full bg-dark-bg border rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 ${
                  errors.inGameName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-neon-red/20 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40'
                }`}
                autoComplete="off"
              />
              {errors.inGameName && (
                <p className="font-rajdhani text-xs text-red-400 tracking-wide">{errors.inGameName}</p>
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
                  if (errors.playerId) setErrors((prev) => ({ ...prev, playerId: undefined }));
                }}
                placeholder="Enter your player ID"
                className={`w-full bg-dark-bg border rounded-md px-3 py-2.5 font-rajdhani text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:ring-1 ${
                  errors.playerId
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                    : 'border-neon-red/20 focus:border-neon-red/60 focus:ring-neon-red/20 hover:border-neon-red/40'
                }`}
                autoComplete="off"
              />
              {errors.playerId && (
                <p className="font-rajdhani text-xs text-red-400 tracking-wide">{errors.playerId}</p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-neon-red/20 to-transparent" />

            {/* Proceed to Payment Button */}
            <button
              onClick={handleProceed}
              disabled={!isFormValid}
              className={`w-full py-3 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                isFormValid
                  ? 'bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 cursor-pointer'
                  : 'bg-foreground/5 text-muted-foreground cursor-not-allowed border border-foreground/10'
              }`}
              aria-label="Proceed to Payment"
            >
              <Zap className="w-4 h-4" fill={isFormValid ? 'currentColor' : 'none'} />
              Proceed to Payment
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
