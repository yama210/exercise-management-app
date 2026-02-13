# Exercise Management App

毎日の運動記録を、入力しやすく・振り返りやすくするための健康管理アプリです。  
日付ごとに運動内容と時間を登録すると、種目ごとの係数を使って消費カロリーを自動計算します。  
1日の記録だけでなく、週単位のグラフで変化を確認できるため、継続状況を把握しやすい設計です。  
運動習慣を可視化したい個人ユーザーを主な対象としています。

## How to Use

1. 「追加」画面で日付と運動（種目・分数）を入力して保存する
2. ホーム画面で週次グラフと週内一覧を確認する
3. 必要に応じて記録を編集・削除して調整する

## Screenshots


![Home Screen](docs/home.png)
![Record Form](docs/form.png)


## Main Features

- 記録のCRUD
  - 日次記録の追加・編集・削除
- 複数運動の同日登録
  - 1日に複数の運動種目を入力可能
- カロリー自動計算
  - 種目ごとの係数と運動時間から、種目別/日別合計を算出
- 週次可視化
  - 週単位でカロリー推移を棒グラフ表示
  - 週ナビゲーションで前週/今週を比較
- 一覧表示
  - 週内の記録を日付順で確認

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- PostgreSQL
- Zod
- Tailwind CSS
- Recharts
- Next.js Server Actions
- Docker / Docker Compose

## Architecture Highlights

- DB設計は `records`（親）と `exercises`（子）の 1対多構成
- 外部キー + `ON DELETE CASCADE` で親削除時の子データ整合性を担保
- UIは「週単位で可視化」することで、運動継続の変化を短時間で把握しやすく設計
- 親子テーブル更新の不整合を避けるため、更新処理はトランザクションで整合性を担保
- 週次グラフは欠損日を0補完し、常に7日分が安定表示されるように設計

## Data Policy

- `records` は1日単位の記録を表し、`exercises` に運動明細を紐づける構造です。
- カロリーはサーバー側で種目係数から算出し、保存時に確定させます。
- 週表示は月曜始まりを基準にして、週次の比較がしやすいUIにしています。

### ER Diagram (Simplified)

```mermaid
erDiagram
  RECORDS ||--o{ EXERCISES : has
  RECORDS {
    int id PK
    date date
    int total_calories
  }
  EXERCISES {
    int id PK
    int record_id FK
    string type
    int minutes
    int calories
  }
```

## Setup

### 1. Docker（推奨）

前提:
- Docker Desktop が起動していること

起動:

```bash
docker compose up --build
```

アクセス:

```text
http://localhost:3000
```

補足:
- `db` コンテナ起動時に `init.sql` が自動適用されます（初回ボリューム作成時）。

### 2. Dockerなし（手動）

前提:
- Node.js / npm がインストール済み
- PostgreSQL がローカルで起動済み

#### 2-1. 依存関係をインストール

```bash
npm install
```

#### 2-2. 環境変数を設定

`.env.example` をコピーして `.env.local` を作成:

```bash
cp .env.example .env.local
```

Windows PowerShell の場合:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` 例:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthdb
```

#### 2-3. DBを作成して初期化SQLを適用

DB作成例:

```bash
createdb -U postgres healthdb
```

`init.sql` を適用:

```bash
psql -U postgres -d healthdb -f init.sql
```

※環境によりユーザー名・ホスト指定は調整してください（例: `-h localhost -p 5432`）。

#### 2-4. 開発サーバー起動

```bash
npm run dev
```

アクセス:

```text
http://localhost:3000
```

## Troubleshooting

### 1) `DATABASE_URL` 未設定で起動エラーになる

- `.env.local` に `DATABASE_URL` があるか確認
- 形式例: `postgresql://postgres:postgres@localhost:5432/healthdb`

### 2) Dockerで `init.sql` が反映されない

`init.sql` は初回ボリューム作成時のみ適用されることがあります。  
反映し直す場合:

```bash
docker compose down -v
docker compose up --build
```

### 3) PostgreSQL に接続できない

- PostgreSQL が起動しているか確認
- `5432` ポート競合がないか確認
- Docker利用時は `docker compose ps` で `db` が healthy か確認

### 4) 画面にデータが表示されない

- 初期データが未投入の場合は、まず「追加」画面から1件登録してください
- 表示は週単位なので、記録日が対象週に入っているかも確認してください

## Known Issues / Improvements

- 自動テスト（unit / e2e）が未整備
- 認証未実装のため、ユーザーごとのデータ分離が未対応
- 検索・フィルタ機能はMVPスコープ外

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Repository Structure (Excerpt)

```text
app/                  Next.js App Router pages and API routes
components/           UI components (form, chart, list, weekly nav)
lib/                  DB access, actions, shared types
init.sql              PostgreSQL schema initialization
docker-compose.yml    app + db development environment
Dockerfile.dev        app container definition
```
