from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.session import ALGORITHM_CHOICES, SavedSession

sessions_bp = Blueprint("sessions", __name__)


@sessions_bp.get("")
@jwt_required()
def list_sessions():
    user_id = get_jwt_identity()
    algorithm = request.args.get("algorithm")

    query = SavedSession.query.filter_by(user_id=user_id)
    if algorithm:
        query = query.filter_by(algorithm=algorithm)

    sessions = query.order_by(SavedSession.updated_at.desc()).all()
    return jsonify([s.to_dict() for s in sessions])


@sessions_bp.post("")
@jwt_required()
def create_session():
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    algorithm = data.get("algorithm")
    if algorithm not in ALGORITHM_CHOICES:
        return jsonify({"error": f"algorithm must be one of {ALGORITHM_CHOICES}"}), 400

    session = SavedSession(
        user_id=user_id,
        algorithm=algorithm,
        title=data.get("title"),
        input_data=data.get("input_data") or {},
        settings=data.get("settings") or {},
    )
    db.session.add(session)
    db.session.commit()
    return jsonify(session.to_dict()), 201


@sessions_bp.get("/<uuid:session_id>")
@jwt_required()
def get_session(session_id):
    user_id = get_jwt_identity()
    session = SavedSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "not found"}), 404
    return jsonify(session.to_dict())


@sessions_bp.put("/<uuid:session_id>")
@jwt_required()
def update_session(session_id):
    user_id = get_jwt_identity()
    session = SavedSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in ("title", "input_data", "settings"):
        if field in data:
            setattr(session, field, data[field])

    db.session.commit()
    return jsonify(session.to_dict())


@sessions_bp.delete("/<uuid:session_id>")
@jwt_required()
def delete_session(session_id):
    user_id = get_jwt_identity()
    session = SavedSession.query.filter_by(id=session_id, user_id=user_id).first()
    if not session:
        return jsonify({"error": "not found"}), 404

    db.session.delete(session)
    db.session.commit()
    return "", 204
