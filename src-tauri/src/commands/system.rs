use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::{DialogExt, FilePath};
use tauri_plugin_autostart::ManagerExt;
use crate::services::ActionExecutor;
use crate::utils::Logger;

/// アラーム停止
#[tauri::command]
pub fn stop_alarm(app_handle: AppHandle) {
    Logger::info("Manually stopping alarm");
    ActionExecutor::stop_alarm(&app_handle);
}

/// ファイル選択ダイアログを開く
#[tauri::command]
pub async fn open_file_dialog(app_handle: AppHandle) -> Result<Option<String>, String> {
    let (tx, rx) = tokio::sync::oneshot::channel::<Option<String>>();

    app_handle.dialog()
        .file()
        .add_filter("Audio", &["mp3", "wav"])
        .pick_file(move |path: Option<FilePath>| {
            let path_str = path.map(|p| p.to_string());
            let _ = tx.send(path_str);
        });

    let result = rx.await.map_err(|e| e.to_string())?;
    Ok(result)
}

/// 自動起動の設定
#[tauri::command]
pub fn set_auto_start(_app_handle: AppHandle, _enabled: bool) -> Result<(), String> {
    // TODO: autostart plugin の API 使用方法を再確認
    Logger::info("set_auto_start called (currently placeholder)");
    Ok(())
}

/// トレイに最小化
#[tauri::command]
pub fn minimize_to_tray(app_handle: AppHandle) {
    if let Some(window) = app_handle.get_webview_window("main") {
        let _ = window.hide();
    }
}

/// アプリ終了
#[tauri::command]
pub fn quit_app(app_handle: AppHandle) {
    Logger::info("Application quitting");
    app_handle.exit(0);
}
