import {
  Check,
  ChevronRight,
  Copy,
  Gift,
  Link2,
  Send,
  Share2,
  Sparkles,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import type {
  Page,
  ReferralLevel,
  ReferralStats,
  UserProfile,
} from "../types";
import { money } from "../theme";

type FriendsPageProps = {
  profile: UserProfile | null;
  referralStats: ReferralStats | null;
  levels: ReferralLevel[];
  onNavigate: (page: Page) => void;
  onCopyReferral: () => void;
  onShareReferral: () => void;
  onToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
  ) => void;
};

const fallbackLevels: ReferralLevel[] = [
  {
    level: 1,
    name: "Starter",
    requirement: 0,
    rewardRate: 5,
    description: "Start building your referral network.",
  },
  {
    level: 2,
    name: "Builder",
    requirement: 5,
    rewardRate: 8,
    description: "Grow your network and unlock more rewards.",
  },
  {
    level: 3,
    name: "Leader",
    requirement: 20,
    rewardRate: 12,
    description: "Reach the top referral tier.",
  },
];

export default function FriendsPage({
  profile,
  referralStats,
  levels,
  onNavigate,
  onCopyReferral,
  onShareReferral,
  onToast,
}: FriendsPageProps) {
  const referralLevels =
    levels.length > 0 ? levels : fallbackLevels;

  const totalReferrals =
    Number(referralStats?.totalReferrals) || 0;

  const activeReferrals =
    Number(referralStats?.activeReferrals) || 0;

  const totalEarned =
    Number(referralStats?.totalEarned) || 0;

  const referralCode =
    referralStats?.referralCode ??
    profile?.referralCode ??
    "NEXORA";

  const referralLink =
    referralStats?.referralLink ??
    `https://t.me/NexoraGrowBot?start=ref_${referralCode}`;

  const currentLevel =
    [...referralLevels]
      .reverse()
      .find(
        (level) =>
          totalReferrals >=
          Number(level.requirement) || 0,
      ) ?? referralLevels[0];

  const currentIndex = Math.max(
    referralLevels.findIndex(
      (level) => level.level === currentLevel.level,
    ),
    0,
  );

  const nextLevel =
    referralLevels[currentIndex + 1] ?? null;

  const nextRequirement = nextLevel
    ? Number(nextLevel.requirement) || 0
    : totalReferrals;

  const progress =
    nextLevel && nextRequirement > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (totalReferrals /
              nextRequirement) *
              100,
          ),
        )
      : 100;

  async function handleCopy() {
    try {
      await onCopyReferral();
      onToast(
        "Referral link copied.",
        "success",
      );
    } catch {
      onToast(
        "Unable to copy the referral link.",
        "error",
      );
    }
  }

  async function handleShare() {
    try {
      await onShareReferral();
    } catch {
      onToast(
        "Unable to open Telegram sharing.",
        "error",
      );
    }
  }

  return (
    <main className="nx-friends-page">
      <section className="nx-friends-hero">
        <div className="nx-friends-orb nx-friends-orb-one" />
        <div className="nx-friends-orb nx-friends-orb-two" />

        <div className="nx-friends-hero-content">
          <div className="nx-friends-eyebrow">
            <Users size={13} />
            REFERRAL NETWORK
          </div>

          <h1>
            Grow together.
            <br />
            <span>Earn together.</span>
          </h1>

          <p>
            Invite people to Nexora and grow your
            referral network while unlocking higher
            reward levels.
          </p>

          <div className="nx-friends-level-pill">
            <Sparkles size={13} />
            <span>CURRENT LEVEL</span>
            <strong>
              {currentLevel?.name ?? "Starter"}
            </strong>
          </div>
        </div>

        <div className="nx-friends-network">
          <div className="nx-friends-network-ring nx-ring-one" />
          <div className="nx-friends-network-ring nx-ring-two" />

          <div className="nx-friends-network-core">
            <Users size={27} />
            <strong>{totalReferrals}</strong>
            <span>referrals</span>
          </div>

          <span className="nx-friend-node nx-node-one">
            <Users size={13} />
          </span>
          <span className="nx-friend-node nx-node-two">
            <Users size={13} />
          </span>
          <span className="nx-friend-node nx-node-three">
            <Users size={13} />
          </span>
        </div>
      </section>

      <section className="nx-friends-stats">
        <article className="nx-friend-stat">
          <div className="nx-friend-stat-icon nx-friend-stat-blue">
            <Users size={18} />
          </div>
          <div>
            <span>Total referrals</span>
            <strong>{totalReferrals}</strong>
          </div>
        </article>

        <article className="nx-friend-stat">
          <div className="nx-friend-stat-icon nx-friend-stat-green">
            <Zap size={18} />
          </div>
          <div>
            <span>Active referrals</span>
            <strong>{activeReferrals}</strong>
          </div>
        </article>

        <article className="nx-friend-stat">
          <div className="nx-friend-stat-icon nx-friend-stat-gold">
            <WalletCards size={18} />
          </div>
          <div>
            <span>Total earned</span>
            <strong>
              {money(totalEarned, "USDT")}
            </strong>
          </div>
        </article>
      </section>

      <section className="nx-referral-card">
        <div className="nx-referral-card-glow" />

        <div className="nx-referral-heading">
          <div className="nx-referral-icon">
            <Link2 size={19} />
          </div>

          <div>
            <span>YOUR REFERRAL LINK</span>
            <h2>Invite & earn</h2>
          </div>
        </div>

        <p className="nx-referral-description">
          Share your personal link with friends. When
          they join through your invitation, your network
          starts growing.
        </p>

        <div className="nx-referral-link-box">
          <Link2 size={15} />
          <span>{referralLink}</span>
          <button
            type="button"
            aria-label="Copy referral link"
            onClick={handleCopy}
          >
            <Copy size={16} />
          </button>
        </div>

        <div className="nx-referral-actions">
          <button
            className="nx-referral-copy"
            type="button"
            onClick={handleCopy}
          >
            <Copy size={16} />
            Copy link
          </button>

          <button
            className="nx-referral-share"
            type="button"
            onClick={handleShare}
          >
            <Send size={16} />
            Share on Telegram
          </button>
        </div>
      </section>

      <section className="nx-friends-progress">
        <div className="nx-friends-progress-top">
          <div>
            <span>Referral level</span>
            <strong>
              {currentLevel?.name ?? "Starter"}
            </strong>
          </div>

          <div className="nx-friends-progress-rate">
            {Number(
              currentLevel?.rewardRate ?? 0,
            )}
            %
          </div>
        </div>

        <div className="nx-friends-progress-track">
          <div
            className="nx-friends-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="nx-friends-progress-bottom">
          <span>
            {nextLevel
              ? `${Math.max(
                  nextRequirement -
                    totalReferrals,
                  0,
                )} more referrals to ${nextLevel.name}`
              : "Maximum referral level reached"}
          </span>

          <strong>
            {totalReferrals}/{nextRequirement}
          </strong>
        </div>
      </section>

      <section className="nx-friends-levels">
        <div className="nx-friends-section-heading">
          <div>
            <span className="nx-section-kicker">
              REWARD TIERS
            </span>
            <h2>Referral levels</h2>
          </div>

          <Gift size={19} />
        </div>

        <div className="nx-friends-level-list">
          {referralLevels.map((level) => {
            const unlocked =
              totalReferrals >=
              Number(level.requirement);

            const active =
              level.level === currentLevel.level;

            return (
              <article
                className={`nx-friends-level ${
                  unlocked
                    ? "is-unlocked"
                    : ""
                } ${
                  active
                    ? "is-active"
                    : ""
                }`}
                key={`${level.level}-${level.name}`}
              >
                <div className="nx-level-number">
                  {unlocked ? (
                    <Check size={16} />
                  ) : (
                    level.level
                  )}
                </div>

                <div className="nx-level-content">
                  <div className="nx-level-title">
                    <strong>{level.name}</strong>

                    {active && (
                      <span>
                        CURRENT
                      </span>
                    )}
                  </div>

                  <p>
                    {level.description ??
                      `Unlock at ${level.requirement} referrals.`}
                  </p>

                  <div className="nx-level-meta">
                    <span>
                      {level.requirement} referrals
                    </span>
                    <b>
                      {level.rewardRate}% reward
                    </b>
                  </div>
                </div>

                <ChevronRight
                  size={17}
                  className="nx-level-arrow"
                />
              </article>
            );
          })}
        </div>
      </section>

      <section className="nx-friends-tip">
        <div className="nx-friends-tip-icon">
          <Share2 size={18} />
        </div>

        <div>
          <strong>Turn your network into growth</strong>
          <p>
            The more people you invite, the closer you
            get to higher referral reward tiers.
          </p>
        </div>
      </section>

      <button
        className="nx-friends-back"
        type="button"
        onClick={() => onNavigate("home")}
      >
        Back to dashboard
      </button>
    </main>
  );
}
