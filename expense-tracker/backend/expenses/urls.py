from django.urls import path
from .views import ExpenseListCreateView, CategorySummaryView

urlpatterns = [
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/summary/', CategorySummaryView.as_view(), name='expense-summary'),
]
