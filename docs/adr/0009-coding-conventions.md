# コーディング規約

- ステータス: Accepted
- 決定日: 2025-03-01
- 決定者: プロジェクトチーム

## コンテキスト

AIとの協働開発において、一貫したコード品質とコミット履歴を維持するための規約が必要だった。プロジェクトに参加する開発者（人間・AI問わず）が同じルールに従えるよう、明確な規約を定義する必要があった。

## 検討した選択肢

1. **Conventional Commits + ESLint** — コミットメッセージ規約とリンターの組み合わせ
2. **独自規約** — プロジェクト固有のルールを定義
3. **規約なし** — 各開発者の裁量に任せる

## 決定

**Conventional Commits + ESLint**ベースの規約を採用する。

### コミットメッセージ

Conventional Commits形式を使用:
- `feat:` — 新機能
- `fix:` — バグ修正
- `test:` — テスト追加・修正
- `refactor:` — リファクタリング
- `chore:` — ビルド・依存関係更新
- `docs:` — ドキュメント

### ブランチ命名規則

`<type>/<kebab-case-description>` 形式:
- 例: `feat/pokemon-list-screen`, `fix/type-badge-color`, `chore/update-dependencies`

### TypeScript

- strict mode必須（`tsconfig.json` で `"strict": true`）
- 型の省略禁止

### ESLint

- `eslint-config-expo` をベースに使用（FlatConfig形式）
- `no-restricted-imports` でモジュール境界を強制（ADR-0001参照）

### 検証コマンド

`pnpm validate` で lint + typecheck + test を一括実行:
```bash
pnpm validate  # = pnpm lint && pnpm typecheck && pnpm test
```

## 結果

### ポジティブな影響

- コミット履歴が構造化され、変更の種類が一目で分かる
- ブランチ名から作業内容を推測できる
- `pnpm validate` で全チェックを一括実行でき、PRの品質を保証できる
- AIとの協働でも同じ規約に従うことで一貫性が保たれる

### ネガティブな影響

- 規約を覚えるための初期学習コストがある
- コミットメッセージのprefixが制約となり、柔軟な記述がしにくい場合がある

## 参考

- [ADR-0001: モジュラーモノリスアーキテクチャの採用](0001-modular-monolith.md) — ESLintによるモジュール境界の強制
- `eslint.config.js` — ESLint設定
- `CLAUDE.md` — 開発ルールの詳細
