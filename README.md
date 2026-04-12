# 🦅 Augmented Eagle (A.E.)

<p align="center">
  <img src="https://github.com/user-attachments/assets/ea3e7be5-1d00-4a09-a6a2-88fee227da92" alt="Augmented Eagle" width="400" />
</p>

>> [AI-DLC（AI-Driven Development Lifecycle）](https://aws.amazon.com/jp/blogs/news/ai-driven-development-life-cycle/)を実践しながらポケモン図鑑アプリを構築するプロジェクト

---

## ✨ 概要

**Augmented Eagle** は、AWS が提唱する **AI-DLC（AI-Driven Development Lifecycle）** を実践するプロジェクトです。ポケモン図鑑アプリを題材に、AI を開発プロセスの中核に据えた新しい開発ワークフローを探求しています。

GitHub Issues #1〜#5 に定義された各ステップに沿って、AI と協働しながら機能を段階的に構築しています。

### AI-DLC の 3 フェーズをこのプロジェクトで実践

1. **Inception（計画）** — GitHub Issues で要件を定義し、AI との対話でユーザーストーリー・仕様に落とし込む
2. **Construction（構築）** — AI がコード実装・テスト作成・リファクタリングを実行し、人間がレビュー・承認する
3. **Deployment（展開）** — CI/CD でビルド・テスト・デプロイを自動化し、フィードバックを次のサイクルに活かす

---

## 🔧 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Expo 54 / React Native 0.81 / React 19 |
| 言語 | TypeScript (strict mode) |
| ルーティング | Expo Router (file-based routing) |
| 国際化 | i18next / react-i18next / expo-localization |
| 状態管理 | React Context + AsyncStorage |
| テスト | Jest / @testing-library/react-native |
| パッケージ管理 | pnpm |
| 外部 API | [PokeAPI](https://pokeapi.co/)（REST + GraphQL） |
| CI/CD | GitHub Actions / Xcode Cloud |

---

## 📱 機能一覧

- **ポケモン一覧** — PokeAPI からポケモンリストを取得・表示（無限スクロール）
- **フローティング検索** — ポケモン名でリストを絞り込み
- **ポケモン詳細** — ステータス、特性、フレーバーテキストなどを表示
- **お気に入り** — AsyncStorage によるお気に入り管理
- **多言語対応** — 日本語 / 英語の切り替え（ポケモン名も多言語対応、GraphQL 使用）
- **アニメーションスプラッシュ** — フェードアウト付きスプラッシュ画面
- **設定画面** — 言語切り替え

---

## 🏗 アーキテクチャ

**モジュラーモノリス** 構成を採用し、機能単位でモジュールを分離しています。

```
app/                        # Expo Router（ルーティング定義のみ）
├── (tabs)/                 #   タブナビゲーション（一覧 / お気に入り / 設定）
└── detail/[id].tsx         #   ポケモン詳細（動的ルート）

src/
├── home/                   # ポケモン一覧・検索
├── detail/                 # ポケモン詳細表示
├── favorites/              # お気に入り一覧
├── settings/               # 設定（言語切り替え）
├── splash/                 # スプラッシュアニメーション
└── shared/                 # モジュール横断の共有コード
    ├── components/         #   PokemonCard, FavoriteButton
    ├── contexts/           #   FavoritesContext
    ├── domain/             #   型定義, タイプカラー
    ├── i18n/               #   国際化設定, 翻訳ファイル
    └── repository/         #   PokeAPI クライアント

__tests__/                  # テスト（src の構造をミラー）
```

各モジュールは `index.ts`（バレルファイル）で公開 API を定義し、モジュール内部への直接アクセスは ESLint で禁止しています。詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

---

## ⚡ Getting Started

```bash
# 依存パッケージのインストール
pnpm install

# 開発サーバーの起動
pnpm expo start
```

---

## 🧪 開発フロー

### TDD / BDD サイクル

1. **Red** — テストを先に書く
2. **Green** — テストが通る最小限の実装
3. **Refactor** — コードを整理

### コマンド

| コマンド | 用途 |
|---------|------|
| `pnpm test` | テスト実行 |
| `pnpm test:watch` | ウォッチモード |
| `pnpm test:coverage` | カバレッジ付きテスト（閾値 80%） |
| `pnpm lint` | ESLint チェック |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm validate` | lint + typecheck + test を一括実行 |

### コミット規約

[Conventional Commits](https://www.conventionalcommits.org/) 形式（`feat:`, `fix:`, `test:` 等）を採用しています。

---

## 🔄 CI/CD

- **テストカバレッジ** — PR ごとにカバレッジレポートを生成し、GitHub Pages にデプロイ
- **Xcode Cloud** — iOS ビルドの自動化

---

## 💡 AI-DLC とは

[AI-DLC（AI-Driven Development Lifecycle）](https://aws.amazon.com/jp/blogs/news/ai-driven-development-life-cycle/)は、AWS が提唱する AI 駆動開発ライフサイクルです。AI を単なる補助ツールではなく、要件定義から実装・テスト・デプロイまで全工程の主体的な実行者として位置づけ、人間は AI のアウトプットを判断・承認する監督者としての役割を担います。

本プロジェクトでは、Everything as Code の原則に基づき、仕様やドキュメントもコードとして管理しながら、AI との協働開発を実践しています。

> 参考: [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows)

---

## 📄 License

MIT
