from flask import Blueprint, jsonify, request, Response
from ..database import session
from .decorators import token_required
from ..models.Event import Event
from typing import Tuple


bp = Blueprint('events', __name__, url_prefix='/events')

@bp.route('/', methods=('GET',))
@token_required
def get(current_user) -> Tuple[Response, int]:
    id = request.args.get('id')

    if not id:
        events = session.query(Event).filter_by(user_id=current_user.id).all()
        return jsonify(events), 200

    event = session.query(Event).filter_by(id=id).first()

    return jsonify(event), 200

@bp.route('/new', methods=('POST',))
@token_required
def post(current_user) -> Tuple[Response, int]:
    title = request.form.get('title')
    description = request.form.get('description')
    date = request.form.get('date')
    time = request.form.get('time')
    location = request.form.get('location')
    max_attendees = request.form.get('max_attendees')

    if not any((
        title,
        description,
        date,
        time,
        location,
        max_attendees
    )):
        return jsonify("Not all fields were provided."), 400

    event = Event(
        title,
        current_user.id,
        description,
        date,
        time,
        location,
        max_attendees=int(max_attendees) if max_attendees else 1
    )

    session.add(event)
    session.commit()

    return jsonify("Event created."), 201

@bp.route('/<uuid:event_id>', methods=('PUT', 'DELETE'))
@token_required
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
