---
name: split-pr
description: 変更行数が多いブランチを分析し、複数のPRに分割する
disable-model-invocation: true
allowed-tools: Bash(git *) Bash(gh *)
argument-hint: [ベースブランチ（省略時はmain）]
---

# ✂️ PR分割スキル

現在のブランチのコミットを分析し、各PRが500行以下になるよう複数ブランチに分割してPRを作成する。

## 🔄 手順

### Step 1: 📋 現在の状態を確認

以下のコマンドを並列で実行して、ブランチの状態を把握する:

- `git status` で未コミットの変更がないか確認
- `git log --oneline main..HEAD` でPRに含まれる全コミットを確認
- `git diff main...HEAD --stat -- . ':!pnpm-lock.yaml' ':!*.lock' ':!*.snap' ':!coverage/' ':!.expo/'` で自動生成ファイルを除いた変更概要を確認
- `git branch --show-current` で現在のブランチ名を取得

### Step 2: ⚠️ 事前チェック

以下を確認し、問題があればユーザーに報告して中断する:

- 現在のブランチがmain/masterでないこと
- 未コミットの変更がないこと（あればコミットを促す）

### Step 3: 📊 コミットの分析と分割案の作成

1. 各コミットの変更行数を確認する:
   ```bash
   git log --oneline main..HEAD --format="%h %s"
   ```
   各コミットについて:
   ```bash
   git diff <commit>^..<commit> --stat -- . ':!pnpm-lock.yaml' ':!*.lock' ':!*.snap' ':!coverage/' ':!.expo/'
   ```

2. コミットを論理的なまとまりでグループ化し、各グループが500行以下になるよう分割案を作成する。グループ化の基準:
   - 機能単位（同じ機能に関連するコミットをまとめる）
   - テストとその実装はセットにする
   - 依存関係の順序を保つ（先にマージすべきものを前のグループにする）

3. 分割案をユーザーに提示し、承認を得る。以下の情報を含める:
   - 各PRに含まれるコミット一覧
   - 各PRの推定変更行数
   - PRの作成順序（依存関係を考慮したマージ順）

### Step 4: 🌿 ブランチの作成

ユーザーの承認後、分割案に従ってブランチを作成する。

元のブランチ名をプレフィックスにし、各グループの変更内容を表すサフィックスを付ける。

例: 元が `feature/pokemon-list` の場合
- `feature/pokemon-list-api-client` （API通信部分）
- `feature/pokemon-list-ui-components` （UI部分）
- `feature/pokemon-list-tests` （テスト部分）

各分割ブランチについて:
```bash
git branch <split-branch-name> <last-commit-hash-in-group>
```

**注意**: 2番目以降のPRは、前のブランチをベースにする（チェーンPR）。

### Step 5: 🎫 PRの連続作成

各分割ブランチについて、順番にPRを作成する:

1. ブランチをチェックアウトしてpushする:
   ```bash
   git checkout <split-branch-name>
   git push -u origin <split-branch-name>
   ```

2. PRを作成する。ベースブランチは以下のルール:
   - 1番目のPR: `$ARGUMENTS`（省略時は `main`）をベースにする
   - 2番目以降のPR: 前の分割ブランチをベースにする

   ```bash
   gh pr create --title "<title>" --base <base-branch> --body "$(cat <<'EOF'
   ## Summary
   - 変更内容を箇条書きで記述（日本語）

   ## Changes
   - 変更したファイルと内容の概要（日本語）

   ## Test plan
   - [ ] テストの実行方法や確認事項をチェックリストで記述（日本語）

   ## Related Issues
   - 関連するIssueがあれば `closes #N` や `refs #N` で記述

   ## Split PRs
   - このPRは分割PRの N/M です
   - 前のPR: #xxx（2番目以降の場合）
   - 次のPR: #xxx（最後以外の場合）
   EOF
   )"
   ```

3. PR作成後、PRのURLとPR番号を記録しておく（次のPRの本文で参照するため）

### Step 6: 🔙 元のブランチに戻る

全てのPR作成後、元のブランチに戻る:
```bash
git checkout <original-branch>
```

### Step 7: ✅ 結果の報告

作成された全PRのURL一覧をユーザーに報告する。マージ順序も合わせて提示する。
