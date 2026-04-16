from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Item
from api.serializers import ItemSerializer
from .permissions import IsAdminOrReadOnly

def items(request):
    return HttpResponse("Items endpoint")

class ItemViewSet(ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAdminOrReadOnly]