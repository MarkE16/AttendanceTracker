from flask import Blueprint, jsonify, request, Response
from ..database import session
from ..models.Event import Event
from typing import Tuple


bp = Blueprint('events', __name__, url_prefix='/events')

@bp.route('/', methods=('GET',))
def get() -> Tuple[Response, int]:
    return jsonify(session.query(Event).all()), 200

@bp.route('/new', methods=('POST',))
def post() -> Tuple[Response, int]:
    title = request.form.get('title')

    if not title:
        return jsonify("Title not provided."), 400

    event = Event(title)

    session.add(event)
    session.commit()

    return jsonify("Event created."), 201

@bp.route('/<uuid:event_id>', methods=('PUT', 'DELETE'))
def put(event_id: str) -> Tuple[Response, int]:
    title = request.form.get('title')

    if not title and request.method != 'PUT':
        return jsonify("Title not provided."), 400

    if request.method == 'DELETE':
        session.query(Event).filter(Event.id == event_id).delete()
    else:
        event = session.query(Event).filter(Event.id == event_id).first()
        
        if not event:
            return jsonify("Event not found."), 404
        
        event.title = title
    session.commit()

    message = "Event updated." if request.method == "PUT" else "Event deleted."

    return jsonify(message), 200
