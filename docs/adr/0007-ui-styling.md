# UIスタイリング方針

- ステータス: Accepted
- 決定日: 2026-04-15
- 決定者: プロジェクトチーム

## コンテキスト

React Nativeアプリのスタイリング手法を選定する必要があった。学習プロジェクトとしてReact Nativeの基本を理解しつつ、パフォーマンスとアニメーション表現力を確保したい。

## 検討した選択肢

1. **React Native StyleSheet** — React Native標準の `StyleSheet.create` を使用
2. **styled-components / Emotion** — CSS-in-JSライブラリ
3. **NativeWind (Tailwind CSS)** — Tailwind CSSをReact Nativeで使用

## 決定

**React Native標準の `StyleSheet.create` のみ**を使用する。

- CSS-in-JSライブラリやTailwind CSS系ライブラリは使用しない
- アニメーション: `lottie-react-native` でリッチなアニメーション（お気に入りボタン等）、`react-native-reanimated` でネイティブ駆動のアニメーション
- ジェスチャー: `react-native-gesture-handler` でタッチ操作を管理
- ポケモンタイプ別の色定義は `src/shared/domain/typeColors.ts` にドメイン知識として管理

## 結果

### ポジティブな影響

- 外部依存なしでReact Nativeの標準スタイリングを学習できる
- ビルド時に最適化されるためパフォーマンスが良好
- Lottie + Reanimatedによりリッチなアニメーション表現が可能

### ネガティブな影響

- StyleSheetは冗長になりやすく、コンポーネント間でのスタイル共有が手間
- テーマ管理（ダークモード等）の仕組みを自前で構築する必要がある

## 参考

- `src/shared/domain/typeColors.ts` — ポケモンタイプ色定義
- `src/shared/components/` — 共有UIコンポーネント実装例
