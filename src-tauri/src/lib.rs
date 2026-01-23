//! CC-OshiAlerm for Twitch - Twitch Stream Alarm Application

// モジュール
pub mod commands;
pub mod models;
pub mod services;
pub mod utils;
pub mod constants;

// 外部クレート
extern crate lazy_static;

use tauri::Manager;
use commands::{
    get_config, reload_config, save_config, 
    get_stream_status, check_streams_now, 
    stop_alarm, minimize_to_tray, quit_app,
    open_file_dialog, set_auto_start,
    get_available_languages, get_language_data,
    get_available_themes, get_theme_data,
    import_alarm_sound
};
use services::{TwitchService, CONFIG_MANAGER};
use std::time::Duration;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, Some(vec!["--minimized"])))
        .setup(|app| {
            let handle = app.handle().clone();
            let twitch_service = TwitchService::new(handle.clone());
            app.manage(twitch_service);

            // システムトレイの初期化
            let _ = services::TrayManager::init(&handle);

            // 定期監視ループをバックグラウンドで開始
            let handle_for_loop = handle.clone();
            tauri::async_runtime::spawn(async move {
                loop {
                    if let Some(service) = tauri::Manager::try_state::<TwitchService<tauri::Wry>>(&handle_for_loop) {
                        let _ = service.check_stream_statuses().await;
                    }

                    let interval = {
                        let config = CONFIG_MANAGER.get_config();
                        config.check_interval_seconds.max(constants::MIN_CHECK_INTERVAL_SECONDS) as u64
                    };

                    tokio::time::sleep(Duration::from_secs(interval)).await;
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_config,
            save_config,
            reload_config,
            get_stream_status,
            check_streams_now,
            stop_alarm,
            minimize_to_tray,
            quit_app,
            open_file_dialog,
            set_auto_start,
            get_available_languages,
            get_language_data,
            get_available_themes,
            get_theme_data,
            import_alarm_sound
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
