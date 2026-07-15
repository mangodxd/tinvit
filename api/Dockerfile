FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install --no-cache-dir .

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.news_engine.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
