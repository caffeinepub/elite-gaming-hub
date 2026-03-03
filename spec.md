# Elite Gaming Hub

## Current State
The app has a working Admin Dashboard at `/admin` that shows deposit requests with Approve functionality, a screenshot lightbox, and basic stats (Total/Pending/Approved counts). There is no Reject button, no stats overview cards (Total Users, Total Revenue, Active Tournaments), and no User Management section. The backend has `approveDepositRequest` but no `rejectDepositRequest`, no user listing, and no manual balance update.

## Requested Changes (Diff)

### Add
- **Stats Overview**: 4 stat cards at the top: Total Users, Pending Requests, Total Revenue (sum of all approved deposits), Active Tournaments (static = 3).
- **Reject button**: Each pending deposit request row gets a red "Reject" button alongside the existing "Approve" button. On reject, request is marked rejected and removed from pending view.
- **User Management section**: Below the deposit table, a search bar to find a player by name/ID. Shows player's current balance with +/- controls to manually increase or decrease the balance.
- **Backend**: `rejectDepositRequest(requestId)` - marks request as rejected. `getAllUsers()` - returns list of all registered user principals + profiles. `getUserWalletBalance(user: Principal)` - returns balance for a specific user. `setUserWalletBalance(user: Principal, newBalance: Nat)` - admin-only, sets a user's balance directly.

### Modify
- Admin Dashboard stats bar: replace current 3-count bar (Total/Pending/Approved) with 4 proper stat cards.
- Deposit requests table: add Reject button next to Approve for pending rows.

### Remove
- Nothing removed.

## Implementation Plan
1. Add `rejectDepositRequest`, `getAllUsers`, `getUserWalletBalance`, `setUserWalletBalance` to `main.mo`. Store per-user balances in a Map keyed by Principal instead of a single global `balance` variable.
2. Regenerate `backend.d.ts` and update `useQueries.ts` hooks for the new methods.
3. Redesign `AdminDashboardPage.tsx`:
   - 4 stat cards at top (Total Users, Pending Requests, Total Revenue, Active Tournaments)
   - Deposit Requests table: columns = User Name, Amount, Screenshot Proof (View button), Action (Approve + Reject buttons)
   - User Management section: search input, results showing player name + balance, with manual +/- amount input and "Update Balance" button
