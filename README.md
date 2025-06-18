# DX Seed モジュラー統合プラットフォーム

## 概要 (Overview)

DX Seedは、学習管理(LMS)、人材マッチング、案件受託、報酬管理、雇用管理、生活支援の各機能をモジュールとして統合した、包括的な人材育成・雇用管理プラットフォームです。

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
  - **Redis**: キャッシュ、セッション管理

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

各サービスフォルダ（例: `auth-service/`）と `frontend/` フォルダに、`.env.example` があればそれをコピーして `.env` ファイルを作成し、必要な値を設定します。特にデータベースの接続情報やJWTのシークレットキーは重要です。

**ルートフォルダの `.env` (Docker Compose用)**
```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dx-seed-db

# JWT Secret
JWT_SECRET=YOUR_SUPER_SECRET_AND_LONG_KEY_FOR_JWT
ACCESS_TOKEN_SECRET=YOUR_SUPER_SECRET_AND_LONG_KEY_FOR_JWT
```

### 3. システム全体の起動

プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
docker-compose up --build
```
これにより、`docker-compose.yml` に定義された全てのサービス（データベース群、全バックエンドサービス、フロントエンド）がビルドされ、起動します。

### 4. データベースの初期化

システムを初めて起動した後、新しいターミナルを開き、以下のコマンドでデータベースのテーブルを作成します。

```bash
# いずれかのNode.jsサービスのコンテナ内でPrismaコマンドを実行
docker-compose exec lms-service npx prisma db push
```

### 5. 動作確認

- **フロントエンド**: `http://localhost:5173` にアクセスします。（ポート番号は`docker-compose.yml`の設定によります）
- **バックエンド (ヘルスチェック)**:
  - `http://localhost:3001/health` (認証サービス)
  - `http://localhost:3003/health` (LMSサービス)
  - `http://localhost:3004/` (マッチングサービス)
  - ...その他各サービスのヘルスチェックエンドポイント

以上で、ローカル環境でのシステム起動が完了します。
