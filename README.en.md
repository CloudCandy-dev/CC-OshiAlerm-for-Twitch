# CC-TwitchAlerm (OshiAlerm for Twitch)

A simple and feature-rich desktop notification app that alerts you with sounds and desktop notifications when your favorite Twitch streamers go live.

## Features

- **Real-time Notifications**: Get notified instantly when your favorite streamers go live.
- **Custom Notification Sounds**: Set any audio file as your notification sound (e.g., your "Oshi's" voice!).
- **Multi-language Support**: Supports both Japanese and English. More can be added!
- **Dark Mode Support**: Comes with a sleek dark theme.
- **Auto-start**: Option to launch automatically when Windows starts.

## How to Use

1. Download the application from [here](https://github.com/CloudCandy-dev/CC-OshiAlerm-for-Twitch/releases/download/1.0.0/CC-OshiAlerm-for-Twitch.zip) and extract it.
2. Launch `cc-oshialerm-for-twitch.exe`.
3. Go to Settings (gear icon) and add Twitch streamer names (IDs) you want to follow.
4. If you want to customize the notification sound, select your preferred audio file.
5. Set your Client ID and Client Secret. [How to obtain Client ID & Client Secret](https://programming-zero.net/twitch-api-settings/)
6. Receive an alarm when the broadcast starts.

## Tech Stack

- **Framework**: Tauri v2
- **Frontend**: React + TypeScript
- **Backend**: Rust
- **Build Tool**: Vite

## Setup (For Developers)

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://www.rust-lang.org/)
- Development environment for Windows, macOS, or Linux

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   cd src/CC-OshiAlerm-for-Twitch
   npm install
   ```

### Running in Development Mode

```bash
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

## License

[MIT LICENSE](LICENSE)

Copyright (c) 2026 goriu
