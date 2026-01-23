/**
 * 言語関連の型定義
 */

/** 言語データ（キー: テキストのマッピング） */
export type LanguageData = Record<string, string>;

/** 利用可能な言語 */
export interface AvailableLanguage {
    id: string;
    name: string;
    displayName: string;
}

/** デフォルトの利用可能言語 */
export const availableLanguages: AvailableLanguage[] = [];
