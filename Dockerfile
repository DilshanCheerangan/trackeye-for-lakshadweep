FROM python:3.11-slim

# Install system dependencies required for OpenCV and PostgreSQL client compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements file and install python packages
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code to the app container
COPY backend/ /app/backend/

# Expose the default port
EXPOSE 8000

# Start command: runs uvicorn using the PORT env variable if present, defaulting to 8000
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
