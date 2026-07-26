import uuid
from datetime import datetime, timezone

from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.extensions import db

ALGORITHM_CHOICES = (
    "bubble_sort", "quick_sort", "merge_sort",
    "insertion_sort", "selection_sort",
    "linear_search", "binary_search",
    "bfs", "dfs", "dijkstra", "floyd_warshall",
    "pathfinding_grid",
)


class SavedSession(db.Model):
    __tablename__ = "saved_sessions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    algorithm = db.Column(db.String(50), nullable=False, index=True)
    title = db.Column(db.String(120))
    input_data = db.Column(JSONB, nullable=False, default=dict)
    settings = db.Column(JSONB, nullable=False, default=dict)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        db.CheckConstraint(f"algorithm IN {ALGORITHM_CHOICES}", name="ck_saved_sessions_algorithm"),
    )

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "algorithm": self.algorithm,
            "title": self.title,
            "input_data": self.input_data,
            "settings": self.settings,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
