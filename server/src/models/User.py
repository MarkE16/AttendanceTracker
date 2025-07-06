from ..database import Base
from sqlalchemy import Column, UUID, String, Integer
from sqlalchemy.orm import relationship
from uuid import uuid4
from dataclasses import dataclass

@dataclass
class User(Base):
    __tablename__ = 'User'

    id: str = Column(UUID(), primary_key=True, default=uuid4)
    name: str = Column(String())
    email: str = Column(String(), nullable=False, unique=True)
    password: str = Column(String(), nullable=False, unique=True)
    
    events = relationship("Event", back_populates="user")
    attendees = relationship("Attendee", back_populates="user")

    def __init__(self, name: str, email: str, password: str) -> None:
        self.name = name
        self.email = email
        self.password = password