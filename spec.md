# Specification

## Summary
**Goal:** Add a multi-step registration and UPI payment modal flow triggered by the "Join Now" button on match cards.

**Planned changes:**
- Create a `RegistrationModal` component that opens as an overlay when "Join Now" is clicked on any `MatchCard`
- Modal collects three required fields: "In-Game Name", "Player ID", and "WhatsApp Number" with inline validation
- A "Proceed to Payment" button advances to the UPI payment screen (step 2 of the same modal flow)
- Payment screen displays the UPI ID placeholder `[Apna UPI ID eithe likho]` and the match entry fee amount
- Payment screen includes an "Upload Screenshot" button that opens a file picker and shows a preview thumbnail of the selected image
- A confirmation/submit button is available after uploading the screenshot
- Both screens follow the existing dark neon-red theme (Orbitron/Rajdhani fonts, dark backgrounds, red borders/glows)
- Remove any existing third-party payment gateway integrations (Stripe, Razorpay, etc.) from the flow
- Modal can be dismissed at any step without completing registration

**User-visible outcome:** Players can click "Join Now" on a match card, fill in their gaming details, then submit a UPI payment screenshot — all within a themed multi-step modal, with no third-party payment gateways involved.
