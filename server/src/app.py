from flask import Flask
# from flask_cors import CORS
from .utils import register_blueprints
from .database import init_db

app = Flask(__name__)
register_blueprints(app)
try:
    init_db()
except:
    raise RuntimeError("Couldn't connect to Postgres Database. Check to ensure it is running and credentials are valid.")

if __name__ == '__main__':
    # Start the app
    app.run(debug=True)
