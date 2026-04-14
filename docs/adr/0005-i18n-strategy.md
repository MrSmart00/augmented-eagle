# 国際化（i18n）戦略

- ステータス: Accepted
- 決定日: 2026-04-15
- 決定者: プロジェクトチーム

## コンテキスト

ポケモン図鑑アプリとして、UIラベルとポケモン名の両方を日本語・英語で表示する必要があった。UIラベルの翻訳とAPIから取得するポケモン名の多言語対応を統一的に扱う仕組みが必要だった。

## 検討した選択肢

1. **i18next + react-i18next** — React向けの実績豊富な国際化ライブラリ
2. **expo-localization + 自前実装** — Expoの組み込み機能と自前のリソース管理
3. **react-intl** — FormatJS系の国際化ライブラリ

## 決定

**i18next + react-i18next**を採用する。

- 対応言語: `ja`（日本語）、`en`（英語）
- 翻訳リソース: `src/shared/i18n/locales/ja.json`, `en.json` に配置
- 言語設定の永続化: `@react-native-async-storage/async-storage` でデバイスに保存
- デフォルト言語: `ja`
- UIラベル翻訳: i18nextのリソースファイルで管理
- ポケモン名の多言語対応: GraphQL APIの `pokemon_v2_pokemonspeciesnames` で取得（ADR-0004参照）
- 言語切り替え: `useLanguage` カスタムフックで管理（i18n変更 + AsyncStorage保存を同時に行う）

## 結果

### ポジティブな影響

- i18nextの豊富なエコシステムと実績による安定性
- `useTranslation` フックによるReactコンポーネントとの自然な統合
- AsyncStorageによりアプリ再起動後も言語設定が保持される
- UIラベルとポケモン名の多言語対応が別々の仕組みで適切に分離されている

### ネガティブな影響

- i18next + react-i18nextの2パッケージが追加依存となる
- ポケモン名の翻訳がi18nextのリソースではなくAPIから取得されるため、2系統の翻訳管理が必要

## 参考

- [ADR-0004: REST + GraphQL API併用戦略](0004-rest-graphql-api.md) — GraphQLによるポケモン名の多言語取得
- `src/shared/i18n/` — i18n設定と翻訳リソース
