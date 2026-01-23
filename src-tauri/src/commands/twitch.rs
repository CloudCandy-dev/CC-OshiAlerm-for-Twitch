use crate::models::StreamerStatus;
use crate::services::TwitchService;
use tauri::{State, Runtime};

/// 現在の配信状況を取得
#[tauri::command]
pub async fn get_stream_status(
    twitch_service: State<'_, TwitchService<tauri::Wry>>
) -> Result<Vec<StreamerStatus>, String> {
    twitch_service.check_stream_statuses().await
}

/// 即時チェックを実行
#[tauri::command]
pub async fn check_streams_now(
    twitch_service: State<'_, TwitchService<tauri::Wry>>
) -> Result<Vec<StreamerStatus>, String> {
    twitch_service.check_stream_statuses().await
}

// テスト用のジェネリック実装（テストコードから直接呼び出す用）
pub async fn check_stream_statuses_generic<R: Runtime>(
    twitch_service: State<'_, TwitchService<R>>
) -> Result<Vec<StreamerStatus>, String> {
    twitch_service.check_stream_statuses().await
}
