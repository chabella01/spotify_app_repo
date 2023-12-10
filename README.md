## Instructions
####  To run frontend
    cd spotify_web_app_frontend
    npm i 
    npm run start
Front end run on http://localhost:3000/
#### To run backend
     cd spotify_app_backend/spotify_backend 
     pip3 install -r requirments.txt
     python3 manage.py runserver
Server runs on http://127.0.0.1:8000/

### IMPORTANT
#### To run the socket server you must run the following command for it to work
    docker run --rm -p 6379:6379 redis:7  