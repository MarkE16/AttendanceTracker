from flask import Flask
from flask_cors import CORS
from .utils import register_blueprints
from .database import init_db
import os

app = Flask(__name__)

# in a real app, this should be more restrictive.
FRONTEND_URL = os.environ.get('APP_FRONTEND_URL', 'http://localhost:3000')
CORS(app, resources={r'/*': { "origins": FRONTEND_URL } }, supports_credentials=True)
register_blueprints(app)
try:
    init_db(app)
except Exception as e:
    raise RuntimeError("Couldn't connect to Postgres Database. Reason: " + str(e))



if __name__ == '__main__':
    # Start the app
    app.run(debug=True)
