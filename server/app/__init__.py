from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

from app.config import Config
from app.extensions import bcrypt, cors, db, jwt, migrate


def create_app(config_class: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            return e
        # Log the full exception server-side (visible in the dev console/terminal),
        # but never leak internals (stack traces, DB connection strings, library
        # names) into the JSON response the frontend displays to end users.
        app.logger.exception(e)
        return jsonify({"error": "Something went wrong on our end. Please try again."}), 500

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)

    from app.models import SavedSession, User  # noqa: F401

    from app.routes.auth import auth_bp
    from app.routes.sessions import sessions_bp
    from app.routes.solver import solver_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(sessions_bp, url_prefix="/api/sessions")
    app.register_blueprint(solver_bp, url_prefix="/api/solver")

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
