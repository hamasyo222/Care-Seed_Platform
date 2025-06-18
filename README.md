# DX Seed モジュラー統合プラットフォーム

## 概要 (Overview)
DX Seedは、学習管理(LMS)、人材マッチング、案件受託、報酬管理、雇用管理、生活支援の各機能をモジュールとして統合した、包括的な人材育成・雇用管理プラットフォームです。

## アーキテクチャ (Architecture)
- **マイクロサービスアーキテクチャ**: 各機能は独立したサービスとして構築されています。
- **多様な技術スタック**: Node.js (NestJS/Express), Python (FastAPI), React (TypeScript)
- **データベース**: PostgreSQL, MongoDB

## 起動手順 (Getting Started)

### 1. 前提条件
- Docker & Docker Compose
- Node.js v18+
- Python 3.10+

### 2. 環境変数の設定
プロジェクトのルートに`.env`ファイルを作成し、以下の内容を記述します。

```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dx-seed-db

# JWT Secret (全てのサービスで共通の値を使用)
JWT_SECRET=this-is-a-very-secure-and-long-secret-key-for-jwt-tokens
ACCESS_TOKEN_SECRET=this-is-a-very-secure-and-long-secret-key-for-jwt-tokens

# 外部サービス (必要に応じて)
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
```

### 3. システム全体の起動
プロジェクトのルートディレクトリで以下のコマンドを実行します。
```bash
docker-compose up --build
```

### 4. データベースの初期化
システムを初めて起動した後、**新しいターミナルを開き**、以下のコマンドでデータベースのテーブルを作成します。
```bash
# いずれかのNode.jsサービスのコンテナ内でPrismaコマンドを実行
docker-compose exec lms-service npx prisma db push
```

### 5. サービスアクセス情報

| サービス名 (Service)       | ローカルURL (Local URL)       | 備考 (Notes) |
| -------------------------- | ------------------------------- | ------------------ |
| フロントエンド (Frontend)      | `http://localhost:5173`       | UIアクセスポイント |
| 認証サービス (Auth)        | `http://localhost:3001/health`  | Node.js/Express  |
| LMSサービス (LMS)          | `http://localhost:3003/health`  | Node.js/NestJS   |
| マッチングサービス (Matching)  | `http://localhost:3004/`        | Python/FastAPI   |
| 案件管理サービス (Project)   | `http://localhost:3005/health`  | Node.js/Express  |
| 報酬管理サービス (Payment)   | `http://localhost:3006/health`  | Node.js/Express  |
| 雇用管理サービス (Employment)  | `http://localhost:3007/health`  | Node.js/NestJS   |
| 生活支援サービス (Support)   | `http://localhost:3008/health`  | Python/FastAPI   |
| 分析サービス (Analytics)   | `http://localhost:3009/health`  | Python/FastAPI   |
| 翻訳サービス (Translation) | `http://localhost:3010/health`  | Node.js/Express  |