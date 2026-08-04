import { gql } from "graphql-request";

/**
 * Backend GraphQL operations used by the Next.js server route handlers.
 * Every operation here is called from a `/api/*` route via `gqlRequest`;
 * client components should NOT import from this file — they hit the REST
 * routes and receive client-shaped JSON via the adapters.
 */

// ── Profile ─────────────────────────────────────────────────────────────

export const PROFILE_QUERY = gql`
  query Profile($id: ID!) {
    profile(id: $id) {
      ...ProfileFields
    }
  }
  fragment ProfileFields on Profile {
    id
    email
    fullName
    avatarUrl
    isAdmin
    studentIdStatus
    defaultCampus
    phoneNumber
    rating
    banned
    createdAt
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id email fullName avatarUrl isAdmin studentIdStatus
      defaultCampus phoneNumber rating banned createdAt
    }
  }
`;

export const UPDATE_PROFILE_PHOTO = gql`
  mutation UpdateProfilePhoto($avatarUrl: String!) {
    updateProfilePhoto(avatarUrl: $avatarUrl) {
      id email fullName avatarUrl isAdmin studentIdStatus
      defaultCampus phoneNumber rating banned createdAt
    }
  }
`;

// ── Errand ──────────────────────────────────────────────────────────────

const ERRAND_FIELDS = `
  id requesterId runnerId title category description
  pickupLat pickupLng deliveryLat deliveryLng
  pickupAddress deliveryAddress urgency
  baseFee distanceFee urgencyFee categoryFee totalFee
  status createdAt expiresAt confirmedAt
  rejectedRunnerIds runnerAcceptedAt trackingLink
  runnerLat runnerLng
`;

const ERRAND_FIELDS_WITH_PROFILES = `
  id requesterId runnerId title category description
  pickupLat pickupLng deliveryLat deliveryLng
  pickupAddress deliveryAddress urgency
  baseFee distanceFee urgencyFee categoryFee totalFee
  status createdAt expiresAt confirmedAt
  rejectedRunnerIds runnerAcceptedAt trackingLink
  runnerLat runnerLng
  requester { id fullName avatarUrl rating }
  runner { id fullName avatarUrl rating }
`;

export const ERRAND_QUERY = gql`
  query Errand($id: ID!) { errand(id: $id) { ${ERRAND_FIELDS_WITH_PROFILES} } }
`;
export const AVAILABLE_ERRANDS = gql`
  query AvailableErrands { availableErrands { ${ERRAND_FIELDS} } }
`;
export const MY_POSTED_ERRANDS = gql`
  query MyPostedErrands { myPostedErrands { ${ERRAND_FIELDS} } }
`;
export const MY_RUNNER_ERRANDS = gql`
  query MyRunnerErrands { myRunnerErrands { ${ERRAND_FIELDS} } }
`;
export const CREATE_ERRAND = gql`
  mutation CreateErrand($input: CreateErrandInput!) {
    createErrand(input: $input) { ${ERRAND_FIELDS} }
  }
`;
export const ACCEPT_ERRAND = gql`
  mutation AcceptErrand($errandId: ID!) {
    acceptErrand(errandId: $errandId) { ${ERRAND_FIELDS_WITH_PROFILES} }
  }
`;
export const UPDATE_ERRAND_STATUS = gql`
  mutation UpdateErrandStatus($errandId: ID!, $status: ErrandStatus!) {
    updateErrandStatus(errandId: $errandId, status: $status) { ${ERRAND_FIELDS_WITH_PROFILES} }
  }
`;
export const DELETE_ERRAND = gql`
  mutation DeleteErrand($errandId: ID!) { deleteErrand(errandId: $errandId) }
`;

// ── Payment ─────────────────────────────────────────────────────────────

const PAYMENT_FIELDS = `
  id errandId userId amount currency channel payer
  providerRef externalRef status createdAt updatedAt
`;

export const MY_PAYMENTS = gql`
  query MyPayments { myPayments { ${PAYMENT_FIELDS} } }
`;
export const PAYMENT_BY_ERRAND = gql`
  query PaymentByErrand($errandId: ID!) {
    paymentByErrand(errandId: $errandId) { ${PAYMENT_FIELDS} }
  }
`;
export const INITIATE_ERRAND_PAYMENT = gql`
  mutation InitiateErrandPayment($errandId: ID!, $channel: String!, $payer: String!) {
    initiateErrandPayment(errandId: $errandId, channel: $channel, payer: $payer) {
      ${PAYMENT_FIELDS}
    }
  }
`;

// ── Wallet ──────────────────────────────────────────────────────────────

export const MY_WALLET = gql`
  query MyWallet {
    myWallet {
      id runnerId availableBalance pendingBalance
      totalEarned totalWithdrawn currency
    }
  }
`;
export const WALLET_TRANSACTIONS = gql`
  query WalletTransactions($limit: Int, $offset: Int) {
    walletTransactions(limit: $limit, offset: $offset) {
      id runnerId errandId type amount status providerRef description createdAt
    }
  }
`;
export const MY_PAYMENT_METHODS = gql`
  query MyPaymentMethods {
    myPaymentMethods {
      id runnerId provider channel phoneNumber accountName status isDefault
    }
  }
`;
export const REQUEST_WITHDRAWAL = gql`
  mutation RequestWithdrawal($amount: Int!, $paymentMethodId: ID!) {
    requestWithdrawal(amount: $amount, paymentMethodId: $paymentMethodId) {
      id runnerId errandId type amount status providerRef description createdAt
    }
  }
`;
export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($channel: String!, $phoneNumber: String!, $accountName: String) {
    addPaymentMethod(channel: $channel, phoneNumber: $phoneNumber, accountName: $accountName) {
      id runnerId provider channel phoneNumber accountName status isDefault
    }
  }
`;
export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemovePaymentMethod($id: ID!) { removePaymentMethod(id: $id) }
`;

// ── Chat ────────────────────────────────────────────────────────────────

const MESSAGE_FIELDS = `
  id errandId senderId content imageUrl audioUrl messageType createdAt
`;
export const CHAT_MESSAGES = gql`
  query ChatMessages($errandId: ID!) { chatMessages(errandId: $errandId) { ${MESSAGE_FIELDS} } }
`;
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { ${MESSAGE_FIELDS} }
  }
`;

// ── Notifications ───────────────────────────────────────────────────────

const NOTIF_FIELDS = `
  pushEnabled smsEnabled
  notifyFoodErrands notifyAcademicErrands notifyDeliveryErrands notifyGeneralErrands
  notifyErrandAccepted notifyErrandStatusChange notifyErrandCompleted notifyErrandCancelled
  notifyPaymentReceived notifyPromotions
`;
export const MY_NOTIFICATION_PREFERENCES = gql`
  query MyNotificationPreferences { myNotificationPreferences { ${NOTIF_FIELDS} } }
`;
export const UPDATE_NOTIFICATION_PREFERENCES = gql`
  mutation UpdateNotificationPreferences($input: NotificationPreferencesInput!) {
    updateNotificationPreferences(input: $input) { ${NOTIF_FIELDS} }
  }
`;

// ── Admin ───────────────────────────────────────────────────────────────

export const ALL_USERS = gql`
  query AllUsers($search: String, $page: Int, $size: Int) {
    allUsers(search: $search, page: $page, size: $size) {
      id email fullName avatarUrl isAdmin studentIdStatus
      defaultCampus phoneNumber rating banned createdAt
    }
  }
`;
export const PENDING_VERIFICATIONS = gql`
  query PendingVerifications {
    pendingVerifications {
      id fullName phoneNumber avatarUrl defaultCampus createdAt
    }
  }
`;
export const ALL_ERRANDS = gql`
  query AllErrands($status: ErrandStatus, $page: Int, $size: Int) {
    allErrands(status: $status, page: $page, size: $size) { ${ERRAND_FIELDS} }
  }
`;
export const DISPUTED_ERRANDS = gql`
  query DisputedErrands { disputedErrands { ${ERRAND_FIELDS} } }
`;
export const PLATFORM_STATS = gql`
  query PlatformStats {
    platformStats { totalUsers totalErrands activeErrands completedErrands totalRevenue }
  }
`;
export const VERIFY_STUDENT_ID = gql`
  mutation VerifyStudentId($userId: ID!, $status: VerificationStatus!) {
    verifyStudentId(userId: $userId, status: $status) {
      id fullName avatarUrl studentIdStatus
    }
  }
`;
export const RESOLVE_DISPUTE = gql`
  mutation ResolveDispute($errandId: ID!, $resolution: String!, $refundRequester: Boolean!) {
    resolveDispute(errandId: $errandId, resolution: $resolution, refundRequester: $refundRequester) {
      ${ERRAND_FIELDS}
    }
  }
`;
export const BAN_USER = gql`
  mutation BanUser($userId: ID!, $reason: String!) {
    banUser(userId: $userId, reason: $reason) {
      id fullName banned
    }
  }
`;

// ── Storage ─────────────────────────────────────────────────────────────

export const GENERATE_UPLOAD_URL = gql`
  mutation GenerateUploadUrl($bucket: String!, $fileName: String!) {
    generateUploadUrl(bucket: $bucket, fileName: $fileName) {
      uploadUrl publicUrl filePath
    }
  }
`;

export const GENERATE_DOWNLOAD_URL = gql`
  mutation GenerateDownloadUrl($bucket: String!, $filePath: String!) {
    generateDownloadUrl(bucket: $bucket, filePath: $filePath)
  }
`;
