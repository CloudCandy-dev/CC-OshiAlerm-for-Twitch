//! 配信状態データモデル

use serde::{Deserialize, Serialize};

/// 配信状況
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StreamerStatus {
    /// 配信者名（Twitchユーザー名）
    pub name: String,
    /// 配信中かどうか
    pub is_live: bool,
    /// 配信タイトル
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    /// ゲーム名
    #[serde(skip_serializing_if = "Option::is_none")]
    pub game_name: Option<String>,
    /// 視聴者数
    #[serde(skip_serializing_if = "Option::is_none")]
    pub viewer_count: Option<u64>,
    /// 配信開始日時
    #[serde(skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,
}

impl StreamerStatus {
    pub fn offline(name: &str) -> Self {
        Self {
            name: name.to_string(),
            is_live: false,
            title: None,
            game_name: None,
            viewer_count: None,
            started_at: None,
        }
    }
}
