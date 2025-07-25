import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session
from dotenv import load_dotenv

load_dotenv("../../.env")

PGUSER = os.environ['POSTGRES_USER']
PGPASS = os.environ['POSTGRES_PASSWORD']
PGDB = os.environ['POSTGRES_DB']
PG_HOST = os.environ['POSTGRES_HOST']
PG_PORT = os.environ['POSTGRES_PORT']

postgres_url = f'postgresql://{PGUSER}:{PGPASS}@{PG_HOST}:{PG_PORT}/{PGDB}'

Base = declarative_base()

engine = create_engine(postgres_url)
session = scoped_session(sessionmaker(bind=engine))

def init_db(app):
    from .models.Event import Event
    from .models.User import User
    from .models.Attendee import Attendee
    
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        session.remove()
    
    Base.metadata.create_all(engine)
