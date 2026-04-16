from . import views
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # path('items/', views.itemsView),
    path('items/', views.Items.as_view()),
    path('items/<int:pk>/', views.ItemDetail.as_view())
]
