import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Header from "./components/Header";
import MatchList from "./components/MatchList";
import TournamentBanner from "./components/TournamentBanner";
import AddMoneyPage from "./pages/AddMoneyPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RegistrationPage from "./pages/RegistrationPage";
import WalletPage from "./pages/WalletPage";

// Root layout with Header always visible
function RootLayout() {
  return (
    <div className="min-h-screen bg-dark-bg text-foreground font-rajdhani">
      <Header />
      <Outlet />
    </div>
  );
}

// Home page content
function HomePage() {
  const currentYear = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined"
      ? window.location.hostname
      : "elite-gaming-hub",
  );

  return (
    <>
      <main className="pt-16">
        <TournamentBanner />
        <MatchList />
      </main>

      <footer className="border-t border-neon-red/20 bg-header-bg mt-8">
        <div className="max-w-screen-xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-rajdhani text-sm text-muted-foreground">
            © {currentYear} Elite Gaming Hub. All rights reserved.
          </p>
          <p className="font-rajdhani text-sm text-muted-foreground flex items-center gap-1.5">
            Built with{" "}
            <span
              className="text-neon-red"
              style={{
                filter: "drop-shadow(0 0 4px oklch(0.55 0.22 25 / 0.8))",
              }}
            >
              ♥
            </span>{" "}
            using{" "}
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
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/registration",
  component: RegistrationPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});

const addMoneyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-money",
  component: AddMoneyPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registrationRoute,
  walletRoute,
  addMoneyRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
