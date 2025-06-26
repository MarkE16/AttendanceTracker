from ..routes.auth import bp as auth_bp

def register_blueprints(app) -> None:
    app.register_blueprint(auth_bp, url_prefix='/api')