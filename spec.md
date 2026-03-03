# Specification

## Summary
**Goal:** Add a Registration page at `/registration` with "In-Game Name" and "Player ID" fields, and wire all "Join Now" buttons (live and static match cards) to navigate to it with match context.

**Planned changes:**
- Create a `RegistrationPage` component at the `/registration` route displaying match context (game mode, entry fee, prize pool) read from sessionStorage at the top of the form.
- Add two required input fields: "In-Game Name" and "Player ID", with a "Proceed to Payment" button that is disabled/shows validation error when either field is empty.
- Style the page with the existing dark neon-red theme (dark card background, neon red accents, Orbitron/Rajdhani fonts, neon glow on button).
- Add a back-navigation option to return to the Home screen (`/`).
- Update all `MatchCard` "Join Now" buttons (both live backend cards and the 3 static fallback cards: Bermuda Solo, Bermuda Duo, Purgatory Solo) to save game mode, entry fee, and prize pool to sessionStorage and navigate to `/registration`.

**User-visible outcome:** Users can click "Join Now" on any match card to be taken to a Registration page that shows the selected match details and prompts them to enter their In-Game Name and Player ID before proceeding.
