from flask import Blueprint, jsonify, request, Response
from src.models.Attendee import Attendee
from ..database import session
from .decorators import token_required
from ..models.Event import Event
from sqlalchemy import func
from typing import Tuple


bp = Blueprint('events', __name__, url_prefix='/events')

@bp.route('/', methods=('GET',))
@token_required
def get_all(current_user) -> Tuple[Response, int]:
    events = session.query(
        Event,
        func.count(Event.attendees).label('attendee_count')
    ).filter_by(
        user_id=current_user.id
    ).outerjoin(
    Attendee, Event.id == Attendee.event_id
    ).group_by(
        Event
    ).all()

    result = [
        {
            'id': str(event.id),
            'user_id': str(event.user_id),
            'title': event.title,
            'description': event.description,
            'date': event.date,
            'time': event.time,
            'location': event.location,
            'max_attendees': event.max_attendees,
            'attendee_count': attendee_count
        }
        for event, attendee_count in events
    ]
    return jsonify(result), 200

@bp.route('/<uuid:event_id>', methods=('GET',))
def get(event_id: str) -> Tuple[Response, int]:
    event = session.query(
        Event,
        func.count(Attendee.id).label('attendee_count')
    ).filter(Event.id == event_id).outerjoin(
        Attendee, Event.id == Attendee.event_id
    ).group_by(
        Event
    ).first()

    if not event:
        return jsonify("Event not found."), 404

    ev, attendee_count = event
    result = {
        'id': str(ev.id),
        'user_id': str(ev.user_id),
        'title': ev.title,
        'description': ev.description,
        'date': ev.date,
        'time': ev.time,
        'location': ev.location,
        'max_attendees': ev.max_attendees,
        'attendee_count': attendee_count
    }


    return jsonify(result), 200

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

@bp.route('/attendance/<uuid:event_id>', methods=('GET',))
@token_required
def get_attendance(event_id: str, current_user) -> Tuple[Response, int]:
    # For now, we will return the user IDs of attendees.
    # In the future, we may want to return more information about each attendee.
    attendee_ids = session.query(Attendee.user_id).filter(
        Attendee.event_id == event_id
    ).all()

    attendee_ids = [str(attendee_id[0]) for attendee_id in attendee_ids]

    return jsonify(attendee_ids), 200

@bp.route('/rsvp/<uuid:event_id>', methods=('POST',))
@token_required
def rsvp(event_id: str, current_user) -> Tuple[Response, int]:
    max_attendees = session.query(Event.max_attendees).filter(
        Event.id == event_id
    ).scalar()
    if max_attendees is None:
        return jsonify("Event not found."), 404

    current_attendees = session.query(Attendee).filter(
        Attendee.event_id == event_id
    ).all()

    if current_user.id not in set([
        attendee.user_id for attendee in current_attendees
    ]):
        if len(current_attendees) >= max_attendees:
            return jsonify("Event is full."), 400

        attendee = Attendee(
            user_id=current_user.id,
            event_id=event_id
        )
        session.add(attendee)
    else:
        session.query(Attendee).filter(
            Attendee.user_id == current_user.id,
            Attendee.event_id == event_id
        ).delete()

    session.commit()

    return jsonify("RSVP updated."), 200
