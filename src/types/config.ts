/**
 * 設定関連の型定義
 */

/** アクションの種類 */
export type ActionType = 'alarm' | 'open_browser';

/** アクション設定 */
export interface Action {
  type: ActionType;
  url?: string; // open_browser用
}

/** 監視対象チャンネル */
export interface Channel {
  name: string;
  priority: number;
  actions: Action[];
}

/** アプリケーション設定 */
export interface Config {
  // 一般設定
  language: string;
  theme: string;
  auto_start: boolean;
  minimize_to_tray: boolean;

  // Twitch API設定
  client_id: string;
  client_secret: string;

  // 監視設定
  check_interval_seconds: number;

  // アラーム設定
  alarm_sound_path: string;
  alarm_duration_minutes: number;
  alarm_all_streamers: boolean;

  // 配信者設定
  channels: Channel[];
}

/** デフォルト設定 */
export const defaultConfig: Config = {
  language: 'ja',
  theme: 'light',
  auto_start: false,
  minimize_to_tray: true,
  client_id: '',
  client_secret: '',
  check_interval_seconds: 60,
  alarm_sound_path: 'default/default.mp3',
  alarm_duration_minutes: 5,
  alarm_all_streamers: true,
  channels: [],
};

/** デフォルトのアラームアクション */
export const defaultAlarmAction: Action = {
  type: 'alarm',
};

/** デフォルトのブラウザアクション */
export const createBrowserAction = (channelName: string): Action => ({
  type: 'open_browser',
  url: `https://twitch.tv/${channelName}`,
});
