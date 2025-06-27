from ..database import Base
from sqlalchemy import Column, UUID, String, Integer
from uuid import uuid4

class Event(Base):
    __tablename__ = 'Event'

    id = Column(UUID(), primary_key=True, default=uuid4)
    title = Column(String(), nullable=False)

    def __init__(self, title: str) -> None:
        self.title = title