# Augmented Eagle (A.E.) — AI-DLC Project

## プロジェクト概要

ポケモン図鑑アプリを段階的に構築しながらReact Nativeを学習するAI-DLCプロジェクト。
GitHub Issues #1〜#5に各Stepの仕様が定義されている。

### 技術スタック

- Expo 54 + React Native 0.81 + React 19
- TypeScript (strict mode)
- Expo Router (file-based routing)
- pnpm

## 開発フロー（TDD/BDD）

機能実装は必ず以下のサイクルで行う:

1. **Red** — テストを先に書く（期待する振る舞いを定義）
2. **Green** — テストが通る最小限の実装を書く
3. **Refactor** — コードを整理する（テストが通ることを確認しながら）

### テストの書き方（BDDスタイル）

- `describe` で機能・コンポーネント名を記述
- `it` で振る舞いを日本語で記述
- テストは `__tests__/` ディレクトリに配置
- **`app/` ディレクトリにテストを置かないこと**（Expo Routerがルートとして認識するため）

```typescript
describe('PokemonCard', () => {
  it('ポケモンの名前が表示される', () => { ... });
  it('タイプバッジが色分けされて表示される', () => { ... });
});
```

## ディレクトリ構成

```
app/              # Expo Router（ルーティング・画面定義のみ）
src/
  components/     # UIコンポーネント（テスト対象）
__tests__/
  components/     # コンポーネントテスト
```

- コンポーネントは `src/components/` に作成し、`app/` からimportする
- ルーティングロジックは `app/` に、UIロジックは `src/` に分離

### カバレッジ

- カバレッジ閾値: branches / functions / lines / statements 全て **80%以上**
- 計測対象: `src/**/*.{ts,tsx}`
- `pnpm test:coverage` でレポート生成（`coverage/` ディレクトリに出力）
- 新規コンポーネント追加時は、閾値を下回らないようテストを書くこと

## コーディング規約

- TypeScript strict mode（型の省略禁止）
- Conventional Commits形式（`feat:`, `fix:`, `test:` 等）
- 作業は必ずブランチを切ってから行う
- ブランチ命名規則: `<type>/<kebab-case-description>`
  - type: Conventional Commitsと同じ（feat, fix, chore, refactor, test, docs 等）
  - 例: `feat/pokemon-list-screen`, `fix/type-badge-color`, `chore/update-dependencies`

## コマンド

| コマンド | 用途 |
|---------|------|
| `pnpm test` | テスト実行 |
| `pnpm test:watch` | テストのウォッチモード |
| `pnpm test:coverage` | カバレッジ付きテスト |
| `pnpm lint` | ESLintチェック |
| `pnpm typecheck` | TypeScript型チェック |
| `pnpm validate` | lint + typecheck + test を一括実行 |
| `pnpm expo start` | 開発サーバー起動 |
