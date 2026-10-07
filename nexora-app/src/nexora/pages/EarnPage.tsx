import {
  ArrowRight,
  Check,
  ChevronRight,
  Gift,
  Sparkles,
  Star,
  Users,
  UserRound,
  Zap,
} from "lucide-react";
import type {
  EarnTask,
  Page,
  ToastType,
  Wallet,
} from "../types";
import { money } from "../theme";
import "./EarnPage.css";

type EarnPageProps = {
  wallet: Wallet | null;
  tasks?: EarnTask[];
  onNavigate: (page: Page) => void;
  onClaim?: (
    taskId: string,
  ) => Promise<boolean>;
  onToast?: (
    message: string,
    type?: ToastType,
  ) => void;
};

const DEFAULT_TASKS: EarnTask[] = [
  {
    id: "daily-checkin",
    title: "Daily check-in",
    description:
      "Open Nexora each day and keep your earning streak active.",
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
      "Keep your account information complete and up to date.",
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
      "Bring someone new into the Nexora community.",
    reward: 1,
    currency: "USDT",
    type: "referral",
    completed: false,
    claimed: false,
    available: true,
    actionLabel: "Claim",
  },
];

function getTaskIcon(type: EarnTask["type"]) {
  switch (type) {
    case "referral":
      return <Users size={18} />;

    case "profile":
      return <UserRound size={18} />;

    case "social":
      return <Sparkles size={18} />;

    case "bonus":
      return <Gift size={18} />;

    default:
      return <Check size={18} />;
  }
}

function getTaskTone(type: EarnTask["type"]) {
  switch (type) {
    case "referral":
      return "lime";

    case "profile":
      return "violet";

    case "social":
      return "blue";

    case "bonus":
      return "gold";

    default:
      return "blue";
  }
}

export default function EarnPage({
  wallet,
  tasks,
  onNavigate,
  onClaim,
  onToast,
}: EarnPageProps) {
  const resolvedTasks =
    tasks && tasks.length > 0
      ? tasks
      : DEFAULT_TASKS;

  const availableTasks =
    resolvedTasks.filter(
      (task) =>
        task.available !== false &&
        !task.claimed,
    );

  const claimedTasks =
    resolvedTasks.filter(
      (task) => task.claimed,
    );

  const availableRewards =
    availableTasks.reduce(
      (total, task) =>
        total + Number(task.reward || 0),
      0,
    );

  const claimedRewards =
    claimedTasks.reduce(
      (total, task) =>
        total + Number(task.reward || 0),
      0,
    );

  const currency =
    wallet?.currency ?? "USDT";

  const handleClaim = async (
    task: EarnTask,
  ) => {
    if (!onClaim) {
      onToast?.(
        "Earn tasks are currently in demo mode.",
        "info",
      );
      return;
    }

    try {
      const success =
        await onClaim(task.id);

      if (success) {
        onToast?.(
          `${money(
            task.reward,
            task.currency ?? currency,
          )} reward claimed.`,
          "success",
        );
      }
    } catch {
      onToast?.(
        "Unable to claim this reward right now.",
        "error",
      );
    }
  };

  return (
    <div className="nx-earn">
      <div className="nx-earn-bg" aria-hidden="true">
        <span className="nx-earn-orb nx-earn-orb-one" />
        <span className="nx-earn-orb nx-earn-orb-two" />
        <span className="nx-earn-orb nx-earn-orb-three" />
        <span className="nx-earn-grid" />
      </div>

      <main className="nx-earn-shell">
        <header className="nx-earn-header">
          <button
            type="button"
            className="nx-earn-brand"
            onClick={() => onNavigate("home")}
            aria-label="Back to Nexora home"
          >
            <span className="nx-earn-brand-mark">
              N
            </span>

            <span>
              <strong>NEXORA</strong>
              <small>GROW TOGETHER</small>
            </span>
          </button>

          <div className="nx-earn-live">
            <i />
            LIVE
          </div>
        </header>

        <section className="nx-earn-hero">
          <div className="nx-earn-hero-copy">
            <span className="nx-earn-eyebrow">
              EARN MORE
            </span>

            <h1>
              Your rewards,
              <br />
              <em>your momentum.</em>
            </h1>

            <p>
              Complete simple activities,
              claim rewards, and keep building
              your Nexora journey.
            </p>
          </div>

          <div
            className="nx-earn-hero-orbit"
            aria-hidden="true"
          >
            <div className="nx-earn-orbit-ring" />
            <div className="nx-earn-orbit-ring is-two" />
            <div className="nx-earn-coin">
              <Gift size={27} />
            </div>
          </div>
        </section>

        <section className="nx-earn-summary">
          <div className="nx-earn-summary-card">
            <div className="nx-earn-summary-icon is-lime">
              <Zap size={17} />
            </div>

            <div>
              <span>AVAILABLE</span>
              <strong>
                {money(
                  availableRewards,
                  currency,
                )}
              </strong>
            </div>
          </div>

          <div className="nx-earn-summary-card">
            <div className="nx-earn-summary-icon is-blue">
              <Check size={17} />
            </div>

            <div>
              <span>CLAIMED</span>
              <strong>
                {money(
                  claimedRewards,
                  currency,
                )}
              </strong>
            </div>
          </div>
        </section>

        <section className="nx-earn-section">
          <div className="nx-earn-section-head">
            <div>
              <span className="nx-earn-label">
                REWARD CENTER
              </span>

              <h2>Ways to earn</h2>
            </div>

            <span className="nx-earn-count">
              {availableTasks.length} active
            </span>
          </div>

          {availableTasks.length === 0 ? (
            <div className="nx-earn-empty">
              <div className="nx-earn-empty-icon">
                <Check size={24} />
              </div>

              <strong>
                You&apos;re all caught up
              </strong>

              <p>
                New earning activities will
                appear here when available.
              </p>

              <button
                type="button"
                onClick={() =>
                  onNavigate("friends")
                }
              >
                Invite friends
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="nx-earn-task-list">
              {availableTasks.map((task) => {
                const tone =
                  getTaskTone(task.type);

                return (
                  <article
                    key={task.id}
                    className={`nx-earn-task is-${tone}`}
                  >
                    <div className="nx-earn-task-icon">
                      {getTaskIcon(task.type)}
                    </div>

                    <div className="nx-earn-task-body">
                      <div className="nx-earn-task-top">
                        <span>
                          {task.type === "daily"
                            ? "DAILY"
                            : task.type.toUpperCase()}
                        </span>

                        <strong>
                          +{money(
                            task.reward,
                            task.currency ??
                              currency,
                          )}
                        </strong>
                      </div>

                      <h3>{task.title}</h3>

                      <p>
                        {task.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="nx-earn-claim"
                      onClick={() =>
                        void handleClaim(
                          task,
                        )
                      }
                      disabled={
                        task.completed ===
                          true &&
                        task.claimed === true
                      }
                    >
                      {task.actionLabel ??
                        "Claim"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="nx-earn-feature">
          <div className="nx-earn-feature-glow" />

          <div className="nx-earn-feature-icon">
            <Users size={22} />
          </div>

          <div className="nx-earn-feature-copy">
            <span>GROW TOGETHER</span>
            <h2>Invite friends</h2>
            <p>
              Share Nexora with people you
              trust and unlock referral rewards.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate("friends")
            }
            aria-label="Open friends"
          >
            <ChevronRight size={19} />
          </button>
        </section>

        <section className="nx-earn-section">
          <div className="nx-earn-section-head">
            <div>
              <span className="nx-earn-label">
                THE SIMPLE WAY
              </span>

              <h2>How it works</h2>
            </div>
          </div>

          <div className="nx-earn-steps">
            <div className="nx-earn-step">
              <span>01</span>
              <div>
                <strong>Complete</strong>
                <p>
                  Finish an eligible activity.
                </p>
              </div>
            </div>

            <div className="nx-earn-step">
              <span>02</span>
              <div>
                <strong>Claim</strong>
                <p>
                  Collect the reward shown on
                  the task.
                </p>
              </div>
            </div>

            <div className="nx-earn-step">
              <span>03</span>
              <div>
                <strong>Keep growing</strong>
                <p>
                  Return regularly for new
                  opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {claimedTasks.length > 0 && (
          <section className="nx-earn-section">
            <div className="nx-earn-section-head">
              <div>
                <span className="nx-earn-label">
                  HISTORY
                </span>

                <h2>Claimed rewards</h2>
              </div>
            </div>

            <div className="nx-earn-claimed-list">
              {claimedTasks.map((task) => (
                <div
                  key={task.id}
                  className="nx-earn-claimed"
                >
                  <div className="nx-earn-claimed-icon">
                    <Check size={16} />
                  </div>

                  <div>
                    <strong>
                      {task.title}
                    </strong>

                    <span>
                      Reward claimed
                    </span>
                  </div>

                  <b>
                    +{money(
                      task.reward,
                      task.currency ??
                        currency,
                    )}
                  </b>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="nx-earn-note">
          <div className="nx-earn-note-icon">
            <Star size={15} />
          </div>

          <div>
            <strong>
              Nexora reward program
            </strong>

            <p>
              Rewards displayed in this
              section follow the current
              account and task configuration.
            </p>
          </div>
        </section>

        <nav className="nx-earn-bottom-nav">
          <button
            type="button"
            onClick={() => onNavigate("home")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            type="button"
            onClick={() => onNavigate("invest")}
          >
            <span>↗</span>
            Invest
          </button>

          <button
            type="button"
            className="is-active"
            onClick={() => onNavigate("earn")}
          >
            <Gift size={16} />
            Earn
          </button>

          <button
            type="button"
            onClick={() =>
              onNavigate("friends")
            }
          >
            <Users size={16} />
            Friends
          </button>

          <button
            type="button"
            onClick={() =>
              onNavigate("account")
            }
          >
            <UserRound size={16} />
            Account
          </button>
        </nav>
      </main>
    </div>
  );
}
