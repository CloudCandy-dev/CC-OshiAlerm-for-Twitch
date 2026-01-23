# CC-TwitchAlerm (OshiAlerm for Twitch)

Twitch のお気に入りの配信者が配信を開始した際、デスクトップ通知と音で知らせてくれるシンプルで高機能なデスクトップ通知アプリです。

## 主な機能

- **リアルタイム通知**: お気に入りの配信者がライブになった際、即座に通知を受け取れます。
- **カスタム通知音**: 自分の好きな音声を通知音として設定できます（推しの声など！）。
- **複数言語対応**: 日本語と英語に対応しています。追加可能！
- **ダークモード対応**: 目に優しいダークテーマをサポート。
- **自動起動**: Windows 起動時に自動で常駐させることが可能です。

## 使い方

1. [こちら](https://programming-zero.net/twitch-api-settings/](https://github.com/CloudCandy-dev/CC-OshiAlerm-for-Twitch/releases/download/1.0.0/CC-OshiAlerm-for-Twitch.zip)よりアプリをダウンロードして、解凍します。
2. 「cc-oshialerm-for-twitch.exe」を起動します。
3. 設定（歯車アイコン）から Twitch の配信者名（ID）を登録します。
4. 通知音をカスタマイズしたい場合は、お好みの音声ファイルを選択します。
5. Client ID、Client Secretを設定します。[Client ID、Client Secretの取得方法](https://programming-zero.net/twitch-api-settings/)
6. 配信が始まるとアラームが鳴ります。

## 技術スタック

- **フレームワーク**: Tauri v2
- **フロントエンド**: React + TypeScript
- **バックエンド**: Rust
- **ビルドツール**: Vite

## セットアップ手順（開発者向け）

### 必要条件

- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://www.rust-lang.org/)
- Windows, macOS, または Linux の開発環境

### インストール

1. リポジトリをクローンまたはダウンロードします
2. 依存関係をインストールします
   ```bash
   cd src/CC-OshiAlerm-for-Twitch
   npm install
   ```

### 開発モードでの実行

```bash
npm run tauri dev
```

### ビルド

```bash
npm run tauri build
```

## ライセンス

[MIT LICENSE](LICENSE)

Copyright (c) 2026 goriu
