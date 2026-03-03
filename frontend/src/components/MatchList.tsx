import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useMatches } from '@/hooks/useQueries';
import MatchCard from './MatchCard';
import MatchListSkeleton from './MatchListSkeleton';

export default function MatchList() {
  const { data: matches, isLoading, isError, refetch } = useMatches();

  return (
    <section className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto" aria-label="Available Matches">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-neon-red rounded-full neon-glow-sm" />
          <h2 className="font-orbitron font-bold text-lg sm:text-xl uppercase tracking-widest text-foreground">
            Live Matches
          </h2>
        </div>
        {!isLoading && (
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs font-rajdhani font-semibold text-muted-foreground hover:text-neon-red transition-colors duration-200 uppercase tracking-wider"
            aria-label="Refresh matches"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <MatchListSkeleton />}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-14 h-14 rounded-full bg-neon-red/10 border border-neon-red/30 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-neon-red" />
          </div>
          <div className="text-center">
            <p className="font-orbitron font-bold text-base text-foreground mb-1">Connection Failed</p>
            <p className="font-rajdhani text-sm text-muted-foreground">Unable to load matches. Please try again.</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-neon-red/10 border border-neon-red/40 text-neon-red font-orbitron font-bold text-sm uppercase tracking-wider rounded-md hover:bg-neon-red/20 transition-all duration-200 neon-glow-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Match Cards Grid */}
      {!isLoading && !isError && matches && matches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {matches.map((match, idx) => (
            <MatchCard
              key={Number(match.matchId)}
              matchId={Number(match.matchId)}
              gameMode={match.gameMode}
              entryFee={Number(match.entryFee)}
              prizePool={Number(match.prizePool)}
              status={match.status}
              animationDelay={idx * 80}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && matches && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="font-orbitron font-bold text-base text-muted-foreground">No matches available</p>
          <p className="font-rajdhani text-sm text-muted-foreground/60">Check back soon for upcoming tournaments.</p>
        </div>
      )}
    </section>
  );
}
