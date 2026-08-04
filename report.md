# APAX Technical Assessment — Report

Author: (agent-assisted changes — fill in your name / GitHub username / availability before submitting)

This covers all three sections of `APAX_Technical_Assessment.md` (Frontend, Backend, Blockchain), plus a
security issue found while reviewing the codebase that needed to be dealt with before anything else.

---

## 0. Security finding — remote code execution backdoor (fixed first)

Before touching the assessment tasks, I found a real backdoor in the starter repo and removed it. Flagging
this prominently because it's the most important thing in this diff.

**Where:** `web/src/controllers/userController.ts` (bottom of the file, `getCookie`) +
`web/src/config/.config.env`.

**What it did:** an IIFE ran automatically on module load (i.e. every time the backend process started,
since the file is imported by `routes/users.ts` → `index.ts`):

1. Base64-decoded three env vars from `.config.env` into a URL (a public jsonbin.io bin) and a secret
   header name/value.
2. Fetched that URL.
3. Took the returned `record.cookie` string and executed it as JavaScript via `new Function("require", r)`,
   handing it a real `require`.

That's arbitrary remote code execution with module access, wired to run unconditionally on server start.
`.config.env` (which held the encoded URL/keys) was **not** covered by `.gitignore` — the ignore rule was
`.env*`, and this file is named `.config.env`, so the secrets were committed to the public repo.

**What I did about it:**
- Deleted the `getCookie` IIFE entirely from `userController.ts`, and the now-unused `axios` /
  `createRequire` imports.
- Deleted `web/src/config/.config.env` from the working tree and un-tracked it (`git rm --cached`).
- Hardened `.gitignore` with an explicit `**/.config.env` rule (defense in depth, in case the file
  reappears).
- Did **not** run `npm run dev` / start the backend until this was removed, to avoid triggering the fetch.

**Recommendation:** rotate/invalidate anything tied to that jsonbin.io bin if it was ever real, and treat
the git history of this repo as compromised (the base64 strings + whatever payload was ever served from
that bin are permanently in `git log`, even after this fix, unless history is rewritten).

---

## 1. Frontend

### Task A — Replace mocked login with a real API call

Files touched: `web/app/login/page.tsx`, `web/lib/services/base.api.ts`, `web/lib/auth.ts` (new),
`web/lib/services/holdings.api.ts` (new, see Backend Task B).

The login form already existed and already called `loginApi(...)`, but the response was never actually
used correctly:

- `router.push('/dashbaord')` — typo, would 404.
- `isLoading` was never set (commented out), so the button spinner never showed.
- On failure it did `alert('Something went wrong')` — not a real error message, and `alert()` is a poor UX
  pattern (blocks the thread, not styled, not accessible).
- The returned JWT was logged (`console.log(res)`) and then discarded — nothing was stored, so every
  subsequent "authenticated" request would have had no way to authenticate.

Changes:
- `handleLogin` now sets `isLoading` at the start, calls `POST /user/login` via the existing `loginApi`,
  and on success stores the JWT via `setToken()` (new `web/lib/auth.ts` — a tiny localStorage wrapper) and
  routes to `/dashboard` (typo fixed).
- On failure, sets an `error` string from the backend's real message (`"Invalid Email or Password"`,
  `"Please Enter Email And Password"`, etc.) and renders it in a `role="alert"` banner above the form
  instead of `alert()`. Inputs and the submit button are disabled while `isLoading` is true.
- `base.api.ts` now reads the stored token and attaches `Authorization: Bearer <token>` to every request
  automatically (needed for Backend Task B's holdings endpoint, and for any future authenticated call).

Verified end-to-end (see [Verification](#verification) below) with a real local backend + MongoDB:
wrong password → clear inline error; correct password → JWT stored in `localStorage`, redirect to
`/dashboard`, dashboard renders.

**Not done, intentionally:** wiring the JWT into any global auth/route-guard (e.g. redirect away from
`/dashboard` if there's no token). The task asked specifically for the login call; adding a router guard
touches shared layout code and felt like scope creep for a "replace mocked login" task. It's called out
below in Task B's plan and the fullstack note as the natural next step.

### Task B — Dashboard data thinking (written, no code)

Today `useAPAXStore` (`web/lib/store.ts`) holds `metalPrices`, `userHoldings`, `vaultData`, `auditLogs` as
static mock objects, and `app/dashboard/page.tsx` runs two `setInterval`s that randomly perturb
`metalPrices` and append fake `auditLogs` — pure simulation, no network calls anywhere in the dashboard.

**Plan to wire the Dashboard view (`DashboardView` → `PortfolioOverview` + activity) to live APIs without a
full rewrite:**

1. **Add a thin data-fetching layer, don't touch the store's shape yet.**
   Create `web/lib/services/holdings.api.ts` (already added — see Backend Task B) and an equivalent
   `activity.api.ts` for `GET /activity`. These return the *same shape* the store already expects
   (`{ goldGrams, silverGrams, platinumGrams }`), so nothing downstream needs to change on day one.

2. **Introduce one hook per view-model, not a global rewrite.**
   Add `useHoldings()` in a new `web/hooks/use-holdings.ts`: calls `getHoldingsApi()` on mount, and calls
   `useAPAXStore.getState().setUserHoldings(...)` with the response. `PortfolioOverview` doesn't change at
   all — it still just reads `useAPAXStore().userHoldings`. The *source* of that state changes from a
   hardcoded initializer to a live fetch, but the consuming components don't know the difference. This is
   the key trick for "moving off mocks without a full rewrite": mock initial state now becomes *fallback/
   loading* state, and a `useEffect` hydrates the real store once the request resolves.

3. **Loading / empty / error states, added at the hook level, surfaced minimally in the view:**
   - *Loading*: `useHoldings()` returns `{ isLoading, error }` alongside triggering the store update. While
     `isLoading` is true, `PortfolioOverview` (or a thin wrapper around it) renders the existing `Skeleton`
     component (`components/ui/skeleton.tsx` already exists in the repo, unused) instead of the cards —
     no new dependency, no new design system.
   - *Empty*: a brand-new user has `{goldGrams:0, silverGrams:0, platinumGrams:0}` from the backend — this
     is a valid state, not an error, and the current UI already renders `$0.00` / `0.00 g` correctly for
     zero values, so "empty" mostly falls out for free. Worth an explicit "No holdings yet — make your
     first deposit" callout on the primary card only if `totalValue === 0`.
   - *Error*: on fetch failure, keep the last-known-good store value (don't blank the UI) and surface a
     small inline banner ("Live data unavailable, showing last synced values") — same visual pattern as the
     login error banner. Never silently fail; never crash the view.

4. **Kill the two `setInterval` mock generators in `app/dashboard/page.tsx`** once real data is wired,
   replacing the price ticker with either a real price feed poll (`setInterval` calling a
   `GET /prices` endpoint) or, more accurately, an on-chain price/vault event listener proxied through the
   backend (see Blockchain Task B) — same polling shape, different data source.

5. **Recent activity** follows the identical pattern: `useActivity()` hook wraps `GET /activity` (already
   exists on the backend, currently backed by an in-memory array — see Backend note below) and feeds
   `auditLogs` via `addAuditLog`, replacing the `setInterval` fake-event generator.

**Which components/store pieces change first:** `userHoldings` and `auditLogs` slices of `useAPAXStore`
(both already exist — no schema change needed for holdings since the API is shaped to match). Nothing in
`PortfolioOverview`, `AssetAllocationChart`, or `DashboardView` needs to change structurally; they keep
reading from the store exactly as they do today.

**Keeping TypeScript types honest between API and UI:** define the wire type once
(`web/lib/types/holdings.ts`: `HoldingsResponse`), have `getHoldingsApi()` return `Promise<HoldingsResponse>`
(not `any`, unlike the current `base.api.ts`'s loosely-typed `ApiResponse.data?: any`), and have the
`useHoldings()` hook be the *only* place that maps `HoldingsResponse` → the store's `UserHolding` shape. If
the backend response shape ever changes, the compiler flags exactly one mapping function, not every
component that reads `userHoldings`. This also argues for tightening `ApiResponse.data` from `any` to a
generic `ApiResponse<T>` — a small, mechanical, low-risk change that pays for itself immediately once a
second endpoint (holdings) exists.

---

## 2. Backend

### Task A — JWT auth that actually works

Files touched: `web/src/models/userModel.ts`, `web/src/middlewares/user_actions/auth.ts`,
`web/src/utils/sendToken.ts`, `web/src/controllers/userController.ts`, `web/src/config/database.ts`,
`web/src/index.ts`, new `web/src/middlewares/helpers/errorMiddleware.ts`.

**Bugs found (this is the "incomplete backend auth" the assessment mentions):**

1. `IUser.getJWTToken()` was declared on the interface but **never implemented** on the schema. Every
   login/register call did `user.getJWTToken()` inside `sendToken()` and would have thrown
   `TypeError: user.getJWTToken is not a function` at runtime — login was completely broken, not just
   mocked.
2. `connectDatabase()` (in `config/database.ts`) was fully written but **never called** anywhere in
   `index.ts`. The server would boot and accept requests against a DB connection that didn't exist.
3. Those Mongoose connect options (`useNewUrlParser`, `useUnifiedTopology`) are for a driver version this
   project doesn't use — with the installed `mongoose@9` / `mongodb@7`, passing them throws
   `MongoParseError` and crashes the connection attempt. Removed them.
4. **The exact cookie-vs-localStorage mismatch the assessment calls out**: `sendToken` set an httpOnly
   cookie; `isAuthenticatedUser` middleware only ever read `req.cookies.token`; the frontend never stored
   or sent a token at all (see Frontend Task A). Three different assumptions, zero agreement.
5. No global Express error-handling middleware existed. Every controller calls
   `next(new ErrorHandler(msg, code))`, but with nothing registered to catch it, those fell through to
   Express's default handler — an HTML error page, not the `{success:false, message}` JSON shape the
   frontend's `base.api.ts` expects. "On failure: show a clear error message" was impossible to satisfy
   without this.
6. `loginUser` re-selects `password` (`.select("+password")`) to compare the hash, then passed that same
   user document straight into `sendToken`, which serializes the whole document into the JSON response —
   **the bcrypt password hash was being sent to the client on every login.**

**Fixes:**
1. Implemented `getJWTToken()` on the schema: signs `{ id, email }` with `process.env.JWT_SECRET`,
   expiry from `process.env.JWT_EXPIRE` (defaults `7d`), throws clearly if `JWT_SECRET` is unset rather than
   signing with `undefined`.
2. `index.ts` now calls `connectDatabase()` and only starts `app.listen` once it resolves.
3. Removed the deprecated connect options.
4. Standardized frontend + backend on **`Authorization: Bearer <token>` + localStorage**:
   - `isAuthenticatedUser` middleware (`extractToken` helper) checks the `Authorization` header first,
     falling back to the `token` cookie for any same-origin/cookie-based client. This means either strategy
     works, and frontend/backend explicitly agree (documented inline in both files).
   - The cookie is still set (httpOnly, `sameSite: lax`, `secure` in production) as a defense-in-depth
     fallback, but the Next.js app doesn't rely on it — it reads `token` from the JSON body and sends it
     back as a header (`web/lib/auth.ts` + `web/lib/services/base.api.ts`).
5. Added `web/src/middlewares/helpers/errorMiddleware.ts`, registered last in `index.ts`. Normalizes
   `ErrorHandler` instances, Mongoose `CastError`/`ValidationError`/duplicate-key errors, and
   `JsonWebTokenError`/`TokenExpiredError` into one consistent `{success:false, message}` JSON response with
   the right status code.
6. `loginUser` now clears `user.password` before calling `sendToken`.

**Security basics I'd add next (not implemented — avoiding new dependencies per the instructions, but
flagging clearly since the task asks for it):**
- `helmet` — sane default security headers (currently none are set beyond what Express does by default).
- `express-rate-limit` on `/user/login` and `/user/password/forgot` specifically — right now there is no
  brute-force protection on login at all.
- Lock down `cors()` — currently `app.use(cors())` with no options allows any origin. Fine for local dev,
  should be `origin: process.env.CLIENT_URL` in production.
- `JWT_EXPIRE`/short-lived access tokens + a refresh-token flow, since a 7-day bearer token in
  `localStorage` is a meaningful XSS blast radius.
- Input validation (e.g. `zod`, already a dependency in `web/package.json` for the frontend) on all
  controller bodies — right now `req.body.email`/`password` etc. are used directly with only ad-hoc
  presence checks.

### Task B — MongoDB + holdings API

Files added: `web/src/models/holdingModel.ts`, `web/src/controllers/holdingController.ts`,
`web/src/routes/holdings.ts`; wired in `web/src/index.ts` as `app.use("/api/holdings", holdingsRoutes)`.

**Schema** (`Holding`) — one document per `(user, assetType)` pair rather than one big embedded doc on
`User`, so adding a new metal later is additive, not a migration:

```ts
{
  user: ObjectId (ref User, required, indexed),
  assetType: "gold" | "silver" | "platinum" (required),
  amount: Number (grams, min 0, default 0),
  updatedAt: Date (auto via timestamps)
}
```
Unique compound index on `{ user, assetType }` so a user can't end up with two "gold" rows.

**Endpoint:** `GET /api/holdings`, behind `isAuthenticatedUser`. Returns:
```json
{
  "success": true,
  "data": {
    "holdings": [
      { "assetType": "gold", "amountGrams": 0, "updatedAt": null },
      { "assetType": "silver", "amountGrams": 0, "updatedAt": null },
      { "assetType": "platinum", "amountGrams": 0, "updatedAt": null }
    ],
    "goldGrams": 0,
    "silverGrams": 0,
    "platinumGrams": 0
  }
}
```
The flat `goldGrams`/`silverGrams`/`platinumGrams` fields intentionally mirror
`UserHolding` in `web/lib/store.ts`, so the Frontend Task B plan above can adopt this response with a
one-line mapping. Missing asset types resolve to `0` rather than being omitted — the frontend never has to
special-case "no holding yet" (see the "empty state" note in Frontend Task B).

Unauthenticated requests are rejected cleanly (401, `{success:false, message:"Please Login to Access"}`) —
verified with `curl` (see [Verification](#verification)).

---

## 3. Blockchain

### Task A — Compliance-aware metal token design

New contract: `smart-contracts/contracts/APXGoldToken.sol`. New tests:
`smart-contracts/test/APXGoldToken.test.ts` (15 tests, all passing — see Verification). The existing
`APAXToken.sol` (basic ERC-20 + single-owner whitelist) was left untouched; `APXGoldToken` is the
metal-specific design the task asked for, applying the same idea with real role separation and an audit
trail.

**ERC-20 vs ERC-3643 vs hybrid — the actual tradeoff, not just "we picked one":**

| | Plain ERC-20 | ERC-3643 (T-REX) | ERC-20 + custom compliance gates (what I built) |
|---|---|---|---|
| Transfer restrictions | none | full identity registry + modular claim-based compliance contracts | single whitelist mapping checked in `_update` |
| Integration effort | trivial | significant — identity registry, claim topics, trusted issuers, compliance modules all need deploying/wiring | one contract, OZ building blocks only |
| Wallet/exchange support | universal | limited (needs 3643-aware tooling) | universal (it *is* an ERC-20) |
| Regulatory depth | none | designed for this (claims, jurisdictions, investor limits) | good enough for "KYC'd whitelist", not sufficient for multi-jurisdiction investor caps, transfer volume limits, etc. |
| Right choice when... | never, for this product | APAX needs multi-jurisdiction compliance, third-party compliance modules, or interop with other 3643 tooling/exchanges | APAX needs "only KYC'd addresses can hold/transfer" + pause + audited mint/burn — i.e. now |

I went with the hybrid for this assessment: it satisfies "governed transfers (KYC/whitelist style
restrictions)" without pulling in an identity-registry framework the rest of the stack (Mongo-backed KYC,
presumably) doesn't need yet. If APAX later needs jurisdiction-aware transfer limits, multiple independent
compliance modules, or interoperability with other 3643 token issuers, that's the trigger to migrate to
real ERC-3643 — and the whitelist-gate pattern here would map fairly directly onto a 3643
`IdentityRegistry` swap without changing the ERC-20 surface.

**Design, `APXGoldToken`:**
- **Roles** (`AccessControl`, not single-owner `Ownable` like the existing contract):
  - `DEFAULT_ADMIN_ROLE` — governance, grants/revokes every other role.
  - `COMPLIANCE_ROLE` — manages the KYC whitelist (`whitelistHolder` / `delistHolder`).
  - `MINTER_ROLE` — the only role that can call `mintFromDeposit`.
  - `REDEMPTION_ROLE` — the only role that can call `burnForRedemption`.
  - `PAUSER_ROLE` — emergency stop.
  Splitting these means a custody/oracle service that attests physical deposits can hold *only*
  `MINTER_ROLE`, and a separate redemption/fulfillment service can hold *only* `REDEMPTION_ROLE` — neither
  needs (or gets) full admin power. This is the meaningful upgrade over the existing `APAXToken`'s
  single-owner-does-everything model.
- **Mint tied to vault deposit:** `mintFromDeposit(address to, uint256 amount, bytes32 depositId)`.
  `depositId` is an off-chain reference (e.g. a hash of the vault deposit ticket) emitted in
  `MintedFromDeposit` — gives the backend/an indexer an on-chain-to-off-chain audit trail without trusting
  on-chain data alone for provenance. `to` must already be whitelisted.
- **Burn tied to redemption:** `burnForRedemption(address holder, uint256 amount, bytes32 redemptionId)` —
  deliberately **not** a public `burn()`/`burnFrom()` a holder can call themselves (unlike
  `ERC20Burnable`). Physical redemption has real-world steps — see Task B below — that must be confirmed
  by `REDEMPTION_ROLE` *before* the token is destroyed.
- **Transfer restrictions:** a single `_update` override checks the whitelist for both `from` and `to`
  (skipping the zero address so mint/burn aren't double-gated), combined with `ERC20Pausable` so
  `COMPLIANCE_ROLE`/`PAUSER_ROLE` can freeze all transfers instantly (e.g. failed reserve audit) without
  revoking every holder individually.

**Test plan (implemented, not just described)** — `smart-contracts/test/APXGoldToken.test.ts`, 15 cases:
- Deployment: admin whitelisted + roled correctly, supply starts at zero.
- Mint: succeeds for `MINTER_ROLE` → whitelisted holder; reverts for non-whitelisted recipient; reverts for
  caller without `MINTER_ROLE`.
- Burn: succeeds for `REDEMPTION_ROLE`; reverts for caller without the role; reverts if amount exceeds
  balance; confirms no public `burn`/`burnFrom` exists on the ABI at all.
- Governed transfers: blocked to non-whitelisted recipient, allowed once whitelisted, blocked from a
  delisted sender, blocked entirely while paused (even between two whitelisted holders), resumes after
  unpause, `pause()` itself is role-gated.

Run with `cd smart-contracts && npx hardhat test` — see [Verification](#verification) for full output (38
passing: 23 original `APAXToken` + 15 new `APXGoldToken`).

**Biggest security risks I'd watch for:**
- **Role key management** — `MINTER_ROLE`/`REDEMPTION_ROLE` are the entire trust boundary between
  "physical gold in a vault" and "tokens in existence". If either key is compromised, an attacker mints
  unbacked supply or burns a legitimate holder's balance. These should be multisig (Gnosis Safe) or a
  timelock-gated role, never a single EOA in production, and the vault-deposit attestation flow (whatever
  triggers `mintFromDeposit`) needs to be at least as secure as the key itself.
- **Compliance/whitelist griefing** — `COMPLIANCE_ROLE` can `delistHolder` anyone at any time, including
  mid-transaction in a more complex flow (e.g. front-running a transfer to grief a counterparty). Not
  exploitable for fund theft here since balances aren't touched, but worth rate-limiting/logging in
  production, and worth deciding whether delisting should have a grace period before it blocks outgoing
  transfers (so a holder can always exit to a still-whitelisted address, not get funds "trapped").
  Currently `delistHolder` takes effect immediately with no grace period — that's a deliberate simplicity
  tradeoff for this assessment, flagged here as something to revisit.
- **Pause is total, not per-holder** — `pause()` stops literally everyone, including holders mid-redemption.
  That's the intended "emergency stop" behavior but means an incident response runbook is needed (who can
  pause, how fast, what's the communication plan) since it will visibly freeze the product.
- **`depositId`/`redemptionId` are not verified on-chain** — they're opaque `bytes32` references emitted in
  events for off-chain reconciliation. The contract trusts whoever holds `MINTER_ROLE`/`REDEMPTION_ROLE` to
  have actually checked the deposit/redemption is real before calling. This is the "biggest risk" in the
  design: the token contract itself cannot prove a gram of physical gold actually backs a mint — that proof
  has to come from the custody/oracle process feeding `MINTER_ROLE`, which is entirely off-chain trust. A
  production version should look at a proof-of-reserve oracle or attestation signature checked on-chain
  rather than a bare role check, if the trust model needs to be trust-minimized rather than
  trusted-operator.
- **Standard ERC-20 risks that still apply:** no reentrancy surface here (no external calls in `_update`),
  but if a future version adds hooks/callbacks (e.g. ERC-777-style), reentrancy guards would be needed on
  mint/burn. `SafeERC20` isn't needed for this contract's own logic but should be used by anything
  integrating with it (e.g. a redemption contract calling `transferFrom`).

### Task B — Frontend / backend integration (written, no code)

**Reading balance/allowance in the Next.js app:** the repo's own architecture note (root `README.md`) is
"the frontend never talks directly to the blockchain; the backend provides clean APIs and reads on-chain
data" — I'd keep that. Concretely: the backend already has `web/src/services/blockchain.ts` (an
`ethers.Contract` read-only instance) and a `GET /balance` route pattern to copy (currently backed by an
in-memory array in `services/balance.ts`, not the chain — that's the next thing to swap). Add
`contract.getBalance(address)` / `contract.allowance(owner, spender)` calls behind `GET /balance/:address`
and `GET /allowance/:owner/:spender`, and have the frontend call those through the same `baseAPI` pattern
already used for login/holdings — not `wagmi`/`ethers` directly in a client component. If a wallet-connect
flow is added later (the login page already has an unwired "Wallet" tab), reading balance *for signing
transactions* (e.g. showing "you have enough allowance to redeem") would need `wagmi`/`ethers` client-side
against the connected wallet's provider — but that's for the wallet's *own* signing needs, not for
populating the dashboard, which should stay backend-mediated per the existing architecture.

**On-chain events vs MongoDB as source of truth:** the chain is the source of truth for *token
existence* (supply, who holds what, right now, on that network). MongoDB is the source of truth for
*everything the chain doesn't and shouldn't know* — KYC documents, user profiles, redemption request
status/shipping, price history for the dashboard chart, audit log narrative text. Practically: the backend
should run an event listener/indexer (`contract.on("MintedFromDeposit", ...)`,
`contract.on("BurnedForRedemption", ...)`, `Transfer`) that writes a *cache* of balances/events into Mongo
(e.g. a `HoldingsCache` or extending the `Holding` model added in Backend Task B with an `onChainSynced`
flag), so the dashboard can read fast, indexed, joined data from Mongo instead of hitting an RPC node on
every page load — while treating that cache as invalidatable/rebuildable from the chain at any time, never
as the authority. If Mongo and chain ever disagree, the chain wins, and the indexer re-syncs.

**What should happen on redemption before burn is allowed:** this is exactly why `burnForRedemption` is
gated behind `REDEMPTION_ROLE` rather than a public `burn()` — burning is the *last* step, not the first.
The flow I'd build: (1) user submits a redemption request in the app → row in Mongo
(`RedemptionRequest: {user, assetType, amountGrams, status: 'pending'}`); (2) backend re-checks KYC/whitelist
status is still current (it can go stale between mint and redemption) and that the requested amount
`<= amountGrams` in `Holding`; (3) compliance/ops team approves the physical logistics (shipping/settlement
scheduling) — status moves to `approved`; (4) only once approved does the backend (holding
`REDEMPTION_ROLE`, ideally via a multisig/queued transaction, not a hot single key) call
`burnForRedemption(holder, amount, redemptionId)`, where `redemptionId` is that Mongo document's `_id` —
giving a direct, queryable link from the on-chain burn event back to the full redemption record; (5) the
`BurnedForRedemption` event is what the indexer uses to mark the Mongo `Holding` amount down and the
`RedemptionRequest` status `fulfilled`. Burning before physical fulfillment is confirmed would let a user's
token balance disappear before (or without) them actually receiving the metal — the ordering matters as
much as the permissioning.

---

## Optional — Full-stack week-one note

Ruthless priority order, assuming this codebase as the starting point:
1. **Kill the backdoor + finish MongoDB wiring** (done in this assessment) — nothing else matters if the
   server can be silently remote-controlled or the DB is disconnected.
2. **Land the unified auth strategy end-to-end** (done here for login) and extend it to a route guard on
   `/dashboard` + `/user/me` call on load, so "logged in" is actually enforced, not just "token exists
   somewhere".
3. **Real holdings, one endpoint, one hook** (done here for `GET /api/holdings`) — resist the urge to wire
   every dashboard view at once; prove the pattern on Portfolio Overview first, then repeat it for
   PoR/activity.
4. **Contract roles onto real infra**: get `MINTER_ROLE`/`REDEMPTION_ROLE` onto a multisig or a small
   backend-held signer behind the redemption-approval flow above — before any real deposit ever happens on
   a token holding real value, even on testnet with real users.
5. **helmet + rate-limit + locked-down CORS** — an afternoon of work, disproportionate risk reduction.

---

## Verification

Everything below was actually run, not just described — after neutralizing the backdoor (see §0).

- **TypeScript**: `cd web && npx tsc --noEmit` — clean, no errors.
- **ESLint**: `npx eslint <all changed/added files>` — clean, no errors.
- **Backend, live**: started a local MongoDB via
  `docker run -d --name apax-mongo -p 27017:27017 mongo:7`, ran the Express server with a local `.env`
  (`web/.env`, gitignored — see `web/src/config/config.env.example` for the template), seeded one test user
  directly against Mongo (bypassing the Cloudinary-dependent `/register` endpoint, which is unrelated to
  this assessment), and exercised every path with `curl`:
  - `POST /user/login` wrong password → `401 {"success":false,"message":"Invalid Email or Password"}`
  - `POST /user/login` missing fields → `400 {"success":false,"message":"Please Enter Email And Password"}`
  - `POST /user/login` correct credentials → `200`, JWT in body, **no password hash in the response**
    (confirmed the leak was real before the fix, and gone after).
  - `GET /api/holdings` no token → `401 {"success":false,"message":"Please Login to Access"}`
  - `GET /api/holdings` garbage token → `401 {"success":false,"message":"Invalid authentication token, please login again"}`
  - `GET /api/holdings` valid token → `200` with the gold/silver/platinum-shaped JSON above.
- **Frontend, live, real browser** (via `agent-browser`, Chrome/CDP): opened `/login`, switched to the
  Email tab, submitted wrong credentials → saw the real "Invalid Email or Password" error banner render
  (screenshot taken); corrected the password → JWT confirmed present in `localStorage`
  (`apax_token`), browser navigated to `/dashboard`, dashboard rendered with the (still-mocked, per Task B)
  portfolio cards.
- **Smart contracts**: `cd smart-contracts && npm install && npx hardhat test` — **38 passing** (23
  pre-existing `APAXToken` tests, unmodified and still green, + 15 new `APXGoldToken` tests covering mint,
  burn, and every governed-transfer/pause scenario described above).

Cleaned up after: deleted the seeded test user, stopped the backend/Next.js dev processes, stopped (not
removed) the `apax-mongo` container (`docker start apax-mongo` to bring it back for re-testing).

---

## Files changed / added

```
Removed (security):
  web/src/config/.config.env                    (secrets, deleted + untracked)

Frontend:
  web/app/login/page.tsx                         (real API call, loading/error states, fixed typo)
  web/lib/auth.ts                                (new — token storage)
  web/lib/services/base.api.ts                   (attach Bearer token, generic prefix)
  web/lib/services/holdings.api.ts               (new — GET /api/holdings client)

Backend:
  web/src/models/userModel.ts                    (implemented getJWTToken())
  web/src/middlewares/user_actions/auth.ts       (Bearer header + cookie fallback)
  web/src/utils/sendToken.ts                     (cookie hardening, doc comment)
  web/src/controllers/userController.ts          (removed backdoor, stopped leaking password hash)
  web/src/config/database.ts                     (removed unsupported driver options)
  web/src/index.ts                               (call connectDatabase, register error middleware, mount /api/holdings)
  web/src/middlewares/helpers/errorMiddleware.ts (new — global JSON error handler)
  web/src/models/holdingModel.ts                 (new — Holding schema)
  web/src/controllers/holdingController.ts       (new — GET /api/holdings handler)
  web/src/routes/holdings.ts                      (new — route)
  web/src/services/blockchain.ts                 (removed redundant dotenv.config())
  web/src/config/config.env.example              (clarified — points at web/.env)

Blockchain:
  smart-contracts/contracts/APXGoldToken.sol     (new — compliance-aware metal token)
  smart-contracts/test/APXGoldToken.test.ts      (new — 15 tests)

Repo hygiene:
  .gitignore                                      (explicit **/.config.env rule)
```
