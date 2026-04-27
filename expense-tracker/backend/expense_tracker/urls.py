from django.urls import path, include

urlpatterns = [
    path('api/auth/', include('expenses.auth_urls')),
    path('api/', include('expenses.urls')),
]
