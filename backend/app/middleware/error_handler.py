
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("bliss_mind")


def configure_error_handling(app: FastAPI) -> None:
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled request error at %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected server error occurred"},
        )
