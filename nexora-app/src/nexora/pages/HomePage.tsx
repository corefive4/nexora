import { useMemo } from "react";
import "./HomePage.css";

type Props = {
  wallet: any;
  plans: any[];
  investments: any[];
  activities: any[];
  onNavigate: (page: any) => void;
  onDeposit: () => any;
};

const money = (value: number) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const amountOf = (item: any) =>
  Number(item?.amount ?? item?.principal ?? item?.investedAmount ?? 0);

const rateOf = (plan: any) =>
  Number(plan?.daily_rate ?? plan?.dailyRate ?? plan?.rate ?? 0);

const nameOf = (item: any) =>
  item?.name ?? item?.plan_name ?? item?.planName ?? "Investment";

const planRange = (plan: any) => {
  const min = Number(plan?.min_amount ?? plan?.minAmount ?? 0);
  const max = Number(plan?.max_amount ?? plan?.maxAmount ?? 0);

  return `${money(min)} – ${money(max)}`;
};

const activityLabel = (item: any) =>
  item?.title ??
  item?.description ??
  item?.type ??
  "Account activity";

export default function HomePage({
  wallet,
  plans,
  investments,
  activities,
  onNavigate,
  onDeposit,
}: Props) {
  const balance = Number(
    wallet?.balance ??
      wallet?.available_balance ??
      wallet?.availableBalance ??
      wallet?.amount ??
      0,
  );

  const invested = useMemo(
    () =>
      (investments || []).reduce((sum, item) => {
        const status = String(item?.status ?? "active").toLowerCase();

        return ["active", "running", "pending"].includes(status)
          ? sum + amountOf(item)
          : sum;
      }, 0),
    [investments],
  );

  const profit = useMemo(
    () =>
      (investments || []).reduce(
        (sum, item) =>
          sum +
          Number(
            item?.profit ??
              item?.earned ??
              item?.earnings ??
              item?.total_profit ??
              0,
          ),
        0,
      ),
    [investments],
  );

  const dailyIncome = useMemo(
    () =>
      (investments || []).reduce((sum, item) => {
        const plan =
          plans?.find(
            (candidate) =>
              String(candidate?.id ?? candidate?.plan_id) ===
              String(item?.plan_id ?? item?.planId),
          ) ?? item?.plan;

        return sum + (amountOf(item) * rateOf(plan)) / 100;
      }, 0),
    [investments, plans],
  );

  const featuredPlan = plans?.[1] ?? plans?.[0];
  const activeInvestments = (investments || []).slice(0, 3);
  const recentActivities = (activities || []).slice(0, 4);

  return (
    <main className="nx-home">
      <div className="nx-home-bg" aria-hidden="true">
        <span className="nx-home-orb nx-home-orb-a" />
        <span className="nx-home-orb nx-home-orb-b" />
        <span className="nx-home-orb nx-home-orb-c" />
        <div className="nx-home-grid" />
      </div>

      <div className="nx-home-shell">
        <header className="nx-home-header">
          <button
            className="nx-home-brand"
            type="button"
            onClick={() => onNavigate("home")}
          >
            <span className="nx-home-logo">N</span>
            <span>
              <strong>NEXORA</strong>
              <small>GROW TOGETHER</small>
            </span>
          </button>

          <button
            className="nx-home-account"
            type="button"
            aria-label="Open account"
            onClick={() => onNavigate("account")}
          >
            <span className="nx-account-status" />
            <span className="nx-account-icon">◉</span>
          </button>
        </header>

        <section className="nx-home-hero">
          <div>
            <span className="nx-home-eyebrow">
              <i />
              YOUR GROWTH HUB
            </span>

            <h1>
              Grow your
              <br />
              <em>future.</em>
            </h1>

            <p>
              Your money, your plans, your progress — all in one place.
            </p>
          </div>

          <span className="nx-live-pill">
            <i />
            LIVE
          </span>
        </section>

        <section className="nx-portfolio-card">
          <div className="nx-portfolio-shine" />

          <div className="nx-portfolio-heading">
            <div>
              <span>Total portfolio</span>
              <small>Available + invested</small>
            </div>

            <span className="nx-secure-badge">
              <i /> SECURE
            </span>
          </div>

          <strong className="nx-portfolio-total">
            {money(balance + invested)}
          </strong>

          <div className="nx-profit-line">
            <span>
              <b>↗</b> {money(profit)}
            </span>
            <small>Total profit</small>
          </div>

          <div className="nx-portfolio-chart" aria-hidden="true">
            <svg viewBox="0 0 700 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="nxHomeArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="rgba(84,163,255,.30)" />
                  <stop offset="1" stopColor="rgba(84,163,255,0)" />
                </linearGradient>
              </defs>

              <path
                className="nx-chart-area"
                d="M0 122 C55 116 72 105 110 111 C145 117 163 88 196 99 C231 111 249 83 280 91 C314 100 335 66 365 75 C399 84 420 54 451 62 C486 71 505 43 540 50 C574 58 596 30 628 37 C654 43 677 25 700 17 L700 150 L0 150 Z"
              />

              <path
                className="nx-chart-line"
                d="M0 122 C55 116 72 105 110 111 C145 117 163 88 196 99 C231 111 249 83 280 91 C314 100 335 66 365 75 C399 84 420 54 451 62 C486 71 505 43 540 50 C574 58 596 30 628 37 C654 43 677 25 700 17"
              />

              <circle cx="700" cy="17" r="5" />
            </svg>
          </div>

          <div className="nx-portfolio-stats">
            <div>
              <small>AVAILABLE</small>
              <strong>{money(balance)}</strong>
            </div>

            <div>
              <small>INVESTED</small>
              <strong>{money(invested)}</strong>
            </div>

            <div>
              <small>DAILY EARN</small>
              <strong>+{money(dailyIncome)}</strong>
            </div>
          </div>
        </section>

        <section className="nx-home-actions">
          <button
            className="nx-home-action nx-home-action-primary"
            type="button"
            onClick={onDeposit}
          >
            <span className="nx-action-symbol">＋</span>
            <span>
              <small>ADD FUNDS</small>
              <strong>Deposit</strong>
            </span>
            <b>↗</b>
          </button>

          <button
            className="nx-home-action nx-home-action-secondary"
            type="button"
            onClick={() => onNavigate("invest")}
          >
            <span className="nx-action-symbol">◆</span>
            <span>
              <small>PUT TO WORK</small>
              <strong>Invest</strong>
            </span>
            <b>↗</b>
          </button>
        </section>

        <section className="nx-home-section">
          <div className="nx-section-head">
            <div>
              <span>OPPORTUNITY</span>
              <h2>Find your plan</h2>
            </div>

            <button type="button" onClick={() => onNavigate("invest")}>
              View all <b>→</b>
            </button>
          </div>

          {featuredPlan ? (
            <button
              className="nx-featured-plan"
              type="button"
              onClick={() => onNavigate("invest")}
            >
              <div className="nx-featured-glow" />

              <div className="nx-featured-top">
                <span className="nx-featured-icon">✦</span>
                <span className="nx-popular-tag">POPULAR</span>
              </div>

              <div className="nx-featured-main">
                <div>
                  <small>{nameOf(featuredPlan).toUpperCase()}</small>
                  <strong>
                    {rateOf(featuredPlan).toFixed(1)}
                    <i>% / day</i>
                  </strong>
                </div>

                <div className="nx-plan-range">
                  <small>INVESTMENT RANGE</small>
                  <strong>{planRange(featuredPlan)}</strong>
                </div>
              </div>

              <div className="nx-featured-footer">
                <span>Explore this plan</span>
                <b>→</b>
              </div>
            </button>
          ) : (
            <div className="nx-empty-home">
              <strong>Plans are loading</strong>
              <span>Investment options will appear here shortly.</span>
            </div>
          )}
        </section>

        <section className="nx-home-section">
          <div className="nx-section-head">
            <div>
              <span>PORTFOLIO</span>
              <h2>Active investments</h2>
            </div>

            <button type="button" onClick={() => onNavigate("invest")}>
              Manage <b>→</b>
            </button>
          </div>

          {activeInvestments.length > 0 ? (
            <div className="nx-investment-list">
              {activeInvestments.map((item, index) => {
                const plan =
                  plans?.find(
                    (candidate) =>
                      String(candidate?.id ?? candidate?.plan_id) ===
                      String(item?.plan_id ?? item?.planId),
                  ) ?? item?.plan;

                return (
                  <button
                    className="nx-investment-row"
                    type="button"
                    key={item?.id ?? index}
                    onClick={() => onNavigate("invest")}
                  >
                    <span className="nx-investment-icon">N</span>

                    <span className="nx-investment-info">
                      <strong>{nameOf(plan)}</strong>
                      <small>{rateOf(plan).toFixed(1)}% daily return</small>
                    </span>

                    <span className="nx-investment-value">
                      <strong>{money(amountOf(item))}</strong>
                      <small>Active</small>
                    </span>

                    <b className="nx-row-arrow">→</b>
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              className="nx-start-card"
              type="button"
              onClick={() => onNavigate("invest")}
            >
              <span className="nx-start-icon">＋</span>
              <span>
                <strong>Start your portfolio</strong>
                <small>Choose a plan and put your balance to work.</small>
              </span>
              <b>→</b>
            </button>
          )}
        </section>

        <button
          className="nx-earn-banner"
          type="button"
          onClick={() => onNavigate("earn")}
        >
          <span className="nx-earn-symbol">↗</span>

          <span>
            <small>REWARDS & BONUSES</small>
            <strong>Earn more with Nexora</strong>
            <em>Complete activities and unlock extra rewards.</em>
          </span>

          <b>→</b>
        </button>

        {recentActivities.length > 0 && (
          <section className="nx-home-section">
            <div className="nx-section-head">
              <div>
                <span>ACTIVITY</span>
                <h2>Recent activity</h2>
              </div>
            </div>

            <div className="nx-activity-list">
              {recentActivities.map((activity, index) => {
                const value = Number(
                  activity?.amount ?? activity?.value ?? 0,
                );

                const type = String(activity?.type ?? "").toLowerCase();

                return (
                  <div
                    className="nx-activity-row"
                    key={activity?.id ?? index}
                  >
                    <span className="nx-activity-icon">
                      {type.includes("deposit") ? "+" : "↗"}
                    </span>

                    <span className="nx-activity-info">
                      <strong>{activityLabel(activity)}</strong>
                      <small>
                        {activity?.created_at ??
                          activity?.createdAt ??
                          "Recently"}
                      </small>
                    </span>

                    {value !== 0 && (
                      <strong className={value > 0 ? "is-positive" : ""}>
                        {value > 0 ? "+" : ""}
                        {money(value)}
                      </strong>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="nx-security-note">
          <span>◆</span>
          <div>
            <strong>Designed for secure growth</strong>
            <small>Your Nexora account is protected and monitored.</small>
          </div>
        </div>
      </div>

      <nav className="nx-home-nav" aria-label="Primary navigation">
        <button className="is-active" type="button" onClick={() => onNavigate("home")}>
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button type="button" onClick={() => onNavigate("invest")}>
          <span>◆</span>
          <small>Invest</small>
        </button>

        <button type="button" onClick={() => onNavigate("earn")}>
          <span>↗</span>
          <small>Earn</small>
        </button>

        <button type="button" onClick={() => onNavigate("friends")}>
          <span>♧</span>
          <small>Friends</small>
        </button>

        <button type="button" onClick={() => onNavigate("account")}>
          <span>◉</span>
          <small>Account</small>
        </button>
      </nav>
    </main>
  );
}
