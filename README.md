# React/Django Chatroom Music Control App

This project allows users to create chatrooms and control the music within those chatrooms. The frontend is built with React, while the backend is powered by Django.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Backend](#running-the-backend)
  - [Running the Socket Server](#running-the-socket-server)
- [Important Links](#important-links)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd spotify_web_app_frontend
    ```
2. Install the dependencies:
    ```bash
    npm i
    ```

### Backend

1. Navigate to the backend directory:
    ```bash
    cd spotify_app_backend/spotify_backend
    ```
2. Install the dependencies:
    ```bash
    pip3 install -r requirements.txt
    ```

## Running the Application

### Running the Frontend

1. Navigate to the frontend directory:
    ```bash
    cd spotify_web_app_frontend
    ```
2. Start the frontend server:
    ```bash
    npm run start
    ```
3. The frontend runs on `http://localhost:3000/`

### Running the Backend

1. Navigate to the backend directory:
    ```bash
    cd spotify_app_backend/spotify_backend
    ```
2. Start the backend server:
    ```bash
    python3 manage.py runserver
    ```
3. The server runs on `http://127.0.0.1:8000/`

### Running the Socket Server

To run the socket server, execute the following command:
```bash
docker run --rm -p 6379:6379 redis:7
