//! システムトレイ管理サービス

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Runtime,
};
use crate::services::ActionExecutor;
use crate::utils::i18n;

pub struct TrayManager;

impl TrayManager {
    /// システムトレイの初期化
    pub fn init<R: Runtime>(app_handle: &AppHandle<R>) -> Result<(), tauri::Error> {
        let show_item = MenuItem::with_id(app_handle, "show", i18n::t("tray_show"), true, None::<&str>)?;
        let stop_alarm_item = MenuItem::with_id(app_handle, "stop_alarm", i18n::t("stop_alarm"), true, None::<&str>)?;
        let quit_item = MenuItem::with_id(app_handle, "quit", i18n::t("tray_quit"), true, None::<&str>)?;

        let menu = Menu::with_items(
            app_handle,
            &[&show_item, &stop_alarm_item, &quit_item],
        )?;

        let _ = TrayIconBuilder::with_id("main_tray")
            .menu(&menu)
            .show_menu_on_left_click(false)
            .icon(app_handle.default_window_icon().unwrap().clone())
            .on_menu_event(move |app, event| {
                match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "stop_alarm" => {
                        ActionExecutor::stop_alarm(app);
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                }
            })
            .on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } = event
                {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            })
            .build(app_handle)?;

        Ok(())
    }
}
