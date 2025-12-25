"""add provider fields to users

Revision ID: 20251223
Revises: 9b3eb6a8d554
Create Date: 2025-12-23
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '20251223'
down_revision: Union[str, Sequence[str], None] = '9b3eb6a8d554'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "provider",
            sa.String(length=20),
            nullable=False,
            server_default="LOCAL"
        )
    )
    op.add_column(
        "users",
        sa.Column(
            "provider_id",
            sa.String(length=100),
            nullable=True
        )
    )


def downgrade() -> None:
    op.drop_column("users", "provider_id")
    op.drop_column("users", "provider")
