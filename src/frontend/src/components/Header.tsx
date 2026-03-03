import { Link } from "@tanstack/react-router";
import { ShieldCheck, Wallet, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg border-b border-neon-red/40 shadow-neon-sm">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* App Name */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Zap
            className="w-6 h-6 text-neon-red"
            style={{ filter: "drop-shadow(0 0 6px oklch(0.55 0.22 25 / 0.8))" }}
            fill="currentColor"
          />
          <span
            className="font-orbitron font-bold text-lg sm:text-xl tracking-widest uppercase text-foreground neon-text"
            style={{ letterSpacing: "0.12em" }}
          >
            <span className="text-neon-red-bright">Elite</span>{" "}
            <span className="text-foreground">Gaming</span>{" "}
            <span className="text-neon-red">Hub</span>
          </span>
        </Link>

        {/* Right side: Admin + Wallet + Profile */}
        <div className="flex items-center gap-3">
          {/* Admin Link */}
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neon-red/30 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-200 group"
            aria-label="Admin Dashboard"
            data-ocid="header.admin_link"
          >
            <ShieldCheck
              className="w-4 h-4 text-neon-red/70 group-hover:text-neon-red-bright transition-colors"
              style={{
                filter: "drop-shadow(0 0 4px oklch(0.55 0.22 25 / 0.4))",
              }}
            />
            <span className="font-orbitron text-xs font-bold text-neon-red/70 group-hover:text-neon-red-bright uppercase tracking-wider hidden sm:inline transition-colors">
              Admin
            </span>
          </Link>

          {/* Wallet Link */}
          <Link
            to="/wallet"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neon-red/40 hover:border-neon-red hover:bg-neon-red/10 transition-all duration-200 group"
            aria-label="Wallet"
            data-ocid="header.wallet_link"
          >
            <Wallet
              className="w-4 h-4 text-neon-red group-hover:text-neon-red-bright transition-colors"
              style={{
                filter: "drop-shadow(0 0 4px oklch(0.55 0.22 25 / 0.6))",
              }}
            />
            <span className="font-orbitron text-xs font-bold text-neon-red group-hover:text-neon-red-bright uppercase tracking-wider hidden sm:inline transition-colors">
              Wallet
            </span>
          </Link>

          {/* Profile Icon */}
          <button
            type="button"
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-neon-red/70 neon-glow-sm hover:border-neon-red transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-red/50"
            aria-label="Profile"
          >
            <img
              src="/assets/generated/profile-avatar.dim_128x128.png"
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add(
                    "flex",
                    "items-center",
                    "justify-center",
                    "bg-card-bg",
                  );
                  const icon = document.createElement("div");
                  icon.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-neon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                  parent.appendChild(icon);
                }
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
