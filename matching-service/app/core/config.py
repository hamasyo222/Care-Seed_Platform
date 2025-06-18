from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Matching Service"
    PROJECT_VERSION: str = "1.0.0"
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/db"
    ELASTICSEARCH_HOST: str = "http://localhost:9200"
    JWT_SECRET: str = "your-super-secret-access-key"
    JWT_ALGORITHM: str = "HS256"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
