---
name: commit
description: 変更差分を分析してConventional Commits形式のコミットメッセージを生成し、コミットする
disable-model-invocation: true
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git log *) Bash(git add *) Bash(git commit *)
argument-hint: [対象ファイル（省略時は全変更）]
---

# 🎯 Git Commit スキル

変更差分を分析し、Conventional Commits形式のコミットメッセージを自動生成してコミットする。

## 🔄 手順

### Step 1: 📋 現在の状態を確認

以下のコマンドを並列で実行して、変更内容を把握する:

- `git status` で変更ファイルの一覧を取得
- `git diff` でステージされていない差分を取得
- `git diff --staged` でステージ済みの差分を取得
- `git log --oneline -5` で直近のコミットメッセージスタイルを確認

### Step 2: 📂 ファイルのステージング

- `$ARGUMENTS` が指定されている場合: 指定されたファイルのみを `git add` する
- `$ARGUMENTS` が空の場合: 変更された全ファイルをファイル名を指定して `git add` する
  - ⚠️ `git add .` や `git add -A` は使わないこと。機密ファイル（.env, credentials等）の混入を防ぐため、必ずファイル名を明示する

### Step 3: 🤖 コミットメッセージの生成

差分の内容を分析し、以下のConventional Commits形式でメッセージを生成する:

| プレフィックス | 用途 |
|---|---|
| `feat:` ✨ | 新機能の追加 |
| `fix:` 🐛 | バグ修正 |
| `chore:` 🔧 | 雑務・メンテナンス |
| `refactor:` ♻️ | リファクタリング |
| `docs:` 📚 | ドキュメントの変更 |
| `test:` 🧪 | テストの追加・修正 |
| `style:` 💄 | コードスタイルの変更 |
| `ci:` 👷 | CI/CD関連の変更 |
| `build:` 📦 | ビルドシステムの変更 |
| `perf:` ⚡ | パフォーマンス改善 |

### メッセージのルール

- 件名は英語で、動詞の原形で始める（例: `feat: add user authentication`）
- 件名は70文字以内に収める
- 必要に応じて本文（body）に日本語で詳細を記載する
- 複数の変更種別にまたがる場合は、最も主要な変更のプレフィックスを使う

### Step 4: ✍️ コミットの実行

以下の形式でコミットする。必ずHEREDOCを使ってメッセージを渡すこと:

```bash
git commit -m "$(cat <<'EOF'
<type>: <subject>

<optional body>

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Step 5: ✅ 結果の確認

`git log -1` でコミット結果を表示し、ユーザーに報告する。
