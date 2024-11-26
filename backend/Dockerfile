# Use a slim Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV APP_PORT=8000

# Set the working directory
WORKDIR /app

# Install system-level dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libmariadb-dev-compat \
    libmariadb-dev \
    libjpeg-dev \
    zlib1g-dev \
    libssl-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the application port
EXPOSE $APP_PORT

# Add a health check to ensure the container is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD curl -f http://localhost:$APP_PORT/ || exit 1

# Run the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
