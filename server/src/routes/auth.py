import os
from flask import (
    Blueprint, Response, request, jsonify, redirect,
    make_response
)
from typing import Tuple

from ..routes.decorators import token_required

from ..models.User import User
from ..database import session
from bcrypt import hashpw, checkpw, gensalt
from datetime import timedelta, timezone, datetime

import jwt

bp = Blueprint('auth', __name__, url_prefix='/auth')
JWT_SECRET = os.environ['JWT_SECRET']
REFRESH_SECRET = os.environ['REFRESH_SECRET']

@bp.route('/signup', methods=('POST',))
def create_user() -> Tuple[Response, int]:
    email = request.form.get('email')
    password = request.form.get('password')
    name = request.form.get('name')

    if not name or not email or not password:
        return jsonify("name, email, and password are required."), 400

    existing_user = session.query(User).filter_by(email=email).first()

    if existing_user:
        return jsonify("User already exists."), 400

    bytes = password.encode('utf-8')

    hashed_pw = hashpw(bytes, gensalt())
    stored_hash = hashed_pw.decode('utf-8')
    user = User(name, email, stored_hash)

    session.add(user)
    session.commit()

    return jsonify("User created."), 201

@bp.route('/login', methods=('POST',))
def login() -> Tuple[Response, int]:
    email = request.form.get('email')
    password = request.form.get('password')

    user = session.query(User).filter_by(email=email).first()

    if not user or not checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify("Invalid email or password."), 401

    # Issue JWT.
    access_token = jwt.encode({ "id": str(user.id), "exp": datetime.now(timezone.utc) + timedelta(hours=1) }, JWT_SECRET, algorithm="HS256")

    # Issue refresh token.
    refresh_token = jwt.encode({ "id": str(user.id), "exp": datetime.now(timezone.utc) + timedelta(days=7) }, REFRESH_SECRET, algorithm="HS256")

    res = make_response({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })
    
    # In a real application, these cookies should be set with secure and same-site attributes.
    # However, as this is not a real application, but rather a learning exercise, these attributes are omitted for simplicity.
    # In production, the following lines would be:
    # res.set_cookie('at-access-token', access_token, httponly=True, secure=True, samesite='Strict')
    # res.set_cookie('at-refresh-token', refresh_token, httponly=True, secure=True, samesite='Strict')
    res.set_cookie('at-access-token', access_token, httponly=True)
    res.set_cookie('at-refresh-token', refresh_token, httponly=True)

    return res

@bp.route('/refresh', methods=('POST',))
def refresh() -> Tuple[Response, int]:
    refresh_token = request.cookies.get('at-refresh-token')

    if not refresh_token:
        return jsonify("Refresh token not provided."), 401

    try:
        data = jwt.decode(refresh_token, REFRESH_SECRET, algorithms=["HS256"])
    except:
        return jsonify("Invalid refresh token."), 401

    user_id = data.get('id')
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify("User not found."), 401

    # Issue new access token.
    access_token = jwt.encode({ "id": str(user.id), "exp": datetime.now(timezone.utc) + timedelta(hours=1) }, JWT_SECRET, algorithm="HS256")

    # Issue new refresh token.
    new_refresh_token = jwt.encode({ "id": str(user.id), "exp": datetime.now(timezone.utc) + timedelta(days=7) }, REFRESH_SECRET, algorithm="HS256")

    res = make_response({
        "id": user.id,
        "name": user.name,
        "email": user.email
    })

    res.set_cookie('at-access-token', access_token, httponly=True)
    res.set_cookie('at-refresh-token', new_refresh_token, httponly=True)
    return res

@bp.route('/logout', methods=('GET',))
def logout() -> Tuple[Response, int]:
    res = make_response()
    res.set_cookie('at-access-token', "", expires=0)
    res.set_cookie('at-refresh-token', "", expires=0)

    return res

@bp.route('/me', methods=('GET',))
@token_required
def me(current_user) -> Tuple[Response, int]:
    user_data = {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email
    }

    return jsonify(user_data), 200
