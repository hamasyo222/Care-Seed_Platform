# DX Seed モジュラー統合プラットフォーム

## 概要 (Overview)

DX Seedは、学習管理(LMS)、人材マッチング、案件受託、報酬管理、雇用管理、生活支援、分析の各機能をモジュールとして統合した、包括的な人材育成・雇用管理プラットフォームです。

このリポジトリは、プラットフォームを構成するマイクロサービス群とフロントエンドアプリケーションのソースコードを含みます。

## アーキテクチャ (Architecture)

- **マイクロサービスアーキテクチャ**: 各機能は独立したサービスとして構築されています。
- **多様な技術スタック**:
  - **Node.js (NestJS, Express, Fastify)**: 汎用的なAPIサービス
  - **Python (FastAPI)**: AI連携やデータ分析を担うサービス
  - **React (TypeScript)**: フロントエンドアプリケーション
- **データベース**:
  - **PostgreSQL**: 主要なトランザクションデータ
  - **MongoDB**: ログ、分析データ
  - **Elasticsearch**: 高度な検索機能

## 前提条件 (Prerequisites)

- Docker & Docker Compose
- Node.js v18+
- Python 3.10+

## 起動手順 (Getting Started)

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd dx-seed-platform
```

### 2. 環境変数の設定
`docker-compose.yml`で使われる環境変数を定義するため、プロジェクトのルートに`.env`ファイルを作成します。

**`.env`**
```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dx-seed-db

# JWT Secret (全てのサービスで共通の値を使用)
JWT_SECRET=this-is-a-very-secure-and-long-secret-key-for-jwt-tokens
ACCESS_TOKEN_SECRET=this-is-a-very-secure-and-long-secret-key-for-jwt-tokens

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# OpenAI
OPENAI_API_KEY=sk-...
```

### 3. システム全体の起動
プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
docker-compose up --build
```
これにより、`docker-compose.yml` に定義された全てのサービスがビルドされ、起動します。

### 4. データベースの初期化
システムを初めて起動した後、新しいターミナルを開き、以下のコマンドでデータベースのテーブルを作成します。

```bash
# lms-serviceのコンテナ内でPrismaコマンドを実行し、スキーマをDBに反映
docker-compose exec lms-service npx prisma db push
```

### 5. 動作確認

| サービス名 (Service Name) | ローカルURL (Local URL) |
| ------------------- | --------------------------- |
| フロントエンド (Frontend) | `http://localhost:5173` |
| 認証サービス (Auth) | `http://localhost:3001/health` |
| LMSサービス (LMS) | `http://localhost:3003/health` |
| マッチングサービス (Matching) | `http://localhost:3004/` |

以上で、ローカル環境でのシステム起動が完了します。