//! リソース管理関連の Tauri コマンド

use std::fs;
use std::path::PathBuf;
use serde::Serialize;
use crate::constants;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AvailableResource {
    pub id: String,
    pub name: String,
    pub display_name: String,
}

use crate::utils::get_resource_dir;

/// 利用可能な言語の一覧を取得
#[tauri::command]
pub fn get_available_languages() -> Result<Vec<AvailableResource>, String> {
    let lang_dir = get_resource_dir(constants::LANGUAGES_DIR);
    let mut languages = Vec::new();

    if let Ok(entries) = fs::read_dir(lang_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("json5") {
                if let Some(file_stem) = path.file_stem().and_then(|s| s.to_str()) {
                    let content = fs::read_to_string(&path)
                        .map_err(|e| format!("Failed to read lang file: {}", e))?;
                    
                    let data: serde_json::Value = json5::from_str(&content)
                        .map_err(|e| format!("Failed to parse lang file {}: {}", file_stem, e))?;
                    
                    let display_name = data.get("__displayName")
                        .and_then(|v| v.as_str())
                        .unwrap_or(file_stem);

                    languages.push(AvailableResource {
                        id: file_stem.to_string(),
                        name: file_stem.to_string(),
                        display_name: display_name.to_string(),
                    });
                }
            }
        }
    }

    Ok(languages)
}

/// 言語データの取得
#[tauri::command]
pub fn get_language_data(code: String) -> Result<serde_json::Value, String> {
    let lang_path = get_resource_dir(constants::LANGUAGES_DIR).join(format!("{}.json5", code));
    let content = fs::read_to_string(lang_path).map_err(|e| format!("Failed to read language file: {}", e))?;
    json5::from_str(&content).map_err(|e| format!("Failed to parse language file: {}", e))
}

/// 利用可能なテーマの一覧を取得
#[tauri::command]
pub fn get_available_themes() -> Result<Vec<AvailableResource>, String> {
    let theme_dir = get_resource_dir(constants::THEMES_DIR);
    let mut themes = Vec::new();

    if let Ok(entries) = fs::read_dir(theme_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("json5") {
                if let Some(file_stem) = path.file_stem().and_then(|s| s.to_str()) {
                    let content = fs::read_to_string(&path)
                        .map_err(|e| format!("Failed to read theme file: {}", e))?;
                    
                    let data: serde_json::Value = json5::from_str(&content)
                        .map_err(|e| format!("Failed to parse theme file {}: {}", file_stem, e))?;
                    
                    let display_name = data.get("displayName")
                        .and_then(|v| v.as_str())
                        .unwrap_or(file_stem);

                    themes.push(AvailableResource {
                        id: file_stem.to_string(),
                        name: file_stem.to_string(),
                        display_name: display_name.to_string(),
                    });
                }
            }
        }
    }

    Ok(themes)
}

/// テーマデータの取得
#[tauri::command]
pub fn get_theme_data(id: String) -> Result<serde_json::Value, String> {
    let theme_path = get_resource_dir(constants::THEMES_DIR).join(format!("{}.json5", id));
    let content = fs::read_to_string(theme_path).map_err(|e| format!("Failed to read theme file: {}", e))?;
    json5::from_str(&content).map_err(|e| format!("Failed to parse theme file: {}", e))
}

/// アラーム音ファイルをアプリ内ディレクトリにインポート
#[tauri::command]
pub fn import_alarm_sound(path: String) -> Result<String, String> {
    let source_path = PathBuf::from(&path);
    if !source_path.exists() {
        return Err("Source file does not exist".to_string());
    }

    let extension = source_path.extension()
        .and_then(|s| s.to_str())
        .unwrap_or("mp3");
    
    let sounds_dir = get_resource_dir(constants::SOUNDS_DIR).join("custom");
    if !sounds_dir.exists() {
        fs::create_dir_all(&sounds_dir).map_err(|e| format!("Failed to create sounds/custom dir: {}", e))?;
    }

    // ファイル名を固定（alarm.extension）にして上書き、または初期化する
    let dest_path = sounds_dir.join(format!("alarm.{}", extension));
    
    // 同一ファイルでないことを確認
    if source_path != dest_path {
        fs::copy(&source_path, &dest_path).map_err(|e| format!("Failed to copy sound file: {}", e))?;
    }

    // アセットプロトコルなどで使用可能なフルパスを返す
    Ok(dest_path.to_string_lossy().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_available_languages() {
        let langs = get_available_languages().unwrap();
        assert!(!langs.is_empty());
        
        let ja = langs.iter().find(|l| l.id == "ja").unwrap();
        assert_eq!(ja.display_name, "日本語");
    }

    #[test]
    fn test_available_themes() {
        let themes = get_available_themes().unwrap();
        assert!(!themes.is_empty());
        
        let light = themes.iter().find(|t| t.id == "light").unwrap();
        assert_eq!(light.display_name, "Light");
    }

    #[test]
    fn test_get_resource_dir() {
        let dir = get_resource_dir("languages");
        assert!(dir.exists());
        assert!(dir.is_dir());
    }
}
