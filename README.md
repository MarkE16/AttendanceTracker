# AttendanceTracker

This repository the implementation of AttendanceTracker, a web application designed to manage attendance data for events. The application consists of a frontend built with React and a backend server built with Python and Flask. This small project is intended as a practice project to enhance skills in web development, RESTful APIs, and database management.

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker, Docker Compose

## How to Run

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed on your machine.
- Basic knowledge of Docker and Docker Compose.

### Steps to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/MarkE16/AttendanceTracker.git
   ```
2. Navigate to the project directory:
    ```bash
    cd AttendanceTracker
    ```
3. Create a `.env` file in the root directory with the following content:
    ```env
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    POSTGRES_DB=your_db_name
    POSTGRES_HOST=db
    POSTGRES_PORT=5432
    JWT_SECRET=your_jwt_secret_key
    REFRESH_SECRET=your_refresh_secret_key
    ```
  Replace `your_db_user`, `your_db_password`, `your_db_name`, `your_jwt_secret_key`, and `your_refresh_secret_key` with your desired values.

4. Start the application using Docker Compose:
    ```bash
    docker compose up --build -d
    ```
5. Access the application:
    - Frontend: Open your web browser and go to `http://localhost:3000`
    - Backend: The backend server will be running at `http://localhost:5000`
6. To stop the application, run:
    ```bash
    docker compose down
    ```
