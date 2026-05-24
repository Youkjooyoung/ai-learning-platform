from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Learning API"
    environment: str = "local"
    database_url: str = "sqlite+aiosqlite:///./ai_learning.db"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = "change-this-local-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    ai_provider: str = "mock"
    openai_api_key: str | None = None
    openai_model: str = "gpt-5.2"
    web_origin: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

