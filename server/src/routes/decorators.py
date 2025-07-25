from functools import wraps
from flask import request, jsonify
from ..models.User import User
from ..database import session

import os
import jwt

JWT_SECRET = os.environ['JWT_SECRET']

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('at-access-token')

        if not token:
            return jsonify("Token does not exist."), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

            user = session.query(User).filter_by(id=data['id']).first()
        except:
            return jsonify("Token is invalid."), 401

        if not user:
            return jsonify("User not found."), 401

        return f(*args, current_user=user, **kwargs)

    return decorated
