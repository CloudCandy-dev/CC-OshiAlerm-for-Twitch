use crate::models::{Action, Channel};
use tauri::{AppHandle, Emitter, Runtime};
use crate::services::CONFIG_MANAGER;

pub struct ActionExecutor;

impl ActionExecutor {
    /// 配信開始検知時のアクションを実行
    pub fn execute_actions<R: Runtime>(app_handle: &AppHandle<R>, channel: &Channel) {
        for action in &channel.actions {
            match action {
                Action::Alarm => {
                    // フロントエンドにアラーム開始イベントを通知
                    // 実際のアラーム音の再生パスなどは設定から取得
                    let config = CONFIG_MANAGER.get_config();
                    let sound_path = crate::utils::resolve_sound_path(&config.alarm_sound_path);
                    let _ = app_handle.emit("alarm-started", serde_json::json!({
                        "channel": channel.name,
                        "sound_path": sound_path
                    }));
                }
                Action::OpenBrowser { url } => {
                    // 指定されたURLが空ならデフォルトのTwitchページへ
                    let target_url = if url.is_empty() {
                        format!("{}{}", crate::constants::TWITCH_BASE_URL, channel.name)
                    } else {
                        url.replace("{channel}", &channel.name)
                    };

                    // tauri_plugin_opener を使用してブラウザ起動
                    #[cfg(desktop)]
                    {
                        use tauri_plugin_opener::OpenerExt;
                        let _ = app_handle.opener().open_url(target_url, None::<String>);
                    }
                }
            }
        }
    }

    /// アラーム停止
    pub fn stop_alarm<R: Runtime>(app_handle: &AppHandle<R>) {
        let _ = app_handle.emit("alarm-stopped", ());
    }
}
