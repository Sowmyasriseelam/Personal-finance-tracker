from django.conf import settings
from django.db import migrations, models
import django.core.validators
import django.db.models.deletion
import uuid
from decimal import Decimal


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('amount', models.DecimalField(
                    decimal_places=2,
                    max_digits=12,
                    validators=[django.core.validators.MinValueValidator(Decimal('0.01'))],
                )),
                ('category', models.CharField(
                    choices=[
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
                    ],
                    max_length=50,
                )),
                ('description', models.CharField(max_length=255)),
                ('date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('idempotency_key', models.CharField(blank=True, max_length=64, null=True)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='expenses',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'ordering': ['-date', '-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='expense',
            index=models.Index(fields=['user', '-date'], name='expenses_ex_user_id_date_idx'),
        ),
        migrations.AddIndex(
            model_name='expense',
            index=models.Index(fields=['user', 'category'], name='expenses_ex_user_id_cat_idx'),
        ),
        migrations.AddConstraint(
            model_name='expense',
            constraint=models.UniqueConstraint(
                condition=models.Q(idempotency_key__isnull=False),
                fields=['user', 'idempotency_key'],
                name='unique_expense_idempotency_key',
            ),
        ),
    ]
