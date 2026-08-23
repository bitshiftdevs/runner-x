# Runnerx — Cross-App Gap Analysis

> **Date:** August 23, 2026
> **Apps:** Backend (Kotlin/GraphQL) · Mobile (Flutter) · Web (Next.js)

---

## 1. Backend Gaps (GraphQL API)

### 1a. Admin API — What exists

| Resolver | Type | Status |
|---|---|---|
| `platformStats` | Query | ✅ Returns all stats in pesewas |
| `allUsers` | Query | ✅ Paginated with `totalCount`, search by name/email |
| `pendingVerifications` | Query | ✅ Returns profiles with `studentIdStatus = pending` |
| `allErrands` | Query | ✅ Paginated with `totalCount`, filterable by status |
| `disputedErrands` | Query | ✅ Returns all disputed errands with profiles |
| `allPayments` | Query | ✅ Paginated with `totalCount`, filterable by status |
| `allWallets` | Query | ✅ Paginated with `totalCount`, includes runner profile |
| `verifyStudentId` | Mutation | ✅ Approve/reject student ID |
| `resolveDispute` | Mutation | ✅ Handles resolution + refund logic |
| `banUser` | Mutation | ✅ Bans user with reason |
| `unbanUser` | Mutation | ✅ Unbans user |
| `forceUpdateErrandStatus` | Mutation | ✅ Force-set any errand status |
| `createPromoCode` | Mutation | ✅ Full CRUD |
| `updatePromoCode` | Mutation | ✅ |
| `deletePromoCode` | Mutation | ✅ |

### 1b. Backend gaps

| Gap | Details |
|---|---|
| **No analytics queries** | No time-series revenue, errand volume, user growth, or category breakdown queries. |
| **No promo code admin queries** | CRUD mutations exist but no `allPromoCodes` list query for admin UI. |

---

## 2. Mobile Gaps (Flutter)

| Gap | Backend Support | Status |
|---|---|---|
| **Admin Dashboard** | ✅ Full admin API | ❌ No mobile admin screens |

The mobile app is otherwise well-covered against the backend API. All major features have corresponding screens.

---

## 3. Web Gaps (Next.js) — Post-Cleanup

> Note: The web app has been repurposed to serve only landing/product pages and the admin dashboard.
> User-facing features have been removed.

### 3a. Admin Dashboard — Current Status

#### ✅ Working

| Feature | Page | Notes |
|---|---|---|
| **Platform Stats** | `/admin/overview` | Revenue, wallet balance, user count, dispute count — all display correctly in pesewas |
| **Verification Queue** | `/admin/verifications` | ✅ **NEW** — Dedicated page with student ID image preview, approve/reject actions |
| **Disputes** | `/admin/disputes` | ✅ **NEW** — Full errand details, requester/runner info, dispute reason, resolution with refund option |
| **Users** | `/admin/users` | List with search, role filter, **ban/unban** actions ✅ |
| **Jobs** | `/admin/jobs` | List with status filter, fee display |
| **Payments** | `/admin/payments` | List with status filter, amount display |
| **Wallets** | `/admin/wallets` | List with runner names, balance display |
| **Pagination** | All list pages | ✅ **NEW** — Backend returns `totalCount` for accurate pagination |

#### ❌ Missing Features

| Feature | Backend Support | Priority |
|---|---|---|
| **Analytics / Insights Dashboard** | ❌ No backend support | 🟡 Medium — revenue over time, errand volume trends, user growth, category breakdown, peak hours |
| **Job Detail / Inspect View** | ✅ `errand(id)` query, `forceUpdateErrandStatus` mutation | 🟡 Medium — view full errand details, force status changes |
| **User Detail / Inspect View** | ✅ `profile(id)` query | 🟢 Low — view full user profile, wallet, errand history |
| **Promo Code Management UI** | ✅ CRUD mutations exist | 🟢 Low — list/create/edit/delete promo codes |

---

## 4. Cross-App Symmetry Matrix

| Feature | Backend | Mobile | Web (Post-Cleanup) |
|---|---|---|---|
| Auth (Google) | ✅ | ✅ | ✅ (admin only) |
| Landing Page | — | — | ✅ |
| About / Product Pages | — | — | ✅ |
| Errand / Quest Board | ✅ | ✅ | ❌ Removed |
| Post Errand / Quest | ✅ | ✅ | ❌ Removed |
| Errand Details | ✅ | ✅ | ❌ Removed |
| Active Missions / Runs | ✅ | ✅ | ❌ Removed |
| Errand History | ✅ | ✅ | ❌ Removed |
| Chat (text) | ✅ | ✅ | ❌ Removed |
| Chat (images/voice) | ✅ | ✅ | ❌ |
| Calling | ✅ | ✅ | ❌ |
| Wallet | ✅ | ✅ | ❌ |
| Withdrawal | ✅ | ✅ | ❌ |
| Payment Methods | ✅ | ✅ | ❌ |
| Earnings Analytics | ✅ | ✅ | ❌ Removed |
| Profile View/Edit | ✅ | ✅ | ❌ Removed |
| Verification | ✅ | ✅ | ✅ Dedicated page with image preview |
| Favorite Runners | ✅ | ✅ | ❌ |
| Rating | ✅ | ✅ | ❌ |
| Notifications (list) | ✅ | ✅ | ❌ Removed |
| Notification Preferences | ✅ | ✅ | ❌ Removed |
| Live Tracking | ✅ | ✅ | ❌ |
| Availability Toggle | ✅ | ✅ | ❌ |
| Delete Account | ✅ | ✅ | ❌ |
| Promo Codes | ✅ | ⚠️ Widget | ❌ |
| **Admin Dashboard** | ✅ | ❌ | ✅ |
| Admin – Platform Stats | ✅ | ❌ | ✅ |
| Admin – Verification Queue | ✅ | ❌ | ✅ Dedicated page with image preview |
| Admin – Dispute Resolution | ✅ | ❌ | ✅ Full details + refund option |
| Admin – User Management | ✅ | ❌ | ✅ Search, ban/unban |
| Admin – Jobs Listing | ✅ | ❌ | ✅ Paginated |
| Admin – Payments Listing | ✅ | ❌ | ✅ Paginated |
| Admin – Wallets Listing | ✅ | ❌ | ✅ With runner names |
| Admin – Analytics / Insights | ❌ | ❌ | ❌ Not implemented |
| Admin – Promo Code Mgmt | ✅ CRUD | ❌ | ❌ Not implemented |
| Waitlist | ✅ | ❌ | ✅ (modal) |

---

## 5. API Contract Status

| Area | Status | Notes |
|---|---|---|
| **Verification image field** | ✅ Fixed | Frontend now queries `idUrl` (student ID) instead of `avatarUrl` (profile photo) |
| **Wallet runner name** | ✅ Fixed | Backend `RunnerWallet` now has `runner` relation via DataLoader |
| **Dispute resolution params** | ✅ Fixed | Backend `resolveDispute` now uses `resolution` and `refundRequester` params |
| **List page totals** | ✅ Fixed | All list queries now return `items` + `totalCount` |
| **Ban/unban** | ✅ Fixed | Added `unbanUser` mutation, Users page has ban/unban actions |

---

## 6. Remaining Action Items

### 🟡 Medium Priority

1. **Analytics / Insights**: Backend needs time-series queries (revenue over time, errand volume, user growth, category breakdown). Frontend needs charts (recharts or similar).
2. **Job Detail View**: Inspect errand details, view requester/runner, force status update via `forceUpdateErrandStatus`.
3. **Frontend pagination UI**: All list pages currently load up to 50 items. Add page controls using `totalCount` now available from backend.

### 🟢 Low Priority

4. **User Detail View**: Inspect full profile, wallet balance, errand history, verification status.
5. **Promo Code Management UI**: List/create/edit/delete promo codes using existing backend CRUD mutations.
6. **Real-time updates**: Consider subscriptions for live stats, new verifications, new disputes.
