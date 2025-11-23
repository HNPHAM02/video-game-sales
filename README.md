CSE335 group project on video game sales.

https://hnpham02.github.io/video-game-sales/

BACKEND will only be running for 30 days after 11/23/2025, during my trial period of Railway.app.

## For running locally:

### 1. Run the ETL
Start by opening MySQL server:
When attempting to populate RawData, first replace "GET UR OWN FILE DIRECTORY" with your local filepath to RawData.csv. If that doesn't work, try, in this order:
- Run `SHOW VARIABLES LIKE 'secure_file_priv';` in MySQL to find secure_file_priv uploads folder (and drop in RawData.csv)
- Use Table Data Import Wizard to import data for ETL to run.
If data import initially fails, run only the script afterwards again, starting from `INSERT INTO Platforms (name)`.

If you are running om something like Railway.app, after running the ETL locally, export the DB: MySQL Workbench → Server → Data Export → SQL File and import it.

### 2. Deploy the backend.

Start by installing Python, and running `Run the following in cmd: pip install flask flask-cors mysql-connector-python` in cmd.
Replace the database information with your server: `python backend.py`
After this step, your command prompt should tell you something along the lines of `Running on http://127.0.0.1:5000/`, you may plug this (or localhost:5000) into your browser to see if you receive json data, something like `http://localhost:5000/sales` should work.

### 3. Run your frontend

Replace `const api = "http://127.0.0.1/";` with wherever your backend is deployed (we are using Railway.app) and host onto page of your choice (we are using Github Pages).
