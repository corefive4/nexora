import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Gift,
  Home,
  Menu,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

import HomePage from "./nexora/pages/HomePage";
import InvestPage from "./nexora/pages/InvestPage";
import EarnPage from "./nexora/pages/EarnPage";
import FriendsPage from "./nexora/pages/FriendsPage";
import AccountPage from "./nexora/pages/AccountPage";

import type {
  Activity,
  EarnTask,
  Investment,
  InvestmentPlan,
  Page,
  ReferralLevel,
  ReferralStats,
  Toast,
  ToastType,
  UserProfile,
  Wallet,
} from "./nexora/types";

import {
  authenticateTelegram,
  clearSession,
  createInvestment,
  getDepositAddress,
  getInvestmentPlans,
  getStoredSession,
  getWallet,
} from "./lib/nexora-api";

import { money } from "./nexora/theme";
import { ToastMessage } from "./nexora/ui";

const DEFAULT_REFERRAL_LEVELS: ReferralLevel[] = [
  {
    level: 1,
    name: "Starter",
    requirement: 0,
    rewardRate: 5,
    description:
      "Earn rewards from your direct referrals.",
  },
  {
    level: 2,
    name: "Builder",
    requirement: 5,
    rewardRate: 7,
    description:
      "Unlock a higher demo referral rate.",
  },
  {
    level: 3,
    name: "Leader",
    requirement: 15,
    rewardRate: 10,
    description:
      "Reach the highest demo referral level.",
  },
];

const DEFAULT_EARN_TASKS: EarnTask[] = [
  {
    id: "daily-checkin",
    title: "Daily check-in",
    description:
      "Open Nexora and complete your daily activity.",
    reward: 0.25,
    currency: "USDT",
    type: "daily",
    completed: false,
    claimed: false,
    available: true,
    actionLabel: "Claim",
  },
  {
    id: "complete-profile",
    title: "Complete your profile",
    description:
      "Keep your Nexora profile information complete.",
    reward: 0.5,
    currency: "USDT",
    type: "profile",
    completed: false,
    claimed: false,
    available: true,
    actionLabel: "Claim",
  },
  {
    id: "invite-friend",
    title: "Invite a friend",
    description:
      "Share your Nexora referral link with a friend.",
    reward: 1,
    currency: "USDT",
    type: "referral",
    completed: false,
    claimed: false,
    available: true,
    actionLabel: "Claim",
  },
];

function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

function getTelegramUser() {
  return getTelegramWebApp()?.initDataUnsafe?.user;
}

function getInitData(): string {
  return getTelegramWebApp()?.initData ?? "";
}

function readString(
  value: unknown,
  keys: string[],
): string | undefined {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return undefined;
  }

  const record =
    value as Record<string, unknown>;

  for (const key of keys) {
    if (
      typeof record[key] === "string" &&
      record[key]
    ) {
      return record[key] as string;
    }
  }

  return undefined;
}

function readNumber(
  value: unknown,
  keys: string[],
): number | undefined {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return undefined;
  }

  const record =
    value as Record<string, unknown>;

  for (const key of keys) {
    const raw = record[key];

    if (
      typeof raw === "number" &&
      Number.isFinite(raw)
    ) {
      return raw;
    }

    if (typeof raw === "string") {
      const parsed = Number(raw);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function readObject(
  value: unknown,
  keys: string[],
): Record<string, unknown> | null {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  const record =
    value as Record<string, unknown>;

  for (const key of keys) {
    const candidate = record[key];

    if (
      typeof candidate === "object" &&
      candidate !== null
    ) {
      return candidate as Record<
        string,
        unknown
      >;
    }
  }

  return null;
}

function normalizeProfile(
  value: unknown,
): UserProfile | null {
  const source =
    readObject(value, [
      "profile",
      "user",
      "data",
    ]) ??
    (typeof value === "object" &&
    value !== null
      ? (value as Record<
          string,
          unknown
        >)
      : null);

  if (!source) {
    return null;
  }

  const id = readString(source, [
    "id",
    "userId",
    "user_id",
  ]);

  if (!id) {
    return null;
  }

  return {
    id,
    telegramId:
      readString(source, [
        "telegramId",
        "telegram_id",
      ]) ??
      readNumber(source, [
        "telegramId",
        "telegram_id",
      ]),
    username:
      readString(source, [
        "username",
      ]),
    firstName:
      readString(source, [
        "firstName",
        "first_name",
      ]),
    lastName:
      readString(source, [
        "lastName",
        "last_name",
      ]),
    displayName:
      readString(source, [
        "displayName",
        "display_name",
      ]),
    photoUrl:
      readString(source, [
        "photoUrl",
        "photo_url",
      ]),
    referralCode:
      readString(source, [
        "referralCode",
        "referral_code",
      ]),
    referredBy:
      readString(source, [
        "referredBy",
        "referred_by",
      ]),
    createdAt:
      readString(source, [
        "createdAt",
        "created_at",
      ]),
    updatedAt:
      readString(source, [
        "updatedAt",
        "updated_at",
      ]),
  };
}

function normalizeWallet(
  value: unknown,
): Wallet | null {
  const source =
    readObject(value, [
      "wallet",
      "data",
    ]) ??
    (typeof value === "object" &&
    value !== null
      ? (value as Record<
          string,
          unknown
        >)
      : null);

  if (!source) {
    return null;
  }

  return {
    id: readString(source, ["id"]),
    userId: readString(source, [
      "userId",
      "user_id",
    ]),
    currency:
      readString(source, [
        "currency",
      ]) ?? "USDT",
    balance:
      readNumber(source, [
        "balance",
      ]) ?? 0,
    availableBalance:
      readNumber(source, [
        "availableBalance",
        "available_balance",
      ]),
    investedBalance:
      readNumber(source, [
        "investedBalance",
        "invested_balance",
      ]),
    totalEarnings:
      readNumber(source, [
        "totalEarnings",
        "total_earnings",
      ]),
    totalDeposits:
      readNumber(source, [
        "totalDeposits",
        "total_deposits",
      ]),
    totalWithdrawals:
      readNumber(source, [
        "totalWithdrawals",
        "total_withdrawals",
      ]),
    totalInvested:
      readNumber(source, [
        "totalInvested",
        "total_invested",
      ]),
    address:
      readString(source, [
        "address",
      ]),
    network:
      readString(source, [
        "network",
      ]),
    updatedAt:
      readString(source, [
        "updatedAt",
        "updated_at",
      ]),
  };
}

function normalizeInvestment(
  value: unknown,
): Investment | null {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  const source =
    value as Record<string, unknown>;

  const id = readString(source, [
    "id",
  ]);

  const planId = readString(source, [
    "planId",
    "plan_id",
  ]);

  if (!id || !planId) {
    return null;
  }

  return {
    id,
    userId: readString(source, [
      "userId",
      "user_id",
    ]),
    planId,
    planName:
      readString(source, [
        "planName",
        "plan_name",
      ]),
    amount:
      readNumber(source, [
        "amount",
      ]),
    principal:
      readNumber(source, [
        "principal",
      ]),
    currency:
      readString(source, [
        "currency",
      ]),
    dailyRate:
      readNumber(source, [
        "dailyRate",
        "daily_rate",
      ]),
    rate:
      readNumber(source, [
        "rate",
      ]),
    durationDays:
      readNumber(source, [
        "durationDays",
        "duration_days",
      ]),
    duration:
      readNumber(source, [
        "duration",
      ]),
    expectedProfit:
      readNumber(source, [
        "expectedProfit",
        "expected_profit",
      ]),
    profit:
      readNumber(source, [
        "profit",
      ]),
    returnAmount:
      readNumber(source, [
        "returnAmount",
        "return_amount",
      ]),
    expectedReturn:
      readNumber(source, [
        "expectedReturn",
        "expected_return",
      ]),
    totalReturn:
      readNumber(source, [
        "totalReturn",
        "total_return",
      ]),
    startedAt:
      readString(source, [
        "startedAt",
        "started_at",
      ]),
    startDate:
      readString(source, [
        "startDate",
        "start_date",
      ]),
    maturityAt:
      readString(source, [
        "maturityAt",
        "maturity_at",
      ]),
    endDate:
      readString(source, [
        "endDate",
        "end_date",
      ]),
    status:
      readString(source, [
        "status",
      ]) ?? "pending",
    createdAt:
      readString(source, [
        "createdAt",
        "created_at",
      ]),
    updatedAt:
      readString(source, [
        "updatedAt",
        "updated_at",
      ]),
  };
}

export default function App() {
  const [page, setPage] =
    useState<Page>("home");

  const [loading, setLoading] =
    useState(true);

  const [sessionToken, setSessionToken] =
    useState<string | null>(
      getStoredSession(),
    );

  const [profile, setProfile] =
    useState<UserProfile | null>(
      null,
    );

  const [wallet, setWallet] =
    useState<Wallet | null>(null);

  const [plans, setPlans] =
    useState<InvestmentPlan[]>([]);

  const [investments, setInvestments] =
    useState<Investment[]>([]);

  const [activities] =
    useState<Activity[]>([]);

  const [referralStats] =
    useState<ReferralStats | null>(
      null,
    );

  const [referralLevels] =
    useState<ReferralLevel[]>(
      DEFAULT_REFERRAL_LEVELS,
    );

  const [earnTasks, setEarnTasks] =
    useState<EarnTask[]>(
      DEFAULT_EARN_TASKS,
    );

  const [toast, setToast] =
    useState<Toast | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const telegramUser =
    getTelegramUser();

  const displayName =
    profile?.displayName ||
    [
      profile?.firstName,
      profile?.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    telegramUser?.first_name ||
    telegramUser?.username ||
    "Nexora User";

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
    ) => {
      const id =
        `${Date.now()}-${Math.random()}`;

      setToast({
        id,
        message,
        type,
      });

      window.setTimeout(() => {
        setToast((current) =>
          current?.id === id
            ? null
            : current,
        );
      }, 3500);
    },
    [],
  );

  const loadDashboard =
    useCallback(
      async (
        token: string,
      ) => {
        try {
          const [
            walletResult,
            plansResult,
          ] = await Promise.all([
            getWallet(token),
            getInvestmentPlans(),
          ]);

          setWallet(
            normalizeWallet(
              walletResult,
            ),
          );

          setPlans(plansResult);
        } catch (error) {
          console.error(
            "Nexora dashboard error:",
            error,
          );

          showToast(
            "Unable to load the Nexora dashboard.",
            "error",
          );
        }
      },
      [showToast],
    );

  useEffect(() => {
    const webApp =
      getTelegramWebApp();

    webApp?.ready();
    webApp?.expand();

    let cancelled = false;

    const initialize =
      async () => {
        try {
          const stored =
            getStoredSession();

          if (stored) {
            setSessionToken(stored);

            await loadDashboard(
              stored,
            );

            if (!cancelled) {
              setLoading(false);
            }

            return;
          }

          const initData =
            getInitData();

          if (!initData) {
            setLoading(false);
            return;
          }

          const result =
            await authenticateTelegram(
              initData,
            );

          const token =
            readString(result, [
              "sessionToken",
              "session_token",
              "token",
            ]) ??
            getStoredSession();

          if (token) {
            setSessionToken(token);

            const nextProfile =
              normalizeProfile(
                result,
              );

            if (nextProfile) {
              setProfile(
                nextProfile,
              );
            }

            await loadDashboard(
              token,
            );
          } else {
            showToast(
              "Telegram authentication could not be completed.",
              "error",
            );
          }
        } catch (error) {
          console.error(
            "Nexora initialization error:",
            error,
          );

          showToast(
            "Unable to initialize Nexora.",
            "error",
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [loadDashboard, showToast]);

  const handleNavigate =
    useCallback((nextPage: Page) => {
      setPage(nextPage);
      setMenuOpen(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, []);

  const handleDeposit =
    useCallback(async () => {
      if (!sessionToken) {
        showToast(
          "Please connect your Telegram session first.",
          "error",
        );
        return;
      }

      try {
        const address =
          await getDepositAddress(
            sessionToken,
          );

        if (!address?.address) {
          showToast(
            "No demo deposit address is available yet.",
            "info",
          );
          return;
        }

        const text =
          `${address.network} · ${address.currency}\n${address.address}`;

        try {
          await navigator.clipboard.writeText(
            address.address,
          );

          showToast(
            `Demo deposit address copied: ${text}`,
            "success",
          );
        } catch {
          showToast(
            text,
            "info",
          );
        }
      } catch (error) {
        console.error(
          "Deposit address error:",
          error,
        );

        showToast(
          "Unable to load the deposit address.",
          "error",
        );
      }
    }, [
      sessionToken,
      showToast,
    ]);

  const handleInvest =
    useCallback(
      async (
        planId: string,
        amount: number,
      ): Promise<Investment | null> => {
        try {
          const created =
            await createInvestment(
              planId,
              amount,
              sessionToken ??
                undefined,
            );

          const normalized =
            normalizeInvestment(
              created,
            );

          if (!normalized) {
            showToast(
              "Investment was created but the response could not be displayed.",
              "warning",
            );

            return null;
          }

          setInvestments(
            (current) => [
              normalized,
              ...current,
            ],
          );

          if (sessionToken) {
            await loadDashboard(
              sessionToken,
            );
          }

          showToast(
            `Demo investment created for ${money(
              amount,
              wallet?.currency ??
                "USDT",
            )}.`,
            "success",
          );

          return normalized;
        } catch (error) {
          console.error(
            "Investment error:",
            error,
          );

          showToast(
            error instanceof Error
              ? error.message
              : "Unable to create the investment.",
            "error",
          );

          return null;
        }
      },
      [
        loadDashboard,
        sessionToken,
        showToast,
        wallet?.currency,
      ],
    );

  const handleClaim =
    useCallback(
      async (
        taskId: string,
      ): Promise<boolean> => {
        setEarnTasks((current) =>
          current.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: true,
                  claimed: true,
                  available: false,
                }
              : task,
          ),
        );

        showToast(
          "Demo reward claimed.",
          "success",
        );

        return true;
      },
      [showToast],
    );

  const handleCopyReferral =
    useCallback(async () => {
      const code =
        referralStats?.referralCode ??
        profile?.referralCode ??
        "NEXORA";

      const link =
        referralStats?.referralLink ??
        `https://t.me/NexoraGrowBot?start=ref_${code}`;

      try {
        await navigator.clipboard.writeText(
          link,
        );

        showToast(
          "Referral link copied.",
          "success",
        );
      } catch {
        showToast(
          link,
          "info",
        );
      }
    }, [
      profile?.referralCode,
      referralStats?.referralCode,
      referralStats?.referralLink,
      showToast,
    ]);

  const handleShareReferral =
    useCallback(() => {
      const code =
        referralStats?.referralCode ??
        profile?.referralCode ??
        "NEXORA";

      const link =
        referralStats?.referralLink ??
        `https://t.me/NexoraGrowBot?start=ref_${code}`;

      const shareUrl =
        `https://t.me/share/url?url=${encodeURIComponent(
          link,
        )}&text=${encodeURIComponent(
          "Join me on Nexora — Grow Together.",
        )}`;

      window.open(
        shareUrl,
        "_blank",
      );
    }, [
      profile?.referralCode,
      referralStats?.referralCode,
      referralStats?.referralLink,
    ]);

  const handleLogout =
    useCallback(() => {
      clearSession();

      setSessionToken(null);
      setProfile(null);
      setWallet(null);
      setInvestments([]);
      setPage("home");

      showToast(
        "You have been logged out.",
        "success",
      );
    }, [showToast]);

  const navigation = useMemo(
    () => [
      {
        id: "home" as Page,
        label: "Home",
        icon: Home,
      },
      {
        id: "invest" as Page,
        label: "Invest",
        icon: TrendingUp,
      },
      {
        id: "earn" as Page,
        label: "Earn",
        icon: Gift,
      },
      {
        id: "friends" as Page,
        label: "Friends",
        icon: Users,
      },
      {
        id: "account" as Page,
        label: "Account",
        icon: UserRound,
      },
    ],
    [],
  );

  const renderPage = () => {
    switch (page) {
      case "invest":
        return (
          <InvestPage
            plans={plans}
            wallet={wallet}
            investments={investments}
            onNavigate={handleNavigate}
            onInvest={handleInvest}
          />
        );

      case "earn":
        return (
          <EarnPage
            wallet={wallet}
            tasks={earnTasks}
            onNavigate={handleNavigate}
            onClaim={handleClaim}
            onToast={showToast}
          />
        );

      case "friends":
        return (
          <FriendsPage
            profile={profile}
            referralStats={
              referralStats
            }
            levels={referralLevels}
            onNavigate={handleNavigate}
            onCopyReferral={
              handleCopyReferral
            }
            onShareReferral={
              handleShareReferral
            }
            onToast={showToast}
          />
        );

      case "account":
        return (
          <AccountPage
            profile={profile}
            wallet={wallet}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onToast={showToast}
          />
        );

      case "home":
      default:
        return (
          <HomePage
            wallet={wallet}
            plans={plans}
            investments={investments}
            activities={activities}
            onNavigate={handleNavigate}
            onDeposit={handleDeposit}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="nx-app nx-app--loading">
        <div className="nx-loading-screen">
          <div className="nx-brand-mark">
            N
          </div>

          <div className="nx-loading-copy">
            <strong>Nexora</strong>
            <span>
              Grow Together
            </span>
          </div>

          <div className="nx-loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="nx-app">
      <header className="nx-topbar">
        <button
          type="button"
          className="nx-brand"
          onClick={() =>
            handleNavigate("home")
          }
          aria-label="Nexora home"
        >
          <span className="nx-brand__mark">
            N
          </span>

          <span className="nx-brand__text">
            <strong>Nexora</strong>
            <small>
              Grow Together
            </small>
          </span>
        </button>

        <div className="nx-topbar__user">
          <span>{displayName}</span>

          <button
            type="button"
            className="nx-menu-toggle"
            onClick={() =>
              setMenuOpen(
                (current) => !current,
              )
            }
            aria-label="Open navigation"
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="nx-mobile-menu">
          <div className="nx-mobile-menu__inner">
            {navigation.map(
              (item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nx-mobile-nav-item ${
                      page === item.id
                        ? "is-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleNavigate(
                        item.id,
                      )
                    }
                  >
                    <Icon size={19} />
                    <span>
                      {item.label}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      ) : null}

      <main className="nx-main">
        {renderPage()}
      </main>

      <nav className="nx-bottom-nav">
        {navigation.map(
          (item) => {
            const Icon = item.icon;
            const active =
              page === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`nx-bottom-nav__item ${
                  active
                    ? "is-active"
                    : ""
                }`}
                onClick={() =>
                  handleNavigate(
                    item.id,
                  )
                }
              >
                <span>
                  <Icon size={19} />
                </span>

                <small>
                  {item.label}
                </small>
              </button>
            );
          },
        )}
      </nav>

      {toast ? (
        <div className="nx-toast-container">
          <ToastMessage
            message={toast.message}
            type={toast.type}
          />
        </div>
      ) : null}
    </div>
  );
}
