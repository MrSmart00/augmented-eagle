# REST + GraphQL API併用戦略

- ステータス: Accepted
- 決定日: 2025-03-01
- 決定者: プロジェクトチーム

## コンテキスト

PokeAPIはREST API（`pokeapi.co/api/v2/`）とGraphQL API（`beta.pokeapi.co/graphql/v1beta`）の両方を提供している。ポケモン名の多言語対応が必要な一覧画面と、詳細情報を取得する画面で、最適なAPIの選択が必要だった。

## 検討した選択肢

1. **REST APIのみ** — 全てのデータ取得をREST APIで行う
2. **GraphQL APIのみ** — 全てのデータ取得をGraphQL APIで行う
3. **REST + GraphQL併用** — 用途に応じて使い分ける

## 決定

**REST + GraphQL併用**を採用する。

- **GraphQL**: `home` モジュールのポケモン一覧取得に使用。1回のクエリで多言語名（`pokemon_v2_pokemonspeciesnames`）を含む一覧データを取得できる
- **REST**: `detail`, `shared` モジュールの単体ポケモン詳細取得に使用。シンプルなエンドポイントで十分な場面ではRESTを選択
- **GraphQLクライアントライブラリは不使用**: 素の `fetch` でPOSTリクエストを送信（Apollo等の依存を回避）
- **Repositoryパターン**: 各APIアクセスをrepositoryとしてカプセル化し、ドメイン層から直接APIを呼ばない

GraphQLの使用は `home` モジュールに限定し、他モジュールではREST APIを使用する。

## 結果

### ポジティブな影響

- 多言語対応の一覧取得がGraphQLの1クエリで完結する（REST APIだとN+1問題が発生する）
- シンプルな詳細取得ではREST APIの手軽さを活かせる
- GraphQLクライアントライブラリ不使用により依存が最小限
- Repositoryパターンにより、API実装の詳細がドメイン層から隠蔽される

### ネガティブな影響

- 2種類のAPIアクセスパターンが混在するため、コードの一貫性がやや低下する
- GraphQL APIはbeta版であり、安定性のリスクがある
- GraphQLクライアントライブラリ不使用のため、キャッシュ管理は自前で行う必要がある

## 参考

- [ADR-0005: 国際化（i18n）戦略](0005-i18n-strategy.md) — GraphQLによる多言語データ取得との連携
- `src/home/repository/pokemonGraphqlApi.ts` — GraphQL実装
- `src/shared/repository/pokemonApi.ts` — REST API実装
