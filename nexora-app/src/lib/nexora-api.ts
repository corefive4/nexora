import { supabase } from "./supabase";
import type {
  DepositAddress,
  Investment,
  InvestmentPlan,
  Wallet,
} from "../nexora/types";

const SESSION_KEY = "nexora_session_token";

type JsonObject = Record<string, unknown>;

function isObject(
  value: unknown,
): value is JsonObject {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function getValue<T>(
  value: unknown,
  key: string,
): T | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  return value[key] as T | undefined;
}

function unwrap<T>(value: unknown): T {
  if (isObject(value) && "data" in value) {
    return value.data as T;
  }

  return value as T;
}

async function invoke<T>(
  functionName: string,
  body: JsonObject,
): Promise<T> {
  const { data, error } =
    await supabase.functions.invoke(
      functionName,
      { body },
    );

  if (error) {
    throw error;
  }

  return unwrap<T>(data);
}

export function getStoredSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function saveSession(
  token: string,
): void {
  try {
    localStorage.setItem(
      SESSION_KEY,
      token,
    );
  } catch {
    // Ignore storage failures.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(
      SESSION_KEY,
    );
  } catch {
    // Ignore storage failures.
  }
}

export async function authenticateTelegram(
  initData: string,
) {
  const result = await invoke<unknown>(
    "telegram-auth",
    { initData },
  );

  const payload = unwrap<unknown>(result);

  const token =
    getValue<string>(
      payload,
      "sessionToken",
    ) ??
    getValue<string>(
      payload,
      "session_token",
    ) ??
    getValue<string>(
      payload,
      "token",
    );

  if (token) {
    saveSession(token);
  }

  return payload;
}

export async function getWallet(
  sessionToken: string,
): Promise<Wallet | null> {
  const result = await invoke<unknown>(
    "wallet",
    { sessionToken },
  );

  const payload = unwrap<unknown>(result);

  if (
    isObject(payload) &&
    "wallet" in payload
  ) {
    return (
      payload.wallet as Wallet | null
    );
  }

  if (
    isObject(payload) &&
    "data" in payload
  ) {
    return (
      payload.data as Wallet | null
    );
  }

  return payload as Wallet | null;
}

export async function getInvestmentPlans(): Promise<
  InvestmentPlan[]
> {
  const result = await invoke<unknown>(
    "investment-plans",
    {},
  );

  const payload = unwrap<unknown>(result);

  let rows: unknown = payload;

  if (isObject(payload)) {
    rows =
      payload.plans ??
      payload.data ??
      [];
  }

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .filter(isObject)
    .map((row) => {
      const dailyRate =
        Number(
          row.dailyRate ??
            row.daily_rate ??
            row.rate ??
            0,
        );

      const durationDays =
        Number(
          row.durationDays ??
            row.duration_days ??
            row.duration ??
            0,
        );

      const minAmount =
        Number(
          row.minAmount ??
            row.min_amount ??
            0,
        );

      const maxRaw =
        row.maxAmount ??
        row.max_amount;

      return {
        id: String(row.id ?? ""),
        name: String(
          row.name ??
            row.title ??
            "Investment Plan",
        ),
        slug:
          row.slug !== undefined
            ? String(row.slug)
            : undefined,
        description:
          row.description !== undefined
            ? String(row.description)
            : undefined,
        dailyRate,
        rate:
          row.rate !== undefined
            ? Number(row.rate)
            : dailyRate,
        durationDays,
        duration: durationDays,
        minAmount,
        maxAmount:
          maxRaw === null ||
          maxRaw === undefined
            ? null
            : Number(maxRaw),
        currency:
          row.currency !== undefined
            ? String(row.currency)
            : "USDT",
        isActive:
          typeof row.isActive === "boolean"
            ? row.isActive
            : typeof row.is_active === "boolean"
              ? row.is_active
              : true,
        sortOrder:
          row.sortOrder !== undefined
            ? Number(row.sortOrder)
            : row.sort_order !== undefined
              ? Number(row.sort_order)
              : undefined,
      };
    })
    .filter(
      (plan) => plan.id.length > 0,
    );
}

export async function createInvestment(
  planId: string,
  amount: number,
  sessionToken?: string,
): Promise<Investment> {
  const token =
    sessionToken ??
    getStoredSession();

  const result = await invoke<unknown>(
    "create-investment",
    {
      planId,
      amount,
      sessionToken: token,
    },
  );

  return unwrap<Investment>(result);
}

export async function getDepositAddress(
  sessionToken: string,
): Promise<DepositAddress | null> {
  const result = await invoke<unknown>(
    "deposit-address",
    { sessionToken },
  );

  const payload = unwrap<unknown>(result);

  if (
    isObject(payload) &&
    "depositAddress" in payload
  ) {
    return (
      payload.depositAddress as
        | DepositAddress
        | null
    );
  }

  if (
    isObject(payload) &&
    "address" in payload
  ) {
    return payload as DepositAddress;
  }

  return payload as DepositAddress | null;
}
