# 状態管理戦略

- ステータス: Accepted
- 決定日: 2025-03-01
- 決定者: プロジェクトチーム

## コンテキスト

お気に入り機能など、複数画面で共有する状態の管理方法を決める必要があった。ポケモンの手持ちを模した「最大6件」という制約付きのお気に入りリストを、一覧画面・詳細画面・お気に入り画面の3画面で同期する必要がある。

当初はReact Context APIで実装していたが、Provider不要化とボイラープレート削減のためzustandへ移行した。

## 検討した選択肢

1. **React Context API** — React組み込みのContext + Providerパターン
2. **zustand** — 軽量なグローバル状態管理ライブラリ
3. **Redux Toolkit** — Flux系の状態管理ライブラリ

## 決定

**zustand**を採用する。

- `useFavoritesStore`（`create()` で生成）でお気に入り状態をグローバル管理
- お気に入り上限: 6件（`MAX_FAVORITES = 6`、ポケモンの手持ち数に由来）
- `useFavorites` カスタムフックで `isFavorite` / `isFull` の派生状態を提供
- Providerが不要なため、`app/_layout.tsx` のネストが削減された
- 現在の実装ではメモリ内のみ（AsyncStorageによる永続化は未実装）

## 結果

### ポジティブな影響

- Providerが不要でコンポーネントツリーがシンプル
- zustandのセレクタにより、必要な状態のみを購読し再レンダリングを最小化できる
- ボイラープレートが少なく、`create()` 1つでストアを定義できる
- `useFavorites` フックにより消費側のAPIがシンプル

### ネガティブな影響

- zustandへの外部依存が追加される
- 現在はメモリ内のみのため、アプリ再起動でお気に入りが消失する

## 参考

- `src/shared/stores/useFavoritesStore.ts` — zustandによる状態管理実装
