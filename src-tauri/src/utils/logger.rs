//! ログ出力ユーティリティ

use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use chrono::Local;

pub enum LogLevel {
    Info,
    Warn,
    Error,
}

impl LogLevel {
    fn as_str(&self) -> &str {
        match self {
            LogLevel::Info => "INFO",
            LogLevel::Warn => "WARN",
            LogLevel::Error => "ERROR",
        }
    }
}

pub struct Logger;

impl Logger {
    fn get_log_path() -> PathBuf {
        let exe_dir = std::env::current_exe()
            .ok()
            .and_then(|p| p.parent().map(|p| p.to_path_buf()))
            .unwrap_or_else(|| PathBuf::from("."));
        
        exe_dir.join(crate::constants::LOG_DIR).join(crate::constants::LOG_FILE)
    }

    pub fn log(level: LogLevel, message: &str) {
        let log_path = Self::get_log_path();
        
        // ディレクトリ作成
        if let Some(parent) = log_path.parent() {
            let _ = fs::create_dir_all(parent);
        }

        let timestamp = Local::now().format("%Y-%m-%d %H:%M:%S");
        let log_entry = format!("[{}] [{}] {}\n", timestamp, level.as_str(), message);

        if let Ok(mut file) = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_path)
        {
            let _ = file.write_all(log_entry.as_bytes());
        }

        // 標準出力にも出す（デバッグ用）
        println!("{}", log_entry.trim());
    }

    pub fn info(message: &str) { Self::log(LogLevel::Info, message); }
    pub fn warn(message: &str) { Self::log(LogLevel::Warn, message); }
    pub fn error(message: &str) { Self::log(LogLevel::Error, message); }
}
