# visuasset-next-js-app

CSVファイルから資産推移データを読み込み、棒グラフと表で可視化するNext.jsアプリケーションです。

## 技術スタック

- **Next.js 16.1.6** - React フレームワーク（App Routerを使用）
- **React 19.2.4** - ユーザーインターフェース構築
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **Recharts** - グラフ描画
- **ESLint** - コード品質管理

## 機能

- `data/assets.csv` から年次資産データを読み込み
- ジャンル（株式・現預金・暗号資産）ごとに色分けした積み上げ棒グラフを表示
- 資産推移の一覧表を表示
- レスポンシブデザイン対応
- ダークモード対応（手動切替機能付き）
  - ライトモードとダークモードの2つのモードを手動で切り替え可能
  - ユーザーの選択はローカルストレージに保存され、ページ再読み込み時も維持されます
- TypeScriptによる型安全性

## データ形式

`data/assets.csv` に以下のフォーマットでCSVファイルを配置してください。

```csv
year,stocks,cash,crypto
2020,100,200,50
2021,150,220,80
2022,180,210,60
2023,200,250,90
2024,220,260,100
```

| カラム名 | 説明             | 単位 |
|---------|-----------------|------|
| year    | 年              | 年（例：2020） |
| stocks  | 株式の資産額     | 万円 |
| cash    | 現預金の資産額   | 万円 |
| crypto  | 暗号資産の資産額 | 万円 |

## 始め方

### 前提条件

- Node.js 20.x以上
- npm、yarn、またはpnpm

### インストール

1. リポジトリをクローン：
    ```bash
    git clone https://github.com/TakuyaFukumura/visuasset-next-js-app.git
    ```
    ```bash
    cd visuasset-next-js-app
    ```

2. 依存関係をインストール：
    ```bash
    npm install
    ```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

### ビルドと本番デプロイ

```bash
npm run build
npm start
```

## プロジェクト構造

```
├── lib/
│   └── parseAssets.ts       # CSVパース処理
├── data/
│   └── assets.csv           # 資産データCSV
├── src/
│   └── app/
│       ├── components/      # Reactコンポーネント
│       │   ├── AssetChart.tsx        # 積み上げ棒グラフ
│       │   ├── AssetTable.tsx        # 資産一覧表
│       │   ├── DarkModeProvider.tsx  # ダークモードProvider
│       │   └── Header.tsx            # ヘッダーコンポーネント
│       ├── globals.css      # グローバルスタイル
│       ├── layout.tsx       # アプリケーションレイアウト
│       └── page.tsx         # メインページコンポーネント
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 開発

### テスト

```bash
npm test
```

### リンティング

```bash
npm run lint
```

## CI/CD

このプロジェクトはGitHub Actionsを使用した継続的インテグレーション（CI）を設定しています。

### 自動テスト

以下の条件でCIが実行されます：
- `main`ブランチへのプッシュ時
- プルリクエストの作成・更新時

CIでは以下のチェックが行われます：
- ESLintによる静的解析
- TypeScriptの型チェック
- Jestを使用したユニットテスト
- アプリケーションのビルド検証
- Node.js 20.x での動作確認

## 自動依存関係更新（Dependabot）

このプロジェクトでは、依存関係の安全性と最新化のために[Dependabot](https://docs.github.com/ja/code-security/dependabot)を利用しています。

- GitHub Actionsおよびnpmパッケージの依存関係は**月次（月曜日 09:00 JST）**で自動チェック・更新されます。
- 更新内容は自動でプルリクエストとして作成されます。
- 詳細な設定は `.github/dependabot.yml` を参照してください。

