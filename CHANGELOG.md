# Changelog

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
