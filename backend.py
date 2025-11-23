# Written by Hung Pham
# CSE302 - Video Game Sales Project

# Prior to local execution:
# Run the following in cmd: pip install flask flask-cors mysql-connector-python
# Run the contents of ETL_Query.txt in MySQL (make sure you have RawData.csv).

# imports
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
# os not necessary if locally hosting

# create flask app
app = Flask(__name__)
CORS(app)

# database (remove os.getenv() entirely if you are not using Railway.app, localhost runs fine with just "DB_HOST")
def db():
#    return mysql.connector.connect(
#        host="ballast.proxy.rlwy.net",
#        user="root",
#        password="password",
#        database="db",
#        port=33186
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT"))
    )
    
# get platform
@app.route("/platforms")
def get_platforms():
    """
    Returns list of platform names for TomSelect autocomplete.
    """
    conn = db()
    cur = conn.cursor()

    cur.execute("SELECT name FROM Platforms ORDER BY name;")
    platforms = [row[0] for row in cur.fetchall()]

    cur.close()
    conn.close()

    return jsonify(platforms)
    
# get sales
@app.route("/sales")
def get_sales():
    """
    Returns top-selling games filtered by:
      - region
      - platform name
      - genre name
    """
    region = request.args.get("region")
    platform = request.args.get("platform")
    genre = request.args.get("genre")

    conn = db()
    cur = conn.cursor(dictionary=True)

    # sql select
    sql = """
        SELECT 
            g.name AS name,
            SUM(s.salesValue) AS salesValue
        FROM Sales s
        JOIN Games g ON s.gameID = g.gameID
        JOIN Platforms p ON g.platformID = p.platformID
        JOIN Genres ge ON g.genreID = ge.genreID
        WHERE 1 = 1
    """

    # WHERE 1 = 1 AND following conditions
    params = {}

    if region:
        sql += " AND s.region = %(region)s"
        params["region"] = region

    if platform:
        sql += " AND p.name = %(platform)s"
        params["platform"] = platform

    if genre:
        sql += " AND ge.name = %(genre)s"
        params["genre"] = genre

    # group
    sql += """
        GROUP BY g.gameID
        ORDER BY salesValue DESC
        LIMIT 20;
    """

    cur.execute(sql, params)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify(rows)

# test

@app.route("/")
def home():
    return "Backend is running!"

# main (uncomment if localhost)
#if __name__ == "__main__":
#    app.run(host="0.0.0.0", port=5000, debug=True)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


