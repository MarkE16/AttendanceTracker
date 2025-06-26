from flask import Flask
# from flask_cors import CORS
from .utils import register_blueprints

app = Flask(__name__)

if __name__ == '__main__':
    # Start the app
    register_blueprints(app)

    app.run(debug=True)
