from ..routes.auth import bp as auth_bp
from ..routes.events import bp as events_bp

def register_blueprints(app) -> None:
    app.register_blueprint(auth_bp)
    app.register_blueprint(events_bp)