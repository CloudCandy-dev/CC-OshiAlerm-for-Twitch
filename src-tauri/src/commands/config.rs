//! Tauriコマンド - 設定関連

use crate::models::Config;
use crate::services::CONFIG_MANAGER;

/// 設定を取得
#[tauri::command]
pub fn get_config() -> Result<Config, String> {
    Ok(CONFIG_MANAGER.get_config())
}

/// 設定を保存
#[tauri::command]
pub fn save_config(config: Config) -> Result<(), String> {
    CONFIG_MANAGER.save_config(config)
}

/// 設定をリロード
#[tauri::command]
pub fn reload_config() -> Result<Config, String> {
    CONFIG_MANAGER.reload()?;
    Ok(CONFIG_MANAGER.get_config())
}
