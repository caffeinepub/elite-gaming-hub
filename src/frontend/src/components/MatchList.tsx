import MatchCard from "./MatchCard";

const STATIC_MATCHES = [
  {
    matchId: 1,
    gameMode: "Bermuda Solo",
    entryFee: 50,
    prizePool: 500,
    status: "Open",
  },
  {
    matchId: 2,
    gameMode: "Bermuda Duo",
    entryFee: 50,
    prizePool: 500,
    status: "Open",
  },
  {
    matchId: 3,
    gameMode: "Kalahari Squad",
    entryFee: 50,
    prizePool: 500,
    status: "Open",
  },
];

export default function MatchList() {
  return (
    <section
      className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto"
      aria-label="Available Matches"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 bg-neon-red rounded-full neon-glow-sm" />
          <h2 className="font-orbitron font-bold text-lg sm:text-xl uppercase tracking-widest text-foreground">
            Live Matches
          </h2>
        </div>
      </div>

      {/* Match Cards Grid — static tournaments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {STATIC_MATCHES.map((match, idx) => (
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
    </section>
  );
}
