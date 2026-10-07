import { useMemo, useState } from "react";
import "./InvestPage.css";

type Props = {
  plans: any[];
  wallet: any;
  investments: any[];
  onNavigate: (nextPage: any) => void;
  onInvest: (planId: string, amount: number) => any;
};

type Plan = {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  daily_rate: number;
};

const DEFAULT_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    min_amount: 100,
    max_amount: 999,
    daily_rate: 1.5,
  },
  {
    id: "growth",
    name: "Growth",
    min_amount: 1000,
    max_amount: 4999,
    daily_rate: 2,
  },
  {
    id: "pro",
    name: "Pro",
    min_amount: 5000,
    max_amount: 19999,
    daily_rate: 2.5,
  },
  {
    id: "elite",
    name: "Elite",
    min_amount: 20000,
    max_amount: 100000,
    daily_rate: 3,
  },
];

function numberValue(value: any, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function money(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizePlans(input: any[]): Plan[] {
  if (!Array.isArray(input) || input.length === 0) {
    return DEFAULT_PLANS;
  }

  const normalized = input
    .map((raw, index) => ({
      id: String(raw?.id ?? raw?.plan_id ?? DEFAULT_PLANS[index]?.id ?? `plan-${index}`),
      name: String(
        raw?.name ??
          raw?.title ??
          raw?.plan_name ??
          DEFAULT_PLANS[index]?.name ??
          `Plan ${index + 1}`,
      ),
      min_amount: numberValue(
        raw?.min_amount ??
          raw?.minAmount ??
          raw?.minimum_amount ??
          raw?.minimum ??
          DEFAULT_PLANS[index]?.min_amount,
      ),
      max_amount: numberValue(
        raw?.max_amount ??
          raw?.maxAmount ??
          raw?.maximum_amount ??
          raw?.maximum ??
          DEFAULT_PLANS[index]?.max_amount,
      ),
      daily_rate: numberValue(
        raw?.daily_rate ??
          raw?.dailyRate ??
          raw?.return_rate ??
          raw?.returnRate ??
          raw?.rate ??
          DEFAULT_PLANS[index]?.daily_rate,
      ),
    }))
    .filter((plan) => plan.min_amount > 0 && plan.max_amount >= plan.min_amount);

  return normalized.length ? normalized : DEFAULT_PLANS;
}

function getBalance(wallet: any) {
  return numberValue(
    wallet?.balance ??
      wallet?.available_balance ??
      wallet?.availableBalance ??
      wallet?.wallet_balance ??
      wallet?.amount ??
      0,
  );
}

export default function InvestPage({
  plans,
  wallet,
  investments,
  onNavigate,
  onInvest,
}: Props) {
  const normalizedPlans = useMemo(() => normalizePlans(plans), [plans]);

  const [selectedId, setSelectedId] = useState(
    normalizedPlans.find((plan) => plan.id === "growth")?.id ??
      normalizedPlans[0]?.id ??
      "growth",
  );

  const selectedPlan =
    normalizedPlans.find((plan) => plan.id === selectedId) ??
    normalizedPlans[0];

  const [amount, setAmount] = useState(
    selectedPlan?.min_amount ?? 1000,
  );

  const balance = getBalance(wallet);

  const amountNumber = numberValue(amount);
  const dailyProfit = selectedPlan
    ? (amountNumber * selectedPlan.daily_rate) / 100
    : 0;

  const isBelowMinimum =
    !!selectedPlan && amountNumber < selectedPlan.min_amount;

  const isAboveMaximum =
    !!selectedPlan && amountNumber > selectedPlan.max_amount;

  const insufficientBalance =
    amountNumber > balance;

  const validAmount =
    !!selectedPlan &&
    amountNumber >= selectedPlan.min_amount &&
    amountNumber <= selectedPlan.max_amount &&
    amountNumber <= balance;

  const progress = selectedPlan
    ? Math.min(
        100,
        Math.max(
          0,
          ((amountNumber - selectedPlan.min_amount) /
            Math.max(1, selectedPlan.max_amount - selectedPlan.min_amount)) *
            100,
        ),
      )
    : 0;

  function selectPlan(plan: Plan) {
    setSelectedId(plan.id);
    setAmount(plan.min_amount);
  }

  function setQuickAmount(value: number) {
    if (!selectedPlan) return;

    const next = Math.min(
      selectedPlan.max_amount,
      Math.max(selectedPlan.min_amount, value),
    );

    setAmount(next);
  }

  function submitInvestment() {
    if (!selectedPlan || !validAmount) return;

    onInvest(selectedPlan.id, amountNumber);
  }

  return (
    <main className="nx-invest">
      <div className="nx-invest-bg" aria-hidden="true">
        <span className="nx-orb nx-orb-one" />
        <span className="nx-orb nx-orb-two" />
        <span className="nx-orb nx-orb-three" />
        <span className="nx-grid" />
      </div>

      <div className="nx-invest-shell">
        <header className="nx-invest-top">
          <button
            className="nx-back"
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="Back to home"
          >
            ‹
          </button>

          <div className="nx-invest-brand">
            <div className="nx-brand-mark">
              <span>N</span>
            </div>

            <div>
              <strong>NEXORA</strong>
              <small>GROW TOGETHER</small>
            </div>
          </div>

          <div className="nx-live">
            <i />
            LIVE
          </div>
        </header>

        <section className="nx-invest-hero">
          <div className="nx-hero-copy">
            <span className="nx-eyebrow">SMART INVESTING</span>
            <h1>
              Build your
              <br />
              <em>portfolio.</em>
            </h1>
            <p>
              Choose a plan, set your amount, and let your capital work for
              you.
            </p>
          </div>

          <div className="nx-balance-card">
            <div className="nx-balance-top">
              <span>AVAILABLE BALANCE</span>
              <b>USD</b>
            </div>

            <strong>${money(balance)}</strong>

            <div className="nx-balance-bottom">
              <span>Ready to invest</span>
              <i>●</i>
            </div>
          </div>
        </section>

        <section className="nx-section">
          <div className="nx-section-title">
            <div>
              <span>01</span>
              <h2>Choose your plan</h2>
            </div>

            <small>DAILY RETURN</small>
          </div>

          <div className="nx-plan-grid">
            {normalizedPlans.map((plan) => {
              const active = plan.id === selectedPlan?.id;
              const featured =
                plan.id === "growth" ||
                plan.name.toLowerCase() === "growth";

              return (
                <button
                  key={plan.id}
                  type="button"
                  className={`nx-plan ${active ? "is-active" : ""} ${
                    featured ? "is-featured" : ""
                  }`}
                  onClick={() => selectPlan(plan)}
                >
                  {featured && (
                    <span className="nx-popular">
                      <i>★</i> POPULAR
                    </span>
                  )}

                  <div className="nx-plan-top">
                    <span className="nx-plan-icon">
                      {featured ? "✦" : "◆"}
                    </span>

                    <span className="nx-plan-name">{plan.name}</span>

                    {active && <span className="nx-check">✓</span>}
                  </div>

                  <strong className="nx-plan-rate">
                    {plan.daily_rate.toFixed(1)}
                    <small>%</small>
                  </strong>

                  <span className="nx-plan-label">PER DAY</span>

                  <div className="nx-plan-range">
                    <span>${plan.min_amount.toLocaleString()}</span>
                    <i>—</i>
                    <span>${plan.max_amount.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {selectedPlan && (
          <section className="nx-section">
            <div className="nx-section-title">
              <div>
                <span>02</span>
                <h2>Set investment</h2>
              </div>

              <small>{selectedPlan.name.toUpperCase()}</small>
            </div>

            <div className="nx-invest-builder">
              <div className="nx-amount-head">
                <div>
                  <span>INVESTMENT AMOUNT</span>
                  <small>Choose how much you want to invest</small>
                </div>

                <b>USD</b>
              </div>

              <div className="nx-amount-input">
                <span>$</span>

                <input
                  type="number"
                  min={selectedPlan.min_amount}
                  max={selectedPlan.max_amount}
                  step="1"
                  value={amount}
                  onChange={(event) => setAmount(numberValue(event.target.value))}
                />

                <span>USD</span>
              </div>

              <div className="nx-amount-progress">
                <span style={{ width: `${progress}%` }} />
              </div>

              <div className="nx-amount-limits">
                <span>MIN ${selectedPlan.min_amount.toLocaleString()}</span>
                <span>MAX ${selectedPlan.max_amount.toLocaleString()}</span>
              </div>

              <div className="nx-quick">
                {[1000, 2500, 5000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setQuickAmount(quick)}
                  >
                    ${quick.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="nx-return-card">
              <div className="nx-return-ring">
                <div>
                  <span>RATE</span>
                  <strong>{selectedPlan.daily_rate.toFixed(1)}%</strong>
                </div>
              </div>

              <div className="nx-return-copy">
                <span>ESTIMATED DAILY RETURN</span>
                <strong>+${money(dailyProfit)}</strong>
                <small>
                  Based on your ${money(amountNumber)} investment
                </small>
              </div>

              <div className="nx-return-arrow">↗</div>
            </div>

            {(isBelowMinimum ||
              isAboveMaximum ||
              insufficientBalance) && (
              <div className="nx-warning">
                <span>!</span>

                <strong>
                  {isBelowMinimum
                    ? `Minimum investment is $${selectedPlan.min_amount.toLocaleString()}.`
                    : isAboveMaximum
                      ? `Maximum investment is $${selectedPlan.max_amount.toLocaleString()}.`
                      : `Insufficient available balance.`}
                </strong>
              </div>
            )}

            <button
              className="nx-invest-cta"
              type="button"
              disabled={!validAmount}
              onClick={submitInvestment}
            >
              <span>REVIEW INVESTMENT</span>
              <b>→</b>
            </button>
          </section>
        )}

        <section className="nx-section nx-portfolio">
          <div className="nx-section-title">
            <div>
              <span>03</span>
              <h2>Your portfolio</h2>
            </div>

            <small>{investments?.length ?? 0} ACTIVE</small>
          </div>

          {Array.isArray(investments) && investments.length > 0 ? (
            <div className="nx-investment-list">
              {investments.map((investment: any, index: number) => (
                <div
                  className="nx-investment-card"
                  key={investment?.id ?? investment?.investment_id ?? index}
                >
                  <div className="nx-investment-icon">↗</div>

                  <div className="nx-investment-main">
                    <strong>
                      {investment?.plan_name ??
                        investment?.planName ??
                        investment?.name ??
                        "Investment"}
                    </strong>

                    <span>
                      ${money(
                        numberValue(
                          investment?.amount ??
                            investment?.principal ??
                            investment?.invested_amount,
                        ),
                      )}
                    </span>
                  </div>

                  <div className="nx-investment-status">ACTIVE</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="nx-empty">
              <div className="nx-empty-icon">＋</div>

              <div>
                <strong>Your portfolio is empty</strong>
                <span>
                  Select a plan above to make your first investment.
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      <nav className="nx-bottom-nav">
        <button type="button" onClick={() => onNavigate("home")}>
          <span>⌂</span>
          <small>HOME</small>
        </button>

        <button type="button" className="active">
          <span>↗</span>
          <small>INVEST</small>
        </button>

        <button type="button" onClick={() => onNavigate("earn")}>
          <span>◇</span>
          <small>EARN</small>
        </button>

        <button type="button" onClick={() => onNavigate("friends")}>
          <span>♧</span>
          <small>FRIENDS</small>
        </button>

        <button type="button" onClick={() => onNavigate("account")}>
          <span>◎</span>
          <small>ACCOUNT</small>
        </button>
      </nav>
    </main>
  );
}
