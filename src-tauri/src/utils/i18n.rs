//! 国際化ユーティリティ

use crate::services::CONFIG_MANAGER;
use std::fs;
use std::path::PathBuf;

/// 指定されたキーの翻訳を取得
pub fn t(key: &str) -> String {
    let config = CONFIG_MANAGER.get_config();
    let lang_code = config.language;
    
    let lang_dir = crate::utils::get_resource_dir("languages");
    let lang_path = lang_dir.join(format!("{}.json5", lang_code));
    
    if let Ok(content) = fs::read_to_string(lang_path) {
        if let Ok(data) = json5::from_str::<serde_json::Value>(&content) {
            if let Some(val) = data.get(key).and_then(|v| v.as_str()) {
                return val.to_string();
            }
        }
    }
    
    key.to_string()
}


#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::CONFIG_MANAGER;
    use crate::models::Config;

    #[test]
    fn test_translation_ja() {
        // 日本語に設定
        CONFIG_MANAGER.update_field(|c| c.language = "ja".to_string()).ok();
        
        let result = t("app_title");
        assert_ne!(result, "app_title");
        // ja.json5 の内容に依存するが、少なくともキーそのままではないはず
    }

    #[test]
    fn test_translation_en() {
        // 英語に設定
        CONFIG_MANAGER.update_field(|c| c.language = "en".to_string()).ok();
        
        let result = t("app_title");
        assert_ne!(result, "app_title");
    }

    #[test]
    fn test_missing_translation() {
        let result = t("non_existent_key_12345");
        assert_eq!(result, "non_existent_key_12345");
    }
}
