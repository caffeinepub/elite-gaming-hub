# Specification

## Summary
**Goal:** Add a Wallet page to Elite Gaming Hub with an available balance display, Add Money/Withdraw buttons, and a Transaction History section backed by Motoko backend functions.

**Planned changes:**
- Add a `/wallet` route in the TanStack Router configuration and a Header navigation link/icon to access it
- Create a `WalletPage` component showing an "Available Balance" card, "Add Money" and "Withdraw" buttons (non-functional), and a "Transaction History" section with empty-state messaging — styled in the existing dark neon-red gaming theme (Orbitron/Rajdhani fonts, neon glow, dark card backgrounds)
- Add a `Transaction` record type and `getWalletBalance()` / `getTransactions()` query functions to the Motoko backend actor, initialized with balance 0 and an empty transaction list
- Create a `useWallet` React Query hook that fetches balance and transactions from the backend, and wire it to the WalletPage with a loading skeleton and empty-state handling

**User-visible outcome:** Users can navigate to a Wallet page from the Header, see their current balance (₹0.00), and view a Transaction History list (initially empty) — all styled consistently with the rest of the app.
