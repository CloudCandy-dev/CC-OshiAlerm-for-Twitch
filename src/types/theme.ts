/**
 * テーマ関連の型定義
 */

/** テーマカラー */
export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    borderLight: string;
    text: string;
    textSecondary: string;
    textOnPrimary: string;
    success: string;
    error: string;
    warning: string;
    shadow: string;
}

/** テーマデータ */
export interface Theme {
    name: string;
    displayName: string;
    colors: ThemeColors;
}

/** 利用可能なテーマ */
export interface AvailableTheme {
    id: string;
    name: string;
    displayName: string;
}

/** デフォルトの利用可能テーマ（空。動的取得が前提） */
export const availableThemes: AvailableTheme[] = [];

/**
 * 注意:
 * lightTheme, darkTheme などの定数定義は廃止されました。
 * 全てのテーマ定義は src-tauri/themes/*.json5 から動的に取得されます。
 */
