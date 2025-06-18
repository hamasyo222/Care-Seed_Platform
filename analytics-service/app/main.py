from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import analytics

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION, openapi_url="/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"status": "UP", "service": "Analytics Service"}
