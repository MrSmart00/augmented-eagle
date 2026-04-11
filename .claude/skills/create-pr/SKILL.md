---
name: create-pr
description: 現在のブランチの変更を分析してPull Requestを作成する
disable-model-invocation: true
allowed-tools: Bash(git *) Bash(gh *)
argument-hint: [ベースブランチ（省略時はmain）]
---

# 🎯 Pull Request 作成スキル

現在のブランチの全コミットを分析し、GitHub Pull Requestを作成する。

## 🔄 手順

### Step 1: 📋 現在の状態を確認

以下のコマンドを並列で実行して、ブランチの状態を把握する:

- `git status` で未コミットの変更がないか確認
- `git log --oneline main..HEAD` でPRに含まれる全コミットを確認
- `git diff main...HEAD --stat` で変更ファイルの概要を確認
- `git branch --show-current` で現在のブランチ名を取得
- `git remote -v` でリモートの設定を確認

### Step 2: ⚠️ 事前チェック

以下を確認し、問題があればユーザーに報告して中断する:

- 現在のブランチがmain/masterでないこと
- 未コミットの変更がないこと（あればコミットを促す）
- リモートにブランチがpush済みか確認する
- **変更行数が500行を超えていないこと**（以下の手順で確認）:
  1. 自動生成ファイルを除外した差分のサマリーを取得する:
     ```bash
     git diff main...HEAD --stat -- . ':!pnpm-lock.yaml' ':!*.lock' ':!*.snap' ':!coverage/' ':!.expo/'
     ```
  2. 末尾サマリー行の insertions + deletions の合計が **500行を超える場合**、変更の概要を表示して**中断する**
  3. `/split-pr` スキルの利用を案内する

### Step 3: 🚀 リモートへのプッシュ

リモートに未プッシュの場合:

```bash
git push -u origin <current-branch>
```

### Step 4: 📝 PRの内容を作成

`git log main..HEAD` と `git diff main...HEAD` の内容を分析し、以下を生成する:

#### タイトル

- Conventional Commits形式のプレフィックスを使う（`feat:`, `fix:`, `chore:` 等）
- 英語で、70文字以内に収める
- 変更の要約を簡潔に記述する

#### 本文

以下のテンプレートに従う:

```markdown
## Summary
- 変更内容を箇条書きで記述（日本語）

## Changes
- 変更したファイルと内容の概要（日本語）

## Test plan
- [ ] テストの実行方法や確認事項をチェックリストで記述（日本語）

## Related Issues
- 関連するIssueがあれば `closes #N` や `refs #N` で記述
```

### Step 5: 🎫 PRの作成

`gh pr create` コマンドでPRを作成する。必ずHEREDOCを使ってbodyを渡すこと:

```bash
gh pr create --title "<title>" --base <base-branch> --body "$(cat <<'EOF'
## Summary
...

## Changes
...

## Test plan
...

## Related Issues
...
EOF
)"
```

- `$ARGUMENTS` が指定されている場合: そのブランチをベースにする
- `$ARGUMENTS` が空の場合: `main` をベースにする

### Step 6: ✅ 結果の確認

作成されたPRのURLをユーザーに報告する。
