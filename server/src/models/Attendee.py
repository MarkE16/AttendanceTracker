from ..database import Base
from sqlalchemy import Column, UUID, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4
from dataclasses import dataclass
from datetime import datetime, timezone

@dataclass
class Attendee(Base):
    __tablename__ = 'Attendee'

    id: str = Column(UUID(), primary_key=True, default=uuid4)
    user_id: str = Column(UUID(), ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    event_id: str = Column(UUID(), ForeignKey('Event.id', ondelete='CASCADE'), nullable=False)
    rsvp_at: str = Column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="attendees")
    event = relationship("Event", back_populates="attendees")
    
    def __init__(
        self,
        user_id: str,
        event_id: str,
    ) -> None:
        self.user_id = user_id
        self.event_id = event_id
