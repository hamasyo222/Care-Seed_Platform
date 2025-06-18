from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routers

app = FastAPI(title="Support Service", version="1.0.0", openapi_url="/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(routers.router, prefix="/api/v1/support", tags=["support"])

@app.get("/")
def read_root():
    return {"status": "UP", "service": "Support Service"}
