# Changelog

## [0.3.0] - 2026-02-21

### Added

- 資産ポートフォリオ画面（`/portfolio`）の追加
- 年ナビゲーション（← / →ボタンで前後年へ移動、端年では非活性）
- Recharts の `PieChart` を使った年別資産構成の円グラフ（`src/app/components/PortfolioChart.tsx`）
- 資産割合一覧表（ジャンル・金額・割合%を表示、`src/app/components/PortfolioTable.tsx`）
- `src/app/constants/genres.ts`：資産ジャンルの共通定数（`GenreKey`型・色・名称）
- `__tests__/src/app/components/PortfolioTable.test.tsx`：PortfolioTable のユニットテスト
- `__tests__/src/app/components/PortfolioChart.test.tsx`：PortfolioChart のユニットテスト

### Removed

- `docs/asset-portfolio-screen-spec.md`（実装完了のため削除）

### Changed

- `src/app/components/Header.tsx`：資産推移画面と資産ポートフォリオ画面へのナビゲーションリンクを追加
- `src/app/components/AssetChart.tsx`：ジャンル定義を共通定数（`src/app/constants/genres.ts`）にリファクタリング

## [0.2.0] - 2026-02-20

### Added

- CSVファイル（`data/assets.csv`）から年次資産データを読み込む機能
- ジャンル（株式・現預金・暗号資産）ごとに色分けした積み上げ棒グラフ（Recharts使用）
- 資産推移の一覧表（年・株式・現預金・暗号資産・合計）
- `lib/parseAssets.ts`：サーバーサイドCSVパース処理
- `src/app/components/AssetChart.tsx`：棒グラフコンポーネント
- `src/app/components/AssetTable.tsx`：一覧表コンポーネント
- `data/assets.csv`：サンプル資産データ
- `__tests__/lib/parseAssets.test.ts`：parseAssets のユニットテスト

### Removed

- SQLiteデータベース機能（`lib/database.ts`、`src/app/api/message/`）
- データベース関連の依存パッケージ（`better-sqlite3`、`@types/better-sqlite3`）
- `docs/asset-visualization-spec.md`（実装完了のため削除）

### Changed

- メインページをSQLiteメッセージ表示から資産可視化表示に変更
- レイアウトのタイトル・説明を資産可視化アプリ向けに更新
- `README.md` を資産可視化アプリの内容に更新

## [0.1.0] - 初期リリース

- SQLiteデータベースからメッセージを取得して表示するシンプルなNext.jsアプリ
