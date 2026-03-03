import Header from './components/Header';
import TournamentBanner from './components/TournamentBanner';
import MatchList from './components/MatchList';

export default function App() {
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'elite-gaming-hub');

  return (
    <div className="min-h-screen bg-dark-bg text-foreground font-rajdhani">
      {/* Fixed Header */}
      <Header />

      {/* Main Content — offset for fixed header */}
      <main className="pt-16">
        {/* Tournament Banner */}
        <TournamentBanner />

        {/* Match List */}
        <MatchList />
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-red/20 bg-header-bg mt-8">
        <div className="max-w-screen-xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-rajdhani text-sm text-muted-foreground">
            © {currentYear} Elite Gaming Hub. All rights reserved.
          </p>
          <p className="font-rajdhani text-sm text-muted-foreground flex items-center gap-1.5">
            Built with{' '}
            <span className="text-neon-red" style={{ filter: 'drop-shadow(0 0 4px oklch(0.55 0.22 25 / 0.8))' }}>
              ♥
            </span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-red hover:text-neon-red-bright transition-colors duration-200 font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
