from django.db import IntegrityError
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Expense
from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ExpenseSerializer,
)


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — create a new user account."""
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'username': user.username, 'message': 'Account created successfully.'},
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """POST /api/auth/login/ — returns access + refresh tokens with username."""
    serializer_class = CustomTokenObtainPairSerializer


class ExpenseListCreateView(APIView):
    """
    GET  /api/expenses/  — list expenses for the authenticated user
    POST /api/expenses/  — create a new expense (idempotent via idempotency_key)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Expense.objects.filter(user=request.user)

        # Optional filter by category
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # Optional sort — default is already newest-first per Meta.ordering
        sort = request.query_params.get('sort')
        if sort == 'date_asc':
            queryset = queryset.order_by('date', 'created_at')
        else:
            # date_desc or unspecified → newest first
            queryset = queryset.order_by('-date', '-created_at')

        serializer = ExpenseSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        idempotency_key = serializer.validated_data.get('idempotency_key')

        # ── Idempotency check ──────────────────────────────────────────────────
        # If the client sends a key we've already seen for this user,
        # return the existing record (HTTP 200) instead of creating a duplicate.
        if idempotency_key:
            existing = Expense.objects.filter(
                user=request.user,
                idempotency_key=idempotency_key,
            ).first()
            if existing:
                return Response(
                    ExpenseSerializer(existing).data,
                    status=status.HTTP_200_OK,
                )

        try:
            expense = serializer.save(user=request.user)
        except IntegrityError:
            # Race condition: two concurrent requests with same idempotency_key
            existing = Expense.objects.filter(
                user=request.user,
                idempotency_key=idempotency_key,
            ).first()
            if existing:
                return Response(
                    ExpenseSerializer(existing).data,
                    status=status.HTTP_200_OK,
                )
            return Response(
                {'detail': 'Could not create expense. Please try again.'},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(ExpenseSerializer(expense).data, status=status.HTTP_201_CREATED)


class CategorySummaryView(APIView):
    """GET /api/expenses/summary/ — totals grouped by category."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Sum
        from decimal import Decimal

        queryset = Expense.objects.filter(user=request.user)
        category = request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        summary = (
            queryset
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        # Build a nice label map
        label_map = dict(Expense.CATEGORY_CHOICES)
        result = [
            {
                'category': item['category'],
                'label': label_map.get(item['category'], item['category']),
                'total': str(item['total'] or Decimal('0.00')),
            }
            for item in summary
        ]
        return Response(result)
