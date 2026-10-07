import type { ReactNode } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  XCircle,
} from "lucide-react";
import type {
  InvestmentStatus,
  ToastType,
} from "./types";

type BalanceCardProps = {
  label: string;
  amount: number;
  currency?: string;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
};

export function BalanceCard({
  label,
  amount,
  currency = "USDT",
  icon,
  subtitle,
  className = "",
}: BalanceCardProps) {
  return (
    <div className={`nx-balance-card ${className}`}>
      <div className="nx-balance-card__top">
        <span className="nx-balance-card__label">
          {label}
        </span>

        {icon ? (
          <span className="nx-balance-card__icon">
            {icon}
          </span>
        ) : null}
      </div>

      <div className="nx-balance-card__amount">
        {amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        <span>{currency}</span>
      </div>

      {subtitle ? (
        <div className="nx-balance-card__subtitle">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: ReactNode;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <div className={`nx-stat-card ${className}`}>
      <div className="nx-stat-card__top">
        <span className="nx-stat-card__label">
          {label}
        </span>

        {icon ? (
          <span className="nx-stat-card__icon">
            {icon}
          </span>
        ) : null}
      </div>

      <div className="nx-stat-card__value">
        {value}
      </div>

      {trend ? (
        <div className="nx-stat-card__trend">
          {trend}
        </div>
      ) : null}
    </div>
  );
}

type PlanRateProps = {
  rate: number;
  label?: string;
};

export function PlanRate({
  rate,
  label = "Daily return",
}: PlanRateProps) {
  return (
    <div className="nx-plan-rate">
      <strong>{rate}%</strong>
      <span>{label}</span>
    </div>
  );
}

type CalculationRowProps = {
  label: string;
  value: ReactNode;
  highlight?: boolean;
};

export function CalculationRow({
  label,
  value,
  highlight = false,
}: CalculationRowProps) {
  return (
    <div
      className={`nx-calculation-row ${
        highlight ? "is-highlight" : ""
      }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

type MenuItemProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function MenuItem({
  icon,
  title,
  description,
  trailing,
  onClick,
  disabled = false,
  className = "",
}: MenuItemProps) {
  const content = (
    <>
      <span className="nx-menu-item__icon">
        {icon}
      </span>

      <span className="nx-menu-item__content">
        <strong>{title}</strong>

        {description ? (
          <small>{description}</small>
        ) : null}
      </span>

      {trailing ? (
        <span className="nx-menu-item__trailing">
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={`nx-menu-item ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`nx-menu-item ${className}`}>
      {content}
    </div>
  );
}

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`nx-empty-state ${className}`}>
      {icon ? (
        <div className="nx-empty-state__icon">
          {icon}
        </div>
      ) : null}

      <h3>{title}</h3>

      {description ? (
        <p>{description}</p>
      ) : null}

      {actionLabel && onAction ? (
        <button
          type="button"
          className="nx-button nx-button--primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

type FeatureIconProps = {
  icon: ReactNode;
  tone?: "primary" | "accent" | "neutral";
  size?: "sm" | "md" | "lg";
};

export function FeatureIcon({
  icon,
  tone = "primary",
  size = "md",
}: FeatureIconProps) {
  return (
    <span
      className={`nx-feature-icon nx-feature-icon--${tone} nx-feature-icon--${size}`}
    >
      {icon}
    </span>
  );
}

export function InvestmentStatus({
  status,
}: {
  status: InvestmentStatus | string;
}) {
  const normalized = status.toLowerCase();

  let label = "Pending";
  let className = "pending";

  if (
    normalized === "active" ||
    normalized === "running"
  ) {
    label = "Active";
    className = "active";
  } else if (
    normalized === "completed" ||
    normalized === "matured"
  ) {
    label = "Completed";
    className = "completed";
  } else if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    label = "Cancelled";
    className = "cancelled";
  }

  return (
    <span
      className={`nx-investment-status nx-investment-status--${className}`}
    >
      {label}
    </span>
  );
}

type SectionTitleProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
};

export function SectionTitle({
  title,
  description,
  action,
  onAction,
  children,
  className = "",
}: SectionTitleProps) {
  let actionContent = action;

  if (
    typeof action === "string" &&
    onAction
  ) {
    actionContent = (
      <button
        type="button"
        className="nx-inline-action"
        onClick={onAction}
      >
        {action}
      </button>
    );
  }

  return (
    <div className={`nx-section-title ${className}`}>
      <div>
        <h2>{title}</h2>

        {description ? (
          <p>{description}</p>
        ) : null}
      </div>

      {actionContent ? (
        <div className="nx-section-title__action">
          {actionContent}
        </div>
      ) : null}

      {children}
    </div>
  );
}

type ToastProps = {
  message: string;
  type: ToastType;
};

export function ToastMessage({
  message,
  type,
}: ToastProps) {
  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "error"
        ? XCircle
        : type === "warning"
          ? CircleAlert
          : Info;

  return (
    <div
      className={`nx-toast nx-toast--${type}`}
      role="status"
    >
      <Icon size={18} />
      <span>{message}</span>
    </div>
  );
}
