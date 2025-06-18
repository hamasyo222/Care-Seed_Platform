from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import matching

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION, openapi_url="/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(matching.router, prefix="/api/v1/matching", tags=["matching"])

@app.get("/")
def read_root():
    return {"status": "UP", "service": "Matching Service"}
