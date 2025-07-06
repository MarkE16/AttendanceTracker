from ..database import Base
from sqlalchemy import Column, UUID, String, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4
from dataclasses import dataclass

@dataclass
class Event(Base):
    __tablename__ = 'Event'

    id: str = Column(UUID(), primary_key=True, default=uuid4)
    user_id: str = Column(UUID(), ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    title: str = Column(String(), nullable=False)
    description: str = Column(String(200), nullable=False)
    date: str = Column(Date(), nullable=False)
    time: str = Column(String(5), nullable=False)
    location: str = Column(String(100), nullable=False)
    max_attendees: int = Column(Integer, default=1, nullable=False)
    
    user = relationship("User", back_populates="events")
    attendees = relationship("Attendee", back_populates="event")

    def __init__(
        self,
        title: str,
        user_id: UUID,
        description: str,
        date: str,
        time: str,
        location: str,
        max_attendees: int = 1
    ) -> None:
        self.title = title
        self.user_id = user_id
        self.description = description
        self.date = date
        self.time = time
        self.location = location
        self.max_attendees = max_attendees
