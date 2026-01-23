//! パス関連のユーティリティ

use std::path::PathBuf;
use crate::constants;

/// リソースディレクトリのパスを取得
pub fn get_resource_dir(dir_name: &str) -> PathBuf {
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));
    
    // 開発時はソースツリーのディレクトリ、本番時は実行ファイルと同階層
    let dev_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join(dir_name);
    if dev_path.exists() {
        dev_path
    } else {
        exe_dir.join(dir_name)
    }
}

/// アラーム音のフルパスを解決（相対パスなら絶対パスに変換）
pub fn resolve_sound_path(path: &str) -> String {
    let p = PathBuf::from(path);
    if p.is_absolute() {
        return path.to_string();
    }

    // 相対パスの場合は sounds ディレクトリ基準で解決を試みる
    let sounds_dir = get_resource_dir(constants::SOUNDS_DIR);
    let full_path = sounds_dir.join(path);
    
    if full_path.exists() {
        full_path.to_string_lossy().to_string()
    } else {
        // それでも見つからない場合は sounds ディレクトリ直下も探す
        let alt_path = sounds_dir.join(p.file_name().unwrap_or_default());
        if alt_path.exists() {
            alt_path.to_string_lossy().to_string()
        } else {
            // 最終手段として元の値を返す（ログ用）
            path.to_string()
        }
    }
}
