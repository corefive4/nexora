type TelegramWebApp = NonNullable<
  typeof window.Telegram
>["WebApp"];

function getTelegramWebApp():
  | TelegramWebApp
  | null {
  if (
    typeof window === "undefined" ||
    !window.Telegram?.WebApp
  ) {
    return null;
  }

  return window.Telegram.WebApp;
}

function applyTelegramTheme(
  webApp: TelegramWebApp,
): void {
  const root =
    document.documentElement;

  const backgroundColor =
    webApp.backgroundColor;

  if (backgroundColor) {
    root.style.setProperty(
      "--telegram-background",
      backgroundColor,
    );
  }

  /*
   * secondaryBackgroundColor is not exposed by
   * every installed Telegram WebApp type version.
   *
   * Keep the CSS variable available with a safe
   * fallback instead of accessing an unsupported
   * property directly.
   */
  const secondaryBackground =
    backgroundColor || "#111722";

  root.style.setProperty(
    "--telegram-secondary-background",
    secondaryBackground,
  );
}

function applySafeAreaInsets(
  webApp: TelegramWebApp,
): void {
  const root =
    document.documentElement;

  const safeArea =
    webApp.safeAreaInset;

  const contentSafeArea =
    webApp.contentSafeAreaInset;

  if (safeArea) {
    root.style.setProperty(
      "--tg-safe-area-inset-top",
      `${safeArea.top ?? 0}px`,
    );

    root.style.setProperty(
      "--tg-safe-area-inset-bottom",
      `${safeArea.bottom ?? 0}px`,
    );

    root.style.setProperty(
      "--tg-safe-area-inset-left",
      `${safeArea.left ?? 0}px`,
    );

    root.style.setProperty(
      "--tg-safe-area-inset-right",
      `${safeArea.right ?? 0}px`,
    );
  }

  if (contentSafeArea) {
    root.style.setProperty(
      "--tg-content-safe-area-inset-top",
      `${contentSafeArea.top ?? 0}px`,
    );

    root.style.setProperty(
      "--tg-content-safe-area-inset-bottom",
      `${contentSafeArea.bottom ?? 0}px`,
    );

    root.style.setProperty(
      "--tg-content-safe-area-inset-left",
      `${contentSafeArea.left ?? 0}px`,
    );

    root.style.setProperty(
      "--tg-content-safe-area-inset-right",
      `${contentSafeArea.right ?? 0}px`,
    );
  }
}

function applyTelegramEnvironment(
  webApp: TelegramWebApp,
): void {
  applyTelegramTheme(
    webApp,
  );

  applySafeAreaInsets(
    webApp,
  );

  const root =
    document.documentElement;

  root.style.setProperty(
    "--telegram-platform",
    String(
      webApp.platform ?? "unknown",
    ),
  );

  root.style.setProperty(
    "--telegram-version",
    String(
      webApp.version ?? "unknown",
    ),
  );

  if (
    typeof webApp.isExpanded ===
    "boolean"
  ) {
    root.dataset.telegramExpanded =
      webApp.isExpanded
        ? "true"
        : "false";
  }

  if (
    typeof webApp.isFullscreen ===
    "boolean"
  ) {
    root.dataset.telegramFullscreen =
      webApp.isFullscreen
        ? "true"
        : "false";
  }
}

export function initTelegram():
  | TelegramWebApp
  | null {
  const webApp =
    getTelegramWebApp();

  if (!webApp) {
    return null;
  }

  try {
    webApp.ready();
  } catch {
    // Ignore initialization failures.
  }

  try {
    webApp.expand();
  } catch {
    // Some Telegram clients may not
    // support expand().
  }

  applyTelegramEnvironment(
    webApp,
  );

  const handleThemeChanged =
    () => {
      applyTelegramEnvironment(
        webApp,
      );
    };

  const handleViewportChanged =
    () => {
      applySafeAreaInsets(
        webApp,
      );
    };

  try {
    webApp.onEvent(
      "themeChanged",
      handleThemeChanged,
    );

    webApp.onEvent(
      "viewportChanged",
      handleViewportChanged,
    );
  } catch {
    // Older Telegram clients may not
    // expose these events.
  }

  return webApp;
}

export function getTelegramInitData():
  string {
  return (
    getTelegramWebApp()
      ?.initData ?? ""
  );
}

export function getTelegramUser() {
  return (
    getTelegramWebApp()
      ?.initDataUnsafe?.user ??
    null
  );
}

export function closeTelegramApp():
  void {
  const webApp =
    getTelegramWebApp();

  if (!webApp) {
    return;
  }

  try {
    webApp.close();
  } catch {
    // Ignore unsupported close behavior.
  }
}
