export {};

declare global {
  interface TelegramWebAppUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
  }

  interface TelegramThemeParams {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    header_bg_color?: string;
    accent_text_color?: string;
    section_bg_color?: string;
    section_header_text_color?: string;
    subtitle_text_color?: string;
    destructive_text_color?: string;
  }

  interface TelegramInitDataUnsafe {
    query_id?: string;
    user?: TelegramWebAppUser;
    receiver?: TelegramWebAppUser;
    chat?: unknown;
    start_param?: string;
    auth_date?: number;
    hash?: string;
    signature?: string;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: TelegramInitDataUnsafe;
    version: string;
    platform: string;
    colorScheme: "light" | "dark";
    themeParams: TelegramThemeParams;

    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    isFullscreen?: boolean;

    backgroundColor?: string;

    safeAreaInset?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };

    contentSafeAreaInset?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };

    ready(): void;
    expand(): void;

    close(): void;

    onEvent(
      eventType: string,
      callback: (...args: unknown[]) => void,
    ): void;

    offEvent?(
      eventType: string,
      callback: (...args: unknown[]) => void,
    ): void;

    openTelegramLink(url: string): void;
    openLink(
      url: string,
      options?: {
        try_instant_view?: boolean;
      },
    ): void;

    showPopup(
      params: {
        title?: string;
        message: string;
        buttons?: Array<{
          id?: string;
          type?:
            | "default"
            | "ok"
            | "close"
            | "cancel"
            | "destructive";
          text: string;
        }>;
      },
      callback?: (buttonId: string) => void,
    ): void;

    showAlert(
      message: string,
      callback?: () => void,
    ): void;

    showConfirm(
      message: string,
      callback?: (confirmed: boolean) => void,
    ): void;

    HapticFeedback?: {
      impactOccurred(
        style:
          | "light"
          | "medium"
          | "heavy"
          | "rigid"
          | "soft",
      ): void;

      notificationOccurred(
        type:
          | "error"
          | "success"
          | "warning",
      ): void;

      selectionChanged(): void;
    };
  }

  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
