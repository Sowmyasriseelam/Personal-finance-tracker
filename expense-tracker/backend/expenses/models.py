import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal


class Expense(models.Model):
    """
    Represents a single expense entry belonging to a user.

    Amount is stored as DECIMAL(12, 2) — never float — to avoid
    floating-point rounding errors with monetary values.

    idempotency_key: a client-supplied UUID stored per (user, key) pair.
    If a client retries the same request with the same key, the server
    returns the existing record instead of creating a duplicate.
    """

    CATEGORY_CHOICES = [
        ('food', 'Food & Dining'),
        ('transport', 'Transport'),
        ('housing', 'Housing'),
        ('entertainment', 'Entertainment'),
        ('health', 'Health & Medical'),
        ('shopping', 'Shopping'),
        ('utilities', 'Utilities'),
        ('education', 'Education'),
        ('travel', 'Travel'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=255)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    idempotency_key = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        ordering = ['-date', '-created_at']
        # Enforce uniqueness of idempotency_key per user (nulls are excluded
        # from unique constraints in PostgreSQL, which is the desired behavior).
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'idempotency_key'],
                name='unique_expense_idempotency_key',
                condition=models.Q(idempotency_key__isnull=False),
            )
        ]
        indexes = [
            models.Index(fields=['user', '-date']),
            models.Index(fields=['user', 'category']),
        ]

    def __str__(self):
        return f"{self.user.username} — {self.category} ₹{self.amount} on {self.date}"
