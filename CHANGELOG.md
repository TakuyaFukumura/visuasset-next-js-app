# Changelog

## [0.7.0] - 2026-02-26

### Added

- 生活費換算シミュレーション画面（`/living-expense`）を新規追加
- `src/app/components/LivingExpenseSettings.tsx`：設定エリア（生活費・実利回り入力）と状態管理を担うクライアントコンポーネント。`calcLivingExpenseSimulation` 関数をエクスポート
- `src/app/components/LivingExpenseChart.tsx`：Recharts `LineChart` を用いた資産推移折れ線グラフコンポーネント
- `src/app/components/LivingExpenseTable.tsx`：年次残高（経過年数・西暦・資産残高・生活費換算）を表示するテーブルコンポーネント
- `__tests__/src/app/components/LivingExpenseSettings.test.tsx`：LivingExpenseSettings および calcLivingExpenseSimulation のユニットテスト

### Changed

- `src/app/components/Header.tsx`：「生活費換算」へのナビゲーションリンクをデスクトップ・モバイルメニュー両方に追加

### Removed

- `docs/living-expense-conversion.md`（実装完了のため削除）

## [0.6.0] - 2026-02-25

### Added

- スマートフォン対応：モバイル（640px 未満）でハンバーガーメニューを導入（左上に☰/✕トグルボタンを表示）
- タップでナビゲーションリンクのドロップダウンを開閉、リンクをクリックすると自動で閉じる
- `aria-label` / `aria-expanded` によるアクセシビリティ対応

### Changed

- `src/app/components/Header.tsx`：ハンバーガーボタンをヘッダー左上に配置、デスクトップではナビを横並びで表示
- `src/app/page.tsx` / `src/app/portfolio/page.tsx` / `src/app/simulation/page.tsx`：ページのパディングを `p-6` から
  `p-2 sm:p-6` に変更し、モバイルでのグラフ描画エリアを拡大

### Removed

- `docs/smartphone-support.md`（実装完了のため削除）

## [0.5.0] - 2026-02-22

### Added

- 資産推移シミュレーション画面の設定パネルに開始年齢（歳）入力欄を追加（デフォルト28歳、画面上で変更可能）
- `SimulationDataPoint` に `age` フィールドを追加し、各シミュレーション年の年齢を計算して保持
- `SimulationTable.tsx`：年（西暦）列の横に年齢列を追加
- `__tests__/src/app/components/SimulationChart.test.tsx`：開始年齢の表示・デフォルト値・変更・バリデーション・年齢インクリメントのテストを追加
- `__tests__/src/app/components/SimulationTable.test.tsx`：年齢列のヘッダー・データ表示のテストを追加

## [0.4.0] - 2026-02-22

### Added

- 資産推移シミュレーション画面（`/simulation`）にグラフ下部の一覧表を追加
- `src/app/components/SimulationTable.tsx`：シミュレーション結果（年・名目資産額・実質価値）を表示するテーブルコンポーネント
- `__tests__/src/app/components/SimulationTable.test.tsx`：SimulationTable のユニットテスト

### Changed

- `src/app/components/SimulationChart.tsx`：`SimulationTable` コンポーネントをインポートし、グラフの下部に表を追加

## [0.3.1] - 2026-02-21

### Changed

- `src/app/components/PortfolioChart.tsx`：recharts の非推奨コンポーネント `Cell` を削除し、データの `fill` プロパティを
  `Pie` が直接読み込む方式に変更（`TS6385: 'Cell' is deprecated.` 警告の対応）

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
