# DX Seed モジュラー統合プラットフォーム

## 概要 (Overview)
DX Seedは、学習管理(LMS)、人材マッチング、案件受託などを統合した、包括的な人材育成・雇用管理プラットフォームです。

## 起動手順 (Getting Started)

### 1. 前提条件
- Docker & Docker Compose
- Node.js v18+ & npm
- Python 3.10+ & pip

### 2. 環境変数の設定
プロジェクトのルートに`.env`ファイルを作成し、`docker-compose.yml`で参照される変数を設定します。
```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dx-seed-db

# JWT Secret (全てのサービスで共通の値を使用)
JWT_SECRET=this-is-a-very-secure-and-long-secret-key-for-jwt-tokens
ACCESS_TOKEN_SECRET=this-is-a-very-secure-and-long-secret-key-for-jwt-tokens
```

### 3. システム全体の起動
プロジェクトのルートディレクトリで以下のコマンドを実行します。
```bash
docker-compose up --build
```

### 4. データベースの初期化
システムを初めて起動した後、**新しいターミナルを開き**、以下のコマンドでデータベースのテーブルを作成します。
```bash
docker-compose exec lms-service npx prisma db push
```

### 5. サービスアクセス情報

| サービス名 (Service)       | ローカルURL (Local URL)       |
| -------------------------- | ------------------------------- |
| フロントエンド (Frontend)      | `http://localhost:5173`         |
| 認証サービス (Auth)        | `http://localhost:3001/health`  |
| LMSサービス (LMS)          | `http://localhost:3003/health`  |
| マッチングサービス (Matching)  | `http://localhost:3004/`        |
| ... その他サービス ...      | ...                           |