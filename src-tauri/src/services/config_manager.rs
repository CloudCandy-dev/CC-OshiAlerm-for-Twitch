//! 設定ファイル管理サービス
//! JSON5形式の設定ファイルの読み書きを担当

use crate::models::Config;
use crate::constants;
use std::fs;
use std::path::PathBuf;
use std::sync::RwLock;

/// 設定ファイルのパスを取得
fn get_config_path() -> PathBuf {
    // 実行ファイルのディレクトリを基準にする
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));
    
    exe_dir.join(constants::CONFIG_DIR).join(constants::CONFIG_FILE)
}

/// 設定ファイルのディレクトリを取得（開発時用）
fn get_dev_config_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join(constants::CONFIG_DIR)
        .join(constants::CONFIG_FILE)
}

/// 設定マネージャー
pub struct ConfigManager {
    config: RwLock<Config>,
    config_path: PathBuf,
}

impl ConfigManager {
    /// 新しいConfigManagerを作成
    pub fn new() -> Self {
        // 開発時はCARGO_MANIFEST_DIRを使用、本番時は実行ファイルのディレクトリを使用
        let config_path = if cfg!(debug_assertions) {
            get_dev_config_path()
        } else {
            get_config_path()
        };

        let config = Self::load_from_file(&config_path).unwrap_or_default();

        ConfigManager {
            config: RwLock::new(config),
            config_path,
        }
    }

    /// ファイルから設定を読み込み
    fn load_from_file(path: &PathBuf) -> Result<Config, String> {
        let content = fs::read_to_string(path)
            .map_err(|e| format!("Failed to read config file: {}", e))?;
        
        json5::from_str(&content)
            .map_err(|e| format!("Failed to parse config file: {}", e))
    }

    /// 現在の設定を取得
    pub fn get_config(&self) -> Config {
        self.config.read().unwrap().clone()
    }

    /// 設定を更新して保存
    pub fn save_config(&self, config: Config) -> Result<(), String> {
        // メモリ上の設定を更新
        {
            let mut current = self.config.write().unwrap();
            *current = config.clone();
        }

        // ファイルに保存
        self.save_to_file(&config)
    }

    /// ファイルに設定を保存
    fn save_to_file(&self, config: &Config) -> Result<(), String> {
        // JSON形式で保存（JSON5はJSONのスーパーセットなので互換性あり）
        let content = serde_json::to_string_pretty(config)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;

        // ディレクトリが存在しない場合は作成
        if let Some(parent) = self.config_path.parent() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create config directory: {}", e))?;
        }

        fs::write(&self.config_path, content)
            .map_err(|e| format!("Failed to write config file: {}", e))
    }

    /// 設定をリロード
    pub fn reload(&self) -> Result<(), String> {
        let config = Self::load_from_file(&self.config_path)?;
        let mut current = self.config.write().unwrap();
        *current = config;
        Ok(())
    }

    /// 特定のフィールドを更新
    pub fn update_field<F>(&self, updater: F) -> Result<(), String>
    where
        F: FnOnce(&mut Config),
    {
        let mut config = self.get_config();
        updater(&mut config);
        self.save_config(config)
    }
}

impl Default for ConfigManager {
    fn default() -> Self {
        Self::new()
    }
}

// グローバルな設定マネージャーインスタンス
lazy_static::lazy_static! {
    pub static ref CONFIG_MANAGER: ConfigManager = ConfigManager::new();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_config_load() {
        let config = CONFIG_MANAGER.get_config();
        // デフォルト値または保存されている値が取得できること
        assert!(!config.language.is_empty());
    }

    #[test]
    fn test_config_update() {
        let original_lang = CONFIG_MANAGER.get_config().language;
        let test_lang = "test_lang_code";
        
        CONFIG_MANAGER.update_field(|c| c.language = test_lang.to_string()).unwrap();
        assert_eq!(CONFIG_MANAGER.get_config().language, test_lang);
        
        // 元に戻す
        CONFIG_MANAGER.update_field(|c| c.language = original_lang).unwrap();
    }
}
