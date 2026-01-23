//! アプリケーション共通の定数定義

pub const PROJECT_NAME: &str = "CC-OshiAlerm for Twitch";

// ファイルパス・ディレクトリ
pub const CONFIG_DIR: &str = "configs";
pub const CONFIG_FILE: &str = "config.json5";
pub const LOG_DIR: &str = "logs";
pub const LOG_FILE: &str = "app.log";
pub const LANGUAGES_DIR: &str = "languages";
pub const THEMES_DIR: &str = "themes";
pub const SOUNDS_DIR: &str = "sounds";

// Twitch API
pub const TWITCH_AUTH_URL: &str = "https://id.twitch.tv/oauth2/token";
pub const TWITCH_STREAMS_URL: &str = "https://api.twitch.tv/helix/streams";
pub const TWITCH_BASE_URL: &str = "https://twitch.tv/";

// 監視設定
pub const MIN_CHECK_INTERVAL_SECONDS: u32 = 30;
pub const DEFAULT_CHECK_INTERVAL_SECONDS: u32 = 60;
pub const DEFAULT_ALARM_DURATION_MINUTES: u32 = 5;
