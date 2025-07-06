FROM python:3.12-slim AS base

# Set Poetry environment variables
ENV POETRY_HOME="/opt/poetry"
ENV POETRY_CACHE_DIR="/opt/poetry/.cache"
ENV PATH="$POETRY_HOME/bin:$PATH"
ARG APP_FRONTEND_URL=http://localhost:3000
ENV APP_FRONTEND_URL=$APP_FRONTEND_URL

# Install cURL, build-essential, and PostgreSQL client to work
# with Poetry and other dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl build-essential postgresql postgresql-contrib libpq-dev python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry to a specific location and add to PATH
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=$POETRY_HOME POETRY_VERSION=1.7.1 python3 -

WORKDIR /app

COPY pyproject.toml poetry.lock ./

# Configure Poetry to not create virtual environment (use system Python)
# and install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi

COPY . ./

EXPOSE 5000
CMD ["poetry", "run", "flask", "--app", "./src/app.py", "run", "--host", "0.0.0.0", "--port", "5000"]
