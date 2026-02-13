# Exercise Management App

運動内容と消費カロリーを記録し、週単位で可視化できる健康管理アプリです。  
記録の追加・編集・削除（CRUD）と、週次グラフ表示を実装しています。

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- PostgreSQL
- Tailwind CSS
- Recharts
- Docker / Docker Compose

## Run with Docker (Recommended)

1. Docker Desktop を起動
2. プロジェクトルートで実行

```bash
docker compose up --build
```

3. ブラウザで確認

```text
http://localhost:3000
```

## Run without Docker

1. 依存関係をインストール

```bash
npm install
```

2. 環境変数を設定（`.env.local`）

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/healthdb
```

3. 開発サーバー起動

```bash
npm run dev
```

4. ブラウザで確認

```text
http://localhost:3000
```

## Main Features

- 日付ごとの運動記録
- 複数運動の同日登録
- 消費カロリーの自動計算
- 週ごとのグラフ表示
- 記録の編集・削除

## Notes

- DB初期化SQLは `init.sql` を使用します。
- Docker起動時は `docker-compose.yml` の設定で app と db が同時に立ち上がります。
