# Runnerx — Cross-App Gap Analysis

> **Date:** August 23, 2026
> **Apps:** Backend (Kotlin/GraphQL) · Mobile (Flutter) · Web (Next.js)

---

## 1. Backend Gaps (GraphQL API)

| Gap | Description | Impact |
|---|---|---|
| `allPayments` admin query | Web stub returns empty — no way to list all payments admin-side | 🔴 Admin dashboard incomplete |
| `allWallets` admin query | Web stub returns empty — no way to list all wallets admin-side | 🔴 Admin dashboard incomplete |
| `dailyJobs` in `platformStats` | Returns hardcoded `0` | 🟡 Stats incomplete |
| `pendingVerifications` count | Returns hardcoded `0` in stats | 🟡 Stats incomplete |
| `activeDisputes` count | Returns hardcoded `0` in stats | 🟡 Stats incomplete |
| `totalPayments` count | Returns hardcoded `0` in stats | 🟡 Stats incomplete |
| `totalWalletBalance` | Returns hardcoded `0` in stats | 🟡 Stats incomplete |
| `activeWallets` count | Returns hardcoded `0` in stats | 🟡 Stats incomplete |

---

## 2. Mobile Gaps (Flutter)

| Gap | Backend Support | Status |
|---|---|---|
| **Admin Dashboard** | ✅ Full admin API | ❌ No mobile admin screens |

The mobile app is otherwise well-covered against the backend API. All major features have corresponding screens.

---

## 3. Web Gaps (Next.js) — Pre-Cleanup

> Note: The web app is being repurposed to serve only landing/product pages and the admin dashboard.
> User-facing features below are being removed.

### 3a. Missing Settings Sub-Pages (linked but never created)

| Route | Linked From | Status |
|---|---|---|
| `/settings/appearance` | Settings page | ❌ Missing |
| `/settings/language` | Settings page | ❌ Missing |
| `/settings/notifications` | Settings page | ❌ Missing |
| `/settings/phone` | Settings page | ❌ Missing |
| `/settings/privacy` | Settings page | ❌ Missing |
| `/settings/help` | Settings page | ❌ Missing |

### 3b. Features Present in Mobile but Missing from Web

| Feature | Mobile | Web | Backend |
|---|---|---|---|
| Wallet / Withdrawal | ✅ | ❌ | ✅ |
| Favorite Runners | ✅ | ❌ | ✅ |
| Rating Flow | ✅ | ❌ | ✅ |
| Payment Methods CRUD | ✅ | ❌ | ✅ |
| Live Tracking Map | ✅ | ❌ | ✅ |
| Chat (images/voice) | ✅ | ❌ Text only | ✅ |
| Calling | ✅ | ❌ | ✅ |
| Availability Toggle | ✅ | ❌ | ✅ |
| Delete Account | ✅ | ❌ | ✅ |
| Promo Code Application | ✅ | ❌ | ✅ |
| Notification Preferences (persisted) | ✅ | ⚠️ Local only | ✅ |

### 3c. Web Admin Gaps

| Gap | Status |
|---|---|
| Admin – Payments Listing | ❌ API stub returns empty |
| Admin – Wallets Listing | ❌ API stub returns empty |
| Admin – Platform Stats | ⚠️ Many fields hardcoded to `0` |
| Waitlist Page | ⚠️ API exists, no UI |

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
| Verification | ✅ | ✅ | ✅ (admin reviews) |
| Favorite Runners | ✅ | ✅ | ❌ |
| Rating | ✅ | ✅ | ❌ |
| Notifications (list) | ✅ | ✅ | ❌ Removed |
| Notification Preferences | ✅ | ✅ | ❌ Removed |
| Live Tracking | ✅ | ✅ | ❌ |
| Availability Toggle | ✅ | ✅ | ❌ |
| Delete Account | ✅ | ✅ | ❌ |
| Promo Codes | ✅ | ⚠️ Widget | ❌ |
| Admin Dashboard | ✅ | ❌ | ✅ |
| Admin – Verification Queue | ✅ | ❌ | ✅ |
| Admin – Dispute Resolution | ✅ | ❌ | ✅ |
| Admin – User Management | ✅ | ❌ | ✅ |
| Admin – Platform Stats | ✅ | ❌ | ⚠️ Partial |
| Admin – Payments Listing | ✅ | ❌ | ❌ Stub |
| Admin – Wallets Listing | ✅ | ❌ | ❌ Stub |
| Waitlist | ✅ | ❌ | ⚠️ API only |

---

## 5. Priority Action Items

### 🔴 High Priority

1. **Backend**: Implement `allPayments` and `allWallets` admin queries
2. **Backend**: Fill in hardcoded `0`s in `platformStats` with real DB queries
3. **Web**: Remove all user-facing pages (quests, missions, earnings, inbox, notifications, profile, settings)
4. **Web**: Remove user-facing API routes (jobs, messages, notifications, payments, wallet, profile, storage)
5. **Web**: Remove user-facing stores (`quest.store.ts`) and components

### 🟡 Medium Priority

6. **Mobile**: Decide whether to add admin dashboard screens or leave admin web-only
7. **Web**: Complete admin payments and wallets tabs once backend queries land
8. **Web**: Wire up platformStats to return real values

### 🟢 Low Priority

9. **Web**: Add waitlist landing page
10. **Mobile**: Add promo code application UI (currently only a widget)
