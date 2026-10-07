export type Page =
  | "home"
  | "invest"
  | "earn"
  | "friends"
  | "account";

export type ActivityType =
  | "deposit"
  | "investment"
  | "earning"
  | "withdrawal"
  | "referral"
  | "bonus";

export type InvestmentStatus =
  | "pending"
  | "active"
  | "completed"
  | "matured"
  | "cancelled";

export type EarnTaskType =
  | "daily"
  | "social"
  | "referral"
  | "profile"
  | "bonus";

export type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning";

export type InvestmentPlan = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  dailyRate: number;
  rate?: number;
  durationDays: number;
  duration?: number;
  minAmount: number;
  maxAmount?: number | null;
  currency?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type Wallet = {
  id?: string;
  userId?: string;
  currency: string;
  balance: number;
  availableBalance?: number;
  investedBalance?: number;
  totalEarnings?: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  totalInvested?: number;
  address?: string;
  network?: string;
  updatedAt?: string;
};

export type Investment = {
  id: string;
  userId?: string;
  planId: string;
  planName?: string;
  amount?: number;
  principal?: number;
  currency?: string;
  dailyRate?: number;
  rate?: number;
  durationDays?: number;
  duration?: number;
  expectedProfit?: number;
  profit?: number;
  returnAmount?: number;
  expectedReturn?: number;
  totalReturn?: number;
  startedAt?: string;
  startDate?: string;
  maturityAt?: string;
  endDate?: string;
  status: InvestmentStatus | string;
  createdAt?: string;
  updatedAt?: string;
};

export type Activity = {
  id: string;
  type: ActivityType;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
  timestamp?: string;
};

export type EarnTask = {
  id: string;
  title: string;
  description: string;
  reward: number;
  currency?: string;
  type: EarnTaskType;
  icon?: string;
  completed?: boolean;
  claimed?: boolean;
  available?: boolean;
  actionLabel?: string;
};

export type ReferralLevel = {
  level: number;
  name: string;
  requirement: number;
  rewardRate: number;
  description?: string;
};

export type ReferralStats = {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals?: number;
  totalEarned: number;
  currency?: string;
  referralCode?: string;
  referralLink?: string;
};

export type UserProfile = {
  id: string;
  telegramId?: number | string;
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoUrl?: string;
  referralCode?: string;
  referredBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export type AccountMenuItem = {
  id:
    | "profile"
    | "wallet"
    | "investments"
    | "security"
    | "support";
  label: string;
  description?: string;
  icon?: string;
};

export type PortfolioPoint = {
  date: string;
  value: number;
};

export type DepositAddress = {
  id: string;
  network: string;
  currency: string;
  address: string;
  status: string;
  label?: string;
  createdAt?: string;
};
