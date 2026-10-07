import {
  ChevronRight,
  CircleHelp,
  Copy,
  ExternalLink,
  FileText,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";
import type {
  Page,
  UserProfile,
  Wallet,
} from "../types";
import { money, truncateAddress } from "../theme";

type AccountPageProps = {
  profile: UserProfile | null;
  wallet: Wallet | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
  ) => void;
};

const menuItems = [
  {
    id: "wallet",
    label: "Wallet",
    description: "Balance, address & transactions",
    icon: WalletCards,
  },
  {
    id: "investments",
    label: "My investments",
    description: "Track your active investments",
    icon: Zap,
  },
  {
    id: "security",
    label: "Security",
    description: "Account and session protection",
    icon: LockKeyhole,
  },
  {
    id: "support",
    label: "Help & support",
    description: "Get assistance with Nexora",
    icon: CircleHelp,
  },
] as const;

export default function AccountPage({
  profile,
  wallet,
  onNavigate,
  onLogout,
  onToast,
}: AccountPageProps) {
  const firstName =
    profile?.firstName ??
    profile?.displayName ??
    "Nexora User";

  const username =
    profile?.username
      ? `@${profile.username}`
      : "Nexora member";

  const initials =
    `${profile?.firstName?.[0] ?? ""}${
      profile?.lastName?.[0] ?? ""
    }`.trim() ||
    firstName.slice(0, 1).toUpperCase();

  const address =
    wallet?.address ??
    "No wallet address assigned";

  const balance =
    Number(wallet?.balance) || 0;

  const invested =
    Number(wallet?.investedBalance) ||
    Number(wallet?.totalInvested) ||
    0;

  const earnings =
    Number(wallet?.totalEarnings) || 0;

  async function copyAddress() {
    if (
      !wallet?.address ||
      wallet.address.length < 8
    ) {
      onToast(
        "No wallet address is available yet.",
        "info",
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        wallet.address,
      );

      onToast(
        "Wallet address copied.",
        "success",
      );
    } catch {
      onToast(
        "Unable to copy wallet address.",
        "error",
      );
    }
  }

  function handleMenu(
    id:
      | "wallet"
      | "investments"
      | "security"
      | "support",
  ) {
    if (id === "investments") {
      onNavigate("invest");
      return;
    }

    if (id === "wallet") {
      onToast(
        "Wallet management is available from your deposit and account tools.",
        "info",
      );
      return;
    }

    if (id === "security") {
      onToast(
        "Security controls are being prepared for the production release.",
        "info",
      );
      return;
    }

    onToast(
      "Support center is coming soon.",
      "info",
    );
  }

  return (
    <main className="nx-account-page">
      <section className="nx-account-profile">
        <div className="nx-account-profile-glow" />

        <div className="nx-account-avatar">
          {profile?.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt=""
            />
          ) : (
            <span>{initials}</span>
          )}

          <span className="nx-account-online" />
        </div>

        <div className="nx-account-profile-info">
          <div className="nx-account-profile-kicker">
            <UserRound size={12} />
            NEXORA ACCOUNT
          </div>

          <h1>{firstName}</h1>

          <p>{username}</p>

          <div className="nx-account-member-badge">
            <ShieldCheck size={13} />
            Active member
          </div>
        </div>

        <div className="nx-account-profile-symbol">
          <span>N</span>
        </div>
      </section>

      <section className="nx-account-balance">
        <div className="nx-account-balance-top">
          <div>
            <span>AVAILABLE BALANCE</span>
            <strong>
              {money(balance, "USDT")}
            </strong>
          </div>

          <div className="nx-account-balance-currency">
            USDT
          </div>
        </div>

        <div className="nx-account-balance-stats">
          <div>
            <span>Invested</span>
            <strong>
              {money(invested, "USDT")}
            </strong>
          </div>

          <div>
            <span>Total earnings</span>
            <strong className="is-positive">
              +{money(earnings, "USDT")}
            </strong>
          </div>
        </div>
      </section>

      <section className="nx-account-wallet">
        <div className="nx-account-section-heading">
          <div>
            <span className="nx-section-kicker">
              WALLET
            </span>
            <h2>Connected wallet</h2>
          </div>

          <WalletCards size={19} />
        </div>

        <div className="nx-account-address">
          <div className="nx-account-address-icon">
            <WalletCards size={17} />
          </div>

          <div className="nx-account-address-content">
            <span>BSC TESTNET</span>
            <strong>
              {wallet?.address
                ? truncateAddress(
                    wallet.address,
                    8,
                    6,
                  )
                : address}
            </strong>
          </div>

          <button
            type="button"
            aria-label="Copy wallet address"
            onClick={copyAddress}
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="nx-account-demo-note">
          <Zap size={14} />
          <span>
            Demo environment · Test funds only
          </span>
        </div>
      </section>

      <section className="nx-account-menu">
        <div className="nx-account-section-heading">
          <div>
            <span className="nx-section-kicker">
              ACCOUNT
            </span>
            <h2>Manage your account</h2>
          </div>
        </div>

        <div className="nx-account-menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                className="nx-account-menu-item"
                type="button"
                key={item.id}
                onClick={() =>
                  handleMenu(item.id)
                }
              >
                <span className="nx-account-menu-icon">
                  <Icon size={18} />
                </span>

                <span className="nx-account-menu-copy">
                  <strong>{item.label}</strong>
                  <small>
                    {item.description}
                  </small>
                </span>

                <ChevronRight
                  size={17}
                  className="nx-account-menu-arrow"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="nx-account-info">
        <div className="nx-account-info-icon">
          <ShieldCheck size={18} />
        </div>

        <div>
          <strong>Your account is protected</strong>
          <p>
            Nexora uses server-side balance validation
            and an append-only ledger for investment
            operations.
          </p>
        </div>
      </section>

      <section className="nx-account-links">
        <button
          type="button"
          onClick={() =>
            onToast(
              "Terms are being prepared for the production release.",
              "info",
            )
          }
        >
          <FileText size={15} />
          Terms
          <ExternalLink size={13} />
        </button>

        <button
          type="button"
          onClick={() =>
            onToast(
              "Privacy information is being prepared for the production release.",
              "info",
            )
          }
        >
          <LockKeyhole size={15} />
          Privacy
          <ExternalLink size={13} />
        </button>
      </section>

      <button
        className="nx-account-logout"
        type="button"
        onClick={onLogout}
      >
        <LogOut size={17} />
        Sign out
      </button>

      <div className="nx-account-footer">
        <span>NEXORA</span>
        <small>Grow Together</small>
        <small>Demo environment</small>
      </div>
    </main>
  );
}
