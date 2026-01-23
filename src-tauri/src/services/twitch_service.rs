//! Twitch API 連携サービス

use crate::models::StreamerStatus;
use crate::services::{CONFIG_MANAGER, ActionExecutor};
use crate::constants;
use reqwest::Client;
use serde::Deserialize;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;
use tauri::{AppHandle, Emitter, Runtime};

#[derive(Debug, Deserialize)]
struct TokenResponse {
    access_token: String,
    #[allow(dead_code)]
    expires_in: u64,
}

#[derive(Debug, Deserialize)]
struct TwitchStream {
    user_login: String,
    title: String,
    game_name: String,
    viewer_count: u64,
    started_at: String,
    #[serde(rename = "type")]
    stream_type: String,
}

#[derive(Debug, Deserialize)]
struct TwitchStreamsResponse {
    data: Vec<TwitchStream>,
}

pub struct TwitchService<R: Runtime> {
    client: Client,
    app_handle: AppHandle<R>,
    token: Arc<Mutex<Option<(String, std::time::Instant)>>>,
    // 配信者名 -> 前回の配信中フラグ のキャッシュ
    last_live_status: Arc<Mutex<HashMap<String, bool>>>,
}

impl<R: Runtime> TwitchService<R> {
    pub fn new(app_handle: AppHandle<R>) -> Self {
        Self {
            client: Client::new(),
            app_handle,
            token: Arc::new(Mutex::new(None)),
            last_live_status: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    /// アクセストークンの取得（Client Credentials Flow）
    async fn get_access_token(&self, client_id: &str, client_secret: &str) -> Result<String, String> {
        let mut token_guard = self.token.lock().await;

        // キャッシュされたトークンが有効か確認
        if let Some((token, expiry)) = &*token_guard {
            if expiry.elapsed().as_secs() < 3000 { // 期限より少し前に更新
                return Ok(token.clone());
            }
        }

        let params = [
            ("client_id", client_id),
            ("client_secret", client_secret),
            ("grant_type", "client_credentials"),
        ];

        let res = self.client
            .post(constants::TWITCH_AUTH_URL)
            .form(&params)
            .send()
            .await
            .map_err(|e| format!("Failed to request token: {}", e))?;

        if !res.status().is_success() {
            return Err(format!("Token request failed with status: {}", res.status()));
        }

        let token_res: TokenResponse = res.json()
            .await
            .map_err(|e| format!("Failed to parse token response: {}", e))?;

        *token_guard = Some((token_res.access_token.clone(), std::time::Instant::now()));
        Ok(token_res.access_token)
    }

    /// 複数配信者の現在の状態を一括取得
    pub async fn check_stream_statuses(&self) -> Result<Vec<StreamerStatus>, String> {
        let config = CONFIG_MANAGER.get_config();
        if config.client_id.is_empty() || config.client_secret.is_empty() {
            return Err("Twitch API credentials are not configured".to_string());
        }

        if config.channels.is_empty() {
            return Ok(Vec::new());
        }

        let token = self.get_access_token(&config.client_id, &config.client_secret).await?;

        // チャンネル名をパラメータに構築
        let mut query = Vec::new();
        for channel in &config.channels {
            query.push(("user_login", &channel.name));
        }

        let res = self.client
            .get(constants::TWITCH_STREAMS_URL)
            .header("Client-ID", &config.client_id)
            .header("Authorization", format!("Bearer {}", token))
            .query(&query)
            .send()
            .await
            .map_err(|e| format!("Failed to fetch stream status: {}", e))?;

        if !res.status().is_success() {
            return Err(format!("Twitch API request failed: {}", res.status()));
        }

        let streams_res: TwitchStreamsResponse = res.json()
            .await
            .map_err(|e| format!("Failed to parse streams response: {}", e))?;

        // 結果をマップに変換（ログイン名 -> ストリーム情報）
        let live_streams: HashMap<String, &TwitchStream> = streams_res.data
            .iter()
            .filter(|s| s.stream_type == "live")
            .map(|s| (s.user_login.to_lowercase(), s))
            .collect();

        let mut statuses = Vec::new();
        let mut last_status_guard = self.last_live_status.lock().await;

        for channel in &config.channels {
            let name_lower = channel.name.to_lowercase();
            let is_currently_live = live_streams.contains_key(&name_lower);
            
            // 前回の状態を取得（デフォルトは false / オフライン）
            let previously_live = *last_status_guard.get(&name_lower).unwrap_or(&false);

            if is_currently_live {
                let stream = live_streams.get(&name_lower).unwrap();
                statuses.push(StreamerStatus {
                    name: channel.name.clone(),
                    is_live: true,
                    title: Some(stream.title.clone()),
                    game_name: Some(stream.game_name.clone()),
                    viewer_count: Some(stream.viewer_count),
                    started_at: Some(stream.started_at.clone()),
                });

                // オフラインからオンラインに変わった時（＝配信開始）のみアクション実行
                if !previously_live {
                    ActionExecutor::execute_actions(&self.app_handle, channel);
                }
            } else {
                statuses.push(StreamerStatus::offline(&channel.name));
            }

            // 状態を更新
            last_status_guard.insert(name_lower, is_currently_live);
        }

        // フロントエンドに状態更新を通知
        let _ = self.app_handle.emit("stream-status-updated", &statuses);

        Ok(statuses)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tauri::test::MockRuntime;

    fn setup_mock_app() -> AppHandle<MockRuntime> {
        let app = tauri::test::mock_app();
        app.handle().clone()
    }

    #[tokio::test]
    async fn test_get_access_token() {
        let app = setup_mock_app();
        let service = TwitchService::new(app);
        
        // サンプルの認証情報（本物のAPIにリクエストを投げる）
        let client_id = "1uyy3l71x9g7o34oq8fkem89tha79c";
        let client_secret = "90wy6pksxabycn37xqnuth5rcgcder";
        
        let result = service.get_access_token(client_id, client_secret).await;
        assert!(result.is_ok(), "Failed to get access token: {:?}", result.err());
        
        let token = result.unwrap();
        assert!(!token.is_empty());
        
        // キャッシュチェック
        let cached_token = service.get_access_token(client_id, client_secret).await.unwrap();
        assert_eq!(token, cached_token);
    }

    #[tokio::test]
    async fn test_check_stream_statuses() {
        let app = setup_mock_app();
        let service = TwitchService::new(app);
        
        // config.json5 が正しく設定されている前提（setupで設定済み）
        let result = service.check_stream_statuses().await;
        assert!(result.is_ok(), "Failed to check stream statuses: {:?}", result.err());
        
        let statuses = result.unwrap();
        assert!(!statuses.is_empty());
        assert_eq!(statuses[0].name, "rio_shinohana");
    }
}
