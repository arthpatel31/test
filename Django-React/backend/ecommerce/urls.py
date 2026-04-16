from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)  
from api.views import itemsView
urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/v1/', include('api.urls')),
    # path('items/', include('items.urls')),

    path("api/v1/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/role/", itemsView, name="me"),

    path("api/v1/", include("api.urls")),  # your items routes

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
