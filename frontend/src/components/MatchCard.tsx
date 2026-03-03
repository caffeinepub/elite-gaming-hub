import { useNavigate } from '@tanstack/react-router';
import { Users, User, DollarSign, Trophy, Zap } from 'lucide-react';

interface MatchCardProps {
  matchId: number;
  gameMode: string;
  entryFee: number;
  prizePool: number;
  status: string;
  animationDelay?: number;
}

export default function MatchCard({ matchId, gameMode, entryFee, prizePool, status, animationDelay = 0 }: MatchCardProps) {
  const isOpen = status === 'Open';
  const isSolo = gameMode.toLowerCase() === 'solo';
  const navigate = useNavigate();

  const handleJoinNow = () => {
    // Store match context in sessionStorage so RegistrationPage can read it
    sessionStorage.setItem(
      'registrationMatchContext',
      JSON.stringify({ gameMode, entryFee, prizePool, matchId })
    );
    navigate({ to: '/registration' });
  };

  return (
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
            {isSolo ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
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
              ? 'bg-neon-red/15 text-neon-red border border-neon-red/40'
              : 'bg-foreground/5 text-muted-foreground border border-foreground/10'
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
            <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider leading-none">Entry Fee</p>
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
            <p className="font-rajdhani text-xs text-muted-foreground uppercase tracking-wider leading-none">Prize Pool</p>
            <p className="font-orbitron font-bold text-sm text-neon-red-bright leading-tight neon-text">
              ₹{prizePool}
            </p>
          </div>
        </div>
      </div>

      {/* Join Button */}
      <div className="px-4 pb-4">
        <button
          disabled={!isOpen}
          onClick={isOpen ? handleJoinNow : undefined}
          className={`w-full py-2.5 rounded-md font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
            isOpen
              ? 'bg-neon-red text-white hover:bg-neon-red-bright neon-glow hover:shadow-neon-lg active:scale-95 cursor-pointer'
              : 'bg-foreground/5 text-muted-foreground cursor-not-allowed border border-foreground/10'
          }`}
          aria-label={isOpen ? `Join Free Fire ${gameMode} match` : 'Match closed'}
        >
          {isOpen ? (
            <>
              <Zap className="w-4 h-4" fill="currentColor" />
              Join Now
            </>
          ) : (
            'Closed'
          )}
        </button>
      </div>
    </article>
  );
}
