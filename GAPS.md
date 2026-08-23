# Runnerx — Cross-App Gap Analysis

> **Date:** August 23, 2026
> **Apps:** Backend (Kotlin/GraphQL) · Mobile (Flutter) · Web (Next.js)

---

## 1. Backend Gaps (GraphQL API)

### 1a. Admin API — What exists

| Resolver | Type | Status |
|---|---|---|
| `platformStats` | Query | ✅ Returns all stats in pesewas |
| `analyticsStats` | Query | ✅ 30-day time-series: revenue, errands, users, category breakdown |
| `allUsers` | Query | ✅ Paginated with `totalCount`, search by name/email |
| `pendingVerifications` | Query | ✅ Returns profiles with `studentIdStatus = pending` |
| `allErrands` | Query | ✅ Paginated with `totalCount`, filterable by status |
| `disputedErrands` | Query | ✅ Returns all disputed errands with profiles + disputeReason |
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
| **Analytics / Insights** | `/admin/analytics` | ✅ 30-day charts: revenue over time, errand volume, new users, category breakdown |
| **Verification Queue** | `/admin/verifications` | ✅ Dedicated page with student ID image preview, approve/reject actions |
| **Disputes** | `/admin/disputes` | ✅ Full errand details, requester/runner info, dispute reason, resolution with refund option |
| **Users** | `/admin/users` | ✅ Paginated, search by name/email, role filter, ban/unban actions |
| **Jobs** | `/admin/jobs` | ✅ Paginated, status filter, clickable rows → detail page |
| **Job Detail** | `/admin/jobs/[id]` | ✅ Full errand details, participants, force status update with confirmation |
| **Payments** | `/admin/payments` | ✅ Paginated, status filter |
| **Wallets** | `/admin/wallets` | ✅ Paginated, runner names displayed |

#### ❌ Missing Features

| Feature | Backend Support | Priority |
|---|---|---|
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
| Admin – Analytics / Insights | ✅ | ❌ | ✅ 30-day charts |
| Admin – Verification Queue | ✅ | ❌ | ✅ Dedicated page with image preview |
| Admin – Dispute Resolution | ✅ | ❌ | ✅ Full details + refund option |
| Admin – User Management | ✅ | ❌ | ✅ Paginated, search, ban/unban |
| Admin – Jobs Listing | ✅ | ❌ | ✅ Paginated, clickable → detail page |
| Admin – Job Detail / Force Status | ✅ | ❌ | ✅ |
| Admin – Payments Listing | ✅ | ❌ | ✅ Paginated |
| Admin – Wallets Listing | ✅ | ❌ | ✅ With runner names |
| Admin – Promo Code Mgmt | ✅ CRUD | ❌ | ❌ Not implemented |
| Waitlist | ✅ | ❌ | ✅ (modal) |

---

## 5. API Contract Status

| Area | Status | Notes |
|---|---|---|
| **Verification image field** | ✅ Fixed | Frontend queries `idUrl` (student ID) instead of `avatarUrl` (profile photo) |
| **Wallet runner name** | ✅ Fixed | Backend `RunnerWallet` has `runner` relation via DataLoader |
| **Dispute resolution params** | ✅ Fixed | Backend `resolveDispute` uses `resolution` and `refundRequester` params |
| **List page totals** | ✅ Fixed | All list queries return `items` + `totalCount` |
| **Ban/unban** | ✅ Fixed | Added `unbanUser` mutation, Users page has ban/unban actions |
| **Analytics** | ✅ Fixed | Added `analyticsStats` query with 30-day time-series data |
| **Money in pesewas** | ✅ Fixed | All backend queries return pesewas, frontend `formatCurrency` converts at display boundary |

---

## 6. Remaining Action Items

### 🟢 Low Priority

1. **User Detail View**: Inspect full profile, wallet balance, errand history, verification status.
2. **Promo Code Management UI**: List/create/edit/delete promo codes using existing backend CRUD mutations.
3. **Real-time updates**: Consider subscriptions for live stats, new verifications, new disputes.
