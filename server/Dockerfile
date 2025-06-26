FROM python:3.12-slim AS base

# Set Poetry environment variables
ENV POETRY_HOME="/opt/poetry"
ENV POETRY_CACHE_DIR="/opt/poetry/.cache"
ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry to a specific location and add to PATH
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=$POETRY_HOME python3 -

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root --no-interaction --no-ansi

COPY . ./

# Configure Poetry to not create virtual environment (use system Python)
RUN poetry config virtualenvs.create false

# Reinstall dependencies without virtual environment
RUN poetry install --no-root --no-interaction --no-ansi

CMD ["poetry", "run", "python", "-m", "flask", "--app", "./src/app.py", "run", "--host", "0.0.0.0", "--port", "5000"]
