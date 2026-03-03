import { RefreshCw } from 'lucide-react';
import { useMatches } from '@/hooks/useQueries';
import MatchCard from './MatchCard';
import MatchListSkeleton from './MatchListSkeleton';

const STATIC_MATCHES = [
  {
    matchId: 1,
    gameMode: 'Bermuda Solo',
    entryFee: 50,
    prizePool: 500,
    status: 'Open',
  },
  {
    matchId: 2,
    gameMode: 'Bermuda Duo',
    entryFee: 50,
    prizePool: 500,
    status: 'Open',
  },
  {
    matchId: 3,
    gameMode: 'Purgatory Solo',
    entryFee: 50,
    prizePool: 500,
    status: 'Open',
  },
];

export default function MatchList() {
  const { data: matches, isLoading, isError, refetch } = useMatches();

  // Always fall back to static matches on error; never show an error message
  const displayMatches = isError || (!isLoading && (!matches || matches.length === 0))
    ? STATIC_MATCHES
    : matches;

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

      {/* Match Cards Grid — live data or static fallback */}
      {!isLoading && displayMatches && displayMatches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayMatches.map((match, idx) => (
            <MatchCard
              key={match.matchId}
              matchId={match.matchId}
              gameMode={match.gameMode}
              entryFee={match.entryFee}
              prizePool={match.prizePool}
              status={match.status}
              animationDelay={idx * 80}
            />
          ))}
        </div>
      )}
    </section>
  );
}
