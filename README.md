CSE335 group project on video game sales.

## For running locally:

### 1. Run the ETL
Start by opening MySQL server:
When attempting to populate RawData, first replace "GET UR OWN FILE DIRECTORY" with your local filepath to RawData.csv. If that doesn't work, try, in this order:
- Run `SHOW VARIABLES LIKE 'secure_file_priv';` in MySQL to find secure_file_priv uploads folder (and drop in RawData.csv)
- Use Table Data Import Wizard to import data for ETL to run.
If data import initially fails, run only the script afterwards again, starting from `INSERT INTO Platforms (name)`.

### 2. Deploy the backend.

Start by installing Python, and running `Run the following in cmd: pip install flask flask-cors mysql-connector-python` in cmd.
Replace the database information with your server: `python backend.py`
After this step, your command prompt should tell you something along the lines of "Running on http://127.0.0.1:5000/", you may plug this (or localhost:5000) into your broser to see if you receive json data.

### 3. Run your frontend

Replace `const api = "http://127.0.0.1/";` with wherever your backend is deployed (we are using Railway.app) and host onto page of your choice (we are using Github Pages).
