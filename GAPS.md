# Runnerx — Cross-App Gap Analysis

> **Date:** August 23, 2026
> **Apps:** Backend (Kotlin/GraphQL) · Mobile (Flutter) · Web (Next.js)

---

## 1. Backend Gaps (GraphQL API)

> ✅ All admin queries implemented. No remaining backend gaps.

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

### 3a. Web Admin Status

| Feature | Status |
|---|---|
| Admin – Platform Stats | ✅ All fields populated |
| Admin – Payments Listing | ✅ Implemented |
| Admin – Wallets Listing | ✅ Implemented |
| Admin – Verification Queue | ✅ Implemented |
| Admin – Dispute Resolution | ✅ Implemented |
| Admin – User Management | ✅ Implemented |
| Admin – Jobs Listing | ✅ Implemented |
| Waitlist Page | ⚠️ API exists, no dedicated UI (modal on landing page) |

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
| Admin – Platform Stats | ✅ | ❌ | ✅ |
| Admin – Payments Listing | ✅ | ❌ | ✅ |
| Admin – Wallets Listing | ✅ | ❌ | ✅ |
| Waitlist | ✅ | ❌ | ✅ (modal) |

---

## 5. Remaining Action Items

### 🟡 Medium Priority

1. **Mobile**: Decide whether to add admin dashboard screens or leave admin web-only
2. **Mobile**: Add promo code application UI (currently only a widget)

### 🟢 Low Priority

1. **Web**: Add dedicated waitlist landing page (currently a modal on landing page)
