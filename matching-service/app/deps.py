from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from app.core.config import settings

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

class AuthenticatedUser(BaseModel):
    user_id: str


def get_current_user(token: str = Depends(reusable_oauth2)) -> AuthenticatedUser:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user = AuthenticatedUser(user_id=payload.get("userId"))
        if user.user_id is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials: user ID missing.")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate credentials: invalid token.")
