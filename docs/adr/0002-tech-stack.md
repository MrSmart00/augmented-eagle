# 技術スタックの選定

- ステータス: Accepted
- 決定日: 2026-04-15
- 決定者: プロジェクトチーム

## コンテキスト

React Native学習プロジェクトとして、モダンかつ安定した技術基盤を選定する必要があった。Expoのマネージドワークフローを活用しつつ、最新のReact Native機能（New Architecture）を取り入れたい。

## 検討した選択肢

1. **Expo（マネージドワークフロー）** — Expoが提供するビルド・設定の自動管理を活用
2. **React Native CLI（ベアワークフロー）** — ネイティブコードを直接管理
3. **他のクロスプラットフォームフレームワーク** — Flutter、Kotlin Multiplatformなど

## 決定

**Expo マネージドワークフロー**を採用し、以下の技術スタックを選定した。

| カテゴリ | 選定技術 | バージョン |
|---------|---------|-----------|
| フレームワーク | Expo + React Native + React | 55 / 0.83 / 19.2 |
| 言語 | TypeScript (strict mode) | 5.9 |
| ルーティング | Expo Router | ファイルベース |
| パッケージ管理 | pnpm | 10.33.0 |
| ランタイム | Node.js | 24 |

主な設定:
- `tsconfig.json`: `"strict": true` で型安全性を強制
- `package.json`: `"packageManager": "pnpm@10.33.0"` でpnpmバージョンを固定
- パスエイリアス `@/*` で絶対インポートを使用
- `app.json`: `"newArchEnabled": true` でNew Architecture有効化、`"typedRoutes": true` で型安全ルーティング

## 結果

### ポジティブな影響

- Expoによりネイティブビルド設定の複雑さを回避できる
- TypeScript strict modeにより型安全性が保証される
- pnpmによる高速なパッケージインストールとディスク効率
- Expo Routerのファイルベースルーティングにより直感的な画面管理

### ネガティブな影響

- Expoがサポートしないネイティブモジュールは使用できない
- pnpmのhoisted設定（`.npmrc`）が必要でExpo互換性のための妥協がある
- New Architecture対応のライブラリに限定される

## 参考

- `tsconfig.json` — TypeScript設定
- `package.json` — 依存関係とスクリプト定義
- `app.json` — Expo設定
