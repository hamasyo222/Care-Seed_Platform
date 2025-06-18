from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Analytics Service"
    PROJECT_VERSION: str = "1.0.0"
    POSTGRES_URL: str = "postgresql://user:password@localhost/db"
    MONGO_URL: str = "mongodb://localhost:27017"
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
