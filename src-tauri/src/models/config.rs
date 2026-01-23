//! 設定データモデル
//! config.json5の構造を定義

use serde::{Deserialize, Serialize};

/// アクションの種類
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Action {
    /// アラーム再生
    Alarm,
    /// ブラウザでURLを開く
    OpenBrowser {
        #[serde(default)]
        url: String,
    },
}

impl Default for Action {
    fn default() -> Self {
        Action::Alarm
    }
}

/// 監視対象チャンネル
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Channel {
    /// 配信者名（Twitchユーザー名）
    pub name: String,
    /// 優先度（小さいほど高優先度）
    #[serde(default = "default_priority")]
    pub priority: u32,
    /// 配信開始時のアクション
    #[serde(default)]
    pub actions: Vec<Action>,
}

fn default_priority() -> u32 {
    1
}

/// アプリケーション設定
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    // 一般設定
    #[serde(default = "default_language")]
    pub language: String,
    #[serde(default = "default_theme")]
    pub theme: String,
    #[serde(default)]
    pub auto_start: bool,
    #[serde(default = "default_true")]
    pub minimize_to_tray: bool,

    // Twitch API設定
    #[serde(default)]
    pub client_id: String,
    #[serde(default)]
    pub client_secret: String,

    // 監視設定
    #[serde(default = "default_check_interval")]
    pub check_interval_seconds: u32,

    // アラーム設定
    #[serde(default = "default_alarm_sound_path")]
    pub alarm_sound_path: String,
    #[serde(default = "default_alarm_duration")]
    pub alarm_duration_minutes: u32,
    #[serde(default = "default_true")]
    pub alarm_all_streamers: bool,

    // 配信者設定
    #[serde(default)]
    pub channels: Vec<Channel>,
}

// デフォルト値関数
fn default_language() -> String {
    "ja".to_string()
}

fn default_theme() -> String {
    "light".to_string()
}

fn default_true() -> bool {
    true
}

fn default_check_interval() -> u32 {
    crate::constants::DEFAULT_CHECK_INTERVAL_SECONDS
}

fn default_alarm_sound_path() -> String {
    "default/default.mp3".to_string()
}

fn default_alarm_duration() -> u32 {
    crate::constants::DEFAULT_ALARM_DURATION_MINUTES
}

impl Default for Config {
    fn default() -> Self {
        Config {
            language: default_language(),
            theme: default_theme(),
            auto_start: false,
            minimize_to_tray: true,
            client_id: String::new(),
            client_secret: String::new(),
            check_interval_seconds: default_check_interval(),
            alarm_sound_path: default_alarm_sound_path(),
            alarm_duration_minutes: default_alarm_duration(),
            alarm_all_streamers: true,
            channels: Vec::new(),
        }
    }
}
